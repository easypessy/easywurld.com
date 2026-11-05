import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import Busboy from "busboy";
import type { Request } from "express";
import { config } from "../config.ts";
import { all, get, nextSequence, nowIso, pad, run } from "../db/db.ts";
import { badRequest, forbidden, notFound } from "../lib/errors.ts";
import type { SessionUser } from "../auth.ts";
import { localProjectDir, type FolderCode } from "./storage.ts";
import { logEvent } from "./automation.ts";

/**
 * Upload validation is deliberately strict: an allowlist of extensions and MIME
 * types, a hard size cap, server-generated filenames, and a per-project
 * directory the caller cannot influence.
 */

const ALLOWED_EXTENSIONS = new Set([
  ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".txt", ".md", ".csv",
  ".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".heic", ".mp4", ".mov", ".mp3", ".wav", ".zip",
]);

const ALLOWED_MIME_PREFIXES = ["image/", "video/", "audio/", "text/"];
const ALLOWED_MIME_EXACT = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/zip",
  "application/x-zip-compressed",
  "application/octet-stream",
]);

export function validateUpload(name: string, mime: string, size: number): string | null {
  const ext = path.extname(name).toLowerCase();
  if (!name || name.length > 200) return "That filename is not usable.";
  if (!ALLOWED_EXTENSIONS.has(ext)) return `Files of type ${ext || "(none)"} are not accepted.`;
  if (size <= 0) return "The file is empty.";
  if (size > config.limits.maxUploadBytes) {
    return `Maximum file size is ${Math.round(config.limits.maxUploadBytes / 1024 / 1024)} MB. Use a Drive or Dropbox link for larger media.`;
  }
  const okMime = ALLOWED_MIME_PREFIXES.some((p) => mime.startsWith(p)) || ALLOWED_MIME_EXACT.has(mime);
  if (!okMime) return `The reported file type (${mime || "unknown"}) is not accepted.`;
  return null;
}

export interface UploadOutcome {
  id: string;
  originalName: string;
  size: number;
  visibility: string;
}

/** Streams one file from a multipart request into the project workspace. */
export async function receiveUpload(
  req: Request,
  args: { projectId: string; clientId: string; projectTitle: string; clientName: string; actor: SessionUser; folderCode: FolderCode; visibility: "internal" | "client"; deliverableId?: string },
): Promise<UploadOutcome> {
  const dir = localProjectDir(args.clientId, args.clientName, args.projectId, args.projectTitle, args.folderCode);
  fs.mkdirSync(dir, { recursive: true });
  const fileId = `EW-F-${pad(nextSequence("file_seq"))}`;

  return new Promise<UploadOutcome>((resolve, reject) => {
    let settled = false;
    const succeed = (value: UploadOutcome) => {
      if (settled) return;
      settled = true;
      resolve(value);
    };
    const fail = (err: Error) => {
      if (settled) return;
      settled = true;
      reject(err);
    };

    let busboy: ReturnType<typeof Busboy>;
    try {
      busboy = Busboy({
        headers: req.headers,
        limits: { fileSize: config.limits.maxUploadBytes, files: 1, fields: 10 },
      });
    } catch {
      return fail(badRequest("Expected a multipart file upload"));
    }

    let sawFile = false;

    busboy.on("file", (_field, file, info) => {
      sawFile = true;
      const original = path.basename(info.filename || "upload");
      const ext = path.extname(original).toLowerCase();
      const storedName = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`;
      const target = path.join(dir, storedName);
      const hash = crypto.createHash("sha256");
      let size = 0;
      let aborted = false;
      let handled = false;

      const write = fs.createWriteStream(target, { mode: 0o640 });

      file.on("data", (chunk: Buffer) => {
        size += chunk.length;
        hash.update(chunk);
      });

      file.on("limit", () => {
        aborted = true;
        write.destroy();
        fs.rm(target, { force: true }, () => undefined);
        fail(
          badRequest(
            `Maximum file size is ${Math.round(config.limits.maxUploadBytes / 1024 / 1024)} MB. Use a Drive or Dropbox link for larger media.`,
          ),
        );
      });

      file.on("error", (err: Error) => fail(badRequest(err.message)));

      write.on("error", (err: Error) => fail(badRequest(`Could not save the file: ${err.message}`)));

      write.on("finish", () => {
        if (handled || aborted || settled) return;
        handled = true;
        const problem = validateUpload(original, info.mimeType || "", size);
        if (problem) {
          fs.rm(target, { force: true }, () => undefined);
          return fail(badRequest(problem));
        }
        run(
          `INSERT INTO files (id, project_id, client_id, deliverable_id, folder_code, original_name, stored_name,
             mime, size, visibility, uploaded_by, uploader_role, checksum, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          fileId,
          args.projectId,
          args.clientId,
          args.deliverableId ?? null,
          args.folderCode,
          original,
          storedName,
          info.mimeType || "application/octet-stream",
          size,
          args.visibility,
          args.actor.id,
          args.actor.role,
          hash.digest("hex"),
          nowIso(),
        );
        logEvent({
          event: "file.uploaded",
          status: "success",
          clientId: args.clientId,
          projectId: args.projectId,
          detail: { fileId, name: original, size, folder: args.folderCode, visibility: args.visibility },
        });
        succeed({ id: fileId, originalName: original, size, visibility: args.visibility });
      });

      file.pipe(write);
    });

    busboy.on("error", () => fail(badRequest("The upload could not be read")));
    busboy.on("close", () => {
      if (!sawFile) fail(badRequest("No file was received"));
    });

    req.pipe(busboy);
  });
}

export function fileRecord(fileId: string) {
  return get<Record<string, any>>("SELECT * FROM files WHERE id = ?", fileId);
}

export function resolveFilePath(file: Record<string, any>): string {
  const project = get<Record<string, any>>("SELECT * FROM projects WHERE id = ?", file.project_id);
  if (!project) throw notFound("Project not found");
  const client = get<Record<string, any>>("SELECT * FROM clients WHERE id = ?", file.client_id);
  if (!client) throw notFound("Client not found");
  if (!project.workspace_path) throw notFound("This file has no workspace yet");

  // Reconstruct the path from trusted database values only.
  const dir = path.join(
    project.workspace_path,
    file.folder_code === "01" ? "01 - Onboarding"
      : file.folder_code === "02" ? "02 - Client Materials"
      : file.folder_code === "04" ? "04 - Review and Approvals"
      : file.folder_code === "05" ? "05 - Final Deliverables"
      : file.folder_code === "06" ? "06 - Archive"
      : "03 - Working Files",
  );
  const resolved = path.resolve(dir, path.basename(String(file.stored_name)));
  const root = path.resolve(config.storageDir);
  if (!resolved.startsWith(root + path.sep)) throw forbidden("Invalid file path");
  return resolved;
}

/** Authorisation: admin sees everything; a client sees only their own client-visible files. */
export function authoriseFile(file: Record<string, any>, user: SessionUser, clientId?: string): void {
  if (user.role === "admin") return;
  if (!clientId || file.client_id !== clientId) throw forbidden("That file belongs to another workspace");
  if (file.visibility !== "client") throw forbidden("That file is internal");
}

export function projectFileList(projectId: string, clientView: boolean) {
  return all(
    `SELECT id, folder_code, original_name, mime, size, visibility, created_at, deliverable_id FROM files
     WHERE project_id = ? ${clientView ? "AND visibility = 'client'" : ""} ORDER BY created_at DESC`,
    projectId,
  );
}
