#!/usr/bin/env python3
"""Pack the month for Google Drive, separated by day — the way the launch kit shipped.

Each day folder contains everything needed to schedule that day without opening
anything else:

  00_DAY_SHEET.md        every placement in click order: time, platform, format,
                         the exact file to attach, the caption file, the AI-label flag
  01_LINKEDIN.md         the seven LinkedIn posts (4 company + 3 personal): body,
                         first comment, format, asset
  02_CAPTIONS.md         the eleven feed posts × three platform captions
  assets/…               the rendered files: carousel slides, story frames, memes,
                         statics, posters, finished videos, LinkedIn PDFs

Two zip layouts are written, because Drive delivery is per day:

  day-zips/Day_01.zip … Day_30.zip   one zip per day — the unit you upload, replace
                                     and open. A day that gains finished videos gets
                                     re-zipped and re-uploaded on its own.
  zips/Easywurld_November_Days_01-10.zip, 11-20, 21-30
                                     the ten-day blocks kept for bulk download
                                     (Drive's 100 MB per-file limit is why they split).

--days 3-4 rebuilds and re-zips only those days; --no-decade skips the blocks.

Nothing here publishes anything. Every row is Draft until a human schedules it.
"""
from __future__ import annotations
import csv, json, shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / 'marketing/assets'
PACKS = ROOT / 'marketing/render/packs'
PLAN = json.loads((ROOT / 'marketing/content-plan.json').read_text())
POSTS = {p['id']: p for p in PLAN['posts']}
PRICE = 5000

WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']


def apath(rel):
    """Repo-relative asset path -> real file. 'assets/x' lives under marketing/assets."""
    return (ASSETS / rel[len('assets/'):]) if rel.startswith('assets/') else (ROOT / rel)


def post_files(p):
    """(list of repo-relative paths that exist, label, fallback label)."""
    out = []
    if p.get('slides'):
        out += [f'assets/carousels/{p["id"]}_slide-{i}.jpg' for i in range(1, 6)]
        return out, 'carousel — attach the five slides in order', out
    if p['seriesKey'] in ('meme1', 'meme2'):
        f = f'assets/memes/{p["id"]}.jpg'
        return [f], 'meme — one image', [f]
    if p['format'] == 'Relatable static':
        f = f'assets/static/{p["id"]}.jpg'
        return [f], 'static — one image', [f]
    mp4 = f'assets/video-ready/{p["id"]}.mp4'
    poster = f'assets/fallbacks/{p["id"]}.jpg'
    if apath(mp4).exists():
        return [mp4], 'finished video — upload as is', [mp4]
    return [poster], 'poster (the finished video is not rendered yet)', [poster]


def story_files(s):
    return [f'assets/stories/{s["id"]}_frame-{i}.jpg' for i in (1, 2, 3)]


def linkedin_files(l):
    if l['format'].startswith('Document'): return [f'assets/linkedin/{l["id"]}.pdf']
    if l['format'] == 'Native video':
        mp4 = f'assets/video-ready/{l["sourcePostId"]}.mp4'
        return [mp4] if apath(mp4).exists() else [f'assets/fallbacks/{l["sourcePostId"]}.jpg']
    if l['format'] == 'Image post': return [l['asset']] if l.get('asset') else []
    return []


def video_slots(posts):
    """[(id, topic, rendered)] for the day's video posts — a poster never passes as an MP4."""
    out = []
    for p in posts:
        if p.get('slides') or p['seriesKey'] in ('meme1', 'meme2') or p['format'] == 'Relatable static':
            continue
        mp4 = f'assets/video-ready/{p["id"]}.mp4'
        if not apath(mp4).exists() and not apath(f'assets/fallbacks/{p["id"]}.jpg').exists():
            continue
        out.append((p['id'], p['topic'], apath(mp4).exists()))
    return out


