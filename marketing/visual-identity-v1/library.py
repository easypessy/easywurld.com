"""Easywurld visual template source v1.0 — editable, self-contained SVG, stdlib only.

Regenerate files via python marketing/visual-identity-v1/library.py.
These are art-directed SAMPLE templates, not approved platform assets or Canva-native files.
"""
from __future__ import annotations
from pathlib import Path
import json, html, math
ROOT=Path(__file__).parent
B='#FBE7C5';G='#144D3C';W='#FFFFFF';K='#000000';A='#D4AF37';M='#5C7569'
FAMILIES=[
 ('01_MARKETING_DIAGNOSIS','Marketing Diagnosis','The quote stalls here.','A reply is not a usable quote.','Missing: scope, area, next step.','Audit one unanswered buyer question.','diagnostic report / redline callouts'),
 ('02_MARKETING_EDUCATION','Marketing Education','Teach the next decision.','Ask what the buyer needs to know.','A clear first reply can use three checks.','Keep the lesson; try one change.','learning publication / nested steps'),
 ('03_MYTHS_AND_TRUTHS','Marketing Myths and Truths','More tags cannot explain an offer.','MYTH: reach fixes an unclear service.','CONTEXT: name the scope first.','Test the claim, not the slogan.','investigative file / correction stamp'),
 ('04_RELATABLE_COMMON_GROUND','Relatable Enemy / Common Ground','Five tools. Nobody owns the reply.','The sheet knows; the team does not.','What we say / what buyers hear.','Name one human who takes the next step.','culture editorial / interrupted conversation'),
 ('05_IF_I_WERE_HIRED','If I Were Hired Today','A bike shop, a booking gap.','Hypothetical: a rider needs repair.','Inspect → clarify → test.','Fix the booking question first.','strategy folio / hypothetical niche map'),
 ('06_CLIENT_PROCESS','Easywurld Client Process','Before the creative: the facts.','G1: verify the claim and its owner.','G2 → G3 → G4: check each handoff.','Ask how the next gate works.','service blueprint / gate network'),
 ('07_PROOF_AND_DEMONSTRATION','Proof and Practical Demonstration','Before / after is not proof of lift.','Sample BEFORE: “DM for details.”','Sample AFTER: ask for date + scope.','Use real terms; label a sample.','portfolio redline / specimen sheet'),
 ('08_GROWTH_AND_COPYWRITING','Growth Strategy and Copywriting','Specificity earns its space.','“Quality service” hides the decision.','Replace praise with verified detail.','Rewrite one line; check it is true.','literary margin / annotated copy'),
 ('09_AI_AUTOMATION','AI and Business Automation','The useful bot knows when to stop.','Input → rule → human exception.','Never guess an uncertain quote.','Pilot with fictional inputs first.','systems diagram / human-gate architecture'),
 ('10_OFFERS_AND_SOLUTIONS','Offer and Solution','What is in the work?','[VERIFY CURRENT TERMS]','Scope / exclusions / delivery route.','Ask what is currently available.','offer specification / terms ledger'),
 ('11_MEET_EASYWURLD','Meet Easywurld','Simplify. Optimize. Grow.','One message. One usable next step.','Site + copy + process should agree.','What would you simplify first?','independent agency / typographic manifesto'),
]
SAFE={'carousel':(110,155,970,1170),'tiktok':(110,300,850,1460),'story':(110,260,970,1500),'li_doc':(110,155,970,1180),'li_square':(110,135,1090,1030),'li_land':(110,120,1090,520)}
EDITABLE=[]
def E(s):return html.escape(str(s),quote=True)
def rect(x,y,w,h,fill,stroke='none',sw=1,rx=0,op=1,dash=''):
 return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" opacity="{op}"'+(f' stroke-dasharray="{dash}"' if dash else '')+'/>'
def line(x1,y1,x2,y2,stroke=G,sw=2,op=1,dash=''):
 return f'<path d="M{x1} {y1} L{x2} {y2}" stroke="{stroke}" stroke-width="{sw}" opacity="{op}" fill="none"'+(f' stroke-dasharray="{dash}"' if dash else '')+'/>'
