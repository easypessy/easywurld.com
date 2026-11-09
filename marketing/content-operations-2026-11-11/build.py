"""Build new Nov 11 operations data; does not touch earlier campaigns or Drive."""
from pathlib import Path
from datetime import date,timedelta
from html import escape
from collections import Counter
from difflib import SequenceMatcher
import csv,json,re,textwrap
from pilot_source import DAY,PILOT,SERIES,STORIES,LINKEDIN_COMPANY,LINKEDIN_PERSONAL
from topic_queue import DAY_BRIEFS,topic as proposed_topic
ROOT=Path(__file__).parent
OUT=ROOT/'output';SVG=OUT/'pilot'/'svg';TPL=ROOT/'templates'
OUT.mkdir(exist_ok=True);SVG.mkdir(parents=True,exist_ok=True);TPL.mkdir(exist_ok=True)
GREEN='#144D3C';BEIGE='#FBE7C5';

def csv_write(name,rows,fields):
 with (OUT/name).open('w',newline='',encoding='utf-8') as f:
  w=csv.DictWriter(f,fieldnames=fields,extrasaction='ignore');w.writeheader();w.writerows(rows)

def wrap(text,width=39):
 # Keep words intact; SVG is edited as text; do not generate a raster screenshot.
 return [escape(line) for paragraph in text.split('\n') for line in (textwrap.wrap(paragraph,width=width,break_long_words=False,break_on_hyphens=False) or [''])]

def svg(id,number,total,series,copy,layout,element,template=False):
 is_dark=layout in ('cover','after','closing');bg=GREEN if is_dark else BEIGE;fg=BEIGE if is_dark else GREEN
 label='EASYWURLD   /   SIMPLIFY. OPTIMIZE. GROW.'
 main=wrap(copy,35 if layout in ('cover','before','after') else 42)
 size=65 if len(main)<=3 else 54 if len(main)<=5 else 46
 y=345 if len(main)<=5 else 275
 texts=''.join(f'<text x="78" y="{y+i*(size+18)}" font-family="Lora, Georgia, serif" font-size="{size}" font-weight="600" fill="{fg}">{line}</text>' for i,line in enumerate(main))
 extra=escape(element)
 # Small but genuinely editable graphic grammar by storytelling function, not one repeated poster.
 if layout in ('contrast','before','after'):
  motif=f'<rect x="78" y="865" width="436" height="180" rx="12" fill="none" stroke="{fg}" stroke-width="3"/><rect x="546" y="865" width="456" height="180" rx="12" fill="{fg}" opacity=".16"/><path d="M 515 952 L 544 952" stroke="{fg}" stroke-width="3"/>'
 elif layout in ('sequence','step','workflow','gate'):
  motif=f'<path d="M 110 968 L 945 968" stroke="{fg}" stroke-width="3"/><circle cx="145" cy="968" r="30" fill="{bg}" stroke="{fg}" stroke-width="3"/><circle cx="515" cy="968" r="30" fill="{bg}" stroke="{fg}" stroke-width="3"/><circle cx="920" cy="968" r="30" fill="{bg}" stroke="{fg}" stroke-width="3"/>'
 elif layout in ('question','context','input'):
  motif=f'<rect x="78" y="875" width="746" height="145" rx="22" fill="none" stroke="{fg}" stroke-width="3"/><path d="M 165 1020 L 135 1050 L 154 1017" fill="{bg}" stroke="{fg}" stroke-width="3"/>'
 elif layout in ('checklist','framework','action'):
  motif=''.join(f'<rect x="78" y="{875+i*63}" width="34" height="34" rx="5" fill="none" stroke="{fg}" stroke-width="3"/><path d="M 138 {892+i*63} L 805 {892+i*63}" stroke="{fg}" stroke-width="2" opacity=".55"/>' for i in range(3))
 elif layout in ('metric','guardrail','exception','approval'):
  motif=f'<rect x="78" y="872" width="924" height="180" rx="14" fill="none" stroke="{fg}" stroke-width="3"/><path d="M 78 927 L 1002 927 M 510 927 L 510 1052" stroke="{fg}" stroke-width="2" opacity=".65"/>'
 else:
  motif=f'<circle cx="855" cy="964" r="103" fill="none" stroke="{fg}" stroke-width="3"/><path d="M 78 969 L 710 969" stroke="{fg}" stroke-width="3"/>'
 return f'''<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350" role="img" aria-label="{escape(copy,quote=True)}">
<rect width="1080" height="1350" fill="{bg}"/>
<rect x="48" y="48" width="984" height="1254" rx="10" fill="none" stroke="{fg}" stroke-opacity=".40" stroke-width="2"/>
<text x="78" y="108" fill="{fg}" font-size="20" letter-spacing="3" font-family="Canva Sans, Arial, sans-serif">{label}</text>
<text x="78" y="192" fill="{fg}" font-size="19" letter-spacing="1" font-family="Canva Sans, Arial, sans-serif">{escape(series.upper())} · DRAFT / ILLUSTRATIVE</text>
<line x1="78" y1="220" x2="1002" y2="220" stroke="{fg}" stroke-opacity=".7" stroke-width="2"/>
{texts}
{motif}
<rect x="78" y="1115" width="924" height="85" rx="8" fill="none" stroke="{fg}" stroke-opacity=".65" stroke-width="2"/>
<text x="103" y="1168" fill="{fg}" font-size="23" font-family="Canva Sans, Arial, sans-serif">{extra}</text>
<line x1="78" y1="1250" x2="1002" y2="1250" stroke="{fg}" stroke-opacity=".7" stroke-width="2"/>
<text x="78" y="1282" fill="{fg}" font-size="19" font-family="Canva Sans, Arial, sans-serif">{escape(id)}</text>
<text x="922" y="1282" fill="{fg}" font-size="19" font-family="Canva Sans, Arial, sans-serif">{number:02d}/{total:02d}</text>
</svg>'''

