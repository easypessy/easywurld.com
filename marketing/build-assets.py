#!/usr/bin/env python3
"""Render the full-month asset kit from the canonical plan. Requires Pillow + reportlab.

Outputs (all 30 days, not just week one):
  marketing/assets/carousels/     every carousel as five 1080x1350 JPEGs (+ LinkedIn PDFs on Mondays)
  marketing/assets/stories/       every story as three 1080x1920 JPEG frames
  marketing/assets/memes/         60 scene-led meme JPEGs
  marketing/assets/static/        single-image posts (intro statics)
  marketing/assets/fallbacks/     one poster/fallback card per video slot, so a day can still ship
  marketing/assets/series/        11 series cover cards
  marketing/assets/avatar/        the Operator plates (already hand-produced, never overwritten)
  marketing/assets/video/         disclosure overlay + safe-area guide
  marketing/assets/ASSET_MANIFEST.csv   every post -> expected file(s) and whether it is rendered

These are production graphics, not published posts: every CSV/app placement still starts Draft.
The trend slots keep a HOLD badge until their verification log is complete.
"""
from pathlib import Path
import csv, json, os, re, shutil
from PIL import Image, ImageDraw, ImageFont
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas as pdfcanvas

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'marketing/assets'
PLAN = json.loads((ROOT / 'marketing/content-plan.json').read_text())
POSTS = {p['id']: p for p in PLAN['posts']}
FONT_DIR = Path(os.environ.get('EASYWURLD_FONT_DIR', Path.home() / '.cache/easywurld-fonts'))
CREAM='#FAE7C7'; GREEN='#0A4937'; LEAF='#27473A'; TERRA='#9E4E2C'; INK='#14170F'; PAPER='#FBF9F4'; LINE='#D8D5C5'
SERIF='Fraunces[SOFT,WONK,opsz,wght].ttf'; SANS='Inter[opsz,wght].ttf'; MONO='JetBrainsMono[wght].ttf'
JPEG_Q = 82

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

SENTENCE_SPLIT = re.compile(r'(?<=[.!?])[\'"\u2019\u201d]?\s+')

def text_card(post_id,text,label,page='',hold=False,note='',series=None):
    im=Image.new('RGBA',(1080,1350),CREAM); d=ImageDraw.Draw(im)
    paras=[p for p in str(text).split('\n') if p.strip()]
    head=paras[0] if paras else ''
    rest='\n'.join(paras[1:])
    kicker=''
    m=re.match(r'^([A-Z][^:]{2,44}):\s*(.+)$', head, re.S)
    if m:
        kicker=m.group(1)
        head=m.group(2).strip()
    top=label if (not kicker or kicker.strip().lower()==label.strip().lower()) else kicker+' · '+label
    header(im,d,top[:54],post_id)
    # A slide whose headline runs long reads better as a short headline plus smaller support text.
    if len(head) > 92:
        parts=SENTENCE_SPLIT.split(head)
        kept=''
        while parts and len((kept+' '+parts[0]).strip()) <= 90:
            kept=(kept+' '+parts.pop(0)).strip()
        if kept:
            head=kept
            rest=(' '.join(parts) + ('\n'+rest if rest else '')).strip()
    for hs in range(84,51,-4):
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
        block(d,note,(78,1028),font('sans',19),LEAF,900,1.32)
    footer(d,post_id,series or label,page)
    return im

def save_jpg(im,path,quality=JPEG_Q):
    path.parent.mkdir(parents=True,exist_ok=True)
    im.convert('RGB').save(path,quality=quality,optimize=True,progressive=True)
    return path

# ---------------------------------------------------------------- carousels
CAR = OUT/'carousels'

def carousel(post):
    """Five 1080x1350 slides as JPEGs. Returns the list of files."""
    files=[]
    for i,slide in enumerate(post['slides'],1):
        im=text_card(post['id'],slide,post['series'],f'{i:02d} / 05')
        files.append(save_jpg(im,CAR/f"{post['id']}_slide-{i}.jpg"))
    return files

