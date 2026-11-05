/**
 * Demo dataset for local review and for the end-to-end test:
 *   npm run ops:seed
 *
 * Creates an admin, two dummy clients with real projects, a submitted
 * questionnaire, an uploaded file and a deliverable waiting for approval.
 * Safe to re-run: payment references are idempotent.
 */
import { config } from "../config.ts";
import { get, nowIso, run } from "../db/db.ts";
import { hashPassword } from "../auth.ts";
import { recordPurchase } from "../services/onboarding.ts";
import { seedTemplates, getTemplate } from "../services/templates.ts";

if (config.isProd) {
  console.error("Refusing to seed demo data in production. Set NODE_ENV=development.");
  process.exit(1);
}

seedTemplates();

const ADMIN_EMAIL = process.env.DEMO_ADMIN_EMAIL ?? "admin@easywurld.test";
const ADMIN_PASSWORD = process.env.DEMO_ADMIN_PASSWORD ?? "easywurld-demo-2026";
const CLIENT_PASSWORD = process.env.DEMO_CLIENT_PASSWORD ?? "easywurld-client-2026";

const admin = get<{ id: string }>("SELECT id FROM users WHERE email = ?", ADMIN_EMAIL);
if (!admin) {
  run(
    `INSERT INTO users (id, role, email, name, password_hash, status, created_at)
     VALUES (?, 'admin', ?, 'Easywurld Admin', ?, 'active', ?)`,
    crypto.randomUUID(),
    ADMIN_EMAIL,
    hashPassword(ADMIN_PASSWORD),
    nowIso(),
  );
  console.log(`Admin ready: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
} else {
  console.log(`Admin already present: ${ADMIN_EMAIL}`);
}

const demo = [
  {
    provider: "generic",
    reference: "DEMO-WEB-1001",
    amountMinor: 250000_00,
    buyerName: "Amaka Obi",
    buyerEmail: "amaka@bellarosabakes.test",
    buyerPhone: "+2348012345678",
    serviceKey: "website-design",
    serviceName: "Bella Rosa Bakery — website",
  },
  {
    provider: "generic",
    reference: "DEMO-SOCIAL-1002",
    amountMinor: 180000_00,
    buyerName: "Tunde Ade",
    buyerEmail: "tunde@northlineautos.test",
    buyerPhone: "+2348098765432",
    serviceKey: "social-media",
    serviceName: "Northline Autos — social media management",
  },
  {
    // Easywurld is its own first client: the system runs the company's own
    // brand growth project exactly like a paying client's.
    provider: "generic",
    reference: "DEMO-INTERNAL-1000",
    amountMinor: 0,
    buyerName: "Easywurld",
    buyerEmail: process.env.DEMO_INTERNAL_EMAIL ?? "hello@easywurld.com",
    buyerPhone: "+2349050690837",
    serviceKey: "digital-marketing",
    serviceName: "Easywurld — own brand growth system",
    internal: true,
  },
];

for (const purchase of demo) {
  const result = await recordPurchase({
    ...purchase,
    currency: "NGN",
    verifiedVia: "demo-seed",
    raw: { seeded: true },
  });
  console.log(`${purchase.buyerName}: ${result.outcome}${result.projectId ? ` → ${result.projectId}` : ""}`);

  if (result.outcome !== "created" || !result.projectId) continue;
  const projectId = result.projectId;

  // Complete the questionnaire the way a real client would — driven by the
  // project's own template, so every service is answered sensibly.
  const projectRow = get<Record<string, any>>("SELECT template_key FROM projects WHERE id = ?", projectId);
  const template = getTemplate(String(projectRow?.template_key ?? ""));
  const q = get<Record<string, any>>("SELECT * FROM questionnaires WHERE project_id = ?", projectId);
  if (q && template) {
    const overrides: Record<string, string> = {
      business_name: purchase.buyerName,
      business_description: "A family bakery in Lekki selling celebration cakes and pastries.",
      target_audience: "Lagos parents, offices ordering birthday cakes, and wedding planners.",
      phone: purchase.buyerPhone ?? "+2348012345678",
      pages_needed: "Home, Cakes, About, Contact",
      website_goal: "Get enquiries",
      brand_assets: "Logo only",
      domain_hosting: "I have both",
    };
    const autoAnswer = (question: Record<string, any>): string => {
      if (overrides[question.key]) return overrides[question.key];
      if (question.options?.length) {
        return question.type === "multiselect"
          ? question.options.slice(0, 2).join(", ")
          : String(question.options[0]);
      }
      if (question.type === "date") return new Date(Date.now() + 30 * 864e5).toISOString().slice(0, 10);
      if (question.type === "url") return "https://example.com";
      if (question.type === "number") return "12";
      if (question.key.includes("name")) return purchase.buyerName ?? "Demo business";
      return "Happy to discuss on our onboarding call.";
    };
    for (const question of template.questionnaire) {
      run(
        `INSERT INTO questionnaire_answers (id, questionnaire_id, field_key, question, answer, answered_at)
         VALUES (?, ?, ?, ?, ?, ?)
         ON CONFLICT(questionnaire_id, field_key) DO UPDATE SET answer = excluded.answer`,
        crypto.randomUUID(),
        q.id,
        question.key,
        question.label,
        autoAnswer(question as unknown as Record<string, any>),
        nowIso(),
      );
    }
    run("UPDATE questionnaires SET status = 'submitted', submitted_at = ? WHERE id = ?", nowIso(), q.id);
  }
  run("UPDATE projects SET status = 'in_progress', progress = 55, updated_at = ? WHERE id = ?", nowIso(), projectId);
  run("UPDATE clients SET status = 'active' WHERE id = ?", result.clientId);
  if ((purchase as Record<string, any>).internal) {
    run(
      "UPDATE clients SET internal_notes = ? WHERE id = ?",
      "Internal — Easywurld is our own first client. Content planning lives in Notion; files live in the client workspace, not in code.",
      result.clientId,
    );
    run("UPDATE projects SET progress = 30 WHERE id = ?", projectId);
  }

  // A demo login so the portal can be reviewed without a real invite email.
  const client = get<Record<string, any>>("SELECT * FROM clients WHERE id = ?", result.clientId);
  if (client?.user_id) {
    run(
      "UPDATE users SET password_hash = ?, status = 'active' WHERE id = ? AND (password_hash IS NULL)",
      hashPassword(CLIENT_PASSWORD),
      client.user_id,
    );
  }

  // A conversation, so the portal thread is not empty.
  run(
    `INSERT INTO messages (id, project_id, sender_id, sender_role, sender_name, body, created_at)
     VALUES (?, ?, 'system', 'admin', 'Easywurld', ?, ?)`,
    crypto.randomUUID(),
    projectId,
    "Welcome aboard! Your workspace is ready. Everything about this project lives here — files, reviews and messages.",
    nowIso(),
  );
}

// Put the first project in a realistic "waiting on your approval" state.
const first = get<Record<string, any>>("SELECT * FROM projects WHERE title LIKE 'Bella Rosa%' ORDER BY created_at ASC LIMIT 1");
if (first && !get("SELECT id FROM deliverables WHERE project_id = ? LIMIT 1", first.id)) {
  run(
    `INSERT INTO deliverables (id, project_id, title, description, version, status, external_url, submitted_at, created_by, created_at, updated_at)
     VALUES ('EW-D-0001', ?, 'Homepage design — first direction', 'Warm, bakery-first layout with the cake gallery above the fold. Open the link on your phone too.', 1, 'submitted', 'https://example.com/easywurld-demo/homepage-v1', ?, 'system', ?, ?)`,
    first.id,
    nowIso(),
    nowIso(),
    nowIso(),
  );
  run("UPDATE projects SET status = 'awaiting_client_approval', progress = 80, updated_at = ? WHERE id = ?", nowIso(), first.id);
  console.log(`Deliverable EW-D-0001 is waiting for approval on ${first.id}`);
}

console.log("\nDemo data ready. Sign in at /login:");
console.log(`  admin  ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
console.log(`  client amaka@bellarosabakes.test / ${CLIENT_PASSWORD}`);
console.log(`  client tunde@northlineautos.test / ${CLIENT_PASSWORD}`);
console.log("These accounts exist only in demo data (NODE_ENV != production).\n");
