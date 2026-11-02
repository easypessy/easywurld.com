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
import csv, json, os, shutil
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


FONT_DIR = Path(os.environ.get('EASYWURLD_FONT_DIR', Path.home() / '.cache/easywurld-fonts'))
SANS = 'Inter[opsz,wght].ttf'


def font(size, weight=600):
    """Inter from the build environment; falls back so packs still build without fonts."""
    from PIL import ImageFont
    try:
        f = ImageFont.truetype(str(FONT_DIR / SANS), int(size))
        axes = f.get_variation_axes(); values = [a['default'] for a in axes]
        for i, a in enumerate(axes):
            if a['name'] == b'Weight': values[i] = weight
            if a['name'] in (b'Optical Size', b'Optical size'): values[i] = min(24, a['maximum'])
        f.set_variation_by_axes(values)
        return f
    except Exception:
        return ImageFont.load_default()


def hhm(t):
    return str(t).replace(':', '')


def dest_names(item, files):
    """Ordered, self-labelling names for a day's assets folder.

    `HHMM_POSTID_i-of-n.ext` — so the folder sorts into posting order and every
    slide of a carousel carries its own position in its name. Nobody has to guess
    the arrangement from a file called `slide-3`.
    """
    t = hhm(item.get('time', '00:00'))
    base = item['id']
    n = len(files)
    return [f'{t}_{base}_{i + 1}of{n}{Path(f).suffix}' if n > 1 else f'{t}_{base}{Path(f).suffix}'
            for i, f in enumerate(files)]


