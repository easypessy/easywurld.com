#!/usr/bin/env python3
"""Build the 30-day drop: one zip per day, everything numbered by posting time.

Usage:
  python tools/dropkit/make.py --day 1          # build one day (for review)
  python tools/dropkit/make.py --all           # build all 30 + the month sheet
"""
from __future__ import annotations

import argparse
import csv
import datetime as dt
import json
import os
import re
import shutil
import subprocess
import sys
import zipfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import kit  # noqa: E402

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
OUT = ROOT / "build" / "drop"
DAYS = OUT / "days"
WORK = OUT / "work"
START = dt.date(2026, 10, 21)   # Day 01 = today
WAT = "WAT"

FFMPEG = os.environ.get("FFMPEG") or shutil.which("ffmpeg") or ""
if not FFMPEG:
    try:
        import imageio_ffmpeg
        FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
    except Exception:
        FFMPEG = ""

OFFERS = {
    "PLAYBOOK": "The Chat-to-Customer Playbook",
    "CLEAR": "The Clear Homepage Blueprint",
    "ENGINE": "The 30-Day Content Engine",
    "PAGE": "The One-Offer Landing Page Kit",
    "LOCAL": "The Lagos Local Visibility Starter",
    "MESSAGE": "The Clear Message Workbook",
    "PROMPTS": "The Everyday AI Prompt Desk",
    "TEMPLATES": "The Proposal & Report Template Pack",
    "LAUNCH": "The Website Launch & Care Handbook",
}
PRICE = "₦5,000"
NUM = kit.NUM


def slug(s: str, n: int = 42) -> str:
    s = s.lower().replace("&", "and").replace("₦", "naira")
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return s[:n].rstrip("-")


def fmt_duration(fmt: str, default: int = 22) -> int:
    m = re.search(r"(\d{2})\s*s\b", fmt)
    return int(m.group(1)) if m else default


# --------------------------------------------------------------------------- video


def encode(frames: list[tuple[Path, float]], out: Path) -> Path:
    """Silent H.264 from a list of (png, seconds) — hard cuts."""
    out.parent.mkdir(parents=True, exist_ok=True)
    lst = out.with_suffix(".txt")
    with lst.open("w") as fh:
        for p, secs in frames:
            fh.write(f"file '{p}'\nduration {secs:.2f}\n")
        fh.write(f"file '{frames[-1][0]}'\n")
    cmd = [
        FFMPEG, "-y", "-loglevel", "error",
        "-f", "concat", "-safe", "0", "-i", str(lst),
        "-vf", "fps=15,format=yuv420p",
        "-c:v", "libx264", "-preset", "veryfast", "-crf", "30",
        "-movflags", "+faststart", str(out),
    ]
    subprocess.run(cmd, check=True)
    lst.unlink(missing_ok=True)
    return out


def offer_key(day: dict) -> str:
    raw = day.get("offer_focus", "")
    for k in OFFERS:
        if k in raw:
            return k
    return ""


def cta_line(day: dict) -> str:
    k = offer_key(day)
    if not k:
        return f"NINE PACKS · {PRICE} EACH"
    return f"{k} · {PRICE} · MESSAGE {k}"


def offer_name(day: dict) -> str:
    k = offer_key(day)
    return OFFERS.get(k, "The nine Easywurld packs")


# --------------------------------------------------------------------------- blocks


