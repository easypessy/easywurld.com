#!/usr/bin/env python3
"""Build the readable campaign PDF from the canonical JSON. Requires ReportLab."""
from pathlib import Path
import json, html
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle, KeepTogether
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas

ROOT=Path(__file__).resolve().parent.parent
D=json.loads((ROOT/'marketing/content-plan.json').read_text())
OUT=ROOT/'marketing/CONTENT_PLAN.pdf'
GREEN=colors.HexColor('#0A4937'); LEAF=colors.HexColor('#27473A'); CREAM=colors.HexColor('#FAE7C7'); TERRA=colors.HexColor('#9E4E2C'); INK=colors.HexColor('#14170F'); PAPER=colors.HexColor('#FBF9F4')
FONT=Path.home()/'.cache/easywurld-fonts'
# Use built-in fonts if the optional brand fonts are unavailable.
try:
    pdfmetrics.registerFont(TTFont('InterPDF',str(FONT/'Inter[opsz,wght].ttf')))
    pdfmetrics.registerFont(TTFont('MonoPDF',str(FONT/'JetBrainsMono[wght].ttf')))
    BODY='InterPDF'; MONO='MonoPDF'
except Exception:
    BODY='Helvetica'; MONO='Courier'
SERIF='Times-Roman'; SERIF_B='Times-Bold'
# The PDF uses the unambiguous currency code for portable font rendering.
# The canonical scripts, captions and CSV retain the naira symbol.
styles={
 'title':ParagraphStyle('title',fontName=SERIF_B,fontSize=34,leading=38,textColor=GREEN,spaceAfter=18),
 'h1':ParagraphStyle('h1',fontName=SERIF_B,fontSize=24,leading=28,textColor=GREEN,spaceAfter=12),
 'h2':ParagraphStyle('h2',fontName=SERIF_B,fontSize=16,leading=20,textColor=GREEN,spaceBefore=10,spaceAfter=6),
 'h3':ParagraphStyle('h3',fontName=BODY,fontSize=9,leading=12,textColor=TERRA,spaceBefore=9,spaceAfter=4),
 'body':ParagraphStyle('body',fontName=BODY,fontSize=9.2,leading=14,textColor=INK,spaceAfter=7),
 'small':ParagraphStyle('small',fontName=BODY,fontSize=7.5,leading=11,textColor=LEAF,spaceAfter=5),
 'quote':ParagraphStyle('quote',fontName=BODY,fontSize=9.2,leading=14,textColor=INK,leftIndent=10,borderPadding=7,backColor=PAPER,spaceAfter=8),
 'prompt':ParagraphStyle('prompt',fontName=MONO,fontSize=7.3,leading=10.5,textColor=INK,backColor=PAPER,borderPadding=8,spaceAfter=8),
 'cell':ParagraphStyle('cell',fontName=BODY,fontSize=7.1,leading=10,textColor=INK),
 'headcell':ParagraphStyle('headcell',fontName=BODY,fontSize=7.2,leading=10,textColor=CREAM),
}
def p(text,style='body'):
    rendered=html.escape(str(text).replace('₦','NGN ')).replace('\n','<br/>')
    return Paragraph(rendered,styles[style])
def table(rows,widths,header=True):
    data=[[p(c,'headcell' if header and i==0 else 'cell') for c in row] for i,row in enumerate(rows)]
    t=Table(data,colWidths=widths,repeatRows=1 if header else 0,hAlign='LEFT')
    t.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('BACKGROUND',(0,0),(-1,0),LEAF),('ROWBACKGROUNDS',(0,1),(-1,-1),[PAPER,colors.white]),('LINEBELOW',(0,0),(-1,-1),.35,colors.HexColor('#D8D5C5')),('LEFTPADDING',(0,0),(-1,-1),7),('RIGHTPADDING',(0,0),(-1,-1),7),('TOPPADDING',(0,0),(-1,-1),7),('BOTTOMPADDING',(0,0),(-1,-1),7)]))
    return t
