"""Build a separate, date-assumed December carousel draft library. No publishing operations.
Rows are hand-authored situations; templates only arrange them. Structural QA != human approval.
"""
from pathlib import Path
from datetime import date,timedelta
from difflib import SequenceMatcher
import csv,json,re
ROOT=Path(__file__).parent
OUT=ROOT/'december-2026-DRAFT'
OUT.mkdir(exist_ok=True)
# sector | friction | evidence a reader can check | first action | second action | useful metric | sample before | sample after
CASES='''mobile car wash|customers cannot tell whether their street is covered|a booking form asks for a phone number before an area|publish a verified coverage map|ask for postcode/area before suggesting a slot|eligible booking requests|We clean everywhere|Mobile car wash in [verified areas]; check a slot by area
bike-rental kiosk|a rider cannot see deposit and return terms|a photo of bicycles says nothing about late returns|put current rental terms beside each bike|show what happens if a return time changes|complete rental enquiries|Rent a bike today|Choose a bike, review the deposit and confirm a return time
craft-supply shop|makers cannot compare pack sizes|a spool image has no length or material on it|label size and material next to the price|link to a verified stock check|size-specific product questions|Supplies for all projects|Cotton cord, [verified length], available in [confirmed colours]
private music teacher|parents cannot see which ages or levels are taught|the page shows a piano without a lesson outline|publish eligible levels and lesson format|explain how a first lesson is arranged|level-matched lesson enquiries|Music lessons for everyone|Beginner piano lessons for [verified age range] in [area]
small cold-chain courier|senders cannot tell whether temperature control is offered|the website lists delivery speed but no handling scope|state accepted items and handling limits|route high-risk items to a staff assessment|suitable shipment requests|We deliver anything fast|Ask whether your item fits our verified cold-chain route
fabric-dye studio|buyers cannot predict colour variation|product images imply every batch is identical|explain batch variation with permissioned examples|offer a current-batch photo before payment|returns caused by mismatched expectations|Every piece is identical|Each dye batch varies; request this week's exact piece
community bookstore|readers cannot confirm whether a title is in stock|a catalogue screenshot is older than the latest delivery|date the availability list|give an order hold request with a clear expiry|confirmed title holds|Thousands of books in stock|Ask us to check this title before you travel
mobile phone repairer|a damage photo cannot establish the final repair price|a screen quote ignores device model and parts|explain diagnosis before giving a binding price|collect model and issue without requesting private passcodes|complete diagnostic requests|Screen repair at one price|Send your model and issue for a scoped repair quote
juice-prep business|subscriptions and one-off orders are mixed together|a customer cannot see which days are covered|compare one-off and recurring options|confirm ingredient and delivery terms before checkout|correctly scoped order requests|Healthy drinks for everyone|Choose a one-off order or review a weekly delivery plan
plant nursery|customers mistake indoor plants for outdoor stock|pictures have no light or watering context|mark placement guidance as species-specific|ask buyers for light conditions before suggesting options|plant-fit questions|Beautiful plants for every room|Tell us your light conditions before choosing a plant
storage-locker operator|users do not know what can be stored|a price table omits dimensions and exclusions|publish usable unit measurements|show a prohibited-items checklist|eligible locker enquiries|Space for anything|Compare unit size and approved storage items before booking
independent optician|frame posts blur style advice and clinical claims|a product photo appears to imply a medical result|separate fashion information from clinical guidance|route vision questions to qualified staff|appropriate appointment requests|Frames that fix your vision|See frame options; ask a qualified optician about eye care
ceramic tile dealer|buyers cannot tell whether prices are per piece or box|a price photo omits coverage area|state box quantity and verified dimensions|add a measurement guide with waste caveat|quotes with correct quantities|Tiles from [price]|Price per box; ask for room measurements before a quote
home laundry pickup|pickup radius is unclear|a postcode outside coverage still reaches the checkout|verify area before accepting an order|display turnaround as a confirmed range, not a promise|eligible pickups|We collect anywhere|Check your area and current pickup availability
local theatre school|a term fee hides the number of classes|a parent sees a stage photo but not dates|publish term dates and session counts|say what happens when a class is missed|enquiries that cite the right class|Join the best theatre school|See the term schedule, age group and what is included
independent dental lab|clinics cannot see sample handover requirements|an order arrives without shade and case details|create a clinician-facing submission checklist|confirm permitted data transfer before files are shared|complete and compliant submissions|Send your case|Review the approved case checklist before sending records
reusable-packaging supplier|buyers compare unit price but miss minimum order|a sample image suggests single-unit retail|show pack sizes and actual minimum quantities|describe lead time based on available stock|qualified wholesale enquiries|Packaging for everyone|Check minimum order and lead time for your pack size
language translation studio|clients cannot tell if certified translation is offered|the service page says only “translation”|separate ordinary and certified work where verified|state required format and turnaround enquiry steps|requests with correct document type|Translate any document|Tell us the language pair and whether certification is required
computer training centre|course titles do not explain prerequisites|a beginner enrols in an advanced class|publish a prerequisite check per course|offer a placement question before registration|level-appropriate registrations|Master computers fast|Find the course that matches your current skill level
handmade candle store|scent names tell buyers little about size and burn care|a close-up image hides vessel volume|label verified weight and care instructions|avoid safety claims without approved evidence|care-related questions and correct orders|Our signature candle is perfect|Choose a scent after checking size and care instructions
pet boarding service|owners cannot find vaccination and check-in rules|a cute photo substitutes for policy details|publish approved intake and animal welfare requirements|offer a pre-booking fit conversation|eligible booking requests|Your pet's second home|Read current boarding requirements before reserving dates
appliance-installation team|buyers assume hardware is included|a flat fee appears beside a complicated installation photo|list what's included and site conditions to check|ask for model and access details before quoting|quotes needing fewer revisions|Installation made easy|Send model and access photos for a scoped installation quote
public-speaking coach|workshop and 1:1 services look identical|a testimonial-free page provides no format choice|compare the two formats and suitable goals|use a labelled sample session outline|fit-matched enquiries|Speak with confidence|Choose a group session or ask about individual coaching
organic spice seller|the origin statement lacks a traceable basis|a pack says “organic” without documentation|remove certification words until evidence is cleared|share a verified ingredient and sourcing description|questions answered without unsupported claims|Certified organic spices|See the verified ingredients and sourcing details
neighbourhood print kiosk|the online file upload has no file requirements|a customer sends a low-resolution screenshot|publish accepted file types and print dimensions|ask for deadline and paper finish before confirming|print-ready enquiries|Upload anything to print|Check file size and finish before sending a print request
art-framing shop|customers cannot estimate framed size from the photo|a small frame looks large in a styled room|show frame dimensions beside a ruler|explain custom measurements and quotation steps|dimension-ready quote requests|Frames for every wall|Choose a verified size or send measurements for custom framing
independent cleaning co-op|buyers cannot see whether supplies are included|two quotes cover different tasks|name the cleaning checklist and exclusions|ask about property size and access before pricing|quotes accepted with scope understood|A sparkling home at one price|Review the task list and request a quote for your space
solar maintenance team|a page confuses maintenance with system installation|a prospective client asks for equipment sales|clarify service boundaries and technician qualification|route electrical safety concerns to qualified personnel|maintenance-fit enquiries|We handle all solar work|Ask about inspection and maintenance scope before booking
artisan bread subscription|customers do not understand pause/cancel rules|weekly delivery is described as “flexible”|publish current cutoff and pause policy|show the next available delivery date|accurate subscription requests|Bread whenever you want|Check the next delivery and the pause cutoff
remote bookkeeping practice|owners cannot see what documents to prepare|“monthly accounts” hides a first-month setup step|make a privacy-safe intake checklist|confirm reporting scope and client data permissions|complete initial scope enquiries|We do all your accounts|See what records a monthly bookkeeping review needs'''
CASES=[v.split('|') for v in CASES.splitlines() if v.strip()]
assert len(CASES)==30 and all(len(v)==8 for v in CASES)
MYTHS='''Customers will ask if they are outside the coverage area|Deposit terms can wait until after a rental|A product photo tells buyers the pack size|Parents do not need lesson format before enquiring|A fast delivery headline explains cold-chain handling|A styled image guarantees the next dye batch will match|A book catalogue never needs a date|A damage photo is enough for a final repair quote|One-off and recurring orders need the same explanation|Every plant suits every room|A locker price list explains what can be stored|Frame styling advice can double as clinical advice|A tile price makes the unit of sale obvious|A checkout will sort out an uncovered address|A term fee tells parents how many classes they get|Clinical case details can arrive in any file|Wholesale minimums only matter after checkout|All translations have the same certification status|Beginners can choose an advanced class from its title|A scent name explains candle size and care|Cute photos tell owners the boarding rules|A flat installation fee includes every part|A workshop is the same decision as private coaching|Calling a product organic needs no evidence|Any uploaded image is print ready|Styled room photos show actual frame dimensions|Two cleaning quotes cover identical tasks|Maintenance and installation are interchangeable|A flexible subscription does not need a pause policy|Monthly bookkeeping starts without an intake checklist'''.split('|')
PRINCIPLES='''specificity over adjectives|voice of customer without invented quotes|one primary action per page|reason-why copy|match message to awareness|answer the immediate objection|show the process, not just the finish|write for the comparison moment|name exclusions early|sequence questions from simple to specific|lead with the buyer's task|keep the first sentence readable|use a concrete example|show the cost without invented numbers|describe the outcome without a guarantee|separate evidence from possibility|write the helpful label first|test one variable at a time|reduce jargon without losing precision|name what the buyer receives|use genuine customer phrasing with consent|turn a feature into an actual use|make a promise narrow enough to prove|give instructions in action order|use a demonstration instead of a superlative|clarify before adding urgency|write for the next decision|match CTA to reader readiness|make the comparison fair|edit until every sentence earns space'''.split('|')
BELIEFS='''Clarity is a service|A good question can save a bad campaign|The offer must survive a small screen|A brief is a kindness to the team|Growth should be measured honestly|Simple systems are easier to own|The customer deserves the boundary|One truthful example beats a bold promise|We would rather hold a claim than guess|Design should help the reader decide|The handover is part of the deliverable|Not every request needs a new tool|What happens after the click matters|We can disagree without blaming customers|The simplest useful next step is often the right one|A brand can be calm and direct|A credible no builds trust|A useful metric changes a decision|The work should still function when we leave|A service page should explain the work|Every process has an exception|A business owner is not a content machine|Strategy has a not-now list|We use AI for bounded jobs|Publishing is not the same as learning|The buyer's question deserves an answer|Rights and privacy are part of quality|A good offer tells you who it is not for|The final file needs an owner|Optimize only what you understand'''.split('|')
assert len(MYTHS)==len(PRINCIPLES)==len(BELIEFS)==30
SERIES=['Marketing diagnosis','Marketing education','Marketing myths and truths','Relatable enemy / common ground','If I were hired today','The Easywurld client process','Proof and practical demonstration','Growth strategy and copywriting breakdowns','AI and business automation','Offer and solution','Meet Easywurld: brand and beliefs']
SERVICES=['Digital Marketing','Web Design','Landing Pages','Business Systems','Social Media','Copywriting','Reports & Presentations']
PROCESS=['intake and brief','audience/offer diagnosis','strategy and claim review','concept approval','copy handoff','creative and rights review','final platform check','delivery handover','measurement definition','learning memo']
DESIGNS=[['Oversized Lora hook, ample empty space','Situation as two short blocks','Illustrative friction labelled example','One green-highlighted first action','Second step in simple route diagram','Metric and soft CTA in small editorial footer'],
['One concrete lesson in large heading','Business context with plain text','Example card labelled illustrative','Principle as single line','Apply-it step in restrained two-column layout','What to check next, no promise'],
['Myth as quoted claim; mark MYTH','Context card, no fake data','Illustrative counterexample','Conditional verdict in deep green','One small test, numbered','Boundary and discussion CTA'],
['Owner moment in editorial text, no invented quote','Unhelpful situation in neutral card','Why the system causes friction','One owner-controlled move','One humane improvement','Quiet recognition and share CTA'],
['Cover labelled HYPOTHETICAL','Starting situation as case note','First investigation as checklist','Priority in a bordered box','Change written as a decision','Implementation in two-step route','Metric as miniature scorecard','Aim without guaranteed result'],
['Process question as sparse cover','Use a fictional example, label it','Documented step with gate number','What the client supplies / approves','What remains unknown','Hand-off and soft CTA'],
['Cover labelled ILLUSTRATIVE REWRITE','Before copy in a clearly fake box','Why the line fails the buyer','After copy large in green','Next line / route beside it','Lesson and save CTA'],
['Technique named on cover','Context, not a stolen ad','Principle in plain English','Original example as left block','Application as right block','Caveat/test and close'],
['Business bottleneck before any tool','Allowed input on small card','Tool task in bounded lane','Human approval as visible stop gate','Failure / privacy exception','Pilot measure and soft CTA'],
['Verified service category on cover','Buyer-fit and problem panel','Possible scoped output, not fixed terms','What info determines scope','Boundary / terms to verify','Fit enquiry CTA pending G1'],
['Belief as large Lora sentence','Buyer situation, simple text','Why we hold that belief','What it changes in practice','Boundary we keep','Quiet follow CTA']]
OBJECTIVES=['recognition','teach','qualify','connection','demonstrate thinking','reduce buying uncertainty','demonstrate copy','teach copy','explain automation','generate fit enquiries','build familiarity']

