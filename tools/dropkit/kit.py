#!/usr/bin/env python3
"""Easywurld design system — renders every asset in the 30-day drop.

Brand tokens come from marketing/README.md:
  cream #FAE7C7 · leaf #27473A · deep green #0A4937 · terracotta #9E4E2C
  ink #14170F · paper #FBF9F4
Type: Fraunces (headline), Inter (body), JetBrains Mono (labels).
Fraunces/Inter/JetBrains have no naira glyph, so ₦ is drawn as a custom
'N' with two strokes — it stays in the brand typeface instead of falling back.
"""
from __future__ import annotations

import re
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

HERE = Path(__file__).resolve().parent
FONTS = HERE / "fonts"
ROOT = HERE.parents[1]
BRAND = ROOT / "client" / "public" / "brand"

CREAM = (250, 231, 199)
PAPER = (251, 249, 244)
DEEP = (10, 73, 55)
LEAF = (39, 71, 58)
TERRA = (158, 78, 44)
INK = (20, 23, 15)
LINE = (222, 210, 187)
MUTED = (112, 116, 101)

FR = str(FONTS / "Fraunces-Regular.ttf")
FR6 = str(FONTS / "Fraunces-SemiBold.ttf")
FR7 = str(FONTS / "Fraunces-Bold.ttf")
FR9 = str(FONTS / "Fraunces-Black.ttf")
IN = str(FONTS / "Inter-Regular.ttf")
IN5 = str(FONTS / "Inter-Medium.ttf")
IN6 = str(FONTS / "Inter-SemiBold.ttf")
IN7 = str(FONTS / "Inter-Bold.ttf")
MO = str(FONTS / "JBMono-Regular.ttf")
MO7 = str(FONTS / "JBMono-Bold.ttf")

WHAT = "https://wa.me/2349050690837"
NUM = "0905 069 0837"
CURRENCY = "\u20a6"

_fonts: dict[tuple[str, int], ImageFont.FreeTypeFont] = {}


def F(path: str, size: int) -> ImageFont.FreeTypeFont:
    key = (path, size)
    if key not in _fonts:
        _fonts[key] = ImageFont.truetype(path, size)
    return _fonts[key]


_mark_cache: dict[int, Image.Image] = {}


def mark(size: int, light: bool = False) -> Image.Image:
    key = size * 10 + int(light)
    if key not in _mark_cache:
        src = BRAND / ("mark-light.png" if light else "mark.png")
        im = Image.open(src).convert("RGBA").resize((size, size), Image.LANCZOS)
        _mark_cache[key] = im
    return _mark_cache[key]


# --------------------------------------------------------------------------- text

def measure(text: str, font: ImageFont.FreeTypeFont, size: int) -> float:
    w = 0.0
    for chunk, is_naira in _runs(text):
        w += font.getlength("N") * 1.14 if is_naira else font.getlength(chunk)
    return w


def _runs(text: str):
    buf, cur = [], ""
    for ch in text:
        if ch == CURRENCY:
            if cur:
                buf.append((cur, False))
                cur = ""
            buf.append((CURRENCY, True))
        else:
            cur += ch
    if cur:
        buf.append((cur, False))
    return buf


def _naira(d: ImageDraw.ImageDraw, xy, font, size: int, fill, anchor="la"):
    """Draw ₦ as the typeface's own N with two strokes through it."""
    bbox = d.textbbox(xy, "N", font=font, anchor=anchor)
    d.text(xy, "N", font=font, fill=fill, anchor=anchor)
    x0, y0, x1, y1 = bbox
    h = max(1, y1 - y0)
    t = max(2, round(h * 0.045))
    pad = max(1, round((x1 - x0) * 0.03))
    for frac in (0.28, 0.54):
        yy = y0 + h * frac
        d.rectangle((x0 - pad, yy, x1 + pad, yy + t), fill=fill)


def put(d, xy, text, font, fill, anchor="la", size=None):
    """Draw text, handling ₦ in whatever typeface is passed."""
    size = size or font.size
    if CURRENCY not in text:
        d.text(xy, text, font=font, fill=fill, anchor=anchor)
        return
    total = measure(text, font, size)
    x, y = xy
    if anchor[0] == "m":
        x -= total / 2
    elif anchor[0] == "r":
        x -= total
    for chunk, is_naira in _runs(text):
        if is_naira:
            _naira(d, (x, y), font, size, fill, "l" + anchor[1])
            x += font.getlength("N") * 1.14
        else:
            d.text((x, y), chunk, font=font, fill=fill, anchor="l" + anchor[1])
            x += font.getlength(chunk)


