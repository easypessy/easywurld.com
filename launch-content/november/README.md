# November kit — 330 core posts, 11 a day

**The build folder for the entertain-first month.** Same generator as
`launch-content/social-command/`, one change: no LinkedIn, and the start date is 1 November.

| | |
|---|---|
| Plan | [`marketing/november/CALENDAR.md`](../../marketing/november/CALENDAR.md) — all 330 hooks and turns, day by day |
| Strategy | [`marketing/strategy/WHY-THIS-WORKS.md`](../../marketing/strategy/WHY-THIS-WORKS.md) — the research behind it |
| Storytelling | [`marketing/storytelling/THE-ITCH.md`](../../marketing/storytelling/THE-ITCH.md) — the four shows and the hook bank |
| Measurement | [`marketing/measurement/README.md`](../../marketing/measurement/README.md) — which show earns its slots |

## Build

```bash
node launch-content/november/build/build-kit.mjs       # app + month doc + csv
node launch-content/november/build/validate.mjs        # or --partial while days are missing
```

Writes into this folder:

| File | What it is |
|---|---|
| `EASYWURLD_POST_COMMANDER.html` | The phone app. One file, works offline, copy button on every block, tick marks saved on the phone. |
| `MONTH_POSTS.md` | Every post in long form: hook, beats, voiceover, slides, caption, hashtags. |
| `content_calendar.csv` | One dated row per scheduled post — 33 a day. |

## Content status

| Days | State |
|---|---|
| 1–2 | **Written to the final word** — `content/days-01-02.json` (22 core posts, 66 published) |
| 3–30 | **Planned line by line** in `marketing/november/CALENDAR.md` — hooks and turns fixed, scripts to write |

To add days, create `content/days-NN-NN.json` in the same schema and rebuild. The app, the month
doc and the CSV all regenerate from the JSON, so nothing can drift.

## The schema

```jsonc
{
  "day": 3,
  "label": "Day 3 · Tuesday",
  "theme": "Price is not the problem",
  "offer": "PLAYBOOK",
  "posts": [
    {
      "id": "D3-01",
      "show": "fixthis",          // fixthis | onething | steal | hottake |
                                  // truestory | street | saidno | honestad
      "type": "Entertain",         // Entertain | Teach | Sell — one per post
      "topic": "...",
      "why": "...",                // the emotional reason this works
      "tiktok":    { "fmt": "", "hook": "", "beats": [], "vo": "", "cap": "" },
      "instagram": { "fmt": "", "slides": [], "cap": "" },
      "facebook":  { "fmt": "", "body": "" }
    }
  ]
}
```

**Hashtags and visual direction are derived from `show`** by the builder, so they never drift
between posts. Override them per platform only when a post genuinely needs something different.

## What the validator enforces

- 11 posts a day, 33 scheduled slots a day
- a TikTok, Instagram and Facebook version on every post, each with real copy
- no machine-made wording ("leverage", "seamless", "unlock", "dive into" …)
- no invented proof: ratings, testimonials, star counts, guarantees, "#1 in", "award-winning"
- no price without the naira sign
- a sell post must carry a way to buy
- the built app must parse

It prints `ALL CHECKS PASS` and exits 0. Warnings are advisory; failures block a release.
