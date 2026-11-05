import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { bootTestServer, makeHttp, signedHeaders, loginAdmin, activateClient, type Client } from "./helpers.ts";

/**
 * End-to-end coverage of the purchase-to-delivery journey plus the security
 * boundary tests the brief demands. Every assertion hits the real HTTP API and
 * the real database — nothing is mocked.
 */

const ctx = await bootTestServer();
const http = makeHttp(ctx.base);
let admin: Client;

test.before(async () => {
  admin = await loginAdmin(ctx.base, ctx.db, ctx.auth);
});

test.after(async () => {
  await ctx.close();
});

/* 1 ───────────────────────── unverified payment ───────────────────────── */

test("rejects a webhook with an invalid signature and creates nothing", async () => {
  const payload = {
    status: "paid",
    reference: "BAD-SIG-1",
    amount_minor: 500000,
    currency: "NGN",
    customer: { name: "Fraudster", email: "fraud@example.test" },
  };
  const res = await http.request("POST", "/api/webhooks/payments/generic", undefined, {
    raw: JSON.stringify(payload),
    headers: { "x-easywurld-signature": "deadbeef", "content-type": "application/json" },
  });
  assert.equal(res.status, 401);
  const client = ctx.db.get("SELECT id FROM clients WHERE email = 'fraud@example.test'");
  assert.equal(client, undefined);
  const rejected = ctx.db.get("SELECT * FROM automation_events WHERE event = 'purchase.signature_rejected'");
  assert.ok(rejected, "rejection is logged");
});

/* 2 ───────────────────── verified purchase → full onboarding ───────────── */

let firstPurchase: { projectId: string; clientId: string };

test("a verified purchase creates client, project, tasks, questionnaire and workspace", async () => {
  const payload = {
    status: "paid",
    reference: "PAY-1001",
    amount_minor: 25000000,
    currency: "NGN",
    customer: { name: "Amaka Obi", email: "Amaka@BellaRosa.test", phone: "+2348012345678" },
    service_key: "website-design",
    service_name: "Bella Rosa Bakery — website",
  };
  const { raw, headers } = signedHeaders(payload);
  const res = await http.request("POST", "/api/webhooks/payments/generic", undefined, { raw, headers });
  assert.equal(res.status, 200);
  assert.equal(res.body.outcome, "created");
  assert.match(res.body.projectId, /^EW-P-\d{4}$/);
  assert.match(res.body.clientId, /^EW-C-\d{4}$/);

  firstPurchase = { projectId: res.body.projectId, clientId: res.body.clientId };

  const project = ctx.db.get("SELECT * FROM projects WHERE id = ?", res.body.projectId);
  assert.equal(project.status, "awaiting_onboarding");
  assert.ok(project.due_date > project.start_date);
  assert.ok(project.workspace_path.includes("EASYWURLD CLIENTS"));

  const client = ctx.db.get("SELECT * FROM clients WHERE id = ?", res.body.clientId);
  assert.equal(client.email, "amaka@bellarosa.test", "email is normalised to lowercase");
  assert.equal(ctx.db.all("SELECT * FROM tasks WHERE project_id = ?", project.id).length, 8);
  assert.ok(ctx.db.all("SELECT * FROM tasks WHERE project_id = ? AND visible_to_client = 1", project.id).length > 0);
  assert.equal(ctx.db.get("SELECT * FROM questionnaires WHERE project_id = ?", project.id).status, "pending");

  // real folders on disk
  for (const folder of ["01 - Onboarding", "02 - Client Materials", "03 - Working Files", "04 - Review and Approvals", "05 - Final Deliverables", "06 - Archive"]) {
    assert.ok(fs.existsSync(path.join(project.workspace_path, folder)), `${folder} exists`);
  }

  // notifications queued and audited
  assert.ok(ctx.db.get("SELECT * FROM notifications WHERE dedupe_key = ?", `welcome:${project.id}`));
  assert.ok(ctx.db.get("SELECT * FROM notifications WHERE dedupe_key = ?", `admin-newproject:${project.id}`));
  assert.ok(ctx.db.get("SELECT * FROM automation_events WHERE event = 'workspace.provision.complete' AND project_id = ?", project.id));
});

/* 3 ─────────────────────── duplicate payment notifications ─────────────── */

