# Video pipeline — from plan to a postable MP4, no editor

`marketing/build-video.py` turns a video slot in `content-plan.json` into a finished,
ready-to-post vertical video. Nothing is left for a human editor: the voiceover, the
background soundtrack, the effects and the captions are all in the file.

## What one render contains

| Layer | How it is produced |
|---|---|
| **Voiceover** | `post.voScript` — the narration written in plain Nigerian English by `marketing/voice.mjs`, spoken by the owner-selected voice into `marketing/render/vo/<ID>.mp3`. The voice direction lives in `series-plan.json → voice`. |
| **Background soundtrack** | Synthesised at render time by `music_bed()`: an Am–F–C–G pad, muted kick on 1 and 3, brushed hats, a bass root and a faint tape floor. No licensed track, so nothing to clear. It is sidechain-ducked under the voice and the whole mix is loudness-normalised to −15 LUFS. |
| **Picture** | Brand-owned plates only: the slot's on-brand poster, the Operator scene plates, the series cover or a photograph plate — each composited into a 1080×1920 frame with the wordmark, the series label and the AI disclosure chip, then animated with alternating Ken Burns moves. |
| **Transitions / effects** | Cross-dissolves between scenes, fade in from black, fade out, light film grain, a warm colour balance, a mild vignette, and a slow grade. |
| **Captions** | `post.voLines` — the narration split into 3–8 word chunks — burned in with ASS subtitles in Inter, sentence-cased, timed proportionally to word count with a beat added at every `[pause]`. |
| **End card** | The single CTA in Fraunces, the WhatsApp keyword as a button, the site, and the disclosure chip again. |

Output: `marketing/assets/video-ready/<ID>.mp4`, 1080×1920, H.264 + AAC, `+faststart`,
roughly 30 s and 6 MB. The same file is used for TikTok, Instagram, Facebook **and**
LinkedIn — no separate cut to make.

## Commands

```bash
bash marketing/setup-env.sh                 # venv, fonts, static ffmpeg (each session)
python marketing/build-video.py --missing   # what still needs a narration file
python marketing/build-video.py --day 1     # every narrated slot on a day
python marketing/build-video.py --only EW-D01-S02
python marketing/build-video.py --days 3-7
```

A slot with no narration file is **skipped, never guessed**: its on-brand poster in
`assets/fallbacks/` is the honest fallback and is listed as such in
`assets/ASSET_MANIFEST.csv`.

## The one thing that cannot be bulk-produced

Narration comes from the voice tool, which allows **ten clips per session**. That is the
only rate limit in the pipeline; everything else renders as fast as the machine allows.
So the month is narrated in ten-clip batches:

1. `node marketing/build-plan.mjs` writes `voScript` / `voTts` / `voLines` for all 141 video slots.
2. Ten `voTts` scripts are spoken into `marketing/render/vo/<ID>.mp3`.
3. `python marketing/build-video.py --pending` renders every slot whose narration is newer
   than its MP4 (`--days N-M` and `--only ID1,ID2` also work).
4. `python marketing/build-assets.py` refreshes the manifest so the MP4s read as rendered.
5. `python marketing/build-day-packs.py --days N-M --no-decade` re-packs only the days that
   changed and writes `render/packs/day-zips/Day_XX.zip` for each of them.
6. Upload just those `Day_XX.zip` files into Drive **SET_B__Upgraded_content_PER_DAY**,
   replacing the same-named file. **SET_A is the original delivery and is never touched.**

Days 1-4 are done (20 finished videos). The remaining 121 slots are thirteen more
batches; nothing about a finished file changes except which narration it carries.

## Honesty rules the pipeline enforces

- Every clip with a synthetic presenter or voice carries the disclosure chip **and** the
  platform AI setting note in the day sheet.
- Trend Desk clips keep the "dated teardown, not a live trend claim" line in the
  narration until `TREND_VERIFICATION.csv` has a current example.
- AI Build clips say "labelled sample build, not a client result" in the narration.
- No stock people, no owner likeness, no invented numbers. The Operator stays faceless.

## Where the files live

- `marketing/assets/video-ready/` is committed to the repository so the manifest's
  "rendered" state travels with the plan.
- **Amended threshold: keep committing until the month is delivered, then prune.** On
  2 November the workspace rolled back to the base commit between turns four separate
  times; each time the only thing that survived intact was what git held — `marketing/render/`
  (narrations, packs, zips) was wiped and rebuilt, while every committed MP4 came back.
  Finished videos cannot be re-downloaded from Drive either (this sandbox has no route to
  the Drive API for downloads), so until Day 30 is delivered git is the only recoverable
  copy and Drive is the delivery copy. At ~285 MB (50 clips) this still holds.
  Once the month is complete and Drive holds every day zip, prune the folder out of the
  branch tip (`.gitignore` + `git rm --cached`) so the merged history does not carry ~700 MB
  of binary for no editorial benefit. The day packs and the Drive zips are rebuilt from
  `marketing/render/packs/` either way.
- **Batch shape follows the day, not a fixed count.** A day carries five or six video slots
  (the sixth is the Meet Easywurld intro on some days), and the narration tool allows ten
  clips per turn — so a batch is normally one full day plus most of the next, and the
  leftover slot opens the following batch. `--pending` renders whatever has a narration, so
  nothing is lost when a batch splits mid-day.
