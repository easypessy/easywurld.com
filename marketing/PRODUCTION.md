# Produce, edit and schedule the 11-post, 2-story plan

**Campaign:** 2 November–1 December 2026
**Volume:** 330 content posts, 60 stories, 26 LinkedIn posts, 1,196 platform placements
**Cadence:** 11 posts + 2 stories/day × TikTok, Instagram and Facebook
**Canonical editorial source:** `marketing/series-plan.json`

The generated `content-plan.json`, calendar, CSV, briefs, PDF, app data and starter assets all come from the series source. Edit the source, then rebuild.

## 1. Before Monday

1. Read [STRATEGY.md](./STRATEGY.md) and [SERIES_PLAYBOOK.md](./SERIES_PLAYBOOK.md).
2. Confirm the public handles, website destination, WhatsApp number and offer fulfilment.
3. Test the profile → link → WhatsApp journey from a logged-out browser.
4. Lock the anonymous Operator persona (no real likeness needed) and approve one voice preset: [AVATAR_OPERATOR.md](./AVATAR_OPERATOR.md).
5. Verify the launch-week Trend Desk candidates and complete the log.
6. Approve the first seven days of scripts and the daily offers.
7. Produce the first week: 77 content posts, 14 stories, 6 LinkedIn posts, 273 placements.
8. Schedule only approved placements. Mark Scheduled only after the platform confirms.

This repository contains drafts, prompts, planning data, scene plates, voice samples and starter graphics. It does **not** contain finished talking-head videos, live analytics or a social scheduling connection.

## 2. Production reality

A full week is not 10 posts. It is:

- **77 content posts:** seven of each of the eleven series.
- **14 stories:** seven midday polls, seven evening desk teasers.
- **6 LinkedIn posts:** siphoned, written last from the finished copy.
- **273 platform placements:** 77 × 3, plus 14 × 3, plus 6.

The production burden is real. A planning estimate is **38–65 focused team hours per week** once templates, avatar, voice and a repeatable QA process exist; the first week will take longer. This is not a promise. If the team cannot produce safe work at this volume, hold weak slots instead of publishing unreviewed AI or stacking catch-up posts.

## 3. Weekly batch by series

Do not produce day by day from a blank page. Batch each series.

| Block | Weekly output | Practical order |
|---|---:|---|
| Trend verification | 7 gates | Research and log first; hold unverified slots |
| Scripts and offer checks | 70 scripts | Approve facts, price, sample labels and CTA |
| Talking heads | 21+ videos | Myths, Offer B, some intros |
| Screen demos | 7–14 videos | Trend storyboards and AI workflows |
| Carousels/statics | 40–50 graphics | Niche, Offer A, copy moves, intros, memes |
| Captions/adaptation | 210 captions | Generate per platform, then human-check |
| Scheduling | 210 placements | Queue approved assets; record URLs/status |

### Suggested week

- **Thursday:** verify next week’s trends; collect questions, offers and sources.
- **Friday:** approve scripts; confirm offer price/fulfilment; book any recording.
- **Saturday:** batch avatar/voice sections, screen recordings and static designs.
- **Sunday:** edit, caption, QA and schedule Monday–Wednesday.
- **Monday–Friday:** assemble daily placements, schedule the next days, reply, record actual URLs.
- **Saturday/Sunday:** review the week by series; prepare the next batch.

This is a suggested rhythm, not a requirement to work every weekend.

## 4. AI talking heads

The reusable prompt is in [brand-prompt.md](./brand-prompt.md). Each brief also has a filled prompt, script, beats and fallback.

0. **Use the Operator persona.** The faceless founder concept, look, voice delivery card, script formula and 30-day story arc are in [AVATAR_OPERATOR.md](./AVATAR_OPERATOR.md). Art and voice samples are in `assets/avatar/`. No face is shown, so no real likeness or photo release is required.
1. **Choose a licensed tool.** Check avatar/photo support, consent, commercial rights, retention, deletion and export limits. Do not buy an annual plan to test one clip.
2. **Use the supplied scene plates.** `operator-hero.png`, `operator-presence.png` or `operator-desk.png` as scene reference. Do not upload a real person’s photo, a CV photo or the fictional demo founder; none of them are permission to animate someone.
3. **Run a 10-second test.** Check identity, teeth, eyes, skin texture, head movement and pronunciation.
4. **Approve the voice separately.** Test “Easywurld”, “Lagos”, “naira”, “WhatsApp”, “SEO” and every price. Do not call a generic voice the owner’s.
5. **Generate in sections.** Split at beat boundaries when lip sync drifts. Use the exact script; no extra claims.
6. **Disclose.** Keep a persistent `AI presenter · Easywurld` label and enable the platform AI setting. For synthetic narration over a demo, use `AI voice · Easywurld`.
7. **Stop if identity drifts.** Use the fallback. An honest screen demo is better than an uncanny spokesperson.

