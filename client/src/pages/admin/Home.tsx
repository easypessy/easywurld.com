import { useEffect, useState } from "react";
import { Link } from "wouter";
import { api, ApiError } from "@/lib/api";
import { OpsShell, Loading, useMe } from "@/components/ops/Shell";
import { date, ErrorNote, money, OkNote, relative, StatusPill } from "@/components/ops/helpers";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/clients", label: "Clients" },
  { href: "/admin/templates", label: "Templates" },
  { href: "/admin/automation", label: "Automation" },
];

interface Overview {
  counts: Record<string, number>;
  recentPurchases: Record<string, any>[];
  upcoming: Record<string, any>[];
  overdue: Record<string, any>[];
  pendingReview: Record<string, any>[];
  recentActivity: Record<string, any>[];
  failures: Record<string, any>[];
  integrations: Record<string, any>;
}

export default function AdminHome() {
  const { me, loading } = useMe("admin");
  const [data, setData] = useState<Overview | null>(null);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [pending, setPending] = useState<Record<string, any>[]>([]);
  const [showSale, setShowSale] = useState(false);

  async function load() {
    const [overview, intents] = await Promise.all([
      api.get<Overview>("/api/admin/overview"),
      api.get<{ orders: Record<string, any>[] }>("/api/admin/purchases/pending"),
    ]);
    setData(overview);
    setPending(intents.orders);
  }

  useEffect(() => {
    if (!me) return;
    load().catch((err) => setError(err instanceof ApiError ? err.message : "Could not load the dashboard."));
  }, [me]);

  if (loading || !me) return <Loading />;

  return (
    <OpsShell me={me} links={LINKS} title="Operations dashboard" variant="admin">
      <ErrorNote error={error} />
      <OkNote note={note} />

      {!data ? (
        <p className="ops-muted">Loading…</p>
      ) : (
        <>
          <section className="ops-grid ops-grid--stats">
            <Stat label="Active projects" value={data.counts.activeProjects} href="/admin/projects" />
            <Stat label="Awaiting client info" value={data.counts.awaitingClientInfo} tone={data.counts.awaitingClientInfo ? "warn" : undefined} />
            <Stat label="Pending approvals" value={data.counts.pendingApprovals} tone={data.counts.pendingApprovals ? "warn" : undefined} />
            <Stat label="Overdue" value={data.counts.overdue} tone={data.counts.overdue ? "bad" : undefined} />
            <Stat label="New purchases (30d)" value={data.counts.newPurchases30d} />
            <Stat label="Unconfirmed payments" value={data.counts.pendingIntents} tone={data.counts.pendingIntents ? "warn" : undefined} />
            <Stat label="Automation failures" value={data.counts.automationFailures} tone={data.counts.automationFailures ? "bad" : undefined} href="/admin/automation" />
            <Stat label="Clients" value={data.counts.clients} href="/admin/clients" />
          </section>

          <section className="ops-card">
            <div className="ops-card-head">
              <h2>Record a payment</h2>
              <button type="button" className="ops-btn" onClick={() => setShowSale((s) => !s)}>
                {showSale ? "Hide form" : "Record a sale"}
              </button>
            </div>
            <p className="ops-muted">
              Use this after you have personally confirmed a bank transfer or WhatsApp payment. The client, project, tasks, questionnaire and folders are created automatically — never from an unverified webhook.
            </p>
            {showSale ? <ManualSale setNote={setNote} setError={setError} onDone={load} /> : null}
          </section>

          {pending.length > 0 ? (
            <section className="ops-card">
              <h2>Unconfirmed checkout requests</h2>
              <p className="ops-muted">Someone started a checkout. Confirm the payment arrived, then open the workspace.</p>
              <div className="ops-stack">
                {pending.map((o) => (
                  <PendingIntent key={o.id} order={o} setError={setError} setNote={setNote} onDone={load} />
                ))}
              </div>
            </section>
          ) : null}

          <div className="ops-cols">
            <section className="ops-card">
              <h2>Deadlines</h2>
              {data.upcoming.length === 0 ? <p className="ops-muted">Nothing scheduled.</p> : null}
              <ul className="ops-list">
                {data.upcoming.map((p) => (
                  <li key={p.id}>
                    <Link href={`/admin/projects/${p.id}`}>{p.title}</Link>
                    <span className="ops-muted"> · {p.client_name} · {date(p.due_date)} ({relative(p.due_date)})</span>
                  </li>
                ))}
              </ul>
              {data.overdue.length > 0 ? (
                <>
                  <h3 className="ops-danger">Overdue</h3>
                  <ul className="ops-list">
                    {data.overdue.map((p) => (
                      <li key={p.id}>
                        <Link href={`/admin/projects/${p.id}`}>{p.title}</Link>
                        <span className="ops-muted"> · {p.client_name} · was due {date(p.due_date)}</span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
            </section>

            <section className="ops-card">
              <h2>Awaiting review</h2>
              {data.pendingReview.length === 0 ? <p className="ops-muted">No deliverables waiting on a client decision.</p> : null}
              <ul className="ops-list">
                {data.pendingReview.map((d) => (
                  <li key={d.id}>
                    <Link href={`/admin/projects/${d.project_id}`}>{d.title}</Link>
                    <span className="ops-muted"> · v{d.version} · {d.client_name} · sent {date(d.submitted_at)}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div className="ops-cols">
            <section className="ops-card">
              <h2>Recent purchases</h2>
              {data.recentPurchases.length === 0 ? <p className="ops-muted">No paid orders yet.</p> : null}
              <ul className="ops-list">
                {data.recentPurchases.map((o) => (
                  <li key={o.id}>
                    <strong>{o.buyer_name}</strong>
                    <span className="ops-muted"> · {money(o.amount_minor, o.currency)} · {o.provider} · {date(o.verified_at)}</span>
                    {o.project_id ? (
                      <Link href={`/admin/projects/${o.project_id}`} className="ops-inline-link"> open project</Link>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>

            <section className="ops-card">
              <h2>Recent activity</h2>
              <ul className="ops-list ops-list--feed">
                {data.recentActivity.map((a, i) => (
                  <li key={i}>
                    <strong>{a.kind}</strong> <span>· {String(a.detail).slice(0, 90)}</span>
                    <span className="ops-muted"> {date(a.created_at, true)}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {data.failures.length > 0 ? (
            <section className="ops-card ops-card--attention">
              <h2>Automation problems</h2>
              <ul className="ops-list">
                {data.failures.map((f) => (
                  <li key={f.id}>
                    <strong>{f.event}</strong> <span className="ops-muted">· {f.error}</span>
                    <span className="ops-muted"> {date(f.created_at, true)}</span>
                  </li>
                ))}
              </ul>
              <Link href="/admin/automation" className="ops-btn">Open automation log</Link>
            </section>
          ) : null}

          <section className="ops-card">
            <h2>Connections</h2>
            <div className="ops-integrations">
              {Object.entries(data.integrations).map(([key, value]: [string, any]) => (
                <div key={key} className="ops-integration" data-ok={Boolean(value.configured ?? value)}>
                  <strong>{key}</strong>
                  <small>
                    {typeof value === "object" ? (value.configured ?? value) ? "connected" : "not configured" : value ? "connected" : "not configured"}
                  </small>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </OpsShell>
  );
}

function Stat({ label, value, tone, href }: { label: string; value: number | string; tone?: "warn" | "bad"; href?: string }) {
  const inner = (
    <>
      <span>{label}</span>
      <strong>{value ?? 0}</strong>
    </>
  );
  return href ? (
    <Link href={href} className={`ops-stat ${tone ? `ops-stat--${tone}` : ""}`}>{inner}</Link>
  ) : (
    <div className={`ops-stat ${tone ? `ops-stat--${tone}` : ""}`}>{inner}</div>
  );
}

function PendingIntent({ order, onDone, setError, setNote }: { order: Record<string, any>; onDone: () => void; setError: (v: string) => void; setNote: (v: string) => void }) {
  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState(false);

  async function verify() {
    setBusy(true);
    setError("");
    try {
      const res = await api.post<{ projectId?: string }>(`/api/admin/purchases/${order.id}/verify`, {
        amountMinor: amount ? Math.round(Number(amount) * 100) : undefined,
      });
      setNote(`Payment confirmed. Project ${res.projectId} created and client invited.`);
      onDone();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not confirm that payment.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="ops-approval">
      <div>
        <strong>{order.buyer_name || order.buyer_email}</strong>
        <p className="ops-muted">
          {order.buyer_email} · {order.service_name || order.offer_slug || order.service_key || "service"} · requested {date(order.created_at)}
        </p>
      </div>
      <div className="ops-actions">
        <input className="ops-input-inline" placeholder="Amount received (₦)" value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal" />
        <button type="button" className="ops-btn ops-btn--primary" onClick={verify} disabled={busy}>
          {busy ? "Creating…" : "Confirm & create workspace"}
        </button>
      </div>
    </div>
  );
}

function ManualSale({ onDone, setError, setNote }: { onDone: () => void; setError: (v: string) => void; setNote: (v: string) => void }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", serviceKey: "website-design", serviceName: "", amount: "", reference: "", note: "" });
  const [busy, setBusy] = useState(false);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await api.post<{ projectId?: string; outcome: string }>("/api/admin/purchases/manual", {
        name: form.name,
        email: form.email,
        phone: form.phone,
        serviceKey: form.serviceKey,
        serviceName: form.serviceName || undefined,
        amount: Number(form.amount),
        reference: form.reference,
        note: form.note,
      });
      setNote(res.outcome === "duplicate" ? "That reference was already recorded — no duplicate was created." : `Workspace created: ${res.projectId}`);
      setForm({ name: "", email: "", phone: "", serviceKey: "website-design", serviceName: "", amount: "", reference: "", note: "" });
      onDone();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not record that sale.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="ops-form-grid">
      <label className="ops-field"><span>Client name</span><input value={form.name} onChange={(e) => set("name", e.target.value)} required /></label>
      <label className="ops-field"><span>Email</span><input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} required /></label>
      <label className="ops-field"><span>Phone</span><input value={form.phone} onChange={(e) => set("phone", e.target.value)} /></label>
      <label className="ops-field">
        <span>Service</span>
        <select value={form.serviceKey} onChange={(e) => set("serviceKey", e.target.value)}>
          <option value="website-design">Website design</option>
          <option value="landing-page">Landing page</option>
          <option value="social-media">Social media management</option>
          <option value="copywriting">Copywriting</option>
          <option value="ai-automation">AI business automation</option>
          <option value="reports-presentations">Reports & presentations</option>
          <option value="digital-marketing">Digital marketing strategy</option>
          <option value="standalone-offer">Standalone offer</option>
        </select>
      </label>
      <label className="ops-field"><span>Project title (optional)</span><input value={form.serviceName} onChange={(e) => set("serviceName", e.target.value)} placeholder="e.g. Bella Rosa — website" /></label>
      <label className="ops-field"><span>Amount received (₦)</span><input inputMode="decimal" value={form.amount} onChange={(e) => set("amount", e.target.value)} required /></label>
      <label className="ops-field"><span>Payment reference</span><input value={form.reference} onChange={(e) => set("reference", e.target.value)} required placeholder="GTB transfer / Paystack ref" /></label>
      <label className="ops-field ops-field--wide"><span>Internal note</span><input value={form.note} onChange={(e) => set("note", e.target.value)} /></label>
      <div className="ops-actions ops-field--wide">
        <button className="ops-btn ops-btn--primary" type="submit" disabled={busy}>{busy ? "Creating workspace…" : "Record sale & onboard client"}</button>
      </div>
    </form>
  );
}
