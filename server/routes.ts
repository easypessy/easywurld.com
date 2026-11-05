import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import express, { type NextFunction, type Request, type Response, type Router } from "express";
import { config, integrationStatus } from "./config.ts";
import { all, get, nowIso, run } from "./db/db.ts";
import {
  attachUser,
  clearCookie,
  clearLoginThrottle,
  consumeActivationToken,
  createActivationToken,
  createSession,
  hashPassword,
  passwordProblem,
  requireAuth,
  requireRole,
  revokeAllSessions,
  revokeSession,
  sessionCookie,
  throttleLogin,
  verifyPassword,
} from "./auth.ts";
import { badRequest, forbidden, isEmail, notFound, unauthorized } from "./lib/errors.ts";
import { auditFor, logEvent, recordAudit, resolveEvent, recentEvents } from "./services/automation.ts";
import { dispatchPending, inAppFor, outbox } from "./services/notifications.ts";
import { createIntent, pendingIntents, recordPurchase } from "./services/onboarding.ts";
import { interpret, paymentAmountProblem, signatureCheck } from "./services/payments.ts";
import { getTemplate, listTemplates, updateTemplate } from "./services/templates.ts";
import {
  addMessage,
  clientProjectOrThrow,
  createTask,
  completeMilestone,
  decideDeliverable,
  listMessages,
  projectBundle,
  projectOrThrow,
  setProjectStatus,
  submitDeliverable,
  updateTask,
} from "./services/projects.ts";
import { authoriseFile, fileRecord, projectFileList, receiveUpload, resolveFilePath } from "./services/files.ts";
import { deleteClientData, listClients, listProjects, overview, retryWorkspace, updateClient } from "./services/admin.ts";
import { PROJECT_STATUS_LABELS, type ProjectStatus, type TaskStatus } from "../shared/ops.ts";

const asyn = <T extends (req: Request, res: Response, next: NextFunction) => Promise<unknown>>(fn: T) =>
  (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };

const str = (value: unknown, max = 500): string => (typeof value === "string" ? value.trim().slice(0, max) : "");

/* ------------------------------- auth ----------------------------------- */

export const authRouter: Router = express.Router();

authRouter.post("/login", (req, res, next) => {
  try {
    const email = str(req.body?.email, 200).toLowerCase();
    const password = str(req.body?.password, 300);
    if (!isEmail(email) || !password) throw badRequest("Enter your email and password.");
    const key = `${req.ip}:${email}`;
    throttleLogin(key);

    const user = get<Record<string, any>>("SELECT * FROM users WHERE email = ?", email);
    if (!user || !verifyPassword(password, user.password_hash) || user.status !== "active") {
      recordAudit(req, "auth.login.failed", { type: "user", id: email });
      throw unauthorized("Those details do not match an active account.");
    }
    clearLoginThrottle(key);
    const token = createSession(user.id, req);
    run("UPDATE users SET last_login_at = ? WHERE id = ?", nowIso(), user.id);
    recordAudit(req, "auth.login", { type: "user", id: user.id });
    res.setHeader("Set-Cookie", sessionCookie(token));
    res.json({
      user: { id: user.id, role: user.role, name: user.name, email: user.email },
      redirect: user.role === "admin" ? "/admin" : "/portal",
    });
  } catch (err) {
    next(err);
  }
});

authRouter.post("/logout", (req, res) => {
  revokeSession(req);
  res.setHeader("Set-Cookie", clearCookie());
  res.json({ ok: true });
});

authRouter.get("/me", attachUser, (req, res) => {
  if (!req.user) return res.json({ user: null });
  res.json({
    user: req.user,
    client: req.clientRecord ?? null,
    redirect: req.user.role === "admin" ? "/admin" : "/portal",
  });
});

authRouter.get("/activation/:token", (req, res, next) => {
  try {
    const row = get<Record<string, any>>(
      `SELECT t.expires_at, t.used_at, u.email, u.name FROM activation_tokens t JOIN users u ON u.id = t.user_id
       WHERE t.token_hash = ?`,
      crypto.createHash("sha256").update(req.params.token).digest("hex"),
    );
    if (!row || row.used_at || new Date(row.expires_at).getTime() < Date.now()) {
      throw badRequest("That invite link has expired. Ask Easywurld to send a fresh one.");
    }
    res.json({ email: row.email, name: row.name });
  } catch (err) {
    next(err);
  }
});

