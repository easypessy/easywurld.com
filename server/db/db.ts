import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import { config, ensureDirs } from "../config.ts";

/**
 * SQLite access layer built on Node's built-in `node:sqlite`.
 * No native compilation, no external database, no monthly cost.
 */

ensureDirs();

export const db = new DatabaseSync(config.dbFile);

db.exec("PRAGMA journal_mode = WAL;");
db.exec("PRAGMA foreign_keys = ON;");
db.exec("PRAGMA busy_timeout = 5000;");

const MIGRATIONS: { id: string; sql: string }[] = [
  {
    id: "001_core",
    sql: `
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id TEXT PRIMARY KEY,
      applied_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      role TEXT NOT NULL CHECK (role IN ('admin','client')),
      email TEXT NOT NULL COLLATE NOCASE UNIQUE,
      name TEXT NOT NULL,
      phone TEXT,
      password_hash TEXT,
      status TEXT NOT NULL DEFAULT 'invited' CHECK (status IN ('invited','active','disabled')),
      must_change_password INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      last_login_at TEXT
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token_hash TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      revoked_at TEXT,
      ip TEXT,
      user_agent TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);

    CREATE TABLE IF NOT EXISTS activation_tokens (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token_hash TEXT NOT NULL UNIQUE,
      purpose TEXT NOT NULL DEFAULT 'activate',
      created_at TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      used_at TEXT
    );

    CREATE TABLE IF NOT EXISTS clients (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL COLLATE NOCASE UNIQUE,
      phone TEXT,
      company TEXT,
      purchase_date TEXT,
      status TEXT NOT NULL DEFAULT 'invited',
      internal_notes TEXT,
      workspace_path TEXT,
      drive_folder_id TEXT,
      dropbox_path TEXT,
      notion_page_id TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      provider TEXT NOT NULL,
      provider_reference TEXT NOT NULL,
      amount_minor INTEGER NOT NULL DEFAULT 0,
      currency TEXT NOT NULL DEFAULT 'NGN',
      status TEXT NOT NULL CHECK (status IN ('pending','paid','failed','refunded','rejected')),
      buyer_name TEXT,
      buyer_email TEXT COLLATE NOCASE,
      buyer_phone TEXT,
      service_key TEXT,
      offer_slug TEXT,
      service_name TEXT,
      client_id TEXT REFERENCES clients(id) ON DELETE SET NULL,
      project_id TEXT,
      verified_via TEXT,
      raw_payload TEXT,
      created_at TEXT NOT NULL,
      verified_at TEXT,
      UNIQUE (provider, provider_reference)
    );
    CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(buyer_email);

    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
      order_id TEXT REFERENCES orders(id) ON DELETE SET NULL,
      title TEXT NOT NULL,
      service_key TEXT NOT NULL,
      template_key TEXT NOT NULL,
      description TEXT,
      status TEXT NOT NULL DEFAULT 'awaiting_onboarding',
      start_date TEXT NOT NULL,
      due_date TEXT NOT NULL,
      completed_at TEXT,
      progress INTEGER NOT NULL DEFAULT 0,
      revision_limit INTEGER NOT NULL DEFAULT 2,
      revisions_used INTEGER NOT NULL DEFAULT 0,
      workspace_path TEXT,
      drive_folder_id TEXT,
      dropbox_path TEXT,
      notion_page_id TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_projects_client ON projects(client_id);
    CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);

    CREATE TABLE IF NOT EXISTS project_status_history (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      from_status TEXT,
      to_status TEXT NOT NULL,
      actor_id TEXT,
      actor_role TEXT,
      note TEXT,
      created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_status_history_project ON project_status_history(project_id);

    CREATE TABLE IF NOT EXISTS milestones (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      due_date TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      sort_order INTEGER NOT NULL DEFAULT 0,
      completed_at TEXT,
      created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_milestones_project ON milestones(project_id);

    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT,
      priority TEXT NOT NULL DEFAULT 'normal',
      due_date TEXT,
      status TEXT NOT NULL DEFAULT 'todo',
      depends_on TEXT,
      visible_to_client INTEGER NOT NULL DEFAULT 0,
      sort_order INTEGER NOT NULL DEFAULT 0,
      completed_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_tasks_project ON tasks(project_id);

    CREATE TABLE IF NOT EXISTS questionnaires (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL UNIQUE REFERENCES projects(id) ON DELETE CASCADE,
      template_key TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      submitted_at TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS questionnaire_answers (
      id TEXT PRIMARY KEY,
      questionnaire_id TEXT NOT NULL REFERENCES questionnaires(id) ON DELETE CASCADE,
      field_key TEXT NOT NULL,
      question TEXT NOT NULL,
      answer TEXT,
      answered_at TEXT NOT NULL,
      UNIQUE (questionnaire_id, field_key)
    );

    CREATE TABLE IF NOT EXISTS deliverables (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT,
      version INTEGER NOT NULL DEFAULT 1,
      status TEXT NOT NULL DEFAULT 'draft',
      file_id TEXT,
      external_url TEXT,
      submitted_at TEXT,
      decided_at TEXT,
      decision_note TEXT,
      supersedes_id TEXT,
      created_by TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_deliverables_project ON deliverables(project_id);

    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      deliverable_id TEXT NOT NULL REFERENCES deliverables(id) ON DELETE CASCADE,
      actor_id TEXT NOT NULL,
      actor_role TEXT NOT NULL,
      action TEXT NOT NULL CHECK (action IN ('approve','request_revision')),
      note TEXT,
      created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_reviews_deliverable ON reviews(deliverable_id);

    CREATE TABLE IF NOT EXISTS files (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
      deliverable_id TEXT REFERENCES deliverables(id) ON DELETE SET NULL,
      folder_code TEXT NOT NULL DEFAULT '03',
      original_name TEXT NOT NULL,
      stored_name TEXT NOT NULL,
      mime TEXT,
      size INTEGER NOT NULL DEFAULT 0,
      visibility TEXT NOT NULL DEFAULT 'internal' CHECK (visibility IN ('internal','client')),
      uploaded_by TEXT NOT NULL,
      uploader_role TEXT NOT NULL,
      checksum TEXT,
      created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_files_project ON files(project_id);

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      sender_id TEXT NOT NULL,
      sender_role TEXT NOT NULL,
      sender_name TEXT NOT NULL,
      body TEXT NOT NULL,
      created_at TEXT NOT NULL,
      read_by_client_at TEXT,
      read_by_admin_at TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_messages_project ON messages(project_id);

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      channel TEXT NOT NULL CHECK (channel IN ('email','whatsapp','inapp')),
      recipient TEXT NOT NULL,
      subject TEXT NOT NULL,
      body TEXT NOT NULL,
      entity_type TEXT,
      entity_id TEXT,
      status TEXT NOT NULL DEFAULT 'queued',
      dedupe_key TEXT UNIQUE,
      attempts INTEGER NOT NULL DEFAULT 0,
      last_error TEXT,
      scheduled_for TEXT,
      created_at TEXT NOT NULL,
      sent_at TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications(status);

    CREATE TABLE IF NOT EXISTS automation_events (
      id TEXT PRIMARY KEY,
      event TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('success','failed','skipped','rejected')),
      client_id TEXT,
      project_id TEXT,
      order_id TEXT,
      detail TEXT,
      error TEXT,
      retriable INTEGER NOT NULL DEFAULT 0,
      resolved_at TEXT,
      created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_automation_event ON automation_events(event);
    CREATE INDEX IF NOT EXISTS idx_automation_status ON automation_events(status);

    CREATE TABLE IF NOT EXISTS audit_log (
      id TEXT PRIMARY KEY,
      actor_id TEXT,
      actor_role TEXT,
      action TEXT NOT NULL,
      entity_type TEXT,
      entity_id TEXT,
      ip TEXT,
      detail TEXT,
      created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_log(entity_type, entity_id);

    CREATE TABLE IF NOT EXISTS service_templates (
      key TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT,
      default_days INTEGER NOT NULL DEFAULT 14,
      revision_limit INTEGER NOT NULL DEFAULT 2,
      questionnaire_json TEXT NOT NULL,
      milestones_json TEXT NOT NULL,
      tasks_json TEXT NOT NULL,
      active INTEGER NOT NULL DEFAULT 1,
      updated_at TEXT NOT NULL
    );
    `,
  },
  {
    id: "002_indexes",
    sql: `
    CREATE INDEX IF NOT EXISTS idx_deliverables_status ON deliverables(project_id, status);
    CREATE INDEX IF NOT EXISTS idx_orders_project ON orders(project_id);
    CREATE INDEX IF NOT EXISTS idx_notifications_entity ON notifications(entity_type, entity_id);
    `,
  },
];

