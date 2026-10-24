# The number

**Conversations per 10 posts.**

Not views. Not followers. Not likes. Not "reach". One number, and it decides what you
double down on.

> You post at high volume across four platforms. Most of those posts will never earn a
> single message. A few will earn several. The whole job of this folder is to find the few
> — using numbers, not feelings — and move your effort there.

Since November the posts are organised into **shows** (`FIX THIS`, `THE STEAL`, `WE SAID NO`,
`THE HONEST AD`, `MEME`). See [`../storytelling/THE-ITCH.md`](../storytelling/THE-ITCH.md) and
[`../NOVEMBER-2026.md`](../NOVEMBER-2026.md). The scorecard now ranks shows, because "which
show do I double down on" is the question that actually changes what you do on Monday.

---

## 1. Why this number and not views

A meme can reach 180,000 people and produce 2 messages. A LinkedIn post can reach 9,000 and
produce 11 messages plus two project enquiries.

Views measure entertainment. Conversations measure intent. Revenue follows intent.

| Number | What it means | Use it for |
|---|---|---|
| **Conversations per 10 posts** | How many people actually messaged you, per unit of effort | **The decision** |
| Revenue per 10 posts | What those conversations were worth | Tie-breaker |
| Reach per post | How far a show travels | Separating an *audience engine* from dead weight |
| Conversation → sale rate | Did the person who messaged buy? | Diagnosing the offer, not the content |

**Why "per 10 posts"?** Because it normalises volume. You might post 55 times a week on TikTok
and 12 on LinkedIn. Per-post averages flatter whichever channel you post most on. Per 10 posts
compares like with like.

---

## 2. What counts as a conversation

One new person messaging you for the first time about your work, on any platform, arriving from
a specific channel and a specific show.

Not counted: an existing client, a friend, a supplier, a spam message, a public comment (that is
engagement, not a conversation).

Every conversation is one row. That is the only manual data entry in the system.

---

## 3. The code: how a conversation tells you where it came from

The site tags every WhatsApp link automatically. When someone lands on:

```
https://website-builder-portfolio.vercel.app/bundle?src=ig-honestad
```

…and then taps any WhatsApp button, the message arrives already saying:

```
Hello Easywurld, I would like the Complete Bundle (₦35,000). Keyword: BUNDLE. [ref: ig-honestad]
```

You do nothing. The code is in the message, in front of you, when you reply.

### The code format

`{channel}-{show}` — lowercase, one dash.

| Channel | Show |
|---|---|
| `ig` Instagram | `fixthis` — the teardown |
| `tt` TikTok | `steal` — one useful thing |
| `fb` Facebook | `saidno` — the honest story |
| `li` LinkedIn | `honestad` — the offer |
| `wa` WhatsApp status | `meme` — the Meme Bank |
| `site` already on the site | `bio` — profile link · `review` — free review |

Examples: `tt-fixthis`, `ig-steal`, `li-honestad`, `ig-bio`, `ig-review`.

### Where the code goes

| Place | What to do |
|---|---|
| Bio link (all platforms) | `/?src=ig-bio` (or `tt-bio`, `li-bio`) |
| Story link sticker | `/?src=ig-fixthis` |
| Pinned / first comment | `/?src=ig-honestad` |
| WhatsApp status | No link — put the code in the text and ask them to paste it |
| TikTok captions (no links) | Ask one question at first contact: *"Where did you see us?"* and write the code yourself |

> **Honest limit.** Nothing here is perfectly attributable. People watch on TikTok, search your
> name a week later, and arrive from `site`. Codes catch most of it. An imperfect number you act
> on beats a perfect number you never collect.

---

## 4. The weekly ritual — 15 minutes, Friday

1. **Open** `marketing/measurement/weekly-tracker.csv` (Excel or Google Sheets).
2. **Add one row per channel × show** you posted this week. Copy reach from each platform's
   insights; conversations come from your own WhatsApp, not from the platform.
3. **Run it:**

   ```bash
   npm run score
   ```

4. **Read the bottom three lists:** DOUBLE, AUDIENCE ENGINE, CUT.
5. **Next week is the DOUBLE list.** Nothing else gets added.

If a week is too busy, still do step 2. The sheet is worth more than the script, and the script
is worth nothing without the sheet.

---

## 5. The decision rules (agree them now, so you cannot argue with them later)

| Situation | Rule |
|---|---|
| Under **10 posts** for a show | **No decision.** "Too early." |
| Fewer than **3 eligible shows** | **No cuts.** Ranking two cells is a coin toss. |
| Top third by conversations per 10 posts | **DOUBLE**: up to +50% episodes. Remake the episode that did best. |
| Bottom third, but above-median reach and above-median conversations | **AUDIENCE ENGINE** — keep it. It is buying you strangers. |
| Bottom third, below median on both | **CUT to half.** Move the slots to the DOUBLE list. |
| One episode beats its show by 3× | **Remake it** three times before you try anything new. |