authRouter.post("/activate", (req, res, next) => {
  try {
    const token = str(req.body?.token, 400);
    const password = str(req.body?.password, 300);
    const problem = passwordProblem(password);
    if (problem) throw badRequest(problem);
    const consumed = consumeActivationToken(token);
    if (!consumed) throw badRequest("That invite link has expired. Ask Easywurld to send a fresh one.");
    run(
      "UPDATE users SET password_hash = ?, status = 'active' WHERE id = ?",
      hashPassword(password),
      consumed.userId,
    );
    const user = get<Record<string, any>>("SELECT * FROM users WHERE id = ?", consumed.userId)!;
    const session = createSession(user.id, req);
    recordAudit(req, "auth.activated", { type: "user", id: user.id });
    res.setHeader("Set-Cookie", sessionCookie(session));
    res.json({
      user: { id: user.id, role: user.role, name: user.name, email: user.email },
      redirect: user.role === "admin" ? "/admin" : "/portal",
    });
  } catch (err) {
    next(err);
  }
});

authRouter.post("/password-reset/request", (req, res, next) => {
  try {
    const email = str(req.body?.email, 200).toLowerCase();
    if (!isEmail(email)) throw badRequest("Enter the email on your account.");
    const user = get<Record<string, any>>("SELECT * FROM users WHERE email = ? AND status = 'active'", email);
    if (user) {
      const token = createActivationToken(user.id, "reset");
      const link = `${config.admin.siteUrl}/login?reset=${token}`;
      // Delivered by the notification outbox; never returned in the response.
      run(
        `INSERT INTO notifications (id, channel, recipient, subject, body, entity_type, entity_id, status, dedupe_key, created_at)
         VALUES (?, 'email', ?, ?, ?, 'user', ?, 'queued', ?, ?)`,
        crypto.randomUUID(),
        email,
        "Reset your Easywurld password",
        `Use this link within 14 days to set a new password:\n${link}\n\nIf you did not ask for this, ignore the email.`,
        user.id,
        `reset:${token}`,
        nowIso(),
      );
    }
    res.json({ ok: true, message: "If that email is registered, a reset link is on its way." });
  } catch (err) {
    next(err);
  }
});

