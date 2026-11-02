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
3. `python marketing/build-video.py --days N-M` renders that batch to finished MP4s.
4. `python marketing/build-assets.py` refreshes the manifest so the MP4s read as rendered.
5. `python marketing/build-day-packs.py` re-packs the day folders and the Drive zips.

Days 1–2 are done (10 finished videos). The remaining 131 slots are fourteen more
batches; nothing about a finished file changes except which narration it carries.

## Honesty rules the pipeline enforces

- Every clip with a synthetic presenter or voice carries the disclosure chip **and** the
  platform AI setting note in the day sheet.
- Trend Desk clips keep the "dated teardown, not a live trend claim" line in the
  narration until `TREND_VERIFICATION.csv` has a current example.
- AI Build clips say "labelled sample build, not a client result" in the narration.
- No stock people, no owner likeness, no invented numbers. The Operator stays faceless.

## Where the files live

- `marketing/assets/video-ready/` is committed to the repository while it is small
  (Days 1–2, ~53 MB) so the manifest's "rendered" state travels with the plan.
- **Once the folder passes roughly 150 MB, add it to `.gitignore`** and let Google Drive
  carry the finished files: 141 finished videos would put ~700 MB of binary into git
  history for no editorial benefit. The day packs and the Drive zips are rebuilt from
  `marketing/render/packs/` either way.
