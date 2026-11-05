import crypto from "node:crypto";
import type { NextFunction, Request, Response } from "express";
import { config } from "./config.ts";
import { all, get, nowIso, run } from "./db/db.ts";
import { unauthorized, forbidden } from "./lib/errors.ts";

/* ----------------------------- passwords -------------------------------- */

const SCRYPT = { N: 16384, r: 8, p: 1, keylen: 64 };

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, SCRYPT.keylen, { N: SCRYPT.N, r: SCRYPT.r, p: SCRYPT.p }).toString("hex");
  return `scrypt$${SCRYPT.N}$${SCRYPT.r}$${SCRYPT.p}$${salt}$${hash}`;
}

export function verifyPassword(password: string, stored: string | null | undefined): boolean {
  if (!stored) return false;
  const parts = stored.split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;
  const [, N, r, p, salt, hash] = parts;
  try {
    const candidate = crypto.scryptSync(password, salt, hash.length / 2, {
      N: Number(N),
      r: Number(r),
      p: Number(p),
    });
    const expected = Buffer.from(hash, "hex");
    return candidate.length === expected.length && crypto.timingSafeEqual(candidate, expected);
  } catch {
    return false;
  }
}

/** Password policy: length beats complexity theatre. */
export function passwordProblem(password: unknown): string | null {
  if (typeof password !== "string" || password.length < 10) return "Use at least 10 characters.";
  if (password.length > 200) return "That password is too long.";
  if (/^(password|123456|qwerty)/i.test(password)) return "Choose something less guessable.";
  return null;
}

/* ------------------------------ sessions -------------------------------- */

export const SESSION_COOKIE = "ew_session";
export const hashToken = (token: string) => crypto.createHash("sha256").update(token).digest("hex");

export interface SessionUser {
  id: string;
  role: "admin" | "client";
  email: string;
  name: string;
  status: string;
}

export function createSession(userId: string, req: Request): string {
  const token = crypto.randomBytes(32).toString("base64url");
  const expires = new Date(Date.now() + config.sessionDays * 86400000).toISOString();
  run(
    `INSERT INTO sessions (id, user_id, token_hash, created_at, expires_at, ip, user_agent)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    crypto.randomUUID(),
    userId,
    hashToken(token),
    nowIso(),
    expires,
    req.ip ?? null,
    (req.get("user-agent") ?? "").slice(0, 250),
  );
  return token;
}

export function sessionCookie(token: string): string {
  const attrs = [
    `${SESSION_COOKIE}=${token}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${config.sessionDays * 86400}`,
  ];
  if (config.isProd) attrs.push("Secure");
  return attrs.join("; ");
}

export function clearCookie(): string {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${config.isProd ? "; Secure" : ""}`;
}

export function parseCookies(header: string | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  if (!header) return out;
  for (const part of header.split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    out[part.slice(0, idx).trim()] = decodeURIComponent(part.slice(idx + 1).trim());
  }
  return out;
}

export function userFromRequest(req: Request): SessionUser | null {
  const token = parseCookies(req.headers.cookie)[SESSION_COOKIE];
  if (!token) return null;
  const row = get<SessionUser & { expires_at: string; revoked_at: string | null }>(
    `SELECT u.id, u.role, u.email, u.name, u.status, s.expires_at, s.revoked_at
     FROM sessions s JOIN users u ON u.id = s.user_id
     WHERE s.token_hash = ?`,
    hashToken(token),
  );
  if (!row) return null;
  if (row.revoked_at) return null;
  if (new Date(row.expires_at).getTime() < Date.now()) return null;
  if (row.status !== "active") return null;
  return { id: row.id, role: row.role, email: row.email, name: row.name, status: row.status };
}

export function revokeSession(req: Request): void {
  const token = parseCookies(req.headers.cookie)[SESSION_COOKIE];
  if (!token) return;
  run("UPDATE sessions SET revoked_at = ? WHERE token_hash = ?", nowIso(), hashToken(token));
}

export function revokeAllSessions(userId: string): void {
  run("UPDATE sessions SET revoked_at = ? WHERE user_id = ? AND revoked_at IS NULL", nowIso(), userId);
}

/* ------------------------------ middleware ------------------------------- */

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: SessionUser;
      rawBody?: Buffer;
      clientRecord?: { id: string; email: string; name: string };
    }
  }
}

