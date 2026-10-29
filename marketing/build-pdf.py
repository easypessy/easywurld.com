#!/usr/bin/env python3
"""Build the readable 300-post campaign PDF from the canonical JSON. Requires ReportLab."""
from pathlib import Path
import json, html
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle,
                                KeepTogether, HRFlowable)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas

ROOT=Path(__file__).resolve().parent.parent
D=json.loads((ROOT/'marketing/content-plan.json').read_text())
OUT=ROOT/'marketing/CONTENT_PLAN.pdf'
GREEN=colors.HexColor('#0A4937'); LEAF=colors.HexColor('#27473A'); CREAM=colors.HexColor('#FAE7C7'); TERRA=colors.HexColor('#9E4E2C'); INK=colors.HexColor('#14170F'); PAPER=colors.HexColor('#FBF9F4'); LINE=colors.HexColor('#D8D5C5')
FONT_DIR=Path.home()/'.cache/easywurld-fonts'
try:
    pdfmetrics.registerFont(TTFont('InterPDF',str(FONT_DIR/'Inter[opsz,wght].ttf')))
    pdfmetrics.registerFont(TTFont('MonoPDF',str(FONT_DIR/'JetBrainsMono[wght].ttf')))
    BODY='InterPDF'; MONO='MonoPDF'
except Exception:
    BODY='Helvetica'; MONO='Courier'
SERIF='Times-Roman'; SERIF_B='Times-Bold'
styles={
 'title':ParagraphStyle('title',fontName=SERIF_B,fontSize=34,leading=38,textColor=GREEN,spaceAfter=16),
 'h1':ParagraphStyle('h1',fontName=SERIF_B,fontSize=23,leading=27,textColor=GREEN,spaceAfter=10),
 'h2':ParagraphStyle('h2',fontName=SERIF_B,fontSize=15,leading=18,textColor=GREEN,spaceBefore=8,spaceAfter=5),
 'h3':ParagraphStyle('h3',fontName=BODY,fontSize=8,leading=10,textColor=TERRA,spaceBefore=7,spaceAfter=3),
 'body':ParagraphStyle('body',fontName=BODY,fontSize=8.3,leading=12.3,textColor=INK,spaceAfter=5),
 'small':ParagraphStyle('small',fontName=BODY,fontSize=6.9,leading=9.8,textColor=LEAF,spaceAfter=3),
 'quote':ParagraphStyle('quote',fontName=BODY,fontSize=8.2,leading=12,textColor=INK,leftIndent=7,borderPadding=5,backColor=PAPER,spaceAfter=5),
 'cardtitle':ParagraphStyle('cardtitle',fontName=SERIF_B,fontSize=12.4,leading=15,textColor=GREEN,spaceAfter=3),
 'cell':ParagraphStyle('cell',fontName=BODY,fontSize=6.7,leading=9.4,textColor=INK),
 'headcell':ParagraphStyle('headcell',fontName=BODY,fontSize=6.8,leading=9,textColor=CREAM),
}
def p(text,style='body'):
    rendered=html.escape(str(text).replace('₦','NGN ')).replace('\n','<br/>')
    return Paragraph(rendered,styles[style])
def table(rows,widths,header=True,font=6.7):
    data=[[p(c,'headcell' if header and i==0 else 'cell') for c in row] for i,row in enumerate(rows)]
    t=Table(data,colWidths=widths,repeatRows=1 if header else 0,hAlign='LEFT')
    t.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('BACKGROUND',(0,0),(-1,0),LEAF),('ROWBACKGROUNDS',(0,1),(-1,-1),[PAPER,colors.white]),('LINEBELOW',(0,0),(-1,-1),.3,LINE),('LEFTPADDING',(0,0),(-1,-1),5),('RIGHTPADDING',(0,0),(-1,-1),5),('TOPPADDING',(0,0),(-1,-1),4),('BOTTOMPADDING',(0,0),(-1,-1),4)]))
    return t
class NumberedCanvas(canvas.Canvas):
    def __init__(self,*a,**kw):super().__init__(*a,**kw);self._saved=[]
    def showPage(self):self._saved.append(dict(self.__dict__));self._startPage()
    def save(self):
        total=len(self._saved)
        for state in self._saved:
            self.__dict__.update(state)
            self.setFillColor(LEAF);self.setFont(BODY,6.5)
            self.drawString(36,22,'EASYWURLD  /  10 CORE POSTS A DAY  /  900 PLACEMENTS')
            self.drawRightString(A4[0]-36,22,f'{self._pageNumber} / {total}')
            super().showPage()
        super().save()