function migrate(): void {
  db.exec("CREATE TABLE IF NOT EXISTS schema_migrations (id TEXT PRIMARY KEY, applied_at TEXT NOT NULL);");
  const applied = new Set(
    (db.prepare("SELECT id FROM schema_migrations").all() as { id: string }[]).map((r) => r.id),
  );
  for (const m of MIGRATIONS) {
    if (applied.has(m.id)) continue;
    db.exec("BEGIN");
    try {
      db.exec(m.sql);
      db.prepare("INSERT INTO schema_migrations (id, applied_at) VALUES (?, ?)").run(m.id, new Date().toISOString());
      db.exec("COMMIT");
    } catch (err) {
      db.exec("ROLLBACK");
      throw err;
    }
  }
}

migrate();

/* ------------------------------- helpers -------------------------------- */

export type Row = Record<string, any>;

export function all<T = Row>(sql: string, ...params: unknown[]): T[] {
  return db.prepare(sql).all(...(params as never[])) as T[];
}

export function get<T = Row>(sql: string, ...params: unknown[]): T | undefined {
  return db.prepare(sql).get(...(params as never[])) as T | undefined;
}

const bindable = (params: unknown[]): unknown[] =>
  params.map((p) => (p === undefined ? null : typeof p === "boolean" ? (p ? 1 : 0) : p));