def tiktok_video(pl: dict, day: dict, post: dict, out: Path, tmp: Path):
    """Kinetic-type (or meme) 9:16 video from the written beats."""
    beats = pl["beats"] or [pl["hook"]]
    hook = pl["hook"] or (beats[0] if beats else post["topic"])
    is_meme = "meme" in pl["format"].lower()
    dur = fmt_duration(pl["format"], 12 if is_meme else 22)

    frames: list[tuple[Path, float]] = []
    tag = f"{post['topic'][:40]} · DAY {day['day']:02d}"
    total = len(beats) + 2

    f0 = tmp / "f0.png"
    kit.video_frame(f0, text=hook, tag=tag, index=1, total=total, kind="hook")
    frames.append((f0, 3.0))

    if is_meme:
        # one card, all beats, held — a static meme with a readable hold
        fs = tmp / "fm.png"
        kit.meme(fs, lines=beats, tag=tag, topic=post["topic"])
        big = tmp / "fm_big.png"
        _to_916(fs, big)
        frames = [(big, max(dur - 3.0, 4.0))]
    else:
        each = max((dur - 5.5) / max(len(beats), 1), 1.4)
        for i, b in enumerate(beats):
            p = tmp / f"f{i+1}.png"
            kit.video_frame(p, text=b, tag=tag, index=i + 2, total=total,
                            kind="beat", topic=post["topic"])
            frames.append((p, each))

    end = tmp / "fz.png"
    k = offer_key(day)
    end_text = (f"Message {k} on WhatsApp\n{NUM}\n{offer_name(day)} · {PRICE}"
                if k else f"Nine packs · {PRICE} each\nMessage on WhatsApp\n{NUM}")
    kit.video_frame(end, text=end_text, tag="TAKE THE NEXT STEP", index=total,
                    total=total, kind="cta")
    frames.append((end, 2.5))
    encode(frames, out)


