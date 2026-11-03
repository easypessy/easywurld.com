#!/usr/bin/env python3
"""Re-shoot already-finished videos with the handheld motion grammar.

The owner's note: the videos looked like static slides, not footage. The fix lives
in build-video.picture() (eased ken burns, camera sway, breathing light, mid-shot
reframes, varied cuts). New renders get it automatically; this pass gives it to
videos that were finished before the upgrade.

Nothing about the sound changes: the finished mix (voice + ducked bed + loudnorm)
is copied straight out of the existing MP4 and muxed under the re-shot picture,
and the captions are re-burned at their original timings, so a re-motioned clip
is the same video, alive — not a new edit.

Usage
  python marketing/remotion.py --count          # how many still need the pass
  python marketing/remotion.py --limit 1        # re-shoot the next one
  python marketing/remotion.py --only EW-D01-S02
"""
from __future__ import annotations
import argparse, importlib.util, json, os, sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('bv', HERE / 'build-video.py')
bv = importlib.util.module_from_spec(spec)
spec.loader.exec_module(bv)


def video_posts():
    for p in bv.PLAN['posts']:
        if p.get('slides') or p.get('seriesKey') in ('meme1', 'meme2') or p['format'] == 'Relatable static':
            continue
        yield p


DONE_JSON = HERE / 'ALIVE2.json'


def done_set():
    """Markers live in the gitignored render dir; the committed json mirror is what
    survives a workspace rollback, so a restart never re-shoots delivered days."""
    base = set(json.loads(DONE_JSON.read_text())) if DONE_JSON.exists() else set()
    if bv.ALIVE2.exists():
        base |= {f.stem for f in bv.ALIVE2.glob('*.ok')}
    return base


def pending():
    done = done_set()
    return [p for p in video_posts()
            if (bv.OUT / f"{p['id']}.mp4").exists() and p['id'] not in done]


def remotion(post):
    dest = bv.OUT / f"{post['id']}.mp4"
    total = bv.duration(dest)
    groups = bv.captions_per_section(post)
    flat = [c for g in groups for c in g]
    work = bv.WORK / f"{post['id']}-alive"
    work.mkdir(parents=True, exist_ok=True)

    video = bv.picture(post, total, groups, work)

    timings = bv.time_chunks(flat, groups, total, bv.LEAD_IN)
    ass = bv.build_ass(flat, timings, work / 'captions.ass', events=bv.beat_events(flat, timings))
    audio = work / 'audio.m4a'
    bv.run([bv.FFMPEG, '-y', '-loglevel', 'error', '-i', str(dest), '-vn', '-c:a', 'copy', str(audio)])

    tmp = work / 'new.mp4'
    bv.run([bv.FFMPEG, '-y', '-loglevel', 'error', '-i', str(video), '-i', str(audio),
            '-vf', f"subtitles={ass}:fontsdir={bv.FONT_DIR}",
            '-map', '0:v', '-map', '1:a',
            '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '23', '-pix_fmt', 'yuv420p',
            '-r', str(bv.FPS), '-c:a', 'copy', '-t', f'{total:.2f}',
            '-movflags', '+faststart', str(tmp)], quiet=False)
    os.replace(tmp, dest)
    bv.ALIVE2.mkdir(parents=True, exist_ok=True)
    (bv.ALIVE2 / f"{post['id']}.ok").write_text('alive2\n')
    for f in work.glob('scene-*.png'):
        f.unlink()
    print(f"  ✔ re-shot {post['id']}  {total:.1f}s  -> {dest.name}", flush=True)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--count', action='store_true')
    ap.add_argument('--limit', type=int, default=0)
    ap.add_argument('--only', nargs='*')
    a = ap.parse_args()
    if a.count:
        print(len(pending()));
        return
    jobs = pending()
    if a.only:
        jobs = [p for p in jobs if p['id'] in a.only]
    done = 0
    for p in jobs:
        if a.limit and done >= a.limit:
            break
        remotion(p)
        done += 1
    print(f"Re-shot {done} video(s); {len(pending())} still queued.", flush=True)


if __name__ == '__main__':
    main()
