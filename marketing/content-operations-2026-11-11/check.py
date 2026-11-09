"""Structural checks; a PASS is not human editorial, brand/font or platform approval."""
from pathlib import Path
from datetime import date,timedelta
import csv,json,xml.etree.ElementTree as ET
from collections import Counter
ROOT=Path(__file__).parent;O=ROOT/'output'
def rows(n):
 with (O/n).open(newline='',encoding='utf-8') as f:return list(csv.DictReader(f))
p=json.loads((O/'pilot/posts.json').read_text());stories=json.loads((O/'pilot/stories.json').read_text());li=json.loads((O/'pilot/linkedin.json').read_text());cal=rows('calendar.csv');qc=rows('qc_tracker.csv');performance=rows('performance.csv')
assert len(p)==12 and len(stories)==3 and len(li['company'])==5 and len(li['personal'])==3
assert [x['series_number'] for x in p]==list(range(1,12))+[1]
assert len(set(x['hook'].lower() for x in p))==12
assert sum(len(x['slides']) for x in p)==81
for x in p:
 assert x['id'].startswith('N11-20261111-S') and x['date']=='2026-11-11'
 assert all(x[k] for k in ['objective','audience','niche','topic','angle','main_message','hook','caption','cta','keywords','hashtags','research_status','risk','slides','platform_adaptations','qc_status','approval_status','publication_status'])
 assert isinstance(x['source_ids'],list)
 assert len(x['slides'])>=6 and len(x['slides'])<=10
 assert set(x['platform_adaptations'])=={'Instagram','Facebook','TikTok photo'}
 assert 'pending' in x['approval_status'] and x['publication_status']=='not scheduled'
 for i,s in enumerate(x['slides'],1):
  assert i==s['number'] and s['copy'] and s['visual_direction'] and s['element'] and s['layout']
  path=O/s['asset'];assert path.exists(),path;ET.parse(path)
for i in range(1,4):ET.parse(O/f'pilot/svg/N11-20261111-ST{i}.svg')
assert len(list((ROOT/'templates').glob('*.svg')))==9
assert len(rows('duplication_screen.csv'))==12 and all(r['exact_hook_collision']=='False' for r in rows('duplication_screen.csv'))
assert len(rows('topic_queue.csv'))==228 and all(r['copy_status']=='NOT WRITTEN' for r in rows('topic_queue.csv'))
assert len(cal)==940 and len(qc)==460 and len(performance)==940
assert len(set(r['placement_id'] for r in cal))==940
assert len(set(r['content_id'] for r in qc))==460
assert len(rows('calendar.csv'))==len(rows('performance.csv'))
for i in range(20):
 day=(date(2026,11,11)+timedelta(days=i)).isoformat();c=[r for r in cal if r['date']==day];q=[r for r in qc if r['date']==day]
 assert len(c)==47 and len(q)==23 and all(r['time_wat']=='' for r in c)
 assert Counter(r['platform'] for r in c)=={'Instagram':12,'Facebook':12,'TikTok photo':12,'Story channel TBD':3,'LinkedIn company':5,'LinkedIn personal':3}
 assert all(r['approval_status']=='G1–G4 pending' and r['scheduling_status']=='not scheduled' for r in c)
 if i:assert all(r['draft_status']=='TOPIC PROPOSAL; copy unwritten' and r['topic'] for r in c)
for r in performance:
 assert not r['published_url'] and not r['reach'] and not r['conversions'] and 'NO PLATFORM DATA' in r['measurement_notes']
with (ROOT/'offer_inventory.csv').open(newline='') as f:inv=list(csv.DictReader(f))
assert len(inv)==9 and all(r['G1_status']=='HOLD' for r in inv)
html=(O/'studio.html').read_text();assert 'const DATA={' in html and '/*DATA*/' not in html
assert 'No publishing API' in html and len(html)<2_000_000
print('PASS structural: 20 dates / 940 candidate rows (all unscheduled); 11 Nov 12 carousels / 81 SVG slides + 3 stories / 5 company / 3 personal; nine editable templates; zero fabricated metrics, zero approvals.')