def article(phrase): return ('an ' if phrase[0].lower() in 'aeiou' else 'a ')+phrase

def concept(d,i):
 idx=(d+i*7)%30
 case=CASES[idx]
 sector,friction,example,first,second,measure,before,after=case
 myth=MYTHS[idx]; principle=PRINCIPLES[idx]; belief=BELIEFS[d]
 service=SERVICES[(d+i)%7]; step=PROCESS[d%10]
 if i==0:
  hook=[f'The {sector} page leaves one question open.',f'An enquiry to {article(sector)} needs a better first screen.',f'This {sector} page hides a buying detail.'][d%3]
  slides=[hook,f'For {article(sector)}, {friction}.',f'Illustrative check: {example}.',f'First, {first}.',f'Then {second}.',f'Watch {measure}, not just views. Save this diagnosis.']
 elif i==1:
  hook=[f'Teach {sector} buyers what to check first.',f'A {sector} lesson starts with the next question.',f'The {sector} buyer needs this explanation.'][d%3]
  slides=[hook,f'Consider {article(sector)}: {friction}.',f'Example: {example}.',f'The principle: {principle}.',f'In practice, {first}, then {second}.',f'Check {measure}. Save for your content plan.']
 elif i==2:
  hook=f'Myth: {myth}.'
  slides=[hook,f'For {article(sector)}, this advice still needs a buyer context.',f'Illustrative context: for {article(sector)}, {friction}.',f'Verdict: “{myth}” is not a universal rule.',f'Test one clearer route: {first}.',f'Watch {measure}; separate attention from a real buyer action.']
 elif i==3:
  hook=[f'The owner of {article(sector)} is repeating one answer.',f'The {sector} inbox has a hidden tax.',f'This {sector} owner needs a clearer system.'][d%3]
  slides=[hook,f'{article(sector).capitalize()} owner is managing a business while {friction}.',f'The frustrating system: {example}.',f'One move in the owner’s control: {first}.',f'Then {second}.',f'The owner gets a clearer conversation. Share with someone doing it all.']
 elif i==4:
  hook=f'Hypothetical: I take over {article(sector)} brief today.'
  slides=[hook,f'Starting point: {friction}.',f'Investigate first: {example}.',f'Priority: answer the buyer’s question before adding more reach.',f'Change: {first}.',f'Implement: {second}; have an owner verify every term.',f'Measure: {measure}.',f'Aim: fewer unanswered questions and better-fit enquiries, not promised sales.']
 elif i==5:
  hook=f'What happens during {step} for {article(sector)}?'
  slides=[hook,f'Illustrative request from {article(sector)}: {friction}.',f'The documented step is {step}; a named owner records its decision.',f'Illustrative detail to verify: {example}.',f'What we still need to confirm: scope, reviewer and rights for this project.',f'Only an authorised approver releases this package. Ask how the step works.']
 elif i==6:
  hook=f'Illustrative rewrite: {sector} wording.'
  slides=[hook,f'Sample BEFORE: “{before}.”',f'Why it misses: {friction}.',f'Sample AFTER: “{after}.”',f'Make the next step usable: {second}.',f'Check {measure} after the change. This is not a client result.']
 elif i==7:
  hook=f'Copy move: {principle}.'
  slides=[hook,f'Imagine {article(sector)} making an offer.',f'The buyer’s unanswered question: {friction}.',f'The principle: {principle}.',f'Original application: “{after}.”',f'Verify every bracketed detail; watch {measure}. Save this move.']
 elif i==8:
  hook=f'The {sector} enquiry needs a human gate.'
  slides=[hook,f'{article(sector).capitalize()} sees repeated enquiries because {friction}.',f'Approved input: a buyer’s area/item/goal, only with permission.',f'Tool job: flag this sample friction for review: {example}.',f'Human gate: verify current terms and route exceptions; {second}.',f'Pilot metric: incorrect routes and {measure}. No magic claims.']
 elif i==9:
  hook=f'When {article(sector)} needs {service.lower()}.'
  slides=[hook,f'Possible fit: {friction}.',f'The Easywurld site lists {service} as a service category.',f'Potential scoped work: {first}; confirm deliverables in a brief.',f'Next task to scope: {second}. Terms are unverified.',f'Ask whether {service.lower()} is available for this brief. No price or result promised.']
 else:
  hook=belief+'.'
  slides=[hook,f'Consider the owner of {article(sector)}: {friction}.',f'At Easywurld, Simplify means {first}.',f'Optimize means {second}.',f'Grow means measuring {measure} without claiming a guaranteed lift.',f'We hold that boundary. Follow for useful business-growth thinking.']
 return case,hook,slides,service,step