def build_day(day):
    posts = [p for p in PLAN['posts'] if p['day'] == day['day']]
    stories = [s for s in PLAN['stories'] if s['day'] == day['day']]
    li = [l for l in PLAN['linkedin'] if l['day'] == day['day']]
    vslots = video_slots(posts)
    vdone = [v for v in vslots if v[2]]
    folder = PACKS / f'Day_{day["day"]:02d}'
    assets = folder / 'assets'
    if folder.exists(): shutil.rmtree(folder)
    assets.mkdir(parents=True)

    copied, rows = [], []

    # ---- 00_DAY_SHEET.md
    md = [f'# Day {day["day"]:02d} · {day["iso"]} · {day["weekday"]}', '',
          f'**Daily offer:** {day["offerKeyword"]} · ₦{PRICE:,} DIY pack. Confirm price, contents, payment and delivery before any offer post goes live.', '',
          f'**{len(posts)} feed posts × 3 platforms · {len(stories)} stories × 3 platforms · {len(li)} LinkedIn posts.** Work top to bottom; every row is Draft until you schedule it.', '',
          (f'**Videos: {len(vdone)} of {len(vslots)} slots are finished MP4s.** See *Video status* at the bottom before posting any video slot.' if vslots else '**Videos:** no video slots today.'), '',
          '| # | Time WAT | Platform | Format | Post | File to attach | AI label |', '|---:|---|---|---|---|---|---|']
    i = 0
    placements = []
    for p in sorted(posts, key=lambda x: x['time']):
        files, label, _ = post_files(p)
        for platform in ['TikTok', 'Instagram', 'Facebook']:
            pl = p['platforms'][platform]
            i += 1
            placements.append((pl['time'], platform, pl['format'], p, files, pl['caption'], label))
            md.append(f"| {i} | {pl['time']} | {platform} | {pl['format']} | {p['id']} {p['topic']} | `{', '.join(Path(f).name for f in files)}` | {'YES' if p['aiDisclosure'] else '—'} |")
    for s in stories:
        files = story_files(s)
        for platform in ['Instagram', 'Facebook', 'TikTok']:
            pl = s['placements'][platform]
            i += 1
            placements.append((pl['time'], platform, pl['format'], s, files, pl['caption'], 'story frames'))
            md.append(f"| {i} | {pl['time']} | {platform} | Story | {s['id']} {s['series']} | `{', '.join(Path(f).name for f in files)}` | — |")
    for l in sorted(li, key=lambda x: x['time']):
        files = linkedin_files(l)
        i += 1
        placements.append((l['time'], 'LinkedIn', l['format'], l, files, l['body'], 'document/native video'))
        md.append(f"| {i} | {l['time']} | LinkedIn ({l['accountName']}) | {l['format']} | {l['id']} | `{', '.join(Path(f).name for f in files) if files else 'text only — see 01_LINKEDIN.md'}` | {'YES' if l['aiDisclosure'] else '—'} |")
    md += ['', '## Copy, in one place', '',
           '- `01_LINKEDIN.md` — the seven LinkedIn posts, bodies and first comments.',
           '- `02_CAPTIONS.md` — the eleven feed posts with all three platform captions.',
           '- `03_STORIES.md` — story frames, sticker and caption.', '',
           '## Trend gate', '']
    trends = [p for p in posts if p['seriesKey'] == 'trend']
    for t in trends:
        md.append(f"- `{t['id']}` {t['topic']} — dated source {t['sourceUrl']} ({t['sourceDate']}). Verify a current example or publish as a dated teardown only.")
    if not trends: md.append('- none today.')

    # ---- video status: never let a poster pass for a finished video
    md += ['', '## Video status', '']
    if vslots:
        md.append(f'**{len(vdone)} of {len(vslots)} video slots in this pack are finished.**' +
                  ('' if len(vdone) == len(vslots) else ' The rest carry a poster — **do not post those slots yet**; this day is re-uploaded when its MP4s land.'))
        md.append('')
        for vid, topic, ok in vslots:
            md.append(f'- `{vid}` {topic} — ' + ('finished MP4 (voiceover, music, burned captions, end card): upload as is' if ok
                                                else 'POSTER ONLY — not rendered yet, hold this slot'))
    else:
        md.append('- no video slots today.')
    (folder / '00_DAY_SHEET.md').write_text('\n'.join(md) + '\n')

    # ---- 01_LINKEDIN.md
    li_md = [f'# LinkedIn · Day {day["day"]:02d} · {day["iso"]}', '',
             'Four posts on the **Easywurld company page**, three on **Abu Israel’s personal profile** (https://www.linkedin.com/in/abu-israel-495b09226).',
             'Paste the body exactly. Post the first comment immediately after publishing. Two tags maximum, already in the caption.', '']
    for l in sorted(li, key=lambda x: (x['account'] != 'personal', x['time'])):
        li_md += [f'## {l["time"]} · {l["accountName"]} · {l["format"]}', '',
                  f'*Siphoned from {l["sourcePostId"]}. Asset: {", ".join(linkedin_files(l)) or "none — text only"}*', '',
                  '### Body', '', '```', l['body'], '```', '',
                  '### First comment', '', '```', l['firstComment'], '```', '']
        if l.get('poll'):
            li_md += ['### Poll', '', f'Question: {l["poll"]["question"]}', *[f'- {o}' for o in l['poll']['options']], '']
    (folder / '01_LINKEDIN.md').write_text('\n'.join(li_md) + '\n')

    # ---- 02_CAPTIONS.md
    cap = [f'# Feed captions · Day {day["day"]:02d} · {day["iso"]}', '',
           'Three captions per post on purpose: TikTok is native and short, Instagram is structured, Facebook is conversational. Do not reuse one across platforms.', '']
    for p in sorted(posts, key=lambda x: x['time']):
        cap += [f'## {p["time"]} · {p["id"]} · {p["series"]} · {p["format"]}', '', f'**Hook:** {p["hook"]}', '', f'**CTA:** {p["cta"]}']
        if p.get('offerKeyword'): cap.append(f'**Offer:** {p["offerName"]} · ₦{PRICE:,} DIY · keyword {p["offerKeyword"]}')
        if p['aiDisclosure']: cap.append('**AI label: enable the platform AI setting.**')
        cap.append('')
        for platform in ['TikTok', 'Instagram', 'Facebook']:
            pl = p['platforms'][platform]
            cap += [f'### {platform} · {pl["time"]} WAT', '', '```', pl['caption'], '```', '']
    (folder / '02_CAPTIONS.md').write_text('\n'.join(cap) + '\n')

    # ---- 03_STORIES.md
    st = [f'# Stories · Day {day["day"]:02d}', '']
    for s in stories:
        st += [f'## {s["time"]} · Story {s["slot"]} · {s["series"]}', '', 'Frames:', '',
               *[f'{i+1}. {f}' for i, f in enumerate(s['frames'])], '',
               f'**Sticker:** {s["sticker"]}', f'**CTA:** {s["cta"]}', '']
    (folder / '03_STORIES.md').write_text('\n'.join(st) + '\n')

    # ---- assets
    seen = set()
    for _, _, _, item, files, _, _ in placements:
        for f in files:
            src = apath(f)
            if f in seen or not src.exists(): continue
            seen.add(f)
            dest = assets / src.name
            n = 1
            while dest.exists():
                dest = assets / f'{src.stem}_{n}{src.suffix}'; n += 1
            shutil.copy2(src, dest)
            copied.append(dest.name)
    return folder, len(placements), copied


