# November money — the offer carousels, ₦5,000

**20 offer carousels · 20 ready · 9 packs · ₦5,000 each.** Every figure below is read from `client/src/data/offers.ts`, the same file the live site reads.

## What is being sold

One pack is ₦5,000. There are nine, one per problem. Each is a guide plus three editable files, sent on WhatsApp after payment. No consultation and no custom work is included — that is a separate, quoted service.

| Keyword | Pack | Category | Files | Replacement-cost estimate |
|---|---|---|---|---|
| `PLAYBOOK` | The Chat-to-Customer Playbook | Business Systems | 4 | ₦35,000 |
| `CLEAR` | The Clear Homepage Blueprint | Web Design & Copywriting | 4 | ₦32,500 |
| `ENGINE` | The 30-Day Content Engine | Social Media | 4 | ₦32,500 |
| `PAGE` | The One-Offer Landing Page Kit | Landing Pages | 4 | ₦32,500 |
| `LOCAL` | The Lagos Local Visibility Starter | Digital Marketing & SEO | 4 | ₦32,500 |
| `MESSAGE` | The Clear Message Workbook | Digital Marketing Strategy | 4 | ₦32,500 |
| `PROMPTS` | The Everyday AI Prompt Desk | AI Business Automation | 4 | ₦35,000 |
| `TEMPLATES` | The Proposal & Report Template Pack | Reports & Presentations | 4 | ₦32,500 |
| `LAUNCH` | The Website Launch & Care Handbook | Web Design | 4 | ₦32,500 |

**Total replacement-cost estimate across all nine: ₦297,500.** This is the site's own estimate of what the files would cost to commission separately (hours × ₦5,000), and the site explicitly calls it *"not previous selling prices"*. It is **not** a former price, a discount baseline, or money you have earned. Nothing in this pack treats it as revenue.

## How an order actually happens

1. A buyer messages a keyword (e.g. `PLAYBOOK`) on WhatsApp to +2349050690837.
2. You reply with payment details. There is no checkout on the site.
3. Once payment clears, you send the files on WhatsApp.

That is the whole funnel: no cart, no email capture, no automated delivery. Which means the only metric that means anything here is **orders by keyword** — one off, not a rate.

## The 20 slots

| # | Date | Time (WAT) | Pack | Keyword | Price card |
|---|---|---|---|---|---|
| 1 | 2026-11-11 | 20:30 | The Chat-to-Customer Playbook | `PLAYBOOK` | `01_2026-11-11_PLAYBOOK.jpg` |
| 2 | 2026-11-12 | 20:30 | The Clear Homepage Blueprint | `CLEAR` | `02_2026-11-12_CLEAR.jpg` |
| 3 | 2026-11-13 | 20:30 | The 30-Day Content Engine | `ENGINE` | `03_2026-11-13_ENGINE.jpg` |
| 4 | 2026-11-14 | 20:30 | The One-Offer Landing Page Kit | `PAGE` | `04_2026-11-14_PAGE.jpg` |
| 5 | 2026-11-15 | 20:30 | The Lagos Local Visibility Starter | `LOCAL` | `05_2026-11-15_LOCAL.jpg` |
| 6 | 2026-11-16 | 20:30 | The Clear Message Workbook | `MESSAGE` | `06_2026-11-16_MESSAGE.jpg` |
| 7 | 2026-11-17 | 20:30 | The Everyday AI Prompt Desk | `PROMPTS` | `07_2026-11-17_PROMPTS.jpg` |
| 8 | 2026-11-18 | 20:30 | The Proposal & Report Template Pack | `TEMPLATES` | `08_2026-11-18_TEMPLATES.jpg` |
| 9 | 2026-11-19 | 20:30 | The Website Launch & Care Handbook | `LAUNCH` | `09_2026-11-19_LAUNCH.jpg` |
| 10 | 2026-11-20 | 20:30 | The Chat-to-Customer Playbook | `PLAYBOOK` | `10_2026-11-20_PLAYBOOK.jpg` |
| 11 | 2026-11-21 | 20:30 | The Clear Homepage Blueprint | `CLEAR` | `11_2026-11-21_CLEAR.jpg` |
| 12 | 2026-11-22 | 20:30 | The 30-Day Content Engine | `ENGINE` | `12_2026-11-22_ENGINE.jpg` |
| 13 | 2026-11-23 | 20:30 | The One-Offer Landing Page Kit | `PAGE` | `13_2026-11-23_PAGE.jpg` |
| 14 | 2026-11-24 | 20:30 | The Lagos Local Visibility Starter | `LOCAL` | `14_2026-11-24_LOCAL.jpg` |
| 15 | 2026-11-25 | 20:30 | The Clear Message Workbook | `MESSAGE` | `15_2026-11-25_MESSAGE.jpg` |
| 16 | 2026-11-26 | 20:30 | The Everyday AI Prompt Desk | `PROMPTS` | `16_2026-11-26_PROMPTS.jpg` |
| 17 | 2026-11-27 | 20:30 | The Proposal & Report Template Pack | `TEMPLATES` | `17_2026-11-27_TEMPLATES.jpg` |
| 18 | 2026-11-28 | 20:30 | The Website Launch & Care Handbook | `LAUNCH` | `18_2026-11-28_LAUNCH.jpg` |
| 19 | 2026-11-29 | 20:30 | The Chat-to-Customer Playbook | `PLAYBOOK` | `19_2026-11-29_PLAYBOOK.jpg` |
| 20 | 2026-11-30 | 20:30 | The Clear Homepage Blueprint | `CLEAR` | `20_2026-11-30_CLEAR.jpg` |

Times are a proposal carried from the existing November grid, not a tested timetable.

## What is on the price cards

Each card shows ₦5,000, the pack name, the file count, a one-line list of what arrives, the WhatsApp keyword button, and the boundary ("no consultation or custom work"). The full carousel behind each card is six slides: hook, who it is for, the problem, what arrives, the order route, then the price card.

## What is deliberately absent

| Not on any card | Why |
|---|---|
| A struck-through or "was" price | There is no former price. The estimate is a replacement cost, and presenting it as a discount would be a misleading representation under FCCPA s.123 |
| A discount, saving, or countdown | Same reason. Nothing is on offer here except a fixed price |
| ₦297,500 shown as a price | The site itself calls that an estimate, not a price it charged |
| A revenue forecast | There is no traffic, conversion or audience data in this repository. Any number would be invented |
| A guarantee of sales, followers, rankings or traffic | The site's own FAQ rules these out |

A displayed price is binding under FCCPA s.115, so the figure on the card must equal the figure on the live site on the day you post. `check.py` fails the build if any slide quotes a different figure, if a price appears outside S10, or if discount framing sits near a naira amount.

## Where the rest of it lives

| What | Where |
|---|---|
| Full six-slide carousels, captions, hashtags | `NOVEMBER_CAROUSEL_READY/<date>/S10/` |
| Every carousel, all series | `NOVEMBER_CAROUSEL_READY/SCHEDULING_TRACKER.csv` |
| Scheduling and price-change instructions | `NOVEMBER_CAROUSEL_READY/00_START_HERE.md` |
| Why each claim is allowed | `marketing/operating-system-v2/research-2026-11-10/01_FACT_REGISTER.csv` |

## Still true, and worth saying plainly

- **Nothing is scheduled.** All 220 rows have blank confirmation columns.
- **Nothing is approved.** G4 needs a named approver.
- **No money has been earned.** This pack is the material to sell with, not a result.
- Whether organic carousels need ARCON pre-exposure vetting is still open (`NG-ARCON-07`).
