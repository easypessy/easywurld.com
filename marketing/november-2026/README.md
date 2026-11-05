# Easywurld — November 2026 carousel pack

Ten posts, all carousels. Five LinkedIn business posts, three personal stories,
two WhatsApp/Instagram status sequences. Copy, slides and captions are done;
no video, no AI images, no Canva.

```
marketing/november-2026/
├── day-01-fri-06-nov-linkedin-callout/
│   ├── 01-hook.png … 07-cta.png     ← the post, in order
│   └── CAPTION.md                    ← LinkedIn / Instagram / TikTok / WhatsApp
├── …
├── posts.mjs                         ← every word lives here
├── build/render.mjs                  ← renders the PNGs
├── BLUEPRINT.md                      ← the template + hook formulas
└── LEGENDS.md                        ← who to steal structure from, and how
```

**Open a day folder, read the slides top to bottom, then open `CAPTION.md`.**
Every caption is split by platform, so you never have to guess which one goes
where.

## Two ways to read this pack

- **`DAILY-SYSTEM.md`** — the structure: eleven carousel slots per day, what each
  one is about, the angle bank, posting times, and why the website + copywriting
  doors lead to SMM and automation work.
- **`MASTER-PROMPT.md`** — the living brand/voice/structure prompt (also saved in
  Google Drive: *EASYWURLD — Master Content Prompt*).

## The schedule

| Day | Date | Post | Format | Folder |
|---|---|---|---|---|
| 1 | Fri 6 Nov | Your website is why they picked your competitor | LinkedIn carousel | `day-01-…-callout` |
| 2 | Mon 9 Nov | The first website I built, nobody paid me for | Personal carousel | `day-02-…-origin-story` |
| 3 | Wed 11 Nov | Your homepage has ten seconds | WhatsApp + IG status | `day-03-…-10-seconds` |
| 4 | Fri 13 Nov | I opened 20 Lagos business sites. 17 had the same problem | LinkedIn carousel | `day-04-…-audit` |
| 5 | Mon 16 Nov | "This is too simple." She didn't pay me | Personal carousel | `day-05-…-too-simple` |
| 6 | Wed 18 Nov | The ten-second test anyone can run tonight | LinkedIn carousel | `day-06-…-ten-second-test` |
| 7 | Fri 20 Nov | You don't need a bigger website | WhatsApp + IG status | `day-07-…-myth-break` |
| 8 | Mon 23 Nov | Same business. Same products. Two homepages | LinkedIn carousel | `day-08-…-before-after` |
| 9 | Wed 25 Nov | I almost quit in month three | Personal carousel | `day-09-…-pricing` |
| 10 | Fri 27 Nov | Drop your link. I'll tell you the first thing I'd fix | LinkedIn carousel | `day-10-…-reply-bait` |
| 11 | pinned | We are Easywurld. Here is exactly what that means | Easywurld intro | `day-11-easywurld-introduction` |

Post between **07:00 and 09:00 WAT** for LinkedIn (Lagos commute + early desk),
**19:00–21:00 WAT** for Instagram and WhatsApp status. Reply to comments within
the first hour — the algorithm is watching the conversation, not the clock.

## Read this before you publish

Five honest edits only you can make:

1. **Days 2, 5 and 9 are your memories.** I kept the details deliberately vague
   — no invented names, places or sums. Put the real ones in. If a story is not
   yours, swap it for one that is; the structure will still work.
2. **Day 4 quotes "20 sites, 17 with the same problem."** Change the numbers to
   what you actually looked at. People will ask for the list.
3. **Day 8's before/after** should be a real rebuild you did — or say plainly
   "a rebuild I did for a small food business" and keep the prices generic.
4. **Day 9's numbers** (₦150,000 wedding order, "lost two clients") must be
   yours. Never publish revenue you did not earn.
5. **"Message CLEAR"** is used throughout as your inbound keyword. If you'd
   rather it be "Message REVIEW" or just "message me", find-and-replace once in
   `posts.mjs` and re-render (command below).

## How to change anything

```bash
# edit the words
open marketing/november-2026/posts.mjs

# re-render everything (66 slides, ~3 seconds)
node marketing/november-2026/build/render.mjs

# re-render a single day
node marketing/november-2026/build/render.mjs day-04
```

The renderer builds each slide as SVG and rasterises it with the real brand
fonts — Fraunces for headlines, Inter for body, JetBrains Mono for labels — so
text never mangles and the branding never drifts. Fonts are OFL-licensed and
committed in `assets/fonts/`.

## Design rules baked into every slide

| Token | Hex | Where |
|---|---|---|
| Cream | `#FAE7C7` | every background |
| Deep green | `#0A4937` | headlines, footer |
| Terracotta | `#9E4E2C` | **one** accent per slide |
| Ink | `#14170F` | body copy |

Sizes: **1080×1350** for feed carousels (4:5 — the tallest crop Instagram and
LinkedIn both accept), **1080×1920** for status sequences (9:16). Slide numbers
sit in the footer so a screenshot still tells the reader where they are.

## What this pack deliberately does not do

- No AI-generated imagery. Every visual is drawn in code, so nothing can
  contradict the words or misspell the brand.
- No invented client results, testimonials, rankings or revenue.
- No video. You said it yourself: weak video is worse than a strong carousel.

If you want photography in the mix later, the honest use is your own work —
screens, real cakes, real shopfronts. Drop a photo into a day folder and I can
build a layout around it.
