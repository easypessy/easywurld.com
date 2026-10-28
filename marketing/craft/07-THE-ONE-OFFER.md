# 07 — The one offer

*Your instruction: "I also want to give just one offer we can use. Don't confuse them with more than
one option to choose from."*

That is correct, and it is the single highest-value change available to this account this month.
Here is the offer, the reasons, and exactly what it changes.

---

## 1. Why one offer, in three sentences

A choice is work. **Work is what a stranger does when they are deciding whether to buy from you, and
their cheapest option is to decide later — which means never.** One offer removes the work, so the
only decision left is yes or no.

The second reason is marketing arithmetic: **five offers do not get five times the attention, they
get one-fifth each.** Every caption, DM and post about a different pack is a stranger meeting you
for the first time, again.

The third reason is yours: *"and also to care for them."* A menu looks generous and feels like a
test. One offer, chosen for them, is the caring version.

---

## 2. The offer

> ## The Silence Fix — ₦5,000
>
> **You send me your page and your last twenty chats.**
> **I send back three fixes, in the order they are costing you most, and the exact words to copy.**
> **Two days. One page. No call needed.**

**One word to send:** `SILENCE` on WhatsApp **0905 069 0837**.

### Why this one, and not one of the packs

| Test | Why The Silence Fix wins |
|---|---|
| **It attacks the villain** | The villain is the silence after "how much?". This is the only offer that touches it directly. |
| **It exists today** | It needs no file, no design, no download. **The nine packs may not be written yet** — this offer cannot fail that way. |
| **It is demonstrable** | You can show a whole one, in public, for free, before anyone pays. A download cannot be demonstrated in 30 seconds; this can. |
| **It is the position** | "I read your page and tell you the truth. ₦5,000 to fix it." The offer *is* the bio. |
| **It converts to cash at the target** | ₦50,000 = **ten** of these. Ten people in thirty days is a number you can reach with 400 messages. |
| **It has a natural limit** | Three a week is honestly all one person can do well — which makes a *true* scarcity, not a fake one. |

### The limit (say it every time)

> **It will not bring you new customers.** It stops you losing the ones already messaging you. If your
> inbox is empty, this is the wrong ₦5,000 and I will tell you so.

---

## 3. What happens after they send the word

Say this, in this order, every single time. The unknown is the biggest drop-off in any funnel.

1. **You send `SILENCE`** → I reply within the hour with three questions: what do you sell, who
   buys it, and what do people ask you most.
2. **They answer** → I look at the page and the last twenty chats. (Ten minutes.)
3. **Day two** → they get one page: three fixes in order, the exact words to copy, and the one thing
   I would *not* change.
4. **Payment** → after they have seen the first fix, not before. If they do not want it, they keep
   the page. That is the risk I take, and it is why the price can be small.
5. **Day seven** → one message: "did any of it get used?" That is the testimonial question, and it is
   also the next sale.

**Step 4 is the important one.** "Pay after you see the first fix" is the strongest trust move
available to someone with no testimonials. It costs you the occasional unpaid page and buys you the
thing you actually lack: a person who has seen you work.

---

## 4. The copy, ready to use

**Bio**
> I read your page and tell you the truth.
> ₦5,000 to fix it.
> Lagos · WhatsApp 0905 069 0837

**One-line description** (for anywhere that needs one sentence)
> I read Lagos business pages, say what is costing them customers, and send back the words to fix it. ₦5,000.

**The pinned post**
> A customer asked the price. Then they left, and you never knew.
> I read your page and your last twenty chats and send back the three things costing you most — with the exact words to copy. ₦5,000. Two days.
> It will not bring you new customers. It stops you losing the ones you have.
> Send SILENCE on WhatsApp: 0905 069 0837

**The DM opener** — see `../outreach/MESSAGES.txt`, Message 1. It already does this correctly: it
opens with a finding, not a pitch.

**The price objection**
> "It is ₦5,000 because it is one page and two days, not a project. If you want the whole page rebuilt,
> that is a different job and about eight times the price. Most people do not need that yet."

**The "is this real?" objection**
> "Fair. Here is a free sample of how I write, here is my face, and my number matches my profile. Pay
> after you have seen the first fix if you prefer."

---

## 5. What changes, and what happens to the nine packs

**They are not deleted.** They stay on the site and they stay in the shop. Here is the honest
position:

| Thing | Status from today |
|---|---|
| **The Silence Fix** | **The only thing this account sells until 30 November.** Every post, DM, bio and caption ends here. |
| **The nine packs** | Still on the site. **Not promoted.** They become the second purchase offered to someone who already bought — never the first ask. |
| **The bundle (₦35,000)** | Same. Offered only to a past buyer, in December at the earliest. |
| **The ₦5,000 price** | Unchanged. One price, one number, everywhere. |

**Why not simply delete the other eight?** Because someone who finds the site on their own should be
able to buy something. The rule is about **asks**, not about inventory: one ask per post, one offer
per account, until there is evidence that justifies a second.

---

## 6. The state of the build — measured, not asserted

`npm run copy:check` looks at all 330 posts and reports what the month is actually selling. Today:

```
330 posts · 30 sell · 8 offer(s) named in the sell tier

  PLAYBOOK     6 post(s)
  BUNDLE       3 post(s)
  CLEAR        2 post(s)
  PROPOSAL     2 post(s)
  SILENCE      1 post(s)
  LOCAL        1 post(s)
  LAUNCH       1 post(s)
  MESSAGE      1 post(s)
```

**That is the problem, in one screenshot.** Thirty selling posts, eight different things to buy. It
is not wrong because the posts are bad — they are careful and honest — it is wrong because a
stranger has to work out what you actually do.

### The conversion job (next, and it is specific)

All 30 sell posts get rebuilt around The Silence Fix. The *arguments* stay — the angles are good and
they do not repeat. What changes:

1. `topic` and the hook, where the topic names a different product.
2. The call to action in all three captions: **one word, `SILENCE`, one number.**
3. The three posts that are *about the bundle* (D13-09, D23-09, D24-09) become about the limit
   instead — why you sell one thing on purpose.
4. `npm run copy:check` should end with **`1 offer(s)`** before 1 November.

**Until that is done, the checker will stay red, and it should.** A red check that tells the truth
is worth more than a green one that does not.

---

## 7. How we will know it worked

| Number | Where | Target by 30 November |
|---|---|---|
| Messages sent | `../outreach/targets.csv` | 400 |
| Replies | same | 40 (10%) |
| **Paid** | same | **10** — this is the whole month |
| Revenue | same | **₦50,000** |
| Repeat buyers | same | 2 (these are the only people who hear about the packs) |

**If replies are healthy and sales are zero**, the offer is wrong — not the market. The first fix:
drop the price to ₦3,000 for five people and see whether the objection was price or trust. Write
down what they said, in their words, and the next version of this file starts with a quote instead of
a guess.

---

## 8. The rule

> **One offer. One price. One word. One ask.**
> Anything else is a menu, and a menu is a decision, and a decision is a delay.

When December comes, the question is not "what else can we sell?" It is: **"did ten people pay for
this one thing?"** If yes, sell more of it. If no, the answer is never a second product.