def circle(x,y,r,stroke=G,sw=2,fill='none',op=1):return f'<circle cx="{x}" cy="{y}" r="{r}" stroke="{stroke}" stroke-width="{sw}" fill="{fill}" opacity="{op}"/>'
def path(d,stroke=G,sw=2,fill='none',op=1):return f'<path d="{d}" stroke="{stroke}" stroke-width="{sw}" fill="{fill}" opacity="{op}"/>'
def short_label(text,max_chars=33):
 text=str(text).upper()
 return text if len(text)<=max_chars else text[:max_chars].rsplit(' ',1)[0]
def wrap(text,max_chars):
 words=str(text).split();rows=['']
 for word in words:
  if len(word)>max_chars: raise ValueError('unbreakable word '+word)
  if len(rows[-1]+' '+word)>max_chars and rows[-1]:rows.append(word)
  else:rows[-1]+=(' ' if rows[-1] else '')+word
 return rows
def text(x,y,copy,size=40,width=800,colour=G,serif=False,weight=400,tracking=0,max_lines=8,id='body',spacing=None):
 # Uses generous capacity; SVG does not autowrap text. All tspan lines remain individually editable.
 chars=max(12,int(width/(size*(0.61 if serif else 0.59))))
 lines=wrap(copy,chars)
 if len(lines)>max_lines:raise ValueError(f'{id}: {len(lines)} lines > {max_lines}: {copy}')
 step=spacing or round(size*(1.19 if serif else 1.36))
 if size>=30 and x+width>1050:raise ValueError('text out of right canvas')
 tsp=''.join(f'<tspan x="{x}" y="{y+i*step}">{E(s)}</tspan>' for i,s in enumerate(lines))
 family='Lora,Georgia,serif' if serif else 'Canva Sans,Arial,sans-serif'
 return f'<g id="content-{E(id)}" data-edit="replace text, preserve hierarchy"><text fill="{colour}" font-family="{family}" font-size="{size}" font-weight="{weight}" letter-spacing="{tracking}">{tsp}</text></g>',len(lines),step
def fit_text(x,y,copy,width,max_bottom,colour=G,serif=True,id='headline',max_lines=6):
 for size in (88,80,72,64,58,52,44,38):
  chars=max(12,int(width/(size*(0.61 if serif else 0.59))))
  lines=wrap(copy,chars);step=round(size*(1.19 if serif else 1.36))
  if len(lines)<=max_lines and y+(len(lines)-1)*step<=max_bottom:
   return text(x,y,copy,size,width,colour,serif,600,0,max_lines,id)
 raise ValueError('Copy must be edited to fit the safe area; do not shrink further: '+copy)
def label(x,y,copy,c=G,size=23,id='label'):
 return text(x,y,copy,size,min(850, max(105, 1050-x)),c,False,600,1.5,2,id)[0]
def page_header(series,index,total,colour=G,width=1080,top=170):
 # No logo watermark on interior slides. Mark on cover and conclusion only.
 tag='EASYWURLD  /  '+series.upper() if index in (1,total) else series.upper()
 return label(110,top,tag,colour,21,'series')+line(110,top+33,min(width-110,970),top+33,colour,2,.5)
def footer(index,total,colour=G,width=1080,y=1148):
 return line(110,y-36,width-110,y-36,colour,2,.55)+label(110,y,'SIMPLIFY. OPTIMIZE. GROW.' if index in (1,total) else 'EASYWURLD  /  EDITORIAL SAMPLE',colour,20,'footer')+label(width-210,y,f'{index:02d} / {total:02d}',colour,20,'page')
def base(w,h,bg,desc):return f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}" role="img"><title>{E(desc)}</title><desc>Easywurld editable sample template. V1.0. No approved commercial claims or platform release.</desc>'+rect(0,0,w,h,bg)
def finish(s):return s+'</svg>'

