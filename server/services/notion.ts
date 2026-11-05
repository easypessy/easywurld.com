import { config } from "../config.ts";
import { get, nowIso, run } from "../db/db.ts";
import { PROJECT_PIPELINE } from "../../shared/ops.ts";
import { logEvent } from "./automation.ts";

/**
 * Notion mirror of the operations database. The app remains the source of
 * truth; Notion is a read-mostly mirror for working from a phone.
 *
 * Every function degrades safely: with no token it returns {ok:false,
 * error:"not configured"} and writes nothing to the automation log (to avoid
 * flooding it). Property names match docs/ops/02-integrations.md exactly.
 */

const API = "https://api.notion.com/v1";
const VERSION = "2022-06-28";

function rt(value: string | null | undefined) {
  return { rich_text: value ? [{ type: "text", text: { content: String(value).slice(0, 1900) } }] : [] };
}
const title = (value: string) => ({ title: [{ type: "text", text: { content: value.slice(0, 1900) } }] });
const date = (value?: string | null) => ({ date: value ? { start: value } : null });
const select = (value?: string | null) => ({ select: value ? { name: value } : null });
const number = (value: number | null | undefined) => ({ number: typeof value === "number" ? value : null });
const checkbox = (value: boolean) => ({ checkbox: Boolean(value) });
const url = (value?: string | null) =>
  value && /^https?:\/\//i.test(value) ? { url: value } : { url: null };
const relation = (pageId?: string | null) => ({ relation: pageId ? [{ id: pageId }] : [] });

/** Select options must exist on the Notion side; anything unexpected is dropped. */
function oneOf<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return allowed.includes(value as T) ? (value as T) : fallback;
}

async function createPage(databaseId: string, properties: Record<string, unknown>): Promise<{ ok: boolean; id?: string; error?: string }> {
  if (!config.notion.token || !databaseId) return { ok: false, error: "not configured" };
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(`${API}/pages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.notion.token}`,
        "Notion-Version": VERSION,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ parent: { database_id: databaseId }, properties }),
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) {
      const text = await res.text();
      return { ok: false, error: `Notion ${res.status}: ${text.slice(0, 300)}` };
    }
    const json = (await res.json()) as { id: string };
    return { ok: true, id: json.id };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

function report(kind: string, entityId: string, result: { ok: boolean; id?: string; error?: string }, extra?: Record<string, unknown>) {
  if (result.ok) {
    logEvent({ event: `notion.${kind}.synced`, status: "success", detail: { pageId: result.id, ...extra } });
  } else if (result.error !== "not configured") {
    logEvent({ event: `notion.${kind}.failed`, status: "failed", error: result.error, retriable: true, detail: { entityId, ...extra } });
  }
}

export function notionConfigured(): boolean {
  return Boolean(config.notion.token && config.notion.clientsDb);
}

export async function syncClient(clientId: string) {
  const client = get<Record<string, any>>("SELECT * FROM clients WHERE id = ?", clientId);
  if (!client) return { ok: false, error: "client not found" };
  const project = get<Record<string, any>>("SELECT * FROM projects WHERE client_id = ? ORDER BY created_at DESC", clientId);
  const order = project?.order_id ? get<Record<string, any>>("SELECT * FROM orders WHERE id = ?", project.order_id) : undefined;
  const result = await createPage(config.notion.clientsDb, {
    "Client ID": title(String(client.id)),
    "Full name": rt(client.company ? `${client.name} (${client.company})` : client.name),
    Email: { email: client.email },
    Phone: client.phone ? { phone_number: String(client.phone) } : { phone_number: null },
    "Purchase date": date(client.purchase_date),
    "Purchased service": rt(project?.title),
    "Payment status": select(order?.status === "paid" ? "Paid" : "Pending"),
    "Client status": select(String(client.status)),
    "Project ID": rt(project?.id),
    "Workspace reference": { url: project?.workspace_path ? String(project.workspace_path) : null },
  });
  if (result.ok && result.id) {
    run("UPDATE clients SET notion_page_id = ?, updated_at = ? WHERE id = ?", result.id, nowIso(), clientId);
  }
  report("client", clientId, result);
  return result;
}

