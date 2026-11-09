"""Structural/editorial safeguards, not a substitute for factual or phone/platform QC."""
from pathlib import Path
import csv,json,datetime,collections,re
R=Path(__file__).resolve().parent;O=R/'output';LIB=R.parent/'visual-identity-v1'
dates=[(datetime.date(2026,11,11)+datetime.timedelta(days=i)).isoformat() for i in range(20)]
with (O/'production_status.csv').open(newline='') as f:status=list(csv.DictReader(f))
assert len(status)==20 and [x['date'] for x in status]==dates
assert all(x['schedule']=='not scheduled' and x['gates'] in ('G1–G4 pending','not assessed') for x in status)
assert all(x['carousels_copy_drafted']=='12' and x['stories_copy_drafted']=='3' and x['linkedin_company_copy_drafted']=='5' and x['linkedin_personal_copy_drafted']=='3' for x in status)
assert all(x['copy_stage']=='structured first pass — needs human line edit' for x in status[3:])
all_posts=[];total_slides=0
for day in dates:
 d=json.loads((O/f'DAY_{day}.json').read_text());assert d['day']==day
 assert len(d['posts'])==12 and len(d['stories'])==3 and len(d['linkedin']['company'])==5 and len(d['linkedin']['personal'])==3
 assert [p['series'] for p in d['posts'][:11]]==list(range(1,12))
 assert d['twelfth_rationale'] and d['posts'][11]['series'] in range(1,12)
 assert d['source'].startswith('imported') if day==dates[0] else d['source'].startswith('new authored') if day in dates[1:3] else d['source'].startswith('Structured first-pass')
 assert (O/f'DAY_{day}.md').exists()
 for p in d['posts']:
  all_posts.append(p);assert p['gate']=='G1–G4 pending' and p['publication']=='not scheduled'
  assert p['hook'] and p['caption'] and p['risk'] and p['objective']
  assert p['instagram'] and p['facebook'] and p['tiktok_photo']
  assert 6<=len(p['slides'])<=10
  total_slides+=len(p['slides'])
  for s in p['slides']:
   assert s['copy'] and len(s['copy'])<120 and (LIB/s['layout']).is_file()
  if p['series']==10: assert 'HOLD' in p['risk'].upper() or 'unverified' in p['risk'].lower()
 for side in ['company','personal']:
  for x in d['linkedin'][side]:
   assert x['body'] and x['hook'] and x['cta'] and (LIB/x['visual']).is_file()
   assert x['publication']=='not scheduled' and x['gate']=='G1–G4 pending'
 for st in d['stories']:
  assert (LIB/st['visual']).is_file() and st['publication']=='not scheduled'
assert total_slides==1449
assert len(set(p['hook'].casefold() for p in all_posts))==240
assert not any(re.search(r'\b\d+%\b',p['caption']) for p in all_posts)
html=(O/'index.html').read_text();assert 'All dates have first-pass copy' in html and all(d in html for d in dates)
print('PASS: 20 first-pass dates: 240 unique carousels / 1449 slide texts, 60 stories, 100 company + 60 personal LinkedIn. Nov 14–30 structured first passes need human line edit. All unscheduled, copy-only and G1–G4 pending.')
