# The number

**Conversations per 10 posts.**

Not views. Not followers. Not likes. Not "reach". One number, and it decides what you
double down on.

> You post at high volume across four platforms. Most of those posts will never earn a
> single message. A few will earn several. The whole job of this folder is to find the few
> — using numbers, not feelings — and move your effort there.

---

## 1. Why this number and not views

Your own example data shows the problem. A meme on TikTok reached **180,000 people** and
produced **2 conversations**. A LinkedIn offer post reached **9,000** and produced **11**,
plus two project enquiries worth more than the memes ever will.

Views measure entertainment. Conversations measure intent. Revenue follows intent.

So:

| Number | What it means | Use it for |
|---|---|---|
| **Conversations per 10 posts** | How many people actually messaged you, per unit of effort | **The decision** |
| Revenue per 10 posts | What those conversations were worth | Tie-breaker |
| Conversation → sale rate | Did the person who messaged buy? | Diagnosing the offer, not the content |
| Views per post | Diagnostic only | Explaining *why* a cell works |

**Why "per 10 posts" and not "per post"?** Because it normalises volume. You might post 55
times a week on TikTok and 12 on LinkedIn. Per-post averages would flatter the channel you
happen to post most on. Per 10 posts compares like with like.

---

## 2. What counts as a conversation

One new person messaging you for the first time about your work, on any platform, arriving
from a specific channel and type of post.

Not counted: an existing client, a friend, a supplier, a spam message, a reply on a public
comment thread (that is engagement, not a conversation).

Every conversation is one row. That is the only manual data entry in the system.

---

## 3. The code: how a conversation tells you where it came from

The site now tags every WhatsApp link automatically. When someone lands on:

```
https://website-builder-portfolio.vercel.app/offers?src=ig-offer
```

…and then taps any WhatsApp button, the message arrives already saying:

```
Hello Easywurld, I would like the Clear Homepage Blueprint (₦5,000). Keyword: CLEAR.
[ref: ig-offer]
```

You do nothing. The code is in the message, in front of you, when you reply.

### The code format

`{channel}-{pillar}` — two lowercase words, one dash.

| Channel | Pillar |
|---|---|
| `ig` Instagram | `teaching` — how-to, explainer, checklist |
| `tt` TikTok | `offer` — the pack or bundle in focus |
| `fb` Facebook | `trust` — honest answers, limits, "we told them no" |
| `li` LinkedIn | `story` — a build, a decision, a client moment |
| `wa` WhatsApp status | `meme` — the 37 in the Meme Bank |
| `site` — already on the site | `hottake` — a point of view |

Examples: `ig-teaching`, `tt-meme`, `li-offer`, `wa-offer`.

Need finer detail? Add a suffix: `ig-offer-clear` for the homepage blueprint specifically.
Do not go deeper than that — you will not maintain it.

### Where the code goes

| Place | What to do |
|---|---|
| Instagram / TikTok / LinkedIn bio link | Point at `/?src=ig-bio` (or `tt-bio`, `li-bio`) |
| Story link sticker | `/?src=ig-story` |
| Pinned comment / first comment | `/?src=ig-offer` and say "link in bio" |
| WhatsApp status | No link. Put the code in the text: end with `(ref: wa-offer)` and ask them to paste it |
| Facebook post | Same as Instagram |

**When there is no link at all** — TikTok captions cannot carry one — fall back to one
question at the moment of contact: *"Where did you see us?"* Then write the code yourself.
That is ten seconds and it is 90% as accurate.

> **Honest limit.** Nothing here is perfectly attributable. People read on TikTok, search
> your name a week later, and arrive from `site`. Codes catch most of it. Do not let perfect
> attribution stop you from making a decision with good-enough data — an imperfect number
> you act on beats a perfect number you never collect.

---

## 4. The weekly ritual — 15 minutes, Friday

1. **Open the tracker:** `marketing/measurement/weekly-tracker.csv` (in Excel or Google Sheets).
2. **Add one row per channel × pillar you posted in this week.** Copy the counts from each
   platform's own insights (reach → views; but conversations come from your WhatsApp, not
   the platform).
