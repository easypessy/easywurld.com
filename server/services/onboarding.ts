import crypto from "node:crypto";
import { config } from "../config.ts";
import { addDays, all, get, nextSequence, nowIso, pad, run, tx } from "../db/db.ts";
import { isEmail } from "../lib/errors.ts";
import { createActivationToken, hashPassword } from "../auth.ts";
import { logEvent } from "./automation.ts";
import { enqueue, enqueueInApp, welcomeMessage } from "./notifications.ts";
import { getTemplate, seedTemplates } from "./templates.ts";
import { resolveTemplateKey, progressFor, type ProjectStatus } from "../../shared/ops.ts";
import { provisionWorkspace } from "./storage.ts";

export interface PurchaseInput {
  provider: string;
  reference: string;
  amountMinor: number;
  currency: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone?: string;
  serviceKey?: string;
  offerSlug?: string;
  serviceName?: string;
  verifiedVia: string;
  raw?: unknown;
  /** Set when an admin records a bank transfer they have personally confirmed. */
  manual?: boolean;
}

export interface OnboardResult {
  outcome: "created" | "duplicate" | "rejected";
  reason?: string;
  clientId?: string;
  projectId?: string;
  orderId?: string;
  activationToken?: string;
  notificationSummary?: { sent: number; failed: number; logged: number };
  workspace?: { localPath: string | null; driveFolderId: string | null; dropboxPath: string | null; errors: string[] };
}

