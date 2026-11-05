import { useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";
import { OpsShell, Loading, useMe } from "@/components/ops/Shell";
import { ErrorNote, OkNote } from "@/components/ops/helpers";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/clients", label: "Clients" },
  { href: "/admin/templates", label: "Templates" },
  { href: "/admin/automation", label: "Automation" },
];

interface Template {
  key: string;
  name: string;
  category: string;
  description: string;
  defaultDays: number;
  revisionLimit: number;
  questionnaire: { label: string; required?: boolean }[];
  milestones: { title: string }[];
  tasks: { title: string; visibleToClient?: boolean }[];
  active: boolean;
}

export default function AdminTemplates() {
  const { me, loading } = useMe("admin");
  const [templates, setTemplates] = useState<Template[]>([]);
  const [openKey, setOpenKey] = useState("");
  const [error, setError] = useState("");
  const [note, setNote] = useState("");

  async function load() {
    const res = await api.get<{ templates: Template[] }>("/api/admin/templates");
    setTemplates(res.templates);
  }

  useEffect(() => {
    if (!me) return;
    load().catch((err) => setError(err instanceof ApiError ? err.message : "Could not load templates."));
  }, [me]);

  if (loading || !me) return <Loading />;

  return (
    <OpsShell me={me} links={LINKS} title="Service templates" variant="admin">
      <ErrorNote error={error} />
      <OkNote note={note} />
      <p className="ops-muted">
        Templates decide the tasks, deadlines, questionnaire and revision limit every new project starts with. Editing a template changes future projects only — existing projects keep their plan.
      </p>

      <div className="ops-stack">
        {templates.map((t) => (
          <section className="ops-card" key={t.key}>
            <div className="ops-card-head">
              <div>
                <h2>{t.name}</h2>
                <p className="ops-muted">{t.category} · {t.defaultDays} days · {t.revisionLimit} revision{t.revisionLimit === 1 ? "" : "s"} · {t.tasks.length} tasks · {t.questionnaire.length} questions {t.active ? "" : "· inactive"}</p>
              </div>
              <button type="button" className="ops-btn" onClick={() => setOpenKey(openKey === t.key ? "" : t.key)}>
                {openKey === t.key ? "Close" : "Edit"}
              </button>
            </div>
            {openKey === t.key ? (
              <TemplateEditor
                template={t}
                onSaved={() => {
                  setNote(`${t.name} updated. New purchases will use this plan.`);
                  setOpenKey("");
                  void load();
                }}
                setError={setError}
              />
            ) : (
              <>
                <p>{t.description}</p>
                <details>
                  <summary>What the client is asked</summary>
                  <ul className="ops-list">
                    {t.questionnaire.map((q, i) => (
                      <li key={i}>{q.label}{q.required ? " *" : ""}</li>
                    ))}
                  </ul>
                </details>
                <details>
                  <summary>Internal plan</summary>
                  <ol className="ops-list">
                    {t.tasks.map((task, i) => (
                      <li key={i}>
                        {task.title}
                        {task.visibleToClient ? <span className="ops-muted"> · shown to client</span> : null}
                      </li>
                    ))}
                  </ol>
                </details>
              </>
            )}
          </section>
        ))}
      </div>
    </OpsShell>
  );
}

function TemplateEditor({ template, onSaved, setError }: { template: Template; onSaved: () => void; setError: (v: string) => void }) {
  const [days, setDays] = useState(template.defaultDays);
  const [limit, setLimit] = useState(template.revisionLimit);
  const [active, setActive] = useState(template.active);
  const [tasks, setTasks] = useState(template.tasks.map((t) => ({ ...t })));
  const [busy, setBusy] = useState(false);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        try {
          await api.put(`/api/admin/templates/${template.key}`, {
            defaultDays: Number(days),
            revisionLimit: Number(limit),
            active,
            tasks: tasks.map((t, i) => ({
              title: t.title,
              visibleToClient: Boolean(t.visibleToClient),
              offsetDays: Math.round((i / Math.max(tasks.length - 1, 1)) * Number(days)),
              priority: "normal",
            })),
            milestones: template.milestones,
            questionnaire: template.questionnaire,
          });
          onSaved();
        } catch (err) {
          setError(err instanceof ApiError ? err.message : "Could not save the template.");
        } finally {
          setBusy(false);
        }
      }}
    >
      <div className="ops-form-grid">
        <label className="ops-field"><span>Delivery days</span><input type="number" min={1} max={180} value={days} onChange={(e) => setDays(Number(e.target.value))} /></label>
        <label className="ops-field"><span>Included revisions</span><input type="number" min={0} max={20} value={limit} onChange={(e) => setLimit(Number(e.target.value))} /></label>
        <label className="ops-field ops-field--check"><span>Active</span><input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} /></label>
      </div>
      <h3>Tasks</h3>
      <ul className="ops-list">
        {tasks.map((t, i) => (
          <li key={i} className="ops-taskedit">
            <input
              value={t.title}
              onChange={(e) => setTasks((list) => list.map((item, idx) => (idx === i ? { ...item, title: e.target.value } : item)))}
            />
            <label className="ops-inline-check">
              <input
                type="checkbox"
                checked={Boolean(t.visibleToClient)}
                onChange={(e) => setTasks((list) => list.map((item, idx) => (idx === i ? { ...item, visibleToClient: e.target.checked } : item)))}
              />
              client visible
            </label>
            <button type="button" className="ops-btn ops-btn--small ops-btn--danger" onClick={() => setTasks((list) => list.filter((_, idx) => idx !== i))}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      <div className="ops-actions">
        <button type="button" className="ops-btn" onClick={() => setTasks((list) => [...list, { title: "New task", visibleToClient: false } as any])}>
          Add task
        </button>
        <button className="ops-btn ops-btn--primary" type="submit" disabled={busy}>{busy ? "Saving…" : "Save template"}</button>
      </div>
    </form>
  );
}