def wrap(text: str, font: ImageFont.FreeTypeFont, max_w: float) -> list[str]:
    out: list[str] = []
    for para in str(text).split("\n"):
        words = para.split()
        if not words:
            continue
        cur = words[0]
        for w in words[1:]:
            trial = cur + " " + w
            if measure(trial, font, font.size) <= max_w:
                cur = trial
            else:
                out.append(cur)
                cur = w
        out.append(cur)
    return out or [""]


def fit(text, path, max_w, max_h, hi, lo, leading=1.14):
    """Largest size at which `text` wraps inside the box."""
    for size in range(hi, lo - 1, -3):
        f = F(path, size)
        lines = wrap(text, f, max_w)
        if len(lines) * size * leading <= max_h and \
                max(measure(l, f, size) for l in lines) <= max_w + 1:
            return f, lines, size * leading
    f = F(path, lo)
    return f, wrap(text, f, max_w), lo * leading


def lines_block(d, lines, font, fill, x, y, lh, align="left"):
    for i, ln in enumerate(lines):
        put(d, (x, y + i * lh), ln, font, fill,
            "ma" if align == "center" else "la")


def _spaced(d, xy, text, font, fill, tracking):
    """Letter-spaced mono label."""
    widths = [font.getlength(c) + tracking for c in text]
    x, y = xy[0], xy[1]
    for c, w in zip(text, widths):
        d.text((x, y), c, font=font, fill=fill, anchor="la")
        x += w


def rounded(d, box, r, fill, outline=None, width=2):
    d.rounded_rectangle(box, radius=r, fill=fill, outline=outline, width=width)


# --------------------------------------------------------------------------- parts

def eyebrow(d, xy, text, fill=MUTED, size=24, tracking=3.6, max_ch=44):
    t = text.upper()[:max_ch]
    _spaced(d, xy, t, F(MO7, size), fill, tracking)


