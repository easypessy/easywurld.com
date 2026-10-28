# 08 — The rules

*Every rule you have given me, turned into something that can be checked. These apply to every post,
every plan, every DM, every page, from now on.*

---

## The rules, and how each one is checked

| # | Rule (your words) | What it means in practice | Checked by |
|---|---|---|---|
| 1 | **Don't rely on generic hooks when a specific, intriguing hook is possible** | Name the shop, the number, the sentence, the day | `npm run audit:november` (hook length, repeats) + eyeball: is there a number or a name? |
| 2 | **Give the audience a reason to keep watching or swiping** | A turn by slide 2–3, or a reveal at 60–85% | `npm run story` |
| 3 | **Make the reveal relevant to the subject, not a random surprise** | The payoff answers the question the setup opened | `01-PATTERN-INTERRUPTION.md` §3, §7 |
| 4 | **Use storytelling to make the lesson memorable, not to disguise a pitch** | Entertain posts sell nothing; sell posts claim nothing | `npm run story` (`@tier entertain` + selling words = FAIL) |
| 5 | **Treat the audience as capable partners, not helpless people** | No rescuing language, no "you're doing it wrong", no fear | Read it aloud; flag "you must", "you're losing", "before it's too late" |
| 6 | **Make Easywurld the ally that brings expertise and structure** | Guide, not hero. "I can see it because I'm outside" | `02-VILLAIN-AND-HERO.md` §2 |
| 7 | **Adapt ideas from other niches without copying creators word for word** | Take the mechanic, never the topic or the phrasing | `OBSERVATIONS.md` — every entry records the mechanic separately from the source |
| 8 | **Track actual performance and use results to improve the next batch** | One row per week in `../measurement/weekly-tracker.csv` | You. The tracker does not fill itself. |
| 9 | **One offer, don't confuse them with a choice** | One offer, one price, one word, one ask | `npm run copy:check` |
| 10 | **Care for them** | Something usable even if they never buy; state the limit; say what happens next | `06-COPYWRITING.md` §1 |
| 11 | **Nothing invented** | No fake results, clients, testimonials, numbers or urgency | `copy:check` + `story` |
| 12 | **Volume stays up** | Not fewer than 3 posts a day | Your call; the plan is built at 3 |

---

## The three gates before anything goes out

Run these every time. They take about eight seconds together.

```bash
npm run copy:check          # words: vague, hype, one offer, reader-first
npm run story -- <file>     # structure: hook, turn, pace, limit
npm run audit:november      # the month: hooks, pace, repeated openings
```

**A red gate is not an opinion.** It is a thing that will cost you money later. Fix it or consciously
overrule it — but write down why, in `../DECISIONS.md`.

---

## The five questions, when you are unsure

Answer these before you write a word. If you cannot answer one, you are not ready to write — you are
ready to *look*.

1. **Who exactly is this for?** Not "small businesses". *A vendor in Yaba who lost three customers this
   week and does not know why.*
2. **What do they already believe?** (Schwartz's awareness stage. Cold DM = problem-aware at best.)
3. **What is the one specific thing I am showing them?** A page, a chat, a number, a sentence.
4. **What do they lose if they do nothing?** Name the loss, not the benefit.
5. **What is the one ask?** One word, one price, one place.

---

## What "capable partner" sounds like

This rule is the easiest to break by accident, because fear sells in the short term and it is
everywhere in this niche.

| Do not write | Write |
|---|---|
| "Most small businesses are failing at marketing." | "Most pages I read have the same three gaps. Yours probably has one of them." |
| "You're losing customers every day!" | "Three customers asked and left last month. That is the whole leak." |
| "Let me save your business." | "I can see it because I'm outside. You can fix it because you're inside." |
| "You need to do this or you'll be left behind." | "This is worth twenty minutes. If it is not, skip it — the post will still be here." |
| "Beginners always get this wrong." | "This one catches almost everyone, including me." |

**The test:** would you send this line to a friend who runs a shop? If you would be embarrassed, it
is not copy. It is pressure.
