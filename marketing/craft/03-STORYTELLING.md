# 03 — Storytelling

*Your third entry. You said you have not seen a good storytelling video yet — so here are the
frameworks themselves, with their real sources, rather than somebody's summary of them.*

---

## 1. First, the honest state of things

Storytelling advice online is mostly three recycled ideas with the names filed off. Below are **six
frameworks that exist in the world with real attribution**, plus which ones actually fit a 30-second
video and which ones do not.

| Framework | Where it comes from | Confidence | Fits 30s? |
|---|---|---|---|
| **But / Therefore** | Trey Parker & Matt Stone, in interviews about writing | High (widely quoted by them) | **Yes — the backbone** |
| **ABT** (And, But, Therefore) | Randy Olson, *Houston, We Have a Narrative* (2015) | High | **Yes** |
| **Kishōtenketsu** | Classical East Asian four-part form | High | **Yes — best for entertainment** |
| **The Story Spine** | Kenn Adams (improv), popularised by Pixar's Emma Coats | High | Partly — too long as-is, 5 beats fit |
| **The Story Circle** | Dan Harmon | Medium (a practitioner's model) | Only at 60s+ |
| **Hero's Journey / StoryBrand** | Joseph Campbell; Donald Miller | High as frameworks, not as measured results | **No** — this is for a sales page |

---

## 2. But / Therefore — the backbone you already have

> "If you say 'and then', you're screwed." — Trey Parker

The rule: any two beats in a story must connect with **but** or **therefore**. Never **and then**.

- *And then* = a list. Lists are forgettable, because each item is independent.
- *But* = a turn. Now something is at stake.
- *Therefore* = consequence. Now it mattered.

```
She put the price on the post      → BUT  three people still asked
                                   → THEREFORE she put the date on it too
```

**This is already in your build.** `npm run story` fails a script that has no connector, and
`THE-ITCH.md` is built on it. Nothing to change — just know the name so you can hear it when it is
missing.

**How to fix a flat post in ten seconds:** find the two sentences that are joined by "and", and ask
what the second one *caused*. If nothing, delete it.

---

## 3. ABT — the same idea, made into a template

Randy Olson's version, used to make scientists tell stories. It is But/Therefore with the setup
made explicit:

> **AND** — here is the situation everyone agrees on
> **BUT** — here is the problem
> **THEREFORE** — here is what we do about it

**Worked, for Easywurld:**

> **And** — you post every day, and the page looks good.
> **But** — forty people asked the price in the comments and not one got a number.
> **Therefore** — the post was never the problem; the reply was.

That is a whole carousel, a whole video, and a whole Facebook post in three sentences. Almost every
"STEAL" and "FIX THIS" post in your month is an ABT with the labels filed off.

---

## 4. Kishōtenketsu — the one that explains your cardboard video

This is the most useful thing in this file, and it is the one nobody on TikTok will teach you.

**Kishōtenketsu** (起承転結) is a four-part structure from classical Chinese poetry, used across
Japanese, Korean and Chinese storytelling. *(High confidence: well documented; the Wikipedia entry
is accurate on the structure.)*

| Part | Name | Job |
|---|---|---|
| 起 | **Ki** | Introduction — set the world, establish the pattern |
| 承 | **Shō** | Development — deepen it, no change yet, so the pattern feels solid |
| 転 | **Ten** | **Twist** — something arrives that does not fit the pattern |
| 結 | **Ketsu** | Conclusion — reconcile the twist with the world; meaning lands |

**Two facts that make it different from everything else:**

1. **It does not require conflict.** No villain, no fight, no problem to solve. The engine is
   *recontextualisation*: the twist makes you re-see the ordinary thing. (Popularly called "the
   structure without conflict". A fair correction: it does not *require* conflict; it can contain it.)
2. **The twist does not have to be a threat.** It can be a new detail, a shift of camera, a
   different person, a number.

### Your cardboard video is kishōtenketsu, exactly

| Part | The video |
|---|---|
| **Ki** | A child, holding something, ordinary framing |
| **Shō** | It looks like she is eating cardboard. The video lets you settle into that reading. |
| **Ten** | She pulls out what she was actually eating |
| **Ketsu** | End. The world returns to normal — and the joke is that you believed the wrong thing for 25 seconds. |

**Nothing was at stake. Nobody fought anybody.** That is why it worked as entertainment — and why
it would be ruined by adding a message at the end.

### Business version — same four beats

| Part | A teardown video |
|---|---|
| **Ki** | "This is a shop I buy from. Look at the page." |
| **Shō** | Scroll it. It looks fine. Normal products, normal captions. |
| **Ten** | Open the comments. Forty "how much?" and no reply. |
| **Ketsu** | "The page was never the problem. The replies were." |

**Use kishōtenketsu when:** the post is entertainment, the point is a *re-seeing*, and there is
no villain needed. This is the shape of your best 210 entertain posts.

---

## 5. The Story Spine — five beats that fit in 30 seconds

The full spine is seven lines (Kenn Adams' improv game, popularised by Pixar story artist Emma
Coats in 2011). Seven is too many for 30 seconds. **Five fits:**

> Once there was…
> Every day…
> **Until one day…**
> Because of that…
> Until finally…

**Worked, for a TRUE STORY post:**

> Once there was a woman selling frozen food from a freezer in Agege.
> Every day she posted the same picture and nobody asked anything.
> **Until one day** she wrote the price on the picture.
> Because of that, three people asked a question instead of a price.
> Until finally she stopped posting more and started answering faster.

Notice: no adjective, no "amazing", no lesson at the end. The lesson is the shape.

**Story Spine is for:** TRUE STORY and WE SAID NO posts, where something actually happened.
**Do not use it** for a Teach post — it makes a checklist sound like a fairy tale.

---

## 6. The Story Circle and the Hero's Journey — what they are actually for

Dan Harmon's **Story Circle** (8 beats: comfort → want → unfamiliar → adapt → get → pay → return →
change) and Campbell's **Hero's Journey** are both **long-form** structures. Twelve stages squeezed
into 30 seconds is why so many "storytelling" business videos feel rushed and meaningless.

Use them where they belong:

- **The Story Circle** → a 60–90 second video, or a 5-slide carousel where the reader *changes
  their mind* by the last slide.
- **The Hero's Journey / StoryBrand** → your **sales page and your pitch**, not your posts. The
  customer is the hero, you are the guide, the villain is the silence. (See
  [`02-VILLAIN-AND-HERO.md`](./02-VILLAIN-AND-HERO.md).)

**Rule of thumb:** 30 seconds gets **one turn**. 60 seconds gets **two**. Anything longer needs a
structure with a name, or it becomes a ramble.

---

## 7. The one device that works inside any of them: the open loop

**Zeigarnik effect:** unfinished things are remembered better than finished ones. In practice, an
opened question creates mild discomfort that the viewer wants to close. *(High confidence on the
effect; Medium on how much it moves watch time.)*

The trap: a loop that is never closed is **clickbait**, and 2026 audiences punish it. Reports say
platforms now track early exit after a hook as a negative signal. **Close every loop inside the
video.**

---

## 8. The four story types this account actually uses

You do not need six frameworks. You need these four, in this order of frequency.

| # | Type | Structure | Use for | Example from your build |
|---|---|---|---|---|
| 1 | **The Turn** | Kishōtenketsu: ordinary → ordinary → twist → meaning | Entertain | "This bakery's homepage says welcome" |
| 2 | **The Witness** | Someone else's words, unedited, then what they reveal | Entertain / Teach | "'The interest will just off me.' A customer wrote that." |
| 3 | **The Receipt** | Claim → number → what the number does *not* prove | Teach / honest ad | "Nine packs. ₦5,000 each. Do not buy most of them." |
| 4 | **The Confession** | I did this wrong → here is what it cost → here is what changed | Sell, occasionally | "The ₦180,000 we turned down" |

**The Witness is the strongest one you have and the least used.** It requires no invention: real
people have already written your best lines. The quotes are collected in
[`../positioning/PAIN-POINTS.md`](../positioning/PAIN-POINTS.md).

---

## 9. Worked scripts (checkable)

Two scripts in the format `npm run story` reads, so the computer agrees with me.

```
npm run story -- marketing/storytelling/examples/the-silence.md
```

The file is in `marketing/storytelling/examples/`. Read it once to see the four beats annotated,
then copy its shape.

---

## 10. The 90-second fix when a post has no story

Ask these four questions in order. Wherever you get a blank, that is the missing beat.

1. **What was normal?** (Ki)
2. **What did everybody believe about it?** (Shō)
3. **What did I see that broke it?** (Ten)
4. **What does it mean now?** (Ketsu)

If question 3 has no answer, you do not have a story — you have a tip. Make it a checklist instead,
which is a perfectly good post, and stop calling it a story.
