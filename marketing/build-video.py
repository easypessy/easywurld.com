#!/usr/bin/env python3
"""Render finished, ready-to-post vertical videos from the canonical plan.

No editor touches these. One command produces an MP4 that already contains:

  * the voiceover            narration written in plain Nigerian English
                             (marketing/voice.mjs -> post.voScript) spoken by the
                             owner-selected voice;
  * a background soundtrack  a warm instrumental bed synthesised here (no licensed
                             track, no rights to clear), sidechain-ducked under the voice;
  * the video effects        Ken Burns moves, cross-dissolves, film grain, a warm
                             grade, vignette, fade in/out, burned-in captions,
                             the brand header and the AI disclosure chip;
  * an end card              the single CTA, the WhatsApp keyword and the site.

Input
  marketing/content-plan.json        the plan (voScript / voLines / beats)
  marketing/render/vo/<ID>.mp3       the narration for that slot
  marketing/assets/avatar/*.jpg      the Operator plates (1080x1920)
  marketing/assets/fallbacks/<ID>.jpg  the on-brand poster for the slot
  marketing/assets/series/*.png      series cover cards
  marketing/assets/meme-scenes/*.jpg photograph plates

Output
  marketing/assets/video-ready/<ID>.mp4      1080x1920, H.264 + AAC, faststart
  (LinkedIn uses the same vertical MP4 — no separate cut to make)

Usage
  python marketing/build-video.py --day 1            # every slot on day 1 with narration
  python marketing/build-video.py --only EW-D01-S02  # one slot
  python marketing/build-video.py --all --limit 20   # a batch
  python marketing/build-video.py --missing          # list what still needs a voice

Slots without a narration file are skipped, not guessed: the poster in
assets/fallbacks/ is the honest fallback until the voice exists.
"""
from __future__ import annotations
import argparse, json, math, os, re, subprocess, sys, wave
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / 'marketing/assets'
RENDER = ROOT / 'marketing/render'
VO_DIR = RENDER / 'vo'
WORK = RENDER / 'work'
OUT = ASSETS / 'video-ready'
PLAN = json.loads((ROOT / 'marketing/content-plan.json').read_text())

FFMPEG = os.environ.get('EASYWURLD_FFMPEG')
if not FFMPEG:
    try:
        import imageio_ffmpeg
        FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
    except Exception:
        sys.exit('ffmpeg not found. Run: bash marketing/setup-env.sh')
FONT_DIR = Path(os.environ.get('EASYWURLD_FONT_DIR', Path('/tmp/easywurld-env/fonts')))

W, H, FPS = 1080, 1920, 30
CREAM = (250, 231, 199); GREEN = (10, 73, 55); LEAF = (39, 71, 58)
TERRA = (158, 78, 44); INK = (20, 23, 15); PAPER = (251, 249, 244)
SERIF = 'Fraunces[SOFT,WONK,opsz,wght].ttf'; SANS = 'Inter[opsz,wght].ttf'; MONO = 'JetBrainsMono[wght].ttf'
LEAD_IN, TAIL_OUT, END_CARD = 0.85, 1.35, 2.1
XFADE = 0.40

SERIES_COVER = {
    'myth': '02-marketing-myth-court.png', 'trend': '03-trend-desk.png', 'ai': '04-ai-automation-build.png',
    'offerA': '06-offer-spotlight-a.png', 'offerB': '09-offer-spotlight-b.png',
    'intro': '10-meet-easywurld.png', 'operator': '11-one-last-thought.png', 'niche': '01-if-i-ran-this-account.png',
}


# --------------------------------------------------------------------- fonts
def font(kind, size, weight=500):
    names = {'serif': SERIF, 'sans': SANS, 'mono': MONO}
    f = ImageFont.truetype(str(FONT_DIR / names[kind]), int(size))
    axes = f.get_variation_axes(); values = [a['default'] for a in axes]
    for i, a in enumerate(axes):
        if a['name'] == b'Weight': values[i] = weight
        if a['name'] in (b'Optical Size', b'Opticalsize', b'Optical size'):
            values[i] = min(72 if kind == 'serif' else 24, a['maximum'])
        if a['name'] == b'Wonky': values[i] = 0
        if a['name'] == b'Soft': values[i] = 30
    f.set_variation_by_axes(values)
    return f


