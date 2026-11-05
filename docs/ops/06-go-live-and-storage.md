# 06 — Going live: hosting, storage, and the credentials only you can give

Written for someone who does not want to learn AWS. Every step is a click path.
You do **none** of this to review the system — it already runs locally without a
single token.

---

## 1. Vercel vs Google Drive — they do different jobs

| | What it is | Can it hold client files? |
|---|---|---|
| **Vercel** | Where the *website and app screens* are served from | **No.** It serves files from a build; it has no disk. Anything a client uploads would vanish on the next deploy. |
| **Google Drive** | A *storage* service | Yes — but it is full, so we are not using it. |

So the honest answer: **the app can live on Vercel only as the front end.** The
part that receives purchases, stores uploads and takes approvals needs a small
always-on server with a disk (or object storage). Without that, a client's
uploaded logo has nowhere to exist and a payment webhook has nowhere to land.

That is not a limitation of this build — it is true of every operations system.

### What I recommend for you: free

You said free is better, so the plan is **Oracle Cloud "Always Free"** — a real
Ubuntu VM with 200 GB of disk, $0/month, no expiry. It runs this app unchanged
(Node + SQLite + uploads on disk) and gives you a place for purchase webhooks to
land. Setup is ~30 minutes, once, and every command is copy-paste in
**`deploy/README.md`**.

| Option | Cost | Works? | Note |
|---|---|---|---|
| **Oracle Cloud Always Free VM** | **$0 forever** | **Yes** | Card for identity only; 200 GB disk solves storage too |
| Fly.io | ~$2/mo | Yes | Card required; easiest CLI |
| Render free | $0 | **No** | No persistent disk on free; wipes data on restart |
| Vercel free | $0 | Front end only | No disk, no long-lived webhook target |
| Railway | ~$5/mo | Yes | Trial credit, then paid |

`deploy/` contains everything: `install.sh` (idempotent), a hardened systemd
unit, a nightly backup timer, and a Caddyfile that gets you HTTPS automatically.
The marketing site can stay on Vercel — only `/login`, `/portal` and `/admin`
need the VM.

**Storage, since Drive is full:**

1. **Server disk (default today).** `STORAGE_PROVIDER=local`. Files land in
   `data/storage/EASYWURLD CLIENTS/…` on the volume you attach. 1 GB holds
   roughly 1,000 logos/PDFs or ~20 minutes of video. Zero extra cost. This is
   what is running right now.
2. **Cloudflare R2** when you outgrow that — 10 GB free, no card, no egress
   fees. Not wired up yet because it needs your account; it is a ~2-hour job
   when you want it.
3. **Google Drive / Dropbox** stay *optional* and off. Nothing breaks with them
   off; the folder layout is still created locally.

Rule I am keeping from your brief: **do not duplicate large files.** One master
copy. If a video is too big for the disk, it goes to R2 later — not to three
places.

---

## 2. What I still need from you (and what happens without it)

| Credential | Needed for | Without it | How hard |
|---|---|---|---|
| Hosting account (Railway/Render) | Making it reachable online | It only runs on this machine | Easy — browser |
| Notion integration token | Mirroring into your Notion workspace | Sync skipped, logged once | Easy — 6 clicks, below |
| Payment provider secret (Paystack) | Turning real purchases into clients | Payments cannot trigger onboarding | Medium — dashboard |
| SMTP mailbox | Welcome emails actually arriving | Emails queue in the outbox | Easy — app password |

**Nothing here is urgent.** You can run real projects from the admin dashboard
today with all four missing. The only thing you cannot do without a payment
secret is *automatic* purchase detection — you would create those sales with the
manual-sale button instead (Admin → Dashboard → Record a sale).

---

## 3. Notion token, click by click (the bit you said you don't know)

You do not need a "PAT", an API key on a developer portal, or any code.

1. Open Notion in a browser (not the phone app — the connections menu is hidden
   on mobile).
2. Bottom-left: **Settings** → scroll down to **Connections** →
   **Develop or manage integrations**.
3. **New integration**. Name it `Easywurld Ops`. Type: **Internal**. Pick your
   workspace. Save.
4. On the next screen, **Internal Integration Secret** → **Show** → **Copy**.
   It looks like `ntn_…`. Treat it like a password.
5. Go to the page **Easywurld Operations** (under Personal Home). Top-right
   **⋯** → **Connections** → **Connect to** → `Easywurld Ops` → confirm.
6. Paste the secret into `.env` as `NOTION_TOKEN=` and restart. Done.

If step 5 is missed the token works but sees nothing — that is the single most
common mistake, and the admin Automation screen will tell you so in plain words.

---

## 4. Deployment, click by click

The free path is in **`deploy/README.md`** (Oracle Always Free, ~30 minutes).
Railway is kept below as the paid, least-effort alternative.

1. railway.app → sign in with GitHub → **New Project → Deploy from GitHub repo**
   → `easywessy/easywurld.com`.
2. **Settings → Build**: build command `npm install --legacy-peer-deps && npm run build`.
   Start command `npm start`.
3. **Variables**: add `NODE_ENV=production`, `SITE_URL=https://<your-domain>`,
   `ADMIN_EMAILS=<your email>`, plus whatever you have from §2.
4. **Volumes → Add volume**, mount path `/data`. Set `DATA_DIR=/data`. This is
   where the database, uploads and backups live — it survives deploys.
5. **Settings → Networking → Generate domain**, then point your domain at it.
6. Create your real admin account once, from the Railway shell:
   `npm run ops:admin -- --email you@easywurld.com --name "Your Name"`
   (it prints a one-time password; change it after first sign-in).

Paystack webhook URL after that:
`https://<your-domain>/api/webhooks/payments/paystack`

---

## 5. Housekeeping notes

- The demo data (`Amaka`, `Tunde`, and the Easywurld first-client project) exists
  only in development. On a production database it cannot be seeded — the script
  refuses to run when `NODE_ENV=production`.
- The empty `EASYWURLD CLIENTS` folder I created in your Drive can be ignored or
  deleted; nothing depends on it. If you ever switch
  `STORAGE_PROVIDER=gdrive`, recreate it and paste its ID into
  `GOOGLE_DRIVE_ROOT_FOLDER_ID`.
- Backups: `npm run ops:backup` copies the SQLite file and a manifest into
  `data/backups/`. On Railway, run it from a scheduled job or download the
  volume weekly. A copy you have never restored is not a backup — the runbook in
  `05-costs-and-manual-tasks.md` includes the restore drill.