def art_alt(f,c=G):
 """Second interior grammar: a distinct causal or comparative diagram per series."""
 if f==1: # hidden break in a decision path
  d=line(150,955,910,955,c,3)
  for x,t in [(180,'VIEW'),(480,'QUESTION'),(800,'REPLY')]:
   d+=circle(x,955,42,c,3)+label(x-48,853,t,c,22,'stage'+str(x))
  d+=path('M565 913 L585 880 L605 913',c,3)+label(405,1060,'GAP: BUYER NEEDS A FACT',c,21,'gap')
  return d
 if f==2: # explanatory sequence
  d=''
  for i,t in enumerate(['NOTICE','ASK','ACT']):
   x=110+i*290;d+=rect(x,800+i*55,245,140,'none',c,2)+label(x+22,850+i*55,f'0{i+1} / {t}',c,23,'step'+str(i))
  return d
 if f==3: # assertion/evidence/verdict in vertical slices
  d=rect(110,785,860,83,c,op=.11)+rect(110,898,860,83,'none',c,2)+rect(110,1010,860,75,c,op=.11)
  for i,t in enumerate(['CLAIM','CONTEXT','VERDICT']):d+=label(135,837+i*112,t,c,25,'evidence'+str(i))
  return d
 if f==4: # interruptions in conversation
  return rect(110,770,280,285,c)+rect(425,820,545,225,'none',c,3)+label(140,840,'WE SAY',B,24,'wesay')+label(455,885,'THEY HEAR',c,24,'theyhear')+line(390,920,425,920,c,3)
 if f==5: # deliberate two-axis strategic triage
  return line(530,785,530,1080,c,2)+line(150,930,910,930,c,2)+label(160,845,'HIGH FRICTION',c,22,'high')+label(570,845,'FIRST TEST',c,22,'test')+circle(720,1015,20,c,3)+circle(360,860,13,c,3)
 if f==6: # review fork
  return rect(110,790,315,250,'none',c,2)+label(140,855,'CLAIM',c,25,'claim')+line(425,915,610,915,c,3)+circle(675,915,55,c,3)+label(635,924,'G1',c,25,'g1')+path('M730 915 L910 820 M730 915 L910 1020',c,2)+label(790,790,'APPROVE',c,20,'approve')+label(790,1060,'RETURN',c,20,'return')
 if f==7: # annotated baseline line to improved sample
  return rect(110,795,860,245,'none',c,2)+line(145,910,925,910,c,2)+rect(145,840,300,24,c,op=.23)+rect(565,840,335,24,c,op=.52)+circle(525,915,24,c,2)+label(145,1005,'WHAT CHANGED?',c,23,'changed')
 if f==8: # editorial note with cross-out (not real quote)
  return label(110,825,'SAMPLE / NOT A QUOTE',c,22,'notquote')+rect(110,865,860,95,'none',c,2)+line(140,913,760,913,c,3,.65)+path('M135 1030 L920 1030',c,2)+label(145,1080,'REPLACE PRAISE WITH A CHECKABLE ACTION',c,20,'rewrite')
 if f==9: # stop branch
  return rect(110,830,315,178,'none',c,2)+rect(655,830,315,178,'none',c,2)+line(425,920,655,920,c,3)+circle(540,920,38,c,3)+line(505,885,575,955,c,4)+label(135,900,'AUTOMATION',c,21,'automation')+label(680,900,'HUMAN REVIEW',c,21,'human')
 if f==10: # scoped specification, not price tag
  d=rect(110,780,860,290,'none',c,2)
  for i,t in enumerate(['SCOPE','EXCLUSIONS','TERMS / G1 HOLD']):
   y=860+i*83;d+=line(110,y-32,970,y-32,c,2,.4)+label(145,y,t,c,23,'term'+str(i))
  return d
 # brand: three distinct but aligned pillars
 d=''
 for i,t in enumerate(['SIMPLIFY','OPTIMIZE','GROW']):
  x=110+i*286;d+=rect(x,810,262,200,'none',c,2)+label(x+22,875,t,c,21,'belief'+str(i))
 return d