def rule(d, x, y, w=78, h=7, fill=TERRA):
    d.rounded_rectangle((x, y, x + w, y + h), radius=h // 2, fill=fill)


def dots(d, x, y, total, active, r=8, gap=27, fill=TERRA, rest=(214, 203, 182)):
    for i in range(total):
        cx = x + i * gap
        d.ellipse((cx - r, y - r, cx + r, y + r), fill=fill if i == active else rest)


def cta_pill(d, x, y, label, h=70, bg=DEEP, fg=CREAM, size=26):
    f = F(MO7, size)
    w = measure(label, f, size) + 60
    d.rounded_rectangle((x, y, x + w, y + h), radius=h // 2, fill=bg)
    put(d, (x + w / 2, y + h / 2 - 2), label, f, fg, "mm")
    return w


def brand_line(img, d, x, y, right, light=False):
    """Small brand lockup: mark, name, slogan, aligned to a baseline."""
    s = 46
    img.paste(mark(s, light=light), (x, y - 4), mark(s, light=light))
    put(d, (x + s + 14, y + 2), "EASYWURLD", F(MO7, 21),
        CREAM if light else DEEP)
    put(d, (x + s + 14, y + 26), "Simplify. Optimize. Grow.", F(MO, 17),
        (206, 219, 202) if light else MUTED)
    put(d, (right, y + 26), "0905 069 0837", F(MO, 17),
        (206, 219, 202) if light else MUTED, "ra")


def split_number(line: str):
    m = re.match(r"^(\d{1,2})\s*[·.:)\-]\s*(.+)$", line.strip())
    if m:
        return m.group(1), m.group(2).strip()
    return None, line.strip()


# --------------------------------------------------------------------------- 4:5


def slide(path: Path, *, topic: str, text: str, index: int, total: int,
          tag: str = "", cover: bool = False, cta: str = "", dark: bool = False):
    """1080x1350 feed slide."""
    W, H = 1080, 1350
    img = Image.new("RGB", (W, H), DEEP if dark else CREAM)
    d = ImageDraw.Draw(img)

    m = 46
    rounded(d, (m, m, W - m, H - m), 30, LEAF if dark else PAPER,
            None if dark else LINE, 2)

    px, pw = m + 66, W - 2 * m - 132
    top = m + 62

    f_ctr = F(MO, 23)
    ctr_w = f_ctr.getlength(f"{index:02d} / {total:02d}")
    label = (tag or f"DAY · {topic}").upper()
    f_lab = F(MO7, 24)
    track = 3.6
    room = pw - ctr_w - 34
    def lbl_w(t):
        return sum(f_lab.getlength(c) + track for c in t) - track
    while label and lbl_w(label) > room:
        cut = label.rsplit(" ", 1)
        label = (cut[0] if len(cut) > 1 else label[:-1]).rstrip(" ·,:-")
    eyebrow(d, (px, top), label, TERRA if dark else MUTED, size=24, tracking=track)
    put(d, (W - m - 66, top), f"{index:02d} / {total:02d}", f_ctr,
        (214, 224, 210) if dark else MUTED, "ra")
    rule(d, px, top + 44, 78, 6, TERRA)

    band_top = top + 96
    band_bot = H - m - 168
    num, body_text = split_number(text)

    if num and not cover:
        fn = F(FR9, 200)
        put(d, (px - 6, band_top + 12), num.zfill(2), fn, TERRA)
        head_top = band_top + 214
        f, ls, lh = fit(body_text, FR6, pw,
                        (band_bot - head_top) * 0.92, 88, 42, 1.15)
        put(d, (px, head_top), "", f, DEEP)
        lines_block(d, ls, f, CREAM if dark else DEEP, px, head_top, lh)
    else:
        hi = 104 if cover else 88
        f, ls, lh = fit(body_text, FR7 if cover else FR6, pw,
                        (band_bot - band_top) * 0.94, hi, 40, 1.13)
        block = len(ls) * lh
        head_top = band_top + max(0, ((band_bot - band_top) - block) / 2)
        lines_block(d, ls, f, CREAM if dark else DEEP, px, head_top, lh)

    fy = H - m - 136
    if cta:
        cta_pill(d, px, fy - 34, cta, h=64, size=24,
                 bg=CREAM if dark else DEEP, fg=DEEP if dark else CREAM)
    dots(d, px + 8, fy + 54, total, index - 1,
         fill=TERRA, rest=(90, 118, 104) if dark else (214, 203, 182))
    put(d, (W - m - 66, fy + 38), "SIMPLIFY · OPTIMIZE · GROW", F(MO, 17),
        (206, 219, 202) if dark else MUTED, "ra")
    img.paste(mark(40, light=dark), (W - m - 66 - 40, fy + 62),
            mark(40, light=dark))
    img.save(path, "PNG", compress_level=1)


def meme(path: Path, *, lines: list[str], tag: str, topic: str):
    """1080x1350 type-only meme, cream + deep green panels."""
    W, H = 1080, 1350
    img = Image.new("RGB", (W, H), CREAM)
    d = ImageDraw.Draw(img)
    m = 46
    rounded(d, (m, m, W - m, H - m), 30, PAPER, LINE, 2)

    eyebrow(d, (m + 60, m + 52), tag)
    rule(d, m + 60, m + 96, 78, 6, TERRA)

    body = [l.strip() for l in lines if l.strip()][:4] or [topic]
    n = len(body)
    top_ = m + 148
    bottom = H - m - 128
    gap = 16
    ph = (bottom - top_ - gap * (n - 1)) / n

    for i, line in enumerate(body):
        y0 = top_ + i * (ph + gap)
        dark = i == n - 1 and n > 1
        rounded(d, (m + 60, y0, W - m - 60, y0 + ph), 22,
                LEAF if dark else (244, 240, 229),
                None if dark else (232, 223, 206), 2)
        f, ls, lh = fit(line, FR6, W - 2 * m - 200, ph - 56, 82, 30, 1.10)
        lines_block(d, ls, f, CREAM if dark else DEEP,
                    W / 2, y0 + (ph - len(ls) * lh) / 2, lh, "center")

    put(d, (m + 60, H - m - 76), "EASYWURLD · SIMPLIFY. OPTIMIZE. GROW.",
        F(MO, 17), MUTED)
    img.paste(mark(40), (W - m - 60 - 40, H - m - 88), mark(40))
    img.save(path, "PNG", compress_level=1)


def list_card(path: Path, *, head: str, rows: list[str], tag: str, cta: str = ""):
    """1080x1350 static post: headline plus numbered rows."""
    W, H = 1080, 1350
    img = Image.new("RGB", (W, H), CREAM)
    d = ImageDraw.Draw(img)
    m = 46
    rounded(d, (m, m, W - m, H - m), 30, PAPER, LINE, 2)
    px, pw = m + 66, W - 2 * m - 132

    eyebrow(d, (px, m + 58), tag)
    rule(d, px, m + 102, 78, 6, TERRA)

    fh, hl, lh = fit(head, FR7, pw, 280, 66, 34, 1.10)
    lines_block(d, hl, fh, DEEP, px, m + 148, lh)
    y = m + 148 + len(hl) * lh + 30

    y += 24
    rows = [r for r in rows if r.strip()][:5]
    if rows:
        avail = H - m - 210 - y
        size = 46
        while True:
            text_h = []
            for r in rows:
                text = re.sub(r"^\s*\d+\s*·\s*", "", r)
                f, ls, lh = fit(text, IN5, pw - 60, 300, size, 18, 1.26)
                text_h.append(len(ls) * lh)
            total = sum(text_h) + 30 * (len(rows) - 1)
            if total <= avail or size <= 22:
                break
            size -= 2
        extra = max(0, avail - total)
        y += extra * 0.3
        for r, h in zip(rows, text_h):
            d.ellipse((px, y + 12, px + 13, y + 25), fill=TERRA)
            text = re.sub(r"^\s*\d+\s*·\s*", "", r)
            f, ls, lh = fit(text, IN5, pw - 60, 300, size, 18, 1.26)
            lines_block(d, ls, f, INK, px + 40, y, lh)
            y += h + 30

    if cta:
        cta_pill(d, px, H - m - 130, cta, h=64, size=24)
    put(d, (px, H - m - 46), "EASYWURLD · SIMPLIFY. OPTIMIZE. GROW.",
        F(MO, 17), MUTED)
    img.paste(mark(38), (W - m - 66 - 38, H - m - 58), mark(38))
    img.save(path, "PNG", compress_level=1)


# --------------------------------------------------------------------------- 9:16


def story(path: Path, *, tag: str, headline: str, sub: str = "", cta: str = "",
          index: int = 1, total: int = 2, dark: bool = False):
    """1080x1920 story / status asset."""
    W, H = 1080, 1920
    img = Image.new("RGB", (W, H), DEEP if dark else CREAM)
    d = ImageDraw.Draw(img)

    px, pw = 84, W - 168
    top = 250

    eyebrow(d, (px, top), tag, TERRA if dark else MUTED)
    rule(d, px, top + 44, 78, 6, TERRA)

    band_top, band_bot = top + 140, 1330
    fh, hl, lh = fit(headline, FR7, pw, (band_bot - band_top) * 0.72, 116, 50, 1.08)
    sub_h = 0
    fs = sl = slh = None
    if sub:
        fs, sl, slh = fit(sub, IN, pw, 300, 42, 26, 1.32)
        sub_h = len(sl) * slh + 46
    block = len(hl) * lh + sub_h
    y = band_top + max(0, ((band_bot - band_top) - block) / 2)
    lines_block(d, hl, fh, CREAM if dark else DEEP, px, y, lh)
    y += len(hl) * lh + 46
    if sl:
        lines_block(d, sl, fs, (228, 236, 225) if dark else INK, px, y, slh)

    if cta:
        cta_pill(d, px, 1436, cta, h=88, size=30,
                 bg=CREAM if dark else DEEP, fg=DEEP if dark else CREAM)
    dots(d, px + 10, 1604, total, index - 1, r=10, gap=34,
         rest=(90, 118, 104) if dark else (214, 203, 182))
    brand_line(img, d, px, 1662, W - px, light=dark)

    img.save(path, "PNG", compress_level=1)


def video_frame(path: Path, *, text: str, tag: str, index: int, total: int,
                kind: str = "beat", topic: str = ""):
    """1080x1920 frame for a silent kinetic-type video."""
    W, H = 1080, 1920
    img = Image.new("RGB", (W, H), CREAM)
    d = ImageDraw.Draw(img)

    px, pw = 96, W - 192

    y = 120
    seg = (pw - (total - 1) * 8) / total
    for i in range(total):
        x0 = px + i * (seg + 8)
        d.rounded_rectangle((x0, y, x0 + seg, y + 7), radius=4,
                            fill=TERRA if i <= index - 1 else (222, 210, 187))

    eyebrow(d, (px, y + 54), tag, max_ch=46)

    band_top, band_bot = 300, H - 420

    if kind == "cta":
        f, ls, lh = fit(text, FR6, pw, (band_bot - band_top) * 0.74, 94, 40, 1.16)
        lines_block(d, ls, f, DEEP, px,
                    band_top + ((band_bot - band_top) - len(ls) * lh) / 2, lh)
    else:
        num, rest = split_number(text)
        if num:
            put(d, (px - 8, band_top + 40), num.zfill(2), F(FR9, 232), TERRA)
            f, ls, lh = fit(rest, FR6, pw, 780, 100, 44, 1.12)
            lines_block(d, ls, f, DEEP, px, band_top + 340, lh)
        else:
            f, ls, lh = fit(text, FR7 if kind == "hook" else FR6, pw, 900,
                            118 if kind == "hook" else 104, 44, 1.10)
            lines_block(d, ls, f, DEEP, px,
                        band_top + ((band_bot - band_top) - len(ls) * lh) / 2, lh)

    put(d, (px, H - 250), "EASYWURLD", F(MO7, 26), DEEP)
    put(d, (px, H - 212), "Simplify. Optimize. Grow.", F(MO, 21), MUTED)
    put(d, (px, H - 170), "Message us on WhatsApp · 0905 069 0837", F(MO, 20), MUTED)
    img.paste(mark(62), (W - px - 62, H - 264), mark(62))

    img.save(path, "PNG", compress_level=1)
