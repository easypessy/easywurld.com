# Scheduling runbook — the order to schedule November in

**Plan:** 11 posts + 2 stories a day on TikTok, Instagram and Facebook, plus 6 LinkedIn posts a week.
**All assets:** rendered. See `assets/ASSET_MANIFEST.csv` for the file behind every item.
**Everything starts Draft.** Nothing in this repo publishes anything by itself.

---

## 1. The one constraint that decides your order

| Platform | How far ahead you can schedule | What that means |
|---|---|---|
| TikTok (official in-app scheduler) | ~15 minutes to **10 days** ahead | You cannot schedule all 30 days tonight. Schedule in **rolling 10-day windows**, then refill. |
| Meta Business Suite (Facebook + Instagram) | Weeks ahead, limits vary by account | Schedule the whole month or in weekly blocks, whichever your account allows. |
| LinkedIn | Native scheduling, days-to-weeks ahead | Six posts a week at 09:00; schedule weekly. |

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

### Step 4 — LinkedIn
1. Monday: upload `assets/carousels/EW-D01-S01_carousel.pdf` as a **document post** with the Monday LinkedIn copy.
2. Tuesday–Thursday, Saturday: paste the text posts from the **LinkedIn** tab. Put the destination link in the **first comment**, not the body.
3. Friday: post the week's strongest vertical clip, re-framed 4:5, with the AI label if there is a synthetic voice.

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

## 5. What is genuinely ready vs still to produce

| Ready now | Still to produce |
|---|---|
| 605 carousel slides | 141 vertical video clips (or use the posters) |
| 60 memes, 8 statics | 5 LinkedIn PDFs are ready — but the Friday videos are clips |
| 180 story frames | Sticker placement inside each app |
| 141 video posters | Voice/avatar recording for the ~92 talking-head slots |
| All 330 captions × 3 platforms | Actual post URLs after publishing |
| 26 LinkedIn posts written | The Sunday siphon, if you prefer writing it fresh |

## 6. Two honest warnings

- **Volume is not reach.** 39 placements a day is a lot of chances, not a promise. If the first week shows flat saves and no enquiries, change the offer and the hook before adding more volume.
- **The TikTok 10-day window is the real bottleneck.** If you miss a refill, that platform goes quiet while the others keep running. Put the refill in your calendar now, not later.