## 5. CapCut edit order

Menu names vary by version.

1. New project → 9:16. Target 1080×1920, 30 fps.
2. Remove the empty intro, repeated takes and long pauses. Start with the hook already in progress.
3. Keep the presenter chest-up and near eye level. Reframe only at a meaningful beat.
4. Add one relevant cutaway: a checklist, labelled sample, worksheet or real screen recording.
5. Generate captions, then correct every line. Watch names, prices and negatives.
6. Add the exact hook as a short title. Do not cover eyes or mouth.
7. Add the AI disclosure label for the whole video.
8. Mix voice first. Music is optional and must be owned/licensed or from the applicable commercial library.
9. Check the actual platform preview. The house guide is conservative, not an official safe zone.
10. Export MP4/H.264, 1080×1920, 30 fps. Watch with sound, muted and at thumbnail size.

CapCut’s guidance supports pairing jump cuts with a meaningful reframe, B-roll, screen capture or caption change. [1](https://www.capcut.com/create/video-transitions-crossfade-hard-cut-jump-cut)

## 6. Screen demos and AI workflows

- Record the actual repo demo. Keep `Concept project · sample build` visible.
- Crop to the relevant interface instead of shrinking a whole desktop page.
- Do not invent clicks, dashboards, metrics, rankings or messages sent.
- For workflow-only posts, use the five-card structure: input → AI draft → human check → output → boundary.
- Use anonymised or fictional input. Never put private customer data into an AI tool for content.
- If the demo does not support what the script says, change the script. Do not fake the interface.

## 7. Trend Desk gate

Each trend post is **held** until the log is complete.

1. Open the dated source already attached to the brief.
2. Within seven days before publishing, find a current public example on the target platform.
3. Record the example URL, platform, date checked, rights check, relevance note and reviewer in `marketing/TREND_VERIFICATION.csv`.
4. If the format still fits, update the wording to “this week” or “last week” only where the evidence supports it.
5. If no current example is verified, publish as a **dated teardown**: name the source and date, and remove live-trend wording.
6. Check audio rights separately. A trending personal-account sound is not cleared for brand use. Use the Commercial Music Library with the applicable territory/placement rights, or owned/licensed audio. [2](https://ads.tiktok.com/help/article/how-to-use-the-commercial-music-library)

Do not invent a trend, an example account, a view count or a current platform feature.

## 8. Offer posts

One pack per day, two angles:

- **A:** problem, actual contents, ₦5,000 price, DIY boundary, keyword CTA.
- **B:** one objection/limitation, direct answer, actual contents, DIY boundary, same keyword.

Before publishing, confirm:

- [ ] Price is still ₦5,000.
- [ ] Contents match the current pack.
- [ ] Fulfilment and delivery work.
- [ ] Payment route is correct.
- [ ] The DIY/custom boundary is visible.
- [ ] No guaranteed results, fake scarcity or invented testimonials.

Hold both offer posts if the pack cannot be delivered.

## 9. Memes (scene-led, not text cards)

- Two original memes per day; 60 total.
- **Base image first:** one of the eight scene plates in `marketing/assets/meme-scenes/` (empty plastic chairs, face-down phone, blank screen, crossed-out notebook, overflowing chats, market aisle, shop ledger, rain window). Never a giant text card.
- **Small type:** two lines, 46px and 31px, in the lower third, over a soft dark shade. If the words are the whole image, it is a quote card, not a meme.
- Rotate scene, zoom and crop bias so the month does not look like one template.
- Joke about the work, not the customer. No stolen templates, fake notifications or private screenshots.
- The caption under the post carries the lesson; the image carries the recognition.

## 9b. Stories

- Render three frames per story at 1080×1920 from `marketing/assets/stories/` (week 1 is pre-rendered).
- Captions burned in — most stories are watched muted.
- Frame 3 of a poll story carries the answer plus room for the sticker; frame 3 of a desk story carries the link sticker zone.
- Post the same three frames to Instagram, then Facebook (+5), then TikTok (+10). Each expires in 24 hours; there is no archive to fix later, so QA before posting.
- Never put a link sticker on a poll story, and never put a live-trend claim on a desk story.

## 9c. LinkedIn pulls

- Six a week at 09:00, siphoned from finished copy. See `content-plan.json → linkedin`.
- Rewrite for reading: one-line paragraphs, no hashtag block, two tags maximum, link in the first comment.
- Monday: upload the week's best carousel as a PDF document post (slide 1 is the mobile cover).
- Friday: the week's strongest vertical video, re-framed to 4:5 with captions and the AI label.
- Read every post aloud before publishing. If a sentence needs a second breath, split it.

## 10. Captions and platform adaptation

Each core post has three generated captions.

| Platform | Adaptation |
|---|---|
| TikTok | Short, native, vertical. Spoken hook. Captions. One CTA. Check commercial audio and AI setting. |
| Instagram | More structured. Carousel or Reel. Check crop, cover and AI setting. |
| Facebook | Conversational. Native text/video/photo album. Do not paste a TikTok hashtag block. |
| LinkedIn | Rewritten, not pasted. Short paragraphs, two tags maximum, link in the first comment. |

One idea can travel. The file, caption, crop, audio rights and disclosure still need checking per platform.

## 11. Scheduling

### TikTok

Use the upload flow available in the account. The official scheduler announcement describes a **15-minute to 10-day** window and says scheduled posts cannot be edited; delete and re-upload to change one. Check current limits and Studio options in your account. [1](https://ads.tiktok.com/business/en/blog/introducing-video-scheduler-now-you-can-plan-tiktoks-in-advance)

Enable the AI-generated content setting for realistic synthetic presenters/voices. Keep the on-screen label and caption disclosure. [1](https://support.tiktok.com/en/using-tiktok/creating-videos/ai-generated-content)

### Instagram and Facebook

Meta Business Suite can plan Facebook and Instagram posts from one calendar. Features and limits vary; confirm the timezone, preview and disclosure in your account. [1](https://www.facebook.com/business/help/1170295510042639)

### Cadence

- TikTok at the series time.
- Instagram +10 minutes.
- Facebook +20 minutes.
- 11 content posts + 2 stories/day, 39 placements/day, plus 6 LinkedIn posts a week.

These are test times, not proven best times.

### Guardrails

- Do not bypass a platform cap or use unauthorised automation.
- Do not post the same file 30 times in a burst.
- If a platform caps or rejects scheduled posts, hold the remainder and keep the queue chronological.
- Mark a placement Scheduled only after the platform confirms it. Paste the actual post/queue URL in the app or CSV.
- The CSV is a production/planning sheet, not an auto-publishing import.

## 12. QA gate

For every placement:

- [ ] Facts, price, offer and sample labels checked.
- [ ] Trend verification complete, or live-trend wording removed.
- [ ] Approved likeness/voice or non-avatar fallback.
- [ ] Captions, pronunciation, crop and AI disclosure checked.
- [ ] One CTA and destination tested on a phone.
- [ ] Human approval recorded.

Offer placements add: current price, payment and fulfilment confirmed.

Statuses: Draft → Script approved → Asset produced → QA approved → Scheduled → Published → Reviewed.

## 13. File naming and storage

- `EW-D01-S02_2026-11-02_tiktok_v01.mp4`
- `EW-D01-S01_2026-11-02_instagram_slide-01.png`
- `EW-D01-S06_2026-11-02_facebook_carousel.zip`

Keep raw video exports, private source images, consent records, customer messages and payment details outside the public repo. Use production storage for large files.

## 14. Measurement and review

Record only available metrics in `MEASUREMENT.csv`:

- 24-hour and 7-day views/plays
- Average watch time and completion
- Saves, shares, profile visits
- Relevant comments
- WhatsApp keyword enquiries
- Qualified project briefs
- Confirmed sales
- Actual post URL
- Observed lesson and one next change

Review by series after seven days. Keep the cadence for the test, but change hooks, formats and angles based on evidence. Do not declare a winner from one post or invent a month-end result.

## 15. Troubleshooting

| Problem | Action |
|---|---|
| No approved owner photo | Use the anonymous Operator persona (`assets/avatar/`) or the series carousel/static/demo fallback. Never invent a biometric likeness. |
| A clip reveals the face | Delete the frame, re-crop to the back of the head or silhouette, or use `operator-desk.png` as a plate. |
| Avatar identity drifts | Regenerate the section or drop the avatar. |
| Voice mispronounces a word | Adjust the approved script or captions; re-test. |
| Trend expired | Publish as a dated teardown or replace the slot, not a false “now trending” claim. |
| Screen text unreadable | Re-record at a tighter crop. |
| Caption covers the interface | Move it inside the previewed safe area. |
| Scheduler cannot set disclosure | Use a supported flow that preserves disclosure; do not omit the label. |
| Offer unavailable | Hold both offer posts; replace with a non-sales fallback after approval. |
| Five slots are late | Publish approved fallbacks or skip. Do not stack a catch-up burst. |
| Account caps scheduling | Hold the rest, keep dates chronological, do not use unauthorised automation. |
