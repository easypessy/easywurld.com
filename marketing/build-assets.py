#!/usr/bin/env python3
"""Render the supplied launch-week static assets. Requires Pillow.

Fonts are not vendored. Download Fraunces, Inter and JetBrains Mono from the
Google Fonts GitHub repository, or set EASYWURLD_FONT_DIR to a local font folder.
The committed PNGs are ready to use; rerun only when copy/brand changes.
"""
from pathlib import Path
import json, os, textwrap, zipfile
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'marketing/assets/launch-week'
OUT.mkdir(parents=True, exist_ok=True)
PLAN = json.loads((ROOT / 'marketing/content-plan.json').read_text())
POSTS = {p['id']: p for p in PLAN['posts']}
FONT_DIR = Path(os.environ.get('EASYWURLD_FONT_DIR', Path.home() / '.cache/easywurld-fonts'))
CREAM='#FAE7C7'; GREEN='#0A4937'; LEAF='#27473A'; TERRA='#9E4E2C'; INK='#14170F'; PAPER='#FBF9F4'

def font(kind, size, weight=500):
    names={'serif':'Fraunces[SOFT,WONK,opsz,wght].ttf','sans':'Inter[opsz,wght].ttf','mono':'JetBrainsMono[wght].ttf'}
    f=ImageFont.truetype(str(FONT_DIR/names[kind]),size)
    axes=f.get_variation_axes()
    values=[a['default'] for a in axes]
    for i,a in enumerate(axes):
        if a['name']==b'Weight': values[i]=weight
        if a['name'] in (b'Optical Size',b'Optical size'): values[i]=min(72 if kind=='serif' else 24,a['maximum'])
        if a['name']==b'Wonky': values[i]=0
    f.set_variation_by_axes(values)
    return f

def wrap(draw, text, f, width):
    lines=[]
    for paragraph in text.split('\n'):
        if not paragraph: lines.append(''); continue
        line=''
        for word in paragraph.split():
            trial=(line+' '+word).strip()
            if draw.textlength(trial,font=f)<=width: line=trial
            else:
                if line: lines.append(line)
                line=word
        if line: lines.append(line)
    return lines

def paragraph(draw, text, xy, f, fill, width, gap=1.16):
    x,y=xy
    for line in wrap(draw,text,f,width):
        draw.text((x,y),line,font=f,fill=fill)
        y+=int(f.size*gap)
    return y

def mark(im, xy, size):
    logo=Image.open(ROOT/'client/public/brand/mark.png').convert('RGBA')
    box=logo.getbbox(); logo=logo.crop(box)
    logo.thumbnail((size,size),Image.Resampling.LANCZOS)
    im.alpha_composite(logo,(int(xy[0]),int(xy[1])))

def footer(draw, im, n, total, section):
    draw.line((80,1215,1000,1215),fill='#CCCEB9',width=2)
    draw.text((80,1243),'EASYWURLD',font=font('serif',25,650),fill=GREEN)
    draw.text((80,1281),section,font=font('mono',17,450),fill=LEAF)
    draw.text((930,1260),f'{n:02d}/{total:02d}',font=font('mono',20),fill=GREEN)

def carousel():
    p=POSTS['EW-001']; files=[]
    titles=[p['hook'],'One business.\nToo many voices.','The gap is\nthe problem.','Make it\nagree.','That’s the work.']
    supports=['','Your website says one thing. Your posts say another.','Your customer replies say something else.','Make the message, page, content and follow-up agree.','Easywurld\nSimplify. Optimize. Grow.']
    for i in range(5):
        im=Image.new('RGBA',(1080,1350),CREAM); d=ImageDraw.Draw(im)
        d.text((80,75),'MARKETING CLARITY',font=font('mono',20),fill=LEAF)
        if i==0:
            paragraph(d,titles[i],(80,235),font('serif',88,620),GREEN,900,1.12)
            d.line((80,885,230,885),fill=TERRA,width=7)
            paragraph(d,'One clear story. Wherever customers meet you.',(80,935),font('sans',31),INK,850)
        elif i in (1,2):
            paragraph(d,titles[i],(80,220),font('serif',91,620),GREEN,920,1.12)
            paragraph(d,supports[i],(80,610),font('sans',43),INK,870,1.35)
            if i==1:
                for j,label in enumerate(['WEBSITE','SOCIAL','REPLIES']):
                    x=80+j*307; d.rounded_rectangle((x,900,x+285,995),radius=5,outline=LEAF,width=2)
                    d.text((x+22,935),label,font=font('mono',22),fill=GREEN)
        elif i==3:
            paragraph(d,titles[i],(80,210),font('serif',100,620),GREEN,900)
            for j,label in enumerate(['Message','Page','Content','Follow-up']):
                y=570+j*112
                d.text((80,y),f'0{j+1}',font=font('mono',25),fill=LEAF)
                d.text((175,y-8),label,font=font('sans',45,550),fill=GREEN)
            d.line((80,1060,245,1060),fill=TERRA,width=7)
        else:
            mark(im,(80,195),135)
            d.text((80,405),'EASYWURLD',font=font('serif',84,650),fill=GREEN)
            d.text((80,520),'Simplify. Optimize. Grow.',font=font('serif',43,550),fill=GREEN)
            paragraph(d,'The message, page, content and follow-up. Together.',(80,690),font('sans',39),INK,870)
            paragraph(d,'What needs clarity: message, page or follow-up?',(80,925),font('sans',30),LEAF,860)
        footer(d,im,i+1,5,'ONE BUSINESS. ONE CLEAR STORY.')
        path=OUT/f'EW-001_slide-{i+1}.png'; im.convert('RGB').save(path,optimize=True); files.append(path)
    with zipfile.ZipFile(OUT/'EW-001_carousel.zip','w',zipfile.ZIP_DEFLATED) as z:
        for f in files: z.write(f,f.name)
        z.writestr('CAPTION.txt',p['caption']+'\n\nCTA: '+p['cta'])
        z.writestr('READ_ME.txt','Draft for human review. Upload the five PNGs in numbered order. Confirm profile/contact details before publishing. No AI presenter is used in these graphics.')

