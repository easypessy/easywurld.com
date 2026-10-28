# 05 — Planning a month

*The recipe. Idea → 30 days, without repeating yourself and without sitting there waiting for
inspiration.*

November was built by hand, day by day, and it took days of work. This is how December (and every
month after) gets built in **one sitting of about three hours**, using the library instead of mood.

---

## 1. The five things every post must have

If a planned post is missing any of these, it is not planned — it is a note.

| # | Input | Where it comes from | Why it must be decided first |
|---|---|---|---|
| 1 | **Pillar** — 1 say what you sell, 2 be findable, 3 answer/follow up, 4 price honestly | `november/WHAT-WE-TEACH.md` | Stops the month becoming 30 posts about price |
| 2 | **Tier** — entertain, teach, sell | 2:1:1 mix | Decides the job of the post, before a word is written |
| 3 | **Show** — FIX THIS, ONE THING, STEAL, HONEST AD, TRUE STORY, STREET, WE SAID NO | same file | Keeps the account feeling like a channel |
| 4 | **Structure** — The Turn, The Witness, The Receipt, The Confession | [`03-STORYTELLING.md`](./03-STORYTELLING.md) | Decides the shape of the 30 seconds |
| 5 | **Hook + interrupt** | [`04-HOOKS.md`](./04-HOOKS.md), [`01-PATTERN-INTERRUPTION.md`](./01-PATTERN-INTERRUPTION.md) | The first 2 seconds, and the frame that earns them |

**One sentence to remember:** *pillar decides what it is about, tier decides what it is for, show
decides what it looks like, structure decides the order, the hook decides whether anyone sees it.*

---

## 2. The five passes

Do them in this order. Do not write a caption until pass 4.

### Pass 1 — the mix (15 minutes)

Block the month by pillar, so no two consecutive weeks teach the same thing.

```
Week 1:  P1 (say what you sell)      + one P3
Week 2:  P3 (answer and follow up)   + one P4
Week 3:  P2 (be findable)            + one P4
Week 4:  P4 (price honestly)         + recap
```

Then within each week: **2 entertain : 1 teach : 1 sell**, roughly. A month of 30 days at 3 posts a
day is 90 posts — 60 entertain, 23 teach, 7 sell.

### Pass 2 — the shows (20 minutes)

Rotate the shows so the same one never appears twice in a row:

```
Day 1  FIX THIS      Day 4  TRUE STORY
Day 2  ONE THING     Day 5  STEAL
Day 3  STEAL         Day 6  HONEST AD   (once a week)
```

**The rule that prevents boredom:** the account can repeat a *format* forever, but never a *topic*
twice in a week.

### Pass 3 — the structures (30 minutes)

Match the structure to the tier. This is the step everyone skips, and it is why most months feel
like 30 versions of the same post.

| Tier | Default structure | Never |
|---|---|---|
| **Entertain** | **The Turn** (kishōtenketsu) | Do not add a lesson at the end. The joke is the point. |
| **Teach** | **The Receipt** (claim → number → limit) | Do not tell a story to deliver a checklist |
| **Sell** | **The Confession** (what I did wrong → what it cost → the honest limit) | Do not invent urgency |

### Pass 4 — the hooks and the interrupts (45 minutes)

For each post: pull **one hook from the bank**, note its number, and **change at least half of it**
so it belongs to this topic. Then write the interrupt — what is *on screen* in the first two
seconds.

Two rules:

- **No hook mechanism twice in a row.** If Monday was a number, Tuesday is a witness.
- **No interrupt that needs something you do not have.** A phone, a page, a chat, a second phone,
  paper. That is the equipment list. No props budget.

### Pass 5 — the honesty pass (30 minutes)

Read every planned post and answer three questions:

1. **Is anything claimed that did not happen?** Cut it. No invented clients, results, numbers, or conversations.
2. **Does any post make the customer the villain?** Rewrite it. The villain is the silence.
3. **Is every sell post carrying a real limit?** "It will not bring you new customers" is the limit, and it is what makes the rest believable.

---

## 3. The planning sheet

`marketing/craft/PLANNING-SHEET.csv` — one row per post, nine columns. Open it in Google Sheets or
Excel. The first week is filled in as an example.

| Column | What goes in it |
|---|---|
| `date` | 2026-12-01 |
| `pillar` | 1 / 2 / 3 / 4 |
| `tier` | entertain / teach / sell |
| `show` | fixthis / onething / steal / honestad / truestory / street / saidno |
| `structure` | turn / witness / receipt / confession |
| `interrupt` | what is on screen in the first 2 seconds |
| `hook` | ≤12 words. Count them. |
| `hook_ref` | the number from `04-HOOKS.md`, so you can see the mix |
| `asset` | phone / page / chat / paper / two phones |

**If the `asset` column needs something you do not own, the post is not planned.** That single rule
saves more months than any strategy.

---

## 4. Never run out of ideas again

You have **four pillars**. You have **eight shows**. That is **32 combinations** before you repeat
anything. Multiply by four story structures: **128 shapes.** Multiply by ten hook mechanisms:
**1,280 posts.**

So when someone says "I don't know what to post", the honest answer is: *you have not opened the
matrix.* Take pillar 3 (answer and follow up) × show TRUE STORY × structure The Witness × hook
mechanism E (the witness). That is a post. It takes eight minutes, not eight hours.

| | FIX THIS | ONE THING | STEAL | HONEST AD | TRUE STORY | STREET | WE SAID NO |
|---|---|---|---|---|---|---|---|
| **P1 say what you sell** | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| **P2 be findable** | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| **P3 answer + follow up** | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| **P4 price honestly** | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |

Every cell is a post. Fill them in order and stop when the month is full.

---

## 5. The checks before you commit a month

- [ ] Pillar mix: no week teaches the same gap twice
- [ ] Tier mix: roughly 2 entertain : 1 teach : 1 sell
- [ ] No show twice in a row
- [ ] Every hook ≤12 words (count them, do not estimate)
- [ ] No hook mechanism twice in a row
- [ ] Every `asset` is something you own
- [ ] Every sell post has a price **and** a limit
- [ ] Nothing invented
- [ ] The customer is never the villain
- [ ] You can film the first week in one sitting

---

## 6. How a month becomes files

The November build reads JSON, so a new month is written the same way:

```
content/days-01-02.json     one object per post:
                            day, label, theme, offer, posts[]
                            each post: id, show, type, topic, why,
                            tiktok{fmt,hook,beats,vo,cap,tags,asset},
                            instagram{fmt,slides,cap,tags},
                            facebook{fmt,body}
```

Then:

```
node launch-content/november/build/build-kit.mjs     # rebuild the commander
node launch-content/november/build/validate.mjs      # structure + honesty
npm run audit:november                               # hooks, pace, openings
```

**The build will refuse a month that breaks its own rules** — a hook over 12 words, a repeated
opening, a sell post with no price. That is the point. The machine is the thing that stays awake at
11pm so you do not have to.

---

## 7. What not to do

| Don't | Because |
|---|---|
| Plan 90 days at once | By day 20 you will have learned something that makes week 12 wrong |
| Write captions before the structure | You will write a memo, and no structure will save it |
| Let the calendar decide the day | The cash track comes first: messages at 9am, posts at 7pm |
| Fill every slot because a slot exists | Three good posts beat eleven dutiful ones |
| Rebuild November instead of extending it | 330 posts is eleven weeks of material. Add, do not replace. |
