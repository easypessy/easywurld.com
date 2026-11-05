import { useCallback, useEffect, useState } from "react";
import { Link, useRoute } from "wouter";
import { api, ApiError } from "@/lib/api";
import { OpsShell, Loading, useMe } from "@/components/ops/Shell";
import { bytes, date, ErrorNote, OkNote, Progress, StatusPill } from "@/components/ops/helpers";
import { PROJECT_STATUS_LABELS } from "@shared/ops";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/clients", label: "Clients" },
  { href: "/admin/templates", label: "Templates" },
  { href: "/admin/automation", label: "Automation" },
];

export default function AdminProject() {
  const [, params] = useRoute("/admin/projects/:id");
  const projectId = params?.id ?? "";
  const { me, loading } = useMe("admin");
  const [bundle, setBundle] = useState<Record<string, any> | null>(null);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");

  const refresh = useCallback(async () => {
    try {
      const data = await api.get<Record<string, any>>(`/api/admin/projects/${projectId}`);
      setBundle(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not load this project.");
    }
  }, [projectId]);

  useEffect(() => {
    if (me) void refresh();
  }, [me, refresh]);

  if (loading || !me) return <Loading />;
  if (!bundle) {
    return (
      <OpsShell me={me} links={LINKS} title="Project" variant="admin">
        <ErrorNote error={error} />
        {!error ? <p className="ops-muted">Loading…</p> : <Link href="/admin/projects" className="ops-btn">← Back to projects</Link>}
      </OpsShell>
    );
  }

  const { project, client, milestones, tasks, deliverables, files, messages, questionnaire, template, internal } = bundle;

  return (
    <OpsShell me={me} links={LINKS} title={project.title} variant="admin">
      <p className="ops-crumb">
        <Link href="/admin/projects">← All projects</Link> <span>{project.id}</span>
      </p>
      <ErrorNote error={error} />
      <OkNote note={note} />

      <div className="ops-summary">
        <div>
          <StatusPill status={project.status} />
          <p className="ops-muted">
            {client?.name} · {client?.email} · {project.id} · {template?.name ?? project.service_key}
            {project.workspace_path ? <> · <span title={project.workspace_path}>workspace ready</span></> : null}
          </p>
        </div>
        <div className="ops-summary-bar">
          <Progress value={project.progress} />
          <small>
            {project.progress}% · due {date(project.due_date)} · revisions {project.revisions_used}/{project.revision_limit}
          </small>
        </div>
      </div>

      <div className="ops-cols">
        <section className="ops-card">
          <h2>Status & schedule</h2>
          <StatusForm project={project} onDone={refresh} setError={setError} setNote={setNote} />
          <button
            type="button"
            className="ops-btn"
            onClick={async () => {
              try {
                const res = await api.post<{ workspace: { errors: string[] } }>(`/api/admin/projects/${projectId}/retry-workspace`);
                setNote(res.workspace.errors.length ? `Workspace retried with issues: ${res.workspace.errors.join(", ")}` : "Workspace provisioned successfully.");
                await refresh();
              } catch (err) {
                setError(err instanceof ApiError ? err.message : "Retry failed.");
              }
            }}
          >
            Retry folder creation
          </button>
        </section>

        <section className="ops-card">
          <h2>Client status</h2>
          <p className="ops-muted">
            Onboarding: <strong>{questionnaire?.status ?? "none"}</strong> · deliverables waiting: <strong>{deliverables.filter((d: any) => d.status === "submitted").length}</strong>
          </p>
          <ul className="ops-list ops-list--feed">
            {internal.order ? (
              <li>
                <strong>Payment</strong>
                <span className="ops-muted"> · {internal.order.provider} / {internal.order.provider_reference} · verified {date(internal.order.verified_at)}</span>
              </li>
            ) : null}
            {internal.order ? (
              <li><strong>Buyer email</strong><span className="ops-muted"> · {internal.order.buyer_email}</span></li>
            ) : null}
          </ul>
          <h3>Recent automation</h3>
          <ul className="ops-list ops-list--feed">
            {internal.events.slice(0, 6).map((e: any) => (
              <li key={e.id}>
                <strong>{e.event}</strong>
                <span className="ops-muted"> · {e.status} · {date(e.created_at, true)}</span>
                {e.error ? <div className="ops-note ops-danger">{e.error}</div> : null}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="ops-card">
        <h2>Tasks</h2>
        <TaskList tasks={tasks} onDone={refresh} setError={setError} />
        <NewTask projectId={projectId} onDone={refresh} setError={setError} />
      </section>

      <section className="ops-card">
        <h2>Milestones</h2>
        <ul className="ops-checklist">
          {milestones.map((m: any) => (
            <li key={m.id} data-status={m.status === "done" ? "done" : "todo"}>
              <button
                type="button"
                className="ops-check"
                aria-label={m.status === "done" ? "Reopen milestone" : "Complete milestone"}
                onClick={async () => {
                  await api.post(`/api/admin/milestones/${m.id}/complete`);
                  await refresh();
                }}
              />
              <div>
                <strong>{m.title}</strong>
                <p className="ops-muted">{date(m.due_date)} · {m.status}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <div className="ops-cols">
        <section className="ops-card">
          <h2>Submit for approval</h2>
          <DeliverableForm projectId={projectId} files={files} onDone={refresh} setError={setError} setNote={setNote} />
          <h3>History</h3>
          <ul className="ops-list">
            {deliverables.map((d: any) => (
              <li key={d.id}>
                <strong>v{d.version} {d.title}</strong>
                <span className="ops-muted"> · {d.status} · {date(d.submitted_at)}{d.decision_note ? ` · “${d.decision_note}”` : ""}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="ops-card">
          <h2>Files</h2>
          <UploadForm projectId={projectId} onDone={refresh} setError={setError} setNote={setNote} />
          <ul className="ops-list">
            {files.map((f: any) => (
              <li key={f.id}>
                <a href={`/api/files/${f.id}/download`}>{f.original_name}</a>
                <span className="ops-muted"> · {bytes(f.size)} · folder {f.folder_code} · {f.visibility} · {date(f.created_at)}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="ops-card">
        <h2>Messages</h2>
        <div className="ops-thread">
          {messages.length === 0 ? <p className="ops-muted">No messages.</p> : null}
          {messages.map((m: any) => (
            <div key={m.id} className={`ops-msg ${m.sender_role === "admin" ? "ops-msg--me" : ""}`}>
              <div className="ops-msg-head">
                <strong>{m.sender_role === "admin" ? m.sender_name : "Client"}</strong>
                <span>{date(m.created_at, true)}</span>
              </div>
              <p>{m.body}</p>
            </div>
          ))}
        </div>
        <ReplyBox projectId={projectId} onDone={refresh} setError={setError} />
      </section>
    </OpsShell>
  );
}

function StatusForm({ project, onDone, setError, setNote }: { project: Record<string, any>; onDone: () => void; setError: (v: string) => void; setNote: (v: string) => void }) {
  const [status, setStatus] = useState(project.status);
  const [dueDate, setDueDate] = useState(String(project.due_date).slice(0, 10));
  const [revisionLimit, setRevisionLimit] = useState(project.revision_limit);
  const [statusNote, setStatusNote] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <div>
      <div className="ops-form-grid">
        <label className="ops-field">
          <span>Status</span>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            {Object.entries(PROJECT_STATUS_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </label>
        <label className="ops-field"><span>Due date</span><input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} /></label>
        <label className="ops-field"><span>Revision limit</span><input type="number" min={0} max={20} value={revisionLimit} onChange={(e) => setRevisionLimit(Number(e.target.value))} /></label>
        <label className="ops-field ops-field--wide"><span>Note for the client timeline</span><input value={statusNote} onChange={(e) => setStatusNote(e.target.value)} placeholder="e.g. Design approved — build starts Monday" /></label>
      </div>
      <div className="ops-actions">
        <button
          type="button"
          className="ops-btn ops-btn--primary"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            try {
              await api.patch(`/api/admin/projects/${project.id}`, { dueDate: new Date(dueDate).toISOString(), revisionLimit });
              if (status !== project.status) {
                await api.post(`/api/admin/projects/${project.id}/status`, { status, note: statusNote });
              }
              setNote("Project updated.");
              onDone();
            } catch (err) {
              setError(err instanceof ApiError ? err.message : "Could not update the project.");
            } finally {
              setBusy(false);
            }
          }}
        >
          {busy ? "Saving…" : "Save project"}
        </button>
      </div>
    </div>
  );
}

function TaskList({ tasks, onDone, setError }: { tasks: Record<string, any>[]; onDone: () => void; setError: (v: string) => void }) {
  return (
    <div className="ops-tablewrap">
      <table className="ops-table">
        <thead>
          <tr><th>Task</th><th>Priority</th><th>Due</th><th>Client visible</th><th>Status</th></tr>
        </thead>
        <tbody>
          {tasks.map((t) => (
            <tr key={t.id}>
              <td>{t.title}</td>
              <td>{t.priority}</td>
              <td>{date(t.due_date)}</td>
              <td>{t.visible_to_client ? "Yes" : "Internal"}</td>
              <td>
                <select
                  value={t.status}
                  onChange={async (e) => {
                    try {
                      await api.patch(`/api/admin/tasks/${t.id}`, { status: e.target.value });
                      onDone();
                    } catch (err) {
                      setError(err instanceof ApiError ? err.message : "Could not update the task.");
                    }
                  }}
                >
                  <option value="todo">To do</option>
                  <option value="in_progress">In progress</option>
                  <option value="blocked">Blocked</option>
                  <option value="done">Done</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function NewTask({ projectId, onDone, setError }: { projectId: string; onDone: () => void; setError: (v: string) => void }) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("normal");
  const [dueDate, setDueDate] = useState("");
  const [visible, setVisible] = useState(false);

  return (
    <form
      className="ops-form-grid ops-form-inline"
      onSubmit={async (e) => {
        e.preventDefault();
        try {
          await api.post(`/api/admin/projects/${projectId}/tasks`, {
            title,
            priority,
            dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
            visibleToClient: visible,
          });
          setTitle("");
          onDone();
        } catch (err) {
          setError(err instanceof ApiError ? err.message : "Could not add the task.");
        }
      }}
    >
      <label className="ops-field"><span>New task</span><input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="What needs doing?" /></label>
      <label className="ops-field"><span>Priority</span>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          {["low", "normal", "high", "urgent"].map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </label>
      <label className="ops-field"><span>Due</span><input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} /></label>
      <label className="ops-field ops-field--check"><span>Show to client</span><input type="checkbox" checked={visible} onChange={(e) => setVisible(e.target.checked)} /></label>
      <div className="ops-actions"><button className="ops-btn" type="submit">Add task</button></div>
    </form>
  );
}

function UploadForm({ projectId, onDone, setError, setNote }: { projectId: string; onDone: () => void; setError: (v: string) => void; setNote: (v: string) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [folder, setFolder] = useState("03");
  const [visibility, setVisibility] = useState("internal");
  const [busy, setBusy] = useState(false);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (!file) return;
        setBusy(true);
        try {
          await fetch(`/api/admin/projects/${projectId}/files?folder=${folder}&visibility=${visibility}`, {
            method: "POST",
            body: (() => {
              const form = new FormData();
              form.append("file", file);
              return form;
            })(),
            credentials: "same-origin",
          }).then(async (res) => {
            if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Upload failed");
          });
          setNote("File stored in the project workspace.");
          setFile(null);
          onDone();
        } catch (err) {
          setError(err instanceof Error ? err.message : "Upload failed.");
        } finally {
          setBusy(false);
        }
      }}
    >
      <label className="ops-field"><span>Upload a file</span><input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} required /></label>
      <div className="ops-form-grid">
        <label className="ops-field">
          <span>Folder</span>
          <select value={folder} onChange={(e) => setFolder(e.target.value)}>
            <option value="01">01 Onboarding</option>
            <option value="02">02 Client Materials</option>
            <option value="03">03 Working Files (internal)</option>
            <option value="04">04 Review & Approvals</option>
            <option value="05">05 Final Deliverables</option>
            <option value="06">06 Archive</option>
          </select>
        </label>
        <label className="ops-field">
          <span>Visibility</span>
          <select value={visibility} onChange={(e) => setVisibility(e.target.value)}>
            <option value="internal">Internal only</option>
            <option value="client">Visible to client</option>
          </select>
        </label>
      </div>
      <button className="ops-btn" type="submit" disabled={busy || !file}>{busy ? "Uploading…" : "Upload"}</button>
    </form>
  );
}

function DeliverableForm({ projectId, files, onDone, setError, setNote }: { projectId: string; files: Record<string, any>[]; onDone: () => void; setError: (v: string) => void; setNote: (v: string) => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fileId, setFileId] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        try {
          await api.post(`/api/admin/projects/${projectId}/deliverables`, {
            title,
            description,
            fileId: fileId || undefined,
            externalUrl: externalUrl || undefined,
          });
          setNote("Deliverable sent to the client for approval.");
          setTitle("");
          setDescription("");
          setFileId("");
          setExternalUrl("");
          onDone();
        } catch (err) {
          setError(err instanceof ApiError ? err.message : "Could not submit the deliverable.");
        } finally {
          setBusy(false);
        }
      }}
    >
      <label className="ops-field"><span>Title</span><input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. Homepage design v1" /></label>
      <label className="ops-field"><span>What should the client look at?</span><textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} /></label>
      <label className="ops-field">
        <span>Attach a workspace file</span>
        <select value={fileId} onChange={(e) => setFileId(e.target.value)}>
          <option value="">No file — use a link instead</option>
          {files.map((f) => (
            <option key={f.id} value={f.id}>{f.original_name} (folder {f.folder_code})</option>
          ))}
        </select>
      </label>
      <label className="ops-field"><span>…or a link (Drive, Figma, video)</span><input value={externalUrl} onChange={(e) => setExternalUrl(e.target.value)} placeholder="https://" /></label>
      <button className="ops-btn ops-btn--primary" type="submit" disabled={busy}>{busy ? "Submitting…" : "Send for approval"}</button>
    </form>
  );
}

function ReplyBox({ projectId, onDone, setError }: { projectId: string; onDone: () => void; setError: (v: string) => void }) {
  const [body, setBody] = useState("");
  return (
    <form
      className="ops-compose"
      onSubmit={async (e) => {
        e.preventDefault();
        try {
          await api.post(`/api/admin/projects/${projectId}/messages`, { body });
          setBody("");
          onDone();
        } catch (err) {
          setError(err instanceof ApiError ? err.message : "Message not sent.");
        }
      }}
    >
      <label className="ops-field"><span>Reply to the client</span><textarea rows={2} value={body} onChange={(e) => setBody(e.target.value)} /></label>
      <button className="ops-btn" type="submit" disabled={!body.trim()}>Send</button>
    </form>
  );
}
