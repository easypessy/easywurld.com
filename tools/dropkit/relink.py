#!/usr/bin/env python3
"""Regenerate only the LinkedIn document PDFs inside the built day folders."""
import json, sys, zipfile
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
import make
import kit

ROOT = make.ROOT
plan = json.loads((make.OUT / "plan.json").read_text(encoding="utf-8"))
done = 0
for day in plan:
    idx = day["day"]
    zips = list(make.DAYS.glob(f"Day_{idx:02d}_*.zip"))
    if not zips:
        continue
    root = make.WORK / zips[0].stem
    if not root.is_dir():
        continue
    for post in day["posts"]:
        for pl in post["platforms"]:
            if pl["platform"] != "LinkedIn":
                continue
            slides = []
            for p2 in day["posts"]:
                if p2["n"] == post["n"]:
                    for pl2 in p2["platforms"]:
                        if pl2["platform"] == "Instagram" and pl2["slides"]:
                            slides = pl2["slides"]
            if not slides:
                continue
            target = next((d for d in root.glob(f"*_LinkedIn_*") if make.slug(post["topic"])[:20] in d.name), None)
            if target is None:
                continue
            make.linkedin_pdf(pl, day, post, target / "document_linkedin.pdf", slides)
            done += 1
    # rezip in place
    zp = zips[0]
    with zipfile.ZipFile(zp, "w", zipfile.ZIP_DEFLATED, compresslevel=6) as z:
        for f in sorted(root.rglob("*")):
            z.write(f, f.relative_to(make.WORK))
print("rebuilt", done, "linkedin pdfs and rezipped days")
