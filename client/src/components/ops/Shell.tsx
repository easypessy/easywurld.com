import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { api, type Me } from "@/lib/api";

/**
 * Shared shell for the portal and admin dashboard. It also acts as the session
 * guard: if `/api/auth/me` returns no user, the visitor is sent to /login. The
 * server enforces this independently — this is only the polite redirect.
 */

export function useMe(requiredRole?: "admin" | "client") {
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    let alive = true;
    api
      .get<Me>("/api/auth/me")
      .then((res) => {
        if (!alive) return;
        if (!res.user) {
          setRedirecting(true);
          window.location.href = "/login";
          return;
        }
        if (requiredRole && res.user.role !== requiredRole) {
          setRedirecting(true);
          window.location.href = res.redirect || "/portal";
          return;
        }
        setMe(res);
      })
      .catch(() => {
        setRedirecting(true);
        window.location.href = "/login";
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [requiredRole]);

  return { me, loading, redirecting };
}

async function signOut() {
  try {
    await api.post("/api/auth/logout");
  } catch {
    /* ignore */
  }
  window.location.href = "/login";
}

export interface ShellLink {
  href: string;
  label: string;
}

export function OpsShell({
  me,
  links,
  title,
  children,
  variant = "client",
}: {
  me: Me | null;
  links: ShellLink[];
  title: string;
  children: React.ReactNode;
  variant?: "client" | "admin";
}) {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className={`ops ops--${variant}`}>
      <header className="ops-hdr">
        <div className="ops-hdr-in">
          <Link href={variant === "admin" ? "/admin" : "/portal"} className="ops-brand">
            <picture>
              <source srcSet="/brand/mark-256.webp" type="image/webp" />
              <img src="/brand/mark.png" alt="" width={36} height={36} />
            </picture>
            <span>
              EASYWURLD
              <small>{variant === "admin" ? "OPERATIONS" : "CLIENT WORKSPACE"}</small>
            </span>
          </Link>

          <nav className="ops-nav" data-open={open} aria-label="Workspace">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={location === link.href || (link.href !== "/admin" && link.href !== "/portal" && location.startsWith(link.href)) ? "on" : ""}
              >
                {link.label}
              </Link>
            ))}
            <button type="button" className="ops-nav-out" onClick={signOut}>
              Sign out
            </button>
          </nav>

          <div className="ops-who">
            <span>{me?.user?.name ?? ""}</span>
            <small>{me?.user?.role === "admin" ? "Administrator" : "Client"}</small>
          </div>

          <button className="ops-burger" type="button" aria-expanded={open} aria-label="Toggle menu" onClick={() => setOpen((o) => !o)}>
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <main className="ops-main">
        <div className="ops-wrap">
          <div className="ops-pagehead">
            <h1>{title}</h1>
          </div>
          {children}
        </div>
      </main>

      <footer className="ops-ftr">
        <div className="ops-wrap ops-ftr-in">
          <span>Easywurld client operations · Simplify. Optimize. Grow.</span>
          <a href="https://wa.me/2349050690837" target="_blank" rel="noopener noreferrer">
            WhatsApp the team
          </a>
        </div>
      </footer>
    </div>
  );
}

export function Loading() {
  return (
    <div className="ops ops-loading">
      <p>Loading your workspace…</p>
    </div>
  );
}