export function attachUser(req: Request, _res: Response, next: NextFunction): void {
  const user = userFromRequest(req);
  if (user) {
    req.user = user;
    if (user.role === "client") {
      const client = get<{ id: string; email: string; name: string }>(
        "SELECT id, email, name FROM clients WHERE user_id = ?",
        user.id,
      );
      if (client) req.clientRecord = client;
    }
  }
  next();
}

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  if (!req.user) return next(unauthorized());
  next();
}

export function requireRole(role: "admin" | "client") {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) return next(unauthorized());
    if (req.user.role !== role) return next(forbidden());
    next();
  };
}

/**
 * CSRF defence for cookie-authenticated mutations: the browser must send an
 * Origin that matches this host, and a cross-site fetch is refused outright.
 * Webhooks are exempt because they authenticate with a signature instead.
 */
export function csrfGuard(req: Request, _res: Response, next: NextFunction): void {
  if (!["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) return next();
  const site = req.get("sec-fetch-site");
  if (site && !["same-origin", "same-site", "none"].includes(site)) {
    return next(forbidden("Cross-site request blocked"));
  }
  const origin = req.get("origin");
  if (origin) {
    try {
      const originHost = new URL(origin).host;
      const host = req.get("host");
      if (host && originHost !== host) return next(forbidden("Origin mismatch"));
    } catch {
      return next(forbidden("Invalid origin"));
    }
  }
  next();
}

/* ---------------------------- login throttle ----------------------------- */

const attempts = new Map<string, { count: number; resetAt: number }>();

export function throttleLogin(key: string): void {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || entry.resetAt < now) {
    attempts.set(key, { count: 1, resetAt: now + config.limits.loginWindowMs });
    return;
  }
  entry.count += 1;
  if (entry.count > config.limits.loginAttemptsPerWindow) {
    const minutes = Math.ceil((entry.resetAt - now) / 60000);
    throw forbidden(`Too many attempts. Try again in ${minutes} minute${minutes === 1 ? "" : "s"}.`);
  }
}

export function clearLoginThrottle(key: string): void {
  attempts.delete(key);
}

/** Test helper. */
export function resetThrottle(): void {
  attempts.clear();
}

/* -------------------------- activation tokens ---------------------------- */

export function createActivationToken(userId: string, purpose = "activate"): string {
  const token = crypto.randomBytes(32).toString("base64url");
  const expires = new Date(Date.now() + 14 * 86400000).toISOString();
  run(
    `INSERT INTO activation_tokens (id, user_id, token_hash, purpose, created_at, expires_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    crypto.randomUUID(),
    userId,
    hashToken(token),
    purpose,
    nowIso(),
    expires,
  );
  return token;
}

export function consumeActivationToken(token: string): { userId: string } | null {
  if (!token) return null;
  const row = get<{ id: string; user_id: string; expires_at: string; used_at: string | null }>(
    "SELECT id, user_id, expires_at, used_at FROM activation_tokens WHERE token_hash = ?",
    hashToken(token),
  );
  if (!row || row.used_at) return null;
  if (new Date(row.expires_at).getTime() < Date.now()) return null;
  run("UPDATE activation_tokens SET used_at = ? WHERE id = ?", nowIso(), row.id);
  return { userId: row.user_id };
}

export function countAdmins(): number {
  return all<{ c: number }>("SELECT COUNT(*) AS c FROM users WHERE role = 'admin' AND status = 'active'")[0].c;
}
