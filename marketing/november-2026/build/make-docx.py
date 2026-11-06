#!/usr/bin/env python3
"""
Turn every CAPTION.md into a real Word document.

Phones handle .docx natively — Word, WPS, Google Docs all open it — where a
.md file usually lands as raw text or does nothing at all.

    /tmp/venv/bin/python marketing/november-2026/build/make-docx.py

Writes, for every post folder:
    CAPTION.docx            the same caption, formatted for reading/editing
and per day:
    days/day-NN/DAY-NN-CAPTIONS.docx     all eleven posts in one document
and once:
    ALL-CAPTIONS-november-2026.docx      the whole month in one document
"""
import re
import sys
from pathlib import Path

from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.shared import Cm, Pt, RGBColor

GREEN = RGBColor(0x0A, 0x49, 0x37)
TERRA = RGBColor(0x9E, 0x4E, 0x2C)
MUTED = RGBColor(0x5A, 0x63, 0x5A)
INK = RGBColor(0x14, 0x17, 0x0F)

ROOT = Path(__file__).resolve().parents[1]


def new_doc():
    doc = Document()
    sec = doc.sections[0]
    sec.top_margin = Cm(2)
    sec.bottom_margin = Cm(2)
    sec.left_margin = Cm(2)
    sec.right_margin = Cm(2)
    normal = doc.styles["Normal"]
    normal.font.name = "Calibri"
    normal.font.size = Pt(11)
    normal.font.color.rgb = INK
    normal.paragraph_format.space_after = Pt(8)
    normal.paragraph_format.line_spacing = 1.15
    return doc


def para(doc, text="", size=11, bold=False, italic=False, color=INK,
         space_before=0, space_after=8, caps=False, font="Calibri"):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(space_before)
    p.paragraph_format.space_after = Pt(space_after)
    r = p.add_run(text.upper() if caps else text)
    r.font.size = Pt(size)
    r.bold = bold
    r.italic = italic
    r.font.color.rgb = color
    r.font.name = font
    return p


def rule(doc):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(10)
    r = p.add_run("_" * 60)
    r.font.size = Pt(8)
    r.font.color.rgb = RGBColor(0xD8, 0xC9, 0xAE)
    return p


def parse(md_path):
    """→ {title, meta, note, sections: [(name, [paragraphs])]}"""
    raw = md_path.read_text(encoding="utf-8").replace("\r\n", "\n")
    lines = raw.split("\n")
    title, meta, note = "", "", ""
    sections, current = [], None
    for line in lines:
        s = line.strip()
        if s.startswith("# ") and not title:
            title = s[2:].strip()
        elif s.startswith("## "):
            current = (s[3:].strip(), [])
            sections.append(current)
        elif s.startswith("> ") and current is None:
            note = (note + " " + s[2:].strip()).strip()
        elif s == "---":
            continue
        elif s.startswith("**") and s.endswith("**") and not meta and current is None:
            meta = s.strip("*").strip()
        elif current is not None:
            current[1].append(line)
    # collapse sections into paragraph blocks
    cleaned = []
    for name, body in sections:
        blocks, buf = [], []
        for line in body:
            if line.strip() == "":
                if buf:
                    blocks.append("\n".join(buf).strip())
                    buf = []
            else:
                buf.append(line.rstrip())
        if buf:
            blocks.append("\n".join(buf).strip())
        cleaned.append((name, blocks))
    return {"title": title, "meta": meta, "note": note, "sections": cleaned}


def render(doc, data, show_title=True):
    if show_title and data["title"]:
        para(doc, data["title"], size=19, bold=True, color=GREEN, font="Georgia",
             space_before=0, space_after=4)
    if data["meta"]:
        para(doc, data["meta"], size=9, color=MUTED, space_after=4)
    if data["note"]:
        para(doc, data["note"], size=9, italic=True, color=TERRA, space_after=6)
    for name, blocks in data["sections"]:
        para(doc, name, size=11, bold=True, color=TERRA, caps=True,
             space_before=14, space_after=6, font="Consolas")
        for block in blocks:
            if block.startswith("#") and " " not in block:
                # hashtag line
                para(doc, block, size=9, color=MUTED, space_after=8)
            else:
                for chunk in block.split("\n"):
                    para(doc, chunk.strip(), space_after=6)


def main():
    posts = sorted(ROOT.glob("**/CAPTION.md"))
    if not posts:
        sys.exit("no CAPTION.md found")

    made = 0
    by_day = {}
    all_doc = new_doc()
    para(all_doc, "EASYWURLD — NOVEMBER 2026", size=12, bold=True, color=TERRA,
         caps=True, space_after=2, font="Consolas")
    para(all_doc, "All captions, every post", size=24, bold=True, color=GREEN,
         font="Georgia", space_after=4)
    para(all_doc, f"{len(posts)} posts · LinkedIn, Instagram, TikTok, WhatsApp",
         size=10, color=MUTED, space_after=10)
    rule(all_doc)

    for md in posts:
        data = parse(md)
        doc = new_doc()
        para(doc, "EASYWURLD", size=9, bold=True, color=TERRA, caps=True,
             space_after=8, font="Consolas")
        render(doc, data)
        rule(doc)
        para(doc, "Simplify. Optimize. Grow. · Message CLEAR on WhatsApp",
             size=8, color=MUTED, font="Consolas")
        doc.save(md.with_suffix(".docx"))
        made += 1

        day_key = md.parts[-3] if len(md.parts) > 3 else "flagship"
        by_day.setdefault(day_key, []).append((md, data))

        all_doc.add_page_break()
        render(all_doc, data)

    for day, items in by_day.items():
        folder = items[0][0].parent.parent
        doc = new_doc()
        para(doc, "EASYWURLD — DAILY CAPTIONS", size=9, bold=True, color=TERRA,
             caps=True, space_after=8, font="Consolas")
        label = day.replace("day-", "DAY ").upper() if day.startswith("day-") else "FLAGSHIP POSTS"
        para(doc, label, size=22, bold=True, color=GREEN, font="Georgia", space_after=10)
        for i, (md, data) in enumerate(items, 1):
            if i > 1:
                doc.add_page_break()
            para(doc, f"POST {i} OF {len(items)} — {md.parent.name}",
                 size=8, bold=True, color=MUTED, caps=True, space_after=8,
                 font="Consolas")
            render(doc, data)
        doc.save(folder / f"{label.replace(' ', '-').lower()}-captions.docx")

    out = ROOT / "ALL-CAPTIONS-november-2026.docx"
    all_doc.save(out)
    print(f"Wrote {made} CAPTION.docx files, {len(by_day)} day documents and {out.name}")


if __name__ == "__main__":
    main()
