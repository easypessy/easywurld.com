"""Easywurld carousel renderer — 4:5 (1080x1350) and 9:16 (1080x1920)."""
import os
from PIL import Image, ImageDraw, ImageFont
from fontTools.ttLib import TTFont as FTFont

FD = "/tmp/brand/fonts"
CREAM = (250, 231, 199)
LEAF = (39, 71, 58)
DEEP = (10, 73, 55)
TERRA = (158, 78, 44)
INK = (20, 23, 15)
PAPER = (251, 249, 244)
RULE = (217, 205, 180)
MUTED = (107, 106, 94)

W, H = 1080, 1350
M = 96

# ---------- naira-safe text ----------
_HAVE_NAIRA = {}

def _has_naira(path):
    if path not in _HAVE_NAIRA:
        try:
            f = FTFont(path)
            cmap = f.getBestCmap()
            _HAVE_NAIRA[path] = 0x20A6 in cmap
        except Exception:
            _HAVE_NAIRA[path] = False
    return _HAVE_NAIRA[path]

DEJAVU = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"

def F(name, size):
    return ImageFont.truetype(os.path.join(FD, name), size)

def _naira_mask(h, size):
    """Draw a capital N and strike it twice, as a mask image."""
    f = ImageFont.truetype(DEJAVU, size)
    box = f.getbbox("N")
    w_, h_ = box[2] - box[0], box[3] - box[1]
    pad = int(size * 0.16)
    img = Image.new("L", (w_ + pad * 2, h_ + pad * 2), 0)
    d = ImageDraw.Draw(img)
    d.text((pad - box[0], pad - box[1]), "N", font=f, fill=255)
    lw = max(2, int(size * 0.065))
    y1 = pad + int(h_ * 0.30)
    y2 = pad + int(h_ * 0.62)
    d.line([(0, y1), (img.width, y1)], fill=255, width=lw)
    d.line([(0, y2), (img.width, y2)], fill=255, width=lw)
    return img


class Drawer:
    """Wraps text drawing so the naira sign is always drawn, never tofu."""
    def __init__(self, img):
        self.img = img
        self.d = ImageDraw.Draw(img)

    def measure(self, text, font, size):
        if "\u20a6" not in text:
            return self.d.textlength(text, font=font)
        total = 0
        for i, chunk in enumerate(text.split("\u20a6")):
            if i:
                total += int(size * 0.62) * 1.06
            total += self.d.textlength(chunk, font=font)
        return total

    def text(self, xy, text, font, fill, size=None, anchor=None):
        if size is None:
            size = font.size
        if "\u20a6" not in text:
            self.d.text(xy, text, font=font, fill=fill, anchor=anchor)
            if anchor and anchor[0] in "m":
                pass
            return
        # manual layout, left to right
        # measure total so we can honour right/centre anchors
        total = self.measure(text, font, size)
        x, y = xy
        if anchor and anchor[0] == "m":
            x -= total / 2
        elif anchor and anchor[0] == "r":
            x -= total
        # vertical anchor: use the font's own baseline via d.text with anchor y-part
        ypart = anchor[1] if anchor else "a"
        for i, chunk in enumerate(text.split("\u20a6")):
            if i:
                m = _naira_mask(None, size)
                scale = m.height
                nw = int(size * 0.62)
                m = m.resize((nw, int(m.height * nw / m.width)), Image.LANCZOS)
                top = self.d.textbbox((0, 0), "N", font=font)[1]
                span = self.d.textbbox((0, 0), "N", font=font)[3] - top
                self.img.paste(fill, (int(x), int(y + top - (m.height - span) / 2)), m)
                x += nw * 1.06
            if chunk:
                self.d.text((x, y), chunk, font=font, fill=fill, anchor=("l" + ypart) if ypart else None)
                x += self.d.textlength(chunk, font=font)


