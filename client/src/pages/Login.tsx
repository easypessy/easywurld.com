import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { api, ApiError } from "@/lib/api";

/**
 * One sign-in page for clients and administrators. Query parameters drive the
 * three flows:
 *   /login?activate=<token>  → set a password for the first time
 *   /login?reset=<token>     → set a new password
 *   /login                   → sign in (with reset request)
 */

type Stage = "login" | "activate" | "reset" | "request-reset";

export default function Login() {
  const [location] = useLocation();
  const params = useMemo(() => new URLSearchParams(window.location.search), [location]);
  const activateToken = params.get("activate");
  const resetToken = params.get("reset");

  const [stage, setStage] = useState<Stage>(activateToken ? "activate" : resetToken ? "reset" : "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [inviteFor, setInviteFor] = useState<string>("");

  useEffect(() => {
    if (stage !== "activate" || !activateToken) return;
    api
      .get<{ email: string; name: string }>(`/api/auth/activation/${encodeURIComponent(activateToken)}`)
      .then((res) => {
        setInviteFor(res.email);
        setEmail(res.email);
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : "This invite link is not valid."));
  }, [stage, activateToken]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setNotice("");
    setBusy(true);
    try {
      if (stage === "login") {
        const res = await api.post<{ redirect: string }>("/api/auth/login", { email, password });
        window.location.href = res.redirect || "/portal";
      } else if (stage === "request-reset") {
        const res = await api.post<{ message: string }>("/api/auth/password-reset/request", { email });
        setNotice(res.message);
        setStage("login");
      } else {
        if (password !== confirm) throw new Error("The two passwords do not match.");
        if (stage === "activate") {
          const res = await api.post<{ redirect: string }>("/api/auth/activate", { token: activateToken, password });
          window.location.href = res.redirect || "/portal";
        } else {
          await api.post("/api/auth/password-reset/confirm", { token: resetToken, password });
          setNotice("Password updated. Sign in with your new password.");
          setStage("login");
        }
      }
    } catch (err) {
      setError(err instanceof ApiError || err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  const title =
    stage === "activate" ? "Set your password" : stage === "reset" ? "Choose a new password" : stage === "request-reset" ? "Reset your password" : "Sign in to your workspace";

  return (
    <div className="ops-auth">
      <div className="ops-auth-card">
        <Link href="/" className="ops-auth-brand" aria-label="Easywurld home">
          <picture>
            <source srcSet="/brand/mark-256.webp" type="image/webp" />
            <img src="/brand/mark.png" alt="" width={42} height={42} />
          </picture>
          <span>
            EASYWURLD
            <small>SIMPLIFY. OPTIMIZE. GROW.</small>
          </span>
        </Link>

        <h1>{title}</h1>
        {stage === "activate" && inviteFor ? (
          <p className="ops-muted">Welcome, {inviteFor}. Choose a password with at least 10 characters.</p>
        ) : stage === "login" ? (
          <p className="ops-muted">Clients and the Easywurld team sign in here. Your workspace is private to you.</p>
        ) : null}

        <form onSubmit={submit} noValidate>
          {stage === "login" || stage === "request-reset" ? (
            <label className="ops-field">
              <span>Email</span>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
              />
            </label>
          ) : null}

          {stage !== "request-reset" ? (
            <label className="ops-field">
              <span>{stage === "login" ? "Password" : "New password"}</span>
              <input
                type="password"
                autoComplete={stage === "login" ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={stage === "login" ? undefined : 10}
              />
            </label>
          ) : null}

          {stage === "activate" || stage === "reset" ? (
            <label className="ops-field">
              <span>Confirm password</span>
              <input type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
            </label>
          ) : null}

          {error ? <p className="ops-alert ops-alert--error" role="alert">{error}</p> : null}
          {notice ? <p className="ops-alert ops-alert--ok">{notice}</p> : null}

          <button className="ops-btn ops-btn--primary" type="submit" disabled={busy}>
            {busy ? "Working…" : stage === "login" ? "Sign in" : stage === "request-reset" ? "Send reset link" : "Save password"}
          </button>
        </form>

        <div className="ops-auth-links">
          {stage === "login" ? (
            <button type="button" className="ops-linkbtn" onClick={() => setStage("request-reset")}>
              Forgot your password?
            </button>
          ) : (
            <button type="button" className="ops-linkbtn" onClick={() => setStage("login")}>
              Back to sign in
            </button>
          )}
          <Link href="/" className="ops-linkbtn">← Back to easywurld.com</Link>
        </div>

        <p className="ops-fine">
          Never share your password. Easywurld staff will never ask for it. Access is logged.
        </p>
      </div>
    </div>
  );
}
