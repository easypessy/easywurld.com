#!/usr/bin/env python3
"""Render the series starter kit from the canonical plan. Requires Pillow.

Outputs:
  marketing/assets/series/                 10 series cover cards
  marketing/assets/memes/                 60 original meme PNGs
  marketing/assets/launch-day/            Day 1 non-video fallback/carousel PNGs + ZIPs
  marketing/assets/video/                 overlay + safe-area guide

These are starter/production graphics, not finished videos. The trend card is a
HOLD placeholder until its verification log is complete.
"""
from pathlib import Path
import json, os, zipfile, shutil
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'marketing/assets'
PLAN = json.loads((ROOT / 'marketing/content-plan.json').read_text())
POSTS = {p['id']: p for p in PLAN['posts']}
FONT_DIR = Path(os.environ.get('EASYWURLD_FONT_DIR', Path.home() / '.cache/easywurld-fonts'))
CREAM='#FAE7C7'; GREEN='#0A4937'; LEAF='#27473A'; TERRA='#9E4E2C'; INK='#14170F'; PAPER='#FBF9F4'; LINE='#D8D5C5'
SERIF='Fraunces[SOFT,WONK,opsz,wght].ttf'; SANS='Inter[opsz,wght].ttf'; MONO='JetBrainsMono[wght].ttf'

def font(kind, size, weight=500):
    names={'serif':SERIF,'sans':SANS,'mono':MONO}
    f=ImageFont.truetype(str(FONT_DIR/names[kind]), int(size))
    axes=f.get_variation_axes(); values=[a['default'] for a in axes]
    for i,a in enumerate(axes):
        if a['name']==b'Weight': values[i]=weight
        if a['name'] in (b'Optical Size',b'Optical size'): values[i]=min(72 if kind=='serif' else 24,a['maximum'])
        if a['name']==b'Wonky': values[i]=0
    f.set_variation_by_axes(values)
    return f

def wrap(draw,text,f,width):
    lines=[]
    for paragraph in str(text).split('\n'):
        if not paragraph.strip(): lines.append(''); continue
        line=''
        for word in paragraph.split():
            trial=(line+' '+word).strip()
            if draw.textlength(trial,font=f)<=width: line=trial
            else:
                if line: lines.append(line)
                line=word
        if line: lines.append(line)
    return lines

def block(draw,text,xy,f,fill,width,gap=1.16):
    x,y=xy
    for line in wrap(draw,text,f,width):
        draw.text((x,y),line,font=f,fill=fill)
        y+=int(f.size*gap)
    return y

def logo(im,xy,size,light=False):
    path=ROOT/('client/public/brand/mark-light.png' if light else 'client/public/brand/mark.png')
    mark=Image.open(path).convert('RGBA').crop(Image.open(path).convert('RGBA').getbbox())
    mark.thumbnail((size,size),Image.Resampling.LANCZOS)
    im.alpha_composite(mark,(int(xy[0]),int(xy[1])))

def footer(draw,post_id,series,page=''):
    draw.line((78,1218,1002,1218),fill=LINE,width=2)
    draw.text((78,1243),'EASYWURLD',font=font('serif',23,650),fill=GREEN)
    draw.text((78,1278),'SIMPLIFY. OPTIMIZE. GROW.',font=font('mono',14,450),fill=LEAF)
    draw.text((640,1270),f'{post_id}  ·  {page}',font=font('mono',15),fill=LEAF)
    draw.text((78,1155),series.upper(),font=font('mono',14),fill=TERRA)

def header(im,draw,label,post_id):
    draw.text((78,62),label.upper(),font=font('mono',17),fill=LEAF)
    draw.text((78,92),post_id,font=font('mono',14),fill=TERRA)
    logo(im,(930,48),68)

