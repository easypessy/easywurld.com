import fs from "node:fs";
import path from "node:path";
import { config } from "../config.ts";
import { nowIso, run } from "../db/db.ts";
import { slugify } from "../lib/errors.ts";
import { logEvent } from "./automation.ts";

/**
 * Workspace storage. One interface, three backends:
 *   local   — disk (default, always available)
 *   gdrive  — Google Drive via REST (needs an OAuth access token + root folder)
 *   dropbox — Dropbox via REST (needs an access token)
 * A backend failure never blocks project creation: it is logged and retried.
 */

export const WORKSPACE_FOLDERS = [
  "01 - Onboarding",
  "02 - Client Materials",
  "03 - Working Files",
  "04 - Review and Approvals",
  "05 - Final Deliverables",
  "06 - Archive",
] as const;

export type FolderCode = "01" | "02" | "03" | "04" | "05" | "06";

export const FOLDER_BY_CODE: Record<FolderCode, string> = {
  "01": "01 - Onboarding",
  "02": "02 - Client Materials",
  "03": "03 - Working Files",
  "04": "04 - Review and Approvals",
  "05": "05 - Final Deliverables",
  "06": "06 - Archive",
};

export function clientFolderName(clientId: string, clientName: string): string {
  return `${slugify(clientId).toUpperCase()} - ${clientName.replace(/[\\/:*?"<>|]/g, "").trim()}`.slice(0, 90);
}

export function projectFolderName(projectId: string, projectTitle: string): string {
  return `${projectId} - ${projectTitle.replace(/[\\/:*?"<>|]/g, "").trim()}`.slice(0, 110);
}

/* ------------------------------- local ---------------------------------- */

export function localClientDir(clientId: string, clientName: string): string {
  return path.join(config.storageDir, "EASYWURLD CLIENTS", clientFolderName(clientId, clientName));
}

export function localProjectDir(clientId: string, clientName: string, projectId: string, projectTitle: string, code?: FolderCode): string {
  const base = path.join(localClientDir(clientId, clientName), projectFolderName(projectId, projectTitle));
  return code ? path.join(base, FOLDER_BY_CODE[code]) : base;
}

export function createLocalWorkspace(args: {
  clientId: string;
  clientName: string;
  projectId: string;
  projectTitle: string;
}): string {
  const base = localProjectDir(args.clientId, args.clientName, args.projectId, args.projectTitle);
  for (const folder of WORKSPACE_FOLDERS) fs.mkdirSync(path.join(base, folder), { recursive: true });
  fs.writeFileSync(
    path.join(base, "README.txt"),
    [
      `Easywurld workspace — ${args.projectTitle}`,
      `Client: ${args.clientId} ${args.clientName}`,
      `Project: ${args.projectId}`,
      `Created: ${nowIso()}`,
      "",
      "Folders:",
      ...WORKSPACE_FOLDERS.map((f) => `  ${f}`),
      "",
      "03 - Working Files and 06 - Archive are internal. Clients see 01, 02, 04 and 05.",
    ].join("\n"),
  );
  return base;
}

/* --------------------------- google drive -------------------------------- */

let cachedDrive: { token: string; expiresAt: number } | null = null;

async function driveToken(): Promise<string> {
  if (cachedDrive && cachedDrive.expiresAt > Date.now() + 60_000) return cachedDrive.token;
  if (config.storage.driveRefreshToken && config.storage.driveClientId && config.storage.driveClientSecret) {
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: config.storage.driveClientId,
        client_secret: config.storage.driveClientSecret,
        refresh_token: config.storage.driveRefreshToken,
        grant_type: "refresh_token",
      }),
    });
    if (!res.ok) throw new Error(`Drive token refresh failed (${res.status})`);
    const json = (await res.json()) as { access_token: string; expires_in: number };
    cachedDrive = { token: json.access_token, expiresAt: Date.now() + json.expires_in * 1000 };
    return json.access_token;
  }
  if (config.storage.driveToken) return config.storage.driveToken;
  throw new Error("Google Drive token not configured");
}

async function driveFolder(token: string, name: string, parentId: string): Promise<string> {
  const res = await fetch("https://www.googleapis.com/drive/v3/files?supportsAllDrives=true&fields=id,name", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ name, mimeType: "application/vnd.google-apps.folder", parents: [parentId] }),
  });
  if (!res.ok) throw new Error(`Drive folder create failed (${res.status}): ${await res.text()}`);
  return ((await res.json()) as { id: string }).id;
}

