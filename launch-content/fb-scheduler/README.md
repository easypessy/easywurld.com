# Easywurld Facebook Scheduler Kit (zero API, zero cost)

120 media-ready Facebook posts (4 slots × 30 days, 19 Oct – 17 Nov 2026, WAT) packaged for
**Meta Business Suite scheduling** and **Google Calendar reminders**, with no Facebook API,
app review or business verification anywhere.

## Files

- `Easywurld_FB_Scheduler_Console.html` — offline phone app: captions with one-tap copy,
  media folder per post, scheduled ticks + notes (localStorage), progress backup/restore.
- `Easywurld_FB_Reminders.ics` — 120 calendar events, Africa/Lagos timezone, two alarms
  each (10 min before and at post time), caption and media note embedded.
- `Easywurld_FB_Google_Calendar_Import.csv` — the same 120 slots in Google Calendar's
  import format (fallback for phones that won't accept .ics).
- `fb-posts.json` — structured source data for all outputs.
- `ZERO_API_FACEBOOK_SCHEDULING.md` — the phone-first how-to; read this first.

## How the slots map to the posts ZIP

Each record points at a folder inside `Easywurld_Posts_By_Day.zip`:

| Time (WAT) | Folder pattern | Media | Status |
| --- | --- | --- | --- |
| 08:00 | `Post_01_0800_Instagram-and-Facebook-feed_*` | `Slide_1.png`…`Slide_6.png` | CORE |
| 12:30 | `Post_04_1230_Instagram-Reel-and-Facebook-video_*` | `Video.mp4` | CORE |
| 15:00 | `Post_06_1500_Facebook-feed_*` | `Image.png` | CORE |
| 20:00 | `Post_10_2000_Instagram-and-Facebook-feed_*` | `Image.png` | optional |

## Phone delivery: one ZIP per day

The full 18 MB pack floods a phone gallery, so `tools/fb-scheduler/build-day-zips.py`
splits it into 30 daily archives (~400 KB each) containing only the four Facebook post
folders for that day. These are uploaded to the Drive subfolder
**Daily zips — download ONE day at a time**:

```sh
# from the repository root (extract the big pack first)
mkdir -p tmp/kit
unzip -o launch-content/Easywurld_Posts_By_Day.zip -d tmp/kit/
python3 tools/fb-scheduler/build-day-zips.py   # -> tmp/day-zips/Day_01.zip ... Day_30.zip
node tools/fb-scheduler/build-fb-kit.mjs        # -> console, ICS, CSV, JSON
```

`tmp/` is gitignored. To shift the campaign, change `START_DATE` at the top of
`tools/fb-scheduler/build-fb-kit.mjs` and rerun. The builders use Node/Python standard
libraries only.
