#!/usr/bin/env bash
# Build environment for the Easywurld asset + video pipeline.
#
# The sandbox resets Python packages between sessions, so everything the
# renderers need is installed here into a throwaway prefix outside the repo.
# Nothing in this script writes into git.
#
#   bash marketing/setup-env.sh        # install / repair
#   source marketing/setup-env.sh      # install + export EASYWURLD_* vars
#
# Provides: Pillow, reportlab, numpy, fonttools, brotli, a static ffmpeg binary,
# and the three brand fonts (Fraunces, Inter, JetBrains Mono) as real TTFs.
set -euo pipefail

ENV_DIR="${EASYWURLD_ENV_DIR:-/tmp/easywurld-env}"
VENV="$ENV_DIR/venv"
FONTS="$ENV_DIR/fonts"
NPMSRC="$ENV_DIR/fonts-src"
REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

mkdir -p "$ENV_DIR"

# ---- python ------------------------------------------------------------
if [ ! -x "$VENV/bin/python" ]; then
  python3 -m venv "$VENV"
fi
"$VENV/bin/pip" install --quiet --upgrade pip >/dev/null
"$VENV/bin/pip" install --quiet \
  Pillow reportlab numpy fonttools brotli imageio-ffmpeg >/dev/null

# ---- ffmpeg (static binary shipped inside the imageio-ffmpeg wheel) -----
FFMPEG="$("$VENV/bin/python" -c 'import imageio_ffmpeg,sys; sys.stdout.write(imageio_ffmpeg.get_ffmpeg_exe())')"
chmod +x "$FFMPEG" 2>/dev/null || true

# ---- brand fonts: npm woff2 -> ttf, axis names preserved ----------------
if [ ! -f "$FONTS/Inter[opsz,wght].ttf" ] || [ ! -f "$FONTS/Fraunces[SOFT,WONK,opsz,wght].ttf" ] || [ ! -f "$FONTS/JetBrainsMono[wght].ttf" ]; then
  mkdir -p "$NPMSRC"
  ( cd "$NPMSRC" && [ -f package.json ] || npm init -y >/dev/null )
  ( cd "$NPMSRC" && npm install --silent --no-audit --no-fund \
      @fontsource-variable/fraunces @fontsource-variable/inter @fontsource-variable/jetbrains-mono >/dev/null )
  mkdir -p "$FONTS"
  "$VENV/bin/python" - "$NPMSRC" "$FONTS" <<'PY'
import sys
from pathlib import Path
from fontTools.ttLib import TTFont

src, out = Path(sys.argv[1]) / "node_modules", Path(sys.argv[2])
wanted = [
    ("@fontsource-variable/fraunces/files/fraunces-latin-full-normal.woff2", "Fraunces[SOFT,WONK,opsz,wght].ttf"),
    ("@fontsource-variable/inter/files/inter-latin-opsz-normal.woff2",       "Inter[opsz,wght].ttf"),
    ("@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2", "JetBrainsMono[wght].ttf"),
]
for rel, name in wanted:
    p = src / rel
    if not p.exists():
        cands = sorted((src / rel.rsplit("/", 1)[0]).glob("*normal.woff2"))
        if not cands:
            raise SystemExit(f"missing font source for {name}")
        p = cands[0]
    f = TTFont(str(p))
    f.flavor = None                      # woff2 -> raw sfnt
    f.save(str(out / name))
    axes = [a.axisTag for a in f["fvar"].axes] if "fvar" in f else []
    print(f"  {name}: axes={axes}")
PY
fi

export EASYWURLD_ENV_DIR="$ENV_DIR"
export EASYWURLD_PYTHON="$VENV/bin/python"
export EASYWURLD_FFMPEG="$FFMPEG"
export EASYWURLD_FONT_DIR="$FONTS"

# Only print when executed (not sourced) so `source` stays quiet.
if [ "${BASH_SOURCE[0]}" = "$0" ]; then
  echo "env      $ENV_DIR"
  echo "python   $EASYWURLD_PYTHON"
  echo "ffmpeg   $EASYWURLD_FFMPEG"
  echo "fonts    $EASYWURLD_FONT_DIR"
  ls "$FONTS"
fi
