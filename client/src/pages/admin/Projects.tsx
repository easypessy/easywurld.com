import { useEffect, useState } from "react";
import { Link } from "wouter";
import { api, ApiError } from "@/lib/api";
import { OpsShell, Loading, useMe } from "@/components/ops/Shell";
import { date, ErrorNote, Progress, StatusPill } from "@/components/ops/helpers";
import { PROJECT_STATUS_LABELS } from "@shared/ops";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/clients", label: "Clients" },
  { href: "/admin/templates", label: "Templates" },
  { href: "/admin/automation", label: "Automation" },
];

export default function AdminProjects() {
  const { me, loading } = useMe("admin");
  const [projects, setProjects] = useState<Record<string, any>[]>([]);
  const [status, setStatus] = useState("");
  const [q, setQ] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (q) params.set("q", q);
    const timer = setTimeout(() => {
      api
        .get<{ projects: Record<string, any>[] }>(`/api/admin/projects?${params.toString()}`)
        .then((res) => setProjects(res.projects))
        .catch((err) => setError(err instanceof ApiError ? err.message : "Could not load projects."));
    }, q ? 250 : 0);
    return () => clearTimeout(timer);
  }, [status, q]);

  if (loading || !me) return <Loading />;

  return (
    <OpsShell me={me} links={LINKS} title="Projects" variant="admin">
      <ErrorNote error={error} />
      <div className="ops-filters">
        <label className="ops-field">
          <span>Search</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Client, project or ID" />
        </label>
        <label className="ops-field">
          <span>Status</span>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All statuses</option>
            {Object.entries(PROJECT_STATUS_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </label>
      </div>

      <section className="ops-card">
        {projects.length === 0 ? <p className="ops-muted">No projects match.</p> : null}
        <div className="ops-tablewrap">
          <table className="ops-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Client</th>
                <th>Status</th>
                <th>Due</th>
                <th>Open tasks</th>
                <th>Progress</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id}>
                  <td>
                    <Link href={`/admin/projects/${p.id}`}>{p.title}</Link>
                    <div className="ops-muted">{p.id}</div>
                  </td>
                  <td>
                    {p.client_name}
                    <div className="ops-muted">{p.client_email}</div>
                  </td>
                  <td><StatusPill status={p.status} /></td>
                  <td>{date(p.due_date)}</td>
                  <td>{p.open_tasks}</td>
                  <td style={{ minWidth: 120 }}><Progress value={p.progress} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </OpsShell>
  );
}