def art(f,mode,c=G):
 """Series-specific illustration grammar. Geometry stays below the cover headline and away from CTA text."""
 if mode=='interior-b':return art_alt(f,c)
 d=''
 if f==1: # report: row-rule, notepad fold, diagnostic marker
  d+=rect(110,800,860,268,'none',c,2)+line(110,880,970,880,c,2,.4)+line(110,964,970,964,c,2,.4)
  for i in range(3):d+=label(140,845+i*84,f'0{i+1}',c,24,f'index{i}')+label(230,845+i*84,['SCOPE','AREA','NEXT STEP'][i],c,24,f'finding{i}')+circle(925,833+i*84,10,c,2)
  d+=path('M880 800 L970 890 M880 800 L880 890 L970 890',c,2)
 elif f==2: # learning publication: chapter spine and parallel steps
  d+=rect(110,765,105,350,c)
  for i in range(3):d+=circle(300+i*252,950,48,c,3)+line(350+i*252 if i<2 else 940,950,505+i*252 if i<2 else 940,950,c,2,.5)
  d+=label(130,819,'01',B,27,'chapter')
 elif f==3: # investigative redaction and verdict stamp
  d+=rect(110,782,860,254,'none',c,2)+rect(145,840,450,20,c,op=.28)+rect(145,885,620,20,c,op=.18)
  d+=circle(875,908,82,c,4)+path('M830 907 L860 937 L915 866',c,7)
 elif f==4: # culture zine cut and opposing dialogue
  d+=rect(110,797,570,102,c)+rect(310,918,660,111,'none',c,3)
  d+=path('M160 899 L140 931 L218 899 M900 1029 L938 1065 L865 1029',c,2)
 elif f==5: # niche strategy: bike wheel, mapping line
  d+=circle(300,930,105,c,3)+circle(710,930,105,c,3)+path('M300 930 L500 810 L710 930 L530 930 L300 930 M500 810 L530 930',c,4)
  d+=label(110,789,'HYPOTHETICAL / SCOPE FIRST',c,22,'hypothetical')
 elif f==6: # service blueprint: nodes and gates
  for i in range(4):
   x=145+i*250;d+=circle(x,935,35,c,3)+label(x-26,943,'G'+str(i),c,23,f'gate{i}')
   if i<3:d+=line(x+38,935,x+208,935,c,3,.55)
  d+=label(110,820,'NO RELEASE WITHOUT A NAMED REVIEWER',c,21,'gatehold')
 elif f==7: # redline specimen, distinct staggered before/after
  d+=rect(110,770,385,300,'none',c,2)+rect(548,810,422,260,c,op=.08)+line(110,845,495,845,c,2,.45)+line(548,888,970,888,c,2,.45)
  d+=label(140,816,'SAMPLE / BEFORE',c,23,'before')+label(570,860,'SAMPLE / AFTER',c,23,'after')
  d+=path('M510 926 L535 926 M529 916 L539 926 L529 936',c,3)
 elif f==8: # manuscript margin and annotation
  d+=line(235,773,235,1090,c,2,.5)+rect(280,810,640,72,c,op=.12)+rect(280,925,495,18,c,op=.25)
  d+=label(110,835,'01',c,26,'marginalia')+circle(832,935,21,c,2)+path('M819 935 L844 935',c,2)
 elif f==9: # architecture nodes / explicit human boundary
  d+=rect(110,800,205,140,'none',c,2)+rect(438,800,205,140,'none',c,2)+rect(766,800,204,140,'none',c,2)
  d+=line(315,870,438,870,c,3)+line(643,870,766,870,c,3)+path('M560 940 L560 1065 L832 1065',c,2)
  d+=label(135,863,'INPUT',c,22,'input')+label(466,863,'RULE',c,22,'rule')+label(790,863,'HUMAN',c,22,'human')+label(580,1048,'EXCEPTION / HOLD',c,21,'exception')
 elif f==10: # offer spec, visibly held
  d+=rect(110,770,860,300,'none',c,3)+line(110,851,970,851,c,2)+line(540,851,540,1070,c,2,.5)
  d+=label(140,817,'OFFER SPECIFICATION / UNVERIFIED',c,21,'offerhold')+label(140,910,'INCLUDED',c,24,'included')+label(570,910,'EXCLUDED',c,24,'excluded')
 elif f==11: # editorial identity, monumental type fragment
  d+=rect(110,798,860,264,c)
  d+=label(150,875,'S',B,76,'simplify')+label(415,875,'O',B,76,'optimize')+label(685,875,'G',B,76,'grow')
  d+=line(335,885,370,885,B,3)+line(615,885,650,885,B,3)
 return d

