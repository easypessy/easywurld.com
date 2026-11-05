# 02 — Integrations, permissions and exact configuration

_Last verified: 4 November 2026 against the running system._

Everything in this document describes **what is connected today**, not what
could be connected. Where a credential is missing the system degrades in a
defined way rather than failing a purchase.

| Integration | Status right now | What happens without it |
|---|---|---|
| SQLite database (`node:sqlite`) | **Working**, zero setup | — (required) |
| Local file storage | **Working** — `data/storage/EASYWURLD CLIENTS/…` | — |
| Google Drive | Folder created (`1SABmO4DlvOxn_X2nz-iZ4DskqUqhue0k`) but **off by default — the Drive is full, so storage runs on the server disk** | Uploads/folders stay local; nothing is lost |
| Notion | **Workspace built and populated** (5 linked databases); app needs its own token | Sync skipped, logged once as `skipped`, never spams the log |
| Dropbox | Access token not set (optional by design) | Supplementary media store unused |
| Paystack / Flutterwave / Stripe | Not configured — no provider credentials in this environment | Purchase webhooks are rejected with 401; no client is created |
| Generic webhook (`WEBHOOK_SECRET`) | Not set — endpoint refuses all calls | — |
| SMTP email | Not set | Emails are **queued** in the outbox, visible in Admin → Automation |
| WhatsApp Cloud API | Not set | WhatsApp messages queue with status `skipped` |

The principle: **silence is visible**. A missing credential produces a visible,
resolvable item in the automation log — it never produces a silent no-op and it
never blocks a verified purchase from becoming a project.

---

## 1. Notion — the internal working mirror

Notion is where you work from a phone. The application database is still the
source of truth; the mirror is written to, not read from.

**Page:** `Easywurld Operations` — https://app.notion.com/p/Easywurld-Operations-40e5d5ca0f93813ea68ccf068a308e90
(lives under _Personal Home_; drag it anywhere, the databases travel with it).

| Database | Data source ID | Purpose |
|---|---|---|
| Clients | `b931e22b-02ce-47cc-816d-a99e26b3f80f` | One row per client |
| Projects | `95e436c4-4b11-4a85-a0aa-d1eea3ac31de` | One row per sold project |
| Tasks | `462c4fac-5851-4ee3-b454-c413cc0e11fd` | Production tasks |
| Deliveries | `2818d2cc-28d3-46c6-a918-a45af5b8b265` | Every submitted deliverable + decision |
| Automation Log | `15346af4-9f62-45d3-a49c-ad87b739bfc3` | Append-only automation record |

They are **related, not separate pages**: Projects → Clients (relation),
Tasks → Projects, Deliveries → Projects. Verified by writing a demo client, a
project, a task and a delivery through the API and confirming the backlinks
render.

### Property contract (the sync adapter writes by exact name — do not rename)

| Database | Properties |
|---|---|
| Clients | `Client ID` (title), `Full name`, `Email`, `Phone`, `Purchase date`, `Purchased service`, `Payment status` (Paid/Pending/Refunded), `Client status`, `Project ID`, `Workspace reference` |
| Projects | `Project ID` (title), `Project name`, `Service`, `Project status`, `Client` (relation), `Start date`, `Due date`, `Progress` (0–1), `Revision limit`, `Revisions used`, `Next action`, `Drive folder`, `Amount paid` |
| Tasks | `Task` (title), `Project` (relation), `Assignee`, `Priority`, `Due date`, `Task status`, `Visible to client` |
| Deliveries | `Deliverable` (title), `Project` (relation), `Version`, `Delivery status`, `Submitted`, `Client decision on`, `File / link`, `Notes` |
| Automation Log | `Event` (title), `Event type`, `Status`, `Occurred at`, `Resolved at`, `Client ID`, `Project ID`, `Detail` |

### Connecting it (5 minutes, no card needed)

1. notion.so → **Settings → Connections → Develop or manage integrations →
   New integration**, type _Internal_, workspace = yours.
2. Copy the **Internal Integration Secret** → put it in `.env` as
   `NOTION_TOKEN`. Never in front-end code, never in a chat.
3. Open the `Easywurld Operations` page → **⋯ → Connections → Connect to** →
   pick your integration. (Capability "Insert content" + "Update content".)
4. Restart the API. `GET /api/public/health` now shows `notion.configured: true`.

**Permission model:** the integration sees only pages explicitly shared with
it. That page contains no credentials and no client logins — it holds names,
emails, statuses and links only. Clients never get a Notion account.

---

## 2. Google Drive — optional, currently switched off

> **Decision (4 Nov 2026):** your Drive is nearly full, so the system stores
> files on the server disk instead (`STORAGE_PROVIDER=local`, the default).
> Everything below is ready to switch on later with one variable; nothing in the
> product depends on Drive. See `06-go-live-and-storage.md` for the storage plan.

**Created today:** `EASYWURLD CLIENTS` in My Drive →
https://drive.google.com/drive/folders/1SABmO4DlvOxn_X2nz-iZ4DskqUqhue0k
(`GOOGLE_DRIVE_ROOT_FOLDER_ID=1SABmO4DlvOxn_X2nz-iZ4DskqUqhue0k`).

Per-client layout the application creates on the first verified purchase:

```
EASYWURLD CLIENTS/
└── EW-C-0001 - AMAKA OBI/
    ├── 01 - Onboarding
    ├── 02 - Client Materials
    ├── 03 - Working Files
    ├── 04 - Review and Approvals
    ├── 05 - Final Deliverables
    └── 06 - Archive
```