export function run(sql: string, ...params: unknown[]): { changes: number; lastInsertRowid: number } {
  const r = db.prepare(sql).run(...(bindable(params) as never[]));
  return { changes: Number(r.changes), lastInsertRowid: Number(r.lastInsertRowid) };
}

/** Run a function inside an immediate transaction; rolls back on throw. */
export function tx<T>(fn: () => T): T {
  db.exec("BEGIN IMMEDIATE");
  try {
    const result = fn();
    db.exec("COMMIT");
    return result;
  } catch (err) {
    try {
      db.exec("ROLLBACK");
    } catch {
      /* already rolled back */
    }
    throw err;
  }
}

export function getSetting(key: string, fallback = ""): string {
  const row = get<{ value: string }>("SELECT value FROM settings WHERE key = ?", key);
  return row?.value ?? fallback;
}

export function setSetting(key: string, value: string): void {
  run(
    `INSERT INTO settings (key, value, updated_at) VALUES (?, ?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
    key,
    value,
    new Date().toISOString(),
  );
}

/** Monotonic sequence inside a transaction, used for human-readable IDs. */
export function nextSequence(name: string): number {
  const current = Number(getSetting(name, "0"));
  const next = current + 1;
  setSetting(name, String(next));
  return next;
}

export function pad(n: number, width = 4): string {
  return String(n).padStart(width, "0");
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function addDays(days: number, from = new Date()): string {
  const d = new Date(from);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

/** Test helper: drop every row but keep the schema. */
export function resetDatabase(): void {
  const tables = all<{ name: string }>(
    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name != 'schema_migrations'",
  );
  db.exec("PRAGMA foreign_keys = OFF;");
  for (const t of tables) db.exec(`DELETE FROM "${t.name}";`);
  db.exec("PRAGMA foreign_keys = ON;");
}

export function backupTo(file: string): void {
  if (fs.existsSync(file)) fs.rmSync(file);
  db.exec(`VACUUM INTO '${file.replace(/'/g, "''")}'`);
}