def carousel_pdf(post):
    """A 1080x1350 PDF of the same slides — uploadable as a LinkedIn document post."""
    pdf=CAR/f"{post['id']}_carousel.pdf"
    c=pdfcanvas.Canvas(str(pdf),pagesize=(1080,1350))
    for i,slide in enumerate(post['slides'],1):
        im=text_card(post['id'],slide,post['series'],f'{i:02d} / 05')
        tmp=CAR/'_tmp.jpg'; im.convert('RGB').save(tmp,quality=88,optimize=True)
        c.drawImage(str(tmp),0,0,1080,1350); c.showPage()
    c.save()
    (CAR/'_tmp.jpg').unlink(missing_ok=True)
    return pdf

# ---------------------------------------------------------------- single statics
STATIC = OUT/'static'

def static_card(post):
    text=post.get('staticCopy') or post['hook']
    im=text_card(post['id'],text,post['series'],'01 / 01',
                 hold=post['seriesKey']=='trend',
                 note='Static post. Confirm copy, price and disclosure before publishing.')
    return save_jpg(im,STATIC/f"{post['id']}.jpg")

# ---------------------------------------------------------------- posters for video slots
FALL = OUT/'fallbacks'

def _norm(s):
    return re.sub(r'[^a-z0-9 ]', '', s.lower()).strip()

def poster_text(post):
    """Headline + up to two supporting sentences that never repeat the headline."""
    hook=post['hook'].strip()
    hook_norm=_norm(hook)
    sentences=[]
    for s in SENTENCE_SPLIT.split(post.get('script','').strip()):
        s=s.strip()
        if not s: continue
        n=_norm(s)
        if not n or n in hook_norm or hook_norm.startswith(n[:32]) or n.startswith(hook_norm[:32]):
            continue
        sentences.append(s)
    if post['seriesKey']=='operator':
        body=' '.join(sentences[:2]).replace(post.get('cta',''),'').strip()
        return hook + ('\n' + body if body else '')
    return hook + ('\n' + ' '.join(sentences[:2]) if sentences else '')

def fallback_card(post):
    """One poster per video slot, so a day can still ship when the video is not ready."""
    text=poster_text(post)
    hold=post['seriesKey']=='trend'
    if hold:
        text += '\nDated teardown. Verify a current example and the audio rights before recording.'
    note='Video slot. Use this poster if the clip is not ready; add the AI label when you post a synthetic voice.'
    im=text_card(post['id'],text,post['series'],'POSTER',hold=hold,note=note)
    return save_jpg(im,FALL/f"{post['id']}.jpg")

# ---------------------------------------------------------------- memes
SCENES = OUT/'meme-scenes'

def scene_file(image):
    p=SCENES/image
    if not p.exists():
        alt=p.with_suffix('.jpg')
        if alt.exists(): return alt
    return p

def scene_base(image, zoom=1.0, bias=0.5):
    im = Image.open(scene_file(image)).convert('RGB')
    w, h = im.size
    scale = max(1080 / w, 1350 / h) * zoom
    im = im.resize((int(w * scale) + 1, int(h * scale) + 1), Image.Resampling.LANCZOS)
    w, h = im.size
    left = max(0, int((w - 1080) * 0.5))
    top = max(0, int((h - 1350) * bias))
    return im.crop((left, top, left + 1080, top + 1350))

