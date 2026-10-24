# Easywurld — The Plan

**What you have, what is missing, and what to do for the next 90 days.**
Written 24 October 2026 · Lagos · working document

---

## 1. If you read nothing else, read this

**You built the factory and forgot the shop.**

You have 49 concept projects, 9 finished products and 1,140 written posts. The supply side is
done, and it is genuinely good work. But an offer is not a business. A business is four things
happening in a loop:

> **attention → trust → a way to pay → delivery** … then repeat.

Right now you have #3 and #4, both by hand, and almost nothing of #1 and #2.

That is the whole answer to *“the offer is there, but except that, what else?”*

**The offers are not the business. They are the front door.** One website project is worth
about **50** of your ₦5,000 offers. The offers exist to create trust and start conversations
that turn into paid projects. If you try to live on ₦5,000 sales alone, you will need an
audience of tens of thousands before the money is real.

**So the plan is three moves, in this order:**

1. **Weeks 1–2 — Fix the shop.** People who are already interested cannot pay you without
   a conversation, cannot find the bundle, and never see the offers from the homepage.
2. **Weeks 3–6 — Get attention, and measure it.** Keep the volume you planned, but every
   post now carries a code, and one number decides what survives: **conversations per 10
   posts**. Plus 20 free reviews that turn into real before/after proof.
3. **Weeks 7–12 — Sell services.** Publish three priced packages. Every offer buyer is a
   service lead. This is where the income actually comes from.

---

## 2. What you actually have (the honest inventory)

| Asset | Count | State |
|---|---|---|
| Concept/sample projects on the site | 49 | Finished, labelled honestly, good quality |
| ₦5,000 offers | 9 | Each with a full sales page, deliverables, FAQ, disclaimer |
| Bundle | 1 | **Only exists in `launch-content`. Not on the website at all.** |
| Written social posts | 1,140 | Written, dated, ready — but no audience to receive them |
| Free sample (5 chat scripts) | 1 | Built, but not used as a lead magnet anywhere |
| Free website review | 1 page | The strongest offer you have, buried in the menu |
| Checkout / payment link | 0 | None. All payment is manual WhatsApp |
| Real client work / testimonials | 0 | None — and you are right not to invent them |
| Priced service packages | 0 | Services page describes what you do, never what it costs |

---

## 3. Why it feels like it is “not going” (this is probably the real reason)

It is not the offer. It is that **the business has four different plans pointing in four
directions**, so no single action ever compounds:

- `marketing/calendar/` — 120 posts, 8 Oct → 6 Nov 2026
- `launch-content/social-command/` — 1,140 posts, 19 Oct → 17 Nov 2026
- `launch-content/daily_scripts/` — Day 1 → Day 30, undated
- The site — 9 offers, but **not one link to them from the homepage**

Two of those calendars started already. One says 4 posts a day, the other says 37. Neither
matches today. That is why “how it’s going” is hard to answer: there is no single scoreboard.

**Fix: pick one calendar (the light one), one channel, one number to watch.** Everything else
gets archived, not deleted. Section 6 does this.

---

## 4. The money, plainly

Numbers below are **planning arithmetic to show the shape of the business — not forecasts.**
They use assumptions you should replace with your own after 30 days of real data.

### Offers alone are a volume business

| To earn | You need | Which needs roughly |
|---|---|---|
| ₦50,000/month | 10 sales | ~50 WhatsApp conversations |
| ₦150,000/month | 30 sales | ~150 conversations |
| ₦300,000/month | 60 sales (2 a day) | ~300 conversations, ~10,000 profile visits, ~200,000 views |

At a starting audience, 200,000 monthly views is not realistic in month one. That is not a
failure of the product — it is just what a ₦5,000 product costs in attention.

### Services are a trust business

| To earn | You need |
|---|---|
| ₦250,000/month | **1** project at ₦250,000 |
| ₦500,000/month | 2 projects |
| ₦750,000/month | 2 projects + 1 retainer |

Two projects a month needs about 6–8 serious conversations — which the free review and the
offers are very good at creating.

### The hybrid that fits what you built

> 20 offer sales (₦100,000) + 1 bundle (₦35,000) + 2 projects (₦500,000) = **₦635,000/month**
> …from ~60 conversations, not 300.

**That is the target shape.** Offers and content exist to feed conversations. Projects pay the bills.

> **Your own numbers disagree with your pricing.** `offers.ts` values work at **₦5,000/hour**.
> A 30-hour website build at your own stated rate is **₦150,000**. If you are quoting below
> that, you are underpricing against your own published maths.

---

## 5. The ladder (this is the “what else”)

Right now the ladder has one rung: ₦5,000, then nothing. Build these rungs — the prices are
starting points to test, not gospel:

| Rung | Offer | Price | Purpose |
|---|---|---|---|
| 0 | Free 3-point website review | ₦0 | Starts conversations. You already built this. |
| 1 | Any single offer | ₦5,000 | First paid yes. Creates a customer, not income. |
| 2 | The bundle (all 9) | ₦35,000 | **Best-value sale you have.** Same effort, 7× the money. |
| 3 | **Homepage Clarity Sprint** — first screen rewritten, CTA fixed, mobile checked | ₦120,000 | Productised, 1 week, fixed scope. Converts offer buyers. |
| 4 | **Full site build** — 5–8 pages, copy + design + launch | ₦350,000–₦600,000 | Your main income. |
| 5 | **Care & content retainer** — updates, 4 posts/month, monthly report | ₦60,000–₦120,000/mo | Recurring. The thing that makes the studio stable. |

Two rules that make the ladder work:

- **Every offer buyer gets asked one question:** *“Do you want us to do this for you instead?”*
  That single question is the bridge from rung 1 to rung 3.
- **The free review is the top of the funnel, not a side page.** It should be the main
  homepage call to action, because it costs the buyer nothing and costs you 20 minutes.

---

## 6. The 90-day plan

### Weeks 1–2 — Fix the shop (no new products, no new posts)

| # | Do this | Where | Done when |
|---|---|---|---|
| 1 | ~~Build the **bundle** page~~ **✅ done** — `/bundle`, ₦35,000, 36 files | `pages/Bundle.tsx` | Live |
| 2 | ~~Add an **offers block to the homepage**~~ **✅ done** — bundle + 3 offers + free review | `Home.tsx` | Live |
| 3 | ~~Tag every link so you know what produces conversations~~ **✅ done** — `?src=` → `[ref: …]` in WhatsApp | `lib/wa.ts` | Live |
| 4 | ~~Build the scorecard~~ **✅ done** — tracker, script, decision rules | `marketing/measurement/` | `npm run score` works |
| 5 | **Create the Paystack pages and paste the links** into `client/src/data/payment.ts` — bundle first | 1 file | A buyer can pay without waiting for a reply |
| 6 | Write **delivery templates** — payment received, files sent, ask for feedback, ask about a project | notes | 4 messages you can paste |
| 7 | Make a **conversation log**: date, name, code, what they asked, sold?, next follow-up | Google Sheets | One row per conversation |
| 8 | Use the **5 free chat scripts** as the lead magnet: “Free sample — send SAMPLE” | site + status | One capture point |
| 9 | **Pick one calendar and archive the other two.** Keep the volume — but measured, not guessed | `marketing/` | One list, one owner, one scorecard |
| 10 | Show **three services with prices** | `/services` | Prices visible |

**Target by day 14:** payments live, 10 conversations, 3 sales, one complete week of tracker data.

### Weeks 3–6 — Attention and proof

- **Keep posting at volume — that is the point.** Volume is how you generate enough of a
  sample to tell what works. What changes is that you stop guessing which posts matter and
  let the scorecard cut the dead cells weekly (see Section 8).
- **Entertain first, then teach, then sell.** 60% entertainment, 30% teaching, 10% selling,
  and one job per post. The full system, with the hook bank and worked scripts, is in
  [`storytelling/THE-ITCH.md`](storytelling/THE-ITCH.md); the 30-day calendar built on it is
  [`NOVEMBER-2026.md`](NOVEMBER-2026.md); the three accounts the structure came from are
  written up in [`research/three-accounts.md`](research/three-accounts.md).
- **20 free reviews.** This is your entire marketing for the month. Every review becomes:
  - one post (“we looked at 5 Lagos restaurant sites — here is what we found”), and
  - one before/after you can show, with permission.
- **10 outreach messages a day** to businesses whose site is visibly weak — a specific,
  useful observation plus the free review. Not a pitch.
- **3 proof assets** replace the missing testimonials:
  1. A recorded teardown of a real site (with permission).
  2. A “here is exactly what you get in a project” walkthrough.
  3. One honest “we told them they didn’t need us” story.
- **Google Business Profile.** Free, local, and you are selling local visibility without having it.

**Target by day 45:** 20 reviews delivered, 30 offer sales, 2 paid projects.

### Weeks 7–12 — Sell services

- Publish the three packages from Section 5 with real scope and exclusions.
- Ask **every** buyer and every review recipient the bridge question.
- Raise the price on the package that sells fastest. Cheap is not a strategy; clear is.
- Add the **retainer** to every finished project: “want us to keep it updated?”
- Write down 2 real case studies (what the problem was, what you changed, what they said).
  Only real ones. If you have none yet, the teardowns stay as proof until you do.

**Target by day 90:** 60 offers, 4–6 projects, ₦400,000–₦800,000 total.

---

## 7. Your week (solo, realistic)

| When | What | Time |
|---|---|---|
| Mon | Batch the week’s posts. Send 10 outreach messages. Plan the week’s reviews | 2 hrs |
| Tue–Thu | Deliver reviews and projects. 10 outreach messages. Daily WhatsApp status | 1 hr/day + work |
| Fri | Follow up every open conversation. Update the sheet. One post about the week’s work | 1 hr |
| Daily | 30 min: reply to WhatsApp, log, set next follow-up date | 30 min |

