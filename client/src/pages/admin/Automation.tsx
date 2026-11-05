import { useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";
import { OpsShell, Loading, useMe } from "@/components/ops/Shell";
import { date, ErrorNote, OkNote } from "@/components/ops/helpers";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/clients", label: "Clients" },
  { href: "/admin/templates", label: "Templates" },
  { href: "/admin/automation", label: "Automation" },
];

export default function AdminAutomation() {
  const { me, loading } = useMe("admin");
  const [events, setEvents] = useState<Record<string, any>[]>([]);
  const [outbox, setOutbox] = useState<Record<string, any>[]>([]);
  const [integrations, setIntegrations] = useState<Record<string, any>>({});
  const [filter, setFilter] = useState("");
  const [error, setError] = useState("");
  const [note, setNote] = useState("");

  async function load() {
    const [ev, ob, integ] = await Promise.all([
      api.get<{ events: Record<string, any>[] }>("/api/admin/automation?limit=200"),
      api.get<{ notifications: Record<string, any>[] }>("/api/admin/outbox"),
      api.get<{ integrations: Record<string, any> }>("/api/admin/integrations"),
    ]);
    setEvents(ev.events);
    setOutbox(ob.notifications);
    setIntegrations(integ.integrations);
  }

  useEffect(() => {
    if (!me) return;
    load().catch((err) => setError(err instanceof ApiError ? err.message : "Could not load the automation log."));
  }, [me]);

  if (loading || !me) return <Loading />;

  const shown = events.filter((e) => !filter || e.status === filter || e.event.includes(filter));

  return (
    <OpsShell me={me} links={LINKS} title="Automation & delivery log" variant="admin">
      <ErrorNote error={error} />
      <OkNote note={note} />

      <section className="ops-card">
        <div className="ops-card-head">
          <h2>Connections</h2>
          <code className="ops-code">server-side only</code>
        </div>
        <div className="ops-integrations">
          {Object.entries(integrations).map(([key, value]: [string, any]) => {
            const ok = typeof value === "object" ? Boolean(value.configured) : Boolean(value);
            return (
              <div key={key} className="ops-integration" data-ok={ok}>
                <strong>{key}</strong>
                <small>{typeof value === "object" ? (ok ? value.detail || "connected" : value.detail || "not configured") : ok ? "connected" : "not configured"}</small>
              </div>
            );
          })}
        </div>
        <p className="ops-fine">
          Missing integrations are not failures: notifications stay in the outbox below, and folder creation falls back to local storage.
        </p>
      </section>

      <section className="ops-card">
        <div className="ops-card-head">
          <h2>Outbox</h2>
          <button
            type="button"
            className="ops-btn"
            onClick={async () => {
              try {
                const res = await api.post<{ sent: number; failed: number; logged: number }>("/api/admin/outbox/dispatch");
                setNote(`Dispatch complete — sent ${res.sent}, retrying ${res.failed}, held ${res.logged}.`);
                await load();
              } catch (err) {
                setError(err instanceof ApiError ? err.message : "Dispatch failed.");
              }
            }}
          >
            Retry delivery
          </button>
        </div>
        <div className="ops-tablewrap">
          <table className="ops-table">
            <thead>
              <tr><th>Channel</th><th>To</th><th>Subject</th><th>Status</th><th>Attempts</th><th>Created</th></tr>
            </thead>
            <tbody>
              {outbox.slice(0, 60).map((n) => (
                <tr key={n.id}>
                  <td>{n.channel}</td>
                  <td>{n.recipient}</td>
                  <td>{n.subject}</td>
                  <td>{n.status}{n.last_error ? <div className="ops-muted">{n.last_error}</div> : null}</td>
                  <td>{n.attempts}</td>
                  <td>{date(n.created_at, true)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="ops-card">
        <div className="ops-card-head">
          <h2>Automation events</h2>
          <label className="ops-field ops-field--inline">
            <span>Filter</span>
            <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="failed, purchase, notion…" />
          </label>
        </div>
        <div className="ops-tablewrap">
          <table className="ops-table">
            <thead>
              <tr><th>Event</th><th>Status</th><th>Client</th><th>Project</th><th>Detail / error</th><th>When</th><th /></tr>
            </thead>
            <tbody>
              {shown.map((e) => (
                <tr key={e.id} data-bad={["failed", "rejected"].includes(e.status)}>
                  <td>{e.event}</td>
                  <td>{e.status}</td>
                  <td>{e.client_id ?? "—"}</td>
                  <td>{e.project_id ?? "—"}</td>
                  <td style={{ maxWidth: 320 }}>{e.error ? <span className="ops-danger">{e.error}</span> : <span className="ops-muted">{String(e.detail ?? "").slice(0, 120)}</span>}</td>
                  <td>{date(e.created_at, true)}</td>
                  <td>
                    {e.resolved_at ? (
                      <span className="ops-muted">resolved</span>
                    ) : ["failed", "rejected"].includes(e.status) ? (
                      <button
                        type="button"
                        className="ops-btn ops-btn--small"
                        onClick={async () => {
                          await api.post(`/api/admin/automation/${e.id}/resolve`);
                          await load();
                        }}
                      >
                        Mark resolved
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </OpsShell>
  );
}