async function driveShare(token: string, fileId: string, email: string): Promise<void> {
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}/permissions?supportsAllDrives=true&sendNotificationEmail=true`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ role: "reader", type: "user", emailAddress: email }),
    },
  );
  if (!res.ok) throw new Error(`Drive share failed (${res.status}): ${await res.text()}`);
}

/* ------------------------------- dropbox --------------------------------- */

async function dropboxFolder(folderPath: string): Promise<void> {
  const res = await fetch("https://api.dropboxapi.com/2/files/create_folder_v2", {
    method: "POST",
    headers: { Authorization: `Bearer ${config.storage.dropboxToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({ path: folderPath, autorename: false }),
  });
  if (res.status === 409) return; // already exists
  if (!res.ok) throw new Error(`Dropbox folder create failed (${res.status}): ${await res.text()}`);
}

/* ----------------------------- orchestration ----------------------------- */

export interface WorkspaceResult {
  localPath: string | null;
  driveFolderId: string | null;
  dropboxPath: string | null;
  errors: string[];
}

/**
 * Create the six-folder workspace. Local folders are always created (they are
 * the fallback for file uploads); Drive/Dropbox run when configured.
 */
export async function provisionWorkspace(args: {
  clientId: string;
  clientName: string;
  clientEmail: string;
  projectId: string;
  projectTitle: string;
}): Promise<WorkspaceResult> {
  const result: WorkspaceResult = { localPath: null, driveFolderId: null, dropboxPath: null, errors: [] };

  try {
    result.localPath = createLocalWorkspace(args);
  } catch (err) {
    result.errors.push(`local: ${err instanceof Error ? err.message : String(err)}`);
  }

  if (config.storage.provider === "gdrive" && config.storage.driveToken) {
    try {
      const token = await driveToken();
      if (!config.storage.driveRootFolderId) throw new Error("GOOGLE_DRIVE_ROOT_FOLDER_ID missing");
      const clientFolder = await driveFolder(token, clientFolderName(args.clientId, args.clientName), config.storage.driveRootFolderId);
      const projectFolder = await driveFolder(token, projectFolderName(args.projectId, args.projectTitle), clientFolder);
      for (const folder of WORKSPACE_FOLDERS) await driveFolder(token, folder, projectFolder);
      if (config.storage.driveShareWithClients) await driveShare(token, projectFolder, args.clientEmail);
      result.driveFolderId = projectFolder;
    } catch (err) {
      result.errors.push(`drive: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  if (config.storage.dropboxToken) {
    try {
      const clientPath = `${config.storage.dropboxRoot}/${clientFolderName(args.clientId, args.clientName)}`;
      const projectPath = `${clientPath}/${projectFolderName(args.projectId, args.projectTitle)}`;
      for (const folder of WORKSPACE_FOLDERS) await dropboxFolder(`${projectPath}/${folder}`);
      result.dropboxPath = projectPath;
    } catch (err) {
      result.errors.push(`dropbox: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  if (result.errors.length) {
    logEvent({
      event: "workspace.provision.partial",
      status: "failed",
      clientId: args.clientId,
      projectId: args.projectId,
      error: result.errors.join(" | "),
      retriable: true,
    });
  } else {
    logEvent({
      event: "workspace.provision.complete",
      status: "success",
      clientId: args.clientId,
      projectId: args.projectId,
      detail: { localPath: result.localPath, driveFolderId: result.driveFolderId, dropboxPath: result.dropboxPath },
    });
  }

  run(
    `UPDATE projects SET workspace_path = COALESCE(?, workspace_path), drive_folder_id = COALESCE(?, drive_folder_id),
       dropbox_path = COALESCE(?, dropbox_path), updated_at = ? WHERE id = ?`,
    result.localPath,
    result.driveFolderId,
    result.dropboxPath,
    nowIso(),
    args.projectId,
  );
  run(
    `UPDATE clients SET workspace_path = COALESCE(?, workspace_path), drive_folder_id = COALESCE(?, drive_folder_id),
       dropbox_path = COALESCE(?, dropbox_path), updated_at = ? WHERE id = ?`,
    result.localPath ? path.dirname(result.localPath) : null,
    result.driveFolderId,
    result.dropboxPath ? path.dirname(result.dropboxPath) : null,
    nowIso(),
    args.clientId,
  );

  return result;
}