story=[]
counts=D['counts'];formats=counts['formats']
story += [Spacer(1,38),p('SERIES-LED CONTENT SYSTEM','h3'),p('Ten posts a day. Ten reasons to watch.','title'),p('Easywurld · Monday 2 November–Tuesday 1 December 2026','h2'),p('300 core posts. 900 platform placements across TikTok, Instagram and Facebook. One offer each day. Two original memes. Every row starts Draft.','body'),Spacer(1,14)]
story += [table([['At a glance','Active system'],
 ['Owner brief','10 posts a day on Facebook, TikTok and Instagram; four core daily series plus memes, offers, copy breakdowns and an Easywurld introduction'],
 ['Volume','10 core posts/day × 3 platforms = 30 placements/day; 300 core posts and 900 placements across 30 days'],
 ['Daily series','Niche plan · Myth Court · Trend Desk · AI Build · owner meme · Offer A · Copy Move · industry meme · Offer B · Meet Easywurld'],
 ['Formats',f"Carousel {formats.get('Carousel',0)} · AI talking head {formats.get('AI talking head',0)} · Screen demo {formats.get('Screen demo',0)} · Static {formats.get('Relatable static',0)} · Text video {formats.get('Text video',0)}"],
 ['Offer rotation','One ₦5,000 DIY pack per day, two angles. Custom projects are separate.'],
 ['Status','Draft planning pack. No live scheduling. No generated owner avatar or finished videos.'],
 ['Trend gate','30 dated teardowns held until a current example, relevance and rights check are logged.']],[112,410]),Spacer(1,14),p('The owner was right about the structure.','h2'),p('The 10-slot series idea gives the audience repeatable reasons to follow and gives the producer a repeatable brief. It is stronger than a random daily feed. The risk is not the number 10; it is publishing 10 versions of the same generic tip, or 10 hard sells. This plan fixes that with one distinct job per slot, one daily offer, original memes, attributed copy lessons and a verification gate for trends.','body'),PageBreak()]
