/**
 * Thin API client. The browser only ever calls same-origin `/api/...` paths, so
 * the preview host and production host both work without configuration.
 */

export class ApiError extends Error {
  status: number;
  code?: string;
  details?: unknown;
  constructor(status: number, message: string, code?: string, details?: unknown) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

async function request<T>(path: string, init: RequestInit & { json?: unknown } = {}): Promise<T> {
  const headers: Record<string, string> = { ...(init.headers as Record<string, string> | undefined) };
  let body = init.body;
  if (init.json !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(init.json);
  }
  const res = await fetch(path, { ...init, body, headers, credentials: "same-origin" });
  const text = await res.text();
  let payload: unknown = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = { error: text };
    }
  }
  if (!res.ok) {
    const p = (payload ?? {}) as { error?: string; code?: string; details?: unknown };
    throw new ApiError(res.status, p.error || `Request failed (${res.status})`, p.code, p.details);
  }
  return payload as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, json?: unknown) => request<T>(path, { method: "POST", json }),
  patch: <T>(path: string, json?: unknown) => request<T>(path, { method: "PATCH", json }),
  put: <T>(path: string, json?: unknown) => request<T>(path, { method: "PUT", json }),
  del: <T>(path: string, json?: unknown) => request<T>(path, { method: "DELETE", json }),
  upload: <T>(path: string, file: File, extra?: Record<string, string>) => {
    const form = new FormData();
    form.append("file", file);
    for (const [k, v] of Object.entries(extra ?? {})) form.append(k, v);
    return request<T>(path, { method: "POST", body: form });
  },
};

/* ------------------------------- types --------------------------------- */

export type Role = "admin" | "client";

export interface Me {
  user: { id: string; role: Role; name: string; email: string } | null;
  client?: { id: string; name: string; email: string } | null;
  redirect?: string;
}

export interface ProjectRow {
  id: string;
  title: string;
  status: string;
  progress: number;
  start_date: string;
  due_date: string;
  revision_limit: number;
  revisions_used: number;
  service_key?: string;
  client_name?: string;
  client_email?: string;
  open_requirements?: number;
  awaiting_client?: number;
  questionnaire_status?: string;
  open_tasks?: number;
  pending_deliverables?: number;
}

export interface PortalOverview {
  client: { id: string; name: string; email: string; phone: string | null; company: string | null; status: string; purchase_date: string | null };
  projects: ProjectRow[];
  notifications: { id: string; subject: string; body: string; entity_type: string; entity_id: string; created_at: string }[];
  recentFiles: { id: string; original_name: string; size: number; created_at: string; project_id: string; project_title: string }[];
  awaitingApproval: { id: string; title: string; version: number; submitted_at: string; project_id: string; project_title: string }[];
}
