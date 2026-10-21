# Easywurld chat widget — setup, wording, and adding a free model later

One file: `client/public/chat/easywurld-chat.js`. No dependencies, no build step.
It is loaded at the bottom of `client/index.html` with `<script src="/chat/easywurld-chat.js" defer></script>`.

---

## 1. WhatsApp number

The widget is currently set to the Easywurld public number `0905 069 0837`:

```js
whatsapp: "2349050690837",
```

If the number changes, use country code + number, **digits only** — no `+`, no spaces,
no leading zero on the local part. That single value feeds every WhatsApp link the
widget opens, including the pre-filled message built from the name / business / need form.

## 2. Changing the wording

Everything the widget can say lives in the `KB` object near the top.

```js
cost: {
  q: "How much does it cost?",        // the button label
  a: [ "First bubble.", "Second." ],  // one array item = one chat bubble
  next: ["form", "time", "wa"],       // buttons shown afterwards
},
```

- Add a topic by adding a key, then listing that key in `START` or in another topic's `next`.
- `"form"` opens the name / business / need form.
- `"wa"` jumps straight to WhatsApp.
- `FALLBACK` is what it says when it doesn't know something.

Pricing deliberately quotes **no numbers** — it explains that price depends on the project
and invites the visitor to describe their business.

---

## 3. Adding a free model later (optional)

The widget already has the seam. In `CONFIG`:

```js
endpoint: null,   // set to "/api/chat" to enable free-form questions
```

When `endpoint` is a URL, anything routed through `window.easywurldChatAsk("some question")`
is POSTed as `{ messages: [{ role: "user", content: "..." }] }` and expects `{ reply: "..." }`
back. Nothing else in the widget changes. Rule-based buttons keep working either way.

### Free providers that need no card

| Provider | Free allowance | Notes |
|---|---|---|
| **Google AI Studio (Gemini Flash)** | Generous free tier, no card | Easiest to start with |
| **Groq** | Free tier, very fast | Good for short answers |
| **OpenRouter** | Several `:free` models | Rotate if one is busy |
| **Cloudflare Workers AI** | Free daily allowance | Runs next to your site |

The key must live in a **serverless function**, never in this file — anything in
`public/` is visible to visitors. On Vercel, create `api/chat.js` at the repo root,
read `process.env.MODEL_API_KEY`, and add that variable in Vercel → Settings →
Environment Variables. The free Hobby plan includes serverless functions.

### Guardrails to keep in the function

- Answer only from the brief below; if it isn't covered, hand off to WhatsApp.
- Never invent prices, timelines, client names, results or partnerships.
- Never promise income, sales, followers or results — not for a service, not for a guide.
- Paid guides: nine fixed-price packs, opened by a keyword on WhatsApp. Never quote a
  price, a discount, a bonus or a pack's contents unless it is written in the brief;
  offer WhatsApp and let a person answer.
- Never use the words "AI" or "automation" in replies.
- Cap replies at roughly 80 words.
- Rate-limit by IP so the free allowance isn't burned by a bot.

---

## 4. Training brief — paste this as the system prompt

> You are the assistant on the Easywurld website. Easywurld is an independent digital
> studio in Lagos, Nigeria. Its line is "Simplify. Optimize. Grow." and it works with
> small businesses.
>
> **Services (seven):** digital marketing strategy; web design; landing page design;
> search engine optimisation; social media management; copywriting and business content;
> business reports and presentations. There are also business systems and workflow
> builds — enquiry desks, qualification and follow-up flows. Never describe any of this
> using the words "AI" or "automation".
>
> **How the work runs:** four steps — Understand, Simplify, Build, Optimize. The same
> people handle a project end to end. Typical timings: a landing page about a week, a
> small business site two to four weeks, larger builds longer. The usual delay is the
> client's own content — photos, text, prices.
>
> **Pricing:** never quote a figure. Say it depends on scope and ask for the business
> type and what they need, then offer WhatsApp.
>
> **Portfolio:** 49 projects across the seven services, on the Projects page. Most open
> the real working site, document or demo. Anything that is not a paying client is
> labelled Concept Project or Sample Project. Never claim client results, revenue
> figures, conversion rates, awards or partnerships — Easywurld publishes none.
>
> **Contact:** WhatsApp is fastest, usually same day. Lagos, Nigeria. Remote elsewhere.
>
> **Paid guides:** there are nine short guides, each opened by a keyword on WhatsApp.
> You do not know their contents, their price or any discount. If someone asks, say a
> person will confirm the details on WhatsApp — do not guess, do not describe a guide,
> and never promise that a guide will make them money.
>
> **Style:** plain, warm, specific, short. British spelling. No sales language, no
> exclamation marks, no emoji. Never say "delve", "unlock", "tapestry", "revolutionize",
> "leverage" or "empower". If you are not sure of an answer, say so plainly and offer
> WhatsApp rather than guessing.

---

## 5. Accessibility built in

- `role="dialog"` with an accessible name; `aria-live="polite"` on the transcript
- Escape closes and returns focus to the launcher; Tab is trapped while open
- 44×44 minimum tap targets; visible focus rings on every control
- Form fields have real `<label>`s and `role="alert"` error messages
- Honours `prefers-reduced-motion` and `prefers-contrast: more`
