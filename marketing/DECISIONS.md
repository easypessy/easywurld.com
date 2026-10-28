# The record: what we started with, what we changed, and why

This file exists because you asked for one, and because it is the right thing to have. Six weeks
from now you will not remember why the calendar has 330 posts and the rhythm is three, and you
will be tempted to rebuild something that already works.

Everything below is dated, honest about what was decided and by whom, and marks what was
**superseded** so you never act on an old version by mistake.

> **How to read it:** §1 is where we began. §2 is every change in order, each with its reason.
> §3 is what we tried and threw away. §4 is what we still do not know. §5 is the current state —
> if you only read one section, read §5.

---

## 1. Where we started (before any of this work)

Written 24 October 2026, in `marketing/EASYWURLD-PLAN.md`. These were the real starting
conditions, not a straw man:

| What existed | The number |
|---|---|
| Concept/sample projects in the portfolio | **49** |
| Finished digital products to sell | **9**, at ₦5,000 each |
| Posts already written (various plans) | **~1,140** |
| A 30-day calendar at 4 posts/day | **120 posts**, 08 Oct – 06 Nov |
| A shop the visitor could actually reach | **Weak** — offers invisible from the homepage, no bundle page, no pay slots |
| A way to measure anything | **None** |
| A stated audience | **None** |
| Revenue | **₦0** |

And the diagnosis in that file, in one line: **"You built the factory and forgot the shop."**

The supply side was genuinely finished and good. The problem was that an offer is not a business.
A business is a loop — **attention → trust → a way to pay → delivery** — and #1 and #2 were empty.

### The original plan (now superseded)

1. Weeks 1–2: fix the shop.
2. Weeks 3–6: get attention, measure it, 20 free reviews for before/after proof.
3. Weeks 7–12: sell services, publish three priced packages.

That was a **90-day plan with no revenue in it before week 7.** That is the single biggest thing
that changed, and it changed because of you, not because of me. You said: *"I need money in 30
days — at least enough to get me data."*

### The original content plan (now superseded)

`marketing/calendar/30-day-calendar.md` — **4 posts/day, 120 posts, every one Instagram-ready**,
cross-posted to LinkedIn and TikTok. Two carousels and two videos a day, all educational or
point-of-view.

It was a **reasonable plan for a page that already had an audience.** It had three faults we only
saw once we looked properly:

1. **It was all teaching.** A page of lessons from a stranger nobody has heard of is a lecture
   hall with no students. No entertainment tier at all.
2. **It included LinkedIn.** Wrong audience for a Lagos SME offer, and you excluded it.
3. **It had no measurement beyond eyeballing likes.** No way to know what to do more of.

---

## 2. Every change, in the order we made it

### 2.1 — A shop you can actually buy from
**Commit** `aa10897` · **24 Oct**

- **Changed:** added a bundle page at `/bundle`, an offers block on the homepage, pay slots in
  `client/src/data/payment.ts`, and a measurement system (`marketing/measurement/`).
- **Why:** nobody could find the offers from the homepage, and the bundle did not exist as a page
  at all. You cannot sell a thing a visitor cannot reach.
- **Note:** `PAY_LINKS` was left **deliberately empty**. In Nigeria the till is WhatsApp and a
  transfer; a Paystack page is a nice-to-have, not a blocker. **Do not "fix" this** — filling in
  a dead link is worse than having none.
- **Status:** live.

### 2.2 — Measurement that fits the business
**Commit** `aa10897` · **24 Oct**

- **Changed:** one number became the scorecard — **conversations per 10 posts** — tracked in
  `marketing/measurement/weekly-tracker.csv` and scored with `npm run score`.
- **Why:** likes do not pay rent. A *conversation* is the only social-media event that can become
  ₦5,000, so the tracker counts conversations, not applause. You asked for numbers you can act on.
- **Status:** live, but **empty** — nobody has filled a row in yet.

### 2.3 — The funnel order changed: entertain first
**Commit** `d3bd852` · **24 Oct** · **your decision, my agreement**

- **Changed:** from "every post teaches" to three tiers — **Entertain → Teach → Sell**, with a
  mix of roughly 2:1:1.
- **Why:** your own sentence, which is now the governing rule of the whole account:

  > **"We entertain everyone because they're not on social to be sold to, then we teach the
  > interested and sell the committed."**

  This is correct, and it is the correction to everything that came before it. A stranger owes you
  nothing. You buy their attention with something funny or true, you earn trust by being useful,
  and only then does a price make sense.