export async function syncProject(projectId: string) {
  const project = get<Record<string, any>>("SELECT * FROM projects WHERE id = ?", projectId);
  if (!project) return { ok: false, error: "project not found" };
  const client = get<Record<string, any>>("SELECT * FROM clients WHERE id = ?", project.client_id);
  const revisions = get<{ c: number }>(
    "SELECT COUNT(*) AS c FROM reviews WHERE project_id = ? AND action = 'request_revision'",
    projectId,
  )?.c ?? 0;
  const result = await createPage(config.notion.projectsDb, {
    "Project ID": title(String(project.id)),
    "Project name": rt(project.title),
    Service: rt(project.service_key),
    "Project status": select(oneOf(project.status, PROJECT_PIPELINE, "in_progress")),
    Client: relation(client?.notion_page_id),
    "Start date": date(project.start_date),
    "Due date": date(project.due_date),
    Progress: number(typeof project.progress === "number" ? project.progress / 100 : null),
    "Revision limit": number(project.revision_limit),
    "Revisions used": number(project.revisions_used ?? revisions),
    "Next action": rt(project.next_action),
    "Drive folder": url(project.workspace_url ?? null),
    "Amount paid": number(project.amount_paid ?? null),
  });
  if (result.ok && result.id) {
    run("UPDATE projects SET notion_page_id = ?, updated_at = ? WHERE id = ?", result.id, nowIso(), projectId);
  }
  report("project", projectId, result);
  return result;
}

export async function syncTask(taskId: string) {
  const task = get<Record<string, any>>("SELECT * FROM tasks WHERE id = ?", taskId);
  if (!task) return { ok: false, error: "task not found" };
  const project = get<Record<string, any>>("SELECT notion_page_id FROM projects WHERE id = ?", task.project_id);
  const result = await createPage(config.notion.tasksDb, {
    Task: title(String(task.title).slice(0, 1900)),
    Project: relation(project?.notion_page_id),
    Assignee: select(task.visible_to_client ? "Client" : "Easywurld Admin"),
    Priority: select(oneOf(task.priority, ["low", "normal", "high", "urgent"] as const, "normal")),
    "Due date": date(task.due_date),
    "Task status": select(oneOf(task.status, ["todo", "in_progress", "blocked", "done"] as const, "todo")),
    "Visible to client": checkbox(Boolean(task.visible_to_client)),
  });
  report("task", taskId, result);
  return result;
}

export async function syncDelivery(deliverableId: string) {
  const d = get<Record<string, any>>("SELECT * FROM deliverables WHERE id = ?", deliverableId);
  if (!d) return { ok: false, error: "deliverable not found" };
  const project = get<Record<string, any>>("SELECT notion_page_id FROM projects WHERE id = ?", d.project_id);
  const file = d.file_id ? get<Record<string, any>>("SELECT original_name FROM files WHERE id = ?", d.file_id) : undefined;
  const result = await createPage(config.notion.deliveriesDb, {
    Deliverable: title(`v${d.version} — ${d.title}`.slice(0, 1900)),
    Project: relation(project?.notion_page_id),
    Version: number(Number(d.version)),
    "Delivery status": select(
      oneOf(d.status, ["submitted", "approved", "revision_requested", "superseded"] as const, "submitted"),
    ),
    Submitted: date(d.submitted_at),
    "Client decision on": date(d.decided_at),
    "File / link": url(d.external_url ?? null),
    Notes: rt([d.description, file?.original_name, d.decision_note].filter(Boolean).join("\n")),
  });
  report("delivery", deliverableId, result);
  return result;
}

const EVENT_TYPES: Record<string, string> = {
  purchase: "purchase",
  order: "purchase",
  payment: "purchase",
  webhook: "purchase",
  workspace: "workspace",
  folder: "workspace",
  notion: "workspace",
  notification: "notification",
  email: "notification",
  reminder: "notification",
  questionnaire: "questionnaire",
  onboarding: "questionnaire",
  failure: "failure",
};

export async function syncAutomationLog(event: {
  id: string;
  event: string;
  status: string;
  client_id?: string | null;
  project_id?: string | null;
  error?: string | null;
  detail?: unknown;
}) {
  const prefix = String(event.event).split(".")[0] ?? "";
  const type = EVENT_TYPES[prefix] ?? (event.status === "failed" ? "failure" : "project");
  const result = await createPage(config.notion.logDb, {
    Event: title(`[${event.status}] ${event.event}`.slice(0, 1900)),
    "Event type": select(type),
    Status: select(oneOf(event.status, ["ok", "success", "failed", "skipped", "resolved"] as const, "ok")),
    "Occurred at": date(nowIso()),
    "Resolved at": date(null),
    "Client ID": rt(event.client_id),
    "Project ID": rt(event.project_id),
    Detail: rt(event.error ?? JSON.stringify(event.detail ?? {})),
  });
  report("log", event.id, result);
  return result;
}