def _to_916(src: Path, dst: Path):
    """Pad a 4:5 meme onto a 9:16 canvas without cropping it."""
    from PIL import Image
    base = Image.new("RGB", (1080, 1920), kit.CREAM)
    im = Image.open(src).convert("RGB")
    im.thumbnail((1040, 1720), Image.LANCZOS)
    base.paste(im, ((1080 - im.width) // 2, (1920 - im.height) // 2))
    base.save(dst, "PNG", optimize=True)


def ig_carousel(pl: dict, day: dict, post: dict, folder: Path):
    slides = pl["slides"] or [pl["caption"][:120]]
    total = len(slides)
    for i, text in enumerate(slides, 1):
        cover = i == 1
        cta = ""
        low = text.lower()
        if i == total and ("₦" in text or "whatsapp" in low or "message" in low):
            cta = f"{offer_key(day) or 'NINE PACKS'} · {PRICE}"
        kit.slide(
            folder / f"Slide_{i:02d}.png",
            topic=post["topic"], text=text, index=i, total=total,
            tag=f"DAY {day['day']:02d} · {post['topic'][:34]}",
            cover=cover, cta=cta,
        )


def ig_static(pl: dict, day: dict, post: dict, folder: Path):
    slides = pl["slides"] or [pl["caption"][:120]]
    if "meme" in pl["format"].lower():
        kit.meme(folder / "Image_01.png", lines=slides,
                 tag=f"DAY {day['day']:02d} · MEME", topic=post["topic"])
    elif len(slides) == 1:
        kit.slide(folder / "Image_01.png", topic=post["topic"], text=slides[0],
                  index=1, total=1, tag=f"DAY {day['day']:02d} · {post['topic'][:34]}",
                  cover=True, cta=f"{offer_key(day) or 'NINE PACKS'} · {PRICE}")
    else:
        # list card: first line is the headline, the rest are numbered rows
        kit.list_card(folder / "Image_01.png",
                      head=slides[0], rows=slides[1:],
                      tag=f"DAY {day['day']:02d} · {post['topic'][:34]}",
                      cta=f"{offer_key(day) or 'NINE PACKS'} · {PRICE}")


def ig_reel(pl: dict, day: dict, post: dict, folder: Path, tmp: Path):
    slides = pl["slides"] or [post["topic"]]
    dur = fmt_duration(pl["format"], 25)
    each = max(dur / max(len(slides), 1), 2.2)
    frames = []
    total = len(slides)
    for i, s in enumerate(slides, 1):
        p = tmp / f"r{i}.png"
        kit.video_frame(p, text=s, tag=f"DAY {day['day']:02d} · {post['topic'][:34]}",
                        index=i, total=total, kind="hook" if i == 1 else "beat",
                        topic=post["topic"])
        frames.append((p, 3.2 if i == 1 else each))
    k = offer_key(day)
    end = tmp / "rz.png"
    kit.video_frame(end, text=f"Message {k} on WhatsApp\n{NUM}\n{offer_name(day)} · {PRICE}"
                    if k else f"Nine packs · {PRICE} each",
                    tag="TAKE THE NEXT STEP", index=total, total=total, kind="cta")
    frames.append((end, 2.6))
    encode(frames, folder / "Reel.mp4")
    # cover
    kit.video_frame(folder / "Reel_Cover.png", text=slides[0],
                    tag=f"DAY {day['day']:02d} · REEL", index=1, total=1, kind="hook")


def linkedin_pdf(pl: dict, day: dict, post: dict, out: Path, slides: list[str]):
    """Turn the carousel copy into a LinkedIn document post (1080x1350 pages)."""
    from reportlab.lib.pagesizes import landscape
    from reportlab.pdfgen import canvas as rc
    from reportlab.pdfbase import pdfmetrics
    from reportlab.pdfbase.ttfonts import TTFont

    try:
        pdfmetrics.registerFont(TTFont("Fraunces", kit.FR6))
        pdfmetrics.registerFont(TTFont("Inter", kit.IN))
        pdfmetrics.registerFont(TTFont("Mono", kit.MO7))
    except Exception:
        pass

    W, H = 1080, 1350
    c = rc.Canvas(str(out), pagesize=(W, H))
    c.setTitle(f"{post['topic']} — Easywurld")
    total = len(slides)
    for i, text in enumerate(slides, 1):
        c.setFillColorRGB(*[v / 255 for v in kit.CREAM])
        c.rect(0, 0, W, H, fill=1, stroke=0)
        c.setFillColorRGB(*[v / 255 for v in kit.PAPER])
        c.roundRect(46, 46, W - 92, H - 92, 30, fill=1, stroke=0)
        c.setFillColorRGB(*[v / 255 for v in kit.TERRA])
        c.rect(112, H - 152, 78, 7, fill=1, stroke=0)
        c.setFillColorRGB(*[v / 255 for v in kit.MUTED])
        c.setFont("Mono", 22)
        c.drawString(112, H - 118, f"DAY {day['day']:02d} · {post['topic'].upper()[:40]}")
        c.drawRightString(W - 112, H - 118, f"{i:02d} / {total:02d}")

        # headline, wrapped by measurement
        size = 62
        while size > 30:
            c.setFont("Fraunces", size)
            words, lines, cur = text.split(), [], ""
            for w in words:
                t = (cur + " " + w).strip()
                if c.stringWidth(t, "Fraunces", size) <= W - 240:
                    cur = t
                else:
                    lines.append(cur)
                    cur = w
            if cur:
                lines.append(cur)
            if len(lines) * size * 1.16 <= 720:
                break
            size -= 4
        c.setFillColorRGB(*[v / 255 for v in kit.DEEP])
        lh = size * 1.16
        ascent, descent = size * 0.75, size * 0.22
        block_h = (len(lines) - 1) * lh + ascent + descent
        y = H * 0.47 + block_h / 2 - ascent
        for ln in lines:
            c.drawString(112, y, ln)
            y -= lh

        c.setFillColorRGB(*[v / 255 for v in kit.MUTED])
        c.setFont("Mono", 18)
        c.drawString(112, 96, "EASYWURLD  ·  SIMPLIFY. OPTIMIZE. GROW.")
        c.drawRightString(W - 112, 96, "0905 069 0837")
        c.showPage()
    c.save()


# --------------------------------------------------------------------------- day


def build_day(day: dict, index: int) -> Path:
    date = START + dt.timedelta(days=index - 1)
    if (DAYS / f"Day_{index:02d}_{date.strftime('%a_%d-%b')}.zip").exists() and os.environ.get("DROP_RESUME") == "1":
        return DAYS / f"Day_{index:02d}_{date.strftime('%a_%d-%b')}.zip"
    stamp = date.strftime("%a %d %b")
    root_name = f"Day_{index:02d}_{date.strftime('%a_%d-%b')}"
    root = WORK / root_name
    if root.exists():
        shutil.rmtree(root)
    root.mkdir(parents=True)

    rows: list[dict] = []
    blocks: list[tuple[str, dict, dict]] = []
    for post in day["posts"]:
        for pl in post["platforms"]:
            blocks.append((pl["time"], post, pl))
    blocks.sort(key=lambda b: (b[0], b[1]["n"]))

    # stories sit at fixed times in the day's flow
    story_slots = {"08:45": "story_am", "21:45": "story_pm"}

    # ---- assign the clock order once, then render in the cheapest order -------
    plan_rows = []
    seq = 0
    for time_s, post, pl in blocks:
        seq += 1
        plan_rows.append((time_s, post, pl, seq, None))
    for st, kind in (("08:45", "story_am"), ("21:45", "story_pm")):
        seq += 1
        plan_rows.append((st, None, None, seq, kind))
    plan_rows.sort(key=lambda r: (r[0], r[3]))
    plan_rows = [(t, p_, pl_, i, k) for i, (t, p_, pl_, _s, k) in enumerate(plan_rows, 1)]

    by_post_ig = {}
    for time_s, post, pl, sq, kind in plan_rows:
        if pl is not None and pl["platform"] == "Instagram":
            by_post_ig[post["n"]] = (post, pl, sq)

    # 1. Instagram art first (Facebook mirrors it, so it must exist)
    for time_s, post, pl, sq, kind in plan_rows:
        if pl is not None and pl["platform"] == "Instagram":
            build_post(day, index, time_s, post, pl, sq, root, rows_append=None)

    rows = []
    for time_s, post, pl, sq, kind in plan_rows:
        if kind:
            rows.append(build_story(day, index, time_s, kind, sq, root))
        else:
            assert post is not None and pl is not None
            if pl["platform"] == "Instagram":
                name = f"{sq:02d}_{time_s.replace(':', '')}_Instagram_{slug(post['topic'])}"
                fdir = root / name
                rows.append({
                    "seq": sq, "time": time_s, "platform": "Instagram",
                    "format": pl["format"], "topic": post["topic"],
                    "folder": name,
                    "files": sorted(f.name for f in fdir.iterdir() if f.is_file()),
                    "caption": (pl["caption"] + ("\n\n" + pl["hashtags"] if pl["hashtags"] else "")).strip(),
                    "optional": pl["optional"],
                })
            else:
                rows.append(build_post(day, index, time_s, post, pl, sq, root,
                                       mirror=by_post_ig.get(post["n"])))

    write_day_docs(day, index, date, root, rows)

    zip_path = DAYS / f"{root_name}.zip"
    zip_path.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED, compresslevel=6) as z:
        for p in sorted(root.rglob("*")):
            z.write(p, p.relative_to(WORK))
    return zip_path


def build_post(day, index, time_s, post, pl, seq, root, mirror=None, rows_append=None) -> dict:
    platform = pl["platform"]
    fmt = pl["format"]
    is_video = platform == "TikTok" or "reel" in fmt.lower()
    kind = ("carousel" if "carousel" in fmt.lower()
            else "meme" if "meme" in fmt.lower()
            else "reel" if "reel" in fmt.lower()
            else "video" if is_video
            else "static")

    name = f"{seq:02d}_{time_s.replace(':', '')}_{platform}_{slug(post['topic'])}"
    folder = root / name
    already = folder.is_dir()
    folder.mkdir(exist_ok=True)

    tmp = folder / "_tmp"
    tmp.mkdir(exist_ok=True)
    (tmp / "keep").write_text("")

    if platform == "TikTok":
        tiktok_video(pl, day, post, folder / "video.mp4", tmp)
    elif platform == "Instagram" and kind == "carousel":
        ig_carousel(pl, day, post, folder)
    elif platform == "Instagram" and kind == "reel":
        ig_reel(pl, day, post, folder, tmp)
    elif platform == "Instagram":
        ig_static(pl, day, post, folder)
    elif platform == "Facebook":
        src = mirror
        copied = False
        if src:
            src_post, src_pl, src_seq = src
            src_name = f"{src_seq:02d}_{src_pl['time'].replace(':', '')}_Instagram_{slug(src_post['topic'])}"
            src_dir = root / src_name
            if src_dir.is_dir():
                for f in sorted(src_dir.iterdir()):
                    if f.is_file() and f.suffix in (".png", ".mp4", ".pdf"):
                        shutil.copy2(f, folder / f.name)
                copied = True
        if not copied:
            ig_carousel(pl, day, post, folder) if "carousel" in pl["format"].lower() \
                else ig_static(pl, day, post, folder)
    elif platform == "LinkedIn":
        slides = []
        for p2 in day["posts"]:
            if p2["n"] == post["n"]:
                for pl2 in p2["platforms"]:
                    if pl2["platform"] == "Instagram" and pl2["slides"]:
                        slides = pl2["slides"]
        if slides:
            linkedin_pdf(pl, day, post, folder / "document_linkedin.pdf", slides)

    shutil.rmtree(tmp, ignore_errors=True)

    caption = pl["caption"].strip()
    if pl["hashtags"]:
        caption = f"{caption}\n\n{pl['hashtags']}"
    (folder / "caption.txt").write_text(caption + "\n", encoding="utf-8")

    notes = [f"DAY {index:02d} · {time_s} WAT · {platform}", f"Format: {fmt}",
             f"Post idea: {post['topic']}", f"Type: {post['type']}",
             f"Why it works: {post['why']}", ""]
    if pl["hook"]:
        notes += ["HOOK (first 3 seconds)", pl["hook"], ""]
    if pl["beats"]:
        notes += ["ON-SCREEN BEATS"] + [f"- {b}" for b in pl["beats"]] + [""]
    if pl["voiceover"]:
        notes += ["VOICEOVER / TELEPROMPTER SCRIPT", pl["voiceover"], ""]
    if pl["slides"]:
        notes += ["CARD / SLIDE COPY"] + [f"{i}. {s}" for i, s in enumerate(pl["slides"], 1)] + [""]
    if pl["visual"]:
        notes += ["ART DIRECTION", pl["visual"], ""]
    if pl["platform"] == "TikTok":
        notes += ["SOUND", "Add a trending sound in the app. The file is silent on purpose.", ""]
    (folder / "notes.txt").write_text("\n".join(notes), encoding="utf-8")

    files = sorted(p.name for p in folder.iterdir() if p.is_file())
    return {
        "seq": seq, "time": time_s, "platform": platform, "format": fmt,
        "topic": post["topic"], "folder": name, "files": files,
        "caption": caption, "optional": pl["optional"],
    }


def build_story(day, index, time_s, kind, seq, root) -> dict:
    k = offer_key(day)
    am = kind == "story_am"
    top = day["posts"][0]
    hook = ""
    for pl in top["platforms"]:
        if pl["hook"]:
            hook = pl["hook"]
            break
    if am:
        head = hook or top["topic"]
        sub = "The full idea is on the feed today."
        cta = "TAP THROUGH TO THE POST"
        tag = f"DAY {index:02d} · STORY"
        name = f"{seq:02d}_{time_s.replace(':', '')}_Instagram-Story_today"
    else:
        head = f"{offer_name(day)}" if k else "Nine packs for small businesses"
        sub = f"{PRICE} · digital download · use it yourself"
        cta = f"MESSAGE {k}" if k else "MESSAGE US"
        tag = "EASYWURLD · STORY"
        name = f"{seq:02d}_{time_s.replace(':', '')}_Instagram-Story_offer"

    folder = root / name
    folder.mkdir()
    kit.story(folder / "Story.png", tag=tag, headline=head, sub=sub, cta=cta,
              index=1, total=2, dark=not am)
    kit.story(folder / "Story_alt.png", tag=tag, headline=head, sub=sub, cta=cta,
              index=2, total=2, dark=am)
    caption = (f"Story text: {head}\nSticker: {cta}\n"
               f"Link: https://wa.me/2349050690837\n")
    (folder / "caption.txt").write_text(caption, encoding="utf-8")
    notes = [f"DAY {index:02d} · {time_s} WAT · Instagram Story / WhatsApp Status",
             "15 seconds. Two images, both usable — pick one.",
             "Add the link sticker to https://wa.me/2349050690837",
             "Also post the same image to WhatsApp Status.", ""]
    (folder / "notes.txt").write_text("\n".join(notes), encoding="utf-8")
    return {"seq": seq, "time": time_s, "platform": "Story", "format": "Story 9:16",
            "topic": head, "folder": name, "files": ["Story.png", "Story_alt.png"],
            "caption": caption, "optional": False}


def write_day_docs(day, index, date, root, rows):
    k = offer_key(day)
    lines = [
        f"DAY {index:02d} · {date.strftime('%A %d %B %Y').upper()} · {day['theme'].upper()}",
        "=" * 72, "",
        f"Offer in focus: {offer_name(day)}" + (f"  ·  keyword {k}" if k else ""),
        "",
        "UNZIP THIS FOLDER. POST IN TIME ORDER. DELETE THE DAY WHEN DONE.",
        "",
        "Every post folder is numbered by the clock, so 01 is always your first post.",
        "That is 11 core posts plus two Stories (08:45 and 21:45).",
        "Inside each folder: the image or video, caption.txt, and notes.txt.",
        "caption.txt is the exact text to paste. Do not rewrite it on the day.",
        "",
        "-" * 72, "THE DAY AT A GLANCE", "-" * 72, "",
    ]
    for r in rows:
        opt = "  (optional)" if r.get("optional") else ""
        lines.append(f"{r['time']}  {r['platform']:<10} {r['format'][:38]:<40}{opt}")
        lines.append(f"        {r['folder']}")
    lines += [
        "", "-" * 72, "IF YOU ONLY HAVE TEN MINUTES", "-" * 72, "",
        "Post the offer post, one teaching post, and the 21:45 story.",
        "That is the minimum that keeps the account alive and selling.",
        "",
        "-" * 72, "SOUND AND CAPTIONS", "-" * 72, "",
        "Videos are silent and captions are burned in. Add a trending sound",
        "inside TikTok or Instagram before you publish — the file itself has no audio",
        "so the platform will not flag it for using licensed music.",
        "",
        "-" * 72, "SELAR", "-" * 72, "",
        f"Every pack is {PRICE}. Selar takes 4% + ₦50 per sale: you keep ₦4,750.",
        "Set 'buyer pays the fee' so the page price stays clean.",
        "Full sheet: 02 — THE NINE OFFERS — ready for Selar.",
        "",
        "WhatsApp 0905 069 0837 · Simplify. Optimize. Grow.",
    ]
    (root / "00_START_HERE.txt").write_text("\n".join(lines) + "\n", encoding="utf-8")

    with (root / "00_SCHEDULE.csv").open("w", newline="", encoding="utf-8") as fh:
        w = csv.writer(fh)
        w.writerow(["Date", "Weekday", "Time (WAT)", "Platform", "Format", "Post idea",
                    "Folder", "Optional"])
        for r in rows:
            w.writerow([date.isoformat(), date.strftime("%A"), r["time"], r["platform"],
                        r["format"], r["topic"], r["folder"],
                        "yes" if r.get("optional") else ""])

    price = ["THE NINE PACKS · WHAT THEY COST AND WHAT LANDS", "=" * 72, "",
             "Every pack is ₦5,000. Selar takes 4% + ₦50 per sale.", "",
             f"{'Pack':<42}{'Price':>9}{'Fee':>9}{'You get':>10}"]
    for name in OFFERS.values():
        price.append(f"{name:<42}{'₦5,000':>9}{'₦250':>9}{'₦4,750':>10}")
    price += ["", "Set 'buyer pays the fee' in Selar so ₦5,000 stays ₦5,000 on the page.",
              "", "Bundle all nine at ₦25,000: fee ₦1,050, you get ₦23,950.",
              "", "Message the keyword on WhatsApp: 0905 069 0837."]
    (root / "00_WHAT_YOU_CHARGE_SELAR.txt").write_text("\n".join(price) + "\n", encoding="utf-8")

    cap = [f"ALL CAPTIONS — DAY {index:02d} · {date.strftime('%A %d %B %Y')}", "=" * 72, ""]
    for r in rows:
        cap += [f"{r['time']} · {r['platform']} · {r['topic']}", "-" * 72,
                r["caption"], "", ""]
    (root / "00_ALL_CAPTIONS.txt").write_text("\n".join(cap), encoding="utf-8")


def month_sheet(days: list[dict]) -> None:
    """One CSV for the whole month, sorted by date+time."""
    out = OUT / "MONTH_SCHEDULE_30_DAYS.csv"
    with out.open("w", newline="", encoding="utf-8") as fh:
        w = csv.writer(fh)
        w.writerow(["Date", "Day", "Weekday", "Time (WAT)", "Platform", "Format",
                    "Theme", "Post idea", "Type", "Offer", "Folder", "Day zip"])
        for i, d in enumerate(days, 1):
            date = START + dt.timedelta(days=i - 1)
            blocks = sorted([(pl["time"], p, pl) for p in d["posts"] for pl in p["platforms"]],
                            key=lambda b: (b[0], b[1]["n"]))
            for t, p, pl in blocks:
                w.writerow([date.isoformat(), f"{i:02d}", date.strftime("%A"), t,
                            pl["platform"], pl["format"], d["theme"], p["topic"],
                            p["type"], d["offer_focus"],
                            f"{t.replace(':','')}_{pl['platform']}_{slug(p['topic'])}",
                            f"Day_{i:02d}_{date.strftime('%a_%d-%b')}.zip"])
            for st, label in (("08:45", "Story"), ("21:45", "Story")):
                w.writerow([date.isoformat(), f"{i:02d}", date.strftime("%A"), st,
                            label, "Story 9:16", d["theme"], "Story", "Story",
                            d["offer_focus"], "story", f"Day_{i:02d}_{date.strftime('%a_%d-%b')}.zip"])
    print(f"wrote {out}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--day", type=int)
    ap.add_argument("--all", action="store_true")
    ap.add_argument("--workers", type=int, default=1)
    args = ap.parse_args()

    plan = json.loads((OUT / "plan.json").read_text(encoding="utf-8"))
    WORK.mkdir(parents=True, exist_ok=True)
    DAYS.mkdir(parents=True, exist_ok=True)

    targets = plan if args.all else [plan[(args.day or 1) - 1]]
    workers = max(1, args.workers)
    if workers == 1:
        for day in targets:
            z = build_day(day, day["day"])
            print(f"Day {day['day']:02d}  {z.name}  {z.stat().st_size / 1e6:.1f} MB", flush=True)
    else:
        from concurrent.futures import ProcessPoolExecutor, as_completed
        done = 0
        with ProcessPoolExecutor(max_workers=workers) as ex:
            futs = {ex.submit(build_day, d, d["day"]): d["day"] for d in targets}
            for f in as_completed(futs):
                z = f.result()
                done += 1
                print(f"[{done:02d}/{len(targets)}] Day {futs[f]:02d}  {z.name}  "
                      f"{z.stat().st_size / 1e6:.1f} MB", flush=True)

    if args.all:
        month_sheet(plan)


if __name__ == "__main__":
    main()
