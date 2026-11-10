# November carousel delivery — 11 to 30 November 2026

**220 carousels · 1360 slide images · 195 ready to schedule · 25 on hold.** 99 MB on disk.

Start here: open the date folder for the day you are scheduling, read `POST_TODAY.md`.

## How to schedule a carousel

1. Open `2026-11-11/POST_TODAY.md` (or whichever date).
2. Read the time, channel and folder it names. Times are WAT.
3. In the folder, select `01.jpg` … the last number, in that order, and upload as one carousel post.
4. Copy the caption from the code block. It includes the hashtags.
5. Post, or use the platform scheduler, and write the confirmation in `SCHEDULING_TRACKER.csv`.

`07:45` LinkedIn document posts: upload the `.pdf` in that day's `S06/` folder as a document post. That is a separate placement, not a duplicate of the Facebook version.

## What is ready and what is not

**195 carousels are ready.** Copy is complete, every illustration is labelled on the image itself, and the type fits at a readable size at 1080×1350.

**25 carousels are on hold** — every one is the offer series:

| Series | Count | Why held |
|---|---|---|
| S10 Offer and solution | 25 | Price, scope, availability and turnaround are not confirmed. A displayed price is binding under FCCPA s.115; an unclear scope is misleading under s.123. Nothing is guessed. |

To release them: send the confirmed price or price range, what is included, the enquiry route, and who answers it. I will fill the placeholders and re-render those 20 carousels.

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
| Offer terms | **Blocking 20 carousels.** |
| Released by | **Nobody yet.** No named G4 approver. |
| Music | Still deferred — see `04_MUSIC_AND_RIGHTS_NOTE.md`. These are silent carousels. |

## Files in this delivery

| Path | What it is |
|---|---|
| `2026-11-11/…/2026-11-30/` | One folder per day: `POST_TODAY.md` + one subfolder per carousel |
| `SCHEDULING_TRACKER.csv` | All 220 rows with captions, channels, status and blank confirmation columns to fill as you post |
| `CONTACT_SHEETS/` | Slide 1 of every carousel as a numbered thumbnail grid, to check order fast |

Rebuild any time: `python marketing/operating-system-v2/build_delivery.py`