variants={
 'diagnosis':('A buyer question is hidden','question','one outlined chat bubble'),
 'education':('One decision to make easier','framework','three ruled lines'),
 'myth':('Claim / context / test','nuance','qualified verdict stamp'),
 'niche':('A hypothetical first move','cover','HYPOTHETICAL badge'),
 'before-after':('Before / after with a caveat','after','clearly illustrative before and after'),
 'copywriting':('A sentence the buyer can use','framework','three stacked clauses'),
 'automation':('Human sign-off before send','approval','manual approval handoff'),
 'offer':('Verify the offer terms','guardrail','scope verification tag'),
 'brand':('Simplify. Optimize. Grow.','cover','single connecting line')
}
for slug,(copy,layout,element) in variants.items():
 (TPL/f'{slug}.svg').write_text(svg('TEMPLATE',1,1,slug.replace('-',' '),copy,layout,element),encoding='utf-8')

posts=[]
for n,raw in enumerate(PILOT,1):
 id=f'N11-20261111-S{n:02d}'
 slides=[]
 for k,(copy,layout,element) in enumerate(raw['slides'],1):
  assert len(wrap(copy,42))<=7,(id,k,copy)
  asset=f'pilot/svg/{id}-{k:02d}.svg';(SVG/f'{id}-{k:02d}.svg').write_text(svg(id,k,len(raw['slides']),SERIES[raw['series']-1],copy,layout,element),encoding='utf-8')
  slides.append(dict(number=k,copy=copy,visual_direction=f'{layout.replace("-"," ").capitalize()} composition; {element}; editorial whitespace, no fabricated screenshot.',layout=layout,element=element,asset=asset))
 base=raw['caption']+' '+raw['cta']
 post=dict(id=id,date=DAY,format='master carousel',series=SERIES[raw['series']-1],series_number=raw['series'],objective=raw['objective'],audience=raw['audience'],niche=raw['niche'],topic=raw['topic'],angle=raw['angle'],main_message=raw['message'],hook=raw['hook'],slides=slides,design_layout='1080 × 1350 editable SVG; beige/deep-green editorial cards, 78px safe inset, Lora heading and Canva Sans body requested; browser fallback is not font approval.',suggested_visual_elements=[s['element'] for s in slides],caption=raw['caption'],cta=raw['cta'],keywords=raw['keywords'],hashtags=['#Easywurld','#SmallBusinessMarketing'] if n not in (6,10) else ['#Easywurld'],source_ids=raw['source_ids'],research_status='Original illustrative reasoning; no external numerical claim' if not raw['source_ids'] else 'Source in research register; verify current accuracy before release',risk=raw['risk'],qc_status='unscored; SVG layout/mobile/font review pending',approval_status='G0 recorded; G1–G4 pending',publication_status='not scheduled')
 post['platform_adaptations']={
  'Instagram':base+' '+ ' '.join(post['hashtags'])+'\nCarousel: attach numbered slides in order; verify crop and text.',
  'Facebook':raw['caption']+' '+raw['cta']+'\nDiscussion prompt: '+('What would you change first?' if n%2 else 'Which step feels missing?'),
  'TikTok photo':raw['hook']+'\n'+raw['message']+'. '+raw['cta']+' #Easywurld\nPhoto post: verify multi-image composer; no video required.'
 }
 posts.append(post)
