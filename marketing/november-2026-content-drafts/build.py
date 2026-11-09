"""Create reviewable copy masters and visual replacement map; never schedule/publish."""
from pathlib import Path
from datetime import date,timedelta
from collections import Counter
import csv,json,html,sys
from batch_source import DAYS
from remaining_generate import REMAINING

ROOT=Path(__file__).resolve().parent
OLD=ROOT.parent/'content-operations-2026-11-11'/'output'/'pilot'
LIB=ROOT.parent/'visual-identity-v1'
OUT=ROOT/'output';OUT.mkdir(exist_ok=True)
SERIES={1:'01_MARKETING_DIAGNOSIS',2:'02_MARKETING_EDUCATION',3:'03_MYTHS_AND_TRUTHS',4:'04_RELATABLE_COMMON_GROUND',5:'05_IF_I_WERE_HIRED',6:'06_CLIENT_PROCESS',7:'07_PROOF_AND_DEMONSTRATION',8:'08_GROWTH_AND_COPYWRITING',9:'09_AI_AUTOMATION',10:'10_OFFERS_AND_SOLUTIONS',11:'11_MEET_EASYWURLD'}
ROLES=['cover','interior-a','interior-b','interior-a','interior-b','conclusion']
STORY_VIS=['STORIES/ENGAGEMENT/02_question.svg','STORIES/EDUCATION/02_tip.svg','STORIES/CONVERSION/04_direct_enquiry.svg']
COMPANY_VIS=['LINKEDIN/BUSINESS_PAGE/01_insight.svg','LINKEDIN/BUSINESS_PAGE/02_education_document.svg','LINKEDIN/BUSINESS_PAGE/03_diagnosis.svg','LINKEDIN/BUSINESS_PAGE/04_strategy_framework.svg','LINKEDIN/BUSINESS_PAGE/07_principle.svg']
PERSONAL_VIS=['LINKEDIN/PERSONAL_PAGE/01_observation.svg','LINKEDIN/PERSONAL_PAGE/03_industry_opinion.svg','LINKEDIN/PERSONAL_PAGE/05_educational_breakdown.svg']
def path_for(series,role):return f'TEMPLATE_LIBRARY/CAROUSELS/{SERIES[series]}/{role}.svg'
def mdlink(path,label):return f'[{label}](../../visual-identity-v1/{path})'
def draft(day):
 d=DAYS.get(day,REMAINING.get(day));posts=[]
 for n,(series,hook,lines,caption,objective,risk) in enumerate(d['posts'],1):
  assert len(lines)==6 and lines[0]==hook and n<=12
  visual=[path_for(series,role) for role in ROLES]
  for x in visual:assert (LIB/x).exists(),x
  posts.append(dict(id=f'EW-{day.replace("-", "")}-C{n:02}',series=series,hook=hook,objective=objective,slides=[{'number':i+1,'copy':v,'layout':visual[i]} for i,v in enumerate(lines)],caption=caption,cta=lines[-1],risk=risk,research_status='Illustrative editorial hypothesis; verify real business process before use',visual_status='template mapped only; not composited/exported/phone checked',instagram=f'{caption}\n\n{lines[-1]}',facebook=f'{hook}\n\n{caption}\n\n{lines[-1]}',tiktok_photo=f'{hook}\n\n{lines[-1]}',publication='not scheduled',gate='G1–G4 pending'))
 stories=[]
 for i,(kind,copy,interaction,cta) in enumerate(d['stories']):stories.append(dict(id=f'EW-{day.replace("-", "")}-ST{i+1}',kind=kind,copy=copy,interaction=interaction,cta=cta,visual=f'TEMPLATE_LIBRARY/{STORY_VIS[i]}',gate='G1–G4 pending',publication='not scheduled'))
 linkedin={}
 for side,visuals in [('company',COMPANY_VIS),('personal',PERSONAL_VIS)]:
  linkedin[side]=[dict(id=f'EW-{day.replace("-", "")}-L{side[0].upper()}{i+1}',topic=t,hook=h,body=b,cta=c,visual=f'TEMPLATE_LIBRARY/{visuals[i]}',visual_status='optional source concept; text-led post does not require a graphic',gate='G1–G4 pending',publication='not scheduled') for i,(t,h,b,c) in enumerate(d[side])]
 return dict(day=day,niche=d['niche'],buyer_question=d['buyer_question'],editorial_note=d['editorial_note'],twelfth_rationale=d['extra'],posts=posts,stories=stories,linkedin=linkedin,source=d.get('source_note','new authored first-batch source; art directions from approved-for-drafting visual library'))