def compose_family(family_no,role,tt=False):
 slug,series,cover,a,b,cta,concept=FAMILIES[family_no-1]
 data={'cover':cover,'interior-a':a,'interior-b':b,'conclusion':cta}
 sample=data[role];idx=['cover','interior-a','interior-b','conclusion'].index(role)+1
 w,h=(1080,1920) if tt else (1080,1350);safe=SAFE['tiktok' if tt else 'carousel'];x1,y1,x2,y2=safe
 dark=(family_no in [3,7,11] and idx==1) or (family_no==4 and idx==4) or (family_no==9 and idx==1)
 bg=G if dark else B;c=B if dark else G
 s=base(w,h,bg,f'{series} · {role} · Easywurld visual template')
 if tt:
  s+=page_header(series,1,4,c,1080,320)
  head_y=540;head_x=125;head_width=710;head_size=76
  s+=label(125,425,'PHOTO POST / PLATFORM REFLOW',c,21,'format')
  p,n,step=text(head_x,head_y,sample,head_size,head_width,c,True,600,0,4,'headline');s+=p
  # TikTok adaptation deliberately reflows diagrams to left, leaving right action rail + bottom caption free.
  s+=rect(125,1020,690,238,'none',c,3)+line(125,1100,815,1100,c,2,.45)
  s+=label(145,1080,short_label(concept),c,20,'concept')
  s+=label(145,1170,'KEY MESSAGE REMAINS ABOVE CAPTION ZONE',c,18,'safety')
  s+=label(125,1390,'ILLUSTRATIVE · RECHECK PLATFORM COMPOSER',c,20,'footer')
  assert head_y+(n-1)*step<1000
 else:
  s+=page_header(series,idx,4,c)
  if role=='cover':
   s+=label(110,288,concept.upper()[:48],c,21,'concept')
   t,n,step=text(110,405,sample,88 if len(sample)<40 else 75,830,c,True,600,0,4,'headline');s+=t
   assert 405+(n-1)*step<=690
   s+=art(family_no,role,c)
  elif role=='interior-a':
   s+=label(110,296,'01 / DEFINE THE PROBLEM',c,23,'section')
   t,n,step=text(110,396,sample,69,845,c,True,600,0,4,'headline');s+=t
   s+=art(family_no,role,c)
  elif role=='interior-b':
   s+=label(110,296,'02 / SHOW THE MECHANISM',c,23,'section')
   t,n,step=text(110,396,sample,68,845,c,True,600,0,4,'headline');s+=t
   s+=art(family_no,role,c)
  else:
   s+=label(110,296,'NEXT DECISION',c,24,'section')
   t,n,step=text(110,425,sample,74,845,c,True,600,0,4,'headline');s+=t
   s+=line(110,779,810,779,c,4)+circle(900,779,52,c,3)
   s+=label(110,904,'ASK · CHECK · THEN ACT',c,26,'cta-label')
   s+=label(110,1060,'EXACT CTA + DESTINATION REQUIRE G4 APPROVAL',c,20,'hold')
  s+=footer(idx,4,c)
 return finish(s)

STORY_DATA=[
 ('ENGAGEMENT','01_poll','Which question returns each week?','Choose a theme, not a client name.','Sticker space kept empty.'),
 ('ENGAGEMENT','02_question','What is the buyer still asking?','One specific answer can become a post.','Sticker space kept empty.'),
 ('ENGAGEMENT','03_this_or_that','Scope or speed?','Which one does your buyer check first?','Sticker space kept empty.'),
 ('ENGAGEMENT','04_opinion','More content is not always the fix.','What would you clarify before posting?','Reply area kept empty.'),
 ('EDUCATION','01_one_minute_lesson','One message. One next step.','The first screen should make a choice easier.','Save the test.'),
 ('EDUCATION','02_tip','Ask for the detail that changes the quote.','Not every form field belongs at the start.','Try the shorter prompt.'),
 ('EDUCATION','03_myth_truth','MYTH: more tags fix vague copy.','TRUTH: name what the buyer can receive.','Check the real offer.'),
 ('EDUCATION','04_continuation','The carousel asked about scope.','Here is one extra check: name the exclusion.','See the approved feed post.'),
 ('CONVERSION','01_service_spotlight','A clearer enquiry path.','Service scope and availability: verify first.','Ask what is currently offered.'),
 ('CONVERSION','02_offer','An offer needs current terms.','[VERIFY PRICE, CONTENTS AND DELIVERY]','Hold until G1 approval.'),
 ('CONVERSION','03_problem_solution','Repeated questions cost attention.','A scoped conversation may reveal the gap.','Ask about fit.'),
 ('CONVERSION','04_direct_enquiry','Want to make the next step clearer?','Tell us which buyer question repeats.','Contact route needs checking.'),
]
def compose_story(category,kind,heading,body,cta):
 w,h=1080,1920;safe=SAFE['story'];dark=category=='CONVERSION';bg=G if dark else B;c=B if dark else G
 s=base(w,h,bg,f'{category} story · {kind} · reserved native interaction area')
 # No important text in top 0–260 or lower 1500–1920 app chrome zones.
 s+=label(120,310,'EASYWURLD / '+category,c,25,'series')+line(120,340,960,340,c,2,.55)
 s+=label(120,446,kind.replace('_',' ').upper(),c,22,'type')
 t,n,step=text(120,590,heading,82,825,c,True,600,0,4,'headline');s+=t
 t,n,step=text(120,855,body,43,820,c,False,400,0,5,'body');s+=t
 if kind.startswith(('01_poll','02_question','03_this_or_that','04_opinion')) and category=='ENGAGEMENT':
  # Reserved blank region 1110–1390; no fake sticker or CTA button.
  s+=line(120,1085,960,1085,c,2,.38)+line(120,1420,960,1420,c,2,.38)
 elif category=='EDUCATION':
  s+=rect(120,1115,840,240,'none',c,2)+label(155,1180,'TAKEAWAY',c,24,'takeaway')
  s+=text(155,1240,cta,42,750,c,False,500,0,3,'lesson')[0]
 else:
  s+=rect(120,1130,840,190,'none',c,2)+text(155,1220,cta,41,760,c,False,500,0,3,'cta')[0]
  s+=label(120,1435,'DESTINATION / TERMS: VERIFY BEFORE POST',c,21,'hold')
 s+=label(120,1480,'SIMPLIFY. OPTIMIZE. GROW.',c,21,'footer')
 return finish(s)