class NumberedCanvas(canvas.Canvas):
    def __init__(self,*a,**kw):super().__init__(*a,**kw);self._saved=[]
    def showPage(self):self._saved.append(dict(self.__dict__));self._startPage()
    def save(self):
        total=len(self._saved)
        for state in self._saved:
            self.__dict__.update(state)
            self.setFillColor(LEAF);self.setFont(BODY,7)
            self.drawString(42,25,'EASYWURLD  /  SIMPLIFY. OPTIMIZE. GROW.')
            self.drawRightString(A4[0]-42,25,f'{self._pageNumber} / {total}')
            super().showPage()
        super().save()
story=[]
story += [Spacer(1,45),p('STRATEGY-FIRST CONTENT PLAN','h3'),p('Clarity before volume.','title'),p('Easywurld · Monday 2 November–Tuesday 1 December 2026','h2'),p('22 main weekday posts. Four formats. Eight weekend review and batching days. One useful next action per post.','body'),Spacer(1,20),table([['At a glance','Active plan'],['Audience','Owner-led small businesses in Lagos and across Nigeria'],['Objective','Relevant WhatsApp enquiries, well-matched DIY pack sales and scoped project briefs'],['Formats','10 AI talking heads · 5 screen demos · 5 carousels · 2 original static posts'],['Pillars','Teach 9 · Trust 6 · Show 4 · Offer 3'],['Slot','18:30 Africa/Lagos (WAT), weekdays; a test hypothesis, not a proven best time'],['Status','Draft copy and starter graphics. No live scheduling or generated owner avatar.']], [125,365]),Spacer(1,18),p('The avatar gate','h2'),p(D['avatarStatus']),p('The Monday carousel can launch without an avatar. Every video brief includes a non-avatar fallback. No private CV, identity source or customer record belongs in this public repository.','body'),PageBreak()]
story += [p('01 / Strategy','h3'),p('Make the pieces agree.','h1'),p('Easywurld helps small businesses make the message, website, content and follow-up work together. Lead with a problem the owner recognises, show a practical fix, then offer one next step.','body')]
story += [p('The four pillars','h2'),table([['Pillar','Posts','Job'],['Teach','9','Solve one small problem with a rewrite, checklist, reply structure or workflow.'],['Show','4','Make the thinking visible through actual, clearly labelled samples.'],['Trust','6','Explain the process, limitations, ownership and responsible AI use.'],['Offer','3','Help the right buyer choose using real contents, price and exclusions.']],[80,40,370])]
story += [p('The format roles','h2'),table([['Format','Count','Use'],['AI talking head','10','Direct explanation or point of view. Approved likeness/voice, restrained delivery, visible disclosure.'],['Screen demo','5','Record the actual repo sample or calendar. Keep concept/sample labels and avoid invented results.'],['Carousel','5','Sequence, checklist or comparison. Five slides, one idea per slide.'],['Relatable static','2','Original recognition humour with a useful resolution in the caption.']], [112,40,338])]
story += [p('The modern talking-head pattern','h2'),p('There is no single official “2026 TikTok look”. This plan uses a creator-led, vertical, immediately relevant pattern: face and problem in the first frame; a specific hook in 0–3 seconds; one concrete fix; one relevant cutaway; one final action. Test concise 25–45 second explanations rather than stretching a slogan or rushing a useful answer.'),p('Chest-up, eye-level, natural light, quiet background. Preserve natural skin texture. Use a small reframe or cutaway when the idea changes, not a zoom every second. Corrected phrase captions, no flashing karaoke, no fake podcast microphone, no long logo end card.'),p('TikTok creative guidance recommends quick hooks, relevant problem–solution stories, human delivery and captions. These are creative principles, not reach guarantees. Source: ads.tiktok.com/business/en/guides/what-is-ad-creative-guide','small'),p('One post, one action','h2'),p('Use a save for a useful checklist, a specific question for conversation, one keyword for a DIY pack, or a link plus problem for a project brief. Do not ask for every action at once.'),p('Trust and measurement','h2'),p('All portfolio work is concept/sample. No invented testimonials, rankings, client results or campaign metrics. Record only available analytics and real enquiries. Compare similar formats and change one variable at a time. The final posts contain a review method, not a pre-written success claim.'),PageBreak()]
story += [p('02 / The dated run','h3'),p('Thirty days, without daily overload.','h1'),p('One main post per weekday. Optional platform reuses are separate CSV rows and are not additional core ideas. Weekend tasks are operational, not compulsory feed posts.','body')]
from datetime import date,timedelta
weekend={w['day']:w for w in D['weekends']}; posts={x['day']:x for x in D['posts']}
rows=[['Day / date','Time','Post or task','Format / pillar']]
for i in range(30):
    dt=date(2026,11,2)+timedelta(days=i); n=i+1; x=posts.get(n)
    rows.append([f'{n:02d} · {dt.strftime("%a %d %b")}',D['time'] if x else '—',f"{x['id']} · {x['topic']}" if x else weekend[n]['task'],f"{x['format']} / {x['pillar']}" if x else 'No feed post'])