(OUT/'pilot'/'posts.json').write_text(json.dumps(posts,ensure_ascii=False,indent=2),encoding='utf-8')
(OUT/'pilot'/'stories.json').write_text(json.dumps(STORIES,ensure_ascii=False,indent=2),encoding='utf-8')
for idx,story in enumerate(STORIES,1):
 lines=wrap(story['copy'],32)
 text=''.join(f'<text x="90" y="{420+i*85}" font-family="Lora, Georgia, serif" font-size="55" fill="{GREEN}">{line}</text>' for i,line in enumerate(lines))
 story_svg=f'<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920" role="img"><rect width="1080" height="1920" fill="{BEIGE}"/><rect x="60" y="190" width="960" height="1490" rx="14" fill="none" stroke="{GREEN}" stroke-width="3"/><text x="90" y="285" font-family="Canva Sans, Arial, sans-serif" font-size="29" fill="{GREEN}">EASYWURLD / {story["kind"].upper()}</text>{text}<text x="90" y="1560" font-family="Canva Sans, Arial, sans-serif" font-size="24" fill="{GREEN}">SIMPLIFY. OPTIMIZE. GROW. / ST{idx}</text></svg>'
 (SVG/f'N11-20261111-ST{idx}.svg').write_text(story_svg,encoding='utf-8')
(OUT/'pilot'/'linkedin.json').write_text(json.dumps({'company':LINKEDIN_COMPANY,'personal':LINKEDIN_PERSONAL},ensure_ascii=False,indent=2),encoding='utf-8')
# MD shows the full package, not a topic-only teaser.
lines=['# 11 November pilot — full editorial drafts','', '**All items are unapproved.** SVGs are editable first-pass visual compositions, not font-cleared or mobile-verified finals. No timetable or queue access is confirmed. Fictional/hypothetical examples are labelled; no client result is implied.','']
for p in posts:
 lines+=['---',f"## {p['id']} · {p['series']}",f"**Objective:** {p['objective']}  ",f"**Audience / niche:** {p['audience']} / {p['niche']}  ",f"**Topic:** {p['topic']}  ",f"**Angle:** {p['angle']}  ",f"**Main message:** {p['main_message']}  ",f"**Hook:** {p['hook']}  ",f"**Layout:** {p['design_layout']}  ",f"**Risk:** {p['risk']}  ",f"**Evidence:** {', '.join(p['source_ids']) or 'Illustrative editorial hypothesis'}  ",'']
 for s in p['slides']:
  lines += [f"**Slide {s['number']}:** {s['copy']}  ",f"Visual: {s['visual_direction']} [Editable SVG](svg/{p['id']}-{s['number']:02d}.svg)  ",'']
 lines += [f"**Caption:** {p['caption']}  ",f"**CTA:** {p['cta']}  ",f"**Keywords:** {', '.join(p['keywords'])}  ",f"**Hashtags:** {', '.join(p['hashtags'])}  ",f"**Research:** {p['research_status']}  ", '**Adaptations (not extra master creative projects):**']
 for platform,body in p['platform_adaptations'].items():lines += [f'- {platform}: {body.replace(chr(10)," / ")}']
 lines += ['**QC:** unscored; **Approval:** G1–G4 pending; **Publication:** not scheduled.','']
