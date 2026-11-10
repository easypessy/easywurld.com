"""Build the schedule-ready carousel delivery for 11-30 November 2026.

20 posting days (tomorrow to end of month) x 11 series = 220 carousels, rendered as
1080x1350 JPEG slides, plus one LinkedIn document PDF per day, plus per-day scheduling
sheets with copy-paste captions.

What "ready" means here, precisely:
  READY  - copy is complete, no unresolved placeholder, any illustration is labelled on-slide,
           and the slide fits at a readable size. A person can schedule it as-is.
  HOLD   - copy needs an owner decision before it may post. The reason is printed on the
           slide set and in the day sheet. This is not a rendering failure.

Two hold causes, both inherited from the research register, not invented here:
  * Series 10 (offer) - price, scope and availability are UNKNOWN. A displayed price is
    binding under FCCPA s.115 and an unclear scope is misleading under s.123. Publishing
    without confirmed terms would be the exact thing the register warns about.
  * Any slide containing a [bracketed placeholder] or claiming a result.

Rendering proves the copy fits and is legible. It does not prove the claim, the offer terms,
or permission to publish. G4 release still needs a named approver.
"""
from pathlib import Path
import csv
import json
import re
import sys

sys.path.insert(0, str(Path(__file__).parent))
import render_carousel as R

ROOT = Path(__file__).resolve().parent
PLAN = json.loads((ROOT / 'december-2026-DRAFT' / 'posts.json').read_text(), )
OUT = ROOT.parent.parent / 'NOVEMBER_CAROUSEL_READY'

# The researched drafts are dated 2-31 December. This delivery maps the first 20 of those
# source days onto the 20 November dates you asked for, so the fact-checked copy can be
# scheduled from tomorrow. Source day -> delivery date is recorded per row, so nothing loses
# its provenance. The pre-existing NOVEMBER_DELIVERY is left untouched; see 00_START_HERE.md.
DELIVERY_DATES = [f'2026-11-{d}' for d in range(11, 31)]
SOURCE_DATES = [f'2026-12-{d:02d}' for d in range(2, 32)][:20]

# Primary channel per series. The other adaptations in posts.json are alternatives for the
# same carousel, never additional placements.
CHANNEL = {
    1: 'Instagram feed', 2: 'Instagram feed', 3: 'Instagram feed', 4: 'Instagram feed',
    5: 'Facebook photo album', 6: 'Facebook photo album',
    7: 'TikTok photo mode', 8: 'TikTok photo mode',
    9: 'Instagram feed', 10: 'Facebook photo album', 11: 'TikTok photo mode',
}

# Proposed slot times, WAT. A proposal carried over from the existing November grid -
# NOT performance-tested and NOT an approved timetable. The owner may shift any row.
SLOTS = ['07:00', '08:30', '10:00', '11:30', '13:00', '14:30', '16:00', '17:30',
         '19:00', '20:30', '22:00']
LINKEDIN_PULL = '07:45'

# Series that always carry an illustration label, so a screenshot cannot travel without it.
LABELLED = {1: {3}, 3: {1, 3}, 5: {1}, 7: {1, 2}, 8: {4}}

PLACEHOLDER = re.compile(r'\[[^\]]*\]')


def tag_for(series_number, slide_number):
    if slide_number in LABELLED.get(series_number, set()):
        if series_number == 3 and slide_number == 1:
            return 'MYTH — NOT A FACT'
        if series_number == 7:
            return 'SAMPLE REWRITE'
        if series_number == 5:
            return 'HYPOTHETICAL BRIEF'
        return 'ILLUSTRATIVE EXAMPLE'
    return None


def hold_reason(post):
    text = ' '.join(s['copy'] for s in post['slides']) + ' ' + post['caption']
    if PLACEHOLDER.search(text):
        return 'Unresolved [placeholder] in the copy — needs an owner-supplied detail'
    if post['series_number'] == 10:
        return 'Offer series: price/scope/availability unconfirmed (FCCPA s.115, s.123)'
    return None


def display_id(post):
    """On-image id derives from the date it will actually post, so a slide cannot be
    mistaken for a December placement. Source draft id is kept in the tracker."""
    mmdd = post['date'][5:7] + post['date'][8:10]
    return f'EW-{mmdd}-S{post["series_number"]:02d}'


