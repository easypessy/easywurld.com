import { useEffect, useState } from "react";
import { Link } from "wouter";
import { api, ApiError, type PortalOverview } from "@/lib/api";
import { OpsShell, Loading, useMe } from "@/components/ops/Shell";
import { bytes, date, ErrorNote, OkNote, Progress, StatusPill, relative } from "@/components/ops/helpers";

const LINKS = [{ href: "/portal", label: "Overview" }];

export default function PortalHome() {
  const { me, loading } = useMe("client");
  const [data, setData] = useState<PortalOverview | null>(null);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [busyId, setBusyId] = useState("");

  useEffect(() => {
    api
      .get<PortalOverview>("/api/portal/overview")
      .then(setData)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Could not load your workspace."));
  }, []);

  async function decide(projectId: string, deliverableId: string, action: "approve" | "request_revision", note: string) {
    setBusyId(deliverableId);
    setError("");
    setNote("");
    try {
      await api.post(`/api/portal/projects/${projectId}/deliverables/${deliverableId}/decision`, { action, note });
      setNote(action === "approve" ? "Approved. Thank you — the team has been notified." : "Revision requested. We will send an updated version.");
      const fresh = await api.get<PortalOverview>("/api/portal/overview");
      setData(fresh);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "That did not go through. Try again.");
    } finally {
      setBusyId("");
    }
  }

  if (loading || !me) return <Loading />;

  const firstName = (data?.client.name ?? me.user?.name ?? "").split(" ")[0];

  return (
    <OpsShell me={me} links={LINKS} title={`Welcome back, ${firstName}`}>
      <ErrorNote error={error} />
      <OkNote note={note} />

      {!data ? (
        <p className="ops-muted">Loading…</p>
      ) : (
        <>
          <section className="ops-grid ops-grid--stats">
            <Stat label="Open projects" value={data.projects.length} />
            <Stat label="Awaiting your approval" value={data.awaitingApproval.length} tone={data.awaitingApproval.length ? "warn" : undefined} />
            <Stat label="Documents shared with you" value={data.recentFiles.length} />
          </section>

          {data.awaitingApproval.length > 0 ? (
            <section className="ops-card ops-card--attention">
              <h2>Needs your decision</h2>
              <p className="ops-muted">We only move forward when you approve. Silence is not approval.</p>
              <div className="ops-stack">
                {data.awaitingApproval.map((d) => (
                  <ApprovalRow key={d.id} item={d} busy={busyId === d.id} onDecide={decide} />
                ))}
              </div>
            </section>
          ) : null}

          <section className="ops-card">
            <h2>Your projects</h2>
            {data.projects.length === 0 ? (
              <p className="ops-muted">No active projects yet. If you have just paid, your workspace appears within minutes.</p>
            ) : (
              <div className="ops-stack">
                {data.projects.map((p) => (
                  <Link key={p.id} href={`/portal/projects/${p.id}`} className="ops-projectrow">
                    <div>
                      <strong>{p.title}</strong>
                      <p className="ops-muted">
                        {p.id} · due {date(p.due_date)} ({relative(p.due_date)})
                      </p>
                    </div>
                    <div className="ops-projectrow-meta">
                      <StatusPill status={p.status} />
                      <Progress value={p.progress} />
                      <small>{p.progress}%</small>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          <div className="ops-cols">
            <section className="ops-card">
              <h2>Recent documents</h2>
              {data.recentFiles.length === 0 ? (
                <p className="ops-muted">Nothing shared yet.</p>
              ) : (
                <ul className="ops-list">
                  {data.recentFiles.map((f) => (
                    <li key={f.id}>
                      <a href={`/api/files/${f.id}/download`}>{f.original_name}</a>
                      <span className="ops-muted"> {bytes(f.size)} · {f.project_title} · {date(f.created_at)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="ops-card">
              <h2>Updates</h2>
              {data.notifications.length === 0 ? (
                <p className="ops-muted">No updates yet.</p>
              ) : (
                <ul className="ops-list ops-list--feed">
                  {data.notifications.slice(0, 6).map((n) => (
                    <li key={n.id}>
                      <strong>{n.subject}</strong>
                      <span className="ops-muted"> {date(n.created_at, true)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </>
      )}
    </OpsShell>
  );
}

function Stat({ label, value, tone }: { label: string; value: number | string; tone?: "warn" }) {
  return (
    <div className={`ops-stat ${tone ? `ops-stat--${tone}` : ""}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function ApprovalRow({
  item,
  busy,
  onDecide,
}: {
  item: { id: string; title: string; version: number; submitted_at: string; project_id: string; project_title: string };
  busy: boolean;
  onDecide: (projectId: string, deliverableId: string, action: "approve" | "request_revision", note: string) => void;
}) {
  const [note, setNote] = useState("");
  const [mode, setMode] = useState<"none" | "revision">("none");

  return (
    <div className="ops-approval">
      <div>
        <strong>{item.title}</strong>
        <p className="ops-muted">
          {item.project_title} · version {item.version} · sent {date(item.submitted_at)}
        </p>
      </div>
      {mode === "revision" ? (
        <div className="ops-approval-form">
          <label className="ops-field">
            <span>What should change?</span>
            <textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Be specific, e.g. “move the offer above the gallery”." />
          </label>
          <div className="ops-actions">
            <button type="button" className="ops-btn ops-btn--primary" disabled={busy || !note.trim()} onClick={() => onDecide(item.project_id, item.id, "request_revision", note)}>
              Send revision request
            </button>
            <button type="button" className="ops-btn" onClick={() => setMode("none")}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="ops-actions">
          <Link href={`/portal/projects/${item.project_id}`} className="ops-btn">Open in project</Link>
          <button type="button" className="ops-btn ops-btn--primary" disabled={busy} onClick={() => onDecide(item.project_id, item.id, "approve", "Approved as delivered")}>
            Approve
          </button>
          <button type="button" className="ops-btn" onClick={() => setMode("revision")}>
            Request revision
          </button>
        </div>
      )}
    </div>
  );
}
