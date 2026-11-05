# Easywurld Client Operations System — Audit & Architecture

Status: Stage 1 (audit) and Stage 2 (architecture) complete. Build in progress.
Date: 2026-11-04

---

## 1. Audit of the existing Easywurld environment

| Area | What exists today | Verdict |
| --- | --- | --- |
| Frontend | Vite 7 + React 19 SPA (`client/`), Wouter routing, hand-written design system in `client/src/index.css` (Fraunces/Inter, cream/green palette), ~45 unused Radix components in `client/src/components/ui` | Reuse. The ops UI is built with the same tokens and primitives. |
| Content | Static data modules for 7 service categories, 60+ case studies, 9 numbered ₦5,000 offers (`client/src/data/*`) | Reuse as the **service catalogue** that drives templates and order matching. |
| Backend | `server/index.ts` — a 30-line Express static file server with no build step and no API routes | Does not exist in practice. Vercel/Netlify deploy `dist/public` only. |
| Database | None | Built from scratch. |
| Authentication | None (no users, no sessions, no roles) | Built from scratch. (`shared/const.ts` defines an unused cookie name — evidence an auth layer was once scaffolded.) |
| Payments | No checkout, no webhook. Offers are sold by WhatsApp/bank transfer (`wa.me/2349050690837`) | Purchase detection must accept **manual/bank-transfer verification** as well as provider webhooks. |
| Storage | No file storage. Public folder holds brand assets and demo builds | Built from scratch, with Google Drive / Dropbox adapters. |
| Notion | Connected workspace exists (personal pages, a content-planner DB). No client/project/task/delivery/automation structure | Created in Stage 5. |
| Google Drive | Connected. Existing folders for playbooks, offer library, content library | Client folder root provisioned in Stage 5; per-project folders by the app. |
| Dropbox | Connected | Used as secondary media storage adapter. |
| GitHub | Repo `easypessy/easywurld.com`, Vercel/Netlify deploy config | Source of truth for this build only. No client access. |
| Hosting | Vercel + Netlify configs present (static) | Ops backend needs a Node host with a persistent disk (see `docs/ops/05-costs-and-manual-tasks.md`). |

**Bottom line:** the marketing site is healthy and must not be rebuilt. The entire operations
layer — identity, data, workflows, storage, integrations, notifications — has to be created.

---

## 2. What the system is built on

Single Node service (Express) that serves both the API and the built SPA. One process, one
deployment, no microservices, no paid platform.

| Layer | Choice | Why |
| --- | --- | --- |
| Runtime | Node 22 (already required by Vite 7) | Zero extra infrastructure. |
| HTTP | Express 4 (already a dependency) | Already in `package.json`. |
| Database | SQLite via the built-in `node:sqlite` module | **Zero native dependencies**, zero monthly cost, single file, transactional, easy to back up. |
| Auth | First-party sessions: scrypt password hashing (`node:crypto`), opaque session tokens stored as SHA-256 hashes, HttpOnly + SameSite=Lax cookies | No third-party identity provider, no secrets in the browser. |
| RBAC | Two roles (`admin`, `client`) enforced server-side on every route, plus per-record ownership checks | Client isolation is a query-level rule, not a UI rule. |
| Files | Local disk under `data/storage/`, with Google Drive and Dropbox adapters behind one interface | Works immediately; upgrades to Drive without code changes. |
| Notifications | DB-backed outbox → SMTP (nodemailer) and WhatsApp Cloud API adapters | Nothing is lost if a provider is down; every send is retried and audited. |
| Integrations | Notion, Google Drive, Dropbox adapters, all activated by env vars | Absent credentials degrade to a logged "not configured" state rather than a crash. |
| Frontend | Existing React + Wouter app, new `/portal` and `/admin` route trees with their own layout | Keeps marketing site untouched. |

### Data model (14 tables)

`users` · `sessions` · `clients` · `orders` · `projects` · `project_status_history` ·
`tasks` · `milestones` · `questionnaires` · `questionnaire_answers` · `deliverables` ·
`reviews` · `files` · `messages` · `notifications` · `automation_events` · `audit_log` ·
`service_templates` · `settings`

Identity conventions: `EW-C-0001` (client), `EW-P-0001` (project), `EW-O-0001` (order),
`EW-F-0001` (file), `EW-D-0001` (deliverable).

### The purchase-to-delivery pipeline

```
provider webhook ─┐
admin sale log ───┼──▶ orders (idempotent on provider+reference)
public intent ────┘        │  verified only
                           ▼
        onboardPurchase()  (single SQLite transaction)
        ├─ client (dedupe by email)
        ├─ project from service template (status: awaiting_onboarding)
        ├─ milestones + tasks + deadlines  (from template)
        ├─ onboarding questionnaire (service-specific fields)
        ├─ client invite + activation token
        ├─ welcome notification + admin notification
        └─ automation events
                           ▼
        post-commit side effects (never blocks the transaction)
        ├─ workspace folders: 01 Onboarding … 06 Archive (local + Drive/Dropbox)
        ├─ Drive folder share with the client (when enabled)
        └─ Notion sync rows
                           ▼
   client portal: onboarding → materials → production → review → approval → delivery → archive
```

Failure rule: if a webhook signature is invalid, the money is not captured, or the amount does
not match the catalogue, **no client or project is created**. The event is recorded as
`rejected` in `automation_events` and surfaced on the admin dashboard.

### Trust boundaries

- The browser never sees a token, key, internal note or another client's row.
- Clients reach data only through `/api/portal/*`, where every handler derives the client id
  from the session — never from a request parameter.
- Admin-only routes live under `/api/admin/*` behind `requireRole("admin")`.
- Webhook routes are unauthenticated by design but require a valid signature over the raw body.

---

## 3. Planned stages and current status

| Stage | Scope | Status |
| --- | --- | --- |
| 1 | Audit | Done — this document |
| 2 | Architecture | Done — this document |
| 3 | Database + project structure | In build |
| 4 | Auth, admin dashboard, client portal | In build |
| 5 | Notion, Drive, Dropbox | In build |
| 6 | Purchase detection + onboarding automation | In build |
| 7 | Service-specific templates | In build |
| 8 | Approvals, revisions, delivery | In build |
| 9 | Notifications + automation log | In build |
| 10 | Security and end-to-end testing | In build — see `03-testing-report.md` |