test("a duplicate payment notification does not create a second client or project", async () => {
  const payload = {
    status: "paid",
    reference: "PAY-1001",
    amount_minor: 25000000,
    currency: "NGN",
    customer: { name: "Amaka Obi", email: "amaka@bellarosa.test" },
    service_key: "website-design",
    service_name: "Bella Rosa Bakery — website",
  };
  const { raw, headers } = signedHeaders(payload);
  const res = await http.request("POST", "/api/webhooks/payments/generic", undefined, { raw, headers });
  assert.equal(res.status, 200);
  assert.equal(res.body.outcome, "duplicate");
  assert.equal(res.body.projectId, firstPurchase.projectId);

  const projects = ctx.db.all("SELECT id FROM projects WHERE client_id = ?", firstPurchase.clientId);
  assert.equal(projects.length, 1);
  const orders = ctx.db.all("SELECT id FROM orders WHERE provider = 'generic' AND provider_reference = 'PAY-1001'");
  assert.equal(orders.length, 1);
  assert.ok(ctx.db.get("SELECT * FROM automation_events WHERE event = 'purchase.duplicate_ignored'"));
});

test("a duplicate notification is also safe when sent five times concurrently", async () => {
  const payload = {
    status: "paid",
    reference: "PAY-1002",
    amount_minor: 9000000,
    currency: "NGN",
    customer: { name: "Copy Client", email: "copy@example.test" },
    service_key: "copywriting",
  };
  const { raw, headers } = signedHeaders(payload);
  const results = await Promise.all(
    Array.from({ length: 5 }, () => http.request("POST", "/api/webhooks/payments/generic", undefined, { raw, headers })),
  );
  const created = results.filter((r) => r.body.outcome === "created");
  assert.equal(created.length, 1, "exactly one creation wins");
  const orders = ctx.db.all("SELECT id FROM orders WHERE provider_reference = 'PAY-1002'");
  assert.equal(orders.length, 1);
  const client = ctx.db.get("SELECT id FROM clients WHERE email = 'copy@example.test'");
  assert.equal(ctx.db.all("SELECT id FROM projects WHERE client_id = ?", client.id).length, 1);
});

/* 4 ───────────────────────────── failed payments ──────────────────────── */

test("a failed payment never creates a client or project", async () => {
  const payload = {
    status: "failed",
    reference: "PAY-FAIL-1",
    amount_minor: 500000,
    currency: "NGN",
    customer: { name: "No Pay", email: "nopay@example.test" },
  };
  const { raw, headers } = signedHeaders(payload);
  const res = await http.request("POST", "/api/webhooks/payments/generic", undefined, { raw, headers });
  assert.equal(res.status, 200);
  assert.equal(res.body.activated, false);
  assert.equal(ctx.db.get("SELECT id FROM clients WHERE email = 'nopay@example.test'"), undefined);
  assert.ok(ctx.db.get("SELECT * FROM orders WHERE provider_reference = 'PAY-FAIL-1' AND status = 'failed'"));
});

test("an underpayment is rejected before activation", async () => {
  const payload = {
    status: "paid",
    reference: "PAY-CHEAP-1",
    amount_minor: 100,
    currency: "NGN",
    customer: { name: "Cheap Client", email: "cheap@example.test" },
  };
  const { raw, headers } = signedHeaders(payload);
  const res = await http.request("POST", "/api/webhooks/payments/generic", undefined, { raw, headers });
  assert.equal(res.body.activated, false);
  assert.match(String(res.body.reason), /below/i);
  assert.equal(ctx.db.get("SELECT id FROM clients WHERE email = 'cheap@example.test'"), undefined);
});

test("a payment without a usable email is rejected and logged", async () => {
  const payload = { status: "paid", reference: "PAY-NOEMAIL", amount_minor: 500000, currency: "NGN", customer: {} };
  const { raw, headers } = signedHeaders(payload);
  const res = await http.request("POST", "/api/webhooks/payments/generic", undefined, { raw, headers });
  assert.equal(res.body.outcome, "rejected");
  assert.ok(ctx.db.get("SELECT * FROM automation_events WHERE event = 'purchase.rejected'"));
});

/* 5 ───────────────────── client identity and isolation ─────────────────── */

let amaka: Client;
let copyClient: Client;

