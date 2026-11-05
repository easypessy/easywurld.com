# 03 — Testing report

_Executed 4 November 2026 · Node v22.22.3 · SQLite via `node:sqlite` · temp DB per run_

The suite drives the **real HTTP server** (no mocks of our own code) against the
real SQLite schema, the real storage layer and the real signature algorithms.
Each run creates a throwaway database under `data/test-runs/`, so it never
touches live data.

```
$ npm test
# tests 33
# suites 0
# pass 33
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 1649.190938
```

```
$ npm run check      # tsc --noEmit
(no output — clean)

$ npm run build
✓ built in 3.22s
```

## What each test proves

| # | Test | Requirement covered |
|---|---|---|
| 1 | rejects a webhook with an invalid signature and creates nothing | No activation on an unverified notification |
| 2 | a verified purchase creates client, project, tasks, questionnaire and workspace | Purchase → onboarding pipeline |
| 3 | a duplicate payment notification does not create a second client or project | Dedupe |
| 4 | a duplicate notification is also safe when sent five times concurrently | Race-safe dedupe |
| 5 | a failed payment never creates a client or project | Failed-payment handling |
| 6 | an underpayment is rejected before activation | Amount validation |
| 7 | a payment without a usable email is rejected and logged | Missing information |
| 8 | a client activates their account and sees only their own workspace | Activation + scoping |
| 9 | a client cannot read another client's project | Cross-client isolation |
| 10 | a client cannot reach any admin endpoint | RBAC |
| 11 | admin endpoints refuse anonymous requests | Auth required |
| 12 | client cannot see internal tasks or internal notes | Admin-only data |
| 13 | questionnaire validation blocks incomplete submissions, accepts complete ones | Onboarding quality |
| 14 | file upload rejects disallowed types and accepts a valid PDF | Upload allowlist |
| 15 | clients cannot see or download internal working files | Visibility |
| 16 | a client upload lands in their materials folder and is visible to them | Upload → folder (02) |
| 17 | a client cannot download another client's client-visible file | File-level authz |
| 18 | admin submits a deliverable, client approves it, project moves to delivered | Review → approval → delivery |
| 19 | a revision request is recorded, counted, and resubmission creates a new version | Revision workflow |
| 20 | approving an already decided deliverable is refused | Idempotent decisions |
| 21 | admin dashboard returns live numbers | Dashboard accuracy |
| 22 | admin can create a task, complete a milestone and change status | Admin control |
| 23 | admin can record a manual bank-transfer sale which onboards a brand new client | Manual sale path |
| 24 | admin can retry workspace provisioning and archive a project | Recovery + archive |
| 25 | templates are editable and the change reaches new projects | Reusable templates |
| 26 | automation log, outbox and audit trail are readable by admin only | Audit privacy |
| 27 | logout revokes the session cookie immediately | Session revocation |
| 28 | cross-site mutations are blocked by the CSRF guard | CSRF |
| 29 | login is throttled after repeated failures | Brute force |
| 30 | admin can permanently delete a client's personal data on request | Data deletion |
| 31 | unknown API routes return JSON 404, not the SPA | API hygiene |
| 32 | expired or unknown activation tokens are refused | Expired auth |
| 33 | payment reference idempotency survives a crash between order and project | Crash recovery |

## The end-to-end walkthrough, run by hand

```
purchase webhook ─▶ EW-O-0001 (order, paid)
                └▶ EW-C-0001 client + user invite
                   EW-P-0001 project (website_design template)
                   └▶ tasks 8 · milestones 5 · questionnaire 10 questions
                   06-folder workspace · welcome email queued
                   Notion rows (client, project, tasks, delivery, log)
```

Observed in the live demo database after seeding:

- Client `EW-C-0001` logs in and sees **only** their project; `EW-P-0002`
  (another client) returns 403.
- Portal shows 4 client-visible tasks out of 8 — the internal ones are filtered
  server-side, not hidden in CSS.
- Deliverable `EW-D-0001` sits in `awaiting_client_approval`; the client can
  approve or request a revision, and the revision counter increments once per
  request (never per page view).
- Admin dashboard counts, outbox and automation log all reconcile with the
  database.
- Client silence is never treated as approval: nothing moves to `delivered`
  without an explicit decision from the client's own session.

## Frontend verification

- `npm run build` produces the SPA with ops routes split into their own chunks
  (`Login`, `Home`, `Project`, admin screens); the marketing site's bundle is
  unchanged in weight.
- Routes `/login`, `/portal`, `/portal/projects/:id`, `/admin`,
  `/admin/projects`, `/admin/projects/:id`, `/admin/clients`,
  `/admin/templates`, `/admin/automation` all return 200 and render inside the
  ops shell (no marketing header/footer).
- Client portal is mobile-first: 44 px minimum touch targets, horizontally
  scrollable tab bar, single-column cards below 760 px, tables that scroll
  rather than overflow, and a hamburger nav on phones.
- Both login flows were exercised through the Vite proxy exactly as a browser
  would (`POST /api/auth/login` on the app origin), confirming same-origin
  cookies work in the preview environment.

## What is *not* covered (honest gaps)

| Gap | Why | Mitigation |
|---|---|---|
| Live Paystack/Flutterwave/Stripe round-trip | No merchant credentials in this environment | Signature maths is exercised with the real algorithms; add a test-mode purchase the day credentials exist |
| Google Drive / Dropbox writes | App-level tokens not set (connector ≠ app credential) | Idempotent retry button + local fallback; folders verified as created manually |
| Notion writes | Same | Schema verified by hand; one demo client/project/task/delivery written through the API to confirm relations |
| SMTP delivery | No mailbox configured | Emails queue in the outbox and are asserted as `logged`/`skipped` |
| Load / concurrency beyond 5 parallel webhooks | Out of scope for a single-instance SQLite deployment | WAL mode + unique constraints; revisit if volume exceeds ~50 purchases/day |
| Real-device mobile matrix | Sandbox has no browser farm | Layout verified by CSS breakpoints and manual resize; test on your own phone after deploy |
| Accessibility audit (screen reader) | Not automated here | Semantic landmarks, labels on every field, focus-visible outlines, `prefers-reduced-motion` respected |

## Reproducing

```bash
npm install --legacy-peer-deps
npm test                 # 33 tests, throwaway DB
npm run check            # types
npm run build            # client + server types
npm run ops:seed         # demo data (demo credentials printed)
npm run dev:full         # http://localhost:3000
```
