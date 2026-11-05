import { useEffect, useState } from "react";
import { Link } from "wouter";
import { api, ApiError } from "@/lib/api";
import { OpsShell, Loading, useMe } from "@/components/ops/Shell";
import { date, ErrorNote, OkNote, StatusPill } from "@/components/ops/helpers";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/clients", label: "Clients" },
  { href: "/admin/templates", label: "Templates" },
  { href: "/admin/automation", label: "Automation" },
];

export default function AdminClients() {
  const { me, loading } = useMe("admin");
  const [clients, setClients] = useState<Record<string, any>[]>([]);
  const [q, setQ] = useState("");
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [editing, setEditing] = useState<string>("");

  async function load() {
    const res = await api.get<{ clients: Record<string, any>[] }>(`/api/admin/clients?q=${encodeURIComponent(q)}`);
    setClients(res.clients);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      load().catch((err) => setError(err instanceof ApiError ? err.message : "Could not load clients."));
    }, 250);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  async function removeClient(id: string) {
    if (!window.confirm("Permanently delete this client's personal data, logins and projects? This cannot be undone.")) return;
    try {
      await api.del(`/api/admin/clients/${id}`, { confirm: id });
      setNote("Client data deleted. An audit entry was recorded.");
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not delete that client.");
    }
  }

  if (loading || !me) return <Loading />;

  return (
    <OpsShell me={me} links={LINKS} title="Clients" variant="admin">
      <ErrorNote error={error} />
      <OkNote note={note} />
      <div className="ops-filters">
        <label className="ops-field">
          <span>Search</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name, email or client ID" />
        </label>
      </div>

      <section className="ops-card">
        {clients.length === 0 ? <p className="ops-muted">No clients yet.</p> : null}
        <div className="ops-stack">
          {clients.map((c) => (
            <div className="ops-clientrow" key={c.id}>
              <div>
                <strong>{c.name}</strong>
                <p className="ops-muted">
                  {c.id} · {c.email} {c.phone ? `· ${c.phone}` : ""} · purchased {date(c.purchase_date)}
                </p>
                <p className="ops-muted">
                  {c.project_count} project{c.project_count === 1 ? "" : "s"}
                  {c.latest_project_status ? <> · latest <StatusPill status={c.latest_project_status} /></> : null}
                </p>
                {c.internal_notes ? <p className="ops-note">Internal: {c.internal_notes}</p> : null}
              </div>
              <div className="ops-actions">
                {c.latest_project_id ? <Link href={`/admin/projects/${c.latest_project_id}`} className="ops-btn">Open project</Link> : null}
                <button type="button" className="ops-btn" onClick={() => setEditing(editing === c.id ? "" : c.id)}>
                  {editing === c.id ? "Close" : "Edit"}
                </button>
                <button type="button" className="ops-btn ops-btn--danger" onClick={() => removeClient(c.id)}>
                  Delete data
                </button>
              </div>
              {editing === c.id ? (
                <ClientEditor client={c} onSaved={() => { setEditing(""); setNote("Client updated."); void load(); }} setError={setError} />
              ) : null}
            </div>
          ))}
        </div>
      </section>
    </OpsShell>
  );
}

function ClientEditor({ client, onSaved, setError }: { client: Record<string, any>; onSaved: () => void; setError: (v: string) => void }) {
  const [form, setForm] = useState({
    name: client.name ?? "",
    phone: client.phone ?? "",
    company: client.company ?? "",
    status: client.status ?? "active",
    internalNotes: client.internal_notes ?? "",
  });
  const [busy, setBusy] = useState(false);
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      await api.patch(`/api/admin/clients/${client.id}`, form);
      onSaved();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="ops-form-grid" onSubmit={save}>
      <label className="ops-field"><span>Name</span><input value={form.name} onChange={(e) => set("name", e.target.value)} /></label>
      <label className="ops-field"><span>Phone</span><input value={form.phone} onChange={(e) => set("phone", e.target.value)} /></label>
      <label className="ops-field"><span>Company</span><input value={form.company} onChange={(e) => set("company", e.target.value)} /></label>
      <label className="ops-field">
        <span>Status</span>
        <select value={form.status} onChange={(e) => set("status", e.target.value)}>
          {["invited", "onboarding", "active", "paused", "completed", "archived"].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </label>
      <label className="ops-field ops-field--wide"><span>Internal notes (never shown to the client)</span><textarea rows={2} value={form.internalNotes} onChange={(e) => set("internalNotes", e.target.value)} /></label>
      <div className="ops-actions ops-field--wide">
        <button className="ops-btn ops-btn--primary" type="submit" disabled={busy}>{busy ? "Saving…" : "Save changes"}</button>
      </div>
    </form>
  );
}