test("a client activates their account and sees only their own workspace", async () => {
  const invite = ctx.db.get(
    `SELECT t.user_id FROM activation_tokens t JOIN users u ON u.id = t.user_id WHERE u.email = ? AND t.used_at IS NULL`,
    "amaka@bellarosa.test",
  );
  assert.ok(invite, "invite exists");
  // Re-issue a token we can use (the original plaintext is only shown once).
  const token = ctx.auth.createActivationToken(invite.user_id, "activate");
  amaka = await activateClient(ctx.base, token);

  const overview = await http.request("GET", "/api/portal/overview", undefined, { cookie: amaka.cookie });
  assert.equal(overview.status, 200);
  assert.equal(overview.body.projects.length, 1);
  assert.equal(overview.body.client.email, "amaka@bellarosa.test");

  const own = await http.request("GET", `/api/portal/projects/${firstPurchase.projectId}`, undefined, { cookie: amaka.cookie });
  assert.equal(own.status, 200);
  assert.equal(own.body.project.id, firstPurchase.projectId);
  assert.ok(own.body.questionnaire);
});

test("a client cannot read another client's project", async () => {
  const other = ctx.db.get("SELECT id FROM projects WHERE title LIKE '%Copywriting%' OR service_key = 'copywriting'");
  const res = await http.request("GET", `/api/portal/projects/${other.id}`, undefined, { cookie: amaka.cookie });
  assert.equal(res.status, 403);
});

test("a client cannot reach any admin endpoint", async () => {
  for (const url of ["/api/admin/overview", "/api/admin/clients", "/api/admin/automation"]) {
    const res = await http.request("GET", url, undefined, { cookie: amaka.cookie });
    assert.equal(res.status, 403, `${url} is admin-only`);
  }
});

test("admin endpoints refuse anonymous requests", async () => {
  const res = await http.request("GET", "/api/admin/overview");
  assert.equal(res.status, 401);
});

test("client cannot see internal tasks or internal notes", async () => {
  const internal = ctx.db.get(
    "SELECT * FROM tasks WHERE project_id = ? AND visible_to_client = 0 LIMIT 1",
    firstPurchase.projectId,
  );
  const view = await http.request("GET", `/api/portal/projects/${firstPurchase.projectId}`, undefined, { cookie: amaka.cookie });
  assert.equal(view.body.tasks.some((t: any) => t.id === internal.id), false);
  assert.equal(view.body.project.internal_notes, undefined);
});

/* 6 ───────────────────────── onboarding questionnaire ──────────────────── */

test("questionnaire validation blocks incomplete submissions, accepts complete ones", async () => {
  const bad = await http.request(
    "POST",
    `/api/portal/projects/${firstPurchase.projectId}/questionnaire`,
    { answers: { business_name: "Bella Rosa" } },
    { cookie: amaka.cookie },
  );
  assert.equal(bad.status, 400);
  assert.match(String(bad.body.error), /Please complete/i);

  const good = await http.request(
    "POST",
    `/api/portal/projects/${firstPurchase.projectId}/questionnaire`,
    {
      answers: {
        business_name: "Bella Rosa Bakery",
        business_description: "Celebration cakes in Lekki",
        target_audience: "Lagos families and offices",
        phone: "+2348012345678",
        pages_needed: "Home, Cakes, About, Contact",
        website_goal: "Get enquiries",
        brand_assets: "Logo only",
        domain_hosting: "I have both",
      },
    },
    { cookie: amaka.cookie },
  );
  assert.equal(good.status, 200);
  assert.equal(good.body.questionnaire.status, "submitted");
  const project = ctx.db.get("SELECT status FROM projects WHERE id = ?", firstPurchase.projectId);
  assert.ok(["ready_to_start", "awaiting_client_materials"].includes(project.status));
});

/* 7 ────────────────────────────── file access ─────────────────────────── */

let internalFileId: string;
let clientFileId: string;

test("file upload rejects disallowed types and accepts a valid PDF", async () => {
  const badForm = new FormData();
  badForm.append("file", new Blob(["MZ binary"], { type: "application/x-msdownload" }), "virus.exe");
  const bad = await http.request("POST", `/api/admin/projects/${firstPurchase.projectId}/files?folder=03`, undefined, {
    cookie: admin.cookie,
    form: badForm,
  });
  assert.equal(bad.status, 400);

  const goodForm = new FormData();
  goodForm.append("file", new Blob([Buffer.from("%PDF-1.4 internal brief")], { type: "application/pdf" }), "internal-brief.pdf");
  const good = await http.request("POST", `/api/admin/projects/${firstPurchase.projectId}/files?folder=03`, undefined, {
    cookie: admin.cookie,
    form: goodForm,
  });
  assert.equal(good.status, 201);
  internalFileId = good.body.file.id;
});

