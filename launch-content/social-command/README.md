# Easywurld Series Studio

**Active campaign:** 2 November–1 December 2026
**Volume:** 10 core posts/day × TikTok, Instagram and Facebook = 30 placements/day. 300 core posts and 900 placements in total.

## Open these

1. `EASYWURLD_POST_COMMANDER.html` — offline Series Studio: strategy, daily calendar, 300 briefs, per-platform status/QA, notes, weekly batches and CSV exports.
2. `content_calendar.csv` — 900 placement rows, every row starting Draft.
3. `MONTH_POSTS.md` — the full calendar and all 300 briefs, identical to the marketing calendar.
4. `MEME_BANK.md` — all 60 original memes with exact copy, captions and asset paths.
5. `POSTING_PLAN.md` — cadence, times, platform adaptation and scheduling rules.
6. `EASYWURLD_DRIVE_INDEX.md` — repository file index; no claim that Google Drive has been synced.
7. `CLAUDE_OFFERS_PROMPT.md` — existing offers-PDF prompt, retained unchanged.
8. `EASYWURLD_OFFERS_MASTER.md` / PDF — existing offer copy and booklet, retained.

Canonical editorial source: `../../marketing/series-plan.json`.
Generated data: `../../marketing/content-plan.json`.
Edit the source, then run `npm run content:build` and `npm run content:check`. Do not edit generated CSV/HTML/calendar files independently.

## What the offline app does

- Shows the 10 series and the rationale/risks of the 10-a-day plan.
- Opens any of the 30 days, with 10 core slots and three platform placements per slot.
- Filters by day, series and platform.
- Searches all 300 briefs.
- Copies the core script, the selected platform caption, the prompt or the full placement brief.
- Tracks status, six/seven QA checks and notes separately for each platform placement.
- Exports all 900 placements or one week as CSV.
- Exports/imports a local progress backup.
- Contains no social credentials, publishing API or automatic scheduler.

## Publishing shape

- 10 core posts/day, starting 07:00 WAT and ending 20:30 WAT.
- TikTok at the slot time; Instagram +10 minutes; Facebook +20 minutes.
- One ₦5,000 DIY pack featured per day, with two angles.
- Trend Desk placements are held until the verification log is complete.
- All 900 placements start Draft. The CSV is not an auto-publishing import.

See `../../marketing/PRODUCTION.md` for batch, editing, trend, QA and scheduling rules.

## Avatar gate

No verified owner headshot or CV was found in the accessible repos. Do not animate the fictional `client/public/demo/img/founder-recording.jpg`. Supply the correct owner-approved source and permission before generating a personal avatar or voice. The meme, carousel, screen-demo and static fallbacks can proceed without it.

## Honesty rules

- Label every portfolio demo concept/sample.
- No invented client results, testimonials, rankings or guarantees.
- DIY packs are not custom projects; confirm current price and fulfilment.
- Disclose realistic AI presenters/voices and keep private customer information out of prompts.
- Verify trends before claiming anything is current.
- If a slot is missed, skip it rather than stacking catch-up posts.
