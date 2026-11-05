# 05 — Costs, and the tasks that need a human

_Prices checked 4 November 2026 · NGN converted at ~₦1,600/$_

## 1. What this system costs to run

**Recommended setup: ₦0 / month.**

| Item | Plan | Monthly | Notes |
|---|---|---|---|
| Server | Oracle Cloud **Always Free** VM.Standard.E2.1.Micro (1 OCPU, 1 GB RAM) | **$0** | Free permanently. 200 GB block storage included. Card used for identity verification only — set a $0 budget alert. |
| Database | SQLite in the app | **$0** | No managed-DB bill, no row limits. Easily handles hundreds of clients. |
| File storage | 200 GB block volume | **$0** | Replaces the full Google Drive. Uploads stay under `EASYWURLD CLIENTS/…`. |
| HTTPS | Caddy + Let's Encrypt | **$0** | Auto-renewing certificates. |
| Notion mirror | Free plan | **$0** | Five databases fit comfortably. |
| Email | Brevo free (300/day) or Zoho Mail free (own domain) | **$0** | Optional; queues in the outbox without it. |
| Notifications dashboard | Built in | **$0** | — |
| Uptime monitoring | UptimeRobot free | **$0** | 5-minute checks on `/api/public/health`. |
| **Total** | | **$0** | |

Costs that appear only when you actually sell:

| Item | When | Cost |
|---|---|---|
| Paystack | Per successful transaction | 1.5% + ₦100 (₦100 waived under ₦2,500); no monthly fee |
| Flutterwave | Per transaction | 1.4% local cards, capped ₦2,000 |
| WhatsApp Cloud API | Per business-initiated conversation | ~$0.03–0.08; 1,000 service conversations/month free |
| Domain | Already owned | — |

If the free VM ever feels tight (it will not for the first ~50 clients), the next
step up is Fly.io at ~$2/month, then a €4 Hetzner VPS. Do not pay for a managed
database — SQLite on one disk is the whole point.

**Things I deliberately refused to add:** no paid CRM, no Zapier/Make
subscription, no managed Postgres, no object storage bill, no per-seat project
tool. Every automated step runs inside this app.

## 2. First-run manual tasks (one afternoon, once)

| # | Task | Who | Time |
|---|---|---|---|
| 1 | Create the Oracle Always Free VM, open ports 80/443, add the domain A record | You + me | 30 min |
| 2 | Run `deploy/install.sh`, then `npm run ops:admin` to create your real account | Me (or you, copy-paste) | 10 min |
| 3 | Decide the real prices per service and update the offer mapping (`serviceKey`, amount) so webhooks route to the right template | You | 20 min |
| 4 | Add Paystack secret + webhook URL, run one ₦100 live test purchase, refund it | You | 15 min |
| 5 | Create the Notion internal integration token; connect the page | You (6 clicks, see `06` §3) | 5 min |
| 6 | Add SMTP credentials (Brevo/Zoho) and send a test welcome email | You | 10 min |
| 7 | Replace the demo template copy (task names, questionnaire wording) with your own voice | You | 40 min |
| 8 | Upload your logo/brand assets to the client workspace standard (`02 - Client Materials`) | You | 10 min |
| 9 | Delete the demo clients before going live (`Admin → Clients → Delete data`) | Me | 2 min |

## 3. Recurring manual tasks (must never be automated)

| Task | Cadence | Why a human |
|---|---|---|
| Review **Automation** screen for red rows | Every working day, 2 min | Failures are rare but silent by nature; the screen exists to be looked at |
| Approve or escalate anything stuck >7 days | Weekly | Silence is never approval — a stuck project is a decision, not a queue |
| Verify bank transfers before using **Record a sale** | Per transfer | Never activate paid work on an unverified notification |
| Confirm final delivery and move project to `delivered` → `archived` | Per project | The client's explicit approval is the trigger; not a timer |
| Check the nightly backup exists | Weekly (30 s) | `ls /var/lib/easywurld/backups` |
| Restore drill | Monthly | A backup you have never restored is not a backup |
| Rotate the Paystack / SMTP / Notion secrets | Every 6 months, or on any staff change | — |
| `sudo apt upgrade` the server | Monthly | Free tier means you are the sysadmin |
| Review pricing / revise templates | Quarterly | Business judgement |

### The 5-minute restore drill

```bash
sudo systemctl stop easywurld
cd /var/lib/easywurld
ls -lt backups | head            # pick the newest .db
cp easywurld.db easywurld.db.before-restore
cp backups/<newest>.db easywurld.db
sudo systemctl start easywurld
curl -s localhost:3001/api/public/health
```
Then delete `easywurld.db.before-restore` once you are happy.

## 4. Growth triggers — when to spend money

| Trigger | Action | New cost |
|---|---|---|
| >100 clients or >5 GB of uploads | Move media to Cloudflare R2 (10 GB free) | $0 → ~$0.015/GB after |
| Webhooks arriving faster than one server can process | Nothing yet — SQLite WAL handles this well past 50 purchases/day | $0 |
| You hire a second person | One more admin account (free, unlimited) | $0 |
| Email volume >300/day | Brevo paid tier | ~$9/mo |
| Client wants real-time chat | Keep using the portal thread; a chat vendor is not worth it at this size | $0 |

## 5. What is not included, on purpose

- **No social publishing API.** Approvals are recorded; publishing stays manual,
  so a mistake can never go out under Easywurld's name.
- **No client-facing Notion.** Clients get the portal, not your working mirror.
- **No code repository per client.** GitHub is for code and deployment only;
  client files never enter a repo.
- **No automated payment chasing.** Reminders are drafted and queued; a human
  presses send, because an automated dunning email to a good client reads badly.
