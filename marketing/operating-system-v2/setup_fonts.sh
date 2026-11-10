#!/usr/bin/env bash
# Build the three brand typefaces into fixed-weight, glyph-complete TTFs for Pillow.
#
# Why this exists (and why it is not the old fetch-into-$HOME script):
#   1. fontsource splits each family into subsets. `latin` has the digits but NOT the naira
#      sign; `latin-ext` has U+20A6 but NOT the digits. Using either alone renders ₦ as an
#      empty box on every price slide. So we MERGE latin + latin-ext per weight.
#   2. `~/.cache` is wiped between sessions here. Fonts live in the repo so a rebuild works
#      offline and a rendered file can always be traced back to the exact face used.
#
# Output: marketing/operating-system-v2/fonts/{Fraunces,Inter,JetBrainsMono}-{400,600,700}.ttf
#         marketing/operating-system-v2/fonts/OFL.txt   (licence text, all three families)
#
# All three families are SIL Open Font License 1.1: commercial use, embedding in exported
# graphics and redistribution are permitted. See research-2026-11-10/06_FONT_LICENCE.md.
#
# Usage:  bash marketing/operating-system-v2/setup_fonts.sh
# Needs:  npm, python3 with fonttools + brotli
set -euo pipefail

OUT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/fonts"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT
mkdir -p "$OUT"

echo "fonts -> $OUT"
cd "$WORK"

for pkg in fraunces inter jetbrains-mono; do
  npm pack --silent "@fontsource/$pkg" >/dev/null
  mkdir -p "ex-$pkg"
  tar xzf "fontsource-$pkg"-[0-9]*.tgz -C "ex-$pkg"
  for w in 400 600 700; do
    for sub in latin latin-ext; do
      src="ex-$pkg/package/files/$pkg-$sub-$w-normal.woff2"
      [ -f "$src" ] && cp "$src" .
    done
  done
  # Keep the licence text that ships with the package.
  [ -f "ex-$pkg/package/LICENSE" ] && cp "ex-$pkg/package/LICENSE" "LICENCE-$pkg.txt"
done

# Merge the two subsets per family/weight, then subset to the characters the slides use.
# Merging is required because neither subset alone covers digits + ₦.
python3 - "$OUT" <<'PY'
import sys, shutil
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.merge import Merger

out = Path(sys.argv[1])
FAMILIES = [('fraunces', 'Fraunces'), ('inter', 'Inter'), ('jetbrains-mono', 'JetBrainsMono')]
WEIGHTS = (400, 600, 700)
NAIRA = 0x20A6

for src, stem in FAMILIES:
    for weight in WEIGHTS:
        latin = Path(f'{src}-latin-{weight}-normal.woff2')
        latin_ext = Path(f'{src}-latin-ext-{weight}-normal.woff2')
        if not latin.exists():
            raise SystemExit(f'missing {latin}')
        # Decompress woff2 -> ttf so the merger can read both.
        parts = []
        for p in (latin, latin_ext):
            if not p.exists():
                continue
            f = TTFont(str(p))
            f.flavor = None
            t = Path(f'{p.stem}.ttf')
            f.save(str(t))
            parts.append(str(t))
        # Merger takes file paths and combines cmaps and glyph outlines. latin goes first so
        # ASCII/digits are authoritative; latin-ext contributes ₦ and the extended punctuation.
        merged = Merger().merge(parts) if len(parts) > 1 else TTFont(parts[0])
        dst = out / f'{stem}-{weight}.ttf'
        merged.flavor = None
        merged.save(str(dst))
        print(f'  {dst.name}')

# Hard gate: every face must carry digits and the punctuation the slides use. The naira sign
# is required in the serif and sans faces only — JetBrains Mono ships no U+20A6 in ANY subset
# (checked latin, latin-ext, vietnamese, cyrillic-ext across all weights). So mono is never
# allowed to draw a price. The renderer enforces that with an assert; this script proves why.
NAIRA = 0x20A6
COVERAGE = ('0123456789' + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
            'abcdefghijklmnopqrstuvwxyz.,;:!?()[]%\u2019\u2018\u201c\u201d\u2013\u2014\u00b7\u2026/&+-')
NAIRA_REQUIRED = {'Fraunces', 'Inter'}
for src, stem in FAMILIES:
    for weight in WEIGHTS:
        path = out / f'{stem}-{weight}.ttf'
        if not path.exists():
            raise SystemExit(f'MISSING FACE {path.name}')
        cmap = TTFont(str(path)).getBestCmap()
        missing = [c for c in COVERAGE if ord(c) not in cmap]
        if missing:
            raise SystemExit(f'{path.name} is missing {missing!r} — do not render with it')
        has_naira = NAIRA in cmap  # cmap keys are code points, not characters
        if stem in NAIRA_REQUIRED and not has_naira:
            raise SystemExit(f'{path.name} must carry the naira sign (U+20A6) but does not')
        if stem not in NAIRA_REQUIRED and has_naira:
            raise SystemExit(f'{path.name} unexpectedly has U+20A6 — update the renderer rule')
print('digits present in all 9 faces; naira sign present in Fraunces + Inter, '
      'absent by design in JetBrains Mono')
PY

# One combined licence file, with the per-family copyright lines kept intact.
{
  echo "Typefaces bundled: Fraunces, Inter, JetBrains Mono."
  echo "All three are licensed under the SIL Open Font License, Version 1.1."
  echo "The files below are unmodified-weight instances derived from the upstream Google Fonts"
  echo "builds, redistributed by the @fontsource npm packages. Subsets merged so that digits and"
  echo "the naira sign (U+20A6) are present. Reserved font names are not renamed."
  echo
  for f in LICENCE-*.txt; do
    echo "================================================================"
    echo "# ${f#LICENCE-}"
    echo "================================================================"
    cat "$f"
    echo
  done
} > "$OUT/OFL.txt"

echo "done. verify with: python3 marketing/operating-system-v2/check.py"