def meme(post):
    folder = OUT/'memes'; folder.mkdir(parents=True, exist_ok=True)
    m = post['meme']
    idx = post['day'] + (3 if post['seriesKey'] == 'meme2' else 0)
    zoom = [1.0, 1.06, 1.12, 1.18][idx % 4]
    bias = [0.5, 0.42, 0.58, 0.48][idx % 4]
    im = scene_base(m['image'], zoom, bias).convert('RGBA')
    shade = Image.new('RGBA', (1080, 1350), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shade)
    for y in range(880, 1350):
        sd.line((0, y, 1080, y), fill=(8, 12, 9, int(190 * min(1, (y - 880) / 380))))
    im = Image.alpha_composite(im, shade)
    d = ImageDraw.Draw(im)
    line_f = font('sans', 46, 640); sub_f = font('sans', 31, 460)
    y = 1000
    for line in wrap(d, m['line'], line_f, 930)[:3]:
        d.text((75, y), line, font=line_f, fill=CREAM); y += 58
    y += 10
    for line in wrap(d, m['sub'], sub_f, 930)[:3]:
        d.text((75, y), line, font=sub_f, fill=(250, 231, 199, 214)); y += 42
    d.rectangle((75, 934, 155, 940), fill=TERRA)
    d.text((75, 1264), 'EASYWURLD', font=font('mono', 20, 600), fill=CREAM)
    tag = 'OWNER LIFE' if post['seriesKey'] == 'meme1' else 'MARKETING / AI / CLIENTS'
    d.text((560, 1264), f"{post['id']}  ·  {tag}", font=font('mono', 18, 450), fill=(250, 231, 199, 190))
    return save_jpg(im, folder / f"{post['id']}.jpg", quality=84)

# ---------------------------------------------------------------- stories
STORY = OUT/'stories'

def story_frame(story, frame_index):
    folder = STORY; folder.mkdir(parents=True, exist_ok=True)
    plate = OUT/'avatar/operator-desk.png'
    if not plate.exists(): plate = OUT/'avatar/operator-desk.jpg'
    bg = Image.open(plate).convert('RGB').resize((1080, 1920), Image.Resampling.LANCZOS)
    im = Image.alpha_composite(bg.convert('RGBA'), Image.new('RGBA', (1080, 1920), (8, 14, 11, 150)))
    d = ImageDraw.Draw(im)

    text = story['frames'][frame_index]
    size = 74 if frame_index == 0 else 64
    f = font('serif', size, 620); lines = wrap(d, text, f, 880)
    while len(lines) * int(size * 1.16) > 900 and size > 40:
        size -= 6; f = font('serif', size, 620); lines = wrap(d, text, f, 880)
    y = 960 - (len(lines) * int(size * 1.16)) // 2
    for line in lines:
        d.text((100, y), line, font=f, fill=CREAM); y += int(size * 1.16)

    if frame_index == 2 and story['slot'] == 'A':
        d.rounded_rectangle((100, 1330, 980, 1450), radius=10, outline=(250, 231, 199, 165), width=2)
        d.text((130, 1360), 'Tap the poll above', font=font('sans', 34, 560), fill=(250, 231, 199, 220))
    if frame_index == 2 and story['slot'] == 'B':
        d.rounded_rectangle((100, 1330, 760, 1424), radius=12, fill=CREAM)
        d.text((130, 1356), 'LINK STICKER HERE', font=font('mono', 30, 650), fill=GREEN)

    d.text((100, 170), f"STORY {story['slot']}  ·  {story['time']} WAT", font=font('mono', 26, 500), fill=(250, 231, 199, 190))
    d.text((100, 1740), 'EASYWURLD', font=font('mono', 26, 650), fill=CREAM)
    d.text((100, 1782), 'SIMPLIFY. OPTIMIZE. GROW.', font=font('mono', 20, 450), fill=(250, 231, 199, 165))
    return save_jpg(im, folder / f"{story['id']}_frame-{frame_index + 1}.jpg", quality=80)

# ---------------------------------------------------------------- series covers + guides
def series_cover(s):
    im=Image.new('RGBA',(1080,1350),CREAM); d=ImageDraw.Draw(im)
    d.text((78,62),'EASYWURLD · 11 POSTS + 2 STORIES A DAY',font=font('mono',15),fill=LEAF)
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
    gd.text((225,445),'OPERATOR / DEMO',font=font('mono',35),fill=GREEN)
    gd.text((225,505),'Keep the face hidden, or crop to the plate',font=font('sans',25),fill=INK)
    gd.text((95,130),'CONSERVATIVE HOUSE GUIDE',font=font('mono',28),fill=GREEN)
    gd.text((95,180),'Not an official platform safe zone',font=font('sans',27),fill=INK)
    gd.text((95,1510),'Essential text: x 80–850, y 260–1450',font=font('mono',25),fill=GREEN)
    gd.text((95,1570),'Always check the actual upload preview.',font=font('sans',28),fill=INK)
    gd.text((95,1640),'Do not export this guide into the final video.',font=font('sans',26),fill=TERRA)
    g.save(folder/'video-safe-area-guide.png',optimize=True)
    (folder/'VIDEO_TEMPLATE_README.txt').write_text(
      'video-overlay-template.png is a transparent 1080x1920 layout guide. Replace the bracketed caption placeholders with corrected words before export. '
      'Use the AI presenter label only for a synthetic presenter; use AI voice · Easywurld for synthetic narration over a demo. Remove the label if the final asset contains no no realistic AI person or voice. '
      'video-safe-area-guide.png is instructions only; never publish it. No owner likeness or finished video is included.\n')

