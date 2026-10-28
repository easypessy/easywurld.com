# How one post is built

You said you don't understand the structure — the hook, the caption, the carousel, the memes.
This file takes **one real post from your own Day 1** and takes it apart. Nothing here is
theory. Every line is already in `content/days-01-02.json`.

Read this once. It will make the other 329 posts readable.

---

## 1. A post is four parts, not one

Every one of your 330 posts has the same four parts in the same order:

| Part | What it is | Where it lives |
|---|---|---|
| **1. The idea** | one sentence about one problem | `topic` |
| **2. Why it exists** | who this is for and why they'll stop | `why` |
| **3. The hook** | the first 2 seconds — spoken or on slide 1 | `tiktok.hook` |
| **4. The three versions** | the same idea, rebuilt for TikTok, Instagram, Facebook | `tiktok` / `instagram` / `facebook` |

**One idea, three formats.** That is the entire system. You are not making three pieces of
content; you are making one thought and saying it three ways because three apps reward three
different things.

---

## 2. Take it apart: D1-01

The real post, exactly as it appears in the file.

```
topic  This bakery's homepage says 'welcome'
why    Recognition plus relief. They have seen this page a hundred times
       without being able to say what was wrong with it.
```

### The TikTok version

| Piece | Your content | Why it is that |
|---|---|---|
| **hook** | "This bakery's whole first screen says 'Welcome to our website'." | 11 words ≈ 2.5 seconds spoken. Names a specific thing you can *see*, so the viewer believes you actually looked. |
| **beats** | Not ugly. Unclear → A stranger learns nothing in 4 seconds → Say what you sell, when it is ready → Then one button | Four beats = four camera cuts, 26 seconds total. Each beat is 4–7 words. These are your edit marks. |
| **vo** | the full spoken script, ~60 words | Read at normal speed = 26 seconds. It is written to be *spoken*, not read — short sentences, no clauses. |
| **cap** | "Not ugly. Unclear. The first screen has one job: tell a stranger what you sell and what to do next." | One idea, 18 words. TikTok captions are a *caption*, not an essay — the video already said it. |
| **tags** | #LagosBusiness #WebsiteDesign #SmallBusinessNigeria #Easywurld | 4 only. Hashtags lift TikTok views ~5%; more than 4 looks like spam. |
| **asset** | screen recording of a fake bakery page, terracotta arrow | This is your instruction to yourself — what to open on screen. |

### The Instagram version

| Slide | Text | Job |
|---|---|---|
| 1 | "'Welcome to our website'" | **The hook.** A quote, not a title. You can *hear* it. |
| 2 | "Is not a headline" | **The turn.** Cuts the sentence off. This is the swipe trigger. |
| 3 | "It is a doormat" | **The twist.** One image, 4 words. The shareable line. |
| 4 | "Say what you sell + when it is ready" | **The fix.** |
| 5 | "Then one button" | **The action.** |

Five slides, and each one has a *job* — that is the difference between a carousel and a memo.
A memo is five slides of sentences. This is five slides of argument, and every slide makes you
want the next one because slide 2 didn't finish the thought on slide 1.

### The Facebook version

```
Open your homepage as if you have never seen it. Can you tell what they sell in four seconds?
...
What does your first screen say right now?
```

90 words, ends with a **question**. Facebook rewards comments and has no character limit pressure
like TikTok. That last question is not decoration — it is the only reason anyone comments, and
comments are what Facebook shows to more people.

---

## 3. The hook: the one rule that matters

Every hook in your build is **6 to 12 words** (median 11). That is not a style choice, it is
about 2–3 seconds of speech, which is roughly how long you get.

Four hook shapes are used across the month:

| Shape | Example from your build | Why it works |
|---|---|---|
| **The quote** | "This bakery's whole first screen says 'Welcome to our website'." | The viewer hears the mistake and recognises it |
| **The number** | "Nine packs. ₦5,000 each. Do not buy most of them." | A number creates a small debt the brain wants to close |
| **The contradiction** | "Your logo is not the problem." | It contradicts what they believe, so they stay to find out |
| **The confession** | "Forty packs a day, cracked screen." | Odd and specific. Specific is believable. |

**What makes a hook fail:** adjectives ("amazing", "powerful"), a greeting ("hey guys"), a
question the viewer can answer without watching ("do you want more customers?"), and anything
over 12 words.

---

## 4. The carousel: three shapes, not one

Your build uses three lengths on purpose. Pick by how much the idea needs — never pad.

| Slides | Shape | Use when | Count in your build |
|---|---|---|---|
| **3** | Quote → turn → fix | The idea is one line. eg. D1-02: "Committed to excellence" / "Said nobody's customer, ever" / "Say what happens, and when" | 128 |
| **4** | Setup → 2 middle beats → payoff | Most teaching posts | 147 |
| **5** | Hook → turn → twist → fix → action | The fullest version, for the strongest ideas | 54 |

**The three rules that make a carousel travel:**

1. **Slide 1 is never a title.** No "5 tips for better marketing". Slide 1 is the mistake itself,
   in its own words, so the reader thinks *that's me*.
