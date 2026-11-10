# 06 — Font licence record

**Status: RESOLVED.** This closes half of the `REPO-01` unknown — the typeface question. It does not touch
the logo, photography or likeness questions, which stay open.

Register row: `REPO-03`.

## What the rendered assets use

| Family | Role in the slides | Weights used | Licence |
|---|---|---|---|
| **Fraunces** | Serif headlines, the "EASYWURLD" wordmark in the footer, the ghosted slide numeral | 400, 600, 700 | SIL Open Font License 1.1 |
| **Inter** | Body copy | 400, 600, 700 | SIL Open Font License 1.1 |
| **JetBrains Mono** | Series kickers, post IDs, footer line, slide counters | 400, 600, 700 | SIL Open Font License 1.1 |

These match the live site: `client/index.html` loads Fraunces, Inter and JetBrains Mono from Google Fonts, and
`client/src/index.css` sets them as `--fh`, `--fb` and the mono face. The exported graphics therefore use the same
type system as the website rather than the Lora/Canva Sans pair referenced in the older v2 brand brief.

## Why this is settled and not a guess

The SIL Open Font License 1.1 permits use, study, modification and **redistribution**, including embedding in
documents and graphics, and explicitly permits commercial use. It does not require attribution in the artwork and
does not restrict selling a product that uses the font. The obligations are about the font *software*: do not sell
the fonts by themselves, and do not use the reserved font names for modified versions.

The files were obtained from the `@fontsource` npm packages, which redistribute the upstream Google Fonts builds,
and each package carries the OFL text in its `LICENSE`. Copyright lines read:

- Fraunces — "Copyright 2020 The Fraunces Project Authors (github.com/undercasetype/Fraunces)"
- Inter — "Copyright 2016 The Inter Project Authors (https://github.com/rsms/inter)"
- JetBrains Mono — "Copyright 2020 The JetBrains Mono Project Authors (https://github.com/JetBrains/JetBrainsMono)"

## Reproduction

```bash
bash marketing/operating-system-v2/setup_fonts.sh
```

That fetches the three packages with `npm pack`, builds the faces with `fontTools`, and writes them to
`marketing/operating-system-v2/fonts/`, next to this record. Pillow cannot read `woff2`, so each face is converted
to a fixed-weight `.ttf`.

### Why the pipeline changed: the naira sign

The first version of this script fetched only the `latin` subsets into `~/.cache`. That produced slides where
**₦ rendered as an empty box**. fontsource splits each family into subsets, and they do not overlap the way you
would assume:

| Subset | Digits | ₦ (U+20A6) |
|---|---|---|
| `latin` | yes | **no** |
| `latin-ext` | **no** | yes |

Neither subset alone can render a price. The script now **merges `latin` + `latin-ext`** per weight, so one face
carries both the digits and the naira sign. It then asserts, for every face, that digits are present and — for
Fraunces and Inter only — that U+20A6 is present. JetBrains Mono has no ₦ in *any* subset (checked across
`latin`, `latin-ext`, `vietnamese` and `cyrillic-ext`), so monospace type is never used to draw a price; the
renderer asserts this at import time rather than trusting it.

The fonts are now **committed** at `marketing/operating-system-v2/fonts/`, together with the combined OFL text at
`fonts/OFL.txt`. Two reasons: `~/.cache` is wiped between sessions, which silently broke a rebuild, and a rendered
JPEG should be traceable to the exact face that produced it without a network fetch. The whole set is under 1 MB.

The faces are unmodified in outline. Subsets are merged and the reserved font names are not renamed, which is what
OFL 1.1 permits; the licence text travels in `fonts/OFL.txt` and in each fontsource package.

## What is still open

| Item | State |
|---|---|
| Logo | Slides use the repo mark at `client/public/brand/`. **Confirm you hold the mark.** |
| Canva Sans | Referenced in the older v2 brief and in the draft day-file headers. **Not used in these renders**, and not covered by this record. If it is ever used, its licence must be checked separately — it is a commercial font, not an OFL one. |
| Photography / likeness | No photography appears in these carousels; they are typographic. Nothing to clear today. |
| Music | Still deferred. See `04_MUSIC_AND_RIGHTS_NOTE.md`. These carousels are silent. |
| Naira glyph | **Resolved.** Present in Fraunces and Inter; `setup_fonts.sh` fails the build if it ever disappears. |

**Snapshot:** licences checked 2026-11-10. An OFL grant does not expire or need renewal, so this row does not need
the refresh cadence that platform policies do — but if a family is swapped, add a new row rather than editing this one.