def import_pilot():
 day='2026-11-11';p=json.loads((OLD/'posts.json').read_text());s=json.loads((OLD/'stories.json').read_text());li=json.loads((OLD/'linkedin.json').read_text())
 posts=[]
 for i,x in enumerate(p,1):
  family=x['series_number'];slides=[]
  for j,slide in enumerate(x['slides']):
   role='cover' if j==0 else 'conclusion' if j==len(x['slides'])-1 else ('interior-a' if j%2 else 'interior-b')
   slides.append(dict(number=j+1,copy=slide['copy'],layout=path_for(family,role)))
  posts.append(dict(id=f'EW-20261111-C{i:02}',series=family,hook=x['hook'],objective=x['objective'],slides=slides,caption=x['caption'],cta=x['cta'],risk=x['risk'],research_status=x['research_status'],visual_status='pilot copy imported; v1 visual template mapped, not composited/exported/phone checked',instagram=x['platform_adaptations']['Instagram'],facebook=x['platform_adaptations']['Facebook'],tiktok_photo=x['platform_adaptations']['TikTok photo'],publication='not scheduled',gate='G1–G4 pending',source_ref=x['id']))
 stories=[dict(id=f'EW-20261111-ST{i+1}',kind=x['kind'],copy=x['copy'],interaction=x['interaction'],cta=x['cta'],visual=f'TEMPLATE_LIBRARY/{STORY_VIS[i]}',gate='G1–G4 pending',publication='not scheduled') for i,x in enumerate(s)]
 linkedin={side:[dict(id=f'EW-20261111-L{side[0].upper()}{i+1}',topic=x['topic'],hook=x['hook'],body=x['body'],cta=x['cta'],visual=f'TEMPLATE_LIBRARY/{(COMPANY_VIS if side=="company" else PERSONAL_VIS)[i]}',visual_status='optional source concept; text-led post does not require a graphic',gate='G1–G4 pending',publication='not scheduled') for i,x in enumerate(li[side])] for side in ['company','personal']}
 return dict(day=day,niche='Existing 11 November pilot: multiple illustrative service contexts',buyer_question='See each authored carousel brief',editorial_note='Existing first-day pilot copy is reused as a draft, NOT presented as freshly authored. Old pilot SVGs are not final art; each slide is mapped to visual template v1.',twelfth_rationale='S12 is a second diagnosis on service delivery-area uncertainty, distinct from S01 cleaning quote scope; already selected by original pilot editor.',posts=posts,stories=stories,linkedin=linkedin,source='imported unchanged from ../content-operations-2026-11-11/output/pilot/*.json; v1 visual-map added')

def render_markdown(d):
 out=[f'# {d["day"]} — Easywurld editorial drafts (REVIEW ONLY)','',f'**Context:** {d["niche"]}. **Buyer question:** {d["buyer_question"]}',f'**Source:** {d["source"]}',f'**Critical note:** {d["editorial_note"]}',f'**Why the twelfth carousel:** {d["twelfth_rationale"]}', '', '**All copy is G1–G4 pending. Visual files are TEMPLATE REFERENCES, not finished post assets; do not schedule/publish.**','','## Twelve master carousels (adapt once to IG, Facebook, TikTok photo; no video)','']
 for x in d['posts']:
  out +=[f'### {x["id"]} · S{x["series"]:02} · {x["hook"]}',f'**Objective:** {x["objective"]}. **Risk:** {x["risk"]}.','']
  for slide in x['slides']:out.append(f'{slide["number"]}. **{slide["copy"]}** — {mdlink(slide["layout"],"SVG layout reference")}')
  out +=['',f'**Caption:** {x["caption"]}',f'**Instagram draft:** {x["instagram"]}',f'**Facebook draft:** {x["facebook"]}',f'**TikTok photo draft:** {x["tiktok_photo"]}',f'**Gates:** {x["gate"]}; {x["visual_status"]}; {x["publication"]}.','']
 out +=['## Three story drafts — native stickers only, never a fake button','']
 for x in d['stories']:out +=[f'### {x["id"]} · {x["kind"]}',f'**Frame text:** {x["copy"]}',f'**Interaction:** {x["interaction"]}',f'**CTA / hold:** {x["cta"]}',mdlink(x['visual'],'SVG layout reference'),'']
 for side in ['company','personal']:
  out +=[f'## LinkedIn {side} — {len(d["linkedin"][side])} distinct text-led drafts','']
  for x in d['linkedin'][side]:out +=[f'### {x["id"]} · {x["topic"]}',f'**Opening:** {x["hook"]}',f'**Body:** {x["body"]}',f'**Close:** {x["cta"]}',f'**Optional layout:** {mdlink(x["visual"],"SVG source")} — not required for a text post.','']
 out +=['---','**Editorial release controls:** owner-approved claims and terms, verified links/inbox, personal-account signoff, licensed fonts/images, phone and actual composer crop, queue/timing check, named G3/G4 approver. No automatic distribution.']
 return '\n'.join(out)+'\n'