def text_card(post_id,text,label,page='',hold=False,note=''):
    im=Image.new('RGBA',(1080,1350),CREAM); d=ImageDraw.Draw(im); header(im,d,label,post_id)
    paras=[p for p in str(text).split('\n') if p.strip()]
    head=paras[0] if paras else ''
    rest='\n'.join(paras[1:])
    # Fit the headline and support text without shrinking to unreadable sizes.
    for hs in range(96,51,-4):
        hf=font('serif',hs,620); hlines=wrap(d,head,hf,880)
        hh=len(hlines)*int(hs*1.10)
        room=880-hh
        body_size=38
        while body_size>=23:
            bf=font('sans',body_size,480); blines=wrap(d,rest,bf,860) if rest else []
            bh=len(blines)*int(body_size*1.38)
            if bh<=room: break
            body_size-=2
        total=hh+bh+70
        if total<=900 and body_size>=23: break
    y=230
    for line in hlines:
        d.text((78,y),line,font=hf,fill=GREEN); y+=int(hs*1.10)
    d.line((78,y+24,220,y+24),fill=TERRA,width=7); y+=65
    if rest:
        for line in blines:
            d.text((78,y),line,font=bf,fill=INK); y+=int(body_size*1.38)
    if hold:
        d.rounded_rectangle((78,1090,430,1140),radius=5,fill=TERRA)
        d.text((98,1102),'HOLD · VERIFY BEFORE USE',font=font('mono',19,650),fill=CREAM)
    if note:
        block(d,note,(460,1100),font('sans',18),LEAF,520)
    footer(d,post_id,PLAN['series'][int(post_id[-2:])-1]['name'],page)
    return im

def carousel(post):
    label=post['series']; files=[]; folder=OUT/'launch-day'; folder.mkdir(parents=True,exist_ok=True)
    for i,slide in enumerate(post['slides'],1):
        im=text_card(post['id'],slide,label,f'{i:02d} / 05')
        p=folder/f"{post['id']}_slide-{i}.png"; im.convert('RGB').save(p,optimize=True); files.append(p)
    with zipfile.ZipFile(folder/f"{post['id']}_carousel.zip",'w',zipfile.ZIP_DEFLATED) as z:
        for f in files: z.write(f,f.name)
        z.writestr('CAPTION.txt',post['platforms']['Instagram']['caption']+'\n\nCTA: '+post['cta']+'\n')
        z.writestr('READ_ME.txt','Draft starter slides for human review. Upload the five PNGs in order. Confirm price, offer fulfilment and platform crop before publishing. No synthetic presenter is used in these graphics.\n')
    return files

def fallback_card(post):
    folder=OUT/'launch-day'; folder.mkdir(parents=True,exist_ok=True)
    texts={
      'myth':post['hook']+'\n'+(post.get('script','').split('. ',1)[1] if '. ' in post.get('script','') else ''),
      'trend':post['hook']+'\nDated teardown. Recheck a current example, relevance and audio rights before recording or replacing this card.',
      'ai':post['hook']+'\nInput → AI draft → human check → output. Nothing is sent automatically.',
      'offerB':post['hook']+'\n'+(post.get('script','').split('. ',1)[1] if '. ' in post.get('script','') else post.get('script','')),
      'meme1':post.get('staticCopy',post['hook']),
      'meme2':post.get('staticCopy',post['hook']),
    }
    text=texts.get(post['seriesKey'],post['hook']+'\n'+post['cta'])
    hold=post['seriesKey']=='trend'
    im=text_card(post['id'],text,post['series'],'STARTER',hold=hold,note='Non-video fallback. Confirm copy and disclosure before publishing.')
    p=folder/f"{post['id']}_fallback.png"; im.convert('RGB').save(p,optimize=True); return p

def meme(post):
    folder=OUT/'memes'; folder.mkdir(parents=True,exist_ok=True)
    im=text_card(post['id'],post['staticCopy'],'MEME · '+('OWNER LIFE' if post['seriesKey']=='meme1' else 'MARKETING / AI / CLIENTS'),'01 / 01')
    p=folder/f"{post['id']}.png"; im.convert('RGB').save(p,optimize=True); return p

def series_cover(s):
    im=Image.new('RGBA',(1080,1350),CREAM); d=ImageDraw.Draw(im)
    d.text((78,62),'EASYWURLD · 10 POSTS A DAY',font=font('mono',17),fill=LEAF)
    logo(im,(890,45),110)
    d.text((78,215),f'SERIES {s["slot"]:02d}',font=font('mono',22),fill=TERRA)
    hs=110
    hf=font('serif',hs,620); lines=wrap(d,s['name'],hf,900)
    while len(lines)*int(hs*1.08)>390 and hs>56:
        hs-=6; hf=font('serif',hs,620); lines=wrap(d,s['name'],hf,900)
    y=285
    for line in lines: d.text((78,y),line,font=hf,fill=GREEN); y+=int(hs*1.08)
    d.line((78,y+25,235,y+25),fill=TERRA,width=7)
    d.text((78,y+75),f'{s["time"]} WAT · {s["defaultFormat"]}',font=font('sans',30,560),fill=LEAF)
    block(d,s['objective'],(78,y+155),font('sans',29),INK,880,1.38)
    footer(d,f'S{s["slot"]:02d}',s['name'],'SERIES COVER')
    folder=OUT/'series'; folder.mkdir(parents=True,exist_ok=True)
    slug=s['name'].lower().replace(' ','-').replace('/','-').replace(':','').replace('--','-')
    p=folder/f'{s["slot"]:02d}-{slug}.png'; im.convert('RGB').save(p,optimize=True); return p

