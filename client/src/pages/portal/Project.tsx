import { useCallback, useEffect, useState } from "react";
import { Link, useRoute } from "wouter";
import { api, ApiError } from "@/lib/api";
import { OpsShell, Loading, useMe } from "@/components/ops/Shell";
import { bytes, date, ErrorNote, OkNote, Progress, StatusPill, statusLabel } from "@/components/ops/helpers";

interface Bundle {
  project: Record<string, any>;
  client: Record<string, any>;
  milestones: Record<string, any>[];
  tasks: Record<string, any>[];
  history: Record<string, any>[];
  deliverables: Record<string, any>[];
  questionnaire: { id: string; status: string; answers: Record<string, any>[] } | null;
  messages: Record<string, any>[];
  files: Record<string, any>[];
  reviews: Record<string, any>[];
  template: { questionnaire: { key: string; label: string; type: string; required?: boolean; help?: string; options?: string[] }[] } | null;
}

const TABS = ["Overview", "Onboarding", "Files", "Review & approval", "Messages"] as const;
type Tab = (typeof TABS)[number];

export default function PortalProject() {
  const [, params] = useRoute("/portal/projects/:id");
  const projectId = params?.id ?? "";
  const { me, loading } = useMe("client");
  const [bundle, setBundle] = useState<Bundle | null>(null);
  const [tab, setTab] = useState<Tab>("Overview");
  const [error, setError] = useState("");
  const [note, setNote] = useState("");

  const refresh = useCallback(async () => {
    try {
      const data = await api.get<Bundle>(`/api/portal/projects/${projectId}`);
      setBundle(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not load this project.");
    }
  }, [projectId]);

  useEffect(() => {
    if (me) void refresh();
  }, [me, refresh]);

  if (loading || !me) return <Loading />;
  if (error && !bundle) {
    return (
      <OpsShell me={me} links={[{ href: "/portal", label: "Overview" }]} title="Project">
        <ErrorNote error={error} />
        <Link href="/portal" className="ops-btn">← Back to overview</Link>
      </OpsShell>
    );
  }
  if (!bundle) return <Loading />;

  const { project } = bundle;

  return (
    <OpsShell me={me} links={[{ href: "/portal", label: "Overview" }]} title={project.title}>
      <p className="ops-crumb">
        <Link href="/portal">← All projects</Link>
        <span> {project.id}</span>
      </p>
      <ErrorNote error={error} />
      <OkNote note={note} />

      <div className="ops-summary">
        <div>
          <StatusPill status={project.status} />
          <p className="ops-muted">
            Started {date(project.start_date)} · target {date(project.due_date)} · revisions used {project.revisions_used}/{project.revision_limit}
          </p>
        </div>
        <div className="ops-summary-bar">
          <Progress value={project.progress} />
          <small>{project.progress}% complete</small>
        </div>
      </div>

      <nav className="ops-tabs" aria-label="Project sections">
        {TABS.map((t) => (
          <button key={t} type="button" className={tab === t ? "on" : ""} onClick={() => setTab(t)}>
            {t}
            {t === "Review & approval" && bundle.deliverables.some((d) => d.status === "submitted") ? <span className="ops-dot" aria-hidden="true" /> : null}
          </button>
        ))}
      </nav>

      {tab === "Overview" ? <Overview bundle={bundle} /> : null}
      {tab === "Onboarding" ? <Onboarding bundle={bundle} onChange={refresh} setNote={setNote} setError={setError} /> : null}
      {tab === "Files" ? <Files bundle={bundle} onChange={refresh} setError={setError} setNote={setNote} /> : null}
      {tab === "Review & approval" ? <Reviews bundle={bundle} onChange={refresh} setError={setError} setNote={setNote} /> : null}
      {tab === "Messages" ? <Messages bundle={bundle} onChange={refresh} setError={setError} /> : null}
    </OpsShell>
  );
}

function Overview({ bundle }: { bundle: Bundle }) {
  const { project, milestones, tasks, history } = bundle;
  return (
    <div className="ops-cols">
      <section className="ops-card">
        <h2>What we are doing</h2>
        <p>{project.description ?? "A tailored project for your business."}</p>
        <h3>Outstanding requirements</h3>
        {bundle.questionnaire?.status === "pending" ? (
          <p className="ops-alert ops-alert--warn">Please complete your onboarding questionnaire — this is the only thing blocking production.</p>
        ) : null}
        {tasks.length === 0 ? (
          <p className="ops-muted">Nothing outstanding from you right now.</p>
        ) : (
          <ul className="ops-checklist">
            {tasks.map((t) => (
              <li key={t.id} data-status={t.status}>
                <span className="ops-check" aria-hidden="true" />
                <div>
                  <strong>{t.title}</strong>
                  <p className="ops-muted">
                    {statusLabelTask(t.status)} · {date(t.due_date)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="ops-card">
        <h2>Timeline</h2>
        <ol className="ops-timeline">
          {milestones.map((m) => (
            <li key={m.id} data-done={m.status === "done"}>
              <strong>{m.title}</strong>
              <span className="ops-muted">{date(m.due_date)}</span>
            </li>
          ))}
        </ol>
        <h3>Progress log</h3>
        <ul className="ops-list ops-list--feed">
          {history.slice().reverse().map((h, i) => (
            <li key={i}>
              <strong>{statusLabel(h.to_status)}</strong>
              {h.note ? <span> — {h.note}</span> : null}
              <span className="ops-muted"> {date(h.created_at, true)}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function statusLabelTask(status: string) {
  return ({ todo: "To do", in_progress: "In progress", blocked: "Waiting on us", done: "Done" } as Record<string, string>)[status] ?? status;
}

function Onboarding({ bundle, onChange, setNote, setError }: { bundle: Bundle; onChange: () => void; setNote: (v: string) => void; setError: (v: string) => void }) {
  const fields = bundle.template?.questionnaire ?? [];
  const submitted = bundle.questionnaire?.status === "submitted";
  const existing = Object.fromEntries((bundle.questionnaire?.answers ?? []).map((a) => [a.field_key, a.answer]));
  const [values, setValues] = useState<Record<string, string>>(existing);
  const [busy, setBusy] = useState(false);

  const set = (key: string, value: string) => setValues((v) => ({ ...v, [key]: value }));

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api.post(`/api/portal/projects/${bundle.project.id}/questionnaire`, { answers: values });
      setNote("Onboarding submitted. The team has been notified.");
      onChange();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save your answers.");
    } finally {
      setBusy(false);
    }
  }

  if (submitted) {
    return (
      <section className="ops-card">
        <h2>Onboarding complete</h2>
        <p className="ops-muted">Submitted {date(bundle.questionnaire?.answers?.[0]?.answered_at)}. Need to change something? Send a message on the Messages tab.</p>
        <dl className="ops-dl">
          {fields.map((f) => (
            <div key={f.key}>
              <dt>{f.label}</dt>
              <dd>{existing[f.key] ?? "—"}</dd>
            </div>
          ))}
        </dl>
      </section>
    );
  }

  return (
    <form className="ops-card" onSubmit={submit}>
      <h2>Tell us about the project</h2>
      <p className="ops-muted">These questions are specific to what you purchased. Everything here is private to your workspace.</p>
      {fields.map((f) => (
        <label className="ops-field" key={f.key}>
          <span>
            {f.label}
            {f.required ? <em> *</em> : null}
          </span>
          {f.type === "longtext" ? (
            <textarea rows={4} value={values[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)} />
          ) : f.type === "select" ? (
            <select value={values[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)}>
              <option value="">Choose…</option>
              {(f.options ?? []).map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={f.type === "date" ? "date" : f.type === "url" ? "url" : "text"}
              value={values[f.key] ?? ""}
              onChange={(e) => set(f.key, e.target.value)}
            />
          )}
          {f.help ? <small className="ops-muted">{f.help}</small> : null}
        </label>
      ))}
      <button className="ops-btn ops-btn--primary" disabled={busy} type="submit">
        {busy ? "Sending…" : "Submit onboarding"}
      </button>
    </form>
  );
}

function Files({ bundle, onChange, setError, setNote }: { bundle: Bundle; onChange: () => void; setError: (v: string) => void; setNote: (v: string) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  async function upload(event: React.FormEvent) {
    event.preventDefault();
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      await api.upload(`/api/portal/projects/${bundle.project.id}/files`, file);
      setNote(`Uploaded ${file.name}. The team has been notified.`);
      setFile(null);
      onChange();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="ops-cols">
      <section className="ops-card">
        <h2>Send us your materials</h2>
        <p className="ops-muted">Logos, photos, product details, brand documents, reference files. PDF, Office, image, audio, video and zip up to 25 MB. For bigger media, send a Drive or Dropbox link.</p>
        <form onSubmit={upload}>
          <label className="ops-field">
            <span>Choose a file</span>
            <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} required />
          </label>
          <button className="ops-btn ops-btn--primary" type="submit" disabled={busy || !file}>
            {busy ? "Uploading…" : "Upload to my project"}
          </button>
        </form>
      </section>

      <section className="ops-card">
        <h2>Your documents</h2>
        {bundle.files.length === 0 ? (
          <p className="ops-muted">Nothing here yet.</p>
        ) : (
          <ul className="ops-list">
            {bundle.files.map((f) => (
              <li key={f.id}>
                <a href={`/api/files/${f.id}/download`}>{f.original_name}</a>
                <span className="ops-muted"> {bytes(f.size)} · {date(f.created_at)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Reviews({ bundle, onChange, setError, setNote }: { bundle: Bundle; onChange: () => void; setError: (v: string) => void; setNote: (v: string) => void }) {
  const [note, setLocalNote] = useState("");
  const [openFor, setOpenFor] = useState("");
  const [busy, setBusy] = useState("");

  async function decide(deliverableId: string, action: "approve" | "request_revision") {
    setBusy(deliverableId);
    setError("");
    try {
      await api.post(`/api/portal/projects/${bundle.project.id}/deliverables/${deliverableId}/decision`, { action, note });
      setNote(action === "approve" ? "Approved and recorded." : "Revision requested.");
      setOpenFor("");
      setLocalNote("");
      onChange();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "That did not go through.");
    } finally {
      setBusy("");
    }
  }

  return (
    <section className="ops-card">
      <h2>Work for your review</h2>
      <p className="ops-muted">
        Revisions used: {bundle.project.revisions_used} of {bundle.project.revision_limit}. Additional revisions may be quoted separately.
      </p>
      {bundle.deliverables.length === 0 ? (
        <p className="ops-muted">Nothing submitted yet. You will get an email and an in-app update when work is ready.</p>
      ) : (
        <div className="ops-stack">
          {bundle.deliverables.map((d) => (
            <div className="ops-deliverable" key={d.id} data-status={d.status}>
              <div>
                <strong>{d.title}</strong>
                <p className="ops-muted">
                  Version {d.version} · {d.status.replace(/_/g, " ")} · submitted {date(d.submitted_at)}
                </p>
                {d.description ? <p>{d.description}</p> : null}
                <div className="ops-actions">
                  {d.file_id ? (
                    <a className="ops-btn" href={`/api/files/${d.file_id}/download`}>
                      Download {d.file_name ? `(${d.file_name})` : "file"}
                    </a>
                  ) : null}
                  {d.external_url ? (
                    <a className="ops-btn" href={d.external_url} target="_blank" rel="noopener noreferrer">
                      Open link
                    </a>
                  ) : null}
                  {["submitted", "revision_requested"].includes(d.status) ? (
                    <>
                      <button type="button" className="ops-btn ops-btn--primary" disabled={busy === d.id} onClick={() => decide(d.id, "approve")}>
                        Approve
                      </button>
                      <button type="button" className="ops-btn" onClick={() => setOpenFor(openFor === d.id ? "" : d.id)}>
                        Request revision
                      </button>
                    </>
                  ) : null}
                </div>
                {openFor === d.id ? (
                  <div className="ops-approval-form">
                    <label className="ops-field">
                      <span>What should change?</span>
                      <textarea rows={3} value={note} onChange={(e) => setLocalNote(e.target.value)} />
                    </label>
                    <div className="ops-actions">
                      <button type="button" className="ops-btn ops-btn--primary" disabled={!note.trim() || busy === d.id} onClick={() => decide(d.id, "request_revision")}>
                        Send request
                      </button>
                      <button type="button" className="ops-btn" onClick={() => setOpenFor("")}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : null}
                {d.decision_note ? <p className="ops-muted">Your note: {d.decision_note}</p> : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function Messages({ bundle, onChange, setError }: { bundle: Bundle; onChange: () => void; setError: (v: string) => void }) {
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);

  async function send(event: React.FormEvent) {
    event.preventDefault();
    if (!body.trim()) return;
    setBusy(true);
    setError("");
    try {
      await api.post(`/api/portal/projects/${bundle.project.id}/messages`, { body });
      setBody("");
      onChange();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Message not sent.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="ops-card">
      <h2>Messages</h2>
      <p className="ops-muted">Everything about this project in one thread — no WhatsApp scroll-back.</p>
      <div className="ops-thread">
        {bundle.messages.length === 0 ? <p className="ops-muted">No messages yet.</p> : null}
        {bundle.messages.map((m) => (
          <div key={m.id} className={`ops-msg ${m.sender_role === "client" ? "ops-msg--me" : ""}`}>
            <div className="ops-msg-head">
              <strong>{m.sender_role === "client" ? "You" : "Easywurld"}</strong>
              <span>{date(m.created_at, true)}</span>
            </div>
            <p>{m.body}</p>
          </div>
        ))}
      </div>
      <form onSubmit={send} className="ops-compose">
        <label className="ops-field">
          <span>Reply</span>
          <textarea rows={3} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Ask a question or send an update…" />
        </label>
        <button className="ops-btn ops-btn--primary" type="submit" disabled={busy || !body.trim()}>
          {busy ? "Sending…" : "Send message"}
        </button>
      </form>
    </section>
  );
}
