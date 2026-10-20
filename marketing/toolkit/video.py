#!/usr/bin/env python3
"""Easywurld vertical video builder.

Renders 9:16 beat frames inside the safe box, splits the voiceover at its real
silences, and assembles a captioned MP4 whose beats land on the sentences.
"""
import os, re, subprocess, json, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import carousel as C
from PIL import Image, ImageDraw, ImageFont

VW, VH = 1080, 1920
VM = 104
V_SAFE_TOP = 300
V_SAFE_BOT = 1240
CREAM, DEEP, TERRA, INK, MUTED = C.CREAM, C.DEEP, C.TERRA, C.INK, C.MUTED
PAPER = C.PAPER


def ffmpeg():
    import imageio_ffmpeg
    return imageio_ffmpeg.get_ffmpeg_exe()


def vframe(kicker_text, headline, support, idx, total, out):
    img = Image.new("RGB", (VW, VH), CREAM)
    dr = C.Drawer(img)
    f = C.F("JetBrainsMono-Medium.ttf", 28)
    dr.text((VM, V_SAFE_TOP), kicker_text.upper(), f, TERRA)
    maxw = VW - 2 * VM
    size, fnt, lines, lh = C.fit_headline(dr, headline, maxw, 620,
                                          sizes=(88, 82, 76, 70, 64, 58, 52, 46))
    y = V_SAFE_TOP + 108
    for ln in lines:
        dr.text((VM, y), ln, fnt, DEEP, size)
        y += lh
    if support:
        C.rule(dr, y + 30, 130)
        y += 84
        sf = C.F("Inter-Regular.ttf", 40)
        for ln in C.wrap(dr, support, sf, 40, maxw - 10):
            dr.text((VM, y), ln, sf, INK, 40)
            y += 58
    progress(dr, idx, total)
    img.save(out, optimize=True)


def progress(dr, idx, total, y=1268):
    gap = 14
    seg = 46
    x = VM
    for i in range(total):
        col = TERRA if i < idx else (208, 196, 172)
        dr.d.rectangle([x, y, x + seg, y + 8], fill=col)
        x += seg + gap
    mk = C.mark_img(58, DEEP)
    dr.img.paste(mk, (VW - VM - mk.width, V_SAFE_BOT + 20), mk)


def vcta(kicker_text, headline, keyword, idx, total, out):
    img = Image.new("RGB", (VW, VH), CREAM)
    dr = C.Drawer(img)
    # top band with the pack name
    dr.d.rectangle([0, 0, VW, 360], fill=DEEP)
    f = C.F("JetBrainsMono-Medium.ttf", 28)
    dr.text((VM, 148), kicker_text.upper(), f, CREAM)
    mk = C.mark_img(64, CREAM)
    dr.img.paste(mk, (VW - VM - mk.width, 126), mk)

    # brand lockup
    y = 470
    dr.text((VM, y), "EASYWURLD", C.F("Fraunces-Bold.ttf", 80), DEEP, 80)
    dr.text((VM + 4, y + 104), "SIMPLIFY.  OPTIMIZE.  GROW.",
            C.F("JetBrainsMono-Medium.ttf", 29), C.LEAF)
    C.rule(dr, y + 174, 170)

    # headline
    y = 700
    size, fnt, lines, lh = C.fit_headline(dr, headline, VW - 2 * VM, 300,
                                          sizes=(80, 74, 68, 62, 56, 50, 46))
    for ln in lines:
        dr.text((VM, y), ln, fnt, DEEP, size)
        y += lh

    # keyword box + price on one line
    by = 1060
    dr.d.rectangle([VM, by, VW - VM, by + 132], fill=PAPER)
    dr.text((VM + 28, by + 22), "MESSAGE", C.F("JetBrainsMono-Medium.ttf", 24), TERRA)
    dr.text((VM + 28, by + 56), keyword, C.F("JetBrainsMono-SemiBold.ttf", 48), DEEP, 48)
    dr.text((VW - VM - 28, by + 62), "\u20a65,000", C.F("Inter-SemiBold.ttf", 42), DEEP, 42,
            anchor="ra")

    dr.text((VM, by + 176), "Instant download \u00b7 WhatsApp 0905 069 0837",
            C.F("Inter-Regular.ttf", 32), MUTED, 32)
    progress(dr, idx, total, y=1490)
    img.save(out, optimize=True)


# ---------------------------------------------------------------- timing
def probe(path):
    out = subprocess.run([ffmpeg(), "-i", path, "-hide_banner"],
                         capture_output=True, text=True).stderr
    m = re.search(r"Duration: (\d+):(\d+):([\d.]+)", out)
    return int(m.group(1)) * 3600 + int(m.group(2)) * 60 + float(m.group(3))


def silences(path, noise="-34dB", d=0.20):
    out = subprocess.run([ffmpeg(), "-i", path, "-af",
                          f"silencedetect=noise={noise}:d={d}", "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    starts = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", out)]
    ends = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", out)]
    mids = []
    for s in starts:
        e = min([x for x in ends if x > s] or [s + 0.35])
        mids.append(((s + e) / 2, e - s))
    return mids


def cut_points(path, n_beats, total):
    """Pick n_beats-1 cut times, preferring real pauses near the proportional spot."""
    props = [total * i / n_beats for i in range(1, n_beats)]
    mids = silences(path)
    cuts = []
    for p in props:
        if mids:
            best = min(mids, key=lambda m: abs(m[0] - p) - min(m[1], 0.9) * 0.25)
            if abs(best[0] - p) < total / n_beats * 0.55:
                cuts.append(best[0])
                continue
        cuts.append(p)
    cuts = sorted(cuts)
    # enforce minimum beat length
    minlen = 1.1
    out = []
    for i, c in enumerate(cuts):
        lo = (out[-1] if out else 0) + minlen
        hi = total - minlen * (len(cuts) - i)
        out.append(max(lo, min(hi, c)))
    return out


def build(beats, mp3, out, slug, tmp):
    """beats: list of ('frame'|'cta', kicker, headline, support_or_keyword)"""
    os.makedirs(tmp, exist_ok=True)
    total = probe(mp3)
    n = len(beats)
    frames = []
    for i, (kind, *rest) in enumerate(beats, 1):
        p = os.path.join(tmp, f"{slug}_{i:02d}.png")
        if kind == "cta":
            vcta(rest[0], rest[1], rest[2], i, n, p)
        else:
            vframe(rest[0], rest[1], rest[2], i, n, p)
        frames.append(p)
    cuts = cut_points(mp3, n, total)
    times = [0.0] + cuts + [total]
    lines = []
    for i, fr in enumerate(frames):
        dur = max(0.6, times[i + 1] - times[i])
        lines.append(f"file '{fr}'")
        lines.append(f"duration {dur:.3f}")
    # last frame needs repeating for concat demuxer
    lines.append(f"file '{frames[-1]}'")
    lst = os.path.join(tmp, f"{slug}.txt")
    open(lst, "w").write("\n".join(lines) + "\n")
    cmd = [ffmpeg(), "-y", "-f", "concat", "-safe", "0", "-i", lst, "-i", mp3,
           "-c:v", "libx264", "-preset", "medium", "-crf", "20",
           "-pix_fmt", "yuv420p", "-r", "30",
           "-c:a", "aac", "-b:a", "128k", "-shortest",
           "-movflags", "+faststart", out]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode:
        raise RuntimeError(r.stderr[-1500:])
    return out, total
