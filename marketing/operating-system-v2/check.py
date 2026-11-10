"""Structural checks only. Passing does not mean claims/design/approval passed G1–G4.
Includes: every draft slot names at least one research fact row, and every cited row exists.
A passing check means the wiring is intact — never that the copy is factually cleared.
"""
from pathlib import Path
from collections import Counter
from datetime import date,timedelta
import csv,json,re
import research_facts
ROOT=Path(__file__).parent
DATA=ROOT/'december-2026-DRAFT'
posts=json.loads((DATA/'posts.json').read_text())
assert len(posts)==330 and len({x['id'] for x in posts})==330
assert len({x['hook'].casefold() for x in posts})==330
assert all(len(x['slides'])==(8 if x['series_number']==5 else 6) for x in posts)
assert sum(len(x['slides']) for x in posts)==2040
assert all(all(s['copy'].strip() and s['visual'].strip() and len(s['copy'])<=150 for s in x['slides']) for x in posts)
assert all([s['number'] for s in x['slides']]==list(range(1,len(x['slides'])+1)) for x in posts)
assert all(x['publication_time'].startswith('TIME PENDING') and x['status'].startswith('editorial draft') for x in posts)
assert all(len(x['platform_adaptations'])==5 and x['caption'] and x['cta'] for x in posts)
for d in range(30):
 day=(date(2026,12,2)+timedelta(days=d)).isoformat()
 subset=[x for x in posts if x['date']==day]
 assert len(subset)==11 and {x['series_number'] for x in subset}==set(range(1,12))
 assert (DATA/f'{day}.md').exists()
 assert len({x['audience'] for x in subset})==11
old=json.loads((ROOT.parent/'content-plan.json').read_text())['posts']
prior=json.loads((ROOT.parent/'carousel-first-2026-11-07/posts.json').read_text())
oldhooks={x.get('hook','').casefold() for x in old+prior}
assert not any(x['hook'].casefold() in oldhooks for x in posts)
for file,n in [('calendar.csv',330),('duplication-screen.csv',330),('publishing-tracker.csv',330)]:
 with (DATA/file).open(newline='') as f:assert len(list(csv.DictReader(f)))==n
with (DATA/'publishing-tracker.csv').open(newline='') as f:
 for row in csv.DictReader(f):
  assert not row['schedule_confirmation'] and not row['live_url'] and row['asset_status']=='not rendered'
for skill in (ROOT/'skills').glob('*/SKILL.md'):
 text=skill.read_text()
 front=text.split('---',2)[1]
 assert re.search(r'^name: [a-z0-9-]+$',front,re.M) and 'description:' in front
 for ref in re.findall(r'`((?:\.\./)+[^`]+)`',text):assert (skill.parent/ref).exists(),(skill,ref)
assert len(list((ROOT/'skills').glob('*/SKILL.md')))==8
human=ROOT/'skills/easywurld-human-intelligence-and-editorial-system'
skill=(human/'SKILL.md').read_text()
assert 'name: easywurld-human-intelligence-and-editorial-system' in skill
assert all(f'### {stage} —' in skill for stage in 'ABCDEF')
assert all(f'G{gate} —' in skill for gate in range(6))
assert all((human/name).is_file() for name in ['templates/review-card.md','templates/experience-pattern-library.csv','examples/13-minute-image-search.md','examples/november-batch-review.md'])
with (human/'templates/experience-pattern-library.csv').open(newline='') as f:
 header=next(csv.reader(f))
 assert len(header)==20 and {'experience_id','evidence_source_date_permission','confidence','status','immediate_solution','process_solution','strategic_solution'}<=set(header)
# ---- Research fact wiring: structure only, never factual clearance ----
RES=ROOT/'research-2026-11-10'
reg_rows=list(csv.DictReader((RES/'01_FACT_REGISTER.csv').open(newline='',encoding='utf-8')))
assert len(reg_rows)==len(research_facts.FACTS)
assert len({r['fact_id'] for r in reg_rows})==len(reg_rows)
required={'fact_id','statement','instrument','pinpoint','url','tier','confidence','checked','prevents','caveat'}
assert required<=set(reg_rows[0]), required-set(reg_rows[0])
for r in reg_rows:
    # A row without a caveat is a row nobody has been told how to read.
    assert r['statement'].strip() and r['instrument'].strip() and r['url'].strip(), r['fact_id']
    assert r['confidence'] in {'verified','verified-secondary','unverified'}, r
    assert r['tier'] in {'primary statute','regulator','platform policy','secondary commentary','repository evidence'}, r
    assert r['checked']==research_facts.CHECKED, r
    # Anything not read from a primary source must say what would change the answer.
    assert r['confidence']=='verified' or r['caveat'].strip(), r['fact_id']
fact_ids={r['fact_id'] for r in reg_rows}
assert any(r['confidence']!='verified' for r in reg_rows)  # honesty: sources we could not open are recorded as such
for x in posts:
    assert x['fact_refs'], x['id']
    assert all(f in fact_ids for f in x['fact_refs']), x['id']
    assert len(set(x['fact_refs']))==len(x['fact_refs']), x['id']
    assert len(x['fact_refs'])<=9, x['id']
assert all(len(x['fact_refs'])>=2 for x in posts)
# Series 10 (offer) must never be able to publish without a commercial-terms fact attached.
assert all({'NG-FCCPA-01','NG-FCCPA-07'}<=set(x['fact_refs']) for x in posts if x['series_number']==10)
# Series 9 (automation) must always carry a data-protection fact.
assert all(any(f.startswith('NG-NDPA') for f in x['fact_refs']) for x in posts if x['series_number']==9)
# Every dated markdown package must print its research block.
for d in range(30):
    day=(date(2026,12,2)+timedelta(days=d)).isoformat()
    body=(DATA/f'{day}.md').read_text()
    assert 'Research to check before this slot is scheduled' in body, day
    assert body.count('Guards against:')>=11, day
for name in ['01_FACT_REGISTER.csv','02_SOURCES_AND_LIMITS.md','03_DRAFT_FACT_PACKETS.md',
             '04_MUSIC_AND_RIGHTS_NOTE.md','05_OWNER_VERIFICATION_CHECKLIST.md']:
    assert (RES/name).is_file(), name
sources=(RES/'02_SOURCES_AND_LIMITS.md').read_text()
assert research_facts.CHECKED in sources
# The music question is parked, not answered: the note must still be pending, not a playlist.
music=(RES/'04_MUSIC_AND_RIGHTS_NOTE.md').read_text()
assert 'DEFERRED' in music and 'no songs in this delivery' in music.lower()
print(f'PASS: 330 distinct-hook draft packages / 30 days / 11 series / 2040 slide-copy blocks; '
      f'8 structurally valid skills, including the human intelligence review with A–F and G0–G5; '
      f'{len(reg_rows)} research facts wired to every draft slot '
      f'({sum(1 for r in reg_rows if r["confidence"]!="verified")} explicitly flagged as unverified/secondary); '
      f'all placements unapproved, unrendered, unscheduled.')