lines+=['---','## Three supporting stories','']
for i,s in enumerate(STORIES,1):lines += [f"### ST{i} · {s['kind']}",f"Objective: {s['objective']}",f"Exact copy: {s['copy'].replace(chr(10),' / ')}",f"Visual: {s['visual']}",f"Interaction: {s['interaction']}",f"CTA: {s['cta']}",'']
lines+=['---','## Five company LinkedIn drafts','']
for i,l in enumerate(LINKEDIN_COMPANY,1):lines += [f"### CO{i}: {l['topic']}",l['hook'],l['body'],f"CTA: {l['cta']}",'']
lines+=['---','## Three personal LinkedIn drafts','', 'These are proposed first-person opinions; owner must approve voice and truth before use. No fabricated founder story.','']
for i,l in enumerate(LINKEDIN_PERSONAL,1):lines += [f"### PE{i}: {l['topic']}",l['hook'],l['body'],f"CTA: {l['cta']}",'']
(OUT/'pilot'/'DAY_2026-11-11.md').write_text('\n'.join(lines)+'\n',encoding='utf-8')

calendar=[];qc=[];metrics=[]
for day_i in range(20):
 dt=(date(2026,11,11)+timedelta(days=day_i)).isoformat();is_pilot=day_i==0
 for n in range(1,13):
  id=f'N11-{dt.replace("-","")}-S{n:02d}'
  p=posts[n-1] if is_pilot else None
  proposal,second=proposed_topic(dt,n if n<12 else DAY_BRIEFS[dt][3]) if not p else ('',1)
  series=p['series'] if p else SERIES[n-1 if n<12 else second-1]
  master=dict(date=dt,content_id=id,series=series,topic=p['topic'] if p else proposal,format='carousel',draft_status='draft; human review pending' if p else 'TOPIC PROPOSAL; copy unwritten',approval_status='G1–G4 pending',scheduling_status='not scheduled',publication_status='unverified',time_wat='',slot_collision_check='live queue not checked')
  qc.append(dict(master,critical_veto='unresolved',score_100='',reviewer='',revision_notes='',asset_review='SVG draft only' if p else 'not produced'))
  for platform in ('Instagram','Facebook','TikTok photo'):
   calendar.append(dict(master,platform=platform,placement_id=id+'-'+{'Instagram':'IG','Facebook':'FB','TikTok photo':'TT'}[platform]))
 for n in range(1,4):
  id=f'N11-{dt.replace("-","")}-ST{n}'
  story_topics=('Ask the buyer question in a poll','Clarify the buying detail','Invite an availability-checked enquiry')
  master=dict(date=dt,content_id=id,series='Story '+('Engagement','Education','Conversion')[n-1],topic=STORIES[n-1]['objective'] if is_pilot else f'{story_topics[n-1]}: {DAY_BRIEFS[dt][2]}',format='story',draft_status='draft; human review pending' if is_pilot else 'TOPIC PROPOSAL; copy unwritten',approval_status='G1–G4 pending',scheduling_status='not scheduled',publication_status='unverified',time_wat='',slot_collision_check='live queue not checked')
  qc.append(dict(master,critical_veto='unresolved',score_100='',reviewer='',revision_notes='',asset_review='not rendered'))
  calendar.append(dict(master,platform='Story channel TBD',placement_id=id+'-ST'))
 for prefix,items,platform in [('CO',LINKEDIN_COMPANY,'LinkedIn company'),('PE',LINKEDIN_PERSONAL,'LinkedIn personal')]:
  for n,item in enumerate(items,1):
   id=f'N11-{dt.replace("-","")}-{prefix}{n}'
   li_topics=(('Buyer decision','A narrower hypothesis','Process/claim gate','Illustrative rewrite','Offer fit and limits') if prefix=='CO' else ('One buyer question','A practical opinion','One failure case'))
   master=dict(date=dt,content_id=id,series=platform,topic=item['topic'] if is_pilot else f'{li_topics[n-1]}: {DAY_BRIEFS[dt][2]}',format='text draft / format to confirm',draft_status='draft; human review pending' if is_pilot else 'TOPIC PROPOSAL; copy unwritten',approval_status='G1–G4 pending',scheduling_status='not scheduled',publication_status='unverified',time_wat='',slot_collision_check='live queue not checked')
   qc.append(dict(master,critical_veto='unresolved',score_100='',reviewer='',revision_notes='',asset_review='text only'))
   calendar.append(dict(master,platform=platform,placement_id=id+'-LI'))