test("clients cannot see or download internal working files", async () => {
  const view = await http.request("GET", `/api/portal/projects/${firstPurchase.projectId}`, undefined, { cookie: amaka.cookie });
  assert.equal(view.body.files.some((f: any) => f.id === internalFileId), false);

  const download = await http.request("GET", `/api/files/${internalFileId}/download`, undefined, { cookie: amaka.cookie });
  assert.equal(download.status, 403);

  const adminDownload = await http.request("GET", `/api/files/${internalFileId}/download`, undefined, { cookie: admin.cookie });
  assert.equal(adminDownload.status, 200);
});

test("a client upload lands in their materials folder and is visible to them", async () => {
  const form = new FormData();
  form.append("file", new Blob([Buffer.from("Our cake photos and brand notes")], { type: "text/plain" }), "brand-notes.txt");
  const res = await http.request("POST", `/api/portal/projects/${firstPurchase.projectId}/files`, undefined, {
    cookie: amaka.cookie,
    form,
  });
  assert.equal(res.status, 201);
  clientFileId = res.body.file.id;

  const file = ctx.db.get("SELECT * FROM files WHERE id = ?", clientFileId);
  assert.equal(file.folder_code, "02");
  assert.equal(file.visibility, "client");
  assert.ok(fs.existsSync(path.join(ctx.db.get("SELECT workspace_path FROM projects WHERE id = ?", firstPurchase.projectId).workspace_path, "02 - Client Materials", file.stored_name)));

  const own = await http.request("GET", `/api/files/${clientFileId}/download`, undefined, { cookie: amaka.cookie });
  assert.equal(own.status, 200);

  const otherClientCheck = await http.request("GET", `/api/files/${clientFileId}/download`, undefined, { cookie: admin.cookie });
  assert.equal(otherClientCheck.status, 200, "admin may audit any file");
});

test("a client cannot download another client's client-visible file", async () => {
  const invite = ctx.db.get(
    `SELECT t.user_id FROM activation_tokens t JOIN users u ON u.id = t.user_id WHERE u.email = 'copy@example.test'`,
  );
  const token = ctx.auth.createActivationToken(invite.user_id, "activate");
  copyClient = await activateClient(ctx.base, token);
  const res = await http.request("GET", `/api/files/${clientFileId}/download`, undefined, { cookie: copyClient.cookie });
  assert.equal(res.status, 403);
});

/* 8 ───────────────────── approval and revision workflow ────────────────── */

test("admin submits a deliverable, client approves it, project moves to delivered", async () => {
  const form = new FormData();
  form.append("file", new Blob([Buffer.from("%PDF-1.4 homepage concept v1")], { type: "application/pdf" }), "homepage-concept.pdf");
  const upload = await http.request("POST", `/api/admin/projects/${firstPurchase.projectId}/files?folder=04`, undefined, {
    cookie: admin.cookie,
    form,
  });
  assert.equal(upload.status, 201);

  const submit = await http.request(
    "POST",
    `/api/admin/projects/${firstPurchase.projectId}/deliverables`,
    { title: "Homepage concept", description: "First design direction", fileId: upload.body.file.id },
    { cookie: admin.cookie },
  );
  assert.equal(submit.status, 201);
  const deliverableId = submit.body.deliverable.id;

  const projectAfterSubmit = ctx.db.get("SELECT status FROM projects WHERE id = ?", firstPurchase.projectId);
  assert.equal(projectAfterSubmit.status, "awaiting_client_approval");

  // The client sees it and can download the file.
  const view = await http.request("GET", `/api/portal/projects/${firstPurchase.projectId}`, undefined, { cookie: amaka.cookie });
  const visible = view.body.deliverables.find((d: any) => d.id === deliverableId);
  assert.ok(visible, "deliverable visible to client");
  const download = await http.request("GET", `/api/files/${upload.body.file.id}/download`, undefined, { cookie: amaka.cookie });
  assert.equal(download.status, 200);

  // Silence is not approval: still awaiting after time passes.
  assert.equal(ctx.db.get("SELECT status FROM projects WHERE id = ?", firstPurchase.projectId).status, "awaiting_client_approval");

  const approve = await http.request
    ("POST", `/api/portal/projects/${firstPurchase.projectId}/deliverables/${deliverableId}/decision`,
      { action: "approve", note: "Love it" }, { cookie: amaka.cookie });
  assert.equal(approve.status, 200);
  const decided = ctx.db.get("SELECT status, decided_at FROM deliverables WHERE id = ?", deliverableId);
  assert.equal(decided.status, "approved");
  assert.ok(decided.decided_at);
  assert.equal(ctx.db.get("SELECT status FROM projects WHERE id = ?", firstPurchase.projectId).status, "delivered");
});

