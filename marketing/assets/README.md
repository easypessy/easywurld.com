# Full-month asset kit

Rendered from `marketing/series-plan.json` → `content-plan.json`. Every image is a production graphic, not a published post: every CSV/app placement still starts Draft.

## What is rendered

- `carousels/`: 121 carousels as five 1080×1350 JPEGs each, uploaded in slide order.
- `linkedin/`: 35 LinkedIn document-post PDFs — four a day on the Easywurld company page, three a day on Abu Israel's personal profile.
- `video-ready/`: finished vertical MP4s (voiceover + music bed + burned captions + effects). Anything not here yet has a poster in `fallbacks/`.
- `stories/`: 60 stories × 3 frames at 1080×1920 (Instagram, then Facebook +5 min, TikTok +10 min).
- `memes/`: 60 scene-led meme JPEGs — photograph first, small two-line caption in the lower third.
- `meme-scenes/`: the eight 4:5 photograph plates the memes and desk scenes are built from.
- `static/`: 8 single-image posts (the intro statics).
- `fallbacks/`: 141 posters for the video slots. Use one if a clip is not ready, and keep the AI label honest.
- `series/`: 11 series cover cards.
- `avatar/`: the Operator plates and voice samples (hand-produced, not overwritten by this script).
- `video/`: disclosure overlay and safe-area guide.
- `ASSET_MANIFEST.csv`: every post and story → expected file(s), whether it is rendered, and what is left to produce.

## Rules

- Upload carousel slides in numeric order; slide 1 is the cover.
- Every clip with a synthetic presenter or voice carries `AI presenter · Easywurld` and the platform AI setting.
- Trend Desk posters say **HOLD**: complete `marketing/TREND_VERIFICATION.csv` or publish only as a dated teardown with live-trend wording removed.
- Confirm the ₦5,000 price, pack contents and fulfilment before publishing any offer post.
- Regenerate with `bash marketing/setup-env.sh && EASYWURLD_FONT_DIR=/tmp/easywurld-env/fonts /tmp/easywurld-env/venv/bin/python marketing/build-assets.py` after `npm run content:build`.
