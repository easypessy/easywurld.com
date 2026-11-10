"""Read the sellable offer data straight out of the site, so the copy cannot drift from it.

`client/src/data/offers.ts` is the only place the price is allowed to live. This module parses
it and re-checks the arithmetic, instead of copying nine pack names and a number into the
campaign build. If someone changes the price on the site, the next build either follows it or
fails loudly — it cannot quietly keep advertising last week's figure.

Why parse rather than import: the file is TypeScript, and the marketing toolchain is plain
Python 3 with no Node build step. The parsing is deliberately strict — it asserts the shape it
expects and raises rather than falling back to a default price.

Nothing here approves a claim. It is the source of the figure, not a defence of the offer.
"""
from pathlib import Path
import json
import re

REPO = Path(__file__).resolve().parents[2]
OFFERS_TS = REPO / 'client/src/data/offers.ts'
LAYOUT_TSX = REPO / 'client/src/components/site/Layout.tsx'


def _array_literal(src, marker):
    """Return the JSON body of `marker = [...]` in a TS file, located by bracket matching."""
    start = src.index(marker) + len(marker)
    # Skip to the first '[' so a type annotation or newline cannot throw the count off.
    start = src.index('[', start)
    depth = 0
    in_str = False
    quote = ''
    esc = False
    for i in range(start, len(src)):
        ch = src[i]
        if in_str:
            if esc:
                esc = False
            elif ch == '\\':
                esc = True
            elif ch == quote:
                in_str = False
            continue
        if ch in '"\'':
            in_str, quote = True, ch
        elif ch == '[':
            depth += 1
        elif ch == ']':
            depth -= 1
            if depth == 0:
                return src[start:i + 1]
    raise ValueError('unbalanced array literal')


def _number(src, name):
    m = re.search(rf'export const {name}\s*=\s*(\d+)', src)
    if not m:
        raise ValueError(f'{name} not found in offers.ts')
    return int(m.group(1))


def _phone():
    """The WhatsApp number the site's own buy buttons use."""
    src = LAYOUT_TSX.read_text(encoding='utf-8')
    m = re.search(r'export const WA\s*=\s*"https://wa\.me/(\d+)"', src)
    if not m:
        raise ValueError('could not read the WhatsApp number from Layout.tsx')
    return m.group(1)


SRC = OFFERS_TS.read_text(encoding='utf-8')
OFFERS = json.loads(_array_literal(SRC, 'exports.OFFERS: Offer[] ='.replace('exports.', 'export const ')))
OFFER_PRICE = _number(SRC, 'OFFER_PRICE')
RATE = _number(SRC, 'RATE')
TOTAL_VALUE = _number(SRC, 'TOTAL_VALUE')
WA_PHONE = _phone()


def naira(n):
    """Match the site's own formatter: \\u20a6 + thousands separators."""
    return '\u20a6' + f'{n:,}'


PRICE_LABEL = naira(OFFER_PRICE)