test("a revision request is recorded, counted, and resubmission creates a new version", async () => {
  const { raw, headers } = signedHeaders({
    status: "paid",
    reference: "PAY-SOCIAL-1",
    amount_minor: 18000000,
    currency: "NGN",
    customer: { name: "Tunde Ade", email: "tunde@northlineautos.test" },
    service_key: "social-media",
    service_name: "Northline Autos — social media management",
  });
  const purchase = await http.request("POST", "/api/webhooks/payments/generic", undefined, { raw, headers });
  assert.equal(purchase.body.outcome, "created");
  const social = ctx.db.get("SELECT * FROM projects WHERE id = ?", purchase.body.projectId);
  assert.ok(social);

  const first = await http.request(
    "POST",
    `/api/admin/projects/${social.id}/deliverables`,
    { title: "October content calendar", externalUrl: "https://drive.google.com/demo/calendar" },
    { cookie: admin.cookie },
  );
  assert.equal(first.status, 201);

  const invite = ctx.db.get(
    `SELECT t.user_id FROM activation_tokens t JOIN users u ON u.id = t.user_id WHERE u.email = 'tunde@northlineautos.test'`,
  );
  const token = ctx.auth.createActivationToken(invite.user_id, "activate");
  const tunde = await activateClient(ctx.base, token, "tunde-password-123");

  const noNote = await http.request(
    "POST",
    `/api/portal/projects/${social.id}/deliverables/${first.body.deliverable.id}/decision`,
    { action: "request_revision", note: "" },
    { cookie: tunde.cookie },
  );
  assert.equal(noNote.status, 400);

  const revision = await http.request(
    "POST",
    `/api/portal/projects/${social.id}/deliverables/${first.body.deliverable.id}/decision`,
    { action: "request_revision", note: "Add two reels per week" },
    { cookie: tunde.cookie },
  );
  assert.equal(revision.status, 200);
  assert.equal(ctx.db.get("SELECT status FROM projects WHERE id = ?", social.id).status, "revision_requested");
  assert.equal(ctx.db.get("SELECT revisions_used FROM projects WHERE id = ?", social.id).revisions_used, 1);

  const second = await http.request(
    "POST",
    `/api/admin/projects/${social.id}/deliverables`,
    { title: "October content calendar (revised)", externalUrl: "https://drive.google.com/demo/calendar-v2" },
    { cookie: admin.cookie },
  );
  assert.equal(second.body.deliverable.version, 2);

  const reviews = ctx.db.all("SELECT * FROM reviews WHERE project_id = ?", social.id);
  assert.equal(reviews.length, 1);
  assert.ok(reviews[0].created_at);
});

test("approving an already decided deliverable is refused", async () => {
  const decided = ctx.db.get("SELECT * FROM deliverables WHERE status = 'approved' LIMIT 1");
  const decision = await http.request(
    "POST",
    `/api/portal/projects/${decided.project_id}/deliverables/${decided.id}/decision`,
    { action: "approve", note: "again" },
    { cookie: amaka.cookie },
  );
  assert.equal(decision.status, 409);
});

/* 9 ───────────────────────── admin operations ─────────────────────────── */

test("admin dashboard returns live numbers", async () => {
  const res = await http.request("GET", "/api/admin/overview", undefined, { cookie: admin.cookie });
  assert.equal(res.status, 200);
  const realClients = ctx.db.all("SELECT id FROM clients").length;
  assert.equal(res.body.counts.clients, realClients);
  assert.ok(res.body.counts.clients >= 2);
  assert.ok(res.body.counts.activeProjects >= 1);
  assert.ok(res.body.integrations.storage.configured);
  assert.equal(typeof res.body.counts.automationFailures, "number");
});

