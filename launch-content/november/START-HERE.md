# Start here — the November build is finished

Thirty days. Three hundred and thirty ideas. Nine hundred and ninety published pieces.
Each one written separately for TikTok, Instagram and Facebook. No LinkedIn, no placeholders,
no ideas left as "to be scripted".

Everything is in this folder:

| File | What it is | What to do with it |
|---|---|---|
| `EASYWURLD_POST_COMMANDER.html` | The whole month as one offline app | Open it in a browser. Tap a post, read the script, copy it to your phone. Works with no internet. |
| `MONTH_POSTS.md` | The same 990 pieces as a document | Print it, or read it on a laptop while you film. |
| `content_calendar.csv` | One row per scheduled piece, with date, platform and time | Import into Buffer, Later, Sheets, or whatever you schedule with. |
| `content/days-*.json` | The source of truth | Edit here, never in the generated files. |
| `content/memes.json` | The 30 memes, as text | Edit here, then rebuild the meme bank. |
| `WHAT-WE-TEACH.md` | What the account teaches: four gaps, three voices, and whether to give it a face | Read this first if the month ever feels like 330 unrelated posts. |
| `MEME_BANK.md` | 30 memes, one a day, as text | The words to type, plus the rules that keep them honest. |
| `MEME_CARDS.html` | The same 30 memes, already laid out as cards | Open it, screenshot a card, post it. No design work needed. |

## How to run it

1. **Film a week in advance.** This was our own biggest mistake in the build: writing daily
   squeezed the writing, and the writing is what decides whether anything works. One weekend
   of filming covers a week.
2. **Post in the order the calendar gives you.** The order is the argument. Entertain first,
   teach second, sell last — 60/30/10 across the month, and the sell posts only work because
   of the twenty-seven days before them.
3. **Keep the tracker.** Eight columns is enough: date, format, type, views, saves, comments,
   conversations, packs sold. The only column that ever changed what we post is conversations.
4. **Read the sheet on 30 November, not before.** A flat week is not evidence that the plan
   failed. It is evidence that you have not found the twenty percent yet.

## Checking the build

```bash
node launch-content/november/build/validate.mjs   # 30 days, 330 posts, 990 pieces, all rules
npm run audit:november                            # hook length, pace, connectors, duplicates
```

Both currently pass: no hook over twelve words, no script outside a readable pace, no two
posts opening the same way.

## The honest part

No one can guarantee that every post goes viral. Not us, not anyone selling a course about it.
Even the people with a team of editors and a hundred million views claim about seven in ten,
and they have a team.

What is controllable is the build, and this is the whole of it:

- **The itch in the first three seconds.** Every TikTok script opens with the problem, not the
  introduction.
- **But / therefore in the middle.** No script is a list of facts joined by "and".
- **The payoff at the end.** The last line is the thing they repeat, not the thing you sell.
- **One job per post.** A post that entertains and then asks for money does neither.
- **A limit next to the price.** Every sell post says what it will not do, in the same breath
  as the number. That is why anyone believes the rest.

That is craft, honestly pursued. It gives every post a fair chance. It does not promise a
result, and nothing in this folder pretends otherwise.

## What is measured, and what "working" means

Four numbers, once a week:

| Number | Where it lives | What it tells you |
|---|---|---|
| Follows | Platform | Whether the entertainment tier is doing its job |
| Conversations started | Your WhatsApp | Whether the teaching tier is doing its job |
| Packs sold | Your records | Whether the selling tier is doing its job |
| Repeats | Your inbox | Whether any of it was worth buying again |

If follows grow and conversations do not, the handoff is broken — check the bio and the pinned
post. If conversations grow and sales do not, the offer is unclear — check the price and the
limit. If nothing grows for four weeks, the content is the wrong audience, not the wrong volume.

## What is not in here

- No invented testimonials, clients, ratings or results. Where we describe our own numbers,
  they are small and they are real, and the posts say so.
- No guarantee of reach, growth or income, in any script.
- No fake scarcity. Every deadline in these scripts is one we would actually honour.
- No promise that any of this replaces the work of answering your own messages.

The month is built. The remaining variable is whether it gets posted, in order, for thirty days.
