#!/usr/bin/env python3
"""Easywurld meme renderer - 4:5, 1080x1350. Two styles: chat and statement."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import carousel as C
from PIL import Image, ImageDraw, ImageFont

W, H, M = C.W, C.H, C.M


def bubble(dr, x, y, w, h, fill, radius=34, outline=None):
    dr.d.rounded_rectangle([x, y, x + w, y + h], radius, fill=fill,
                           outline=outline, width=2 if outline else 1)


def chat(spec, out):
    img, dr = C.new_slide()
    C.kicker(dr, spec["kicker"], C.TERRA, 150)
    y = 230
    f = C.F("Inter-Regular.ttf", 44)
    fm = C.F("Inter-Medium.ttf", 44)
    for side, text in spec["lines"]:
        fnt = f if side == "in" else fm
        maxw = W - 2 * M - 150
        lines = C.wrap(dr, text, fnt, 44, maxw)
        bw = max(dr.measure(l, fnt, 44) for l in lines) + 76
        bh = len(lines) * 58 + 40
        if side == "in":
            x = M
            bubble(dr, x, y, bw, bh, C.PAPER)
            col = C.INK
        else:
            x = W - M - bw
            bubble(dr, x, y, bw, bh, C.DEEP)
            col = C.CREAM
        ty = y + 20
        for ln in lines:
            dr.text((x + 38, ty), ln, fnt, col, 44)
            ty += 58
        y += bh + 26
    y += 34
    C.rule(dr, y, 120)
    y += 64
    size, fnt, lines, lh = C.fit_headline(dr, spec["big"], W - 2 * M, 420,
                                          sizes=(78, 72, 66, 60, 54, 48))
    for ln in lines:
        dr.text((M, y), ln, fnt, C.DEEP, size)
        y += lh
    img.save(out, optimize=True)


def statement(spec, out):
    img, dr = C.new_slide()
    C.kicker(dr, spec["kicker"], C.TERRA, 150)
    y = 300
    size, fnt, lines, lh = C.fit_headline(dr, spec["big"], W - 2 * M, 780,
                                          sizes=(96, 88, 80, 72, 64, 58, 52, 46))
    for ln in lines:
        if ln.strip() == "":
            y += int(lh * 0.45)
            continue
        dr.text((M, y), ln, fnt, C.DEEP, size)
        y += lh
    C.rule(dr, y + 34)
    img.save(out, optimize=True)


def render(spec, out):
    if spec["style"] == "chat":
        chat(spec, out)
    else:
        statement(spec, out)