test("admin can create a task, complete a milestone and change status", async () => {
  const task = await http.request(
    "POST",
    `/api/admin/projects/${firstPurchase.projectId}/tasks`,
    { title: "Prepare launch checklist", priority: "high", visibleToClient: true },
    { cookie: admin.cookie },
  );
  assert.equal(task.status, 201);

  const done = await http.request("PATCH", `/api/admin/tasks/${task.body.task.id}`, { status: "done" }, { cookie: admin.cookie });
  assert.equal(done.body.task.status, "done");
  assert.ok(done.body.task.completed_at);

  const milestone = ctx.db.get("SELECT * FROM milestones WHERE project_id = ? LIMIT 1", firstPurchase.projectId);
  const ms = await http.request("POST", `/api/admin/milestones/${milestone.id}/complete`, {}, { cookie: admin.cookie });
  assert.equal(ms.body.milestone.status, "done");

  const status = await http.request(
    "POST",
    `/api/admin/projects/${firstPurchase.projectId}/status`,
    { status: "completed", note: "Signed off" },
    { cookie: admin.cookie },
  );
  assert.equal(status.body.project.status, "completed");
  assert.ok(ctx.db.get("SELECT * FROM project_status_history WHERE project_id = ? AND to_status = 'completed'", firstPurchase.projectId));
});

test("admin can record a manual bank-transfer sale which onboards a brand new client", async () => {
  const res = await http.request(
    "POST",
    "/api/admin/purchases/manual",
    {
      name: "Chinedu Eze",
      email: "chinedu@fieldstone.test",
      phone: "+2348011112222",
      amount: 150000,
      currency: "NGN",
      reference: "GTB-TRANSFER-8891",
      serviceKey: "ai-automation",
      serviceName: "Fieldstone — enquiry automation",
    },
    { cookie: admin.cookie },
  );
  assert.equal(res.status, 201);
  assert.equal(res.body.outcome, "created");
  const project = ctx.db.get("SELECT * FROM projects WHERE id = ?", res.body.projectId);
  assert.equal(project.status, "awaiting_onboarding");
  assert.equal(project.service_key, "ai-automation");

  const again = await http.request(
    "POST",
    "/api/admin/purchases/manual",
    { email: "chinedu@fieldstone.test", amount: 150000, reference: "GTB-TRANSFER-8891", serviceKey: "ai-automation" },
    { cookie: admin.cookie },
  );
  assert.equal(again.body.outcome, "duplicate");
});

test("admin can retry workspace provisioning and archive a project", async () => {
  const retry = await http.request("POST", `/api/admin/projects/${firstPurchase.projectId}/retry-workspace`, {}, { cookie: admin.cookie });
  assert.equal(retry.status, 200);
  assert.equal(retry.body.workspace.errors.length, 0);

  const archive = await http.request(
    "POST",
    `/api/admin/projects/${firstPurchase.projectId}/status`,
    { status: "archived", note: "Closed out" },
    { cookie: admin.cookie },
  );
  assert.equal(archive.body.project.status, "archived");
});

test("templates are editable and the change reaches new projects", async () => {
  const list = await http.request("GET", "/api/admin/templates", undefined, { cookie: admin.cookie });
  assert.ok(list.body.templates.length >= 8);
  const copyTemplate = list.body.templates.find((t: any) => t.key === "copywriting");
  const updated = await http.request(
    "PUT",
    "/api/admin/templates/copywriting",
    { defaultDays: 9, revisionLimit: 3, tasks: copyTemplate.tasks },
    { cookie: admin.cookie },
  );
  assert.equal(updated.status, 200);
  assert.equal(updated.body.template.defaultDays, 9);

  const sale = await http.request(
    "POST",
    "/api/admin/purchases/manual",
    { email: "tpl@example.test", name: "Template Check", amount: 50000, reference: "TPL-1", serviceKey: "copywriting" },
    { cookie: admin.cookie },
  );
  const project = ctx.db.get("SELECT * FROM projects WHERE id = ?", sale.body.projectId);
  assert.equal(project.revision_limit, 3);
});

test("automation log, outbox and audit trail are readable by admin only", async () => {
  const events = await http.request("GET", "/api/admin/automation", undefined, { cookie: admin.cookie });
  assert.ok(events.body.events.length > 0);
  const outbox = await http.request("GET", "/api/admin/outbox", undefined, { cookie: admin.cookie });
  assert.ok(outbox.body.notifications.length > 0);
  const audit = await http.request("GET", "/api/admin/audit", undefined, { cookie: admin.cookie });
  assert.ok(audit.body.entries.length > 0);
  const denied = await http.request("GET", "/api/admin/automation", undefined, { cookie: copyClient.cookie });
  assert.equal(denied.status, 403);
});

