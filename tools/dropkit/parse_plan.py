#!/usr/bin/env python3
"""Parse launch-content/social-command/MONTH_POSTS.md into structured JSON.

The markdown is machine-generated and very regular:
  # Day N · Weekday · Weekday D Mon YYYY — Theme
  **Offer in focus:** Name · KEYWORD
  ## Post NN · Topic
  **Type:** X · **Why it works:** Y
  ### Platform · HH:MM · Format
  ...blocks...
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "launch-content" / "social-command" / "MONTH_POSTS.md"

DAY_RE = re.compile(r"^# Day (\d+) · ([^·]+) · ([^—]+) — (.+)$")
OFFER_RE = re.compile(r"^\*\*Offer in focus:\*\*\s*(.+)$")
POST_RE = re.compile(r"^## Post (\d+) · (.+)$")
TYPE_RE = re.compile(r"^\*\*Type:\*\*\s*([^·]+)·\s*\*\*Why it works:\*\*\s*(.+)$")
PLAT_RE = re.compile(r"^### (TikTok|Instagram|Facebook|LinkedIn) · (\d{2}:\d{2})( \(optional\))? · (.+)$")
NUM_RE = re.compile(r"^(\d+)\.\s+(.*)$")


def clean(s: str) -> str:
    return s.replace("\u00a0", " ").strip()


def parse() -> list[dict]:
    text = SRC.read_text(encoding="utf-8")
    lines = text.split("\n")
    days: list[dict] = []
    day = post = plat = None
    state = None          # which block we are filling
    buf: list[str] = []

    def flush():
        nonlocal buf, state
        if state is None or post is None:
            buf = []
            return
        body = [clean(x) for x in buf]
        if state == "blockquote":
            body = [x[1:].strip() if x.startswith(">") else x for x in body]
            while body and body[0] == "":
                body.pop(0)
            while body and body[-1] == "":
                body.pop()
            kept = []
            for x in body:
                if x == "" and (not kept or kept[-1] == ""):
                    continue
                kept.append(x)
            txt = "\n".join(kept).strip()
            if txt:
                if plat["_pending"] == "voiceover":
                    plat["voiceover"] = txt
                elif plat["_pending"] == "hook":
                    plat["hook"] = txt
                else:
                    plat["caption"] = (plat["caption"] + "\n\n" + txt).strip() if plat["caption"] else txt
        elif state == "bullets":
            items = [x.lstrip("-* ").strip() for x in body if x.strip()]
            if plat["_pending"] == "beats":
                plat["beats"] = items
            elif plat["_pending"] == "slides":
                plat["slides"] = items
        buf = []
        state = None

    for raw in lines:
        line = raw.rstrip()

        m = DAY_RE.match(line)
        if m:
            flush()
            day = {
                "day": int(m.group(1)),
                "weekday_plan": clean(m.group(2)),
                "date_plan": clean(m.group(3)),
                "theme": clean(m.group(4)),
                "offer_focus": "",
                "posts": [],
            }
            days.append(day)
            post = plat = None
            continue

        if day is None:
            continue

        m = OFFER_RE.match(line)
        if m:
            day["offer_focus"] = clean(m.group(1))
            continue

        m = POST_RE.match(line)
        if m:
            flush()
            post = {"n": int(m.group(1)), "topic": clean(m.group(2)), "type": "", "why": "", "platforms": []}
            day["posts"].append(post)
            plat = None
            continue

        m = TYPE_RE.match(line)
        if m:
            post["type"] = clean(m.group(1))
            post["why"] = clean(m.group(2))
            continue

        m = PLAT_RE.match(line)
        if m:
            flush()
            plat = {
                "platform": m.group(1),
                "time": m.group(2),
                "optional": bool(m.group(3)),
                "format": clean(m.group(4)),
                "hook": "",
                "beats": [],
                "voiceover": "",
                "slides": [],
                "caption": "",
                "hashtags": "",
                "visual": "",
                "_pending": "",
            }
            post["platforms"].append(plat)
            continue

        if plat is None:
            continue

        low = line.strip().lower()

        # inline one-liners
        if low.startswith("**hashtags:**"):
            flush()
            plat["hashtags"] = clean(line.split(":**", 1)[1])
            continue
        if low.startswith("**visual:**"):
            flush()
            plat["visual"] = clean(line.split(":**", 1)[1])
            continue

        # block starters
        if low.startswith("**hook"):
            flush()
            plat["_pending"] = "hook"
            state = "blockquote"
            continue
        if low.startswith("**on-screen beats"):
            flush()
            plat["_pending"] = "beats"
            state = "bullets"
            continue
        if low.startswith("**voiceover"):
            flush()
            plat["_pending"] = "voiceover"
            state = "blockquote"
            continue
        if low.startswith("**caption"):
            flush()
            plat["_pending"] = "caption"
            state = "blockquote"
            continue
        if low.startswith("**slide copy") or low.startswith("**script slides"):
            flush()
            plat["_pending"] = "slides"
            state = "bullets"
            continue

        if line.strip() == "---" or line.strip() == "":
            # a blank line ends a block only if the next line is not part of it
            if state is not None:
                buf.append("")
            continue

        if state is None:
            # bare blockquote = the whole post body (Facebook / LinkedIn)
            if line.startswith(">"):
                plat["_pending"] = "caption"
                state = "blockquote"
                buf.append(line)
            continue

        if state == "bullets":
            m = NUM_RE.match(line.strip())
            if m:
                buf.append(m.group(2))
            elif line.strip().startswith("-"):
                buf.append(line.strip())
            elif line.startswith(">"):
                buf.append(line)
        else:
            buf.append(line)

    flush()

    # tidy: drop the _pending helper, normalise empties
    for d in days:
        for p in d["posts"]:
            for pl in p["platforms"]:
                pl.pop("_pending", None)
                pl["slides"] = [s for s in pl["slides"] if s]
                pl["beats"] = [s for s in pl["beats"] if s]
    return days


def main() -> None:
    days = parse()
    out = ROOT / "build" / "drop" / "plan.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(days, ensure_ascii=False, indent=1), encoding="utf-8")

    n_plat = sum(len(p["platforms"]) for d in days for p in d["posts"])
    problems = []
    for d in days:
        if len(d["posts"]) != 11:
            problems.append(f"Day {d['day']}: {len(d['posts'])} posts")
        for p in d["posts"]:
            for pl in p["platforms"]:
                if not pl["caption"]:
                    problems.append(f"D{d['day']} P{p['n']} {pl['platform']} {pl['time']}: no caption")
                if pl["platform"] in ("TikTok",) and not pl["beats"]:
                    problems.append(f"D{d['day']} P{p['n']} TikTok: no beats")
                if "carousel" in pl["format"] and not pl["slides"]:
                    problems.append(f"D{d['day']} P{p['n']} IG: carousel with no slides")
    print(f"days={len(days)} posts={sum(len(d['posts']) for d in days)} platform_blocks={n_plat}")
    print(f"problems={len(problems)}")
    for p in problems[:25]:
        print("  -", p)
    sys.exit(0 if not problems else 1)


if __name__ == "__main__":
    main()
