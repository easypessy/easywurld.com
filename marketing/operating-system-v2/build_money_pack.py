"""Build the 'November money' pack: everything about the offer carousels, in one place.

You asked for the money part of the November run, not the whole 98 MB delivery. This emits three
artifacts from the same data the site and the renderer use, so none of the figures are retyped:

  MONEY_PACK/00_NOVEMBER_MONEY.md          the briefing: price, what is being sold, the 20 slots
  MONEY_PACK/NOVEMBER_MONEY.csv            one row per offer post, ready for a spreadsheet
  MONEY_PACK/price_cards/EW-*.jpg          the 20 rendered price cards, in posting order

Nothing here is a forecast. There is no revenue projection, because there is no traffic, conversion
or audience data in this repository to base one on — inventing one would be the exact kind of claim
the rest of this package refuses to make.
"""
from pathlib import Path
import csv
import json
import shutil

import offers_data as O

ROOT = Path(__file__).resolve().parent
REPO = ROOT.parents[1]
DELIVERY = REPO / 'NOVEMBER_CAROUSEL_READY'
OUT = REPO / 'MONEY_PACK'
CARDS = OUT / 'price_cards'


def rows():
    with (DELIVERY / 'SCHEDULING_TRACKER.csv').open(newline='', encoding='utf-8') as f:
        all_rows = list(csv.DictReader(f))
    offer = [r for r in all_rows if r['series'] == 'S10']
    assert len(offer) == 20, len(offer)
    return all_rows, offer


def pack_for(row):
    """Match a tracker row back to its pack by the keyword in its CTA."""
    for p in O.PACKS:
        if f'Message {p["keyword"]} on WhatsApp' in row['cta']:
            return p
    raise ValueError(f"no pack keyword in {row['post_id']}: {row['cta']!r}")


