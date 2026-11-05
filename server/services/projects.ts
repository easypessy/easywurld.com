import crypto from "node:crypto";
import { config } from "../config.ts";
import { addDays, all, get, nextSequence, nowIso, pad, run } from "../db/db.ts";
import { badRequest, conflict, forbidden, notFound } from "../lib/errors.ts";
import type { SessionUser } from "../auth.ts";
import { logEvent, recordAudit } from "./automation.ts";
import { approvalBody, enqueue, enqueueInApp, revisionRequestBody } from "./notifications.ts";
import { PROJECT_STATUS_LABELS, progressFor, type ProjectStatus } from "../../shared/ops.ts";
import { getTemplate } from "./templates.ts";

export const projectOrThrow = (projectId: string) => {
  const project = get<Record<string, any>>("SELECT * FROM projects WHERE id = ?", projectId);
  if (!project) throw notFound("Project not found");
  return project;
};

/** Ownership check used by every client-facing route. */
export function clientProjectOrThrow(projectId: string, clientId: string) {
  const project = get<Record<string, any>>(
    "SELECT * FROM projects WHERE id = ? AND client_id = ?",
    projectId,
    clientId,
  );
  if (!project) throw forbidden("That project is not in your workspace");
  return project;
}

export function setProjectStatus(
  projectId: string,
  to: ProjectStatus,
  actor: { id: string; role: string } | null,
  note = "",
): Record<string, any> {
  const project = projectOrThrow(projectId);
  if (project.status === to) return project;
  run(
    `UPDATE projects SET status = ?, progress = ?, completed_at = CASE WHEN ? IN ('completed','delivered','archived') THEN COALESCE(completed_at, ?) ELSE completed_at END, updated_at = ? WHERE id = ?`,
    to,
    progressFor(to),
    to,
    nowIso(),
    nowIso(),
    projectId,
  );
  run(
    `INSERT INTO project_status_history (id, project_id, from_status, to_status, actor_id, actor_role, note, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    crypto.randomUUID(),
    projectId,
    project.status,
    to,
    actor?.id ?? "system",
    actor?.role ?? "system",
    note,
    nowIso(),
  );
  logEvent({
    event: "project.status_changed",
    status: "success",
    clientId: project.client_id,
    projectId,
    detail: { from: project.status, to, note },
  });
  return projectOrThrow(projectId);
}

/* -------------------------------- tasks --------------------------------- */

export function listTasks(projectId: string, clientVisibleOnly: boolean) {
  return all(
    `SELECT * FROM tasks WHERE project_id = ? ${clientVisibleOnly ? "AND visible_to_client = 1" : ""}
     ORDER BY sort_order ASC, due_date ASC`,
    projectId,
  );
}

export function createTask(projectId: string, input: Record<string, any>) {
  projectOrThrow(projectId);
  const id = crypto.randomUUID();
  const maxOrder = all<{ m: number }>("SELECT COALESCE(MAX(sort_order), 0) AS m FROM tasks WHERE project_id = ?", projectId)[0].m;
  run(
    `INSERT INTO tasks (id, project_id, title, description, priority, due_date, status, depends_on, visible_to_client,
      sort_order, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, 'todo', ?, ?, ?, ?, ?)`,
    id,
    projectId,
    String(input.title ?? "Untitled task").slice(0, 200),
    input.description ?? null,
    ["low", "normal", "high", "urgent"].includes(input.priority) ? input.priority : "normal",
    input.dueDate ?? null,
    input.dependsOn ?? null,
    input.visibleToClient ? 1 : 0,
    maxOrder + 1,
    nowIso(),
    nowIso(),
  );
  return get("SELECT * FROM tasks WHERE id = ?", id);
}

export function updateTask(taskId: string, patch: Record<string, any>) {
  const task = get<Record<string, any>>("SELECT * FROM tasks WHERE id = ?", taskId);
  if (!task) throw notFound("Task not found");
  const statuses = ["todo", "in_progress", "blocked", "done"];
  const status = statuses.includes(patch.status) ? patch.status : task.status;
  run(
    `UPDATE tasks SET title = ?, description = ?, priority = ?, due_date = ?, status = ?,
       visible_to_client = ?, completed_at = ?, updated_at = ?
     WHERE id = ?`,
    patch.title ?? task.title,
    patch.description ?? task.description,
    patch.priority ?? task.priority,
    patch.dueDate ?? task.due_date,
    status,
    patch.visibleToClient === undefined ? task.visible_to_client : patch.visibleToClient ? 1 : 0,
    status === "done" ? task.completed_at ?? nowIso() : null,
    nowIso(),
    taskId,
  );
  if (status === "done" && task.status !== "done") {
    logEvent({ event: "task.completed", status: "success", projectId: task.project_id, detail: { task: task.title } });
  }
  return get("SELECT * FROM tasks WHERE id = ?", taskId);
}

export function completeMilestone(milestoneId: string, actor: SessionUser | null) {
  const milestone = get<Record<string, any>>("SELECT * FROM milestones WHERE id = ?", milestoneId);
  if (!milestone) throw notFound("Milestone not found");
  const nextStatus = milestone.status === "done" ? "pending" : "done";
  run(
    `UPDATE milestones SET status = ?, completed_at = ? WHERE id = ?`,
    nextStatus,
    nextStatus === "done" ? nowIso() : null,
    milestoneId,
  );
  if (nextStatus === "done") {
    logEvent({
      event: "milestone.completed",
      status: "success",
      projectId: milestone.project_id,
      detail: { milestone: milestone.title, by: actor?.role ?? "system" },
    });
  }
  return get("SELECT * FROM milestones WHERE id = ?", milestoneId);
}

/* ----------------------------- deliverables ------------------------------ */

export function projectDeliverables(projectId: string) {
  return all(
    `SELECT d.*, f.original_name AS file_name, f.size AS file_size, f.mime AS file_mime
     FROM deliverables d LEFT JOIN files f ON f.id = d.file_id
     WHERE d.project_id = ? ORDER BY d.created_at ASC`,
    projectId,
  );
}

export function submitDeliverable(
  projectId: string,
  input: { title: string; description?: string; fileId?: string; externalUrl?: string },
  actor: SessionUser,
) {
  const project = projectOrThrow(projectId);
  if (!input.fileId && !input.externalUrl) {
    throw badRequest("Attach a file or a link so the client has something to review");
  }
  if (input.fileId) {
    const file = get<Record<string, any>>("SELECT * FROM files WHERE id = ? AND project_id = ?", input.fileId, projectId);
    if (!file) throw badRequest("That file does not belong to this project");
  }

  const versionRow = all<{ v: number }>("SELECT COALESCE(MAX(version), 0) AS v FROM deliverables WHERE project_id = ?", projectId)[0];
  const version = versionRow.v + 1;
  const id = `EW-D-${pad(nextSequence("deliverable_seq"))}`;

  run(
    `INSERT INTO deliverables (id, project_id, title, description, version, status, file_id, external_url, submitted_at, created_by, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, 'submitted', ?, ?, ?, ?, ?, ?)`,
    id,
    projectId,
    input.title.slice(0, 200),
    input.description ?? null,
    version,
    input.fileId ?? null,
    input.externalUrl ?? null,
    nowIso(),
    actor.id,
    nowIso(),
    nowIso(),
  );
  if (input.fileId) {
    run("UPDATE files SET visibility = 'client', deliverable_id = ? WHERE id = ?", id, input.fileId);
  }

  setProjectStatus(projectId, "awaiting_client_approval", actor, `Deliverable ${id} v${version} submitted`);

  const client = get<Record<string, any>>("SELECT * FROM clients WHERE id = ?", project.client_id)!;
  const portalUrl = config.admin.siteUrl;
  enqueue({
    channel: "email",
    recipient: String(client.email),
    subject: `Work ready for review — ${project.title}`,
    body: [
      `Hi ${client.name},`,
      "",
      `A new deliverable is ready in your workspace: ${input.title} (version ${version}).`,
      "",
      input.description ?? "",
      "",
      `Review and approve it here: ${portalUrl}/login`,
      "",
      "Silence is not approval — we only proceed once you approve or request a revision.",
      "Easywurld",
    ].join("\n"),
    entityType: "deliverable",
    entityId: id,
    dedupeKey: `deliverable-submitted:${id}`,
  });
  enqueueInApp(String(client.email), `Work ready for review: ${input.title}`, `Version ${version} is waiting for your approval.`, "deliverable", id, `deliverable-inapp:${id}`);

  logEvent({
    event: "deliverable.submitted",
    status: "success",
    clientId: project.client_id,
    projectId,
    detail: { deliverableId: id, version, title: input.title },
  });
  return get("SELECT * FROM deliverables WHERE id = ?", id);
}

export function decideDeliverable(
  projectId: string,
  deliverableId: string,
  action: "approve" | "request_revision",
  note: string,
  actor: { id: string; role: "admin" | "client"; name: string },
) {
  const project = projectOrThrow(projectId);
  const deliverable = get<Record<string, any>>(
    "SELECT * FROM deliverables WHERE id = ? AND project_id = ?",
    deliverableId,
    projectId,
  );
  if (!deliverable) throw notFound("Deliverable not found");
  if (!["submitted", "revision_requested"].includes(deliverable.status)) {
    throw conflict("This deliverable has already been decided");
  }
  if (action === "request_revision" && !note.trim()) {
    throw badRequest("Tell us what to change so the revision is useful");
  }

  const client = get<Record<string, any>>("SELECT * FROM clients WHERE id = ?", project.client_id)!;
  const revisionsUsed = Number(project.revisions_used ?? 0);
  const overLimit = action === "request_revision" && revisionsUsed >= Number(project.revision_limit ?? 0);

  if (action === "approve") {
    run(
      `UPDATE deliverables SET status = 'approved', decided_at = ?, decision_note = ?, updated_at = ? WHERE id = ?`,
      nowIso(),
      note,
      nowIso(),
      deliverableId,
    );
    // Any earlier revision state is resolved.
    run(
      `UPDATE deliverables SET status = 'superseded' WHERE project_id = ? AND id != ? AND status = 'submitted'`,
      projectId,
      deliverableId,
    );
    setProjectStatus(projectId, "delivered", actor, "Client approved the deliverable");
  } else {
    run(
      `UPDATE deliverables SET status = 'revision_requested', decided_at = ?, decision_note = ?, updated_at = ? WHERE id = ?`,
      nowIso(),
      note,
      nowIso(),
      deliverableId,
    );
    run(
      `UPDATE projects SET revisions_used = revisions_used + 1, updated_at = ? WHERE id = ?`,
      nowIso(),
      projectId,
    );
    setProjectStatus(projectId, "revision_requested", actor, `Revision requested: ${note.slice(0, 140)}`);
  }

  run(
    `INSERT INTO reviews (id, project_id, deliverable_id, actor_id, actor_role, action, note, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    crypto.randomUUID(),
    projectId,
    deliverableId,
    actor.id,
    actor.role,
    action,
    note,
    nowIso(),
  );

  if (action === "approve") {
    enqueue({
      channel: "email",
      recipient: config.admin.email,
      subject: approvalBody({ clientName: String(client.name), projectTitle: String(project.title), note }).subject,
      body: approvalBody({ clientName: String(client.name), projectTitle: String(project.title), note }).body,
      entityType: "deliverable",
      entityId: deliverableId,
      dedupeKey: `approval-admin:${deliverableId}`,
    });
    enqueueInApp(String(client.email), `Approved: ${deliverable.title}`, "Thank you — we have recorded your approval.", "deliverable", deliverableId, `approval-inapp:${deliverableId}`);
    logEvent({
      event: "deliverable.approved",
      status: "success",
      clientId: project.client_id,
      projectId,
      detail: { deliverableId, by: actor.role },
    });
  } else {
    const body = revisionRequestBody({
      clientName: String(client.name),
      projectTitle: String(project.title),
      note,
      revisionNumber: revisionsUsed + 1,
    });
    enqueue({
      channel: "email",
      recipient: config.admin.email,
      subject: body.subject,
      body: body.body,
      entityType: "deliverable",
      entityId: deliverableId,
      dedupeKey: `revision-admin:${deliverableId}`,
    });
    enqueueInApp(String(client.email), `Revision requested: ${deliverable.title}`, "Your note is with the team. We will resubmit an updated version.", "deliverable", deliverableId, `revision-inapp:${deliverableId}`);
    logEvent({
      event: "deliverable.revision_requested",
      status: "success",
      clientId: project.client_id,
      projectId,
      detail: { deliverableId, note, revisionsUsed: revisionsUsed + 1, revisionLimit: project.revision_limit, overLimit },
    });
  }

  return { deliverable: get("SELECT * FROM deliverables WHERE id = ?", deliverableId), overLimit, revisionsUsed: action === "request_revision" ? revisionsUsed + 1 : revisionsUsed };
}

/* ------------------------------ messaging -------------------------------- */

export function addMessage(projectId: string, actor: SessionUser, body: string) {
  const text = body.trim();
  if (!text) throw badRequest("Write a message first");
  if (text.length > 5000) throw badRequest("That message is too long");
  const id = crypto.randomUUID();
  run(
    `INSERT INTO messages (id, project_id, sender_id, sender_role, sender_name, body, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    id,
    projectId,
    actor.id,
    actor.role,
    actor.name,
    text,
    nowIso(),
  );
  logEvent({ event: "message.created", status: "success", projectId, detail: { role: actor.role } });
  return get("SELECT * FROM messages WHERE id = ?", id);
}

export function listMessages(projectId: string) {
  return all("SELECT * FROM messages WHERE project_id = ? ORDER BY created_at ASC", projectId);
}

/* -------------------------- project composition -------------------------- */

export function projectBundle(projectId: string, opts: { clientView: boolean }) {
  const project = projectOrThrow(projectId);
  const client = get<Record<string, any>>("SELECT id, name, email, phone, company, status FROM clients WHERE id = ?", project.client_id);
  const questionnaire = get<Record<string, any>>("SELECT * FROM questionnaires WHERE project_id = ?", projectId);
  const answers = questionnaire
    ? all("SELECT field_key, question, answer, answered_at FROM questionnaire_answers WHERE questionnaire_id = ?", questionnaire.id)
    : [];
  return {
    project,
    client,
    milestones: all("SELECT * FROM milestones WHERE project_id = ? ORDER BY sort_order", projectId),
    tasks: listTasks(projectId, opts.clientView),
    history: all(
      "SELECT from_status, to_status, note, created_at, actor_role FROM project_status_history WHERE project_id = ? ORDER BY created_at ASC",
      projectId,
    ),
    deliverables: projectDeliverables(projectId).filter((d) => (opts.clientView ? d.status !== "draft" : true)),
    questionnaire: questionnaire ? { ...questionnaire, answers } : null,
    messages: listMessages(projectId),
    files: all(
      `SELECT id, folder_code, original_name, mime, size, visibility, created_at, deliverable_id FROM files
       WHERE project_id = ? ${opts.clientView ? "AND visibility = 'client'" : ""} ORDER BY created_at DESC`,
      projectId,
    ),
    reviews: all(
      `SELECT r.*, d.title AS deliverable_title FROM reviews r JOIN deliverables d ON d.id = r.deliverable_id
       WHERE r.project_id = ? ORDER BY r.created_at ASC`,
      projectId,
    ),
    template: getTemplate(String(project.template_key)) ?? null,
  };
}

/* --------------------------- status utilities ---------------------------- */

export function overdueProjects() {
  return all(
    `SELECT p.*, c.name AS client_name, c.email AS client_email FROM projects p JOIN clients c ON c.id = p.client_id
     WHERE p.due_date < ? AND p.status NOT IN ('completed','delivered','archived')
     ORDER BY p.due_date ASC`,
    nowIso(),
  );
}

export function upcomingDeadlines(days = 14) {
  return all(
    `SELECT p.*, c.name AS client_name FROM projects p JOIN clients c ON c.id = p.client_id
     WHERE p.due_date >= ? AND p.due_date <= ? AND p.status NOT IN ('completed','delivered','archived')
     ORDER BY p.due_date ASC`,
    nowIso(),
    addDays(days),
  );
}

export function labelsFor(status: string) {
  return PROJECT_STATUS_LABELS[status as ProjectStatus] ?? status;
}

export { progressFor };
