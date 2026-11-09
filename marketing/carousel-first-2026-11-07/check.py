"""Structural checks only; never asserts editorial approval. Run: python check.py"""
from pathlib import Path
from datetime import date, timedelta
from collections import Counter
import csv, json

root=Path(__file__).parent
posts=json.loads((root/'posts.json').read_text())
assert len(posts)==99 and len({p['id'] for p in posts})==99
assert len({p['hook'].casefold() for p in posts})==99
assert all(len(p['slides'])==(8 if p['series_number']==5 else 6) for p in posts)
assert all([s['number'] for s in p['slides']]==list(range(1,len(p['slides'])+1)) for p in posts)
assert all(all(s['copy'].strip() and s['visual'].strip() and len(s['copy'])<150 for s in p['slides']) for p in posts)
assert all(len(p['platform_adaptations'])==5 and all(v['caption'].strip() and v['cta'].strip() for v in p['platform_adaptations'].values()) for p in posts)
assert all({p['series_number'] for p in posts if p['date']==(date(2026,11,7)+timedelta(days=d)).isoformat()}==set(range(1,12)) for d in range(9))
assert all(p['status']=='expired / archive only' for p in posts[:11])
for d in range(1,9):
    day=posts[d*11:(d+1)*11]
    assert Counter(p['proposed_primary_platform'] for p in day)=={'Instagram':4,'TikTok':4,'Facebook':3}
    assert (root/f'02_COPY_DESIGN_{day[0]["date"]}.md').exists()
tracker=list(csv.DictReader((root/'04_PUBLISHING_TRACKER.csv').open()))
assert len(tracker)==107 and all('scheduled' not in r['state'].lower() or r['state'].lower().startswith('draft / unapproved / not scheduled') for r in tracker)
assert all(not r['platform_confirmation_id'] and not r['live_url'] for r in tracker)
dups=list(csv.DictReader((root/'05_DUPLICATION_TRACKER.csv').open()))
assert len(dups)==99 and all(r['closest_existing_id'].startswith('EW-') for r in dups)
print('PASS: 99 draft concepts, 612 numbered slide instructions, 107 unconfirmed placements, 99 comparison records; editorial/design/release still pending.')
