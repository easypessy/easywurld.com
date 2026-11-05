import { all, get, nowIso, run } from "../db/db.ts";
import { SERVICE_TEMPLATES, type QuestionnaireField, type TemplateMilestone, type TemplateTask } from "../../shared/ops.ts";

export interface StoredTemplate {
  key: string;
  name: string;
  category: string;
  description: string;
  defaultDays: number;
  revisionLimit: number;
  questionnaire: QuestionnaireField[];
  milestones: TemplateMilestone[];
  tasks: TemplateTask[];
  active: boolean;
}

function parse(row: Record<string, any>): StoredTemplate {
  return {
    key: row.key,
    name: row.name,
    category: row.category,
    description: row.description ?? "",
    defaultDays: Number(row.default_days),
    revisionLimit: Number(row.revision_limit),
    questionnaire: JSON.parse(row.questionnaire_json ?? "[]"),
    milestones: JSON.parse(row.milestones_json ?? "[]"),
    tasks: JSON.parse(row.tasks_json ?? "[]"),
    active: Boolean(row.active),
  };
}

/** Idempotent: inserts defaults once, never overwrites admin edits. */
export function seedTemplates(): void {
  for (const t of SERVICE_TEMPLATES) {
    const existing = get("SELECT key FROM service_templates WHERE key = ?", t.key);
    if (existing) continue;
    run(
      `INSERT INTO service_templates (key, name, category, description, default_days, revision_limit,
        questionnaire_json, milestones_json, tasks_json, active, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`,
      t.key,
      t.name,
      t.category,
      t.description,
      t.defaultDays,
      t.revisionLimit,
      JSON.stringify(t.questionnaire),
      JSON.stringify(t.milestones),
      JSON.stringify(t.tasks),
      nowIso(),
    );
  }
}

export function listTemplates(includeInactive = false): StoredTemplate[] {
  const rows = all(
    `SELECT * FROM service_templates ${includeInactive ? "" : "WHERE active = 1"} ORDER BY name ASC`,
  );
  return rows.map(parse);
}

export function getTemplate(key: string): StoredTemplate | undefined {
  const row = get("SELECT * FROM service_templates WHERE key = ?", key);
  return row ? parse(row) : undefined;
}

export interface TemplatePatch {
  name?: string;
  category?: string;
  description?: string;
  defaultDays?: number;
  revisionLimit?: number;
  questionnaire?: QuestionnaireField[];
  milestones?: TemplateMilestone[];
  tasks?: TemplateTask[];
  active?: boolean;
}

export function updateTemplate(key: string, patch: TemplatePatch): StoredTemplate {
  const current = getTemplate(key);
  if (!current) throw new Error(`Unknown template: ${key}`);
  const defined = Object.fromEntries(Object.entries(patch).filter(([, v]) => v !== undefined));
  const next: StoredTemplate = {
    ...current,
    ...defined,
    defaultDays: defined.defaultDays ?? current.defaultDays,
    revisionLimit: defined.revisionLimit ?? current.revisionLimit,
  };
  run(
    `UPDATE service_templates SET name = ?, category = ?, description = ?, default_days = ?, revision_limit = ?,
       questionnaire_json = ?, milestones_json = ?, tasks_json = ?, active = ?, updated_at = ?
     WHERE key = ?`,
    next.name ?? null,
    next.category ?? null,
    next.description ?? null,
    next.defaultDays,
    next.revisionLimit,
    JSON.stringify(next.questionnaire ?? []),
    JSON.stringify(next.milestones ?? []),
    JSON.stringify(next.tasks ?? []),
    next.active ? 1 : 0,
    nowIso(),
    key,
  );
  return next;
}

export function createTemplate(t: StoredTemplate): StoredTemplate {
  run(
    `INSERT INTO service_templates (key, name, category, description, default_days, revision_limit,
      questionnaire_json, milestones_json, tasks_json, active, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    t.key,
    t.name,
    t.category,
    t.description,
    t.defaultDays,
    t.revisionLimit,
    JSON.stringify(t.questionnaire),
    JSON.stringify(t.milestones),
    JSON.stringify(t.tasks),
    t.active ? 1 : 0,
    nowIso(),
  );
  return t;
}