def static(post_id, filename, headline, resolution, note):
    im=Image.new('RGBA',(1080,1350),CREAM); d=ImageDraw.Draw(im)
    d.text((80,75),'SMALL BUSINESS, REAL LIFE',font=font('mono',20),fill=LEAF)
    paragraph(d,headline,(80,260),font('serif',105,620),GREEN,920,1.12)
    d.line((80,650,240,650),fill=TERRA,width=7)
    paragraph(d,resolution,(80,735),font('sans',46,550),INK,880,1.3)
    paragraph(d,note,(80,995),font('sans',28),LEAF,880)
    footer(d,im,1,1,'EASYWURLD · SIMPLIFY. OPTIMIZE. GROW.')
    im.convert('RGB').save(OUT/filename,optimize=True)
    (OUT/(post_id+'_caption.txt')).write_text(POSTS[post_id]['caption']+'\n')

def video_guides():
    # Transparent production overlay, not a finished video and not a person.
    im=Image.new('RGBA',(1080,1920),(0,0,0,0)); d=ImageDraw.Draw(im)
    d.rounded_rectangle((75,205,570,263),radius=7,fill=CREAM)
    d.text((94,220),'AI presenter · Easywurld',font=font('sans',27,600),fill=GREEN)
    d.rounded_rectangle((75,1320,855,1460),radius=8,fill=CREAM)
    d.text((98,1345),'[Corrected caption line one]',font=font('sans',32,650),fill=GREEN)
    d.text((98,1395),'[Corrected caption line two]',font=font('sans',32,650),fill=GREEN)
    im.save(OUT/'video-overlay-template.png')
    guide=Image.new('RGB',(1080,1920),PAPER); g=ImageDraw.Draw(guide)
    g.rectangle((80,260,850,1450),outline=TERRA,width=5)
    g.rectangle((200,410,760,1110),outline=LEAF,width=3)
    g.text((225,445),'FACE / DEMO',font=font('mono',35),fill=GREEN)
    g.text((225,505),'Keep eyes and mouth clear',font=font('sans',25),fill=INK)
    g.text((95,130),'CONSERVATIVE HOUSE GUIDE',font=font('mono',28),fill=GREEN)
    g.text((95,180),'Not an official platform safe zone',font=font('sans',27),fill=INK)
    g.text((95,1510),'Essential text: x 80–850, y 260–1450',font=font('mono',25),fill=GREEN)
    g.text((95,1570),'Always check the actual upload preview.',font=font('sans',28),fill=INK)
    g.text((95,1640),'Do not export this guide into the final video.',font=font('sans',26),fill=TERRA)
    guide.save(OUT/'video-safe-area-guide.png',optimize=True)
    (OUT/'VIDEO_TEMPLATE_README.txt').write_text('video-overlay-template.png is a transparent 1080x1920 layout guide. Replace bracketed caption placeholders with corrected words before export. Use the AI-presenter label only for a synthetic presenter; use AI voice · Easywurld for synthetic narration over a demo. Remove the label if the final asset contains no realistic AI person/voice. video-safe-area-guide.png is instructions only, never publish it. No owner likeness or finished video is included.\n')

carousel()
static('EW-005','EW-005_tabs-static.png','27 tabs open.\nStill no post.','Close 26.\nAnswer one customer question.','One useful answer beats another moodboard.')
static('EW-017','EW-017_contact-route-static.png','New campaign.\nOld phone number.','The enquiry can’t reach you.\nCheck the contact route first.','Test the journey before buying more traffic.')
video_guides()
print('Rendered launch carousels, static posts and video layout guides in',OUT)