LI_DATA=[
 ('BUSINESS_PAGE','01_insight','square','The next decision is the design brief.','Publish the answer, not another vague promise.','index'),
 ('BUSINESS_PAGE','02_education_document','document','Three questions before a new campaign.','Who is it for? What changes? What next?','folio'),
 ('BUSINESS_PAGE','03_diagnosis','square','A reply is not a qualified enquiry.','Find the missing information at the handoff.','report'),
 ('BUSINESS_PAGE','04_strategy_framework','document','Clarity → action → evidence.','One business decision per stage.','network'),
 ('BUSINESS_PAGE','05_service_explanation','square','Scope comes before the quote.','Current deliverables must be verified.','spec'),
 ('BUSINESS_PAGE','06_practical_demo','document','Sample rewrite, not a client result.','Before: vague. After: one verified next step.','comparison'),
 ('BUSINESS_PAGE','07_principle','landscape','Make the buyer question answerable.','An editorial principle, not a result claim.','principle'),
 ('PERSONAL_PAGE','01_observation','square','A question I would ask first.','What does the buyer still have to guess?','margin'),
 ('PERSONAL_PAGE','02_lessons_learned','document','A lesson to test, not a claim of work.','Make the first reply easier to understand.','notebook'),
 ('PERSONAL_PAGE','03_industry_opinion','landscape','Volume is not always the first fix.','An opinion for account-holder review.','opinion'),
 ('PERSONAL_PAGE','04_project_update','square','Building a clearer process.','Project details need account-holder confirmation.','progress'),
 ('PERSONAL_PAGE','05_educational_breakdown','document','Why this sentence earns space.','It names an action someone can verify.','annotation'),
]
LI_DOC_EXTRA=[('BUSINESS_PAGE','02_education_document','inside-a','Start with the audience decision.'),('BUSINESS_PAGE','02_education_document','inside-b','Test the actual next step.'),('BUSINESS_PAGE','02_education_document','conclusion','Keep the useful question.'),('BUSINESS_PAGE','06_practical_demo','inside','Label the sample and its limits.'),('PERSONAL_PAGE','05_educational_breakdown','inside','A personal opinion is not proof.')]
def li_art(kind,x,y,c):
 if kind=='index':return label(x,y,'01 / BUSINESS INSIGHT',c,24,'index')+line(x,y+55,x+560,y+55,c,3)
 if kind=='folio':return rect(x,y,560,240,'none',c,2)+label(x+28,y+68,'01  /  02  /  03',c,28,'chapters')+line(x+28,y+102,x+520,y+102,c,2)
 if kind=='report':return rect(x,y,560,200,'none',c,2)+line(x+28,y+65,x+520,y+65,c,2)+circle(x+510,y+139,18,c,3)
 if kind=='network':return circle(x+90,y+110,45,c,3)+circle(x+300,y+110,45,c,3)+circle(x+500,y+110,45,c,3)+line(x+135,y+110,x+255,y+110,c,2)+line(x+345,y+110,x+455,y+110,c,2)
 if kind=='spec':return rect(x,y,560,200,'none',c,2)+line(x+280,y,x+280,y+200,c,2)+label(x+25,y+55,'IN',c,22,'in')+label(x+310,y+55,'OUT',c,22,'out')
 if kind=='comparison':return rect(x,y,245,190,'none',c,2)+rect(x+280,y,280,190,'none',c,2)+label(x+20,y+50,'SAMPLE A',c,22,'a')+label(x+300,y+50,'SAMPLE B',c,22,'b')
 if kind=='principle':return line(x,y,x+530,y,c,5)+circle(x+545,y,18,c,3)
 if kind=='margin':return line(x+120,y,x+120,y+220,c,2)+label(x,y+55,'01',c,28,'margin')
 if kind=='notebook':return rect(x,y,560,225,'none',c,2)+line(x+30,y+90,x+530,y+90,c,1)+line(x+30,y+150,x+530,y+150,c,1)
 if kind=='opinion':return rect(x,y,560,120,'none',c,3)+label(x+22,y+74,'POINT OF VIEW',c,27,'point')
 if kind=='progress':return rect(x,y,560,52,'none',c,2)+rect(x,y,220,52,c)+label(x,y+112,'WORK IN PROGRESS',c,23,'progress')
 return label(x,y,'01 / WORDS',c,23,'annotation')+line(x,y+65,x+560,y+65,c,2)+circle(x+540,y+140,17,c,2)