assert len(calendar)==940 and len(qc)==460
cal_fields=['date','time_wat','platform','placement_id','content_id','series','topic','format','draft_status','approval_status','scheduling_status','publication_status','slot_collision_check']
csv_write('calendar.csv',calendar,cal_fields)
queue=[]
for dt,(niche,question,tension,second) in DAY_BRIEFS.items():
 for n in range(1,13):
  series_no=n if n<12 else second
  suggestion,_=proposed_topic(dt,series_no)
  queue.append({'date':dt,'slot':n,'series':SERIES[series_no-1],'niche':niche,'buyer_question':question,'strategic_tension':tension,'topic_proposal':suggestion,'research_basis':'editorial hypothesis; verify with actual audience','copy_status':'NOT WRITTEN'})
csv_write('topic_queue.csv',queue,list(queue[0]))
qc_fields=['date','content_id','series','topic','format','draft_status','score_100','critical_veto','reviewer','revision_notes','approval_status','asset_review','scheduling_status','publication_status']
csv_write('qc_tracker.csv',qc,qc_fields)
for row in calendar:
 master=next((p for p in posts if p['id']==row['content_id']),None)
 hook_type=('question' if '?' in master['hook'] else 'statement/contrast') if master else ''
 cta=master['cta'] if master else ''
 niche=master['niche'] if master else (DAY_BRIEFS[row['date']][0] if row['date'] in DAY_BRIEFS else '')
 metrics.append({**{k:row[k] for k in ['date','placement_id','content_id','series','topic','platform','format']},'hook_type':hook_type,'cta':cta,'audience_niche':niche,'time_wat':'', 'published_url':'',**{k:'' for k in ['reach','impressions','views','engagement','likes','comments','shares','saves','profile_visits','link_clicks','enquiries','leads','conversions']},'measurement_notes':'NO PLATFORM DATA; blank is unknown, not zero'})
csv_write('performance.csv',metrics,list(metrics[0]))
# Lexical screening only; old calendar also has many same-day slots, not a live queue.
old=[]
for source in [ROOT.parent/'content-plan.json',ROOT.parent/'carousel-first-2026-11-07/posts.json',ROOT.parent/'operating-system-v2/december-2026-DRAFT/posts.json']:
 if source.exists():
  data=json.loads(source.read_text())
  for x in data.get('posts',data) if isinstance(data,dict) else data:old.append((x.get('id',''),x.get('hook','')))
comp=[]
for p in posts:
 best=max(old,key=lambda x:SequenceMatcher(None,p['hook'].lower(),x[1].lower()).ratio())
 ratio=round(SequenceMatcher(None,p['hook'].lower(),best[1].lower()).ratio(),2)
 comp.append({'id':p['id'],'closest_old_id':best[0],'lexical_similarity':ratio,'exact_hook_collision':p['hook'].strip().lower()==best[1].strip().lower(),'semantic_and_live_queue_review':'pending'})
csv_write('duplication_screen.csv',comp,list(comp[0]))
print(f'Built {len(posts)} authored pilot carousels, {sum(len(p["slides"]) for p in posts)} editable pilot slides, 3 stories, 8 LinkedIn drafts; 20-day calendar with {len(calendar)} candidate placement rows (not scheduled).')
# Standalone offline console. Data are embedded; no localhost/API or account credentials.
embedded={'day':DAY,'posts':posts,'stories':STORIES,'linkedin':{'company':LINKEDIN_COMPANY,'personal':LINKEDIN_PERSONAL},'calendar':calendar,'performance':metrics}
template=(ROOT/'studio.template.html').read_text(encoding='utf-8')
assert template.count('/*DATA*/')==1
(OUT/'studio.html').write_text(template.replace('/*DATA*/',json.dumps(embedded,ensure_ascii=False).replace('</','<\\/')),encoding='utf-8')
(OUT/'index.html').write_text('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="refresh" content="0;url=studio.html"><title>Easywurld content operations</title></head><body><a href="studio.html">Open the Easywurld content operations console</a></body></html>',encoding='utf-8')
