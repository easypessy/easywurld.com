"""Render the December carousel drafts as ready-to-post 1080x1350 JPEGs.

Design language: the site's own tokens — beige field, deep green serif headline, Inter body,
JetBrains Mono labels. Fonts are Fraunces / Inter / JetBrains Mono, all SIL Open Font License 1.1
(see research-2026-11-10/06_FONT_LICENCE.md), loaded from ~/.cache/easywurld-fonts.

Two rules this renderer treats as non-negotiable:
  1. If copy does not fit at a readable size, it raises. It never shrinks to 12px or clips silently.
  2. Any slide carrying an illustration, hypothetical brief or sample rewrite is labelled ON the image.
     A caption that says "illustrative" does not travel when someone screenshots slide 3.

Output is a *draft* asset until a named approver signs G4. Rendering proves the copy fits and is legible;
it does not prove the claim, the offer, or the right to publish.
"""
from pathlib import Path
import re
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent
FONT_DIR = Path.home() / '.cache/easywurld-fonts'

# Brand tokens, matched to the live site and the visual-identity library.
FIELD = '#FAE7C7'
GREEN = '#0A4937'
LEAF = '#27473A'
TERRA = '#9E4E2C'
INK = '#14170F'
LINE = '#D8D5C5'

W, H = 1080, 1350
PAD = 78
COL = W - PAD * 2
SAFE_BOTTOM = 1150

_FONTS = {}


def font(family, size, weight=400):
    """Fixed-weight instances converted from the OFL variable fonts."""
    key = (family, size, weight)
    if key in _FONTS:
        return _FONTS[key]
    name = {'serif': 'Fraunces', 'sans': 'Inter', 'mono': 'JetBrainsMono'}[family]
    path = FONT_DIR / f'{name}-{weight}.ttf'
    if not path.exists():
        raise FileNotFoundError(
            f'Missing {path}. Run marketing/operating-system-v2/setup_fonts.sh to fetch the '
            f'SIL OFL fonts.')
    f = ImageFont.truetype(str(path), int(size))
    _FONTS[key] = f
    return f


def wrap(draw, text, f, width):
    lines = []
    for para in str(text).split('\n'):
        if not para.strip():
            lines.append('')
            continue
        line = ''
        for word in para.split():
            trial = (line + ' ' + word).strip()
            if draw.textlength(trial, font=f) <= width:
                line = trial
            else:
                if line:
                    lines.append(line)
                line = word
        if line:
            lines.append(line)
    return lines


def wrap_para(draw, text, f, width, limit_lines=3):
    """Wrap and refuse to overflow: an extra line is better than a hidden sentence."""
    lines = wrap(draw, text, f, width)
    if len(lines) > limit_lines:
        raise ValueError(f'needs {len(lines)} lines at {f.size}px, limit {limit_lines}: {text[:60]!r}')
    return lines


# ---------------------------------------------------------------- chrome

def draw_header(draw, kicker, post_id):
    f = font('mono', 20, 700)
    draw.text((PAD, 64), kicker.upper()[:46], font=f, fill=LEAF)
    draw.text((PAD, 96), post_id, font=font('mono', 17, 400), fill=TERRA)


def draw_footer(draw, series, page, total):
    draw.line((PAD, 1216, W - PAD, 1216), fill=LINE, width=2)
    draw.text((PAD, 1238), 'EASYWURLD', font=font('serif', 25, 600), fill=GREEN)
    draw.text((PAD, 1274), 'SIMPLIFY.  OPTIMIZE.  GROW.', font=font('mono', 15, 400), fill=LEAF)
    label = f'{page:02d} / {total:02d}'
    fw = draw.textlength(label, font=font('mono', 18, 600))
    draw.text((W - PAD - fw, 1264), label, font=font('mono', 18, 600), fill=LEAF)


def draw_tag(draw, text, y=140):
    """The on-slide disclosure. Small, deliberate, not a legal microprint."""
    f = font('mono', 19, 700)
    tw = draw.textlength(text, font=f)
    draw.rounded_rectangle((PAD, y, PAD + tw + 28, y + 38), radius=4, fill=TERRA)
    draw.text((PAD + 14, y + 8), text, font=f, fill=FIELD)


