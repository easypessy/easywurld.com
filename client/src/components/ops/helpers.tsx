import { PROJECT_STATUS_LABELS, CLIENT_STATUS_LABELS, type ProjectStatus, type ClientStatus } from "@shared/ops";

export function statusLabel(status: string): string {
  return PROJECT_STATUS_LABELS[status as ProjectStatus] ?? CLIENT_STATUS_LABELS[status as ClientStatus] ?? status.replace(/_/g, " ");
}

const TONE: Record<string, string> = {
  awaiting_onboarding: "info",
  awaiting_client_materials: "warn",
  ready_to_start: "info",
  in_progress: "active",
  internal_review: "active",
  awaiting_client_approval: "warn",
  revision_requested: "warn",
  delivered: "good",
  completed: "good",
  archived: "muted",
};

export function StatusPill({ status }: { status: string }) {
  return (
    <span className={`ops-pill ops-pill--${TONE[status] ?? "muted"}`}>
      <span aria-hidden="true" />
      {statusLabel(status)}
    </span>
  );
}

export function date(value: string | null | undefined, withTime = false): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
}

export function relative(value: string | null | undefined): string {
  if (!value) return "—";
  const diff = new Date(value).getTime() - Date.now();
  const days = Math.round(diff / 86400000);
  if (Number.isNaN(days)) return "—";
  if (days === 0) return "today";
  if (days > 0) return `in ${days} day${days === 1 ? "" : "s"}`;
  return `${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"} ago`;
}

export function money(amountMinor: number | string | null | undefined, currency = "NGN"): string {
  const value = Number(amountMinor ?? 0) / 100;
  try {
    return new Intl.NumberFormat("en-NG", { style: "currency", currency, maximumFractionDigits: 0 }).format(value);
  } catch {
    return `${currency} ${value.toFixed(2)}`;
  }
}

export function bytes(size: number | null | undefined): string {
  const n = Number(size ?? 0);
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

export function Progress({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div className="ops-progress" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
      <span style={{ width: `${pct}%` }} />
    </div>
  );
}

export function ErrorNote({ error }: { error: string }) {
  if (!error) return null;
  return (
    <p className="ops-alert ops-alert--error" role="alert">
      {error}
    </p>
  );
}

export function OkNote({ note }: { note: string }) {
  if (!note) return null;
  return <p className="ops-alert ops-alert--ok">{note}</p>;
}