# ---------------------------------------------------------------- manifest
def manifest(carousel_files, story_files, extra_pdfs):
    rows=[['Type','Date','Time (WAT)','Post ID','Format','Expected asset(s)','Rendered','Produce','Note']]
    for p in PLAN['posts']:
        plats=' + '.join(sorted({x['platform'] for x in PLAN['placements'] if x['postId']==p['id']}))
        if p.get('slides'):
            files=[f'assets/carousels/{p["id"]}_slide-{i}.jpg' for i in range(1,6)]
            rendered=all((OUT/'carousels'/f'{p["id"]}_slide-{i}.jpg').exists() for i in range(1,6))
            rows.append(['Content',p['date'],p['time'],p['id'],p['format'],' '.join(files),'yes' if rendered else 'no','Nothing — upload the five JPEGs in order',plats])
        elif p['seriesKey'] in ('meme1','meme2'):
            f=f'assets/memes/{p["id"]}.jpg'
            rows.append(['Content',p['date'],p['time'],p['id'],p['format'],f,'yes' if (OUT/'memes'/f'{p["id"]}.jpg').exists() else 'no','Nothing — ready to post',plats])
        elif p['format']=='Relatable static':
            f=f'assets/static/{p["id"]}.jpg'
            rows.append(['Content',p['date'],p['time'],p['id'],p['format'],f,'yes' if (OUT/'static'/f'{p["id"]}.jpg').exists() else 'no','Nothing — ready to post',plats])
        else:
            poster=f'assets/fallbacks/{p["id"]}.jpg'
            held=' — TREND HOLD: verify before use' if p['seriesKey']=='trend' else ''
            rows.append(['Content',p['date'],p['time'],p['id'],p['format'],
                         f'assets/video-ready/{p["id"]}.mp4 (record) | {poster} (poster, ready)',
                         'poster' if (OUT/'fallbacks'/f'{p["id"]}.jpg').exists() else 'no',
                         'Record/edit the clip, or post the poster as a static fallback'+held,plats])
    for s in PLAN['stories']:
        files=[f'assets/stories/{s["id"]}_frame-{i}.jpg' for i in (1,2,3)]
        rendered=all((OUT/'stories'/f'{s["id"]}_frame-{i}.jpg').exists() for i in (1,2,3))
        rows.append(['Story',s['date'],s['time'],s['id'],s['series'],' '.join(files),'yes' if rendered else 'no','Nothing — upload three frames, add the sticker','Instagram + Facebook + TikTok'])
    for l in PLAN['linkedin']:
        if l['format'].startswith('Document'):
            pdf=f'assets/carousels/{l["sourcePostId"]}_carousel.pdf'
            rows.append(['LinkedIn',l['date'],l['time'],l['id'],l['format'],pdf,'yes' if (OUT/'carousels'/f'{l["sourcePostId"]}_carousel.pdf').exists() else 'no','Upload the PDF as a document post',l['label']])
        elif l['format']=='Vertical video':
            rows.append(['LinkedIn',l['date'],l['time'],l['id'],l['format'],f'assets/video-ready/{l["sourcePostId"]}.mp4 (record)','no','Re-frame the same clip to 4:5',l['label']])
        else:
            rows.append(['LinkedIn',l['date'],l['time'],l['id'],l['format'],'— text only —','n/a','Paste the copy from the brief',l['label']])
    with open(OUT/'ASSET_MANIFEST.csv','w',newline='',encoding='utf-8') as fh:
        csv.writer(fh,lineterminator='\n').writerows(rows)
    return len(rows)-1