def render_html(items):
 style='''body{font:17px/1.6 system-ui,sans-serif;background:#fbe7c5;color:#144d3c;margin:0}header{padding:36px 6%;background:#144d3c;color:#fbe7c5}header h1{font:clamp(2rem,5vw,4rem)/1.12 Georgia,serif;max-width:900px}nav{position:sticky;top:0;background:#fbe7c5;padding:12px 6%;border-bottom:1px solid #144d3c;z-index:2;display:flex;gap:16px;flex-wrap:wrap}a{color:inherit}main{max-width:1050px;margin:auto;padding:34px 24px 100px}h2{font:2.3rem Georgia,serif}h3{font:1.45rem Georgia,serif;margin:0}.note{border-left:5px solid #144d3c;padding:14px 20px;background:#fff9ee}.card{background:#fff9ee;border:1px solid #9eb4a3;padding:24px;margin:22px 0;border-radius:8px}.id{font-size:.78rem;letter-spacing:.08em;text-transform:uppercase;font-weight:700}.slides{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:8px;padding:0;list-style:none}.slides li{border:1px solid #aec5b2;padding:18px;min-height:90px}.muted{color:#456d5c}.pill{background:#144d3c;color:#fbe7c5;padding:5px 9px;border-radius:30px;font-size:12px}.copy{white-space:pre-line}details{margin-top:16px}summary{cursor:pointer;font-weight:700}@media(max-width:650px){.card{padding:18px}header{padding:22px}nav{position:static}}'''
 h=['<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Easywurld | November draft review</title>',f'<style>{style}</style>','<header><small>SIMPLIFY. OPTIMIZE. GROW. / REVIEW ONLY</small><h1>November 11–30 · content production</h1><p>Full first-pass run: 240 carousel masters, 60 stories, 100 company and 60 personal LinkedIn text drafts. November 11 is imported pilot copy; November 12–13 are new authored copy; November 14–30 are structured niche-specific first passes requiring a human line edit. None is approved, composited or scheduled.</p></header>','<nav><a href="#status">Production status</a>']
 h += [f'<a href="#{d["day"]}">{d["day"]}</a>' for d in items];h+=['<a href="../../visual-identity-v1/preview.html">Visual library</a></nav><main><section id="status"><h2>Release is still on hold</h2><div class="note">Approval of the visual direction authorized drafting only. These exact posts still need factual/offer verification, image/font rights, on-canvas composition, phone/platform previews and a named G3/G4 release decision. No publishing access or live queue was checked. The 11 November copy below is the pre-existing pilot, mapped to the new layouts.</div><p>All dates have first-pass copy; 14–30 need a human line edit and fact check before G2 review. <a href="production_status.csv">See date-by-date status</a>. <a href="../README.md">Read working guide</a>.</p></section>']
 esc=html.escape
 for d in items:
  h += [f'<section id="{d["day"]}"><h2>{d["day"]}</h2><p>{esc(d["niche"])} · {esc(d["buyer_question"])}</p><p class="note">{esc(d["editorial_note"])}<br><strong>Twelfth:</strong> {esc(d["twelfth_rationale"])}</p><h2>12 carousel masters</h2>']
  for x in d['posts']:
   h += [f'<article class="card"><span class="id">{x["id"]} · SERIES {x["series"]:02}</span><h3>{esc(x["hook"])}</h3><p class="muted">{esc(x["objective"])} · {esc(x["risk"])}</p><ol class="slides">']
   for s in x['slides']:h += [f'<li><small>SLIDE {s["number"]}</small><br>{esc(s["copy"])}<br><a href="../../visual-identity-v1/{s["layout"]}">Layout role</a></li>']
   h += [f'</ol><p><b>Caption:</b> {esc(x["caption"])}</p><details><summary>Platform-specific copy and release status</summary><p><b>Instagram:</b> {esc(x["instagram"])}</p><p><b>Facebook:</b> {esc(x["facebook"])}</p><p><b>TikTok photo:</b> {esc(x["tiktok_photo"])}</p><p>{esc(x["visual_status"])} · {esc(x["gate"])} · {esc(x["publication"])}</p></details></article>']
  h += ['<h2>3 stories</h2>']
  for x in d['stories']:h +=[f'<article class="card"><span class="id">{x["id"]} · {esc(x["kind"])}</span><h3 class="copy">{esc(x["copy"])}</h3><p>{esc(x["interaction"])} · {esc(x["cta"])}</p><a href="../../visual-identity-v1/{x["visual"]}">Story layout</a></article>']
  for side in ['company','personal']:
   h +=[f'<h2>LinkedIn {side} · {len(d["linkedin"][side])} drafts</h2>']
   for x in d['linkedin'][side]:h += [f'<article class="card"><span class="id">{x["id"]} · {esc(x["topic"])}</span><h3>{esc(x["hook"])}</h3><p>{esc(x["body"])}</p><p><b>Close:</b> {esc(x["cta"])}</p><small>Text-led post; <a href="../../visual-identity-v1/{x["visual"]}">optional editable visual</a></small></article>']
  h +=['</section>']
 h +=['<footer class="note">Everything is an editorial draft. Do not post samples or placeholder commercial terms; verify each claim and final visual.</footer></main></html>']
 return ''.join(h)