- **One word I added:** not "entertain everyone" but **"entertain everyone you could sell to."**
  A meme that pleases people who will never own a business is a hobby, not marketing.
- **Status:** live. It is the spine of the month.

### 2.4 — Volume: 120 posts → 330 ideas → 990 pieces
**Commit** `5b7f1af` · **25 Oct**

- **Changed:** the month went from **4 posts/day (120)** to **11 ideas/day (330 core posts,
  990 scheduled pieces)**, starting Sunday 1 November (not 8 October), with three platform
  versions written for every idea.
- **Why:**
  1. You said, repeatedly and clearly, **do not reduce the volume.** You did not want a "safe"
     small plan; you wanted a month so complete that the only remaining job is to press post.
  2. A feed needs material to survive a bad week. Running out is the most common way a plan dies.
  3. Three platforms means three different jobs — TikTok for reach, Instagram for saves,
     Facebook for comments — so one idea has to be written three times, not copy-pasted.
- **What it cost:** the build took days of work and produced ~672 KB of HTML. That is real. It is
  also the last content work you should have to do in 2026.
- **Status:** live, but **the daily rhythm is no longer 11.** See 2.11.

### 2.5 — Hooks cut to 12 words or fewer
**Commit** `3560513` · **25 Oct**

- **Changed:** every one of the 330 TikTok hooks was rewritten to **6–12 words** (median 11).
  Zero hooks are over 12 words now.
- **Why:** 12 words is roughly **2–2.5 seconds of speech**, which is about as long as you get
  before a thumb moves. A hook of 25 words is a first paragraph, and nobody reads a first
  paragraph.
- **How it is enforced:** `npm run audit:november` fails the build if a hook goes over 12 words,
  or if openings start repeating.
- **Status:** live, and guarded by a check. **Do not loosen this.**

### 2.6 — Captions fixed: the Instagram body field was silently dead
**Commit** `cd2e5d6` · **25 Oct**

- **Changed:** every Instagram `body` was folded into `instagram.cap`, and the generator was
  changed so a `body` key can never be written again without being rendered.
- **Why:** the schema renders `instagram.cap`. A `body` key on Instagram was **silently ignored** —
  the post would have gone out with a caption of `undefined`, and nobody would have noticed until
  the month was half-posted. This was a genuine bug, not a style choice.
- **The permanent rule:** **Facebook is `{fmt, body}`. Instagram is `instagram.cap`.** Never mix
  them.
- **Status:** live.

### 2.7 — Memes, made honest
**Commit** `fa0ce0b` · **26 Oct**

- **Changed:** 30 memes written into `content/memes.json` (10 chat / 13 X-replies / 7 Reddit
  threads), each paired to a day, generated into `MEME_BANK.md`, plus three rules in the docs.
- **Why:** memes are the entertainment tier's cheapest engine, but they are also the easiest place
  to accidentally invent a client, a result, or a real conversation that never happened. The three
  rules exist so that never occurs:
  1. **Never post a chat meme as if it happened.** No real names, no real dates.
  2. **Never use a meme as proof, or in a sell post.** A joke in an ad is an invented testimonial.
  3. **Never punch down.** The business is the punchline, or nobody is.
- **Status:** live.

### 2.8 — The mascot question, answered — and the answer was *not* a mascot
**Commit** `1a663fa` · **27 Oct**

- **You asked:** should the account have a face? You were experimenting with memes as a mascot.
- **Changed:** no mascot. The carousels changed **shape** instead, and the memes became three
  recurring **formats** rather than one recurring character.
- **Why:** the carousels were not failing because they were faceless. They were failing because
  they were **documents** — five slides of sentences on a plain background with no reason to swipe.
  Three options were assessed:

  | Option | Verdict |
  |---|---|
  | A. An AI-generated "founder" presented as a real human | **Disqualifying.** One lie makes every real number in the account suspect. Never. |
  | B. A labelled AI narrator | Honest, but it kills the mystery you want |
  | C. Recurring formats — The Chat / The Replies / The Thread | **Chosen.** No face to maintain, nothing claimed, and "whose chat is this?" is a stronger hook than "who is this cartoon?" |

- **The new carousel rule:** slide 1 is a **screenshot or a chat, never a title.** The turn lands
  by slide 2–3. The last slide is an **action**, not a thank-you.