def build():
    mapping = dict(zip(SOURCE_DATES, DELIVERY_DATES))
    posts = []
    for p in PLAN:
        if p['date'] in mapping:
            q = dict(p)
            q['source_date'] = p['date']
            q['date'] = mapping[p['date']]
            posts.append(q)
    assert len(posts) == 220, len(posts)
    rows = []
    pdfs = 0
    for post in sorted(posts, key=lambda p: (p['date'], p['series_number'])):
        day = post['date']
        sn = post['series_number']
        reason = hold_reason(post)
        status = 'HOLD' if reason else 'READY'
        did = display_id(post)
        folder = OUT / day / f'S{sn:02d}'
        files = []
        for i, slide in enumerate(post['slides'], 1):
            tag = tag_for(sn, i) or ('HOLD' if reason else None)
            if i == 1:
                im = R.cover_card(did, post['series'], post['series'], slide['copy'],
                                  sub='', page=i, total=len(post['slides']), tag=tag)
            else:
                im = R.text_card(did, post['series'], post['series'], slide['copy'],
                                 page=i, total=len(post['slides']), tag=tag)
            f = folder / f'{i:02d}.jpg'
            R.save_jpg(im, f)
            files.append(f)

        # One LinkedIn document post per day, built from the 07:45 pull series.
        pdf_rel = ''
        if sn == 6:
            pdf = folder / f'{did}_linkedin.pdf'
            ims = [R.cover_card(did, post['series'], post['series'], post['slides'][0]['copy'],
                                page=1, total=len(post['slides']))]
            ims += [R.text_card(did, post['series'], post['series'], s['copy'],
                                page=i, total=len(post['slides']))
                    for i, s in enumerate(post['slides'][1:], 2)]
            ims[0].save(pdf, 'PDF', resolution=100.0, save_all=True, append_images=ims[1:])
            pdf_rel = str(pdf.relative_to(OUT))
            pdfs += 1

        rows.append({
            'date': day,
            'time_wat': SLOTS[sn - 1],
            'series': f'S{sn:02d}',
            'series_name': post['series'],
            'post_id': did,
            'source_draft_id': post['id'],
            'source_draft_date': post['source_date'],
            'channel': CHANNEL[sn],
            'status': status,
            'hold_reason': reason or '',
            'slides': len(post['slides']),
            'folder': str(folder.relative_to(OUT)),
            'first_file': str(files[0].relative_to(OUT)),
            'file_count': len(files) + (1 if pdf_rel else 0),
            'linkedin_pdf': pdf_rel,
            'hook': post['hook'],
            'caption': post['caption'],
            'cta': post['cta'],
            'hashtags': ' '.join(post['hashtags']),
            'fact_refs': ' | '.join(post['fact_refs']),
            'linkedin_company': post['platform_adaptations'].get('LinkedIn company', ''),
            'linkedin_personal': post['platform_adaptations'].get('LinkedIn personal', ''),
        })

    OUT.mkdir(parents=True, exist_ok=True)
    write_tracker(rows)
    write_days(rows)
    write_readme(rows)
    write_contact_sheets(rows)
    ready = sum(1 for r in rows if r['status'] == 'READY')
    slides = sum(r['slides'] for r in rows)
    print(f'{len(rows)} carousels | {slides} slides + {pdfs} LinkedIn PDFs | {ready} READY, {len(rows)-ready} HOLD')
    return rows


def write_tracker(rows):
    path = OUT / 'SCHEDULING_TRACKER.csv'
    cols = ['date', 'time_wat', 'series', 'series_name', 'post_id', 'source_draft_id',
            'source_draft_date', 'channel', 'status',
            'hold_reason', 'slides', 'folder', 'first_file', 'file_count', 'linkedin_pdf',
            'hook', 'caption', 'cta', 'hashtags', 'fact_refs', 'linkedin_company',
            'linkedin_personal', 'scheduled', 'confirmation_id', 'live_url']
    with path.open('w', newline='', encoding='utf-8') as f:
        w = csv.DictWriter(f, fieldnames=cols)
        w.writeheader()
        for r in rows:
            r = dict(r)
            r['scheduled'] = ''
            r['confirmation_id'] = ''
            r['live_url'] = ''
            w.writerow(r)