def readme(carousel_count, story_count, fallback_count, static_count, pdf_count):
    lines=['# Full-month asset kit','',
      'Rendered from `marketing/series-plan.json` → `content-plan.json`. Every image is a production graphic, not a published post: every CSV/app placement still starts Draft.','',
      '## What is rendered','',
      f'- `carousels/`: {carousel_count} carousels as five 1080×1350 JPEGs each, uploaded in slide order. `{pdf_count}` Monday carousels also have a PDF for the LinkedIn document post.',
      f'- `stories/`: {story_count} stories × 3 frames at 1080×1920 (Instagram, then Facebook +5 min, TikTok +10 min).',
      '- `memes/`: 60 scene-led meme JPEGs — photograph first, small two-line caption in the lower third.',
      '- `meme-scenes/`: the eight 4:5 photograph plates the memes and desk scenes are built from.',
      f'- `static/`: {static_count} single-image posts (the intro statics).',
      f'- `fallbacks/`: {fallback_count} posters for the video slots. Use one if a clip is not ready, and keep the AI label honest.',
      '- `series/`: 11 series cover cards.',
      '- `avatar/`: the Operator plates and voice samples (hand-produced, not overwritten by this script).',
      '- `video/`: disclosure overlay and safe-area guide.',
      '- `ASSET_MANIFEST.csv`: every post and story → expected file(s), whether it is rendered, and what is left to produce.','',
      '## Rules','',
      '- Upload carousel slides in numeric order; slide 1 is the cover.',
      '- Every clip with a synthetic presenter or voice carries `AI presenter · Easywurld` and the platform AI setting.',
      '- Trend Desk posters say **HOLD**: complete `marketing/TREND_VERIFICATION.csv` or publish only as a dated teardown with live-trend wording removed.',
      '- Confirm the ₦5,000 price, pack contents and fulfilment before publishing any offer post.',
      '- Regenerate with `/home/user/.venv/bin/python marketing/build-assets.py` after `npm run content:build`. Fonts live in `~/.cache/easywurld-fonts`.','']
    (OUT/'README.md').write_text('\n'.join(lines))

# ---------------------------------------------------------------- run
series_dir=OUT/'series'; meme_dir=OUT/'memes'; story_dir=OUT/'stories'
car_dir=CAR; static_dir=STATIC; fall_dir=FALL
for folder in [series_dir,meme_dir,story_dir,car_dir,static_dir,fall_dir,OUT/'video']:
    if folder.exists(): shutil.rmtree(folder)
    folder.mkdir(parents=True,exist_ok=True)

for s in PLAN['series']: series_cover(s)

carousel_posts=[p for p in PLAN['posts'] if p.get('slides')]
for p in carousel_posts: carousel(p)
pdf_posts=[l['sourcePostId'] for l in PLAN['linkedin'] if l['format'].startswith('Document')]
for pid in pdf_posts:
    if pid in POSTS: carousel_pdf(POSTS[pid])

meme_count=static_count=fallback_count=0
for p in PLAN['posts']:
    if p.get('slides'): continue
    if p['seriesKey'] in ('meme1','meme2'):
        meme(p); meme_count+=1
    elif p['format']=='Relatable static':
        static_card(p); static_count+=1
    else:
        fallback_card(p); fallback_count+=1

story_count=0
for s in PLAN['stories']:
    for i in range(3): story_frame(s,i)
    story_count+=1

video_guides()
rows=manifest(carousel_posts,story_count,pdf_posts)
readme(len(carousel_posts),story_count,fallback_count,static_count,len(pdf_posts))
print(f'Rendered {len(carousel_posts)} carousels ({len(carousel_posts)*5} slides, {len(pdf_posts)} PDFs), {meme_count} memes, {static_count} statics, {fallback_count} video posters, {story_count} stories ({story_count*3} frames), 11 series covers.')
print(f'Manifest: {rows} rows -> marketing/assets/ASSET_MANIFEST.csv')