posts=[]
for d in range(30):
 dt=date(2026,12,2)+timedelta(days=d)
 for i,series in enumerate(SERIES):
  case,hook,slides,service,step=concept(d,i)
  sector,friction,example,first,second,measure,before,after=case
  idx=(d+i*7)%30
  myth=MYTHS[idx]; principle=PRINCIPLES[idx]; belief=BELIEFS[d]
  pid=f'V2-{dt:%Y%m%d}-{i+1:02d}'
  cta='Ask Easywurld whether this scope is available; terms require confirmation.' if i==9 else ('Share this with an owner who needs a clearer process.' if i==3 else 'Save this for your next planning session.' if i in [0,1,4,6,7,8] else 'Follow Easywurld for practical growth thinking.' if i==10 else 'Ask us what this step would require for your project.' if i==5 else 'Test the claim against a real buyer decision.')
  caption_stems=[
   f'If {article(sector)} cannot answer the coverage or scope question clearly, more views will not explain it. {example.capitalize()}. Check the path from interest to a usable enquiry.',
   f'For {article(sector)}, the useful lesson is about {principle}. {example.capitalize()}. Teach the buyer which detail to check before asking for a decision.',
   f'“{myth}” is a claim, not a universal fact. In this illustrative {sector} example, {friction}. Test the context instead of arguing from reach alone.',
   f'An owner of {article(sector)} should not spend every day untangling the same missing detail. {example.capitalize()}. The friction is in the system, not in the buyer.',
   f'Hypothetical brief, not a client case: {article(sector)} faces this issue: {friction}. I would start with the facts behind the first enquiry, then test the clearer route.',
   f'Our documented workflow includes the {step} stage. A fictional {sector} request shows why the information, review owner and rights matter before any file is released.',
   f'This is an illustrative copy exercise. “{before}” asks a buyer to guess. The alternative gives one concrete next step; it is not a measured outcome.',
   f'The copy move is {principle}. In the {sector} illustration, the buyer needs to know: {friction}. Only publish the replacement line when its details are verified.',
   f'An automation for {article(sector)} could collect missing context, but a person must still check exceptions. The tool should not promise an answer it cannot verify.',
   f'The site lists {service} as a category, not a fixed package. A {sector} with this problem may need a scoped conversation. Price and availability require confirmation.',
   f'Our belief: {belief.lower()}. For a {sector}, that means taking the buyer’s question seriously before adding another campaign.'
  ]
  caption=caption_stems[i]+' '+cta
  tags=['#Easywurld','#SmallBusinessMarketing','#LagosBusiness']
  variants={
    'Instagram':f'{caption} '+ ' '.join(tags),
    'TikTok photo':f'{hook} Illustrative {sector} example. {cta} #Easywurld #BusinessTips',
    'Facebook':f'{caption}',
    'LinkedIn company':f'{hook}\n\nFor {article(sector)} (illustrative), {friction}. A useful first decision is to {first}. Then {second}. Review {measure} before deciding what to change next. {cta}',
    'LinkedIn personal':f'Illustrative situation, not a client story: {article(sector).capitalize()} has this friction: {friction}. One possible test is to {first}. Review {measure} before claiming any result. {cta}'
  }
  if i==9: variants['TikTok photo']=f'{hook} Availability, scope and terms need confirming. {cta} #Easywurld'
  art=DESIGNS[i]
  assert len(art)==len(slides)
  posts.append({'id':pid,'date':dt.isoformat(),'series_number':i+1,'series':series,'objective':OBJECTIVES[i],'audience':f'Owner-led small businesses; illustrative {sector} situation','topic':(myth if i==2 else principle if i==7 else BELIEFS[d] if i==10 else f'{sector}: {friction}'),'angle':friction,'hook':hook,'slides':[{'number':n+1,'copy':x,'visual':art[n]} for n,x in enumerate(slides)],'caption':caption,'cta':cta,'keywords':[sector,'small business marketing',f'{service.lower()} services' if i==9 else 'customer decision'],'hashtags':tags,'platform_adaptations':variants,'publication_time':'TIME PENDING — timetable not approved','status':'editorial draft / G1–G4 pending / not scheduled','example_label':'Illustrative, hypothetical, not a client result','source_class':'existing site category + provisional scope' if i==9 else 'curriculum process; project details unverified' if i==5 else 'illustrative editorial hypothesis','measurement_question':measure})