**The 37-posts-a-day plan is a real experiment, and it only pays off if you measure it.**
The risk is not volume — it is spending the whole day producing and never learning which
tenth of it works. The instrument is in `marketing/measurement/`: one number, one sheet, a
15-minute Friday review. Without it, 1,140 posts is just a lot of writing.

---

## 8. The number that decides what you double down on

**Conversations per 10 posts.** One number, per channel × show.

> **Updated for November.** The content is now organised into four repeating shows and three
> tiers — entertain, teach, sell. See [`storytelling/THE-ITCH.md`](storytelling/THE-ITCH.md)
> for the structure and [`NOVEMBER-2026.md`](NOVEMBER-2026.md) for the month. The scorecard
> below ranks *shows*, because that is the thing you can actually add or cut.

You asked for the number, so here it is, and here is why it is not views:

> In your own content, a meme can reach 180,000 people and produce 2 messages, while a
> LinkedIn offer post reaches 9,000 and produces 11 messages plus two project enquiries.
> Views measure entertainment. Conversations measure intent. Money follows intent.

**How it works in practice** (full manual: `marketing/measurement/README.md`):

1. Every link that leaves the site carries a code: `/?src=ig-offer`, `/?src=tt-teaching`.
   The site already appends `[ref: ig-offer]` to the WhatsApp message — built, live, no work
   for you.
2. When a message arrives, the code is in it. You copy it into one row of
   `marketing/measurement/weekly-tracker.csv`.
3. On Friday, 15 minutes:

   ```bash
   npm run score
   ```

4. The script prints **DOUBLE / KEEP / CUT / TOO EARLY** for every channel × post type, and
   tells you what next week should look like.

**The protective rules:**

| Situation | Decision |
|---|---|
| Under **30 posts** in a cell | No decision. Too early. |
| Fewer than **3 eligible cells** | No cuts — nothing to compare against. |
| Top third by conversations per 10 posts | **Double**: +50% posts there next week. Remake the post that did best. |
| Bottom third, revenue near zero | **Cut to half.** Move slots to the top third. |
| One post beats its cell by 3× | **Remake it** three times before trying anything new. |

That is how you keep the volume and still find what works: the volume is the experiment, the
scorecard is the result. **You stop being the person who posts 37 times a day and becomes the
person who knows which 7 of them pay.**

**Also track weekly, in the same sheet:** free reviews delivered, offers/bundles sold,
projects proposed and won, money received. Followers and likes are diagnostics only.

**Decision rules, agreed in advance:**

- A channel that produces **0 conversations in 30 days** gets dropped, not “given more time”.
- If offers sell **under 5/month after 60 days**, change the offer or the price — not the volume.
- If conversations are healthy but sales are not, the problem is the **offer or the price**,
  not the content. Do not answer a weak offer with more posts.
- **Do not build a 10th offer** until the existing 9 have sold 25 times.
- If a project takes **more than 20% longer than quoted**, the scope was wrong. Fix the scope.

---

## 9. What not to do

- Don’t build more products. Nine is more than enough.
- Don’t post at volume *without the scorecard*. Unmeasured volume is the expensive mistake,
  not volume itself.
- Don’t run ads yet. You have no proof and no priced offer to send traffic to.
- Don’t invent a testimonial, a client or a result. Your honesty is currently your only
  differentiator — it is worth more than a fake review.
- Don’t discount below ₦5,000. It signals the work is worth less than a data bundle.
- Don’t answer “how much?” with a range and no package. Have three prices ready.

---

## 10. First seven days

| Day | Do |
|---|---|
| 1 | ~~Build the bundle page, homepage block, pay buttons, link tagging~~ **✅ already built.** Read `marketing/measurement/README.md` instead (15 minutes). |
| 2 | Create the Paystack payment page for the **bundle**. Test it with ₦100, refund yourself, paste the link in `client/src/data/payment.ts`. |
| 3 | Create the payment pages for the 3 offers you feature on the homepage. Paste the links. Deploy. |
| 4 | Post once with a tagged link (`/?src=ig-offer`) from a spare phone or an incognito window. Message yourself. Confirm `[ref: ig-offer]` arrives. |
| 5 | Write the 4 delivery messages. Add this week's posts to `weekly-tracker.csv` — even if the numbers are zero. |
| 6 | Turn the 5 chat scripts into the SAMPLE lead magnet. Set the bio link to `/?src=ig-bio`. |
| 7 | Send 10 outreach messages offering the free review. Log every reply. Run `npm run score` for the first time. |

At the end of seven days you should have: a way to be paid, a bundle people can find, a
homepage that mentions what you sell, ten real conversations, and **your first reading of the
number**. That is what “going” looks like in week one — not more content.

---

## 11. What I need from you to make this sharper

I can see everything you have built. I cannot see these:

1. **How many people actually visit the site each month?** (Vercel Analytics or similar)
2. **How many WhatsApp conversations has the site produced?**
3. **Have you sold any offers yet — how many, at what price?**
4. **How many hours a week can you give this?** (This decides whether services or offers lead.)
5. **What monthly income would make this feel like it is working?**

Answer those and the 90-day plan turns into a real budget instead of a shape.
