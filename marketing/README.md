# Easywurld — strategy-first content plan

**Active campaign: Monday 2 November–Tuesday 1 December 2026**
**22 main weekday posts · 4 formats · 8 weekend review/batch days · Lagos time (WAT)**

## Start here

1. **[STRATEGY.md](./STRATEGY.md)** — audience, positioning, pillars, format roles, CTAs, measurement and trust rules.
2. **[CONTENT_PLAN.pdf](./CONTENT_PLAN.pdf)** — the readable strategy, dated calendar and complete production briefs.
3. **[calendar/30-day-calendar.md](./calendar/30-day-calendar.md)** — the same plan in editable Markdown.
4. **[calendar/content-calendar.csv](./calendar/content-calendar.csv)** — 22 primary rows plus 31 clearly marked optional platform reuses.
5. **[PRODUCTION.md](./PRODUCTION.md)** — avatar setup, CapCut editing, weekly batches and manual scheduling.
6. **[brand-prompt.md](./brand-prompt.md)** — master brand, AI talking-head and format prompts.
7. **[../launch-content/social-command/EASYWURLD_POST_COMMANDER.html](../launch-content/social-command/EASYWURLD_POST_COMMANDER.html)** — offline strategy/calendar/brief viewer with copy buttons, QA checks and local notes.

## What is included

- 10 AI talking-head scripts with filled prompts, shot order, captions and non-avatar fallbacks.
- 5 screen-demo briefs using actual portfolio samples or the new calendar.
- 5 five-slide carousels with exact copy.
- 2 original relatable static posts.
- A Monday carousel ZIP, two static PNGs and transparent video-layout guides in [assets/launch-week/](./assets/launch-week/).
- 22 individual [production briefs](./briefs/).
- A blank [measurement sheet](./MEASUREMENT.csv).

**Not included:** a generated owner avatar, cloned voice, finished talking-head videos or a live social scheduling connection. No verified personal photo/CV was found in the accessible repos. The portfolio's founder photo is fictional demo material and must not be used as the owner.

## The publishing shape

One main post each weekday at **18:30 WAT**. This is a test slot, not a proven best time. Weekends are for replies, review and production. Instagram reuse is optional; eight Facebook and eight LinkedIn copy suggestions are selective, not extra daily obligations.

The CSV and offline app are planning tools. They do not auto-publish. Every row starts **Draft**. Mark Scheduled only after a real platform confirms the queue.

## Source of truth and rebuilding

`content-plan.json` drives the active calendar, CSV, briefs, measurement rows and offline app.

```sh
npm run content:build
npm run content:check
```

The legacy October calendars and daily scripts are retained under `launch-content/archive/2026-10/` and `launch-content/social-command/archive/2026-10/`. They are references only, not the active schedule.

To regenerate the supplied static PNGs, install Pillow and provide the brand fonts through `EASYWURLD_FONT_DIR`, then run `python marketing/build-assets.py`. To regenerate the readable PDF, run `python marketing/build-pdf.py` with Pillow and ReportLab installed. The committed assets and PDF do not require those tools to read.

## Accuracy and privacy

The current website source lists nine DIY packs at ₦5,000 each. Confirm current price, contents, payment and delivery before a sales post. All portfolio examples are concept/sample work. No invented testimonials, rankings, client results or campaign metrics are used.

Keep private identity sources, CVs, voice permissions, payment details and customer records out of this public repository. This folder is outside `client/public` and is not included in the website build.