assert len(posts)==330
(OUT/'posts.json').write_text(json.dumps(posts,indent=2,ensure_ascii=False),encoding='utf-8')
with (OUT/'calendar.csv').open('w',newline='',encoding='utf-8') as f:
 w=csv.writer(f);w.writerow(['date','id','series','topic','hook','audience','time_wat','status'])
 for x in posts:w.writerow([x['date'],x['id'],x['series'],x['topic'],x['hook'],x['audience'],x['publication_time'],x['status']])
for d in range(30):
 daily=posts[d*11:(d+1)*11]
 out=[f'# Easywurld carousel drafts — {daily[0]["date"]}', '', '**Review-only.** Date is an unapproved planning assumption; every time is TIME PENDING; no exports or live schedule. No prior content altered. All business examples are illustrative, not client cases. Use #FBE7C5/#144D3C, Lora/Canva Sans after font rights check. Render mobile-first at a verified platform size and label hypothetical examples on-slide.', '']
 for p in daily:
  out += [f'## {p["id"]} · Series {p["series_number"]}: {p["series"]}',f'Objective: {p["objective"]}. Audience: {p["audience"]}.',f'Topic: {p["topic"]}. Angle: {p["angle"]}. Hook: {p["hook"]}',f'Publication: {p["publication_time"]}. Status: {p["status"]}. Evidence: {p["source_class"]}.','']
  for sl in p['slides']:out += [f'- **Slide {sl["number"]}:** {sl["copy"]}  ',f'  - Visual: {sl["visual"]}; deep-green type on beige; respect safe margins.']
  out += ['',f'**Caption:** {p["caption"]}',f'**CTA:** {p["cta"]}',f'**Keywords:** {", ".join(p["keywords"])}. **Tags:** {" ".join(p["hashtags"])} (relevance review required).','**Platform adaptations (no additional placement implied):**']
  for platform,body in p['platform_adaptations'].items():out.append(f'- {platform}: {body}')
  out += ['','---','']
 (OUT/f'{daily[0]["date"]}.md').write_text('\n'.join(out),encoding='utf-8')
