# Easywurld — 10-a-day series content system

**Active campaign:** Monday 2 November–Tuesday 1 December 2026
**Volume:** 10 core posts/day · 30 placements/day · 300 core posts · 900 platform placements
**Platforms:** TikTok, Instagram and Facebook
**Timezone:** Africa/Lagos (WAT, UTC+1)

## Start here

1. **[STRATEGY.md](./STRATEGY.md)** — why the idea works, the 10 series, formats, platform adaptation, scheduling and measurement.
2. **[SERIES_PLAYBOOK.md](./SERIES_PLAYBOOK.md)** — exact rules for each series, offer rotation, trend gate and weekly batches.
3. **[CONTENT_PLAN.pdf](./CONTENT_PLAN.pdf)** — readable strategy, dated run and all 300 briefs.
4. **[calendar/30-day-calendar.md](./calendar/30-day-calendar.md)** — editable full calendar.
5. **[calendar/content-calendar.csv](./calendar/content-calendar.csv)** — 900 placements, all starting Draft.
6. **[PRODUCTION.md](./PRODUCTION.md)** — avatar, editing, trend verification, QA and scheduling.
7. **[brand-prompt.md](./brand-prompt.md)** — master brand and AI production prompts.
8. **[SOURCES.md](./SOURCES.md)** — platform, trend and copywriting references.
9. **[TREND_VERIFICATION.csv](./TREND_VERIFICATION.csv)** — the 30 trend holds and their verification fields.
10. **[MEASUREMENT.csv](./MEASUREMENT.csv)** — 900 blank placement rows.
11. **[../launch-content/social-command/EASYWURLD_POST_COMMANDER.html](../launch-content/social-command/EASYWURLD_POST_COMMANDER.html)** — offline Series Studio for calendar, briefs, per-platform status, QA, notes and CSV export.

## What is included

- **10 daily series:** niche plan, myth court, trend desk, AI build, owner meme, offer A, copy move, industry meme, offer B, Meet Easywurld.
- **300 core posts** with hooks, scripts/slides/meme copy, CTAs, visuals, editing instructions and filled prompts.
- **900 platform placements** with three captions, times, formats and independent Draft/QA fields.
- **60 original memes**, 10 series covers, 26 Monday fallback/carousel PNGs and 4 carousel ZIPs.
- **30 dated trend teardowns** from the October 2026 research, each held until a current example and rights check are logged.
- **60 offer posts:** one pack per day, two angles, real contents, ₦5,000 price and clear DIY boundaries.
- **30 copywriting breakdowns** with attribution and original examples.
- **30 Meet Easywurld angles** in rotating formats.
- Video overlay and safe-area guides, plus production and measurement sheets.

**Not included:** a generated owner avatar, cloned voice, finished talking-head videos, live social scheduling or analytics. No verified owner photo/CV was found in the accessible repos. The portfolio founder image is fictional demo material and must not be used as the owner.

## The publishing shape

| Slot | Time | Series |
|---:|---|---|
| 1 | 07:00 | If I ran this account |
| 2 | 08:30 | Marketing Myth Court |
| 3 | 10:00 | Trend Desk |
| 4 | 11:30 | AI Automation Build |
| 5 | 13:00 | Meme: owner life |
| 6 | 14:30 | Offer Spotlight A |
| 7 | 16:00 | Steal This Copy Move |
| 8 | 17:30 | Meme: marketing / AI / clients |
| 9 | 19:00 | Offer Spotlight B |
| 10 | 20:30 | Meet Easywurld |

TikTok at the slot time, Instagram +10 minutes, Facebook +20 minutes. These are starting test times, not proven best times.

## Build commands

```bash
npm run content:build
npm run content:check
/home/user/.venv/bin/python marketing/build-pdf.py
/home/user/.venv/bin/python marketing/build-assets.py
node launch-content/social-command/build/md-to-html.mjs launch-content/social-command/README.md ...
```

`content:build` expands `marketing/series-plan.json` into `marketing/content-plan.json`, CSV, briefs, calendar, metrics, trend log and the offline app. `content:check` validates counts, copy, captions, offers, trends, CSV, app, documents and starter assets.

## Volume warning

Ten a day only works if each slot has a distinct job. Do not turn it into ten generic tips or ten sales posts. One offer per day, two angles. Two original memes. Trend claims verified. AI reviewed. If QA fails, hold the slot rather than stacking catch-up content.

No social account is connected here. Nothing has been scheduled or published.