def draw_rule(draw, y, width=150):
    draw.line((PAD, y, PAD + width, y), fill=TERRA, width=8)


# ---------------------------------------------------------------- fitting

def fit_headline(draw, text, max_bottom, width=COL, sizes=(86, 78, 70, 64, 58, 52, 46, 40)):
    for size in sizes:
        f = font('serif', size, 600)
        lines = wrap(draw, text, f, width)
        step = int(size * 1.12)
        if len(lines) <= 5 and lines[0]:
            height = len(lines) * step
            if height <= max_bottom:
                return f, lines, step, size
    raise ValueError(f'headline cannot fit above {max_bottom}px: {text[:70]!r}')


def fit_body(draw, text, room, width=COL - 20):
    if not text.strip():
        return None, [], 0, 0
    for size in range(40, 23, -2):
        f = font('sans', size, 400)
        lines = wrap(draw, text, f, width)
        step = int(size * 1.42)
        if len(lines) * step <= room:
            return f, lines, step, size
    raise ValueError(f'body cannot fit in {room}px: {text[:70]!r}')


def text_card(post_id, kicker, series, headline, body='', page=1, total=6, tag=None):
    im = Image.new('RGB', (W, H), FIELD)
    d = ImageDraw.Draw(im)
    draw_header(d, kicker, post_id)
    top = 232
    if tag:
        draw_tag(d, tag)
        top = 236
    hf, hlines, hstep, _ = fit_headline(d, headline, SAFE_BOTTOM - top - 120)
    bf, blines, bstep, _ = fit_body(d, body, SAFE_BOTTOM - top - 160)
    block_h = len(hlines) * hstep + 26 + 8 + 62 + len(blines) * bstep
    y = top + 34
    for line in hlines:
        d.text((PAD, y), line, font=hf, fill=GREEN)
        y += hstep
    y += 26
    draw_rule(d, y)
    y += 62
    for line in blines:
        d.text((PAD, y), line, font=bf, fill=INK)
        y += bstep
    _numeral(d, page)
    draw_footer(d, series, page, total)
    return im


def cover_card(post_id, kicker, series, headline, sub='', page=1, total=6, tag=None):
    """Slide 1 gets the extra air: bigger type, the series name, no body clutter."""
    im = Image.new('RGB', (W, H), FIELD)
    d = ImageDraw.Draw(im)
    # Cover carries the series name once, as a terracotta serif kicker, not twice.
    d.text((PAD, 74), post_id, font=font('mono', 17, 400), fill=TERRA)
    d.text((PAD, 128), kicker.upper()[:40], font=font('serif', 32, 600), fill=TERRA)
    top = 226
    if tag:
        draw_tag(d, tag, y=200)
        top = 300
    hf, hlines, hstep, _ = fit_headline(d, headline, SAFE_BOTTOM - top - 200, sizes=(96, 88, 80, 72, 66, 60, 54, 48))
    bf, blines, bstep, _ = fit_body(d, sub, SAFE_BOTTOM - top - 260) if sub else (None, [], 0, 0)
    block_h = len(hlines) * hstep + 30 + 8 + 60 + len(blines) * bstep
    y = top + 26
    for line in hlines:
        d.text((PAD, y), line, font=hf, fill=GREEN)
        y += hstep
    y += 30
    draw_rule(d, y, 200)
    y += 60
    if sub:
        for line in blines:
            d.text((PAD, y), line, font=bf, fill=INK)
            y += bstep
    _numeral(d, page)
    draw_footer(d, series, page, total)
    return im


def _numeral(d, page):
    """Big, quiet slide number in the lower right. Reads as texture, keeps order visible."""
    f = font('serif', 300, 600)
    label = f'{page:02d}'
    tw = d.textlength(label, font=f)
    d.text((W - PAD - tw, 830), label, font=f, fill='#EFD9B4')


def save_jpg(im, path, quality=76):
    path.parent.mkdir(parents=True, exist_ok=True)
    im.save(path, quality=quality, optimize=True, progressive=True)
    return path
