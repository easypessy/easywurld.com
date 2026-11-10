#!/usr/bin/env bash
# Fetch the three brand typefaces and convert them to fixed-weight TTFs for Pillow.
#
# All three are SIL Open Font License 1.1, so commercial use and embedding in exported
# graphics is permitted. See research-2026-11-10/06_FONT_LICENCE.md.
#
# Usage:  bash marketing/operating-system-v2/setup_fonts.sh
# Needs:  npm, python3 with fonttools + brotli (pip install fonttools brotli)
set -euo pipefail

FONT_DIR="${EASYWURLD_FONT_DIR:-$HOME/.cache/easywurld-fonts}"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT
mkdir -p "$FONT_DIR"

echo "fonts -> $FONT_DIR"
cd "$WORK"

for pkg in fraunces inter jetbrains-mono; do
  npm pack --silent "@fontsource/$pkg" >/dev/null
  mkdir -p "ex-$pkg"
  tar xzf "fontsource-$pkg"-*.tgz -C "ex-$pkg"
  for w in 400 600 700; do
    src="ex-$pkg/package/files/$pkg-latin-$w-normal.woff2"
    [ -f "$src" ] && cp "$src" "$FONT_DIR/"
  done
done

# woff2 cannot be read by Pillow, and the fontsource files are single-weight instances
# rather than variable fonts, so the axes code in the older renderers does not apply here.
python3 - "$FONT_DIR" <<'PY'
import sys
from pathlib import Path
from fontTools.ttLib import TTFont

font_dir = Path(sys.argv[1])
for src, stem in [('fraunces', 'Fraunces'), ('inter', 'Inter'),
                  ('jetbrains-mono', 'JetBrainsMono')]:
    for weight in (400, 600, 700):
        woff2 = font_dir / f'{src}-latin-{weight}-normal.woff2'
        if not woff2.exists():
            continue
        font = TTFont(str(woff2))
        font.flavor = None
        font.save(str(font_dir / f'{stem}-{weight}.ttf'))
        print(f'  {stem}-{weight}.ttf')
PY

echo "done. verify with: python3 marketing/operating-system-v2/build_delivery.py"