story += [p('01 / Strategy','h3'),p('Volume with a reason.','h1'),p('Easywurld helps small businesses make the message, website, content and follow-up work together. The account should feel like a useful studio thinking out loud: here is the plan I would test, the advice I would question, the trend I would verify, the workflow I would automate, the joke every owner knows, the offer that fits, the copy lesson worth stealing and the people behind the work.','body')]
story += [p('Why the series work','h2'),table([['Series','Weekly job','What must stay true'],['If I ran this account','Niche-specific social plans','Say “If I ran”; never imply Easywurld manages the account'],['Marketing Myth Court','Verdict + small test','No absolute replaced by another absolute'],['Trend Desk','Dated teardown + adaptation','Verify a current example; no invented live trend'],['AI Automation Build','One bounded workflow','Input → AI draft → human check → output'],['Meme: owner life','Recognition humour','Joke about the work, not the customer'],['Offer Spotlight A','Problem + actual contents','Confirm price, fulfilment and DIY boundary'],['Steal This Copy Move','Attributed principle + new example','Steal the structure, not the words'],['Meme: marketing/AI/clients','Industry humour','Original; no stolen template or fake UI'],['Offer Spotlight B','One objection + answer','Same pack, same keyword, no pressure'],['Meet Easywurld','New intro angle/format','No fake team, office, clients or results']],[112,160,250])]
story += [p('Platform and time map','h2'),table([['Slot','Time WAT','Series','TikTok','Instagram','Facebook'],*[[s['slot'],s['time'],s['name'],s['time'],f"+10 min",f"+20 min"] for s in D['series']]],[26,45,180,67,72,65])]
story += [p('One idea, three placements','h2'),p('Each day has 10 core ideas, not 30 separate productions. Each core post has three captions and independent status/QA fields. TikTok is the native vertical destination; Instagram gets a Reel, carousel or static as appropriate; Facebook gets a slightly more conversational native version. The hook and CTA stay consistent, while the file, caption, crop, audio rights and disclosure are checked per platform.','body')]
story += [p('Formats','h2'),table([['Format','Core posts','Production note'],['Carousel',str(formats.get('Carousel',0)),'Exact five-slide copy. One idea per slide. No fake metrics or stock people.'],['AI talking head',str(formats.get('AI talking head',0)),'Approved likeness/voice or licensed avatar; AI label; no long logo intro.'],['Screen demo',str(formats.get('Screen demo',0)),'Real repo demo or workflow storyboard; concept/sample label visible.'],['Relatable static',str(formats.get('Relatable static',0)),'Original text-led meme. Caption carries the useful lesson.'],['Text video',str(formats.get('Text video',0)),'Short text-led video; same facts and CTA.']],[88,62,372])]
story += [p('Volume warning','h2'),p('A full week is 70 core posts and 210 placements. Batch by series, not by day. Hold a slot when QA fails rather than publishing unreviewed AI or stacking a catch-up burst. The plan is a starting system, not a guarantee of reach, sales or safe platform limits.','body')]
story += [p('Platform adaptation','h2'),table([['Platform','Timing','Adaptation'],['TikTok','Slot time','Native vertical video, photo carousel or text video. Spoken hook, captions, commercial audio check, AI setting.'],['Instagram','+10 min','Reel, carousel or static. Structured caption, crop/cover check, AI setting.'],['Facebook','+20 min','Native text + video/image, photo album or Reel. Conversational caption; do not paste a TikTok tag block.']],[70,48,404])]
story += [p('Offer rotation','h2'),table([['Keyword','Pack','Days'],['PLAYBOOK','The Chat-to-Customer Playbook','1, 10, 19, 28'],['CLEAR','The Clear Homepage Blueprint','2, 11, 20, 29'],['ENGINE','The 30-Day Content Engine','3, 12, 21, 30'],['PAGE','The One-Offer Landing Page Kit','4, 13, 22'],['LOCAL','The Lagos Local Visibility Starter','5, 14, 23'],['MESSAGE','The Clear Message Workbook','6, 15, 24'],['PROMPTS','The Everyday AI Prompt Desk','7, 16, 25'],['TEMPLATES','The Proposal & Report Template Pack','8, 17, 26'],['LAUNCH','The Website Launch & Care Handbook','9, 18, 27']],[75,270,177])]
story += [p('Trust rules','h2'),p('Label all concept/sample work. No invented testimonials, rankings, client results or campaign metrics. Hypothetical businesses and chats are examples. DIY packs are not custom projects. Trend posts need a dated source check. Copywriting posts attribute the principle and use original examples. AI presenters and voices are disclosed. Private CVs, identity sources, customer messages and payment details stay out of public Git.','body')]
story += [p('What we measure','h2'),table([['Question','Evidence','Not enough on its own'],['Did people recognise the problem?','Saves, shares, relevant comments','Raw views'],['Did the explanation hold attention?','Watch time, completion','One viral spike'],['Did the account create intent?','Profile visits, keyword enquiries, briefs','Follower count'],['Did the offer fit?','Confirmed sales, qualified project briefs','Clicks without fulfilment'],['Which series earns a return?','Seven-day comparison by series','One post’s result']],[95,200,227])]
story += [PageBreak()]
story += [p('02 / The dated run','h3'),p('Thirty days, ten slots each.','h1'),p('Each row lists the core topics for the day. Every core post has three platform placements. Times are a test, not a proven best time. Offer keywords rotate through the nine DIY packs.','body')]
for week in range(5):
    rows=[['Day / date','Offer','S1–S5 topics','S6–S10 topics']]
    for d in D['days'][week*7:(week+1)*7]:
        ps=[x for x in D['posts'] if x['day']==d['day']]
        left='\n'.join(f"S{x['slot']} · {x['topic']}" for x in ps if x['slot']<=5)
        right='\n'.join(f"S{x['slot']} · {x['topic']}" for x in ps if x['slot']>5)
        rows.append([f"{d['day']:02d} · {d['iso']}",d['offerKeyword'],left,right])
    story += [p(f'Week {week+1}', 'h2') if week else Spacer(1,0),table(rows,[68,55,190,209])]