def main():
    all_rows, offer = rows()
    OUT.mkdir(exist_ok=True)
    CARDS.mkdir(exist_ok=True)

    # Copy the rendered price cards, keeping the posting order in the filename.
    copied = []
    for i, r in enumerate(offer, 1):
        src = DELIVERY / r['folder'] / '06.jpg'
        if not src.exists():
            raise FileNotFoundError(src)
        dst = CARDS / f"{i:02d}_{r['date']}_{pack_for(r)['keyword']}.jpg"
        shutil.copy2(src, dst)
        copied.append(dst)

    # Per-post CSV. Costs and prices only — no projected revenue column.
    csv_path = OUT / 'NOVEMBER_MONEY.csv'
    with csv_path.open('w', newline='', encoding='utf-8') as f:
        cols = ['n', 'date', 'time_wat', 'post_id', 'pack_keyword', 'pack_name', 'category',
                'price_naira', 'replacement_cost_estimate_naira', 'file_count', 'files',
                'buyer', 'route', 'carousel_folder', 'price_card', 'status']
        w = csv.DictWriter(f, fieldnames=cols)
        w.writeheader()
        for i, (r, card) in enumerate(zip(offer, copied), 1):
            p = pack_for(r)
            w.writerow({
                'n': i,
                'date': r['date'],
                'time_wat': r['time_wat'],
                'post_id': r['post_id'],
                'pack_keyword': p['keyword'],
                'pack_name': p['name'],
                'category': p['category'],
                'price_naira': O.OFFER_PRICE,
                'replacement_cost_estimate_naira': p['value'],
                'file_count': p['file_count'],
                'files': ' | '.join(p['deliverables']),
                'buyer': p['buyer'],
                'route': f'Message {p["keyword"]} on WhatsApp (+{O.WA_PHONE})',
                'carousel_folder': r['folder'],
                'price_card': str(card.relative_to(OUT)),
                'status': r['status'],
            })

    # One contact sheet: all 20 price cards, so the month is readable at a glance.
    from PIL import Image, ImageDraw
    import render_carousel as R
    cols, tw, th, gap = 4, 300, 375, 20
    rowsn = (len(copied) + cols - 1) // cols
    sheet = Image.new('RGB', (cols*tw + (cols+1)*gap, rowsn*(th+46) + 96), R.FIELD)
    d = ImageDraw.Draw(sheet)
    d.text((gap, 26), f'{O.PRICE_LABEL} per pack · {len(copied)} offer carousels · 11–30 November 2026',
           font=R.font('serif', 30, 600), fill=R.GREEN)
    for i, (r, card) in enumerate(zip(offer, copied)):
        cx = gap + (i % cols) * (tw + gap)
        cy = 84 + (i // cols) * (th + 46)
        im = Image.open(card)
        im.thumbnail((tw, th), Image.Resampling.LANCZOS)
        sheet.paste(im, (cx, cy))
        p_ = pack_for(r)
        d.text((cx, cy + th + 6), f'{r["date"][5:]}  {r["time_wat"]}  {p_["keyword"]}',
               font=R.font('mono', 15, 700), fill=R.LEAF)
    sheet.save(OUT / 'ALL_20_PRICE_CARDS.jpg', quality=80, optimize=True)

    # The briefing.
    ready = sum(1 for r in offer if r['status'] == 'READY')
    lines = [
        '# November money — the offer carousels, ₦5,000',
        '',
        f'**{len(offer)} offer carousels · {ready} ready · {len(O.PACKS)} packs · '
        f'{O.PRICE_LABEL} each.** Every figure below is read from `client/src/data/offers.ts`, '
        'the same file the live site reads.',
        '',
        '## What is being sold',
        '',
        f'One pack is {O.PRICE_LABEL}. There are nine, one per problem. Each is a guide plus three '
        'editable files, sent on WhatsApp after payment. No consultation and no custom work is '
        'included — that is a separate, quoted service.',
        '',
        '| Keyword | Pack | Category | Files | Replacement-cost estimate |',
        '|---|---|---|---|---|',
    ]
    for p in O.PACKS:
        lines.append(f'| `{p["keyword"]}` | {p["name"]} | {p["category"]} | {p["file_count"]} | '
                     f'{O.naira(p["value"])} |')
    lines += [
        '',
        f'**Total replacement-cost estimate across all nine: {O.naira(O.TOTAL_VALUE)}.** This is the '
        "site's own estimate of what the files would cost to commission separately (hours × "
        f'{O.naira(O.RATE)}), and the site explicitly calls it *"not previous selling prices"*. It is '
        '**not** a former price, a discount baseline, or money you have earned. Nothing in this pack '
        'treats it as revenue.',
        '',
        '## How an order actually happens',
        '',
        f'1. A buyer messages a keyword (e.g. `PLAYBOOK`) on WhatsApp to +{O.WA_PHONE}.',
        '2. You reply with payment details. There is no checkout on the site.',
        '3. Once payment clears, you send the files on WhatsApp.',
        '',
        'That is the whole funnel: no cart, no email capture, no automated delivery. Which means the '
        'only metric that means anything here is **orders by keyword** — one off, not a rate.',
        '',
        '## The 20 slots',
        '',
        '| # | Date | Time (WAT) | Pack | Keyword | Price card |',
        '|---|---|---|---|---|---|',
    ]
    for i, (r, card) in enumerate(zip(offer, copied), 1):
        p = pack_for(r)
        lines.append(f'| {i} | {r["date"]} | {r["time_wat"]} | {p["name"]} | `{p["keyword"]}` | '
                     f'`{card.name}` |')
    lines += [
        '',
        'Times are a proposal carried from the existing November grid, not a tested timetable.',
        '',
        '## What is on the price cards',
        '',
        f'Each card shows {O.PRICE_LABEL}, the pack name, the file count, a one-line list of what '
        'arrives, the WhatsApp keyword button, and the boundary ("no consultation or custom work"). '
        'The full carousel behind each card is six slides: hook, who it is for, the problem, what '
        'arrives, the order route, then the price card.',
        '',
        '## What is deliberately absent',
        '',
        '| Not on any card | Why |',
        '|---|---|',
        '| A struck-through or "was" price | There is no former price. The estimate is a replacement '
        'cost, and presenting it as a discount would be a misleading representation under FCCPA s.123 |',
        '| A discount, saving, or countdown | Same reason. Nothing is on offer here except a fixed price |',
        f'| {O.naira(O.TOTAL_VALUE)} shown as a price | The site itself calls that an estimate, not a price it charged |',
        '| A revenue forecast | There is no traffic, conversion or audience data in this repository. '
        'Any number would be invented |',
        '| A guarantee of sales, followers, rankings or traffic | The site\'s own FAQ rules these out |',
        '',
        'A displayed price is binding under FCCPA s.115, so the figure on the card must equal the '
        'figure on the live site on the day you post. `check.py` fails the build if any slide quotes '
        'a different figure, if a price appears outside S10, or if discount framing sits near a naira '
        'amount.',
        '',
        '## Where the rest of it lives',
        '',
        '| What | Where |',
        '|---|---|',
        '| Full six-slide carousels, captions, hashtags | `NOVEMBER_CAROUSEL_READY/<date>/S10/` |',
        '| Every carousel, all series | `NOVEMBER_CAROUSEL_READY/SCHEDULING_TRACKER.csv` |',
        '| Scheduling and price-change instructions | `NOVEMBER_CAROUSEL_READY/00_START_HERE.md` |',
        '| Why each claim is allowed | `marketing/operating-system-v2/research-2026-11-10/01_FACT_REGISTER.csv` |',
        '',
        '## Still true, and worth saying plainly',
        '',
        '- **Nothing is scheduled.** All 220 rows have blank confirmation columns.',
        '- **Nothing is approved.** G4 needs a named approver.',
        '- **No money has been earned.** This pack is the material to sell with, not a result.',
        '- Whether organic carousels need ARCON pre-exposure vetting is still open (`NG-ARCON-07`).',
        '',
    ]
    (OUT / '00_NOVEMBER_MONEY.md').write_text('\n'.join(lines), encoding='utf-8')

    total = sum(f.stat().st_size for f in OUT.rglob('*') if f.is_file())
    print(f'{OUT.relative_to(REPO)}: {len(copied)} price cards, {csv_path.name}, '
          f'00_NOVEMBER_MONEY.md · {total/1e6:.1f} MB')
    return OUT


if __name__ == '__main__':
    main()
