import crypto from "node:crypto";
import { all, get, nowIso, run } from "../db/db.ts";
import type { Request } from "express";

export type AutomationStatus = "success" | "failed" | "skipped" | "rejected";

export interface LogInput {
  event: string;
  status: AutomationStatus;
  clientId?: string | null;
  projectId?: string | null;
  orderId?: string | null;
  detail?: unknown;
  error?: unknown;
  retriable?: boolean;
}

/**
 * Every automated action writes one row here. The admin dashboard reads this
 * table, so a silent failure is impossible: it shows up as "failed".
 */
export function logEvent(input: LogInput): string {
  const id = crypto.randomUUID();
  const errorText =
    input.error === undefined || input.error === null
      ? null
      : input.error instanceof Error
        ? input.error.message
        : typeof input.error === "string"
          ? input.error
          : JSON.stringify(input.error);
  run(
    `INSERT INTO automation_events (id, event, status, client_id, project_id, order_id, detail, error, retriable, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    id,
    input.event,
    input.status,
    input.clientId ?? null,
    input.projectId ?? null,
    input.orderId ?? null,
    input.detail === undefined ? null : JSON.stringify(input.detail),
    errorText,
    input.retriable ? 1 : 0,
    nowIso(),
  );
  return id;
}

export function recentEvents(limit = 50): Record<string, unknown>[] {
  return all(
    `SELECT * FROM automation_events ORDER BY created_at DESC LIMIT ?`,
    Math.min(limit, 500),
  );
}

export function failedEvents(): Record<string, unknown>[] {
  return all(
    `SELECT * FROM automation_events WHERE status IN ('failed','rejected') AND resolved_at IS NULL
     ORDER BY created_at DESC LIMIT 100`,
  );
}

export function resolveEvent(id: string): void {
  run("UPDATE automation_events SET resolved_at = ? WHERE id = ?", nowIso(), id);
}

export function recordAudit(
  req: Request | null,
  action: string,
  entity?: { type?: string; id?: string; detail?: unknown },
): void {
  run(
    `INSERT INTO audit_log (id, actor_id, actor_role, action, entity_type, entity_id, ip, detail, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    crypto.randomUUID(),
    req?.user?.id ?? "system",
    req?.user?.role ?? "system",
    action,
    entity?.type ?? null,
    entity?.id ?? null,
    req?.ip ?? null,
    entity?.detail === undefined ? null : JSON.stringify(entity.detail),
    nowIso(),
  );
}

export function auditFor(entityType: string, entityId: string) {
  return all(
    "SELECT * FROM audit_log WHERE entity_type = ? AND entity_id = ? ORDER BY created_at DESC LIMIT 100",
    entityType,
    entityId,
  );
}

export function eventById(id: string) {
  return get("SELECT * FROM automation_events WHERE id = ?", id);
}