def zip_day(day_num, out_dir):
    """One zip per day — the unit that gets uploaded to Drive and replaced on its own."""
    import zipfile
    name = f'Day_{day_num:02d}'
    src = PACKS / name
    zip_path = out_dir / f'{name}.zip'
    with zipfile.ZipFile(str(zip_path), 'w', zipfile.ZIP_DEFLATED, compresslevel=6) as z:
        for f in sorted(src.rglob('*')):
            if f.is_file():
                z.write(f, f'Easywurld_November/{name}/{f.relative_to(src)}')
    return zip_path


def parse_days(spec):
    nums = set()
    for part in str(spec).split(','):
        part = part.strip()
        if not part:
            continue
        if '-' in part:
            a, b = part.split('-', 1)
            nums.update(range(int(a), int(b) + 1))
        else:
            nums.add(int(part))
    return sorted(n for n in nums if 1 <= n <= 30)


def main(argv=None):
    import argparse
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--days', help='rebuild and re-zip only these days, e.g. 3-4 or 1,3,11-12')
    ap.add_argument('--no-decade', action='store_true', help='skip the ten-day block zips')
    args = ap.parse_args(argv)

    only = parse_days(args.days) if args.days else None
    if only:
        for n in only:
            d = PACKS / f'Day_{n:02d}'
            if d.exists():
                shutil.rmtree(d)
    elif PACKS.exists():
        shutil.rmtree(PACKS)
    PACKS.mkdir(parents=True, exist_ok=True)

    days = [d for d in PLAN['days'] if not only or d['day'] in only]
    total = 0
    for d in days:
        folder, n, copied = build_day(d)
        total += n
        print(f'  Day {d["day"]:02d}: {n} placements · {len(copied)} files')

    dayz = PACKS / 'day-zips'
    dayz.mkdir(exist_ok=True)
    for d in days:
        zp = zip_day(d['day'], dayz)
        print(f'  day-zip {zp.name}  {zp.stat().st_size/1e6:.1f} MB')

    # ten-day blocks kept for bulk download; no block exceeds Drive's 100 MB per-file limit
    if not args.no_decade and not only:
        out = PACKS / 'zips'
        out.mkdir(exist_ok=True)
        import zipfile
        for a in (1, 11, 21):
            b = a + 9
            names = [f'Day_{i:02d}' for i in range(a, b + 1)]
            zip_path = out / f'Easywurld_November_Days_{a:02d}-{b:02d}'
            with zipfile.ZipFile(str(zip_path) + '.zip', 'w', zipfile.ZIP_DEFLATED, compresslevel=6) as z:
                for name in names:
                    for f in sorted((PACKS / name).rglob('*')):
                        if f.is_file():
                            z.write(f, f'Easywurld_November/{name}/{f.relative_to(PACKS / name)}')
            print(f'  zip {zip_path.name}.zip  {zip_path.with_suffix(".zip").stat().st_size/1e6:.1f} MB')
    print(f'Total placements packed: {total}')


if __name__ == '__main__':
    main()
