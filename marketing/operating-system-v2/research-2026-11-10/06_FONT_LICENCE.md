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

That fetches the three packages with `npm pack`, copies `*-latin-{400,600,700}-normal.woff2` into
`~/.cache/easywurld-fonts`, and converts each to a fixed-weight `.ttf` with `fontTools`, because Pillow cannot read
`woff2` directly. `EASYWURLD_FONT_DIR` overrides the cache location.

The fonts are **not committed** to the repository. They are fetched on demand into the cache directory, which is
covered by the existing ignore conventions for generated and external files. That keeps the repository from
carrying third-party binaries it does not need to own.

## What is still open

| Item | State |
|---|---|
| Logo | Slides use the repo mark at `client/public/brand/`. **Confirm you hold the mark.** |
| Canva Sans | Referenced in the older v2 brief and in the draft day-file headers. **Not used in these renders**, and not covered by this record. If it is ever used, its licence must be checked separately — it is a commercial font, not an OFL one. |
| Photography / likeness | No photography appears in these carousels; they are typographic. Nothing to clear today. |
| Music | Still deferred. See `04_MUSIC_AND_RIGHTS_NOTE.md`. These carousels are silent. |

**Snapshot:** licences checked 2026-11-10. An OFL grant does not expire or need renewal, so this row does not need
the refresh cadence that platform policies do — but if a family is swapped, add a new row rather than editing this one.