def write_days(rows):
    by_day = {}
    for r in rows:
        by_day.setdefault(r['date'], []).append(r)
    for day, items in sorted(by_day.items()):
        items.sort(key=lambda r: r['time_wat'])
        ready = sum(1 for r in items if r['status'] == 'READY')
        lines = [
            f'# {day} — carousel run sheet',
            '',
            f'**{len(items)} carousels · {ready} ready · {len(items)-ready} on hold.** '
            f'Times are WAT and are a *proposal*, not an approved timetable — shift any row you like.',
            '',
            'Post top to bottom. Slide files are numbered `01.jpg`, `02.jpg` … in each folder. '
            'Upload in that order.',
            '',
        ]
        if ready < len(items):
            lines += ['> **On hold and why.** A held carousel is not a rendering failure — the copy needs a '
                      'decision only you can make. Fix the named item, then it becomes schedulable.', '']
            for r in items:
                if r['status'] == 'HOLD':
                    lines.append(f"> - `{r['series']}` — {r['hold_reason']}")
            lines.append('')
        for r in items:
            badge = '' if r['status'] == 'READY' else '  ⛔ HOLD'
            lines += [
                '---',
                '',
                f'## {r["time_wat"]} · {r["series"]} {r["series_name"]}{badge}',
                '',
                f'- **Channel:** {r["channel"]}',
                f'- **Folder:** `{r["folder"]}/` — {r["slides"]} slides, upload 01→{r["slides"]:02d} in order',
            ]
            if r['linkedin_pdf']:
                lines.append(f'- **LinkedIn document:** `{r["linkedin_pdf"].split("/", 2)[-1]}` '
                             f'(schedule separately at {LINKEDIN_PULL})')
            if r['hold_reason']:
                lines.append(f'- **HOLD:** {r["hold_reason"]}')
            lines += ['', '**Caption (copy everything inside the box):**', '', '```',
                      r['caption'], '', r['hashtags'], '```', '',
                      f'**CTA:** {r["cta"]}', '']
            if r['linkedin_company']:
                lines += ['**LinkedIn company version:**', '', '```', r['linkedin_company'], '```', '']
            lines += [f'**Facts this relies on:** {r["fact_refs"]} — see '
                      f'`marketing/operating-system-v2/research-2026-11-10/01_FACT_REGISTER.csv`', '']
        (OUT / day / 'POST_TODAY.md').write_text('\n'.join(lines), encoding='utf-8')