function clientNameFrom(name: string, email: string): string {
  const trimmed = (name || "").trim();
  if (trimmed) return trimmed;
  const local = email.split("@")[0] ?? "Client";
  return local.replace(/[._-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * The purchase-to-client pipeline.
 *
 * Idempotent: `orders(provider, provider_reference)` is unique. A repeated
 * webhook returns the original project instead of creating a second one, and a
 * crashed run resumes from the recorded order.
 */
export async function recordPurchase(input: PurchaseInput): Promise<OnboardResult> {
  seedTemplates();

  const email = (input.buyerEmail || "").trim().toLowerCase();
  if (!isEmail(email)) {
    logEvent({
      event: "purchase.rejected",
      status: "rejected",
      detail: { provider: input.provider, reference: input.reference, reason: "missing or invalid customer email" },
      error: "missing or invalid customer email",
    });
    return { outcome: "rejected", reason: "A verified customer email is required before a client record can be created." };
  }

  const existingOrder = get<Record<string, any>>(
    "SELECT * FROM orders WHERE provider = ? AND provider_reference = ?",
    input.provider,
    input.reference,
  );

  if (existingOrder) {
    const linkedProject = existingOrder.project_id
      ? get<{ id: string }>("SELECT id FROM projects WHERE id = ?", existingOrder.project_id)
      : undefined;
    if (existingOrder.status === "paid" && linkedProject) {
      logEvent({
        event: "purchase.duplicate_ignored",
        status: "skipped",
        clientId: existingOrder.client_id,
        projectId: existingOrder.project_id,
        orderId: existingOrder.id,
        detail: { provider: input.provider, reference: input.reference },
      });
      return {
        outcome: "duplicate",
        clientId: existingOrder.client_id,
        projectId: existingOrder.project_id,
        orderId: existingOrder.id,
        reason: "This payment reference has already been processed.",
      };
    }
    if (existingOrder.status === "rejected" || existingOrder.status === "failed") {
      logEvent({
        event: "purchase.duplicate_ignored",
        status: "skipped",
        orderId: existingOrder.id,
        detail: { provider: input.provider, reference: input.reference, status: existingOrder.status },
      });
      return { outcome: "duplicate", orderId: existingOrder.id, reason: "This payment was already recorded as unsuccessful." };
    }
  }

  const templateKey = resolveTemplateKey({
    serviceKey: input.serviceKey,
    offerSlug: input.offerSlug,
    serviceName: input.serviceName,
  });
  const template = getTemplate(templateKey);
  if (!template) {
    logEvent({
      event: "purchase.rejected",
      status: "rejected",
      detail: { templateKey, reason: "template not found" },
    });
    return { outcome: "rejected", reason: `No project template exists for ${templateKey}` };
  }

  const start = new Date();
  const dueDate = addDays(template.defaultDays, start);
  const name = clientNameFrom(input.buyerName, email);

  const created = tx(() => {
    /* 1. client — deduplicate by email, never by name */
    let client = get<Record<string, any>>("SELECT * FROM clients WHERE email = ?", email);
    if (!client) {
      const clientId = `EW-C-${pad(nextSequence("client_seq"))}`;
      run(
        `INSERT INTO clients (id, user_id, name, email, phone, purchase_date, status, created_at, updated_at)
         VALUES (?, NULL, ?, ?, ?, ?, 'invited', ?, ?)`,
        clientId,
        name,
        email,
        input.buyerPhone ?? null,
        start.toISOString(),
        nowIso(),
        nowIso(),
      );
      client = get("SELECT * FROM clients WHERE id = ?", clientId)!;
    } else {
      run(
        `UPDATE clients SET name = COALESCE(NULLIF(?, ''), name), phone = COALESCE(NULLIF(?, ''), phone), updated_at = ?
         WHERE id = ?`,
        input.buyerName || "",
        input.buyerPhone || "",
        nowIso(),
        client.id,
      );
    }
    const clientId = String(client.id);

    /* 2. order record (idempotent) */
    let orderId = existingOrder?.id as string | undefined;
    if (existingOrder) {
      run(
        `UPDATE orders SET status = 'paid', amount_minor = ?, currency = ?, buyer_name = COALESCE(NULLIF(?, ''), buyer_name),
           buyer_phone = COALESCE(NULLIF(?, ''), buyer_phone), service_key = COALESCE(?, service_key),
           offer_slug = COALESCE(?, offer_slug), client_id = ?, verified_via = ?, verified_at = ?, raw_payload = ?
         WHERE id = ?`,
        input.amountMinor,
        input.currency,
        input.buyerName,
        input.buyerPhone ?? "",
        input.serviceKey ?? null,
        input.offerSlug ?? null,
        clientId,
        input.verifiedVia,
        nowIso(),
        JSON.stringify(input.raw ?? {}),
        existingOrder.id,
      );
    } else {
      const orderNumber = nextSequence("order_seq");
      orderId = `EW-O-${pad(orderNumber)}`;
      run(
        `INSERT INTO orders (id, provider, provider_reference, amount_minor, currency, status, buyer_name, buyer_email,
           buyer_phone, service_key, offer_slug, service_name, client_id, verified_via, raw_payload, created_at, verified_at)
         VALUES (?, ?, ?, ?, ?, 'paid', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        orderId,
        input.provider,
        input.reference,
        input.amountMinor,
        input.currency,
        input.buyerName || name,
        email,
        input.buyerPhone ?? null,
        input.serviceKey ?? null,
        input.offerSlug ?? null,
        input.serviceName ?? template.name,
        clientId,
        input.verifiedVia,
        JSON.stringify(input.raw ?? {}),
        nowIso(),
        nowIso(),
      );
    }

    /* 3. project */
    const projectNumber = nextSequence("project_seq");
    const projectId = `EW-P-${pad(projectNumber)}`;
    const projectTitle = input.serviceName?.trim() || template.name;
    run(
      `INSERT INTO projects (id, client_id, order_id, title, service_key, template_key, description, status,
         start_date, due_date, progress, revision_limit, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'awaiting_onboarding', ?, ?, ?, ?, ?, ?)`,
      projectId,
      clientId,
      orderId,
      projectTitle,
      template.key,
      template.key,
      template.description,
      start.toISOString(),
      dueDate,
      progressFor("awaiting_onboarding" as ProjectStatus),
      template.revisionLimit,
      nowIso(),
      nowIso(),
    );

    run(
      `UPDATE orders SET project_id = ? WHERE id = ?`,
      projectId,
      orderId,
    );

    run(
      `INSERT INTO project_status_history (id, project_id, from_status, to_status, actor_id, actor_role, note, created_at)
       VALUES (?, ?, NULL, 'awaiting_onboarding', ?, 'system', ?, ?)`,
      crypto.randomUUID(),
      projectId,
      null,
      `Created from ${input.provider} payment ${input.reference}`,
      nowIso(),
    );

    /* 4. milestones + tasks + deadlines from the template */
    template.milestones.forEach((m, i) => {
      run(
        `INSERT INTO milestones (id, project_id, title, due_date, status, sort_order, created_at)
         VALUES (?, ?, ?, ?, 'pending', ?, ?)`,
        crypto.randomUUID(),
        projectId,
        m.title,
        addDays(m.offsetDays, start),
        i,
        nowIso(),
      );
    });
    template.tasks.forEach((t, i) => {
      run(
        `INSERT INTO tasks (id, project_id, title, description, priority, due_date, status, visible_to_client,
           sort_order, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, 'todo', ?, ?, ?, ?)`,
        crypto.randomUUID(),
        projectId,
        t.title,
        t.description ?? null,
        t.priority,
        addDays(t.offsetDays, start),
        t.visibleToClient ? 1 : 0,
        i,
        nowIso(),
        nowIso(),
      );
    });

    /* 5. service-specific onboarding questionnaire */
    const questionnaireId = crypto.randomUUID();
    run(
      `INSERT INTO questionnaires (id, project_id, template_key, status, created_at) VALUES (?, ?, ?, 'pending', ?)`,
      questionnaireId,
      projectId,
      template.key,
      nowIso(),
    );

    /* 6. client login (invite only — no password exists until they accept) */
    let userId = client.user_id as string | null;
    let activationToken: string | undefined;
    if (!userId) {
      const existingUser = get<{ id: string; role: string }>("SELECT id, role FROM users WHERE email = ?", email);
      if (existingUser && existingUser.role === "client") {
        userId = existingUser.id;
      } else if (!existingUser) {
        userId = crypto.randomUUID();
        run(
          `INSERT INTO users (id, role, email, name, phone, password_hash, status, created_at)
           VALUES (?, 'client', ?, ?, ?, NULL, 'invited', ?)`,
          userId,
          email,
          name,
          input.buyerPhone ?? null,
          nowIso(),
        );
        activationToken = createActivationToken(userId, "activate");
      } else {
        // An admin email was used for a purchase; do not overwrite that account.
        userId = null;
      }
      if (userId) {
        run("UPDATE clients SET user_id = ?, status = 'onboarding', updated_at = ? WHERE id = ?", userId, nowIso(), clientId);
      }
    } else {
      run("UPDATE clients SET status = 'onboarding', updated_at = ? WHERE id = ?", nowIso(), clientId);
    }

    /* 7. notifications (queued inside the transaction, delivered after commit) */
    const portalUrl = config.admin.siteUrl;
    const welcome = welcomeMessage({
      clientName: name,
      projectTitle,
      service: template.name,
      portalUrl,
      dueDate,
    });
    enqueue({
      channel: "email",
      recipient: email,
      subject: welcome.subject,
      body: welcome.body,
      entityType: "project",
      entityId: projectId,
      dedupeKey: `welcome:${projectId}`,
    });
    enqueueInApp(email, welcome.subject, welcome.body, "project", projectId, `welcome-inapp:${projectId}`);

    enqueue({
      channel: "email",
      recipient: config.admin.email,
      subject: `New ${input.manual ? "recorded sale" : "purchase"}: ${projectTitle} (${projectId})`,
      body: [
        `Client: ${name} <${email}>`,
        `Project: ${projectTitle} (${projectId})`,
        `Template: ${template.name} — ${template.tasks.length} tasks, due ${new Date(dueDate).toDateString()}`,
        `Amount: ${(input.amountMinor / 100).toFixed(2)} ${input.currency}`,
        `Reference: ${input.provider} / ${input.reference}`,
        ``,
        `Open the admin dashboard: ${portalUrl}/admin`,
      ].join("\n"),
      entityType: "project",
      entityId: projectId,
      dedupeKey: `admin-newproject:${projectId}`,
    });

    /* 8. automation trail */
    logEvent({
      event: "purchase.verified",
      status: "success",
      clientId,
      projectId,
      orderId,
      detail: { provider: input.provider, reference: input.reference, verifiedVia: input.verifiedVia, manual: Boolean(input.manual) },
    });
    logEvent({
      event: "project.created",
      status: "success",
      clientId,
      projectId,
      orderId,
      detail: { template: template.key, tasks: template.tasks.length, milestones: template.milestones.length, dueDate },
    });
    if (activationToken) {
      logEvent({
        event: "client.invited",
        status: "success",
        clientId,
        projectId,
        detail: { email, note: "activation link valid for 14 days" },
      });
    }

    return { clientId, projectId, orderId: orderId!, activationToken, activationExpiresInDays: 14 };
  });

  /* 9. post-commit side effects: workspace folders + notification delivery */
  const client = get<Record<string, any>>("SELECT * FROM clients WHERE id = ?", created.clientId)!;
  const project = get<Record<string, any>>("SELECT * FROM projects WHERE id = ?", created.projectId)!;

  const workspace = await provisionWorkspace({
    clientId: created.clientId,
    clientName: String(client.name),
    clientEmail: email,
    projectId: created.projectId,
    projectTitle: String(project.title),
  });

  const { dispatchPending } = await import("./notifications.ts");
  const notificationSummary = await dispatchPending(10);

  return {
    outcome: "created",
    clientId: created.clientId,
    projectId: created.projectId,
    orderId: created.orderId,
    activationToken: created.activationToken,
    notificationSummary,
    workspace,
  };
}

/** Public checkout intent: recorded, unverified, awaiting confirmation. */
export function createIntent(input: {
  buyerName: string;
  buyerEmail: string;
  buyerPhone?: string;
  serviceKey?: string;
  offerSlug?: string;
  serviceName?: string;
  amountMinor?: number;
  currency?: string;
  provider?: string;
}): { orderId: string } {
  const email = (input.buyerEmail || "").trim().toLowerCase();
  if (!isEmail(email)) throw new Error("A valid email is required");
  const orderId = `EW-O-${pad(nextSequence("order_seq"))}`;
  const reference = `intent-${orderId}-${crypto.randomBytes(4).toString("hex")}`;
  run(
    `INSERT INTO orders (id, provider, provider_reference, amount_minor, currency, status, buyer_name, buyer_email,
       buyer_phone, service_key, offer_slug, service_name, created_at)
     VALUES (?, 'intent', ?, ?, ?, 'pending', ?, ?, ?, ?, ?, ?, ?)`,
    orderId,
    reference,
    input.amountMinor ?? 0,
    (input.currency ?? "NGN").toUpperCase(),
    input.buyerName ?? "",
    email,
    input.buyerPhone ?? null,
    input.serviceKey ?? null,
    input.offerSlug ?? null,
    input.serviceName ?? null,
    nowIso(),
  );
  logEvent({ event: "purchase.intent", status: "success", orderId, detail: { email, offerSlug: input.offerSlug, serviceKey: input.serviceKey } });
  return { orderId };
}

export function pendingIntents(limit = 50) {
  return all(
    `SELECT * FROM orders WHERE status = 'pending' ORDER BY created_at DESC LIMIT ?`,
    limit,
  );
}
