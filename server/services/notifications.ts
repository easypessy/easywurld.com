import crypto from "node:crypto";
import { config } from "../config.ts";
import { all, get, nowIso, run } from "../db/db.ts";
import { logEvent } from "./automation.ts";

/**
 * Outbox pattern. A notification is written to the database first; delivery
 * happens afterwards and can fail without losing the message. Deduplication is
 * enforced by a unique `dedupe_key`, so a repeated webhook cannot spam a client.
 */

export type Channel = "email" | "whatsapp" | "inapp";

export interface EnqueueInput {
  channel: Channel;
  recipient: string;
  subject: string;
  body: string;
  entityType?: string;
  entityId?: string;
  dedupeKey?: string;
}

export function enqueue(input: EnqueueInput): { id: string; duplicate: boolean } {
  const existing = input.dedupeKey
    ? get<{ id: string }>("SELECT id FROM notifications WHERE dedupe_key = ?", input.dedupeKey)
    : undefined;
  if (existing) return { id: existing.id, duplicate: true };

  const id = crypto.randomUUID();
  run(
    `INSERT INTO notifications (id, channel, recipient, subject, body, entity_type, entity_id, status, dedupe_key, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'queued', ?, ?)`,
    id,
    input.channel,
    input.recipient,
    input.subject,
    input.body,
    input.entityType ?? null,
    input.entityId ?? null,
    input.dedupeKey ?? null,
    nowIso(),
  );
  return { id, duplicate: false };
}

/** In-app notifications are delivered immediately (they live in the DB). */
export function enqueueInApp(recipient: string, subject: string, body: string, entityType: string, entityId: string, dedupeKey?: string) {
  const res = enqueue({ channel: "inapp", recipient, subject, body, entityType, entityId, dedupeKey });
  if (!res.duplicate) {
    run("UPDATE notifications SET status = 'sent', sent_at = ? WHERE id = ?", nowIso(), res.id);
  }
  return res;
}

/* ------------------------------ adapters -------------------------------- */

async function sendEmail(n: { recipient: string; subject: string; body: string }): Promise<{ ok: boolean; error?: string }> {
  if (!config.smtp.host || !config.smtp.user) {
    // No SMTP credentials: the message stays visible in the admin outbox and is
    // marked "logged" so nothing silently disappears.
    return { ok: false, error: "SMTP not configured" };
  }
  try {
    const nodemailer = await import("nodemailer");
    const transport = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.secure,
      auth: { user: config.smtp.user, pass: config.smtp.pass },
    });
    await transport.sendMail({
      from: config.smtp.from,
      to: n.recipient,
      subject: n.subject,
      text: n.body,
    });
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

async function sendWhatsApp(n: { recipient: string; body: string }): Promise<{ ok: boolean; error?: string }> {
  if (!config.whatsapp.token || !config.whatsapp.phoneNumberId) {
    return { ok: false, error: "WhatsApp Cloud API not configured" };
  }
  try {
    const res = await fetch(
      `https://graph.facebook.com/v20.0/${config.whatsapp.phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.whatsapp.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: n.recipient.replace(/[^\d]/g, ""),
          type: "text",
          text: { body: n.body },
        }),
      },
    );
    if (!res.ok) return { ok: false, error: `WhatsApp API ${res.status}` };
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

const MAX_ATTEMPTS = 3;

/** Attempt delivery of every queued notification. Safe to call repeatedly. */
export async function dispatchPending(limit = 25): Promise<{ sent: number; failed: number; logged: number }> {
  const pending = all(
    `SELECT * FROM notifications WHERE status = 'queued' ORDER BY created_at ASC LIMIT ?`,
    limit,
  );
  let sent = 0;
  let failed = 0;
  let logged = 0;

  for (const n of pending) {
    const attempts = Number(n.attempts ?? 0) + 1;
    let result: { ok: boolean; error?: string };
    if (n.channel === "email") result = await sendEmail(n as never);
    else if (n.channel === "whatsapp") result = await sendWhatsApp(n as never);
    else result = { ok: true };

    if (result.ok) {
      run("UPDATE notifications SET status = 'sent', sent_at = ?, attempts = ? WHERE id = ?", nowIso(), attempts, n.id);
      sent += 1;
      logEvent({ event: "notification.sent", status: "success", detail: { channel: n.channel, to: n.recipient } });
    } else if (attempts >= MAX_ATTEMPTS || /not configured/i.test(result.error ?? "")) {
      run(
        "UPDATE notifications SET status = 'logged', attempts = ?, last_error = ? WHERE id = ?",
        attempts,
        result.error ?? "unknown",
        n.id,
      );
      logged += 1;
      logEvent({
        event: "notification.undelivered",
        status: "skipped",
        detail: { channel: n.channel, to: n.recipient, error: result.error, note: "readable in the admin outbox" },
      });
    } else {
      run("UPDATE notifications SET attempts = ?, last_error = ? WHERE id = ?", attempts, result.error ?? "unknown", n.id);
      failed += 1;
    }
  }
  return { sent, failed, logged };
}

export function outbox(limit = 100) {
  return all(
    `SELECT id, channel, recipient, subject, status, attempts, last_error, created_at, sent_at
     FROM notifications ORDER BY created_at DESC LIMIT ?`,
    Math.min(limit, 500),
  );
}

/** In-app notifications for a client, scoped by the entity they own. */
export function inAppFor(recipient: string, limit = 20) {
  return all(
    `SELECT id, subject, body, entity_type, entity_id, created_at FROM notifications
     WHERE channel = 'inapp' AND recipient = ? ORDER BY created_at DESC LIMIT ?`,
    recipient,
    limit,
  );
}

/* ------------------------- message templates ---------------------------- */

export function welcomeMessage(input: { clientName: string; projectTitle: string; service: string; portalUrl: string; dueDate: string }) {
  return {
    subject: `Welcome to Easywurld — ${input.projectTitle}`,
    body: [
      `Hi ${input.clientName},`,
      "",
      `Thank you for choosing Easywurld. Your payment is confirmed and your project is officially open.`,
      "",
      `Project: ${input.projectTitle}`,
      `Service: ${input.service}`,
      `Target delivery: ${new Date(input.dueDate).toDateString()}`,
      "",
      `Next step: sign in to your client workspace and complete the short onboarding questionnaire.`,
      `${input.portalUrl}/login`,
      "",
      "Inside your workspace you can submit requirements, upload files, follow progress, review work and approve deliverables. You never need to chase us by WhatsApp to find out where your project stands.",
      "",
      "Simplify. Optimize. Grow.",
      "Easywurld",
    ].join("\n"),
  };
}

export function revisionRequestBody(input: { clientName: string; projectTitle: string; note: string; revisionNumber: number }) {
  return {
    subject: `Revision request received — ${input.projectTitle}`,
    body: [
      `${input.clientName} requested a revision on ${input.projectTitle}.`,
      "",
      `Revision ${input.revisionNumber}`,
      `Client note: ${input.note || "(no note provided)"}`,
      "",
      "Open the admin dashboard to respond and resubmit.",
    ].join("\n"),
  };
}

export function approvalBody(input: { clientName: string; projectTitle: string; note: string }) {
  return {
    subject: `Deliverable approved — ${input.projectTitle}`,
    body: [
      `${input.clientName} approved a deliverable on ${input.projectTitle}.`,
      "",
      `Note: ${input.note || "(no note provided)"}`,
      "",
      "You can now mark the project delivered or move it to the next milestone.",
    ].join("\n"),
  };
}
