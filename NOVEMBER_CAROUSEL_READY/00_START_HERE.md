# November carousel delivery — 11 to 30 November 2026

**220 carousels · 1360 slide images · 220 ready to schedule · 0 on hold.** 99 MB on disk.

Start here: open the date folder for the day you are scheduling, read `POST_TODAY.md`.

## How to schedule a carousel

1. Open `2026-11-11/POST_TODAY.md` (or whichever date).
2. Read the time, channel and folder it names. Times are WAT.
3. In the folder, select `01.jpg` … the last number, in that order, and upload as one carousel post.
4. Copy the caption from the code block. It includes the hashtags.
5. Post, or use the platform scheduler, and write the confirmation in `SCHEDULING_TRACKER.csv`.

`07:45` LinkedIn document posts: upload the `.pdf` in that day's `S06/` folder as a document post. That is a separate placement, not a duplicate of the Facebook version.

## What is ready and what is not

**220 carousels are ready.** Copy is complete, every illustration is labelled on the image itself, and the type fits at a readable size at 1080×1350.

**Nothing is on hold.** Every carousel has complete copy and no unresolved placeholder.

## The offer carousels now sell the real product

All 20 S10 carousels are priced from the site's own data, not from a guess: **₦5,000 per pack**, one of nine packs, ordered by messaging its keyword on WhatsApp. The closing slide of each is a rendered price card.

| What the slide claims | Where it comes from |
|---|---|
| ₦5,000 per pack | `client/src/data/offers.ts` → `OFFER_PRICE` |
| What arrives (file list) | That pack's `deliverables` on the site |
| "Message {KEYWORD} on WhatsApp" | The site's own buy button and keyword |
| "No consultation or custom work" | The site's own FAQ wording |

What is deliberately **not** on any slide: a struck-through "was" price, a discount, a saving, or a countdown. The site also publishes ₦297,500 as an *estimate of replacement cost*; that is not a price Easywurld ever charged, so it is never shown as one. Every price is re-checked at build time — if the figure on the site changes, this build fails rather than quietly advertising the old one.

## What this delivery does NOT do

- **It does not publish or schedule anything.** Every row in the tracker is blank on `scheduled`.
- **It does not approve the copy.** Rendering proves the type fits and is legible. It cannot prove a claim, a price, or a permission. G4 release still needs a named approver.
- **It does not replace the legal question.** Whether an organic carousel needs ARCON pre-exposure vetting is still open (register row `NG-ARCON-07`). Ask before you scale this up.
- **The times are a proposal.** Carried from the existing November grid, not tested. Shift them.

## Read this before you schedule: it overlaps an existing delivery

`NOVEMBER_DELIVERY/` already contains a complete, rendered delivery for **2 November – 1 December 2026** — Day_10 is 11 November, Day_29 is 30 November. Those folders have their own 11 feed posts, videos, stories and LinkedIn pulls per day.

This package is the **fact-checked carousel set**, not a repair of that one. If you publish both on the same dates you will double-post. Choose one:

| Option | What happens |
|---|---|
| **Replace** | Post these 11 carousels per day instead of the matching `NOVEMBER_DELIVERY` day. Different topics, so nothing repeats — but the old day's videos and stories are dropped. |
| **Interleave** | Keep `NOVEMBER_DELIVERY` and slot these at times it does not use. Its feed rows run from 07:00 in ten-minute steps, so this package's later slots collide. |
| **Shift later** | These drafts were written for December anyway. Move the delivery window to 2–31 December and nothing overlaps at all. |

I did not pick one for you, because all three are real choices about your own calendar.

## Unresolved, carried forward honestly

| Item | State |
|---|---|
| Fonts | **Resolved.** Fraunces, Inter and JetBrains Mono, all SIL OFL 1.1. See `research-2026-11-10/06_FONT_LICENCE.md` |
| Logo | Uses the repo mark. Confirm you hold the mark. |
| Offer terms | **Resolved for the packs.** ₦5,000, scope and order route now come from the site data. Custom service work stays unpriced by design. |
| Released by | **Nobody yet.** No named G4 approver. |
| Music | Still deferred — see `04_MUSIC_AND_RIGHTS_NOTE.md`. These are silent carousels. |

## Files in this delivery

| Path | What it is |
|---|---|
| `2026-11-11/…/2026-11-30/` | One folder per day: `POST_TODAY.md` + one subfolder per carousel |
| `SCHEDULING_TRACKER.csv` | All 220 rows with captions, channels, status and blank confirmation columns to fill as you post |
| `CONTACT_SHEETS/` | Slide 1 of every carousel as a numbered thumbnail grid, to check order fast |

## If you change the price

Do not edit the slides. Change `OFFER_PRICE` in `client/src/data/offers.ts` — the same constant the
site reads — then rebuild:

```bash
python marketing/operating-system-v2/build_calendar.py   # regenerate S10 copy
python marketing/operating-system-v2/check.py            # price integrity gate
python marketing/operating-system-v2/build_delivery.py   # re-render
```

`check.py` fails if a slide quotes any figure other than the site's own, if a price appears outside
S10, if a "was/discount/save" framing sits near a naira amount, if the order keyword is not one of the
nine real ones, or if a pack is missing from the run. That is deliberate: a stale price is the most
expensive typo in this package.

## Rebuilding from scratch

```bash
bash marketing/operating-system-v2/setup_fonts.sh   # only needed if fonts/ is missing
python marketing/operating-system-v2/research_facts.py
python marketing/operating-system-v2/build_calendar.py
python marketing/operating-system-v2/check.py
python marketing/operating-system-v2/build_delivery.py
```

Needs Python 3 with `Pillow`, `fonttools` and `brotli`. The fonts are committed, so rendering works
offline.

Rebuild any time: `python marketing/operating-system-v2/build_delivery.py`
