# Easywurld content file index

**Repository index only.** This update does not upload to or verify Google Drive. Copy the active files to your production storage if that is your workflow; do not assume an existing Drive folder is in sync.

## Active campaign

Monday 2 November–Tuesday 1 December 2026. **330 content posts, 60 stories, 26 LinkedIn posts and 1,196 platform placements — 11 posts and 2 stories a day on TikTok, Instagram and Facebook.**

| Need | Repository file |
|---|---|
| Strategy | `marketing/STRATEGY.md` |
| Series rules | `marketing/SERIES_PLAYBOOK.md` |
| Psychology layer | `marketing/PSYCHOLOGY_PLAYBOOK.md` |
| The Operator (AI presenter) | `marketing/AVATAR_OPERATOR.md` |
| Readable full plan | `marketing/CONTENT_PLAN.pdf` |
| Editable calendar | `marketing/calendar/30-day-calendar.md` |
| Production/distribution sheet | `launch-content/social-command/content_calendar.csv` |
| Offline Series Studio | `launch-content/social-command/EASYWURLD_POST_COMMANDER.html` |
| Individual briefs | `marketing/briefs/` — 330 posts, 60 stories, 26 LinkedIn posts |
| Story frames (week 1) | `marketing/assets/stories/` |
| Meme scene plates | `marketing/assets/meme-scenes/` |
| Operator plates and voice | `marketing/assets/avatar/` |
| AI/master prompts | `marketing/brand-prompt.md` |
| Editing and scheduling | `marketing/PRODUCTION.md` |
| Source and attributions | `marketing/SOURCES.md` |
| 60 memes | `marketing/assets/memes/` |
| Carousels (all month) | `marketing/assets/carousels/` — 605 JPEG slides + 5 LinkedIn PDFs |
| Story frames (all month) | `marketing/assets/stories/` — 180 frames |
| Video posters (fallbacks) | `marketing/assets/fallbacks/` |
| Intro statics | `marketing/assets/static/` |
| Every asset, item by item | `marketing/assets/ASSET_MANIFEST.csv` |
| Scheduling runbook | `marketing/SCHEDULING_RUNBOOK.md` |
| Series covers | `marketing/assets/series/` |
| Video layout guides | `marketing/assets/video/` |
| Trend verification log | `marketing/TREND_VERIFICATION.csv` |
| Blank metrics | `marketing/MEASUREMENT.csv` |
| Canonical editorial source | `marketing/series-plan.json` |
| Expanded generated plan | `marketing/content-plan.json` |

## Keep private

Owner identity sources, CVs, consent records, payment details and customer messages do not belong in this public repo. No verified owner portrait was found; no avatar or voice clone has been generated.

## Archived, not active

- `marketing/archive/22-post-2026-11/`: the superseded 22-post weekday plan and its starter assets.
- `launch-content/archive/2026-10/`: old daily scripts, posting ZIP, launch PDFs and spreadsheet.
- `launch-content/social-command/archive/2026-10/content/`: old 1,140-row source plan.

The existing offers prompt and offer booklet remain in `launch-content/social-command/`. They are product reference materials, not a second active calendar.

## November by-day packs (added 2 November 2026)

Google Drive folder: **Easywurld — November 2026 (by day)** — three ten-day zips
(`Easywurld_November_Days_01-10/11-20/21-30.zip`), each holding `Day_XX/` folders with the
day sheet, the seven LinkedIn posts, the 33 feed captions, the two stories and every
rendered file for that day. Built by `python marketing/build-day-packs.py`; index inside
the folder: `DRIVE_INDEX`.

LinkedIn is now **seven posts a day** — four on the Easywurld company page (07:30 document,
10:30 text, 13:30 image, 17:00 native video) and three on Abu Israel's personal profile
(08:15 build log, 12:45 operator's note, 19:45 evening take; Monday document, Saturday
poll, Friday video). 210 posts across the month, copy in `marketing/linkedin.mjs`.

Finished videos: `marketing/assets/video-ready/` — Days 1–2 are complete (voiceover,
synthesised music bed, burned captions, effects, end card; upload as is). The pipeline and
the ten-clip narration batching rule: `marketing/VIDEO_PIPELINE.md`.
