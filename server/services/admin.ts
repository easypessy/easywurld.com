import crypto from "node:crypto";
import { all, get, nowIso, run, tx } from "../db/db.ts";
import { logEvent, recordAudit } from "./automation.ts";
import { notFound } from "../lib/errors.ts";
import type { Request } from "express";
import { provisionWorkspace } from "./storage.ts";

const count = (sql: string, ...params: unknown[]): number =>
  Number(get<{ c: number }>(sql, ...params)?.c ?? 0);

/** Everything the administrator needs at a glance, in one call. */
export function overview() {
  const today = nowIso();
  const in14 = new Date(Date.now() + 14 * 86400000).toISOString();

  const statusRows = all<{ status: string; c: number }>("SELECT status, COUNT(*) AS c FROM projects GROUP BY status");
  const byStatus: Record<string, number> = Object.fromEntries(statusRows.map((r) => [r.status, Number(r.c)]));

  return {
    counts: {
      clients: count("SELECT COUNT(*) AS c FROM clients"),
      newPurchases30d: count("SELECT COUNT(*) AS c FROM orders WHERE status = 'paid' AND verified_at >= ?", new Date(Date.now() - 30 * 86400000).toISOString()),
      pendingIntents: count("SELECT COUNT(*) AS c FROM orders WHERE status = 'pending'"),
      activeProjects: count("SELECT COUNT(*) AS c FROM projects WHERE status NOT IN ('completed','delivered','archived')"),
      awaitingClientInfo: (byStatus.awaiting_onboarding ?? 0) + (byStatus.awaiting_client_materials ?? 0),
      inProduction: (byStatus.ready_to_start ?? 0) + (byStatus.in_progress ?? 0) + (byStatus.internal_review ?? 0),
      pendingApprovals: byStatus.awaiting_client_approval ?? 0,
      revisions: byStatus.revision_requested ?? 0,
      upcomingDeadlines: count("SELECT COUNT(*) AS c FROM projects WHERE due_date BETWEEN ? AND ? AND status NOT IN ('completed','delivered','archived')", today, in14),
      overdue: count("SELECT COUNT(*) AS c FROM projects WHERE due_date < ? AND status NOT IN ('completed','delivered','archived')", today),
      completed: (byStatus.completed ?? 0) + (byStatus.delivered ?? 0),
      outstandingDeliverables: count("SELECT COUNT(*) AS c FROM deliverables WHERE status IN ('submitted','revision_requested')"),
      unreadMessages: count("SELECT COUNT(*) AS c FROM messages WHERE sender_role = 'client' AND read_by_admin_at IS NULL"),
      automationFailures: count("SELECT COUNT(*) AS c FROM automation_events WHERE status IN ('failed','rejected') AND resolved_at IS NULL"),
    },
    byStatus,
    recentPurchases: all(
      `SELECT o.id, o.buyer_name, o.buyer_email, o.status, o.verified_at, o.provider, o.provider_reference,
              o.amount_minor, o.currency, o.project_id
       FROM orders o WHERE o.status = 'paid' ORDER BY o.verified_at DESC LIMIT 8`,
    ),
    upcoming: all(
      `SELECT p.id, p.title, p.status, p.due_date, c.name AS client_name
       FROM projects p JOIN clients c ON c.id = p.client_id
       WHERE p.status NOT IN ('completed','delivered','archived') ORDER BY p.due_date ASC LIMIT 10`,
    ),
    overdue: all(
      `SELECT p.id, p.title, p.status, p.due_date, c.name AS client_name
       FROM projects p JOIN clients c ON c.id = p.client_id
       WHERE p.due_date < ? AND p.status NOT IN ('completed','delivered','archived') ORDER BY p.due_date ASC LIMIT 10`,
      today,
    ),
    pendingReview: all(
      `SELECT d.id, d.title, d.version, d.submitted_at, p.id AS project_id, p.title AS project_title, c.name AS client_name
       FROM deliverables d JOIN projects p ON p.id = d.project_id JOIN clients c ON c.id = p.client_id
       WHERE d.status IN ('submitted','revision_requested') ORDER BY d.submitted_at ASC LIMIT 10`,
    ),
    recentActivity: all(
      `SELECT * FROM (
       SELECT 'message' AS kind, m.body AS detail, m.created_at, m.project_id, p.title AS project_title
       FROM messages m JOIN projects p ON p.id = m.project_id
       UNION ALL
       SELECT 'delivery' AS kind, d.title AS detail, d.created_at, d.project_id, p.title AS project_title
       FROM deliverables d JOIN projects p ON p.id = d.project_id
       UNION ALL
       SELECT 'file' AS kind, f.original_name AS detail, f.created_at, f.project_id, p.title AS project_title
       FROM files f JOIN projects p ON p.id = f.project_id
       ) ORDER BY created_at DESC LIMIT 12`,
    ),
    failures: all(
      `SELECT id, event, status, error, created_at, client_id, project_id FROM automation_events
       WHERE status IN ('failed','rejected') AND resolved_at IS NULL ORDER BY created_at DESC LIMIT 10`,
    ),
  };
}