Names use the **client ID first** so folders stay sorted and searchable. The
same layout is created locally when `STORAGE_PROVIDER=local`, which is what the
demo data shows (`data/storage/EASYWURLD CLIENTS/EW-C-0001 - AMAKA OBI/…`).

### Connecting it

Google blocks OAuth consent screens for apps in "testing" mode after 7 days for
refresh tokens unless an app is verified — so pick one of these:

- **Service account (recommended for a server):** create a service account in
  Google Cloud, enable the Drive API, download the JSON key, share the
  `EASYWURLD CLIENTS` folder with the service-account email as **Editor**, and
  mint access tokens from the key (`GOOGLE_DRIVE_ACCESS_TOKEN`, refreshed in
  code when `GOOGLE_DRIVE_REFRESH_TOKEN` is supplied).
- **Personal OAuth (fastest to try):** OAuth client ID + refresh token in the
  Playground, giving `GOOGLE_DRIVE_CLIENT_ID/SECRET/REFRESH_TOKEN`.

**Permissions:** service account has Editor on `EASYWURLD CLIENTS` only — not
on your whole Drive. `GOOGLE_DRIVE_SHARE_WITH_CLIENTS=false` by default: files
are served through the authenticated portal, so a leaked link is not a data
leak. Turn it on only if you deliberately want per-file public links.

**Duplicate-safety:** folder creation is idempotent — the project records
`workspace_path` / `drive_folder_id` and a re-run reuses it. The admin "Retry
folder creation" button re-attempts after a failure without creating a second
tree.

---

## 3. Dropbox — supplementary media only

Off by default. Use it for large video/photo masters, never as a second copy of
the Drive tree (the brief forbids duplicating large files). When enabled, the
app creates `/EASYWURLD CLIENTS/<CLIENT ID - NAME>/…` on upload of media larger
than the Drive-sync threshhold and stores a reference in `files`.

Connecting: dropbox.com/developers/apps → **Create app** → *Scoped access* →
*App folder* → permissions `files.content.write`, `files.content.read`,
`sharing.write` → generate an access token → `DROPBOX_ACCESS_TOKEN`. Free tier:
2 GB, no card.

**Limitation:** Dropbox access tokens from the app console are long-lived but
revocable; they do not work for team folders. That is acceptable for a
supplementary store.

---

## 4. Payments — purchase detection

The public endpoint is `POST /api/webhooks/payments/:provider` where provider is
`paystack`, `flutterwave`, `stripe` or `generic`. **Nothing activates until the
signature verifies.**

| Provider | Verification | Field used as the dedupe key |
|---|---|---|
| Paystack | `x-paystack-signature` = HMAC-SHA512 of the raw body with your secret | `data.reference` |
| Flutterwave | `verif-hash` header equals your secret hash | `data.tx_ref` / `data.id` |
| Stripe | `stripe-signature` `t=`+`v1=` HMAC-SHA256, 5-minute tolerance | `data.object.id` |
| Generic | `x-webhook-secret` equals `WEBHOOK_SECRET` | `reference` in body |

Dedupe is enforced by a database constraint `UNIQUE (provider,
provider_reference)` **and** an order-level idempotency key, so five concurrent
duplicates and a crash between order and project both resolve to one client.

Never-convert cases are recorded in `automation_events` and shown on the
Automation screen: failed/cancelled/abandoned payments, amounts below the offer
price, unknown references, and webhooks whose product is not mapped to a
template.

### Wiring it up

1. Buy a domain (or use a tunnel) — providers cannot call `localhost`.
2. Set `SITE_URL=https://your-domain` and deploy the API (§6).
3. Paystack Dashboard → **Settings → API Keys & Webhooks** → webhook URL
   `https://your-domain/api/webhooks/payments/paystack`; copy the secret key to
   `.env`.
4. Use the provider's **test mode** first; the test suite already exercises the
   signature maths with the real algorithm.

---

## 5. Email and WhatsApp

**Email (SMTP):** any provider works — Zoho Mail free tier, Gmail app password,
Brevo (300/day free), Resend (100/day). Without SMTP every message is still
composed, stored and visible in **Admin → Automation → Outbox**, so nothing is
lost while you decide. "Retry delivery" re-sends after you add credentials.

**WhatsApp Cloud API:** optional and metered (≈$0.03–0.08 per business-initiated
conversation; the first 1,000 service conversations/month are free). Template
messages must be pre-approved by Meta. Because of that approval latency the app
never depends on WhatsApp: the same notification is always sent by email and
shown in the portal notification list.

---

## 6. Deployment shape (why Vercel alone is not enough)

`vercel.json` and `netlify.toml` deploy **static `dist/public` only**. This
system needs a long-lived Node process, a writable disk for SQLite and uploads,
and an open webhook endpoint. Practical options, cheapest first:

1. **Railway / Render free-or-$5 tier** + a 1 GB volume → `npm run build`,
   `npm start`, mount `/data`. Webhooks work out of the box.
2. **Fly.io** (free allowance) with a 1 GB volume — same idea, more CLI.
3. **A small VPS** (Hetzner €4) running `npm start` behind Caddy — most
   controllable, needs patching.
4. **Keep the marketing site on Vercel** and point `/login`, `/portal`,
   `/admin` at the API host via a rewrite — best of both.

---

## 7. What is intentionally *not* integrated

- **Publishing to social networks.** Clients cannot publish or schedule on
  Easywurld's behalf; approvals are recorded, publishing stays manual.
- **A client-facing Notion or Drive share.** Clients reach files only through
  the authenticated portal.
- **GitHub.** Code only. Client files never enter a repo; a project-specific
  repo is created only if a build genuinely needs one, and never with client
  secrets, and never shared with clients.