# Screening only, no declaration of semantic uniqueness or live queue status.
old=json.loads((ROOT.parent/'content-plan.json').read_text())['posts']
old=[x for x in old if x.get('type')=='Content']
older=json.loads((ROOT.parent/'carousel-first-2026-11-07/posts.json').read_text())
comp=[(x['id'],x['hook']) for x in old+older]
def score(a,b):return SequenceMatcher(None,a.lower(),b.lower()).ratio()
with (OUT/'duplication-screen.csv').open('w',newline='',encoding='utf-8') as f:
 w=csv.writer(f);w.writerow(['new_id','hook','closest_old_id','similarity','manual_review','live_queue_check'])
 for x in posts:
  old_id,old_hook=max(comp,key=lambda r:score(x['hook'],r[1]))
  w.writerow([x['id'],x['hook'],old_id,f'{score(x["hook"],old_hook):.2f}','required: compare topic/angle/example; similarity is not clearance','unknown — platform not connected'])
with (OUT/'publishing-tracker.csv').open('w',newline='',encoding='utf-8') as f:
 w=csv.writer(f);w.writerow(['post_id','date','series','approved_platform','approved_time_wat','G0','G1','G2','G3','G4','G5','asset_status','queue_verified','schedule_confirmation','live_url','qualified_enquiries','notes'])
 for x in posts:w.writerow([x['id'],x['date'],x['series'],'TIME PENDING','TIME PENDING','unconfirmed','pending','pending','pending','pending','n/a','not rendered','unknown','','','','Hold: approval/timetable/assets/account unavailable'])
print(f'{len(posts)} drafts, {sum(len(x["slides"]) for x in posts)} slide-copy blocks, {len(list(OUT.glob("2026-*.md")))} dated packages')
# Readable calendar index is regenerated with each build.
calendar_lines=['# 30-day / 11-series carousel topic calendar — unapproved','','**2–31 December 2026 is an assumption, not a confirmed campaign date.** There is no approved publishing timetable for this run; all slots are TIME PENDING. Each link opens draft slide copy, per-slide art direction, captions and adaptations. No assets or posts are scheduled.','','| Date | 11 series topics (S01–S11) | Full drafts |','|---|---|---|']
for d in range(30):
 daily=posts[d*11:(d+1)*11]
 day=daily[0]['date']
 topics='<br>'.join(f"{x['series_number']:02d}. {x['topic']}" for x in daily)
 calendar_lines.append(f'| {day} | {topics} | [{day}.md]({day}.md) |')
(OUT/'30_DAY_CALENDAR.md').write_text('\n'.join(calendar_lines)+'\n',encoding='utf-8')