3. **Run the scorecard:**

   ```bash
   npm run score
   ```

4. **Read the three lists at the bottom:** DOUBLE, CUT, TOO EARLY.
5. **Next week's plan is the DOUBLE list.** Nothing else gets added.

That is it. If a week is too busy, still do step 2 — the sheet is worth more than the
script, and the script is worth nothing without the sheet.

---

## 5. The decision rules (agree them now, so you cannot argue with them later)

| Situation | Rule |
|---|---|
| Fewer than **30 posts** in a cell | **No decision.** "Too early." Keep posting. |
| Fewer than **3 eligible cells** | **No cuts.** There is nothing to compare against. |
| Cell is in the **top third** by conversations per 10 posts | **Double**: up to +50% posts next week. Remake the post that did best — do not invent a new topic. |
| Cell is in the **bottom third**, with revenue near zero | **Cut to half.** Move the slots to the top third. Do not delete the channel. |
| Middle third | **Keep.** Leave it alone. |
| One post inside a cell beats that cell's average by 3× | **Remake it** as a variation three times before you try anything new. |

Two rules that protect you from yourself:

- **Never cut on one week.** Two weeks minimum, and only after the 30-post floor.
- **Never double because a post went viral.** Double because *conversations* arrived. If
  views rose and conversations did not, that cell goes on the cut list, not the double list.

---

## 6. How to read the example

`example-tracker.csv` is illustrative data, not results. Run it to see the output:

```bash
npm run score:example
```

It reads like this:

- `linkedin · offer` — 8.3 conversations per 10 posts on tiny reach. **Best cell on the
  board** and still marked TOO EARLY at 24 posts. It will be the first thing to double once
  it crosses 30.
- `instagram · offer` and `facebook · offer` — **DOUBLE**. Offer posts on those two
  channels are where the money is.
- `tiktok · meme` — **CUT**. 4,388 views per post and 0.6 conversations per 10. It is very
  good at the wrong job.
- `instagram · teaching` — **KEEP**. The workhorse: steady conversations and revenue.

Notice what the ranking did **not** do: it did not reward the biggest numbers. TikTok has
the most views by a factor of four and is the worst channel by the only metric that pays.

---

## 7. What the tracker columns mean

| Column | Meaning | Where it comes from |
|---|---|---|
| `week` | Monday of the week, `YYYY-MM-DD` | You |
| `channel` | `ig`, `tt`, `fb`, `li`, `wa`, `site` | You |
| `pillar` | `teaching`, `offer`, `trust`, `story`, `meme`, `hottake` | You |
| `posts` | Posts published in that cell this week | Platform + your own count |
| `views` | Total views/reach in that cell (best effort) | Platform insights |
| `conversations` | New people who messaged, tagged with that code | **WhatsApp — your count** |
| `reviews` | Free website reviews booked from that cell | You |
| `offer_sales` | Offers or bundles sold to those conversations | You |
| `service_leads` | Conversations that became a project discussion | You |
| `revenue_ngn` | Actual money received, in naira | Bank / Paystack |
| `notes` | One line: what worked or what to try | You |

Only `conversations` and `revenue_ngn` are decisions. The rest are explanation.

---

## 8. The second number to watch (once you have volume)

**Conversation → sale rate.** If conversations are healthy and sales are not, the problem
is the offer or the price, not the content. Do not answer a weak offer with more posts.

| Conversations per week | Sales | What it means |
|---|---|---|
| 20 | 2 (10%) | Content problem — the wrong people are arriving |
| 20 | 8 (40%) | Healthy |
| 20 | 1 (5%) | Offer or price problem — stop posting more, fix the offer |

---

## 9. What this system does not do

- It does not fetch numbers from the platforms. Meta, TikTok and LinkedIn do not share
  conversation data, and their view counts are not comparable between platforms.
- It does not tell you *why* a post worked. Read your best 5 posts and work that out by
  hand — that is where the next month's ideas come from.
- It does not reward consistency. Consistency keeps the account alive; this sheet decides
  where the consistent effort goes.
