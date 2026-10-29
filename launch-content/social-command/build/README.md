# Social Command build files

`marketing/series-plan.json` is the canonical editorial source. `marketing/build-plan.mjs` expands it into 300 core posts and 900 placements, then writes:

- `marketing/content-plan.json` (generated data)
- `marketing/calendar/30-day-calendar.md` and `content-calendar.csv`
- `marketing/briefs/EW-Dxx-Sxx.md`
- `marketing/MEASUREMENT.csv` and `TREND_VERIFICATION.csv`
- `../content_calendar.csv`, `../MONTH_POSTS.md`
- `../EASYWURLD_POST_COMMANDER.html`

## Files

| File | Purpose |
|---|---|
| `shell.html` | Offline app shell and styling |
| `app-script.js` | Series Studio: day calendar, filters, briefs, per-platform status/QA, weekly batches, CSV/backup export |
| `build-kit.mjs` | Compatibility wrapper that runs the active marketing builder |
| `build-meme-bank.mjs` | Generates `MEME_BANK.md` from the 60 meme posts |
| `validate.mjs` | Compatibility wrapper that runs the active marketing validator |
| `kit-dates.mjs` | Compatibility date helpers for older scripts |
| `md-to-html.mjs` | Converts kit Markdown to Google-Docs-friendly HTML |

## Commands

```bash
npm run content:build
npm run content:check
node launch-content/social-command/build/build-meme-bank.mjs
node launch-content/social-command/build/md-to-html.mjs launch-content/social-command/README.md
```

## App behaviour

- State key: `easywurld-series-v4`, scoped to the campaign start date.
- Per-placement status/QA/notes; not one status for all three platforms.
- Export/import backup contains no credentials.
- No network request, social API, analytics connection or auto-publishing.
- The app is generated with the plan embedded; rebuild it after changing the source.

## Tests

The repository’s validation checks the source syntax, embedded data, counts, captions and documented deliverables. Do not claim analytics or scheduling results based on this offline app.
