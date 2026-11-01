# The psychology layer

Every post in this calendar carries exactly one persuasion principle. Not as a trick — as a discipline. If the principle only works when we exaggerate, we drop the principle and keep the honest version.

**Rule:** one principle per post, named in the brief and in the CSV (`Psychology move`). The copy must still be useful if the reader never buys anything.

---

## 1. The twelve principles

| Key | Principle | What it does | Where it appears | Guardrail |
|---|---|---|---|---|
| `cognitive-ease` | **Cognitive ease** — *Kahneman, Thinking, Fast and Slow (2011)* | Easy-to-read ideas feel truer and safer | Short sentences, one idea per slide, wide spacing | Never use simplicity to hide a limitation |
| `loss-aversion` | **Loss aversion** — *Kahneman & Tversky, Prospect Theory (1979)* | People move faster to stop a loss than to chase a gain | "This is what the unanswered message costs you" | No fake countdowns or invented scarcity |
| `curiosity-gap` | **Curiosity gap** — *Loewenstein (1994)* | A specific open question pulls attention forward | Myth claims, copy breakdowns, Operator cold lines | Close the loop in the same post |
| `specificity` | **Specificity** — *Heath & Heath, Made to Stick (2007)* | Numbers, names and dates read as evidence | Niche plans, dated trend teardowns | Only numbers we can defend |
| `social-proof` | **Honest social proof** — *Cialdini, Influence (1984)* | Behaviour follows behaviour | Process posts, questions owners ask, labelled samples | No invented clients, testimonials or results |
| `reciprocity` | **Reciprocity** — *Cialdini (1984)* | Give the structure before asking | Free checklists, workflows, slide copy | The post must be useful alone |
| `authority-restraint` | **Authority through restraint** — *Cialdini (1984)* | Calm, sourced, unhurried statements read as authority | The Operator slot, myth verdicts | No claimed credentials or awards |
| `anchoring` | **Anchoring** — *Tversky & Kahneman (1974)* | The first number sets the frame | Offer carousels: contents → price → boundary | No fake "was ₦X" pricing |
| `peak-end` | **Peak-end rule** — *Kahneman (1999)* | People remember the strongest and the last moment | 22:00 Operator close, meme punchlines | The last line must be true and useful |
| `mere-exposure` | **Mere exposure** — *Zajonc (1968)* | Familiar shapes become liked shapes | `Meet Easywurld` repetition, fixed frames, fixed voice | Repeat the format, not the sentence |
| `identity` | **Identity and in-group** — *Berger, Contagious (2013)* | People share what says something about them | Scene-led memes | Never punch down at customers or staff |
| `objection-relief` | **Objection relief** — *Cialdini (1984); Rackham, SPIN Selling (1988)* | Name the doubt before the buyer does | Offer Spotlight B | Answer honestly, including "no" |

## 2. Series → principle map

| Series | Primary | Secondary |
|---|---|---|
| S1 If I ran this account | Specificity | Cognitive ease |
| S2 Marketing Myth Court | Curiosity gap | Loss aversion |
| S3 Trend Desk | Specificity | Authority through restraint |
| S4 AI Automation Build | Reciprocity | Cognitive ease |
| S5 Meme: owner life | Identity | Peak-end |
| S6 Offer Spotlight A | Anchoring | Reciprocity |
| S7 Steal This Copy Move | Curiosity gap | Specificity |
| S8 Meme: marketing / AI / clients | Identity | Loss aversion |
| S9 Offer Spotlight B | Objection relief | Cognitive ease |
| S10 Meet Easywurld | Mere exposure | Honest social proof |
| S11 One Last Thought (Operator) | Authority through restraint | Peak-end |
| Stories A (poll) | Commitment — *Cialdini (1984)* | Cognitive ease |
| Stories B (behind the desk) | Mere exposure | Curiosity gap |
| LinkedIn pulls | Specificity | Authority through restraint |

The builder alternates primary and secondary by day number, so the month does not lean on one lever.

## 3. The five-line skeleton every post follows

1. **Interrupt** — a flat, specific first line that stops the scroll (curiosity gap or loss aversion).
2. **Name the real problem** — in the reader's words, not ours.
3. **Give the receipt** — one checkable detail: a dated source, a pack contents list, a step order.
4. **State the limit** — what this does not do (objection relief, authority through restraint).
5. **One ask** — the smallest next step.

Posts that cannot fill line 3 do not get published. That rule kills most inflated content before it starts.

## 4. Applied examples

**Myth Court — "posting every day guarantees growth"**
- Interrupt: *"Posting every day guarantees growth. No."*
- Problem: frequency is being used to avoid making a decision.
- Receipt: one week of series posts vs a previous week, measured on saves and enquiries.
- Limit: this does not fix an unclear offer.
- Ask: save the test.

**Offer Spotlight A — PLAYBOOK ₦5,000**
- Interrupt: *"The price is the easy part. The contents are the argument."*
- Problem: buyers cannot see what they are paying for.
- Receipt: the four named deliverables, the exact price, the DIY boundary.
- Limit: not custom work, no guaranteed results.
- Ask: message the keyword.

**Operator — 22:00**
- Interrupt: one flat, surprising sentence.
- Turn: the real mechanism.
- Close: a line worth repeating.
- Silence on the last frame.

## 5. What is banned

- Manufactured urgency, fake scarcity, "only 2 slots left".
- Invented testimonials, revenue, follower counts or client names.
- Borrowed lifestyle photos implying wealth we do not have.
- Fear framing about customers or competitors.
- Dark patterns in the CTA (pre-ticked boxes, fake chat screenshots).
- Any principle used to make a false claim land harder.

## 6. Measurement tells us whether the psychology worked

After seven days, compare per series: saves (reciprocity, specificity), shares (identity), sticker taps (commitment), keyword enquiries (anchoring, objection relief), comment quality (curiosity gap). Change one lever a week. A principle is only validated by behaviour, not by how clever the line felt.

> Sources are books and papers, cited by author and year. No framework here depends on a claim we cannot point to.

## 7. How this file drives the build

This is not a reference document that sits beside the calendar. It is the input that shapes every post.

| Field | Written by | Where you see it |
|---|---|---|
| `psychology.principles[]` | this file | `marketing/series-plan.json` → the twelve principles, their source and their guardrail |
| `psychology.seriesMap` | this file | the builder assigns a primary/secondary principle per series, alternating by day so the month does not lean on one lever |
| `psych.name`, `psych.use`, `psych.guard` | generated | every post in `content-plan.json`, every brief in `marketing/briefs/`, the `Psychology move` column in the CSV, the post detail in the studio |
| `Where it shows up here` | generated | the line in each brief that names the exact sentence or structural choice carrying the principle |

If you edit a principle or a source here, change it in `series-plan.json → psychology` too, then run `npm run content:build`. Do not edit the generated files.

## 8. Re-balancing after week one

The month is tagged, not locked. After seven days:

1. Export `marketing/MEASUREMENT.csv` with real numbers.
2. Score each series on **saves** (reciprocity, specificity), **shares** (identity), **sticker taps** (commitment), **keyword enquiries** (anchoring, objection relief) and **comment quality** (curiosity gap).
3. Change **one lever per series per week**: the hook, the length, or the ask. Never three at once, or you learn nothing.
4. If a principle is consistently underperforming on a series, swap its primary to the secondary and run the next week as a test.
5. Keep the 22:00 Operator slot for a full three weeks before judging it. The peak-end effect needs repetition to show up in follows.

> A principle is validated by behaviour, not by how clever the line felt when you wrote it.