def video_guides():
    folder=OUT/'video'; folder.mkdir(parents=True,exist_ok=True)
    im=Image.new('RGBA',(1080,1920),(0,0,0,0)); d=ImageDraw.Draw(im)
    d.rounded_rectangle((75,205,605,263),radius=7,fill=CREAM)
    d.text((94,220),'AI presenter · Easywurld',font=font('sans',27,600),fill=GREEN)
    d.rounded_rectangle((75,1320,855,1460),radius=8,fill=CREAM)
    d.text((98,1345),'[Corrected caption line one]',font=font('sans',32,650),fill=GREEN)
    d.text((98,1395),'[Corrected caption line two]',font=font('sans',32,650),fill=GREEN)
    im.save(folder/'video-overlay-template.png')
    g=Image.new('RGB',(1080,1920),PAPER); gd=ImageDraw.Draw(g)
    gd.rectangle((80,260,850,1450),outline=TERRA,width=5)
    gd.rectangle((200,410,760,1110),outline=LEAF,width=3)
    gd.text((225,445),'FACE / DEMO',font=font('mono',35),fill=GREEN)
    gd.text((225,505),'Keep eyes and mouth clear',font=font('sans',25),fill=INK)
    gd.text((95,130),'CONSERVATIVE HOUSE GUIDE',font=font('mono',28),fill=GREEN)
    gd.text((95,180),'Not an official platform safe zone',font=font('sans',27),fill=INK)
    gd.text((95,1510),'Essential text: x 80–850, y 260–1450',font=font('mono',25),fill=GREEN)
    gd.text((95,1570),'Always check the actual upload preview.',font=font('sans',28),fill=INK)
    gd.text((95,1640),'Do not export this guide into the final video.',font=font('sans',26),fill=TERRA)
    g.save(folder/'video-safe-area-guide.png',optimize=True)
    (folder/'VIDEO_TEMPLATE_README.txt').write_text('video-overlay-template.png is a transparent 1080x1920 layout guide. Replace bracketed caption placeholders with corrected words before export. Use the AI-presenter label only for a synthetic presenter; use AI voice · Easywurld for synthetic narration over a demo. Remove the label if the final asset contains no realistic AI person/voice. video-safe-area-guide.png is instructions only; never publish it. No owner likeness or finished video is included.\n')

def manifest():
    lines=['# Starter asset kit','','These are draft starter graphics, not finished videos and not published posts. Every CSV/app placement still starts Draft.','','## Folders','','- `series/`: 10 series cover cards. Use as series branding, not as a claim that every post is complete.','- `memes/`: 60 original meme PNGs, one for each daily meme slot.','- `launch-day/`: Monday 2 November fallback/carousel PNGs for all 10 core posts, plus four carousel ZIPs (S01, S06, S07, S10).','- `video/`: transparent AI-disclosure overlay and safe-area guide. No owner likeness or finished video.','','## Important','','- The Day 1 Trend Desk card says **HOLD**. Verify a current example and audio rights before publishing or recording.','- The AI and screen-demo slots are represented by fallback cards/real repo links; they are not finished videos.','- Confirm the offer price, payment and fulfilment before publishing any offer post.','- Confirm the owner likeness/voice permission before generating a personal AI presenter. Do not use the fictional demo founder.','- Regenerate with `/home/user/.venv/bin/python marketing/build-assets.py` after `npm run content:build`.','']
    (OUT/'README.md').write_text('\n'.join(lines))

series_dir=OUT/'series'; meme_dir=OUT/'memes'; day_dir=OUT/'launch-day'
for folder in [series_dir,meme_dir,day_dir,OUT/'video']:
    if folder.exists(): shutil.rmtree(folder)
    folder.mkdir(parents=True,exist_ok=True)

for s in PLAN['series']: series_cover(s)
for p in PLAN['posts']:
    if p['seriesKey'] in ('meme1','meme2'): meme(p)
for p in PLAN['posts']:
    if p['day']!=1: continue
    if p.get('slides'): carousel(p)
    else: fallback_card(p)
video_guides(); manifest()
count=lambda folder:len(list(folder.glob('*.png')))
print(f'Rendered {count(series_dir)} series covers, {count(meme_dir)} memes, {count(day_dir)} launch-day PNGs and video guides.')