- **Status:** live, and **still being tested** — see 2.14.

### 2.9 — A named position
**Commit** `08c418a` · **28 Oct**

- **Changed:** from "Easywurld — an independent digital studio, strategy, web design, SEO, social
  media management, copywriting…" to:

  > **"Easywurld reads Lagos business pages and says, in public, what is costing them customers.
  > Then it fixes it for ₦5,000."**

  Bio: *"I read your page and tell you the truth. ₦5,000 to fix it."*

- **Why:** the old description listed nine services, which is nine ways for a stranger to forget
  you. The new one is a **diagnosis**, and diagnosis is the only thing you can demonstrate today
  with zero clients: a page either has the problem or it does not, and the reader can check.
  It is also cheap to prove, hard to copy, and it ends exactly where your product already is.
- **What we deliberately are not:** not a designer (sells taste), not a marketer (sells reach),
  not an agency (agencies hide).
- **Status:** live, and **not yet used anywhere** — the bio is still yours to change.

### 2.10 — The four gaps
**Commit** `1a663fa` · **27 Oct**

- **Changed:** the account's subject was narrowed to one sentence with four parts:

  > **A small business loses money in the gaps around the sale, not in the product.**

  1. **Say what you sell** (a stranger cannot tell in four seconds)
  2. **Be findable** (they search, you are not there)
  3. **Answer and follow up** (they messaged, you replied late or never)
  4. **Price honestly** (the number arrives with no reason and no date)

- **Why:** "marketing tips" is a bottomless subject, and bottomless subjects produce a page that
  teaches nothing. Four gaps can be covered honestly for a month and still leave room next month.
  **Nothing else is taught** — not branding, not logos, not mindset, not ads.
- **Status:** live.

### 2.11 — The daily rhythm: 11 posts → 3 posts, and 20 messages
**Commit** `6729ce3` · **28 Oct**

- **Changed:** the *build* stays at 330. The *rhythm* becomes **3 posts a day** (one teardown, one
  checklist, one honest ad) plus **20 hand-sent messages**.
- **Why:** you have a cash problem this month, and 11 posts a day does not touch it. Three posts a
  day for 30 days is 90 posts — a real account. Eleven a day for four days and then nothing is a
  dead one. **The 330 posts are not wasted:** they are 11 weeks of buffer at this rhythm, and the
  extra slots are there for any day you have energy.
- **This respects your standing instruction:** you told me not to drop to 1–2 posts a day. Three
  is above that floor, and the reason for the reduction is stated openly: the messages come first
  because they are what pays for data.
- **Status:** live.

### 2.12 — A cash track, not just a content track
**Commit** `08c418a` · **28 Oct**

- **Changed:** added **Track A — cash** (20 DMs/day → free review → ₦5,000) alongside
  **Track B — awareness** (posts → followers). Both fed by one raw material: a real page with a
  real problem.
- **Why:** awareness does not pay inside 30 days. It pays in 60–90. If money has to arrive this
  month it comes from conversations you start by hand, because that is the only number you
  control.
- **The insight that makes it cheap:** finding a broken page **is** making a teardown post. It is
  not two jobs. It is one job done twice.
- **Status:** live. Scripts in `marketing/outreach/MESSAGES.txt`, list in `outreach/targets.csv`.

### 2.13 — The target moved: ₦30,000 → ₦50,000
**28 Oct** · **because of you**

- **Changed:** the month's target became **₦50,000**, not ₦30,000.
- **Why:** you said data alone costs **at least ₦20,000 a month**, and there is transport, and
  there is power for the laptop you schedule on. So ₦30,000 was never a target — it was a floor
  that still leaves you broke. ₦50,000 is the real number: one bundle (₦35,000) plus three packs,
  or ten packs.
- **And the honest part:** the conservative column of the maths still only reaches **₦10,000**.
  The plan can miss. You should know that now, not on 29 November.
- **Status:** live, and **unproven** — every number in it is an assumption until you have sent
  100 messages.

### 2.14 — One page instead of five documents
**Commits** `6729ce3`, `f277d0e` · **28 Oct**

- **Changed:** added `marketing/positioning/DO-THIS-NOW.md` (the only page you need this week) and
  `launch-content/november/ANATOMY.md` (one real post taken apart — hook, slides, captions, memes).
- **Why:** you said you were confused and I had handed you five documents. That is a failure of
  mine, not of yours. A plan nobody can act on is not a plan.

