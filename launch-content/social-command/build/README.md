# Social kit — build scripts

These are the generators for the Easywurld content kit. They are source code,
not build output, so `.gitignore` has a rule that keeps this folder tracked.

Everything is driven by `content/days-*.json`, which is the source of truth for
the words. Edit the JSON, run the generator, and every output stays in step.

## The scripts

| Script | What it does | Writes |
|---|---|---|
| `kit-dates.mjs` | The shared calendar. One `START_DATE` drives everything. | — |
| `build-kit.mjs` | The main generator. | `EASYWURLD_POST_COMMANDER.html`, `MONTH_POSTS.md`, `content_calendar.csv` |
| `build-meme-bank.mjs` | Collects every Meme post into one file. | `MEME_BANK.md` |
| `build-offers.mjs` | Turns the offers markdown into the branded A4 document. | `EASYWURLD_OFFERS_MASTER.html` |
| `md-to-html.mjs` | Markdown to the HTML that uploads cleanly into Google Docs. | every `*.doc.html` |
| `validate.mjs` | Checks the plan before it ships. | — |

`app-script.js` and `shell.html` are the phone app itself, kept separate so
the app logic can be edited without touching the layout.

## Running them

From the repo root:

```bash
node launch-content/social-command/build/build-kit.mjs
node launch-content/social-command/build/build-meme-bank.mjs
node launch-content/social-command/build/build-offers.mjs
node launch-content/social-command/build/md-to-html.mjs
node launch-content/social-command/build/validate.mjs
```

`validate.mjs` prints `ALL CHECKS PASS` and exits 0 when the plan is sound. It
fails on a wrong day count, a missing platform version, banned AI wording,
invented proof, a wrong WhatsApp link or price, and a built app that does not
parse.

## Changing the start date

`START_DATE` in `kit-dates.mjs` is the Monday the plan begins. Change it and
rebuild: the app, the month document and the calendar CSV all shift together.
The dates in `content/days-*.json` are not stored — they are computed, so
nothing can fall out of step.

## Adding a day

1. Add the day's posts to a `content/days-XX-YY.json` file, or create a new
   one. The filename pattern is `days-<first>-<last>.json` or `days-<n>.json`.
2. Each post needs `id`, `type`, `topic`, `why`, and the platform versions
   `tiktok`, `instagram`, `facebook`, `linkedin`.
3. Run `build-kit.mjs` and then `validate.mjs`.

The validator expects 11 posts a day and 5 LinkedIn posts a day (4 fixed slots
plus one optional). The slot times are assigned by the order of the posts in
the day, so the `fmt` string inside each LinkedIn version has to match the
slot it lands in.
