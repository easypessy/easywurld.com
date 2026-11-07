# Easywurld Series Studio

**Active campaign:** 2 November–1 December 2026
**Volume:** 11 posts + 2 stories/day × TikTok, Instagram and Facebook = 39 placements/day, plus 26 LinkedIn posts. 330 content posts, 60 stories and 1,196 placements in total.

## Open these

1. `EASYWURLD_POST_COMMANDER.html` — offline Series Studio: strategy, daily calendar, stories, LinkedIn, 416 briefs, per-platform status/QA, notes, weekly batches and CSV exports.
2. `content_calendar.csv` — 1,196 placement rows, every row starting Draft.
3. `MONTH_POSTS.md` — the full calendar and every brief, identical to the marketing calendar.
4. `MEME_BANK.md` — all 60 scene-led memes with scene plate, on-image copy, captions and asset paths.
5. `POSTING_PLAN.md` — cadence, times, platform adaptation and scheduling rules.
6. `EASYWURLD_DRIVE_INDEX.md` — repository file index; no claim that Google Drive has been synced.
7. `CLAUDE_OFFERS_PROMPT.md` — existing offers-PDF prompt, retained unchanged.
8. `EASYWURLD_OFFERS_MASTER.md` / PDF — existing offer copy and booklet, retained.

Canonical editorial source: `../../marketing/series-plan.json`.
Generated data: `../../marketing/content-plan.json`.
Edit the source, then run `npm run content:build` and `npm run content:check`. Do not edit generated CSV/HTML/calendar files independently.

## What the offline app does

- Shows the 11 series, the two story slots and the LinkedIn cadence.
- Opens any of the 30 days, with 11 content slots plus 2 stories and three platform placements per item.
- Has dedicated Stories and LinkedIn views.
- Filters by day, series and platform.
- Searches all 416 briefs.
- Copies the core script, the selected platform caption, the prompt or the full placement brief.
- Tracks status, six/seven QA checks and notes separately for each platform placement.
- Exports all 1,196 placements, one week, the 330 posts, the 60 stories or the LinkedIn set as CSV.
- Exports/imports a local progress backup.
- Contains no social credentials, publishing API or automatic scheduler.

## Publishing shape

- 11 posts/day from 07:00 to 22:00 WAT, plus a 12:30 poll story and a 21:00 desk story.
- TikTok at the slot time; Instagram +10 minutes; Facebook +20 minutes. Stories: Instagram at the slot time, Facebook +5, TikTok +10.
- Six LinkedIn posts a week at 09:00, siphoned from the same work.
- One ₦5,000 DIY pack featured per day, with two angles.
- Trend Desk placements are held until the verification log is complete.
- All 1,196 placements start Draft. The CSV is not an auto-publishing import.

See `../../marketing/PRODUCTION.md` for batch, editing, trend, QA and scheduling rules.

## The presenter

The AI presenter is the anonymous **Operator** persona — faceless founder, night desk, locked voice. Persona, delivery card and scripts: `../../marketing/AVATAR_OPERATOR.md`. Scene plates and voice samples: `../../marketing/assets/avatar/`. No real likeness is used, so no photo release is needed; every clip carries `AI presenter · Easywurld`. Never animate the fictional `client/public/demo/img/founder-recording.jpg`.

## Honesty rules

- Label every portfolio demo concept/sample.
- No invented client results, testimonials, rankings or guarantees.
- DIY packs are not custom projects; confirm current price and fulfilment.
- Disclose realistic AI presenters/voices and keep private customer information out of prompts.
- Verify trends before claiming anything is current.
- If a slot is missed, skip it rather than stacking catch-up posts.