---

## 3. What we tried and rejected

Keeping these matters as much as the changes — otherwise someone re-proposes them in March.

| Rejected | Why |
|---|---|
| **An AI-generated founder presented as a real human** | One lie, and every real number in the account is suspect. Also breaks the rule the whole build runs on: nothing invented. |
| **A drawn mascot** | Needs one face, one voice, one backstory, forever. Three formats do the same job for free and claim nothing. |
| **Buying followers / engagement pods / follow-for-follow** | They teach the algorithm the wrong audience. Actively negative, not neutral. |
| **LinkedIn** | Wrong audience for a Lagos SME offer. **You excluded it; it stays excluded.** |
| **Rewriting all 330 posts again** | They pass every check: 0 hooks over 12 words, 0 pace outliers, 0 repeated openings. Rewriting is the most popular way to lose a month. |
| **"Best time to post"** | Worth about 2%. The calendar already spreads the times. |
| **A new TikTok page** | A young account with low views is not a damaged account. Reposition the existing one before starting over. |
| **Waiting for a Paystack link before selling** | The till is WhatsApp and a transfer. A payment page is a nice-to-have; the conversation is the blocker. |
| **A 90-day plan with no revenue before week 7** | Superseded by your cash requirement. It was a reasonable plan for someone with savings. You do not have savings. |
| **Dropping to 1–2 posts a day** | You reversed this, correctly. Three is the floor. |

---

## 4. What we still do not know

This section is the most useful one, because it is the list of things that could still break.

1. **Whether you have posted anything at all.** Nothing in the repo can tell me. Every plan assumes
   **zero audience**, which is the safe assumption.
2. **Whether the nine packs exist as written files.** `launch-content/README.md` says they live in
   a **private `packkit` repo** that cannot be opened from here. Only `Free_Sample_5_Chat_Scripts.pdf`
   is on disk. **If they do not exist, sell a ₦5,000 page review instead** — same price, real today.
3. **Your TikTok username.** Asked twice; not yet given. Until then I cannot look at the existing
   page's positioning, and neither can anyone else.
4. **Your real DM reply rate.** Every figure in the money maths is an assumption. You will have
   your own number after 100 messages, and it should replace mine immediately.
5. **Whether ₦5,000 is the right price for a cold stranger.** It is right for someone who has
   watched you for a week. For a stranger it may be too high to be an impulse and too low to signal
   expertise. That is what week 1 tests.
6. **Which pillar your actual buyers care about.** Answerable only after the first sales — and it
   decides December's offer.
7. **Which meme format travels for you.** The Chat / The Replies / The Thread test runs two weeks
   and is judged on **shares only**. No conclusion before then.

**Every TikTok link remains unopenable from this environment (403).** No TikTok video has been
watched for this work, and no claim here is based on one. The creator data referenced came from
search indexes, and a growth account with 50 likes is evidence of a hook style, never of a method.

---

## 5. Current state — 28 October 2026

**The build**

| Thing | State |
|---|---|
| 330 core posts / 990 pieces, 1–30 Nov | **Complete**, validator green |
| Hooks ≤12 words | **Complete**, 0 failures |
| 30 meme cards | **Complete**, `MEME_CARDS.html` |
| Four gaps, eight shows, three carousel shapes | **Complete**, `WHAT-WE-TEACH.md` + `ANATOMY.md` |
| 9 packs at ₦5,000, bundle ₦35,000 | **Unverified on disk** — see §4.2 |
| Measurement tracker | **Empty** — waiting on you |

**The plan**

| Thing | State |
|---|---|
| Position | Named, **not yet on the profile** |
| Cash track | Scripts and a 60-name sheet written, **zero messages sent** |
| Awareness track | 3 posts/day agreed, **zero posts published** |
| Target | **₦50,000** by 30 November |
| Honest risk | Conservative case is ₦10,000. The plan can miss. |

**The next four actions, in order**

1. Check the packs exist. If not, switch the offer to a ₦5,000 page review.
2. Put the bio up. Take one clear photo of your face.
3. Save the three messages into WhatsApp Quick Replies.
4. Write 20 businesses into `outreach/targets.csv`. Send the first ten tomorrow morning.

Everything else — all 330 posts, all 30 memes, every document — can wait until those four are done.

---

*This record is maintained by hand. When a decision changes, add an entry at the bottom of §2
with the date and the reason — including when the reason is "we were wrong".*