def compose_li(account,slug,fmt,heading,body,kind,extra=None):
 typ={'document':'li_doc','square':'li_square','landscape':'li_land'}[fmt];w,h={'document':(1080,1350),'square':(1200,1200),'landscape':(1200,628)}[fmt]
 safe=SAFE[typ];dark=(account=='BUSINESS_PAGE' and kind in ['network','principle']) or (account=='PERSONAL_PAGE' and kind=='opinion')
 bg=G if dark else B;c=B if dark else G
 if extra:heading=extra[1]
 s=base(w,h,bg,f'LinkedIn {account} {slug} {extra[0] if extra else "main"}')
 s+=label(120,170 if fmt=='document' else 150 if fmt=='square' else 135,('EASYWURLD / BUSINESS' if account=='BUSINESS_PAGE' else 'PERSONAL / EDITORIAL SAMPLE'),c,21,'series')
 y=315 if fmt=='document' else 288 if fmt=='square' else 230
 width=780 if fmt=='document' else 900
 size=72 if fmt!='landscape' else 59
 t,n,step=text(120,y,heading,size,width,c,True,600,0,4 if fmt!='landscape' else 3,'headline');s+=t
 if fmt=='landscape':
  t,n,step=text(120,414,body,30,750,c,False,400,0,2,'body');s+=t
  s+=(line(900,482,1050,482,c,4)+circle(1060,482,10,c,2)) if kind=='principle' else ''
 else:
  body_y=610 if fmt=='document' else 570
  t,n,step=text(120,body_y,body,39,800,c,False,400,0,4,'body');s+=t
  s+=li_art(kind,120,850 if fmt=='document' else 710,c)
  s+=label(120,1130 if fmt=='document' else 980,'ILLUSTRATIVE / VERIFY DETAILS',c,20,'hold')
 return finish(s)

def components():
 s=base(1200,1650,B,'Easywurld editable component library')
 s+=label(105,135,'EASYWURLD  /  VISUAL COMPONENTS  /  V1.0',G,28,'title')+line(105,160,1095,160,G,2)
 s+=text(105,280,'A headline can do the hard work.',76,900,G,True,600,0,3,'headline')[0]
 s+=label(105,410,'SECTION LABEL  /  01',G,25,'section')+text(105,490,'Body copy should make the next decision easier.',39,890,G,False,400,0,3,'body')[0]
 s+=rect(105,565,450,165,'none',G,2)+label(135,613,'01 / EVIDENCE PANEL',G,23,'evidence')+line(135,635,530,635,G,1)
 s+=rect(600,565,495,165,'none',G,2)+label(630,613,'02 / COMPARISON',G,23,'comparison')+line(630,635,1065,635,G,1)
 s+=circle(170,870,56,G,3)+circle(575,870,56,G,3)+circle(980,870,56,G,3)+line(226,870,519,870,G,3)+line(631,870,924,870,G,3)
 s+=label(105,770,'DIAGRAM / HUMAN CHECK AT EVERY BOUNDARY',G,23,'diagram')
 s+=rect(105,1010,990,230,'none',G,2)+label(135,1075,'SAMPLE / NOT A CLIENT RESULT',G,23,'sample')+text(135,1150,'Use an honest sample label instead of a fabricated screenshot.',38,880,G,False,400,0,2,'sampletext')[0]
 s+=line(105,1350,1095,1350,G,2)+label(105,1410,'FOOTNOTE · SOURCE / DATE / LIMIT',G,22,'footnote')
 s+=rect(105,1480,990,86,G)+label(135,1535,'CTA TREATMENT  /  NAME THE NEXT STEP',B,26,'cta')
 return finish(s)

