# Content generators

## Active source

`marketing/content-plan.json` is the only active campaign source. It contains 22 weekday posts, eight weekend tasks and explicitly optional platform reuses. The old `content/days-*.json` files are archived under `../archive/2026-10/content/` and are not read.

## Build and check

```sh
npm run content:build
npm run content:check
```

The build generates:

- `marketing/calendar/30-day-calendar.md`
- `marketing/calendar/content-calendar.csv`
- `marketing/briefs/EW-*.md`
- `marketing/MEASUREMENT.csv` (blank metrics)
- `launch-content/social-command/content_calendar.csv`
- `launch-content/social-command/MONTH_POSTS.md`
- `launch-content/social-command/EASYWURLD_POST_COMMANDER.html`
- `launch-content/social-command/MEME_BANK.md`

`build-kit.mjs` is a compatibility wrapper around `marketing/build-plan.mjs`. `build-meme-bank.mjs` now generates the two active original static posts. `validate.mjs` is a compatibility wrapper around the active validator.

The offline app's source is `shell.html` plus `app-script.js`. It has no external runtime dependency, no publishing API and fixed campaign dates. Local checkmarks are production progress, not social scheduling confirmation.

## Optional document/assets builds

- `node launch-content/social-command/build/md-to-html.mjs <file.md>` creates a Google-Docs-friendly HTML copy. This does not upload to Drive.
- `python marketing/build-pdf.py` creates `marketing/CONTENT_PLAN.pdf` (ReportLab required).
- `python marketing/build-assets.py` creates the supplied static PNGs/carousel ZIP and video layout guides (Pillow and brand fonts required). Set `EASYWURLD_FONT_DIR` if the fonts are not in the default cache.

The committed PDF and PNGs can be used without rebuilding. Do not edit generated calendar surfaces independently; edit the JSON and rebuild.

## Unchanged offer tools

`build-offers.mjs` and the existing offers prompt/booklet are separate product-reference tools. They do not define the active posting calendar. Confirm current offer details before reusing older sales copy.