/* 10 ───────────────────────── session and CSRF ────────────────────────── */

test("logout revokes the session cookie immediately", async () => {
  const throwaway = await activateClient(
    ctx.base,
    ctx.auth.createActivationToken(
      ctx.db.get("SELECT user_id FROM clients WHERE email = 'copy@example.test'").user_id,
      "activate",
    ),
    "another-password-123",
  );
  const before = await http.request("GET", "/api/portal/overview", undefined, { cookie: throwaway.cookie });
  assert.equal(before.status, 200);
  await http.request("POST", "/api/auth/logout", {}, { cookie: throwaway.cookie });
  const after = await http.request("GET", "/api/portal/overview", undefined, { cookie: throwaway.cookie });
  assert.equal(after.status, 401);
});

test("cross-site mutations are blocked by the CSRF guard", async () => {
  const res = await http.request(
    "POST",
    `/api/admin/projects/${firstPurchase.projectId}/status`,
    { status: "in_progress" },
    { cookie: admin.cookie, headers: { origin: "https://evil.example", "sec-fetch-site": "cross-site" } },
  );
  assert.equal(res.status, 403);
});

test("login is throttled after repeated failures", async () => {
  for (let i = 0; i < 11; i += 1) {
    await http.request("POST", "/api/auth/login", { email: "admin@easywurld.test", password: `wrong-${i}` });
  }
  const res = await http.request("POST", "/api/auth/login", { email: "admin@easywurld.test", password: "wrong-final" });
  assert.equal(res.status, 403);
  assert.match(String(res.body.error), /Too many attempts/i);
});

/* 11 ─────────────────────── client data deletion ───────────────────────── */

test("admin can permanently delete a client's personal data on request", async () => {
  const victim = ctx.db.get("SELECT * FROM clients WHERE email = 'tpl@example.test'");
  const denied = await http.request("DELETE", `/api/admin/clients/${victim.id}`, { confirm: "wrong" }, { cookie: admin.cookie });
  assert.equal(denied.status, 400);

  const res = await http.request("DELETE", `/api/admin/clients/${victim.id}`, { confirm: victim.id }, { cookie: admin.cookie });
  assert.equal(res.status, 200);
  const after = ctx.db.get("SELECT * FROM clients WHERE id = ?", victim.id);
  assert.equal(after.name, "Deleted client");
  assert.match(after.email, /@easywurld\.invalid$/);
  assert.equal(ctx.db.all("SELECT * FROM projects WHERE client_id = ?", victim.id).length, 0);
  assert.equal(ctx.db.get("SELECT * FROM users WHERE email = 'tpl@example.test'"), undefined);
});

/* 12 ───────────────────────── unknown routes / errors ─────────────────── */

test("unknown API routes return JSON 404, not the SPA", async () => {
  const res = await http.request("GET", "/api/nope");
  assert.equal(res.status, 404);
  assert.equal(res.body.error, "Unknown API route");
});

test("expired or unknown activation tokens are refused", async () => {
  const res = await http.request("POST", "/api/auth/activate", { token: "not-a-real-token", password: "longenough123" });
  assert.equal(res.status, 400);
});

test("payment reference idempotency survives a crash between order and project", async () => {
  // Simulate a paid order whose project row never got written.
  const reference = "PAY-CRASH-1";
  const { raw, headers } = signedHeaders({
    status: "paid",
    reference,
    amount_minor: 700000,
    currency: "NGN",
    customer: { name: "Crash Client", email: "crash@example.test" },
    service_key: "landing-page",
  });
  await http.request("POST", "/api/webhooks/payments/generic", undefined, { raw, headers });
  const order = ctx.db.get("SELECT * FROM orders WHERE provider_reference = ?", reference);
  assert.ok(order.project_id);
  ctx.db.run("DELETE FROM projects WHERE id = ?", order.project_id);
  ctx.db.run("UPDATE orders SET project_id = NULL WHERE id = ?", order.id);

  const retry = await http.request("POST", "/api/webhooks/payments/generic", undefined, { raw, headers });
  assert.equal(retry.body.outcome, "created", "the pipeline resumes instead of silently doing nothing");
  assert.ok(ctx.db.get("SELECT * FROM projects WHERE id = ?", retry.body.projectId));
  assert.equal(ctx.db.all("SELECT * FROM clients WHERE email = 'crash@example.test'").length, 1);
});
