# Easywurld — Facebook posting with NO API, NO business verification, NO money

## The one thing that was blocking you

The screen that asked you to **register/verify a business** belongs to the Facebook
**developer** path. That path is for people building an *app* that posts on behalf of
other people, so Meta audits the business behind it. You are not building an app, so you
will never need that screen.

**Meta Business Suite** is Facebook's own free tool for Page admins. It schedules posts
months in advance, natively, inside Facebook. It needs:

- no API key,
- no app review,
- no business verification,
- no payment.

You only need to be logged in as an admin of the Easywurld Page. Everything in this kit
works around that single fact. There are two safe ways to run the 120 ready Facebook
posts (4 a day × 30 days, 19 Oct – 17 Nov 2026, Lagos time). Pick whichever fits your
life, or combine them.

---

## Option 1 — Schedule a batch ahead inside Meta Business Suite (recommended)

You do the clicking once, then Facebook publishes for you while your phone is off.

### One-time setup (about 5 minutes)

1. Install **Meta Business Suite** from the Play Store / App Store, or on a laptop open
   **business.facebook.com**.
2. Log in with the Facebook account that admins the Easywurld Page.
3. Open **Settings → Business settings → Time zone** and set it to
   **Africa/Lagos (WAT, UTC+1)**. Every time printed in this kit is WAT, so this matters.

### The phone media problem, solved: one ZIP per day

The big 18 MB `Easywurld_Posts_By_Day.zip` floods a phone gallery with hundreds of images,
so do **not** open it on your phone. Instead open the **Daily zips — download ONE day at a
time** folder in Drive. It holds `Day_01.zip` to `Day_30.zip`, each about 400 KB and
containing **only that day's four Facebook posts** in four clearly named folders
(captions included). Only one day is ever on your phone.

Each day follows the same rhythm:

1. In Drive, download today's `Day_XX.zip` (Day 2 is marked START HERE).
2. Open it with the **Files by Google** app (Android) or the **Files** app (iPhone) and tap
   extract. It creates one `Day_XX` folder with four post folders — nothing scatters into
   the gallery as long as you browse by folder, not by the Photos grid.
3. Open **Easywurld_FB_Scheduler_Console.html** (add it to your home screen first — it then
   behaves like an app and works fully offline). Every card names the exact zip and folder.
4. Tap **Copy caption** on the card.
5. Switch to Meta Business Suite → **Create post** → choose the Facebook Page → paste.
6. Tap **Add photo/video**. When the picker opens, use the **file/folder browser** (hamburger
   menu → Downloads → `Day_XX` → the folder printed on the card), not the gallery grid:
   - carousel card → select **Slide_1.png to Slide_6.png in order**;
   - video card → select **Video.mp4** (the caption file also holds the voiceover and
     on-screen text used to make the video — paste only the short "Caption:" part into the
     Facebook text box);
   - feed card → select **Image.png**.
7. Instead of **Publish**, tap **Schedule**, set the exact date and time on the card, and
   confirm.
8. Tap the big tick on the card — it greys out and progress is saved on the phone.
9. After the four posts are scheduled, delete the `Day_XX` folder and the zip from Downloads.
   Tomorrow, download the next one.

Do one day at a time, or queue several days in one sitting. If Business Suite ever limits
how many posts you can queue, fill it and top up later — the console remembers every tick.

### The four daily slots

| Time (WAT) | What it is | Status |
| --- | --- | --- |
| 08:00 | 6-slide carousel, feed | CORE |
| 12:30 | Short video / reel | CORE |
| 15:00 | Honest-answer feed post (image + text) | CORE |
| 20:00 | Second feed post (image + text) | optional on busy days |

The three CORE posts carry the plan. Skipping the 20:00 slot is always fine; stacking
missed posts late at night to catch up is not.

---

## Option 2 — Your phone reminds you, and you post live (zero scheduling work)

If you would rather post in the moment, let Google Calendar do the remembering.

### Import the reminders (once, about 3 minutes)

**Easiest, on a laptop:** open Google Calendar → **Settings → Import & export → Import** →
upload **Easywurld_FB_Reminders.ics** → choose a calendar named "Easywurld Facebook" →
Import. All 120 events appear, each with its caption and media note inside the event.

**On a phone:** open **Easywurld_FB_Reminders.ics** from Google Drive and choose
**Add all events** when prompted. If your phone cannot import .ics directly, use the
**Easywurld_FB_Google_Calendar_Import.csv** file through the laptop steps above.

### What happens at post time

- Your phone buzzes **10 minutes before** every slot, and again at the exact time.
- Open the calendar event: the full caption and the media folder name are inside it.
- Open the console (or the event), copy the caption, open Facebook, attach the media from
  the posts ZIP in your Drive, and publish.
- Tick the card so the month grid shows what is done.

Importing creates normal calendar events on your own Google account. No app, no API, no
password sharing, and they fire even when you have no data plan at that moment (the alarm
is local; only opening Drive needs internet).

---

## Option 3 — Free third-party schedulers (only if you want one inbox for everything)

Tools like **Publer** and **Buffer** have free tiers and can post to a Facebook Page
without *you* verifying a business, because **their** apps are already reviewed and
approved by Meta — you simply log in and grant them access to your Page. Their free plans
cap how many posts sit in the queue (roughly 10–25 pending posts), so they work as a
weekly refill, not a whole month at once. Meta Business Suite (Option 1) remains free with
the highest limits, so treat these as optional, not required.

## What never to do

Do **not** hand your Facebook password or login code to any "auto-poster", bot, browser
plugin or someone offering to "run your page through software". Automated login with a
password breaks Facebook's rules and is the fastest way to get the Page restricted or
banned. The two safe no-API routes are the ones above: Facebook's own scheduler, and
calendar reminders with manual posting.

---

## The files in this folder

| File | What it is for |
| --- | --- |
| `Easywurld_FB_Scheduler_Console.html` | The offline phone app: every caption, one-tap copy, media folder per post, tick marks, progress, backup/restore. Start here. |
| `Easywurld_FB_Reminders.ics` | All 120 slots as calendar events with two alarms each (10 min before + on time). Import into Google Calendar. |
| `Easywurld_FB_Google_Calendar_Import.csv` | Same 120 slots in Google Calendar's CSV format, backup if the .ics won't import. |
| `fb-posts.json` | The structured data behind all three, for any future rebuild. |
| `ZERO_API_FACEBOOK_SCHEDULING.md` | This guide. |
| **Daily zips — download ONE day at a time/** (Drive subfolder) | `Day_01.zip`–`Day_30.zip`, ~400 KB each, holding only that day's four Facebook post folders. Download, extract, schedule, delete. |

## About the bigger content plan

The Post Commander and Content Calendar in your Drive hold an even larger idea bank
(11 Facebook posts a day). Those extra posts are mostly **text-only**, so when you want
more than the four media-ready slots a day, schedule them through the same Option 1 flow —
a text post needs no upload at all. This kit deliberately starts from the 120 posts whose
images and videos already exist, so there is nothing to make before you begin.

## If the campaign dates shift

All dates derive from one start date (Day 1 = Monday 19 October 2026). To move the whole
run, change `START_DATE` in `tools/fb-scheduler/build-fb-kit.mjs` and run
`node tools/fb-scheduler/build-fb-kit.mjs` — every file above is regenerated.