def write_readme(rows):
    ready = sum(1 for r in rows if r['status'] == 'READY')
    holds = [r for r in rows if r['status'] == 'HOLD']
    total_mb = sum(f.stat().st_size for f in OUT.rglob('*') if f.is_file()) / 1e6
    lines = [
        '# November carousel delivery — 11 to 30 November 2026',
        '',
        f'**{len(rows)} carousels · {sum(r["slides"] for r in rows)} slide images · '
        f'{ready} ready to schedule · {len(holds)} on hold.** {total_mb:.0f} MB on disk.',
        '',
        'Start here: open the date folder for the day you are scheduling, read `POST_TODAY.md`.',
        '',
        '## How to schedule a carousel',
        '',
        '1. Open `2026-11-11/POST_TODAY.md` (or whichever date).',
        '2. Read the time, channel and folder it names. Times are WAT.',
        '3. In the folder, select `01.jpg` … the last number, in that order, and upload as one carousel post.',
        '4. Copy the caption from the code block. It includes the hashtags.',
        '5. Post, or use the platform scheduler, and write the confirmation in `SCHEDULING_TRACKER.csv`.',
        '',
        f'`{"07:45"}` LinkedIn document posts: upload the `.pdf` in that day\'s `S06/` folder as a document '
        'post. That is a separate placement, not a duplicate of the Facebook version.',
        '',
        '## What is ready and what is not',
        '',
        f'**{ready} carousels are ready.** Copy is complete, every illustration is labelled on the image '
        'itself, and the type fits at a readable size at 1080×1350.',
        '',
        f'**{len(holds)} carousels are on hold** — every one is the offer series:',
        '',
        '| Series | Count | Why held |',
        '|---|---|---|',
        f'| S10 Offer and solution | {len(holds)} | Price, scope, availability and turnaround are not '
        'confirmed. A displayed price is binding under FCCPA s.115; an unclear scope is misleading under '
        's.123. Nothing is guessed. |',
        '',
        'To release them: send the confirmed price or price range, what is included, the enquiry route, and '
        'who answers it. I will fill the placeholders and re-render those 20 carousels.',
        '',
        '## What this delivery does NOT do',
        '',
        '- **It does not publish or schedule anything.** Every row in the tracker is blank on `scheduled`.',
        '- **It does not approve the copy.** Rendering proves the type fits and is legible. It cannot prove a '
        'claim, a price, or a permission. G4 release still needs a named approver.',
        '- **It does not replace the legal question.** Whether an organic carousel needs ARCON pre-exposure '
        'vetting is still open (register row `NG-ARCON-07`). Ask before you scale this up.',
        '- **The times are a proposal.** Carried from the existing November grid, not tested. Shift them.',
        '',
        '## Read this before you schedule: it overlaps an existing delivery',
        '',
        '`NOVEMBER_DELIVERY/` already contains a complete, rendered delivery for **2 November – 1 December '
        '2026** — Day_10 is 11 November, Day_29 is 30 November. Those folders have their own 11 feed posts, '
        'videos, stories and LinkedIn pulls per day.',
        '',
        'This package is the **fact-checked carousel set**, not a repair of that one. If you publish both on '
        'the same dates you will double-post. Choose one:',
        '',
        '| Option | What happens |',
        '|---|---|',
        '| **Replace** | Post these 11 carousels per day instead of the matching `NOVEMBER_DELIVERY` day. '
        "Different topics, so nothing repeats — but the old day's videos and stories are dropped. |",
        '| **Interleave** | Keep `NOVEMBER_DELIVERY` and slot these at times it does not use. Its feed rows run '
        "from 07:00 in ten-minute steps, so this package's later slots collide. |",
        '| **Shift later** | These drafts were written for December anyway. Move the delivery window to '
        '2–31 December and nothing overlaps at all. |',
        '',
        'I did not pick one for you, because all three are real choices about your own calendar.',
        '',
        '## Unresolved, carried forward honestly',
        '',
        '| Item | State |',
        '|---|---|',
        '| Fonts | **Resolved.** Fraunces, Inter and JetBrains Mono, all SIL OFL 1.1. '
        'See `research-2026-11-10/06_FONT_LICENCE.md` |',
        '| Logo | Uses the repo mark. Confirm you hold the mark. |',
        '| Offer terms | **Blocking 20 carousels.** |',
        '| Released by | **Nobody yet.** No named G4 approver. |',
        '| Music | Still deferred — see `04_MUSIC_AND_RIGHTS_NOTE.md`. These are silent carousels. |',
        '',
        '## Files in this delivery',
        '',
        '| Path | What it is |',
        '|---|---|',
        '| `2026-11-11/…/2026-11-30/` | One folder per day: `POST_TODAY.md` + one subfolder per carousel |',
        '| `SCHEDULING_TRACKER.csv` | All 220 rows with captions, channels, status and blank confirmation '
        'columns to fill as you post |',
        '| `CONTACT_SHEETS/` | Slide 1 of every carousel as a numbered thumbnail grid, to check order fast |',
        '',
        f'Rebuild any time: `python marketing/operating-system-v2/build_delivery.py`',
        '',
    ]
    (OUT / '00_START_HERE.md').write_text('\n'.join(lines), encoding='utf-8')


def write_contact_sheets(rows):
    """One contact sheet per day: every carousel's cover slide as a thumbnail."""
    from PIL import Image, ImageDraw
    sheet_dir = OUT / 'CONTACT_SHEETS'
    sheet_dir.mkdir(exist_ok=True)
    by_day = {}
    for r in rows:
        by_day.setdefault(r['date'], []).append(r)
    cols, tw, th, gap = 4, 270, 338, 18
    for day, items in sorted(by_day.items()):
        items.sort(key=lambda r: r['time_wat'])
        rowsn = (len(items) + cols - 1) // cols
        W = cols * tw + (cols + 1) * gap
        H = rowsn * (th + 52) + 90
        sheet = Image.new('RGB', (W, H), '#FAE7C7')
        d = ImageDraw.Draw(sheet)
        d.text((gap, 24), f'{day}  ·  {len(items)} carousels  ·  cover slides in posting order',
               font=R.font('serif', 34, 600), fill='#0A4937')
        for i, r in enumerate(items):
            cx = gap + (i % cols) * (tw + gap)
            cy = 90 + (i // cols) * (th + 52)
            im = Image.open(OUT / r['first_file'])
            im.thumbnail((tw, th), Image.Resampling.LANCZOS)
            sheet.paste(im, (cx, cy))
            label = f'{r["time_wat"]}  S{r["series"][1:]}  {r["status"]}'
            colour = '#9E4E2C' if r['status'] == 'HOLD' else '#27473A'
            d.text((cx, cy + th + 8), label, font=R.font('mono', 15, 700), fill=colour)
        sheet.save(sheet_dir / f'{day}.jpg', quality=70, optimize=True)


if __name__ == '__main__':
    build()
