# Easywurld Content Studio

**Active campaign: 2 November–1 December 2026.** The October high-volume kit has been retired to `archive/2026-10/`.

## Open these first

1. `../../marketing/STRATEGY.md` — the strategy before the posts.
2. `../../marketing/CONTENT_PLAN.pdf` — readable calendar and complete briefs.
3. `EASYWURLD_POST_COMMANDER.html` — offline Content Studio with Strategy, Calendar, Post briefs and Production tabs.
4. `content_calendar.csv` — 22 primary posts and 31 explicitly optional reuses.

The offline file works without a server. Copy buttons, QA checks, notes and production statuses are local to the browser. Export a progress backup before changing devices. **It does not connect to TikTok, Instagram, Facebook or LinkedIn and does not schedule anything.**

## Active files

| File | Purpose |
|---|---|
| `EASYWURLD_POST_COMMANDER.html` | Offline strategy-first planner, generated from the canonical JSON |
| `content_calendar.csv` | Dated production/distribution sheet; every row starts Draft |
| `MONTH_POSTS.md` | Full calendar and briefs, identical to the marketing calendar |
| `POSTING_PLAN.md` | Current cadence and scheduling rules |
| `MEME_BANK.md` | The two original scheduled static posts, not the old 37-meme plan |
| `EASYWURLD_DRIVE_INDEX.md` | Repository file index; no claim that Drive has been synced |
| `CLAUDE_OFFERS_PROMPT.md` | Existing offers-PDF prompt, retained unchanged |
| `EASYWURLD_OFFERS_MASTER.md` / PDF | Existing offer copy and booklet, retained |

The canonical source is `../../marketing/content-plan.json`. Edit it, then run `npm run content:build` and `npm run content:check`. Do not edit generated CSV/HTML/calendar files independently.

## Publishing shape

- One main post per weekday at 18:30 Africa/Lagos.
- 10 AI talking heads, 5 screen demos, 5 carousels, 2 original static posts.
- Eight weekend days for replies, review and batching.
- Optional Instagram reuses at 19:00; selective Facebook/LinkedIn suggestions at 19:15.
- 53 CSV rows total: 22 primary + 31 optional. These are not 53 compulsory posts.

See `../../marketing/PRODUCTION.md` for the weekly batches and platform checks. Native scheduling availability and windows vary; the CSV is not an auto-publishing import.

## Avatar gate

No verified owner headshot or CV was found in the accessible repos. Do not animate the fictional `client/public/demo/img/founder-recording.jpg`. Supply the correct owner-approved source and permission before generating a personal avatar or voice. The Monday carousel and non-avatar fallbacks can proceed without it.

## Honesty rules

- Label every portfolio demo concept/sample.
- No invented client results, testimonials, rankings or guarantees.
- DIY packs are not custom projects; confirm current price and fulfilment.
- Disclose realistic AI presenters/voices and keep private customer information out of prompts.
- If a slot is missed, skip it rather than stacking catch-up posts.

The old daily scripts, ZIP, launch PDFs and 1,140-row source plan remain in the archive for reference only. They are not the current calendar.
