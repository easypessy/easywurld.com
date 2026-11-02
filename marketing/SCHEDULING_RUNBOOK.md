# Scheduling runbook — the order to schedule November in

**Plan:** 11 posts + 2 stories a day on TikTok, Instagram and Facebook, plus **7 LinkedIn posts a day** — four on the Easywurld company page and three on Abu Israel's personal profile (210 across the month).
**All assets:** rendered. See `assets/ASSET_MANIFEST.csv` for the file behind every item.
**Everything starts Draft.** Nothing in this repo publishes anything by itself.

---

## 1. The one constraint that decides your order

| Platform | How far ahead you can schedule | What that means |
|---|---|---|
| TikTok (official in-app scheduler) | ~15 minutes to **10 days** ahead | You cannot schedule all 30 days tonight. Schedule in **rolling 10-day windows**, then refill. |
| Meta Business Suite (Facebook + Instagram) | Weeks ahead, limits vary by account | Schedule the whole month or in weekly blocks, whichever your account allows. |
| LinkedIn | Native scheduling, days-to-weeks ahead | Seven posts a day (4 company + 3 personal). Schedule a week at a time; the personal profile posts first-person and never the same text as the page. |

So "schedule it all tonight" really means: **Meta = the whole month, LinkedIn = the month, TikTok = the next 10 days**.

> Confirm the windows inside your own accounts before you rely on them. Platform limits change, and a scheduled TikTok cannot be edited — it must be deleted and re-uploaded.

---

## 2. Tonight, in this order (about 3–4 hours)

### Step 0 — 10 minutes of decisions
- [ ] Confirm the ₦5,000 DIY price, what is inside each pack, and how you deliver it. Two posts a day depend on this.
- [ ] Decide on the 30 Trend Desk slots: **verified** (you have a current example) or **dated teardown** (post the poster as-is with the live-trend wording already removed). Do not leave them undecided; they are 30 of the 330 posts.
- [ ] Decide the 141 video slots: **post the rendered poster** (zero extra work, already on brand) or **record the clip** later. Posters are legitimate posts; nobody is owed a video.

### Step 1 — Week one, day by day
Open `launch-content/social-command/EASYWURLD_POST_COMMANDER.html` → **Daily calendar**. For each day, work top to bottom. It shows the 11 posts, the 2 stories and every platform caption in the order they publish.

### Step 2 — Meta Business Suite (Facebook + Instagram)
1. Planner → **Create post** → choose Facebook, Instagram, or both.
2. Paste the caption for that platform (they differ on purpose; do not use one caption for both).
3. Attach the file from the manifest:
   - carousel → the five `assets/carousels/EW-Dxx-Sxx_slide-*.jpg` in order,
   - meme / static → `assets/memes/…jpg` or `assets/static/…jpg`,
   - video slot → the `.mp4` if you have it, otherwise `assets/fallbacks/….jpg`.
4. Set the date and time from the calendar (Facebook is +20 min behind TikTok, Instagram +10).
5. Stories: Business Suite can schedule Facebook and Instagram stories — 12:30 and 21:00, three frames each, sticker added at schedule time where the tool allows; otherwise post stories live (they are 15 seconds of work each).
6. Publish settings: enable the AI label on the four AI slots per day (08:30, 19:00, 22:00, plus trend 10:00 where a synthetic voice is used).

### Step 3 — TikTok (next 10 days only)
1. Post each item via **Upload** → set the cover → add the caption → **Schedule**.
2. Turn on the **AI-generated content** toggle for the Myth Court, Offer B, One Last Thought and Trend Desk clips.
3. TikTok slot times are the base times in the calendar (00 minutes).
4. Photo carousels: upload the five slides as a photo post.
5. Set a reminder to refill TikTok on day 9 — this is the one thing that must not slip.

### Step 4 — LinkedIn (seven posts a day)
1. **Company page, 07:30** — upload `assets/linkedin/EW-LI-Dxx-CO1.pdf` as a **document post** with the CO1 body.
2. **Company page, 10:30 / 13:30** — the myth text post, then the image post (attach the file named on the day sheet).
3. **Company page, 17:00** — upload the finished MP4 named on the day sheet (captions and the AI label are already burned in). Where no finished video exists yet, post that slot's poster as an image post instead.
4. **Personal profile, 08:15 / 12:45 / 19:45** — paste from `01_LINKEDIN.md`. Abu Israel's voice is first person; Monday's 08:15 also ships as a PDF document, Saturday's 12:45 is a native poll, Friday's 19:45 reuses the day's finished video.
5. For every LinkedIn post, publish the **first comment immediately** afterwards — it is already written in `01_LINKEDIN.md` and carries the link. Never put a link in the body.