export function listClients(q = "") {
  const pattern = `%${q.toLowerCase()}%`;
  return all(
    `SELECT c.*,
       (SELECT COUNT(*) FROM projects p WHERE p.client_id = c.id) AS project_count,
       (SELECT p.id FROM projects p WHERE p.client_id = c.id ORDER BY p.created_at DESC LIMIT 1) AS latest_project_id,
       (SELECT p.status FROM projects p WHERE p.client_id = c.id ORDER BY p.created_at DESC LIMIT 1) AS latest_project_status,
       (SELECT p.due_date FROM projects p WHERE p.client_id = c.id ORDER BY p.created_at DESC LIMIT 1) AS latest_due_date
     FROM clients c
     WHERE ? = '' OR lower(c.name) LIKE ? OR lower(c.email) LIKE ? OR lower(c.id) LIKE ?
     ORDER BY c.created_at DESC`,
    q,
    pattern,
    pattern,
    pattern,
  );
}

export function listProjects(filters: { status?: string; q?: string } = {}) {
  const params: unknown[] = [];
  let where = "WHERE 1=1";
  if (filters.status) {
    where += " AND p.status = ?";
    params.push(filters.status);
  }
  if (filters.q) {
    where += " AND (lower(p.title) LIKE ? OR lower(c.name) LIKE ? OR lower(c.email) LIKE ? OR lower(p.id) LIKE ?)";
    const p = `%${filters.q.toLowerCase()}%`;
    params.push(p, p, p, p);
  }
  return all(
    `SELECT p.*, c.name AS client_name, c.email AS client_email,
       (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id AND t.status != 'done') AS open_tasks,
       (SELECT COUNT(*) FROM deliverables d WHERE d.project_id = p.id AND d.status IN ('submitted','revision_requested')) AS pending_deliverables
     FROM projects p JOIN clients c ON c.id = p.client_id
     ${where} ORDER BY p.due_date ASC`,
    ...params,
  );
}

export function updateClient(clientId: string, patch: Record<string, any>) {
  const client = get<Record<string, any>>("SELECT * FROM clients WHERE id = ?", clientId);
  if (!client) throw notFound("Client not found");
  run(
    `UPDATE clients SET name = ?, phone = ?, company = ?, status = ?, internal_notes = ?, updated_at = ? WHERE id = ?`,
    patch.name ?? client.name,
    patch.phone ?? client.phone,
    patch.company ?? client.company,
    patch.status ?? client.status,
    patch.internalNotes ?? client.internal_notes,
    nowIso(),
    clientId,
  );
  return get("SELECT * FROM clients WHERE id = ?", clientId);
}

/**
 * Data deletion procedure. Removes the account, sessions and personal fields but
 * keeps an anonymised project/audit trace for accounting integrity.
 */
export function deleteClientData(clientId: string, req: Request | null) {
  const client = get<Record<string, any>>("SELECT * FROM clients WHERE id = ?", clientId);
  if (!client) throw notFound("Client not found");
  const projects = all<{ id: string }>("SELECT id FROM projects WHERE client_id = ?", clientId);

  tx(() => {
    if (client.user_id) {
      run("DELETE FROM sessions WHERE user_id = ?", client.user_id);
      run("DELETE FROM activation_tokens WHERE user_id = ?", client.user_id);
      run("DELETE FROM users WHERE id = ?", client.user_id);
    }
    run("DELETE FROM files WHERE client_id = ?", clientId);
    run("DELETE FROM messages WHERE project_id IN (SELECT id FROM projects WHERE client_id = ?)", clientId);
    run("DELETE FROM deliverables WHERE project_id IN (SELECT id FROM projects WHERE client_id = ?)", clientId);
    run("DELETE FROM projects WHERE client_id = ?", clientId);
    run(
      `UPDATE clients SET name = 'Deleted client', email = ?, phone = NULL, company = NULL,
         internal_notes = '[personal data deleted on request]', workspace_path = NULL, status = 'archived', updated_at = ?
       WHERE id = ?`,
      `deleted+${clientId.toLowerCase()}@easywurld.invalid`,
      nowIso(),
      clientId,
    );
  });

  logEvent({ event: "client.data_deleted", status: "success", clientId, detail: { projectsRemoved: projects.length } });
  recordAudit(req, "client.data_deleted", { type: "client", id: clientId, detail: { projectsRemoved: projects.length } });
  return { deleted: true, projectsRemoved: projects.length };
}

export async function retryWorkspace(projectId: string) {
  const project = get<Record<string, any>>("SELECT * FROM projects WHERE id = ?", projectId);
  if (!project) throw notFound("Project not found");
  const client = get<Record<string, any>>("SELECT * FROM clients WHERE id = ?", project.client_id);
  if (!client) throw notFound("Client not found");
  const result = await provisionWorkspace({
    clientId: String(client.id),
    clientName: String(client.name),
    clientEmail: String(client.email),
    projectId: String(project.id),
    projectTitle: String(project.title),
  });
  return result;
}

export function auditTrail(entityType: string, entityId: string) {
  return all(
    "SELECT * FROM audit_log WHERE entity_type = ? AND entity_id = ? ORDER BY created_at DESC LIMIT 200",
    entityType,
    entityId,
  );
}

/** Dashboard-only stand-in for an id that is safe to log. */
export function publicRef(id: string) {
  return crypto.createHash("sha1").update(id).digest("hex").slice(0, 8);
}