### The entertainment trap — the one rule that protects the strategy

If **entertain is most of your reach and little of your revenue, that is normal.** The
scorecard prints a warning when it happens, because it is the point at which a sensible-looking
report becomes a bad decision.

```
tier           posts     reach    revenue   conv/10
entertain        67%       91%        7%       9.1
teach            19%        6%       37%      18.8
sell             14%        3%       56%      21.7
```

Read this as: entertainment buys the audience, teaching and selling monetise it. Teach cannot
convert people who never saw you. **Cut entertainment on revenue alone and reach collapses next
month, taking teach and sell down with it.**

So judge the tiers separately:

| Tier | Judge it on |
|---|---|
| Entertain | reach, saves, follows |
| Teach | conversations |
| Sell | revenue |

---

## 6. How to read the example

`example-tracker.csv` is illustrative data, not results. Run it with `npm run score:example`.
It reads like this:

```
BY SHOW
                    POSTS  VIEWS/P  CONV  CONV/10   ₦/10 POSTS   VERDICT
honestad               12     2708    26     21.7   ₦566,667   DOUBLE
steal                  16     3600    30     18.8   ₦281,250   DOUBLE
fixthis                24    10188    30     12.5    ₦35,417   KEEP
saidno                 12    22900    15     12.5         ₦0   CUT → ENGINE
meme                   20    18400     6      3.0         ₦0   CUT
```

- **THE HONEST AD and THE STEAL — DOUBLE.** They produce conversations *and* money.
- **FIX THIS — KEEP.** The workhorse: 30 conversations across the month, modest revenue,
  and it proves competence without claiming it.
- **WE SAID NO — an audience engine, not a failure.** 22,900 views per post, no revenue. It is
  buying reach for the other shows. Cutting it is the mistake the tool explicitly guards against.
- **MEME — cut to half.** 18,400 views per post and 3 conversations per 10 posts. It is very good
  at the wrong job. Keep some, because personality is the reason people follow a studio, but stop
  giving it a fifth of your slots.

Notice what the ranking did **not** do: it did not reward the biggest numbers. TikTok has four
times the views of everything else and the worst revenue per post.

---

## 7. What the tracker columns mean

| Column | Meaning | Where it comes from |
|---|---|---|
| `week` | Monday of the week, `YYYY-MM-DD` | You |
| `channel` | `ig`, `tt`, `fb`, `li`, `wa`, `site` | You |
| `format` | `fixthis`, `steal`, `saidno`, `honestad`, `meme` | You |
| `tier` | `entertain`, `teach`, `sell` | You — one job per post |
| `posts` | Posts published in that cell this week | Platform + your count |
| `views` | Total reach in that cell (best effort) | Platform insights |
| `conversations` | New people who messaged, tagged with that code | **WhatsApp — your count** |
| `reviews` | Free reviews booked from that cell | You |
| `offer_sales` | Offers or bundles sold | You |
| `service_leads` | Conversations that became a project discussion | You |
| `revenue_ngn` | Actual money received | Bank / Paystack |
| `notes` | One line: what worked, what to try | You |

Only `conversations` and `revenue_ngn` drive decisions. The rest explain them.

**Tier mapping** — `format` → `tier`:

| Show | Tier |
|---|---|
| `fixthis`, `saidno`, `meme`, `hottake` | `entertain` |
| `steal`, `trust`, `review` | `teach` |
| `honestad`, `offer` | `sell` |

---

## 8. The second number (once you have volume)

**Conversation → sale rate.** If conversations are healthy and sales are not, the problem is the
offer or the price, not the content. Do not answer a weak offer with more posts.

| Conversations per week | Sales | What it means |
|---|---|---|
| 20 | 2 (10%) | Content problem — the wrong people are arriving |
| 20 | 8 (40%) | Healthy |
| 20 | 1 (5%) | Offer or price problem — stop posting more, fix the offer |

---

## 9. What this system does not do

- It does not fetch numbers from the platforms. Meta, TikTok and LinkedIn do not share
  conversation data, and their view counts are not comparable between platforms.
- It does not tell you *why* an episode worked. Read your best five and work that out by hand —
  that is where next month's ideas come from.
- It does not reward consistency. Consistency keeps the account alive; this sheet decides where
  the consistent effort goes.
- It cannot tell you a show is bad. It tells you a show is not *working yet*, which is a
  different sentence and a different decision.