def main():
 items=[import_pilot()]+[draft(day) for day in sorted(DAYS|REMAINING)]
 assert [x['day'] for x in items]==[(date(2026,11,11)+timedelta(days=i)).isoformat() for i in range(20)]
 assert all(len(x['posts'])==12 and len(x['stories'])==3 and len(x['linkedin']['company'])==5 and len(x['linkedin']['personal'])==3 for x in items)
 assert len({p['hook'].casefold() for d in items for p in d['posts']})==240
 for d in items:
  assert [x['series'] for x in d['posts'][:11]]==list(range(1,12))
  assert all((LIB/s['layout']).is_file() for p in d['posts'] for s in p['slides'])
  assert all((LIB/x['visual']).is_file() for group in [d['stories'],d['linkedin']['company'],d['linkedin']['personal']] for x in group)
  (OUT/f'DAY_{d["day"]}.json').write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
  (OUT/f'DAY_{d["day"]}.md').write_text(render_markdown(d))
 for batch, group in [(1,items[:3]),(2,items[3:10]),(3,items[10:17]),(4,items[17:])]:
  provenance='Nov 11 imported old pilot; Nov 12–13 authored drafts' if batch==1 else 'Structured first passes: human line edit and factual review required before G2'
  header=f'# Batch {batch:02} — Easywurld November 2026 combined review copy\n\n**REVIEW ONLY.** {provenance}. Offer/availability claims are unverified. The S10 commercial-fit carousel and conversion story on each new day are HOLD. These exact words have not been typeset into the SVG templates; fonts/phone/composer/rights checks and G3/G4 are pending. No queue or times approved; nothing scheduled.\n\n[Visual direction deck](https://docs.google.com/presentation/d/1Uy20zdmNa_xCBx_9Xx23iU_HtaLGRrNIIYYHnhMqnEs/edit?usp=drivesdk)\n'
  (OUT/f'BATCH_{batch:02}_COMBINED.md').write_text(header+'\n\n---\n\n'.join((OUT/f'DAY_{d["day"]}.md').read_text() for d in group))
 (OUT/'index.html').write_text(render_html(items))
 with (OUT/'production_status.csv').open('w',newline='') as f:
  w=csv.writer(f);w.writerow(['date','carousels_target','carousels_copy_drafted','stories_target','stories_copy_drafted','linkedin_company_target','linkedin_company_copy_drafted','linkedin_personal_target','linkedin_personal_copy_drafted','copy_stage','visual_export_status','gates','schedule'])
  for n in range(20):
   day=(date(2026,11,11)+timedelta(days=n)).isoformat()
   w.writerow([day,12,12,3,3,5,5,3,3,'existing pilot imported' if n==0 else 'authored new draft' if n<3 else 'structured first pass — needs human line edit','template references only','G1–G4 pending','not scheduled'])
 print('Built 20/20 first-pass dates: 240 carousels /',sum(len(p['slides']) for d in items for p in d['posts']),'slide texts / 60 stories / 100 company / 60 personal LinkedIn. 14–30 need human line edit. No artwork exports or scheduling.')
if __name__=='__main__':main()