def wrap(dr, text, font, size, maxw):
    words = text.split()
    lines, cur = [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if dr.measure(t, font, size) <= maxw or not cur:
            cur = t
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def fit_headline(dr, text, maxw, maxh, sizes=(92, 86, 80, 74, 68, 62, 56, 50, 46)):
    """Largest Fraunces size where the wrapped block fits."""
    for s in sizes:
        f = F("Fraunces-Bold.ttf", s)
        lines = wrap(dr, text, f, s, maxw)
        lh = int(s * 1.16)
        if len(lines) * lh <= maxh and all(dr.measure(l, f, s) <= maxw for l in lines):
            return s, f, lines, lh
    s = sizes[-1]
    f = F("Fraunces-Bold.ttf", s)
    return s, f, wrap(dr, text, f, s, maxw), int(s * 1.16)


# ---------- chrome ----------
MARK = Image.open("/home/user/website-builder-portfolio/client/public/brand/mark.png").convert("RGBA")

def mark_img(h, color=DEEP):
    m = MARK.copy()
    bbox = m.getbbox()
    m = m.crop(bbox)
    # recolour: keep alpha, replace colour
    solid = Image.new("RGBA", m.size, color + (255,))
    solid.putalpha(m.getchannel("A"))
    w = int(solid.width * h / solid.height)
    return solid.resize((w, h), Image.LANCZOS)


def new_slide(bg=CREAM):
    img = Image.new("RGB", (W, H), bg)
    return img, Drawer(img)


def footer(dr, idx, total, ink=DEEP, muted=MUTED, dark=False):
    f = F("JetBrainsMono-Medium.ttf", 25)
    dr.text((M, H - 86), f"{idx:02d}  /  {total:02d}", f, CREAM if dark else muted)
    mk = mark_img(46, CREAM if dark else DEEP)
    dr.img.paste(mk, (W - M - mk.width, H - 108), mk)


def kicker(dr, text, color=TERRA, y=140):
    f = F("JetBrainsMono-Medium.ttf", 26)
    dr.text((M, y), text.upper(), f, color)


def rule(dr, y, w=120, color=TERRA):
    dr.d.rectangle([M, y, M + w, y + 5], fill=color)


# ---------- slide archetypes ----------
def s_hook(img, dr, kicker_text, headline, support, idx, total):
    kicker(dr, kicker_text)
    size, f, lines, lh = fit_headline(dr, headline, W - 2 * M, 470)
    y = 300
    for ln in lines:
        dr.text((M, y), ln, f, DEEP, size)
        y += lh
    rule(dr, y + 26)
    fy = y + 74
    ff = F("Inter-Regular.ttf", 36)
    for ln in wrap(dr, support, ff, 36, W - 2 * M - 20):
        dr.text((M, fy), ln, ff, INK, 36)
        fy += 50
    footer(dr, idx, total)


def s_statement(img, dr, kicker_text, text, idx, total):
    kicker(dr, kicker_text)
    size, f, lines, lh = fit_headline(dr, text, W - 2 * M, 620, sizes=(78, 72, 68, 62, 58, 54, 50, 46))
    y = 360
    for ln in lines:
        dr.text((M, y), ln, f, DEEP, size)
        y += lh
    rule(dr, y + 30)
    footer(dr, idx, total)


def s_number(img, dr, kicker_text, num, headline, support, idx, total):
    kicker(dr, kicker_text)
    nf = F("Fraunces-Bold.ttf", 250)
    dr.text((M - 6, 210), num, nf, TERRA, 250)
    y = 510
    size, f, lines, lh = fit_headline(dr, headline, W - 2 * M, 330, sizes=(72, 66, 60, 56, 50, 46))
    for ln in lines:
        dr.text((M, y), ln, f, DEEP, size)
        y += lh
    if support:
        ff = F("Inter-Regular.ttf", 34)
        y += 22
        for ln in wrap(dr, support, ff, 34, W - 2 * M - 20):
            dr.text((M, y), ln, ff, INK, 34)
            y += 48
    footer(dr, idx, total)


def s_list(img, dr, kicker_text, title, items, idx, total):
    kicker(dr, kicker_text)
    size, f, lines, lh = fit_headline(dr, title, W - 2 * M, 220, sizes=(64, 58, 54, 50, 46))
    y = 250
    for ln in lines:
        dr.text((M, y), ln, f, DEEP, size)
        y += lh
    rule(dr, y + 22)
    y += 76
    nf = F("JetBrainsMono-Medium.ttf", 25)
    bf = F("Inter-Medium.ttf", 37)
    for i, it in enumerate(items, 1):
        dr.text((M, y + 4), f"{i:02d}", nf, TERRA)
        xx = M + 66
        for ln in wrap(dr, it, bf, 37, W - 2 * M - 66):
            dr.text((xx, y), ln, bf, INK, 37)
            y += 47
        y += 34
    footer(dr, idx, total)


def s_compare(img, dr, kicker_text, left_label, right_label, left_text, right_text, idx, total):
    kicker(dr, kicker_text)
    y = 230
    colw = (W - 2 * M - 34) // 2
    for cx, lab in ((M, left_label), (M + colw + 34, right_label)):
        lf = F("JetBrainsMono-Medium.ttf", 23)
        dr.text((cx, y), lab.upper(), lf, MUTED)
    y += 52
    lf = F("Inter-Regular.ttf", 33)
    rf = F("Inter-Medium.ttf", 33)
    # measure heights
    lh_ = []
    for txt, fnt in ((left_text, lf), (right_text, rf)):
        n = 0
        for para in txt.split("\n"):
            n += len(wrap(dr, para, fnt, 33, colw)) or 1
        lh_.append(n * 45 + 90)
    boxh = max(lh_)
    # left card
    dr.d.rounded_rectangle([M, y, M + colw, y + boxh], 6, fill=PAPER, outline=RULE, width=2)
    dr.d.rounded_rectangle([M + colw + 34, y, M + colw * 2 + 34, y + boxh], 6,
                           fill=DEEP, outline=DEEP, width=2)
    ty = y + 44
    for para in left_text.split("\n"):
        for ln in wrap(dr, para, lf, 33, colw - 56):
            dr.text((M + 28, ty), ln, lf, INK, 33)
            ty += 45
    ty = y + 44
    for para in right_text.split("\n"):
        for ln in wrap(dr, para, rf, 33, colw - 56):
            dr.text((M + colw + 62, ty), ln, rf, CREAM, 33)
            ty += 45
    footer(dr, idx, total)


def s_cta(img, dr, kicker_text, headline, action, keyword, idx, total):
    # green band with the pack name
    dr.d.rectangle([0, 0, W, 300], fill=DEEP)
    kf = F("JetBrainsMono-Medium.ttf", 25)
    dr.text((M, 150), kicker_text.upper(), kf, CREAM)
    # brand lockup
    y = 400
    bf = F("Fraunces-Bold.ttf", 68)
    dr.text((M, y), "EASYWURLD", bf, DEEP, 68)
    sf = F("JetBrainsMono-Medium.ttf", 28)
    dr.text((M + 4, y + 92), "SIMPLIFY.  OPTIMIZE.  GROW.", sf, LEAF)
    rule(dr, y + 152, 160)
    size, f, lines, lh = fit_headline(dr, headline, W - 2 * M, 300, sizes=(66, 60, 56, 50, 46))
    y = 690
    for ln in lines:
        dr.text((M, y), ln, f, DEEP, size)
        y += lh
    # keyword box
    y += 40
    dr.d.rectangle([M, y, W - M, y + 116], fill=PAPER)
    k2 = F("JetBrainsMono-Medium.ttf", 22)
    dr.text((M + 26, y + 20), "MESSAGE", k2, TERRA)
    k3 = F("JetBrainsMono-SemiBold.ttf", 44)
    dr.text((M + 26, y + 50), keyword, k3, DEEP, 44)
    y += 160
    af = F("Inter-Regular.ttf", 34)
    dr.text((M, y), action, af, INK, 34)
    dr.text((M, H - 86), "WhatsApp 0905 069 0837", F("Inter-Regular.ttf", 27), MUTED)
    f3 = F("JetBrainsMono-Medium.ttf", 25)
    dr.text((W - M, H - 86), f"{idx:02d}  /  {total:02d}", f3, MUTED, 25, anchor="ra")
    mk = mark_img(46, DEEP)
    dr.img.paste(mk, (W - M - mk.width + 6, H - 128), mk)


def render(spec, outdir, slug):
    """spec = list of slide dicts."""
    os.makedirs(outdir, exist_ok=True)
    n = len(spec)
    paths = []
    for i, sd in enumerate(spec, 1):
        img, dr = new_slide()
        k = sd.get("kind")
        if k == "hook":
            s_hook(img, dr, sd["kicker"], sd["headline"], sd["support"], i, n)
        elif k == "statement":
            s_statement(img, dr, sd["kicker"], sd["text"], i, n)
        elif k == "number":
            s_number(img, dr, sd["kicker"], sd["num"], sd["headline"], sd.get("support"), i, n)
        elif k == "list":
            s_list(img, dr, sd["kicker"], sd["title"], sd["items"], i, n)
        elif k == "compare":
            s_compare(img, dr, sd["kicker"], sd["left_label"], sd["right_label"],
                      sd["left_text"], sd["right_text"], i, n)
        elif k == "cta":
            s_cta(img, dr, sd["kicker"], sd["headline"], sd["action"], sd["keyword"], i, n)
        p = os.path.join(outdir, f"{slug}_S{i:02d}.png")
        img.save(p, optimize=True)
        paths.append(p)
    return paths