authRouter.post("/password-reset/confirm", (req, res, next) => {
  try {
    const token = str(req.body?.token, 400);
    const password = str(req.body?.password, 300);
    const problem = passwordProblem(password);
    if (problem) throw badRequest(problem);
    const consumed = consumeActivationToken(token);
    if (!consumed) throw badRequest("That reset link has expired.");
    run("UPDATE users SET password_hash = ?, status = 'active' WHERE id = ?", hashPassword(password), consumed.userId);
    revokeAllSessions(consumed.userId);
    recordAudit(req, "auth.password_reset", { type: "user", id: consumed.userId });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

authRouter.post("/change-password", attachUser, requireAuth, (req, res, next) => {
  try {
    const current = str(req.body?.currentPassword, 300);
    const next_ = str(req.body?.newPassword, 300);
    const problem = passwordProblem(next_);
    if (problem) throw badRequest(problem);
    const user = get<Record<string, any>>("SELECT * FROM users WHERE id = ?", req.user!.id)!;
    if (!verifyPassword(current, user.password_hash)) throw badRequest("Your current password is incorrect.");
    run("UPDATE users SET password_hash = ? WHERE id = ?", hashPassword(next_), user.id);
    revokeAllSessions(user.id);
    res.json({ ok: true, message: "Password updated. Sign in again." });
  } catch (err) {
    next(err);
  }
});

/* ----------------------------- public ---------------------------------- */

export const publicRouter: Router = express.Router();

const intentHits = new Map<string, { count: number; resetAt: number }>();
function intentLimit(ip: string) {
  const now = Date.now();
  const entry = intentHits.get(ip);
  if (!entry || entry.resetAt < now) {
    intentHits.set(ip, { count: 1, resetAt: now + 3600_000 });
    return;
  }
  entry.count += 1;
  if (entry.count > 5) throw forbidden("Too many requests. Contact us on WhatsApp instead.");
}

publicRouter.get("/templates", (_req, res) => {
  res.json({
    templates: listTemplates().map((t) => ({ key: t.key, name: t.name, category: t.category, description: t.description })),
  });
});

publicRouter.post("/intent", (req, res, next) => {
  try {
    intentLimit(req.ip ?? "unknown");
    const email = str(req.body?.email, 200).toLowerCase();
    if (!isEmail(email)) throw badRequest("A valid email address is required.");
    const name = str(req.body?.name, 200);
    if (!name) throw badRequest("Tell us your name.");
    const { orderId } = createIntent({
      buyerName: name,
      buyerEmail: email,
      buyerPhone: str(req.body?.phone, 40) || undefined,
      serviceKey: str(req.body?.serviceKey, 60) || undefined,
      offerSlug: str(req.body?.offerSlug, 120) || undefined,
      serviceName: str(req.body?.serviceName, 200) || undefined,
      amountMinor: Number(req.body?.amountMinor ?? 0) || undefined,
      currency: str(req.body?.currency, 8) || "NGN",
    });
    res.status(201).json({
      orderId,
      message:
        "Request received. Complete payment on the details shared on WhatsApp; your workspace opens automatically once our team confirms the transfer.",
    });
  } catch (err) {
    next(err);
  }
});

publicRouter.get("/health", (_req, res) => {
  res.json({ ok: true, time: nowIso(), integrations: integrationStatus() });
});

/* ---------------------------- webhooks --------------------------------- */

export const webhookRouter: Router = express.Router();

webhookRouter.post("/payments/:provider", asyn(async (req, res) => {
  const provider = String(req.params.provider).toLowerCase();
  const check = signatureCheck(provider, req);
  if (!check.ok) {
    logEvent({
      event: "purchase.signature_rejected",
      status: "rejected",
      detail: { provider, why: check.why },
      error: check.why,
    });
    return res.status(401).json({ ok: false, error: "Invalid signature" });
  }

  const payment = await interpret(provider, req.body);
  if (payment.status === "ignored") {
    logEvent({
      event: "purchase.ignored",
      status: "skipped",
      detail: { provider, reference: payment.reference, reason: payment.reason },
    });
    return res.status(200).json({ ok: true, ignored: true });
  }
  if (payment.status === "failed") {
    run(
      `INSERT INTO orders (id, provider, provider_reference, amount_minor, currency, status, buyer_email, raw_payload, created_at)
       VALUES (?, ?, ?, ?, ?, 'failed', ?, ?, ?)
       ON CONFLICT(provider, provider_reference) DO UPDATE SET status = 'failed', raw_payload = excluded.raw_payload`,
      `EW-X-${crypto.randomBytes(4).toString("hex")}`,
      provider,
      payment.reference || crypto.randomUUID(),
      payment.amountMinor,
      payment.currency,
      payment.buyerEmail || null,
      JSON.stringify(payment.raw),
      nowIso(),
    );
    logEvent({
      event: "purchase.failed",
      status: "failed",
      detail: { provider, reference: payment.reference, reason: payment.reason },
    });
    return res.status(200).json({ ok: true, activated: false });
  }

  const amountProblem = paymentAmountProblem(payment);
  if (amountProblem) {
    logEvent({
      event: "purchase.rejected",
      status: "rejected",
      detail: { provider, reference: payment.reference, amountMinor: payment.amountMinor, currency: payment.currency },
      error: amountProblem,
    });
    return res.status(200).json({ ok: true, activated: false, reason: amountProblem });
  }

  const result = await recordPurchase({
    provider,
    reference: payment.reference,
    amountMinor: payment.amountMinor,
    currency: payment.currency,
    buyerName: payment.buyerName,
    buyerEmail: payment.buyerEmail,
    buyerPhone: payment.buyerPhone,
    serviceKey: payment.serviceKey,
    offerSlug: payment.offerSlug,
    serviceName: payment.serviceName,
    verifiedVia: payment.verifiedVia,
    raw: payment.raw,
  });

  res.status(200).json({
    ok: true,
    outcome: result.outcome,
    clientId: result.clientId,
    projectId: result.projectId,
    orderId: result.orderId,
    reason: result.reason,
  });
}));

/* ------------------------------ files ---------------------------------- */

export const fileRouter: Router = express.Router();

fileRouter.get("/:fileId/download", attachUser, requireAuth, (req, res, next) => {
  try {
    const file = fileRecord(req.params.fileId);
    if (!file) throw notFound("File not found");
    authoriseFile(file, req.user!, req.clientRecord?.id);
    const filePath = resolveFilePath(file);
    if (!fs.existsSync(filePath)) throw notFound("The stored copy is missing. Ask the team to re-upload.");
    recordAudit(req, "file.downloaded", { type: "file", id: file.id, detail: { projectId: file.project_id } });
    const safeName = String(file.original_name).replace(/["\\\r\n]/g, "_");
    res.setHeader("Content-Type", file.mime || "application/octet-stream");
    res.setHeader("Content-Disposition", `attachment; filename="${safeName}"`);
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Cache-Control", "private, no-store");
    fs.createReadStream(filePath).pipe(res);
  } catch (err) {
    next(err);
  }
});

/* ------------------------------ portal --------------------------------- */

export const portalRouter: Router = express.Router();
portalRouter.use(attachUser, requireRole("client"));

function requireClientRecord(req: Request) {
  if (!req.clientRecord) throw forbidden("No client record is linked to this login. Contact Easywurld.");
  return req.clientRecord;
}

portalRouter.get("/overview", (req, res, next) => {
  try {
    const client = requireClientRecord(req);
    const projects = all<Record<string, any>>(
      `SELECT p.id, p.title, p.status, p.progress, p.start_date, p.due_date, p.revision_limit, p.revisions_used,
         (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id AND t.visible_to_client = 1 AND t.status != 'done') AS open_requirements,
         (SELECT COUNT(*) FROM deliverables d WHERE d.project_id = p.id AND d.status IN ('submitted','revision_requested')) AS awaiting_client,
         (SELECT q.status FROM questionnaires q WHERE q.project_id = p.id) AS questionnaire_status
       FROM projects p WHERE p.client_id = ? AND p.status != 'archived' ORDER BY p.created_at DESC`,
      client.id,
    );
    res.json({
      client: get("SELECT id, name, email, phone, company, status, purchase_date FROM clients WHERE id = ?", client.id),
      projects,
      notifications: inAppFor(client.email, 15),
      recentFiles: all(
        `SELECT f.id, f.original_name, f.size, f.created_at, f.project_id, p.title AS project_title
         FROM files f JOIN projects p ON p.id = f.project_id
         WHERE f.client_id = ? AND f.visibility = 'client' ORDER BY f.created_at DESC LIMIT 8`,
        client.id,
      ),
      awaitingApproval: all(
        `SELECT d.id, d.title, d.version, d.submitted_at, d.project_id, p.title AS project_title
         FROM deliverables d JOIN projects p ON p.id = d.project_id
         WHERE p.client_id = ? AND d.status IN ('submitted','revision_requested') ORDER BY d.submitted_at ASC`,
        client.id,
      ),
    });
  } catch (err) {
    next(err);
  }
});

portalRouter.get("/projects/:projectId", (req, res, next) => {
  try {
    const client = requireClientRecord(req);
    clientProjectOrThrow(req.params.projectId, client.id);
    res.json(projectBundle(req.params.projectId, { clientView: true }));
  } catch (err) {
    next(err);
  }
});

portalRouter.post("/projects/:projectId/questionnaire", (req, res, next) => {
  try {
    const client = requireClientRecord(req);
    const project = clientProjectOrThrow(req.params.projectId, client.id);
    const questionnaire = get<Record<string, any>>("SELECT * FROM questionnaires WHERE project_id = ?", project.id);
    if (!questionnaire) throw notFound("This project has no questionnaire");
    if (questionnaire.status === "submitted") throw badRequest("Your onboarding answers are already submitted. Send a message if something changed.");

    const template = getTemplate(String(project.template_key));
    if (!template) throw badRequest("The questionnaire template is missing");
    const answers = req.body?.answers ?? {};
    const missing: string[] = [];
    for (const field of template.questionnaire) {
      const raw = answers[field.key];
      const value = Array.isArray(raw) ? raw.join(", ") : str(raw, 5000);
      if (field.required && !value) missing.push(field.label);
    }
    if (missing.length) throw badRequest(`Please complete: ${missing.join(", ")}`, { missing });

    const submittedAt = nowIso();
    for (const field of template.questionnaire) {
      const raw = answers[field.key];
      const value = Array.isArray(raw) ? raw.join(", ") : str(raw, 5000);
      if (!value) continue;
      run(
        `INSERT INTO questionnaire_answers (id, questionnaire_id, field_key, question, answer, answered_at)
         VALUES (?, ?, ?, ?, ?, ?)
         ON CONFLICT(questionnaire_id, field_key) DO UPDATE SET answer = excluded.answer, answered_at = excluded.answered_at`,
        crypto.randomUUID(),
        questionnaire.id,
        field.key,
        field.label,
        value,
        submittedAt,
      );
    }
    run("UPDATE questionnaires SET status = 'submitted', submitted_at = ? WHERE id = ?", submittedAt, questionnaire.id);

    // Material collection is the next milestone in the pipeline.
    const current = get<Record<string, any>>("SELECT status FROM projects WHERE id = ?", project.id)!;
    if (["awaiting_onboarding", "awaiting_client_materials"].includes(current.status)) {
      const stillNeedsFiles = template.questionnaire.some((f) => /upload|photo|video|asset|material|content bank/i.test(f.label));
      setProjectStatus(project.id, stillNeedsFiles ? "awaiting_client_materials" : "ready_to_start", req.user!, "Client submitted onboarding questionnaire");
    }

    run(
      `INSERT INTO notifications (id, channel, recipient, subject, body, entity_type, entity_id, status, dedupe_key, created_at)
       VALUES (?, 'email', ?, ?, ?, 'questionnaire', ?, 'queued', ?, ?)`,
      crypto.randomUUID(),
      config.admin.email,
      `Onboarding submitted — ${project.title}`,
      `${client.name} completed the onboarding questionnaire for ${project.id}.`,
      questionnaire.id,
      `onboarding-submitted-admin:${questionnaire.id}`,
      nowIso(),
    );
    logEvent({ event: "onboarding.submitted", status: "success", clientId: client.id, projectId: project.id });
    void dispatchPending(5).catch(() => undefined);
    res.json({ ok: true, questionnaire: get("SELECT * FROM questionnaires WHERE id = ?", questionnaire.id) });
  } catch (err) {
    next(err);
  }
});

portalRouter.post("/projects/:projectId/files", asyn(async (req, res) => {
  const client = requireClientRecord(req);
  const project = clientProjectOrThrow(req.params.projectId, client.id);
  const result = await receiveUpload(req, {
    projectId: project.id,
    clientId: client.id,
    projectTitle: project.title,
    clientName: client.name,
    actor: req.user!,
    folderCode: "02",
    visibility: "client",
  });
  run(
    `INSERT INTO notifications (id, channel, recipient, subject, body, entity_type, entity_id, status, dedupe_key, created_at)
     VALUES (?, 'email', ?, ?, ?, 'file', ?, 'queued', ?, ?)`,
    crypto.randomUUID(),
    config.admin.email,
    `New client upload — ${project.title}`,
    `${client.name} uploaded ${result.originalName} (${Math.round(result.size / 1024)} KB) to project ${project.id}.`,
    result.id,
    `upload-admin:${result.id}`,
    nowIso(),
  );
  void dispatchPending(5).catch(() => undefined);
  res.status(201).json({ ok: true, file: result });
}));

portalRouter.post("/projects/:projectId/deliverables/:deliverableId/decision", (req, res, next) => {
  try {
    const client = requireClientRecord(req);
    clientProjectOrThrow(req.params.projectId, client.id);
    const action = req.body?.action === "approve" ? "approve" : req.body?.action === "request_revision" ? "request_revision" : null;
    if (!action) throw badRequest("Choose approve or request a revision.");
    const outcome = decideDeliverable(req.params.projectId, req.params.deliverableId, action, str(req.body?.note, 3000), {
      id: req.user!.id,
      role: "client",
      name: req.user!.name,
    });
    recordAudit(req, `deliverable.${action}`, { type: "deliverable", id: req.params.deliverableId });
    void dispatchPending(5).catch(() => undefined);
    res.json({ ok: true, ...outcome });
  } catch (err) {
    next(err);
  }
});

portalRouter.post("/projects/:projectId/messages", (req, res, next) => {
  try {
    const client = requireClientRecord(req);
    clientProjectOrThrow(req.params.projectId, client.id);
    const message = addMessage(req.params.projectId, req.user!, str(req.body?.body, 5000));
    res.status(201).json({ ok: true, message });
  } catch (err) {
    next(err);
  }
});

portalRouter.get("/projects/:projectId/messages", (req, res, next) => {
  try {
    const client = requireClientRecord(req);
    clientProjectOrThrow(req.params.projectId, client.id);
    run(
      "UPDATE messages SET read_by_client_at = ? WHERE project_id = ? AND sender_role = 'admin' AND read_by_client_at IS NULL",
      nowIso(),
      req.params.projectId,
    );
    res.json({ messages: listMessages(req.params.projectId) });
  } catch (err) {
    next(err);
  }
});

/* ------------------------------- admin --------------------------------- */

export const adminRouter: Router = express.Router();
adminRouter.use(attachUser, requireRole("admin"));

adminRouter.get("/overview", (_req, res, next) => {
  try {
    res.json({ ...overview(), integrations: integrationStatus() });
  } catch (err) {
    next(err);
  }
});

adminRouter.get("/clients", (req, res) => {
  res.json({ clients: listClients(str(req.query.q, 100)) });
});

adminRouter.patch("/clients/:clientId", (req, res, next) => {
  try {
    const updated = updateClient(req.params.clientId, req.body ?? {});
    recordAudit(req, "client.updated", { type: "client", id: req.params.clientId, detail: req.body });
    res.json({ ok: true, client: updated });
  } catch (err) {
    next(err);
  }
});

adminRouter.delete("/clients/:clientId", (req, res, next) => {
  try {
    if (req.body?.confirm !== req.params.clientId) {
      throw badRequest("Send { confirm: \"<clientId>\" } to confirm permanent deletion.");
    }
    const result = deleteClientData(req.params.clientId, req);
    res.json({ ok: true, ...result });
  } catch (err) {
    next(err);
  }
});

adminRouter.get("/clients/:clientId/projects", (req, res) => {
  res.json({
    projects: all("SELECT * FROM projects WHERE client_id = ? ORDER BY created_at DESC", req.params.clientId),
    client: get("SELECT * FROM clients WHERE id = ?", req.params.clientId),
  });
});

adminRouter.get("/projects", (req, res) => {
  res.json({ projects: listProjects({ status: str(req.query.status, 40) || undefined, q: str(req.query.q, 100) || undefined }) });
});

adminRouter.get("/projects/:projectId", (req, res, next) => {
  try {
    const bundle = projectBundle(req.params.projectId, { clientView: false });
    const project = projectOrThrow(req.params.projectId);
    const client = get<Record<string, any>>("SELECT * FROM clients WHERE id = ?", project.client_id);
    res.json({
      ...bundle,
      client,
      internal: {
        files: projectFileList(req.params.projectId, false),
        audit: auditFor("project", req.params.projectId),
        events: all(
          "SELECT * FROM automation_events WHERE project_id = ? ORDER BY created_at DESC LIMIT 40",
          req.params.projectId,
        ),
        order: project.order_id ? get("SELECT * FROM orders WHERE id = ?", project.order_id) : null,
      },
      template: getTemplate(String(project.template_key)),
    });
  } catch (err) {
    next(err);
  }
});

adminRouter.patch("/projects/:projectId", (req, res, next) => {
  try {
    const project = projectOrThrow(req.params.projectId);
    const dueDate = str(req.body?.dueDate, 40) || project.due_date;
    const revisionLimit = Number.isFinite(Number(req.body?.revisionLimit)) ? Math.max(0, Number(req.body.revisionLimit)) : project.revision_limit;
    const title = str(req.body?.title, 200) || project.title;
    run(
      "UPDATE projects SET due_date = ?, revision_limit = ?, title = ?, updated_at = ? WHERE id = ?",
      dueDate,
      revisionLimit,
      title,
      nowIso(),
      project.id,
    );
    recordAudit(req, "project.updated", { type: "project", id: project.id, detail: { dueDate, revisionLimit, title } });
    res.json({ ok: true, project: projectOrThrow(project.id) });
  } catch (err) {
    next(err);
  }
});

adminRouter.post("/projects/:projectId/status", (req, res, next) => {
  try {
    const status = str(req.body?.status, 40) as ProjectStatus;
    if (!PROJECT_STATUS_LABELS[status]) throw badRequest("Unknown status");
    const project = setProjectStatus(req.params.projectId, status, req.user!, str(req.body?.note, 500));
    recordAudit(req, "project.status_changed", { type: "project", id: project.id, detail: { status } });
    res.json({ ok: true, project });
  } catch (err) {
    next(err);
  }
});

adminRouter.post("/projects/:projectId/tasks", (req, res, next) => {
  try {
    const task = createTask(req.params.projectId, {
      title: str(req.body?.title, 200),
      description: str(req.body?.description, 2000) || null,
      priority: str(req.body?.priority, 10) || "normal",
      dueDate: str(req.body?.dueDate, 40) || null,
      visibleToClient: Boolean(req.body?.visibleToClient),
    });
    recordAudit(req, "task.created", { type: "project", id: req.params.projectId, detail: { title: req.body?.title } });
    res.status(201).json({ ok: true, task });
  } catch (err) {
    next(err);
  }
});

adminRouter.patch("/tasks/:taskId", (req, res, next) => {
  try {
    const patch: Record<string, unknown> = {};
    if (req.body?.status) {
      const status = str(req.body.status, 20) as TaskStatus;
      if (!["todo", "in_progress", "blocked", "done"].includes(status)) throw badRequest("Unknown task status");
      patch.status = status;
    }
    if (req.body?.title !== undefined) patch.title = str(req.body.title, 200);
    if (req.body?.priority !== undefined) patch.priority = str(req.body.priority, 10);
    if (req.body?.dueDate !== undefined) patch.dueDate = str(req.body.dueDate, 40);
    if (req.body?.visibleToClient !== undefined) patch.visibleToClient = Boolean(req.body.visibleToClient);
    const task = updateTask(req.params.taskId, patch);
    recordAudit(req, "task.updated", { type: "task", id: req.params.taskId, detail: patch });
    res.json({ ok: true, task });
  } catch (err) {
    next(err);
  }
});

adminRouter.post("/milestones/:milestoneId/complete", (req, res, next) => {
  try {
    const milestone = completeMilestone(req.params.milestoneId, req.user!);
    res.json({ ok: true, milestone });
  } catch (err) {
    next(err);
  }
});

adminRouter.post("/projects/:projectId/files", asyn(async (req, res) => {
  const project = projectOrThrow(req.params.projectId);
  const client = get<Record<string, any>>("SELECT * FROM clients WHERE id = ?", project.client_id)!;
  const folder = str(req.query.folder, 2) || "03";
  const folderCode = (["01", "02", "03", "04", "05", "06"].includes(folder) ? folder : "03") as "01" | "02" | "03" | "04" | "05" | "06";
  const visibility = req.query.visibility === "client" ? "client" : "internal";
  const result = await receiveUpload(req, {
    projectId: project.id,
    clientId: String(client.id),
    projectTitle: String(project.title),
    clientName: String(client.name),
    actor: req.user!,
    folderCode,
    visibility,
  });
  res.status(201).json({ ok: true, file: result });
}));

adminRouter.post("/projects/:projectId/deliverables", (req, res, next) => {
  try {
    const deliverable = submitDeliverable(
      req.params.projectId,
      {
        title: str(req.body?.title, 200),
        description: str(req.body?.description, 2000),
        fileId: str(req.body?.fileId, 60) || undefined,
        externalUrl: str(req.body?.externalUrl, 500) || undefined,
      },
      req.user!,
    );
    recordAudit(req, "deliverable.submitted", { type: "deliverable", id: String(deliverable?.id) });
    void dispatchPending(5).catch(() => undefined);
    res.status(201).json({ ok: true, deliverable });
  } catch (err) {
    next(err);
  }
});

adminRouter.post("/projects/:projectId/messages", (req, res, next) => {
  try {
    projectOrThrow(req.params.projectId);
    const message = addMessage(req.params.projectId, req.user!, str(req.body?.body, 5000));
    res.status(201).json({ ok: true, message });
  } catch (err) {
    next(err);
  }
});

adminRouter.post("/projects/:projectId/retry-workspace", asyn(async (req, res) => {
  const result = await retryWorkspace(req.params.projectId);
  res.json({ ok: result.errors.length === 0, workspace: result });
}));

adminRouter.post("/purchases/manual", asyn(async (req, res) => {
  const email = str(req.body?.email, 200).toLowerCase();
  if (!isEmail(email)) throw badRequest("A valid client email is required.");
  const reference = str(req.body?.reference, 120) || `manual-${crypto.randomBytes(4).toString("hex")}`;
  if (!str(req.body?.reference, 120)) {
    throw badRequest("Record the bank transfer or payment reference so the sale can be traced.");
  }
  const amount = Number(req.body?.amountMinor ?? req.body?.amount ?? 0);
  const amountMinor = Number.isFinite(amount) && amount > 0 ? (req.body?.amountMinor ? Math.round(amount) : Math.round(amount * 100)) : 0;
  if (amountMinor <= 0) throw badRequest("Record the amount received.");

  const result = await recordPurchase({
    provider: "manual",
    reference,
    amountMinor,
    currency: str(req.body?.currency, 8) || "NGN",
    buyerName: str(req.body?.name, 200),
    buyerEmail: email,
    buyerPhone: str(req.body?.phone, 40),
    serviceKey: str(req.body?.serviceKey, 60) || undefined,
    offerSlug: str(req.body?.offerSlug, 120) || undefined,
    serviceName: str(req.body?.serviceName, 200) || undefined,
    verifiedVia: "admin-confirmed",
    manual: true,
    raw: { note: str(req.body?.note, 500), recordedBy: req.user!.email },
  });
  recordAudit(req, "purchase.manual_recorded", { type: "order", id: result.orderId, detail: { email, reference } });
  res.status(201).json({ ok: result.outcome !== "rejected", ...result });
}));

adminRouter.get("/purchases/pending", (_req, res) => {
  res.json({ orders: pendingIntents() });
});

adminRouter.post("/purchases/:orderId/verify", asyn(async (req, res) => {
  const order = get<Record<string, any>>("SELECT * FROM orders WHERE id = ?", req.params.orderId);
  if (!order) throw notFound("Order not found");
  if (order.status === "paid") throw badRequest("That order is already paid and has a project.");
  const amountMinor = Number(req.body?.amountMinor ?? order.amount_minor ?? 0);
  const result = await recordPurchase({
    provider: String(order.provider),
    reference: String(order.provider_reference),
    amountMinor: amountMinor > 0 ? amountMinor : 500000,
    currency: String(order.currency ?? "NGN"),
    buyerName: String(order.buyer_name ?? ""),
    buyerEmail: String(order.buyer_email ?? ""),
    buyerPhone: String(order.buyer_phone ?? ""),
    serviceKey: order.service_key ?? undefined,
    offerSlug: order.offer_slug ?? undefined,
    serviceName: order.service_name ?? undefined,
    verifiedVia: "admin-confirmed",
    manual: true,
    raw: { verifiedBy: req.user!.email, note: str(req.body?.note, 500) },
  });
  recordAudit(req, "purchase.intent_verified", { type: "order", id: order.id });
  res.json({ ok: result.outcome !== "rejected", ...result });
}));

adminRouter.get("/automation", (req, res) => {
  const limit = Math.min(Number(req.query.limit ?? 100) || 100, 500);
  res.json({ events: recentEvents(limit) });
});

adminRouter.post("/automation/:eventId/resolve", (req, res) => {
  resolveEvent(req.params.eventId);
  recordAudit(req, "automation.resolved", { type: "automation_event", id: req.params.eventId });
  res.json({ ok: true });
});

adminRouter.get("/outbox", (_req, res) => {
  res.json({ notifications: outbox(200) });
});

adminRouter.post("/outbox/dispatch", asyn(async (_req, res) => {
  const summary = await dispatchPending(100);
  res.json({ ok: true, ...summary });
}));

adminRouter.get("/templates", (_req, res) => {
  res.json({ templates: listTemplates(true) });
});

adminRouter.put("/templates/:key", (req, res, next) => {
  try {
    const patch = req.body ?? {};
    const updated = updateTemplate(req.params.key, {
      name: patch.name,
      category: patch.category,
      description: patch.description,
      defaultDays: patch.defaultDays !== undefined ? Number(patch.defaultDays) : undefined,
      revisionLimit: patch.revisionLimit !== undefined ? Number(patch.revisionLimit) : undefined,
      questionnaire: Array.isArray(patch.questionnaire) ? patch.questionnaire : undefined,
      milestones: Array.isArray(patch.milestones) ? patch.milestones : undefined,
      tasks: Array.isArray(patch.tasks) ? patch.tasks : undefined,
      active: patch.active !== undefined ? Boolean(patch.active) : undefined,
    });
    recordAudit(req, "template.updated", { type: "service_template", id: req.params.key });
    res.json({ ok: true, template: updated });
  } catch (err) {
    next(err);
  }
});

adminRouter.get("/audit", (req, res) => {
  const entityType = str(req.query.entityType, 60);
  const entityId = str(req.query.entityId, 80);
  res.json({
    entries: entityType && entityId
      ? auditFor(entityType, entityId)
      : all("SELECT * FROM audit_log ORDER BY created_at DESC LIMIT 200"),
  });
});

adminRouter.get("/integrations", (_req, res) => {
  res.json({ integrations: integrationStatus() });
});

adminRouter.get("/settings", (_req, res) => {
  res.json({
    settings: all("SELECT key, value FROM settings ORDER BY key"),
    brand: { name: "Easywurld", whatsapp: config.admin.whatsapp, siteUrl: config.admin.siteUrl },
  });
});

export const apiRouter: Router = express.Router();
apiRouter.use("/auth", authRouter);
apiRouter.use("/public", publicRouter);
apiRouter.use("/webhooks", webhookRouter);
apiRouter.use("/files", fileRouter);
apiRouter.use("/portal", portalRouter);
apiRouter.use("/admin", adminRouter);

apiRouter.use((_req, res) => res.status(404).json({ error: "Unknown API route" }));