def wrap(draw, text, f, width):
    lines = []
    for line in str(text).split('\n'):
        cur = ''
        for word in line.split():
            trial = (cur + ' ' + word).strip()
            if draw.textlength(trial, font=f) <= width: cur = trial
            else:
                if cur: lines.append(cur)
                cur = word
        lines.append(cur)
    return [l for l in lines if l != '' ] or ['']


# --------------------------------------------------------------------- ffmpeg
def run(cmd, quiet=True):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0 and not quiet:
        print(r.stderr[-3000:])
    if r.returncode != 0:
        raise RuntimeError('ffmpeg failed: ' + ' '.join(str(c) for c in cmd[:6]) + '\n' + r.stderr[-2000:])
    return r


def duration(path):
    r = subprocess.run([FFMPEG, '-hide_banner', '-i', str(path)], capture_output=True, text=True)
    m = re.search(r'Duration:\s*(\d+):(\d+):(\d+\.\d+)', r.stderr)
    if not m: raise RuntimeError(f'cannot read duration of {path}')
    h, mi, s = m.groups()
    return int(h) * 3600 + int(mi) * 60 + float(s)


# --------------------------------------------------------------------- plates
def plate_for(post, index):
    """Scene plates, in the order they should appear. Always brand-owned files."""
    sk = post['seriesKey']
    poster = ASSETS / 'fallbacks' / f"{post['id']}.jpg"
    avatar = [ASSETS / 'avatar' / n for n in ('operator-hero.jpg', 'operator-presence.jpg', 'operator-desk.jpg')]
    cover = ASSETS / 'series' / SERIES_COVER.get(sk, '11-one-last-thought.png')
    scenes = sorted((ASSETS / 'meme-scenes').glob('scene-*.jpg'))
    scene = scenes[(post['day'] + index) % len(scenes)] if scenes else poster
    order = {
        'myth':     [poster, avatar[0], avatar[1]],
        'trend':    [poster, scene, avatar[2]],
        'ai':       [poster, avatar[2], cover],
        'offerB':   [poster, cover, avatar[0]],
        'operator': [avatar[1], avatar[2], avatar[0]],
    }.get(sk, [poster, avatar[2], cover])
    return [p for p in order if p.exists()] or [poster]


