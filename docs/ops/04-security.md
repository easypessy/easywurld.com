# 04 — Security, permissions and reliability

Threat model in one line: **a paying client's files and another client's files
must never touch**, and no one may become a client by lying to a webhook.

## 1. Accounts and sessions

| Control | Implementation |
|---|---|
| Password storage | `scrypt` (N=16384, r=8, p=1) with a 16-byte per-user salt, stored as `scrypt$<salt>$<hash>`. No plaintext, no reversible hashes. |
| Session token | 32 random bytes, sent as an **HttpOnly, SameSite=Lax, Secure-in-production** cookie. Only the SHA-256 of the token is stored, so a database leak cannot be replayed as a login. |
| Expiry | 30 days (`SESSION_DAYS`), revoked immediately on logout by deleting the row — tested. |
| CSRF | Same-origin check on every mutating request plus SameSite=Lax; cross-site form posts are rejected (test 28). |
| Brute force | Login throttled per email+IP after repeated failures (test 29). |
| Invites | Single-use activation tokens, expiring, hashed at rest; expired/unknown tokens refused (test 32). |
| Password reset | Same one-time-token pattern, same expiry rules, no user enumeration (identical response either way). |
| Roles | `admin` and `client` only. Route groups attach the guard before any handler, so a new endpoint is protected by default (tests 10, 11). |

## 2. Who can see what

| Data | Client | Admin |
|---|---|---|
| Their own project, files, messages | Yes | Yes |
| Another client's anything | **No** — 403, decided from the session, never from a URL parameter | Yes |
| Internal tasks, internal notes | **No** — filtered in SQL, not hidden in the browser (test 12) | Yes |
| Files marked `internal` | **No**, even with a guessed file ID (tests 15, 17) | Yes |
| Credentials, provider secrets, Notion token | Never in any response | Only server-side |
| Audit trail, automation log, outbox | No | Yes (test 26) |

Every client query is scoped by `client_id` taken from the session. There is no
endpoint that accepts a client ID from the client.

## 3. Payments — no activation on an unverified notification

- Signature verified **before** parsing a single field: Paystack HMAC-SHA512,
  Flutterwave `verif-hash`, Stripe `t`+`v1` with a 5-minute tolerance, generic
  shared secret. A bad signature is a 401 and nothing is written (test 1).
- Dedupe by `UNIQUE (provider, provider_reference)` **plus** an order-level
  idempotency key, so five concurrent copies create one client (tests 3, 4), and
  a crash between order and project resumes cleanly (test 33).
- Failed, cancelled, abandoned, underpaid and unparseable notifications never
  create a client; they are recorded in `automation_events` and shown to the
  admin (tests 5, 6, 7).
- The manual-sale path is admin-only, audited, and asks for a confirmation.

## 4. Files

- Allowlist by extension **and** declared MIME type; size capped at 25 MB
  (`MAX_UPLOAD_MB`); filenames are re-generated (`<timestamp>-<random><ext>`), so
  a malicious name cannot escape its directory. Stored under the project's own
  folder (`localProjectDir`).
- SHA-256 checksum recorded for every upload.
- Downloads stream through `/api/files/:id/download` after an ownership and
  visibility check — no public URLs, no directory listing.
- Deletion is scoped to the project folder; nothing outside it can be touched
  (`path.resolve` containment check).

## 5. Secrets and configuration

- All secrets live in `.env` (git-ignored) or `/etc/easywurld.env` (mode 640,
  `root:easywurld`). `.env.example` ships with empty values.
- Nothing secret reaches the browser: the client bundle contains no keys, and
  the admin UI shows integration *status*, never values.
- The repository holds no credentials and no client data; `data/` is ignored.
- Rotating any secret is a file edit plus `systemctl restart` — no redeploy.

## 6. Web headers and hardening

- Helmet-style headers set in `server/app.ts`, including CSP, `X-Content-Type-Options`,
  `Referrer-Policy`, and HSTS at the proxy (`deploy/Caddyfile`).
- `express.json` body limit; unknown API routes return JSON 404 rather than the
  SPA (test 31), so an endpoint typo never leaks HTML into a fetch handler.
- systemd unit runs as the unprivileged `easywurld` user with
  `ProtectSystem=strict`, `ProtectHome=true`, `NoNewPrivileges=true`, and write
  access only to `/var/lib/easywurld`.
- HTTPS enforced by Caddy, which obtains and renews certificates automatically.

## 7. Privacy / data handling

- Only what is needed is stored: name, email, phone, company, answers, files.
- Clients can request deletion; `DELETE /api/admin/clients/:id` (confirm = client
  ID) removes personal data, uploads and sessions, keeps financial audit rows in
  anonymised form, and writes an audit entry (test 30).
- Emails sent by the app contain portal links, never credentials.
- The Notion mirror holds names, emails, statuses and links — no passwords, no
  file contents.

## 8. Reliability

| Failure | Behaviour |
|---|---|
| SMTP down | Message stays `queued`, retried with backoff, visible in Outbox; purchase still completes |
| Drive/Dropbox not configured | Files stay local — no error shown to the client |
| Notion API error | Logged once as `skipped`/`failed` with the reason; retry from the Automation screen after fixing |
| App killed mid-purchase | Order and project creation are separate, idempotent steps; resume completes without duplicating |
| Bad deploy | `install.sh` is idempotent and keeps data outside the repo; rollback = checkout previous commit + restart |
| Database corruption | Nightly backup via `easywurld-backup.timer`; restore drill documented in `05` §3 |

## 9. Known limitations (stated plainly)

1. **Single instance.** One Node process, one SQLite file. That is a deliberate
   trade for simplicity and cost; it comfortably serves this agency's volume and
   is the reason there is no database bill. Horizontal scaling would mean
   Postgres and object storage.
2. **No 2FA yet.** Strong password + throttle + short-lived invites today. TOTP
   is a small, well-scoped addition if you want it.
3. **No external penetration test.** The controls above are tested by the suite
   (authz, CSRF, signature verification, path handling), not by a third party.
4. **Demo credentials exist only in development seeds**, and the seed script
   refuses to run when `NODE_ENV=production`.
5. **Provider dashboards are outside our control** — enable 2FA on Paystack,
   Notion and your hosting account; that is the single highest-value thing you
   can do for security this week.