### Step 5 — Record what you did
For each placement you schedule, set the status in the studio to **Scheduled**. After it goes live, paste the actual URL. Export a JSON backup when you finish the night.

---

## 3. The rest of the month

| When | Do |
|---|---|
| Day 8 | Refill TikTok to day 20. Check the first week's numbers in `MEASUREMENT.csv`. |
| Day 15 | Refill TikTok to day 30. One change per series, based on the first two weeks. |
| Day 22 | Last TikTok refill. Decide what repeats in December. |
| Day 29 | Review: which series earned saves, replies and keyword enquiries. |

## 4. If you fall behind (you will, once)

The rule is **hold, do not stack**:

1. Post the rendered poster for any video slot you cannot finish. It is already on brand.
2. Drop the second meme of the day rather than a myth or an offer.
3. Never publish two catch-up posts in the same hour.
4. Never publish a trend post with live-trend language unless the verification row is filled.

## 4b. The by-day packs and the finished videos

`python marketing/build-day-packs.py` builds `marketing/render/packs/Day_XX/` — one folder per day holding the day sheet, the LinkedIn copy, the captions, the carousel arrangement, the numbered contact sheets, the stories and every rendered file — and zips it two ways: **`day-zips/Day_XX.zip` (one zip per day, the delivery unit)** and `zips/Easywurld_November_Days_01-10.zip` / `11-20` / `21-30` (ten-day blocks for bulk download, split because of Drive's 100 MB per-file limit). Work from the day sheet top to bottom; it lists all 46 placements in time order with the exact file for each.

**Every file inside a day is named `HHMM_POSTID_position-of-total.ext`** — `0700_EW-D01-S01_3of5.jpg` is the 07:00 post, slide 3 of 5 — so the `assets/` folder sorts into posting order by name and no carousel position is a guess. `04_CAROUSELS.md` lists each carousel slide by slide (position, file name, what it says) and `05_CONTACT_SHEETS.pdf` shows every carousel and story as numbered thumbnails side by side for a visual check before you attach. Attach slides in the numbered order; Instagram, TikTok photo posts and Facebook keep the order you select them in.

`--days 3-4` rebuilds and re-zips only those days, which is what you use after a render batch: re-zip the days that changed, re-upload just those two `Day_XX.zip` files, and the rest of Drive is untouched. `--no-decade` skips the bulk blocks.

### The Drive folder is two sets, and the old one stays

**Easywurld — November 2026 (by day)** holds:

- **`SET_A__Original_November_content`** — the first delivery, kept as it was: the three ten-day block zips with first-generation assets and posters. Nothing in here is replaced. It is the record of version one.
- **`SET_B__Upgraded_content_PER_DAY`** — the working delivery: `Day_01.zip` … `Day_30.zip`, one zip per day, plus the upgraded ten-day bulk zip. A day is re-uploaded on its own when its finished videos land, so the day you are working from is always current.
- `READ_ME` (Google Doc) — what each set is, which days already carry finished videos, and the order to schedule in.

When you re-upload a day, delete the superseded `Day_XX.zip` only — never anything in SET_A.

`python marketing/build-video.py --day N` renders every video slot on a day that already has a narration file in `marketing/render/vo/`: the voiceover, an instrumental bed synthesised for the brand and ducked under the voice, burned-in captions, Ken Burns moves, dissolves, grain, a warm grade, the brand header, the AI disclosure chip and an end card with the CTA and WhatsApp keyword. The result needs no editing — upload it as is. Pipeline notes and the narration batching rule: `marketing/VIDEO_PIPELINE.md`.

## 5. What is genuinely ready vs still to produce

| Ready now | Still to produce |
|---|---|
| 605 carousel slides | 131 of the 141 vertical videos (Days 1–2 are finished) |
| 60 memes, 8 statics | Sticker placement inside each app |
| 180 story frames | Actual post URLs after publishing |
| 35 LinkedIn document PDFs | The Easywurld company page URL (fill it into the plan) |
| 210 LinkedIn posts written (4 + 3 a day) | Narration for Days 3–30, in ten-clip batches |
| All 330 captions × 3 platforms | |
| 10 finished ready-to-post MP4s (Days 1–2) | |

## 6. Two honest warnings

- **Volume is not reach.** 39 placements a day is a lot of chances, not a promise. If the first week shows flat saves and no enquiries, change the offer and the hook before adding more volume.
- **The TikTok 10-day window is the real bottleneck.** If you miss a refill, that platform goes quiet while the others keep running. Put the refill in your calendar now, not later.