story += [PageBreak()]
# Briefs
story += [p('03 / Complete production briefs','h3'),p('All 300 core posts.','h1'),p('Each card includes the hook, exact core copy, CTA, visual/edit direction and trend/offer gate. The CSV and offline app add the three platform captions, per-platform status, QA checks and actual URLs. Nothing is scheduled.','body'),Spacer(1,5)]
for d in D['days']:
    ps=[x for x in D['posts'] if x['day']==d['day']]
    story += [p(f"DAY {d['day']:02d} · {d['iso']} · {d['weekday'].upper()} · OFFER {d['offerKeyword']}",'h3')]
    for x in ps:
        card=[p(f"{x['id']} · S{x['slot']} · {x['time']} WAT · {x['series']} · {x['format']}",'small'),p(x['topic'],'cardtitle'),p('Hook: “'+x['hook']+'”','quote'),p((x.get('script') or (x.get('slides') and '\n'.join(f"Slide {i+1}: {s}" for i,s in enumerate(x['slides']))) or x.get('staticCopy','')),'body'),p('CTA: '+x['cta'],'small')]
        if x.get('offerKeyword'): card.append(p(f"Offer: {x['offerName']} · NGN 5,000 DIY · keyword {x['offerKeyword']}. Confirm price, contents, payment and fulfilment. Not custom work. No guaranteed results.",'small'))
        if x.get('verification'): card.append(p(f"Trend gate: {x['verification']} Dated source: {x['sourceUrl']} ({x['sourceDate']}).",'small'))
        card.append(p('Visual/edit: '+x['visual']+' '+x['edit'],'small'))
        if x.get('demoPath'): card.append(p('Record the real source: client/public'+x['demoPath'],'small'))
        card.append(p(('AI presenter · Easywurld' if x.get('aiDisclosure') and x['format']=='AI talking head' else 'AI voice · Easywurld' if x.get('aiDisclosure') else 'No synthetic presenter planned') + ' · Fallback: '+x['fallback'],'small'))
        card.append(HRFlowable(width='100%',thickness=.5,color=LINE,spaceBefore=3,spaceAfter=7))
        story.append(KeepTogether(card))
story += [PageBreak(),p('04 / Production and publishing','h3'),p('Batch by series. Verify trends. Schedule only after QA.','h1')]
story += [p('Weekly batch rhythm','h2'),table([['Block','Output','Rule'],['Trend verification','7 gates','Log current example, relevance, rights and reviewer'],['Scripts/offers','70 scripts','Confirm facts, price, sample labels and one CTA'],['Talking heads','21+ videos','Approved likeness/voice or static fallback'],['Screen demos','7–14 videos','Real demo or storyboard; concept/sample label'],['Graphics','40–50 assets','Carousels, 14 memes, offer/copy/intro statics'],['Captions','210 placements','Three platform captions; human check each'],['Scheduling','210 placements','Confirm queue; paste actual URL/status']],[100,65,357])]
story += [p('Trend Desk gate','h2'),p('Trend posts are held until the production log contains a current example URL, platform, date checked, rights check, relevance note and reviewer. If no current example is verified, publish only as a dated teardown. Do not claim “trending now” from an old report. Do not use a personal-account sound for a brand unless the rights are cleared.','body')]
story += [p('AI and avatar gate','h2'),p(D['avatarStatus'],'body'),p('Use an approved owner photograph/voice or a licensed provider avatar. Check consent, commercial rights, retention and export terms. Keep the AI label visible and enable the platform setting. The fictional demo founder is not the owner. No private CV, identity document or customer record belongs in this public repository.','body')]
story += [p('Scheduling reality','h2'),p('TikTok’s official scheduler announcement describes a 15-minute to 10-day window and says scheduled posts cannot be edited; delete and re-upload to change one. Check the current limits in your account. Meta Business Suite supports Facebook and Instagram planning, but features and limits vary. The CSV is a planning sheet, not an auto-publishing import.','body')]
story += [p('QA per placement','h2'),p('Facts, price, offer and sample labels checked · trend verification or live-trend wording removed · approved likeness/voice or fallback · captions, crop and disclosure checked · one CTA/destination tested on a phone · human approval recorded. Offer placements add: price, payment and fulfilment confirmed.','body')]
story += [p('Measurement','h2'),p('Record only available metrics: 24-hour and 7-day views/plays, average watch time, completion, saves, shares, profile visits, relevant comments, WhatsApp keyword enquiries, qualified briefs and confirmed sales. Compare by series after seven days. Change one variable at a time. Do not publish an invented success story.','body')]
story += [p('Files and source','h2'),p('Canonical editorial source: marketing/series-plan.json. Generated: marketing/content-plan.json, content-calendar.csv, MEASUREMENT.csv, TREND_VERIFICATION.csv, 300 briefs, the calendar and the offline Series Studio. Commands: npm run content:build; npm run content:check; python marketing/build-pdf.py; python marketing/build-assets.py.','body')]
doc=SimpleDocTemplate(str(OUT),pagesize=A4,leftMargin=36,rightMargin=36,topMargin=36,bottomMargin=38,title='Easywurld 10-a-day content plan',author='Easywurld')
doc.build(story,canvasmaker=NumberedCanvas)
print('Built',OUT)
