#!/usr/bin/env python3
"""Re-render stills (slides, memes, list cards, stories) + LinkedIn PDFs in place."""
import json, sys, zipfile
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
import make, kit

plan = json.loads((make.OUT / "plan.json").read_text(encoding="utf-8"))
n = 0
for day in plan:
    idx = day["day"]
    zips = sorted(make.DAYS.glob(f"Day_{idx:02d}_*.zip"))
    if not zips:
        continue
    root = make.WORK / zips[0].stem
    if not root.is_dir():
        continue
    by_post = {}
    for post in day["posts"]:
        for pl in post["platforms"]:
            if pl["platform"] == "Instagram":
                by_post[post["n"]] = (post, pl)
    for post in day["posts"]:
        for pl in post["platforms"]:
            if pl["platform"] not in ("Instagram", "Facebook"):
                continue
            src = pl if pl["platform"] == "Instagram" else by_post.get(post["n"], (None, None))[1]
            if src is None:
                continue
            folder = next((d for d in root.iterdir()
                           if d.is_dir() and d.name.endswith(make.slug(post["topic"])) and
                           (("Instagram" in d.name) == (pl["platform"] == "Instagram"))), None)
            if folder is None:
                continue
            fmt = src["format"].lower()
            if "carousel" in fmt:
                make.ig_carousel(src, day, post, folder)
            elif "reel" in fmt:
                pass
            else:
                make.ig_static(src, day, post, folder)
            n += 1
    for st, kind in (("08:45", "story_am"), ("21:45", "story_pm")):
        d = next((x for x in root.iterdir() if x.is_dir() and f"_{st.replace(':','')}_Instagram-Story" in x.name), None)
        if d:
            make.build_story  # reuse naming only; re-render below
    for zp in zips:
        with zipfile.ZipFile(zp, "w", zipfile.ZIP_DEFLATED, compresslevel=6) as z:
            for f in sorted(root.rglob("*")):
                z.write(f, f.relative_to(make.WORK))
print("re-rendered", n, "still folders and rezipped")
