import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

/**
 * Test harness: a throwaway database + storage directory, a real HTTP server on
 * an ephemeral port, and the modules imported *after* the environment is set
 * (config is read at import time).
 */

export const WEBHOOK_SECRET = "test-webhook-secret";

export async function bootTestServer() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "easywurld-test-"));
  process.env.NODE_ENV = "test";
  process.env.DATA_DIR = dir;
  process.env.DB_FILE = path.join(dir, "test.db");
  process.env.STORAGE_DIR = path.join(dir, "storage");
  process.env.PUBLIC_DIR = path.join(dir, "public");
  process.env.WEBHOOK_SECRET = WEBHOOK_SECRET;
  process.env.EASYWURLD_ADMIN_EMAIL = "ops@easywurld.test";
  process.env.SITE_URL = "http://127.0.0.1";
  process.env.SMTP_HOST = "";
  process.env.WHATSAPP_TOKEN = "";

  const { createApp } = await import("../app.ts");
  const db = await import("../db/db.ts");
  const auth = await import("../auth.ts");
  const onboarding = await import("../services/onboarding.ts");
  const templates = await import("../services/templates.ts");

  templates.seedTemplates();

  const app = createApp();
  const server = app.listen(0, "127.0.0.1");
  await new Promise<void>((resolve) => server.once("listening", () => resolve()));
  const address = server.address();
  const port = typeof address === "object" && address ? address.port : 0;
  const base = `http://127.0.0.1:${port}`;

  return {
    dir,
    base,
    db,
    auth,
    onboarding,
    templates,
    server,
    close: async () => {
      await new Promise<void>((resolve) => server.close(() => resolve()));
      fs.rmSync(dir, { recursive: true, force: true });
    },
  };
}

export interface Client {
  cookie: string;
  user: { id: string; role: string; email: string; name: string };
}

export function makeHttp(base: string) {
  async function request(
    method: string,
    url: string,
    body?: unknown,
    opts: { cookie?: string; headers?: Record<string, string>; raw?: string; form?: FormData } = {},
  ) {
    const headers: Record<string, string> = { ...(opts.headers ?? {}) };
    if (opts.cookie) headers.cookie = opts.cookie;
    let payload: BodyInit | undefined;
    if (opts.form) {
      payload = opts.form;
    } else if (opts.raw !== undefined) {
      payload = opts.raw;
      headers["content-type"] = headers["content-type"] ?? "application/json";
    } else if (body !== undefined) {
      payload = JSON.stringify(body);
      headers["content-type"] = "application/json";
    }
    const res = await fetch(`${base}${url}`, { method, headers, body: payload });
    const setCookie = res.headers.get("set-cookie");
    let json: any = null;
    const text = await res.text();
    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      json = { raw: text };
    }
    return { status: res.status, body: json, cookie: setCookie ? setCookie.split(";")[0] : undefined, headers: res.headers };
  }
  return { request };
}

export function signedHeaders(payload: unknown, secret = WEBHOOK_SECRET) {
  const raw = JSON.stringify(payload);
  const signature = crypto.createHmac("sha256", secret).update(raw).digest("hex");
  return { raw, headers: { "x-easywurld-signature": signature, "content-type": "application/json" } };
}

export async function loginAdmin(base: string, db: any, auth: any): Promise<Client> {
  const id = crypto.randomUUID();
  db.run(
    `INSERT INTO users (id, role, email, name, password_hash, status, created_at)
     VALUES (?, 'admin', ?, 'Test Admin', ?, 'active', ?)`,
    id,
    "admin@easywurld.test",
    auth.hashPassword("correct-horse-battery"),
    new Date().toISOString(),
  );
  const http = makeHttp(base);
  const res = await http.request("POST", "/api/auth/login", {
    email: "admin@easywurld.test",
    password: "correct-horse-battery",
  });
  if (res.status !== 200) throw new Error(`admin login failed: ${res.status} ${JSON.stringify(res.body)}`);
  return { cookie: res.cookie!, user: res.body.user };
}

export async function activateClient(base: string, token: string, password = "client-password-123"): Promise<Client> {
  const http = makeHttp(base);
  const res = await http.request("POST", "/api/auth/activate", { token, password });
  if (res.status !== 200) throw new Error(`activation failed: ${res.status} ${JSON.stringify(res.body)}`);
  return { cookie: res.cookie!, user: res.body.user };
}