def compose_scene(post, plate_path, disclosure, section_label=''):
    """One still frame, 1080x1920, brand-composited. ffmpeg only animates it."""
    plate = Image.open(plate_path).convert('RGB')
    pw, ph = plate.size
    canvas = Image.new('RGB', (W, H), INK)

    if abs(pw / ph - W / H) < 0.06:                     # already vertical: full bleed
        canvas.paste(plate.resize((W, H), Image.Resampling.LANCZOS), (0, 0))
        card_bottom = H
    else:                                                # 4:5 plate on a blurred bed
        bg = plate.copy()
        scale = max(W / pw, H / ph) * 1.06
        bg = bg.resize((int(pw * scale), int(ph * scale)), Image.Resampling.LANCZOS)
        bg = bg.crop(((bg.width - W) // 2, (bg.height - H) // 2, (bg.width - W) // 2 + W, (bg.height - H) // 2 + H))
        bg = bg.filter(ImageFilter.GaussianBlur(46)).point(lambda v: int(v * 0.42))
        canvas.paste(bg, (0, 0))
        cw = 900; ch = int(ph * cw / pw)
        card = plate.resize((cw, ch), Image.Resampling.LANCZOS)
        canvas.paste(card, ((W - cw) // 2, 340))
        card_bottom = 340 + ch

    d = ImageDraw.Draw(canvas, 'RGBA')
    # scrims so the header and the captions stay legible on any plate
    for y0, y1, rev in ((0, 400, False), (H - 560, H, True)):
        for y in range(y0, y1):
            t = (y - y0) / (y1 - y0)
            a = int(165 * (1 - t if not rev else t) ** 1.35)
            d.line([(0, y), (W, y)], fill=(8, 12, 10, a))

    d.text((75, 108), 'EASYWURLD', font=font('serif', 46, 640), fill=CREAM)
    label = post['series'].upper()
    lw = d.textlength(label, font=font('mono', 24, 500))
    d.text((W - 75 - lw, 128), label, font=font('mono', 24, 500), fill=(250, 231, 199, 210))

    chip = disclosure.upper()
    cf = font('mono', 28, 650)
    cw2 = int(d.textlength(chip, font=cf)) + 56
    d.rounded_rectangle((75, 205, 75 + cw2, 265), radius=8, fill=CREAM)
    d.text((103, 219), chip, font=cf, fill=GREEN)

    if section_label:
        d.text((75, 1748), section_label.upper(), font=font('mono', 24, 500), fill=(250, 231, 199, 175))
    d.text((75, 1792), 'SIMPLIFY. OPTIMIZE. GROW.', font=font('mono', 22, 450), fill=(250, 231, 199, 150))
    return canvas


def compose_end_card(post):
    im = Image.new('RGB', (W, H), CREAM); d = ImageDraw.Draw(im, 'RGBA')
    d.rectangle((0, 0, W, 14), fill=GREEN)
    d.text((75, 108), 'EASYWURLD', font=font('serif', 46, 640), fill=GREEN)
    d.text((75, 176), post['series'].upper(), font=font('mono', 24, 500), fill=TERRA)

    cta = post.get('cta') or 'Save this and use it this week.'
    f = font('serif', 84, 620); lines = wrap(d, cta, f, 900)
    while len(lines) * 96 > 620 and f.size > 52:
        f = font('serif', f.size - 6, 620); lines = wrap(d, cta, f, 900)
    y = 520
    for line in lines:
        d.text((75, y), line, font=f, fill=GREEN); y += int(f.size * 1.14)
    d.line((75, y + 26, 235, y + 26), fill=TERRA, width=8)

    y += 110
    if post.get('offerKeyword'):
        kw = f"Message {post['offerKeyword']} on WhatsApp"
        kf = font('sans', 40, 600)
        bw = int(d.textlength(kw, font=kf)) + 76
        d.rounded_rectangle((75, y, 75 + bw, y + 96), radius=12, fill=GREEN)
        d.text((113, y + 26), kw, font=kf, fill=CREAM)
        y += 140
    d.text((75, y), PLAN['site'].replace('https://', ''), font=font('sans', 34, 500), fill=LEAF)
    d.text((75, y + 56), PLAN['whatsapp'], font=font('mono', 28, 450), fill=LEAF)

    chip = ('AI PRESENTER · EASYWURLD' if post['format'] == 'AI talking head' else 'AI VOICE · EASYWURLD')
    cf = font('mono', 26, 600); cw2 = int(d.textlength(chip, font=cf)) + 52
    d.rounded_rectangle((75, H - 250, 75 + cw2, H - 194), radius=8, outline=GREEN, width=3)
    d.text((101, H - 240), chip, font=cf, fill=GREEN)
    d.text((75, H - 130), 'SIMPLIFY. OPTIMIZE. GROW.', font=font('mono', 24, 500), fill=LEAF)
    return im


# --------------------------------------------------------------------- music
def music_bed(seconds, bpm=84, seed=7):
    """A warm instrumental bed synthesised from scratch — nothing to license.

    Am - F - C - G, soft pad, muted kick on 1 and 3, brushed hat on the off-beats,
    a low bass root and a very quiet tape-ish noise floor. It sits under the voice,
    never over it.
    """
    rng = np.random.default_rng(seed)
    sr = 44100
    n = int(seconds * sr)
    out = np.zeros((n, 2), dtype=np.float64)
    beat = 60.0 / bpm
    bar = beat * 4
    chords = [[220.00, 261.63, 329.63], [174.61, 220.00, 261.63], [130.81 * 2, 196.00, 261.63], [196.00, 246.94, 293.66]]
    t = np.arange(n) / sr

    # pad
    pad = np.zeros(n)
    for i in range(int(seconds / bar) + 1):
        start = int(i * bar * sr); end = min(n, int((i + 1) * bar * sr))
        if start >= n: break
        seg = np.arange(end - start) / sr
        env = np.minimum(1, seg / 0.5) * np.minimum(1, (end - start) / sr - seg) / 0.9
        env = np.clip(env, 0, 1) ** 0.7
        for f0 in chords[i % len(chords)]:
            for mult, amp in ((1, 0.30), (2, 0.16), (3, 0.06)):
                vib = 1 + 0.0016 * np.sin(2 * np.pi * 4.3 * seg + rng.random() * 6)
                pad[start:end] += amp * env * np.sin(2 * np.pi * f0 * mult * seg * vib)
        pad[start:end] *= 0.5
    out[:, 0] += pad
    delayed = np.roll(pad, int(0.011 * sr)) * 0.92
    out[:, 1] += delayed

    # bass root
    for i in range(int(seconds / bar) + 1):
        for b in range(4):
            start = int((i * bar + b * beat) * sr)
            if start >= n: continue
            ln = min(n - start, int(beat * 0.92 * sr))
            seg = np.arange(ln) / sr
            env = np.exp(-seg * 2.1) * np.minimum(1, seg / 0.012)
            f0 = chords[i % len(chords)][0] / 2
            note = env * np.sin(2 * np.pi * f0 * seg) * 0.42
            out[start:start + ln, 0] += note
            out[start:start + ln, 1] += note * 0.96

    # muted kick on 1 and 3
    for i in range(int(seconds / bar) + 1):
        for b in (0, 2):
            start = int((i * bar + b * beat) * sr)
            if start >= n: continue
            ln = min(n - start, int(0.24 * sr))
            seg = np.arange(ln) / sr
            f = 112 * np.exp(-seg * 13) + 46
            phase = 2 * np.pi * np.cumsum(f) / sr
            kick = np.sin(phase) * np.exp(-seg * 15) * 0.55
            out[start:start + ln, 0] += kick
            out[start:start + ln, 1] += kick * 0.9

    # brushed hat on the off-beats
    for i in range(int(seconds / bar * 2) + 1):
        start = int((i * beat + beat / 2) * sr)
        if start >= n: continue
        ln = min(n - start, int(0.055 * sr))
        seg = np.arange(ln) / sr
        noise = rng.standard_normal(ln) * np.exp(-seg * 78) * 0.085
        noise = np.diff(noise, prepend=0) * 3.2          # crude high-pass
        out[start:start + ln, 0] += noise
        out[start:start + ln, 1] += np.roll(noise, 3)

    # tape floor + fades
    out += rng.standard_normal((n, 2)) * 0.0035
    fade = int(min(1.2, seconds / 4) * sr)
    out[:fade] *= np.linspace(0, 1, fade)[:, None]
    out[-fade:] *= np.linspace(1, 0, fade)[:, None]
    peak = np.max(np.abs(out)) or 1.0
    out = out / peak * 0.30
    return (out * 32767).astype(np.int16), sr


def write_wav(path, data, sr):
    path.parent.mkdir(parents=True, exist_ok=True)
    with wave.open(str(path), 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(sr)
        w.writeframes(data.tobytes())
    return path


# --------------------------------------------------------------------- captions
def build_ass(lines, timings, out_path, hook_pop=True):
    def stamp(t):
        h = int(t // 3600); m = int((t % 3600) // 60); s = t % 60
        return f'{h}:{m:02d}:{s:05.2f}'
    head = ['[Script Info]', 'ScriptType: v4.00+', f'PlayResX: {W}', f'PlayResY: {H}',
            'WrapStyle: 0', 'ScaledBorderAndShadow: yes', '', '[V4+ Styles]',
            'Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, '
            'Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, '
            'Alignment, MarginL, MarginR, MarginV, Encoding',
            'Style: Cap,Inter,62,&H00FFFFFF,&H00FFFFFF,&H000E1210,&HA0000000,-1,0,0,0,100,100,0.4,0,1,3.6,1.7,2,70,70,430,1',
            'Style: Kicker,JetBrains Mono,30,&H00C7E3FA,&H00C7E3FA,&H000E1210,&H80000000,0,0,0,0,100,100,2.2,0,1,2.4,1.2,2,70,70,250,1',
            '', '[Events]',
            'Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text']
    ev = []
    for i, ((a, b), text) in enumerate(zip(timings, lines)):
        if b - a < 0.42: b = a + 0.42
        tag = r'{\fad(130,130)}'
        if i == 0 and hook_pop:
            tag = r'{\fad(90,130)\t(0,170,\fscx107\fscy107)\t(170,340,\fscx100\fscy100)}'
        safe = text.replace('\n', ' ').replace('{', '(').replace('}', ')')
        safe = safe[:1].upper() + safe[1:]
        ev.append(f'Dialogue: 0,{stamp(a)},{stamp(b)},Cap,,0,0,0,,{tag}{safe}')
    out_path.write_text('\n'.join(head + ev) + '\n', encoding='utf-8')
    return out_path


def time_chunks(lines, sections, total, lead):
    """Proportional timing: word count plus a small pause at each section break."""
    weights = []
    sec_of_line = []
    for si, sec in enumerate(sections):
        for _ in sec:
            weights.append(1.0); sec_of_line.append(si)
    # a beat of silence at every [pause]
    extra = {}
    for i, si in enumerate(sec_of_line):
        if i > 0 and sec_of_line[i - 1] != si: extra[i] = 0.45
    wsum = sum(weights) + sum(extra.values())
    usable = max(1.0, total - lead - 0.95)
    t = lead; timings = []
    for i, ln in enumerate(lines):
        d = usable * (weights[i] + extra.get(i, 0)) / wsum
        d = max(0.55, min(d, 4.6))
        timings.append((t, t + d)); t += d
    # renormalise if the clamps pushed us past the end
    if timings and timings[-1][1] > total - 0.35:
        k = (total - 0.35 - lead) / max(1e-6, timings[-1][1] - lead)
        timings = [(lead + (a - lead) * k, lead + (b - lead) * k) for a, b in timings]
    return timings


# --------------------------------------------------------------------- render
def captions_per_section(post):
    """Group post.voLines back into the [pause] sections, in order."""
    script = (post.get('voScript') or '').strip()
    lines = list(post.get('voLines') or [])
    if not script: return [lines]
    parts = [p.strip() for p in script.split('[pause]') if p.strip()]
    if len(parts) <= 1: return [lines]
    # Match by word count: a section owns chunks until its words are used up.
    groups = []
    i = 0
    for pi, part in enumerate(parts):
        words = len(re.findall(r"[\w'’₦-]+", part))
        last = pi == len(parts) - 1
        take = []
        used = 0
        while i < len(lines) and (last or used < words):
            take.append(lines[i]); used += len(re.findall(r"[\w'’₦-]+", lines[i])); i += 1
        groups.append(take)
    while i < len(lines):
        groups[-1].append(lines[i]); i += 1
    return [g for g in groups if g]


def render(post, keep_work=False):
    vo = VO_DIR / f"{post['id']}.mp3"
    if not vo.exists(): return None
    nd = duration(vo)
    total = round(nd + LEAD_IN + TAIL_OUT, 2)
    disclosure = 'AI presenter · Easywurld' if post['format'] == 'AI talking head' else 'AI voice · Easywurld'
    if post['seriesKey'] == 'trend': disclosure = 'AI voice · dated teardown'

    groups = captions_per_section(post)
    flat = [c for g in groups for c in g]
    plates = plate_for(post, 0)
    n_scenes = max(2, min(len(groups) + 1, 6))                   # +1 = the end card

    # scene durations follow how much each section actually says
    weights = [max(1, sum(len(c.split()) for c in g)) for g in groups[:n_scenes - 1]]
    while len(weights) < n_scenes - 1: weights.append(weights[-1] if weights else 4)
    body = total - END_CARD
    wsum = sum(weights) or 1
    durs = [max(2.4, body * w / wsum) for w in weights]
    scale = (body) / sum(durs)
    durs = [d * scale for d in durs] + [END_CARD]

    work = WORK / post['id']; work.mkdir(parents=True, exist_ok=True)
    segments = []
    for i, d in enumerate(durs):
        frames = max(int(round(d * FPS)), int(XFADE * FPS) + 8)
        d = frames / FPS
        if i == len(durs) - 1:
            img = compose_end_card(post)
        else:
            plate = plates[i % len(plates)]
            img = compose_scene(post, plate, disclosure)
        png = work / f'scene-{i:02d}.png'
        img.save(png)
        up = 1.20
        moves = [
            ("min(1.00+0.16*on/{f},1.17)", "iw/2-(iw/zoom/2)", "ih/2-(ih/zoom/2)"),
            ("1.17-0.16*on/{f}", "iw/2-(iw/zoom/2)", "ih/2-(ih/zoom/2)"),
            ("1.10", "iw/2-(iw/zoom/2)+(iw*0.05)*(on/{f})", "ih/2-(ih/zoom/2)"),
            ("1.10", "iw/2-(iw/zoom/2)-(iw*0.05)*(on/{f})", "ih/2-(ih/zoom/2)"),
            ("min(1.02+0.13*on/{f},1.16)", "iw/2-(iw/zoom/2)", "ih*0.42-(ih/zoom/2)"),
        ][i % 5]
        vf = (f"scale={int(W*up)}:{int(H*up)}:flags=lanczos,"
              f"zoompan=z='{moves[0].format(f=frames)}':x='{moves[1].format(f=frames)}':y='{moves[2].format(f=frames)}'"
              f":d={frames}:s={W}x{H}:fps={FPS},"
              f"eq=saturation=1.05:contrast=1.04:brightness=0.01,"
              f"colorbalance=rs=0.03:gs=0.0:bs=-0.04:rm=0.02:bm=-0.03,"
              f"noise=alls=3:allf=t+u,vignette=PI/5.6,"
              f"fade=t=in:st=0:d=0.30,fade=t=out:st={max(0,d-0.34):.3f}:d=0.34,format=yuv420p")
        seg = work / f'seg-{i:02d}.mp4'
        run([FFMPEG, '-y', '-loglevel', 'error', '-i', str(png), '-vf', vf,
             '-frames:v', str(frames), '-r', str(FPS), '-an',
             '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '19', '-pix_fmt', 'yuv420p', str(seg)])
        segments.append((seg, d))

    # cross-dissolve the segments
    video = work / 'picture.mp4'
    if len(segments) == 1:
        video = segments[0][0]
    else:
        inputs = []
        for seg, _ in segments: inputs += ['-i', str(seg)]
        fc, prev, off = [], '0:v', 0.0
        for i in range(1, len(segments)):
            off += segments[i - 1][1] - XFADE
            tag = f'v{i}' if i < len(segments) - 1 else 'vout'
            fc.append(f'[{prev}][{i}:v]xfade=transition=fade:duration={XFADE}:offset={max(0,off):.3f}[{tag}]')
            prev = tag
        run([FFMPEG, '-y', '-loglevel', 'error', *inputs, '-filter_complex', ';'.join(fc),
             '-map', '[vout]', '-r', str(FPS), '-c:v', 'libx264', '-preset', 'veryfast',
             '-crf', '19', '-pix_fmt', 'yuv420p', str(video)])

    # captions + audio
    timings = time_chunks(flat, groups, total, LEAD_IN)
    ass = build_ass(flat, timings, work / 'captions.ass')
    music = write_wav(work / 'bed.wav', *music_bed(total + 0.4, seed=(post['day'] * 11 + post['slot']) % 977))
    dest = OUT / f"{post['id']}.mp4"
    dest.parent.mkdir(parents=True, exist_ok=True)
    vf = f"subtitles={ass}:fontsdir={FONT_DIR}"
    af = (f"[1:a]aformat=sample_rates=44100:channel_layouts=stereo,adelay={int(LEAD_IN*1000)}|{int(LEAD_IN*1000)},"
          f"apad=pad_dur={TAIL_OUT+0.6},asplit=2[voice][vsc];"
          f"[2:a]aformat=sample_rates=44100:channel_layouts=stereo,atrim=0:{total},volume=0.95[mus];"
          f"[mus][vsc]sidechaincompress=threshold=0.045:ratio=9:attack=14:release=290:makeup=1[duck];"
          f"[voice][duck]amix=inputs=2:duration=first:normalize=0,volume=1.35[mix];"
          f"[mix]loudnorm=I=-15:TP=-1.5:LRA=11,afade=t=in:st=0:d=0.5,afade=t=out:st={max(0,total-1.05):.2f}:d=1.05[aout];"
          f"[0:v]{vf}[vout]")
    run([FFMPEG, '-y', '-loglevel', 'error', '-i', str(video), '-i', str(vo), '-i', str(music),
         '-filter_complex', af, '-map', '[vout]', '-map', '[aout]',
         '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '23', '-pix_fmt', 'yuv420p', '-r', str(FPS),
         '-c:a', 'aac', '-b:a', '192k', '-ar', '44100', '-t', f'{total:.2f}',
         '-movflags', '+faststart', str(dest)], quiet=False)
    if not keep_work:
        for f in work.glob('scene-*.png'): f.unlink()
    return dest, total


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--only', help='one post id, e.g. EW-D01-S02')
    ap.add_argument('--day', type=int, help='one day number')
    ap.add_argument('--days', help='a range, e.g. 1-7')
    ap.add_argument('--all', action='store_true')
    ap.add_argument('--limit', type=int, default=0)
    ap.add_argument('--missing', action='store_true', help='list slots with no narration yet')
    ap.add_argument('--pending', action='store_true', help='render every slot whose narration is newer than its MP4 (or has none)')
    ap.add_argument('--keep-work', action='store_true')
    args = ap.parse_args()

    posts = [p for p in PLAN['posts'] if p.get('voScript')]
    if args.missing:
        miss = [p for p in posts if not (VO_DIR / f"{p['id']}.mp3").exists()]
        print(f'{len(miss)} of {len(posts)} video slots still need a narration file:')
        for p in miss[:40]: print(' ', p['id'], p['date'], p['series'])
        if len(miss) > 40: print(f'  …and {len(miss)-40} more')
        return

    if args.pending:
        keep = []
        for p in posts:
            vo = VO_DIR / f"{p['id']}.mp3"; mp4 = OUT / f"{p['id']}.mp4"
            if vo.exists() and (not mp4.exists() or mp4.stat().st_mtime < vo.stat().st_mtime): keep.append(p)
        posts = keep
    elif args.only: posts = [p for p in posts if p['id'] in [x.strip() for x in args.only.split(',')]]
    elif args.day: posts = [p for p in posts if p['day'] == args.day]
    elif args.days:
        a, b = (int(x) for x in args.days.split('-')); posts = [p for p in posts if a <= p['day'] <= b]
    elif not args.all: posts = [p for p in posts if p['day'] == 1]

    done = skipped = 0
    for p in posts:
        if args.limit and done >= args.limit: break
        vo = VO_DIR / f"{p['id']}.mp3"
        if not vo.exists():
            skipped += 1; print(f'  skip {p["id"]} — no narration at marketing/render/vo/{p["id"]}.mp3'); continue
        dest, total = render(p, keep_work=args.keep_work)
        if dest:
            size = dest.stat().st_size / 1e6
            print(f'  ✔ {p["id"]}  {total:5.1f}s  {size:5.1f} MB  -> {dest.relative_to(ROOT)}')
            done += 1
    print(f'\nRendered {done} finished video(s); {skipped} skipped for want of a narration file.')
    print(f'{len(posts) - done - skipped} more slot(s) selected but not reached.')


if __name__ == '__main__':
    main()