def write(rel,content,meta):
 file=ROOT/'TEMPLATE_LIBRARY'/rel;file.parent.mkdir(parents=True,exist_ok=True);file.write_text(content,encoding='utf-8')
 EDITABLE.append({'path':str(file.relative_to(ROOT)),'kind':meta['kind'],'family':meta['family'],'role':meta['role'],'size':meta['size'],'safe':meta['safe'],'version':'1.0','status':'editable sample / font & platform checks pending'})

def build():
 for i,(slug,series,*_) in enumerate(FAMILIES,1):
  for role in ('cover','interior-a','interior-b','conclusion'):
   write(f'CAROUSELS/{slug}/{role}.svg',compose_family(i,role),dict(kind='carousel',family=series,role=role,size='1080x1350',safe=SAFE['carousel']))
  write(f'CAROUSELS/{slug}/tiktok-photo-cover.svg',compose_family(i,'cover',True),dict(kind='TikTok photo reflow',family=series,role='cover',size='1080x1920',safe=SAFE['tiktok']))
 for cat,slug,heading,body,cta in STORY_DATA:
  write(f'STORIES/{cat}/{slug}.svg',compose_story(cat,slug,heading,body,cta),dict(kind='story',family=cat,role=slug,size='1080x1920',safe=SAFE['story']))
 for account,slug,fmt,heading,body,kind in LI_DATA:
  w,h={'document':(1080,1350),'square':(1200,1200),'landscape':(1200,628)}[fmt]
  write(f'LINKEDIN/{account}/{slug}.svg',compose_li(account,slug,fmt,heading,body,kind),dict(kind='LinkedIn',family=account,role=slug,size=f'{w}x{h}',safe=SAFE['li_doc' if fmt=='document' else 'li_square' if fmt=='square' else 'li_land']))
  for extra in LI_DOC_EXTRA:
   if extra[:2]==(account,slug):
    subrole,sample=extra[2:]
    write(f'LINKEDIN/{account}/{slug}-{subrole}.svg',compose_li(account,slug,fmt,heading,body,kind,(subrole,sample)),dict(kind='LinkedIn document',family=account,role=slug+'-'+subrole,size='1080x1350',safe=SAFE['li_doc']))
 write('COMPONENTS/COMPONENT_LIBRARY.svg',components(),dict(kind='component sheet',family='Easywurld',role='reusable components',size='1200x1650',safe=(105,130,1095,1565)))
 (ROOT/'manifest.json').write_text(json.dumps(EDITABLE,indent=2,ensure_ascii=False),encoding='utf-8')
 # Stress proofs are NOT replacement templates. They exercise real copy lengths.
 proof_dir=ROOT/'TEST_PROOFS';proof_dir.mkdir(exist_ok=True)
 long_hook='A buyer can see the product, but still cannot find the scope, availability or next step.'
 heavy='An illustrative business page needs a verified scope, a clear place to ask, a named human reviewer and an exception rule before the message can be published.'
 for i,(_,series,*_) in enumerate(FAMILIES,1):
  for role,copy,y,bottom in [('long-hook',long_hook,350,750),('heavy-internal',heavy,375,760)]:
   s=base(1080,1350,B,series+' '+role+' length stress test')+page_header(series,1,4,G)
   t,n,step=fit_text(110,y,copy,820,bottom,G,True,'stress-headline',max_lines=7)
   s+=label(110,270,'STRESS PROOF / NOT A TEMPLATE',G,22,'stress')+t+art(i,role,G)+footer(1,4,G)
   (proof_dir/f'{i:02d}-{role}.svg').write_text(finish(s))
 print('Generated',len(EDITABLE),'editable SVG source files and 22 length stress proofs')
if __name__=='__main__':build()