2. **The turn comes early.** By slide 2 or 3 the reader must be surprised, or they swipe away.
   This is the *but* and the *therefore* from your storytelling file.
3. **The last slide is an action, not a summary.** "Then one button" — not "thanks for reading".

**Why they're all faceless:** nothing in a carousel needs a face. What they need is a screenshot,
a chat, or a real mistake. Which brings us to the memes.

---

## 5. The memes: what that experiment actually is

You have 30 memes, one per day (`MEME_CARDS.html`). They are not decoration and they are not a
mascot. They are **a test with a name**.

**What they are:** three recurring *formats*, not three recurring characters.

- **The Chat** (10 of 30) — a customer's phone screen
- **The Replies** (13 of 30) — an X post and the replies taking it apart
- **The Thread** (7 of 30) — a Reddit thread

**Why formats instead of a mascot:** a mascot means one face, one voice, one backstory, kept
consistent across hundreds of posts, forever. A format means you never have to keep anything
consistent — every new one is new. And the curiosity is real: *"whose chat is this?"* is a
stronger feeling than *"who is this cartoon?"*

**How the swap works:** each meme has a `swap` field naming the post it replaces. Day 1's meme
swaps into D1-01's Instagram slot. **TikTok and Facebook are untouched** — so the test is clean:
same idea, same day, one slide deck vs one joke. If the joke travels, you learn something. If
not, you learned it for the price of seven images.

**The three honesty rules**, which are not negotiable:

1. Never post a chat meme as if it happened. No real dates, no real names.
2. Never use a meme as proof, or in a sell post. A joke in an ad is an invented testimonial.
3. Never punch down. The business is the punchline, or nobody is.

**The test:** two weeks, measure **shares only** (not likes, not views). Keep the two formats
that got shared most. Repeat them. Then decide about a mascot with data instead of a hunch.

---

## 6. Actually making one (the design, in one table)

| Thing | Value |
|---|---|
| Size | 1080 × 1350 px (4:5 — the tallest Instagram allows) |
| Background | cream `#FAE7C7` or paper `#FBF9F4` |
| Headline text | deep green `#0A4937`, **Fraunces** |
| Small labels | **JetBrains Mono**, uppercase |
| One accent per asset | terracotta `#9E4E2C` |
| Text per slide | **12 words maximum.** If it doesn't fit, the slide is doing two jobs. |
| Font size | big enough to read on a phone at arm's length — 90px+ headline |

Make one template in Canva, duplicate it 330 times. Never design from scratch — that is how a
month becomes three posts.

---

## 7. Scheduling, without buying anything

You do not need a paid tool. Free options, in order of least friction:

1. **Meta Business Suite** (free, web) — schedules Instagram + Facebook together, up to 75 days
   ahead. This is the one to use. *Check it still allows it on your account; Meta changes these
   rules and sometimes restricts newer accounts.*
2. **Instagram's own scheduler** — in the app, "Advanced settings → Schedule". Works, but only
   on professional accounts and only one at a time.
3. **TikTok's native scheduler** — on the web upload page, schedule up to 10 days ahead.
4. **A notebook.** Genuinely. Three posts a day written down and posted by hand is better than a
   tool you never set up.

**Schedule the week on Saturday, not the day.** Ten minutes on Saturday buys you seven calm days.

---

## 8. "I can't tell them I'm still learning"

You are right that you cannot walk into a room and announce you're a beginner. But look carefully
at the two things you're confusing:

- **A claim of experience** — "I've helped 40 businesses grow". You cannot say this. It isn't true.
- **A confession of inexperience** — "I'm still learning, please bear with me". You also should not
  say this. It isn't necessary, and it isn't what they're asking.

**You do not have to say either.** Say what you do and what it costs:

> "I fix pages for small Lagos businesses. I look at your page, tell you what's costing you
> customers, and for ₦5,000 I write out the fix. Here's a free sample so you can see how I write."

Every word of that is true today. It claims no clients, no years, no results — and it also
apologises for nothing. **The sample is your credential.** Not your history.

If someone asks directly: *"Have you done this before?"* — answer short, then hand them the work:

> "This is my first month doing it publicly. Read the sample and tell me if it's useful — that's
> a better test of me than my CV."

That answer costs you one person and keeps the rest. The people who leave at that sentence were
going to be difficult clients anyway.

**And the thing you're not seeing:** being new is *why the teardowns are credible*. You cannot be
selling a course about clients you don't have. "I read pages and say what's wrong" is a claim that
survives having no track record — because the page either has the problem or it doesn't, and the
reader can check.

---

## 9. So what do you do with all 330 of these

1. **Do not read all 330.** Open `EASYWURLD_POST_COMMANDER.html`, filter to **one week**, and
   work only from that.
2. **Do not rewrite the hooks.** They were checked: 0 over 12 words, 0 repeated openings.
   Rewriting them is the most popular way to lose a month.
3. **Film the week on Saturday or Sunday.** Nine clips for three days, one shirt, one wall.
4. **On the day, you only press post.** That is what "already written" means.

---

## The one-sentence version

> **A post is one problem, said in 11 words, then turned, then fixed — three times, for three
> apps, in the shape each app rewards.**

If you remember that, you can make post 331 yourself.