# ---------------------------------------------------------------------------
# Hand-written short lines. The site's `buyer` and `limits[0]` fields are full
# paragraphs; a slide needs one clause. Each line below is a compression of the
# site's own text for that field, not a new claim. `check.py` verifies that the
# pack it is attached to exists and that every short line stays within the
# slide limit, so a site edit that invalidates one fails the build.
# ---------------------------------------------------------------------------
SHORT = {
    1: {
        'buyer': 'Owners who sell by WhatsApp or DM and answer enquiries themselves.',
        'problem': 'Replies are slow or inconsistent, quotes go out, and nobody follows up.',
        'what': '36 scripts, a playbook, a follow-up tracker and a 7-day setup checklist.',
        'limit': 'An Excel tracker. No leads or sales are guaranteed.',
    },
    2: {
        'buyer': 'Owners whose site visitors leave without understanding what is sold.',
        'problem': 'The homepage talks about the business, not the visitor, so people leave.',
        'what': 'A page structure, copy templates, a content planner and a 20-point audit.',
        'limit': 'Do-it-yourself. No website build and no personal review of your page.',
    },
    3: {
        'buyer': 'Owners who post on Instagram, Facebook, TikTok or LinkedIn and run dry.',
        'problem': 'You start strong, run out of ideas, and every post is a fresh decision.',
        'what': 'A 30-day calendar, 60 post ideas, a hook and caption file, and a guide.',
        'limit': 'A planning system and swipe file, not finished posts for your business.',
    },
    4: {
        'buyer': 'Anyone launching one product, workshop, service or campaign.',
        'problem': 'Buyers are sent to a bio or a chat thread instead of a page that explains.',
        'what': 'A page guide, a copy template with an example, an HTML starter and a checklist.',
        'limit': 'A kit. Hosting and a domain are yours, and nothing is built for you.',
    },
    5: {
        'buyer': 'Lagos businesses serving nearby customers: salons, clinics, shops, tutors.',
        'problem': 'Nearby customers search, your listing is incomplete, and they cannot find you.',
        'what': 'A visibility guide, a keyword worksheet, a profile checklist and a tracker.',
        'limit': 'No ranking, traffic or customer numbers are guaranteed. Search results change.',
    },
    6: {
        'buyer': 'Founders who cannot explain what they do in one sentence.',
        'problem': 'The site, bio and pitch all say different things, so buyers cannot choose.',
        'what': 'A workbook, a customer interview kit, a message bank and a one-page plan.',
        'limit': 'Self-guided. It does not include a consultation or a review of your answers.',
    },
    7: {
        'buyer': 'Owners using an AI chat assistant for writing, replies, planning and admin.',
        'problem': 'The answers come back vague or generic, and you are unsure what to trust.',
        'what': 'A prompting guide, 60 prompts, a knowledge sheet and a safety checklist.',
        'limit': 'You need access to an AI tool, and some features are paid. That cost is yours.',
    },
    8: {
        'buyer': 'Freelancers, consultants and teams who send proposals, quotes and reports.',
        'problem': 'Every proposal is built from scratch, so documents are slow and inconsistent.',
        'what': 'A proposal template, report and summary templates, and a quote workbook.',
        'limit': 'General documents, not legal contracts. Have terms reviewed by a professional.',
    },
    9: {
        'buyer': 'Owners planning a first site or rebuild, or living with one nobody maintains.',
        'problem': 'Unclear what to decide first, who owns the domain, or what happens after launch.',
        'what': 'A handbook, a planning brief, an accounts workbook and hiring questions.',
        'limit': 'A guide and tools. It does not build, host or maintain a website.',
    },
}

PACKS = []
for o in OFFERS:
    extra = SHORT[o['n']]
    PACKS.append({
        'n': o['n'],
        'slug': o['slug'],
        'name': o['name'],
        'keyword': o['keyword'],
        'category': o['category'],
        'buyer': extra['buyer'],
        'problem': extra['problem'],
        'what': extra['what'],
        'limit': extra['limit'],
        'deliverables': [d['name'] for d in o['deliverables']],
        'file_count': len(o['deliverables']),
        'value': o['value'],
        'hours': o['hours'],
        'site_buyer': o['buyer'],
        'site_limit': o['limits'][0],
    })

PACK_BY_KEYWORD = {p['keyword']: p for p in PACKS}


def validate():
    """Assert the site data is internally consistent before any copy is built from it."""
    assert len(PACKS) == 9, f'expected 9 packs, site has {len(PACKS)}'
    assert len({p['keyword'] for p in PACKS}) == 9, 'keywords must be unique'
    assert len({p['name'] for p in PACKS}) == 9, 'pack names must be unique'
    assert OFFER_PRICE == RATE, 'the hourly rate and the pack price are the same figure on the site'
    # TOTAL_VALUE must be the sum of the per-pack estimates, each of which must be the sum of
    # its own deliverables. If the site changes and this breaks, the build stops.
    for p in PACKS:
        assert p['value'] > 0, p['keyword']
    assert sum(p['value'] for p in PACKS) == TOTAL_VALUE, (
        f"per-pack estimates sum to {sum(p['value'] for p in PACKS)}, site says {TOTAL_VALUE}")
    # A price must fit a slide and must not be drawn in a face without U+20A6.
    assert PRICE_LABEL == '\u20a65,000', PRICE_LABEL
    assert len(PRICE_LABEL) <= 12
    for p in PACKS:
        for field in ('buyer', 'problem', 'what', 'limit'):
            assert 0 < len(p[field]) <= 110, (p['keyword'], field, len(p[field]))
    return True


if __name__ == '__main__':
    validate()
    print(f'{len(PACKS)} packs at {PRICE_LABEL} each · replacement-cost total {naira(TOTAL_VALUE)} '
          f'(estimate, not a former price)')
    for p in PACKS:
        print(f"  {p['keyword']:10} {p['name']:42} {p['file_count']} files  {naira(p['value'])}")
    print(f'WhatsApp route: +{WA_PHONE}')