story += [table(rows,[91,38,249,112]),PageBreak()]
story += [p('03 / Production and publishing','h3'),p('Batch, review, then schedule.','h1')]
story += [table([['Batch day','Posts','Focus'],['Sun 1 Nov','EW-001–005','Launch: message, homepage, price reply, static'],['Sun 8 Nov','EW-008–012','Trust, follow-up, one-offer page'],['Sun 15 Nov','EW-015–019','Website planning, local visibility, responsible AI'],['Sun 22 Nov','EW-022–026','Offer clarity, sample documents, content system'],['Sun 29 Nov','EW-029–030','Review method and next-step invitation']], [87,105,298])]
story += [p('Avatar and voice','h2'),p('Supply the correct owner-approved source and explicit permission. Check the provider’s consent process, commercial rights, retention/deletion controls and export limits. Test one 10-second clip before the batch. Approve the voice separately and check Easywurld, Lagos, naira, WhatsApp, SEO and prices. If the avatar is wrong, use the fallback.'),p('CapCut edit order','h2'),p('1. Import approved sections into a 9:16 project. 2. Remove the empty intro and long pauses. 3. Keep the hook in the first frame. 4. Add one relevant worksheet or screen cutaway. 5. Generate and correct captions. 6. Add the persistent AI label. 7. Mix voice clearly; music is optional and must be licensed. 8. Check the actual platform safe-area preview. 9. Export 1080×1920 MP4/H.264 at 30 fps. 10. Watch with sound, muted and at thumbnail size.'),p('Disclosure and rights','h2'),p('TikTok requires disclosure of realistic AI-generated media, including a person portrayed saying something they did not say. Enable the AI-generated setting and keep the on-video label and caption context. The help page describes More options in the app. Source: support.tiktok.com/en/using-tiktok/creating-videos/ai-generated-content','body'),p('Use own/licensed audio or TikTok’s Commercial Music Library with the applicable territory and placement rights. A trending personal-account sound is not automatically cleared for a brand or cross-platform reuse. Source: ads.tiktok.com/help/article/how-to-use-the-commercial-music-library','small'),p('Scheduling','h2'),p('TikTok’s official scheduler announcement describes a 15-minute to 10-day window and says changes require deleting and re-uploading. Check current availability in your account. The CSV is a planning sheet, not an auto-publishing import. No account is connected here. Source: ads.tiktok.com/business/en/blog/introducing-video-scheduler-now-you-can-plan-tiktoks-in-advance','body'),p('Status: Draft → Script approved → Asset produced → QA approved → Scheduled → Published → Reviewed. Mark Scheduled only after the platform confirms it. Keep private source media and consent records outside public Git.','small'),PageBreak()]
for x in D['posts']:
    dt=date(2026,11,2)+timedelta(days=x['day']-1)
    story += [p(f"04 / Production brief · {x['id']}",'h3'),p(x['topic'],'h1'),p(f"{dt.strftime('%A %d %B %Y')} · {D['time']} WAT · {x['primary']} · {x['format']} · {x['pillar']}",'small')]
    story += [p('Audience problem: '+x['problem'],'body'),p('Objective: '+x['objective'],'body'),p('One CTA: '+x['cta'],'body'),p('Hook / first frame','h3'),p(x['hook'],'quote')]
    label='Exact spoken script' if x.get('script') else 'Exact slide copy' if x.get('slides') else 'Exact image copy'
    body=x.get('script') or '\n\n'.join(f'Slide {i+1}: {s}' for i,s in enumerate(x.get('slides',[]))) or x.get('staticCopy','')
    story += [p(label,'h3'),p(body,'quote')]
    if x.get('beats'): story += [p('Shot / edit order','h3')]+[p('• '+b,'small') for b in x['beats']]
    story += [p('Caption','h3'),p(x['caption'],'quote'),p('Visual and edit','h3'),p(x['visual']),p(x['edit']),p('Filled production prompt','h3'),p(x['prompt'],'prompt')]
    source=x.get('demoPath') or x.get('sourcePath')
    if source: story += [p('Real source to record: '+source,'small')]
    disc=('Required for planned synthetic voice/presenter: '+('AI voice · Easywurld' if x['format']=='Screen demo' else 'AI presenter · Easywurld')+'. Enable the platform setting; adapt if the final method changes.') if x['aiDisclosure'] else 'No realistic synthetic person/voice planned. Reassess if the production method changes.'
    story += [p('Disclosure: '+disc,'small'),p('Fallback: '+x['fallback'],'small'),p('Destination to verify: '+D['site']+x['route'],'small'),p('Expected asset: assets/'+x['id']+'/'+x['asset']+' — production target, not a finished-file claim. Status: Draft; not scheduled.','small')]
    if x['id'] in ['EW-001','EW-005','EW-017']:
        name={'EW-001':'EW-001_carousel.zip','EW-005':'EW-005_tabs-static.png','EW-017':'EW-017_contact-route-static.png'}[x['id']]
        story += [p('Supplied starter: marketing/assets/launch-week/'+name+' — review before publishing.','small')]
    if x['reuse'].get('instagram'): story += [p('Optional Instagram reuse: 19:00 WAT. Check crop, audio rights and disclosure.','small')]
    for plat in ['facebook','linkedin']:
        if x['reuse'].get(plat): story += [p('Optional '+plat.title()+' copy','h3'),p(x['reuse'][plat],'small')]
    story += [PageBreak()]
story += [p('05 / Weekend operating rhythm','h3'),p('Leave room to reply and improve.','h1')]
for w in D['weekends']:
    dt=date(2026,11,2)+timedelta(days=w['day']-1)
    story += [p(dt.strftime('%A %d %B')+' · '+w['task'],'h2'),p(w['detail'])]
story += [p('Before Monday: final gates','h2'),p('Confirm public handles, live website, WhatsApp and offer fulfilment. Add and test the profile destination. Approve the owner likeness/voice or select fallbacks. Review every price, inclusion and sample label. Produce the first batch. Check captions, pronunciation, crop, disclosure and audio on a phone. Schedule only approved assets. Record actual URLs and results afterwards.'),p('Canonical source: marketing/content-plan.json. Rebuild with npm run content:build; validate with npm run content:check. Full source-linked instructions: marketing/STRATEGY.md and marketing/PRODUCTION.md.','small')]
doc=SimpleDocTemplate(str(OUT),pagesize=A4,rightMargin=42,leftMargin=42,topMargin=40,bottomMargin=45,title='Easywurld — Strategy-First Content Plan',author='Easywurld',subject='2 November–1 December 2026 content calendar and production briefs')
doc.build(story,canvasmaker=NumberedCanvas)
print('Built',OUT)
