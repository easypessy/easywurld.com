/**
 * Create the first administrator.
 *
 *   npm run ops:admin -- you@easywurld.com "Your Name"
 *
 * The account starts as "invited" with no password. The activation token printed
 * below is single-use and expires in 14 days; it is never stored in plain text.
 */
import { config } from "../config.ts";
import { get, nowIso, run } from "../db/db.ts";
import { createActivationToken } from "../auth.ts";

const [emailArg, nameArg] = process.argv.slice(2);
const email = (emailArg ?? "").trim().toLowerCase();
if (!email) {
  console.error("Usage: npm run ops:admin -- email@example.com \"Full Name\"");
  process.exit(1);
}

const existing = get<{ id: string; role: string }>("SELECT id, role FROM users WHERE email = ?", email);
if (existing) {
  console.error(`A ${existing.role} account already exists for ${email}.`);
  process.exit(1);
}

const id = crypto.randomUUID();
run(
  `INSERT INTO users (id, role, email, name, status, created_at) VALUES (?, 'admin', ?, ?, 'invited', ?)`,
  id,
  email,
  (nameArg ?? "Easywurld Admin").trim(),
  nowIso(),
);

const token = createActivationToken(id, "activate");
console.log("\nAdministrator created.");
console.log(`  email : ${email}`);
console.log(`  link  : ${config.admin.siteUrl}/login?activate=${token}`);
console.log("\nOpen the link, set a password, and you are in. This token cannot be reused.\n");