def montage(title, sub, paths, cols=3, cell=(386, 482), labels=None):
    """One contact-sheet page: numbered thumbnails, in order, so the arrangement is visible."""
    import textwrap
    from PIL import Image, ImageDraw
    W = 1240
    PAPER = (251, 249, 244); INK = (20, 23, 15); GREEN = (10, 73, 55); CREAM = (250, 231, 199); LINE = (216, 213, 197)
    lines = textwrap.wrap(sub, 92) or ['']
    rows = -(-len(paths) // cols)
    H = 190 + 30 * (len(lines) - 1) + rows * (cell[1] + 96) + 100
    page = Image.new('RGB', (W, H), PAPER)
    d = ImageDraw.Draw(page)
    d.text((60, 54), title, font=font(40, 700), fill=INK)
    for k, ln in enumerate(lines):
        d.text((60, 108 + 30 * k), ln, font=font(24, 500), fill=GREEN)
    yline = 108 + 30 * len(lines)
    d.line([(60, yline), (W - 60, yline)], fill=LINE, width=2)
    gap = 24
    x0, y0 = 60, yline + 38
    for i, p in enumerate(paths):
        r, c = divmod(i, cols)
        x = x0 + c * (cell[0] + gap); y = y0 + r * (cell[1] + 96)
        if not Path(p).exists():
            d.rectangle([x, y, x + cell[0], y + cell[1]], outline=LINE, width=2)
            d.text((x + 12, y + 12), 'missing', font=font(22), fill=INK)
            continue
        im = Image.open(p).convert('RGB')
        im.thumbnail(cell)
        ox = x + (cell[0] - im.width) // 2; oy = y + (cell[1] - im.height) // 2
        page.paste(im, (ox, oy))
        d.rectangle([ox, oy, ox + im.width, oy + im.height], outline=LINE, width=2)
        # position badge — the whole point of the page
        bw, bh = 76, 62
        d.rectangle([ox + 8, oy + 8, ox + 8 + bw, oy + 8 + bh], fill=GREEN)
        d.text((ox + 26, oy + 16), str(i + 1), font=font(38, 700), fill=CREAM)
        shown = (labels[i] if labels and i < len(labels) else Path(p).name)
        d.text((ox, oy + im.height + 12), f'{i + 1} of {len(paths)}', font=font(26, 700), fill=GREEN)
        d.text((ox, oy + im.height + 44), shown, font=font(19, 500), fill=INK)
    d.text((60, H - 64), 'Attach in this numbered order. File names in assets/ carry the same position.',
           font=font(22, 500), fill=GREEN)
    return page


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
        dn = dest_names(p, files)
        for platform in ['TikTok', 'Instagram', 'Facebook']:
            pl = p['platforms'][platform]
            i += 1
            placements.append((pl['time'], platform, pl['format'], p, files, dn, pl['caption'], label))
            md.append(f"| {i} | {pl['time']} | {platform} | {pl['format']} | {p['id']} {p['topic']} | `{', '.join(dn)}` | {'YES' if p['aiDisclosure'] else '—'} |")
    for s in stories:
        files = story_files(s)
        dn = dest_names(s, files)
        for platform in ['Instagram', 'Facebook', 'TikTok']:
            pl = s['placements'][platform]
            i += 1
            placements.append((pl['time'], platform, pl['format'], s, files, dn, pl['caption'], 'story frames'))
            md.append(f"| {i} | {pl['time']} | {platform} | Story | {s['id']} {s['series']} | `{', '.join(dn)}` | — |")
    for l in sorted(li, key=lambda x: x['time']):
        files = linkedin_files(l)
        dn = dest_names(l, files)
        i += 1
        placements.append((l['time'], 'LinkedIn', l['format'], l, files, dn, l['body'], 'document/native video'))
        md.append(f"| {i} | {l['time']} | LinkedIn ({l['accountName']}) | {l['format']} | {l['id']} | `{', '.join(dn) if files else 'text only — see 01_LINKEDIN.md'}` | {'YES' if l['aiDisclosure'] else '—'} |")
    md += ['', '## How to attach the files', '',
           'Every file in `assets/` is named **`HHMM_POSTID_position-of-total`** — for example '
           '`0700_EW-D01-S01_3of5.jpg` is the 07:00 post, slide 3 of 5. Sort the folder by name and it is '
           'already in posting order.', '',
           '- **Carousels:** attach the five slides in the numbered order (`1of5` → `5of5`). '
           '`04_CAROUSELS.md` lists each carousel slide by slide with what it says, and '
           '`05_CONTACT_SHEETS.pdf` shows all five side by side, numbered, so you can check the '
           'arrangement at a glance before you post.',
           '- **Stories:** three frames, `1of3` → `3of3`, in that order.',
           '- **Videos:** one MP4, nothing to arrange — upload as is.',
           '- **LinkedIn:** one PDF per document post; the native video slot uses the same MP4 as the feed.', '',
           '## Copy, in one place', '',
           '- `01_LINKEDIN.md` — the seven LinkedIn posts, bodies and first comments.',
           '- `02_CAPTIONS.md` — the eleven feed posts with all three platform captions.',
           '- `03_STORIES.md` — story frames in order, sticker and caption.',
           '- `04_CAROUSELS.md` — every carousel slide by slide: file name, position, what it says.',
           '- `05_CONTACT_SHEETS.pdf` — numbered contact sheets: carousels and stories, in order.', '',
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
                  f'*Siphoned from {l["sourcePostId"]}. File to attach: {", ".join(dest_names(l, linkedin_files(l))) or "none — text only"}*', '',
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
    st = [f'# Stories · Day {day["day"]:02d}', '',
          'Three frames per story, posted in this order. The position is in the file name (`1of3` → `3of3`).', '']
    for s in stories:
        dn = dest_names(s, story_files(s))
        st += [f'## {s["time"]} · Story {s["slot"]} · {s["series"]}', '', 'Frames, in order:', '',
               *[f'{i+1}. `{dn[i]}` — {f}' for i, f in enumerate(s['frames'])], '',
               f'**Sticker:** {s["sticker"]}', f'**CTA:** {s["cta"]}', '']
    (folder / '03_STORIES.md').write_text('\n'.join(st) + '\n')

    # ---- 04_CAROUSELS.md  (the arrangement, slide by slide)
    cars = sorted([p for p in posts if p.get('slides')], key=lambda x: x['time'])
    cm = [f'# Carousel arrangement · Day {day["day"]:02d} · {day["iso"]}', '',
          f'{len(cars)} carousels today, five slides each. **Attach them in the numbered order.** '
          'The position is in the file name (`1of5` → `5of5`) and `05_CONTACT_SHEETS.pdf` shows every '
          'carousel side by side, numbered, so you can check the arrangement before you post.', '',
          'Instagram, TikTok photo posts and Facebook all keep the order you select the files in — '
          'so select `1of5` first, then `2of5`, and so on.', '']
    for p in cars:
        files = [f'assets/carousels/{p["id"]}_slide-{i}.jpg' for i in range(1, 6)]
        dn = dest_names(p, files)
        pl = p['platforms']
        cm += [f'## {p["time"]} · {p["id"]} · {p["series"]} · {p["topic"]}', '',
               f'Post to: TikTok {pl["TikTok"]["time"]} · Instagram {pl["Instagram"]["time"]} · Facebook {pl["Facebook"]["time"]} WAT', '',
               '| Slide | File in `assets/` | What it says |', '|---:|---|---|']
        for i, txt in enumerate(p['slides']):
            one = ' / '.join(x.strip() for x in str(txt).split('\n') if x.strip()).replace('|', '/')
            cm.append(f'| **{i+1}** | `{dn[i]}` | {one} |')
        cm += ['', f'**Hook:** {p["hook"]}', '', f'**CTA:** {p["cta"]}', '',
               f'**Caption:** `02_CAPTIONS.md` → {p["time"]} · {p["id"]} (one caption per platform — do not reuse).',
               f'**AI label:** {"YES — enable the platform AI setting" if p["aiDisclosure"] else "no"}', '']
    (folder / '04_CAROUSELS.md').write_text('\n'.join(cm) + '\n')

    # ---- 05_CONTACT_SHEETS.pdf  (the arrangement, visible)
    pages = []
    for p in cars:
        files = [apath(f'assets/carousels/{p["id"]}_slide-{i}.jpg') for i in range(1, 6)]
        dn = dest_names(p, [f'assets/carousels/{p["id"]}_slide-{i}.jpg' for i in range(1, 6)])
        pages.append(montage(f'{p["time"]}  ·  {p["id"]}  ·  carousel, 5 slides',
                             f'{p["topic"]}   |   attach in this order: {dn[0]} → {dn[-1]}',
                             files, cols=3, cell=(360, 450), labels=dn))
    for s in stories:
        files = [apath(f) for f in story_files(s)]
        dn = dest_names(s, story_files(s))
        pages.append(montage(f'{s["time"]}  ·  {s["id"]}  ·  story, 3 frames',
                             f'{s["series"]}   |   post in this order: {dn[0]} → {dn[-1]}',
                             files, cols=3, cell=(300, 533), labels=dn))
    if pages:
        pages[0].save(str(folder / '05_CONTACT_SHEETS.pdf'), 'PDF', save_all=True,
                      append_images=pages[1:], resolution=150.0)

    # ---- assets, copied under their ordered names
    seen = set()
    for row in placements:
        files, dn = row[4], row[5]
        for f, name in zip(files, dn):
            src = apath(f)
            if f in seen or not src.exists(): continue
            seen.add(f)
            shutil.copy2(src, assets / name)
            copied.append(name)
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
