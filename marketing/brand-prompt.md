# Easywurld — master brand and AI production prompt

**Active plan:** 2 November–1 December 2026. Read [STRATEGY.md](./STRATEGY.md) first, then use the post-specific brief in [the calendar](./calendar/30-day-calendar.md). This file replaces the old “no people / four posts a day” video rules. The owner has requested AI talking-head content; an approved owner likeness is still required.

## 1. Brand context

> Easywurld is an independent digital studio in Lagos, Nigeria. It helps small businesses make the message, website, content and follow-up work together. Services include digital marketing strategy, web design, landing pages, SEO, social media management, copywriting, business systems and reports. Slogan: “Simplify. Optimize. Grow.” Process: Understand, Simplify, Build, Optimize. Voice: plain, specific, useful and honest. No inflated client claims.

**Audience:** owner-led small businesses in Lagos and across Nigeria.
**Primary action:** a relevant WhatsApp enquiry, a well-matched DIY pack purchase, or a useful save/share. One action per post.
**Contact in the current site source:** WhatsApp 0905 069 0837; https://wa.me/2349050690837.
**Site in the current site source:** https://website-builder-portfolio.vercel.app. Confirm the live destination before publication.

## 2. Visual identity

| Token | Hex | Use |
|---|---|---|
| Cream | `#FAE7C7` | Graphics, captions, cover backgrounds |
| Leaf green | `#27473A` | Real logo mark and primary controls |
| Deep green | `#0A4937` | Headlines and wordmark |
| Terracotta | `#9E4E2C` | One small graphic accent, not a filter over the presenter |
| Ink | `#14170F` | Support text |
| Paper | `#FBF9F4` | Occasional light card |

- **Fraunces:** headlines, wordmark and slogan.
- **Inter:** captions, supporting copy and checklists.
- **JetBrains Mono:** short labels, post IDs and keywords.
- Use the real mark: `client/public/brand/mark.png` or `mark-light.png`. Never ask a generator to redraw it.
- Keep the wordmark and slogan together in the same serif. Do not stretch or recolour the mark.
- The cream-only rule applies to brand graphics, not every video frame. A natural, quiet real-world presenter background is allowed.

## 3. Truth and permission rules

1. All portfolio projects are **concept / sample** work. Label them on screen and in the caption.
2. No invented clients, testimonials, ratings, rankings, sales figures, audience counts or guarantees.
3. A hypothetical price, chat or business must be labelled **example**. Never imitate a real customer's private message.
4. DIY packs and custom projects are different products. State what a pack does not include.
5. The current source lists each pack at **₦5,000**. Confirm price, contents, payment and delivery before a sales post.
6. Do not publish a private CV, identity document, customer record or payment detail.
7. Use only an owner-approved likeness and voice, or a provider avatar licensed for this commercial use. The fictional `demo/img/founder-recording.jpg` is **not** an approved owner portrait.
8. Disclose realistic AI presenters and synthetic speech. Check each destination platform's current settings.
9. Use own/licensed music or the platform's commercially cleared library. Do not assume a trending sound can be reused across platforms.

## 4. Master AI talking-head prompt

Copy this into a suitable avatar/video tool **after** supplying the approved source and checking that tool's consent and commercial-use terms. Fill every bracket from the post brief before generation. Do not publish bracketed instructions.

```text
Create one vertical 9:16 talking-head video for Easywurld, a plain-spoken digital
studio in Lagos, Nigeria.

SOURCE AND PERMISSION
Use only the attached owner-approved portrait/video and the separately approved
voice source. Preserve the person's identity and natural skin texture. Do not
change age, body, ethnicity or facial features. Do not use a stock person or the
fictional portfolio founder. If the approved source is missing, stop and report
the missing input instead of inventing a likeness.

DELIVERY
Chest-up framing, eye-level camera, soft natural light, quiet warm-neutral room.
Steady eye contact, small natural gestures, calm conversational pace. No waving
intro, exaggerated nodding, sales shouting, fake podcast microphone or glamour
lighting. Keep the face in the central safe area. Do not bake captions, logos,
prices or claims into the generated footage; those are added in the editor.

SCRIPT — speak exactly this approved text, with no extra claims:
[PASTE THE POST'S FULL SCRIPT]

VISUAL INTENTION
Hook: [EXACT HOOK]
Supporting cutaway: [ONE RELEVANT WORKSHEET, SCREEN DEMO OR CHECKLIST]
Final action: [ONE CTA]

Target [DURATION FROM BRIEF]. Generate short sections if the tool cannot maintain
lip sync for the whole script. Leave natural pauses for editorial cutaways.
No testimonials, invented results, customer data, countdowns or guarantees.

DISCLOSURE
The editor will add a visible “AI presenter · Easywurld” label and the platform's
AI-generated disclosure. Do not hide or remove provider provenance metadata.
```

**Voice:** first test the owner's approved cloned voice, or choose a licensed synthetic voice the owner approves. Do not claim a generic voice is the owner's. Check “Easywurld”, “Lagos”, “naira”, “SEO”, “WhatsApp” and every price aloud. Use short sentences and rewrite anything the voice mispronounces. No voice clone without permission.

**If the photo is missing:** use the post's non-avatar fallback. The Monday carousel and the screen demos do not require a synthetic face.

## 5. Format prompts

### Screen demo / annotated walkthrough

```text
Edit the supplied real screen recording into a 9:16 Easywurld walkthrough.
Follow the exact beat order in post [ID]. Crop for readable mobile viewing.
Keep “Concept project · sample build” visible throughout. Use only the supplied
approved narration and accurate captions. Highlight the actual page or document
feature being discussed. Do not invent clicks, dashboard numbers, rankings,
client names or results. Do not imply a sample workflow sent real messages.
```

Record the real repo demo first. A text-to-video model is not evidence of a working product. For EW-026, record the new calendar itself, not an unrelated demo.

### Carousel

```text
Create a five-slide Easywurld carousel, 1080×1350, using the exact supplied copy.
Flat cream #FAE7C7 background, deep-green #0A4937 Fraunces-style headlines,
Inter-style support text and one terracotta #9E4E2C accent. One idea per slide,
generous whitespace, no stock people or decorative clutter. Leave the real logo
for editor placement. If exact text cannot be rendered reliably, create a clean
background only and set the text in Canva, CapCut or another editor.
```

### Relatable static / text meme

```text
Create one original 4:5 Easywurld text-led post using the exact supplied words.
Dry, recognisable small-business humour, followed by a useful resolution in the
caption. Cream background, deep-green serif, one terracotta accent. No copied
meme, fake notification, real customer screenshot or borrowed brand interface.
```

## 6. Editing specification

- Master video: **1080×1920, 9:16, MP4/H.264, 30 fps**, clear voice, captions burned in.
- Carousel: **1080×1350, 4:5**, five PNG slides. Static: one 1080×1350 PNG.
- First frame: the problem and the face/demo already visible. No logo animation.
- Captions: short phrase lines, high contrast, correct spelling and stable timing. Avoid flashing word-by-word karaoke.
- Working safe area: keep essential text roughly within x=80–850 and y=260–1450 on a 1080×1920 frame. This is a conservative house guide, **not an official TikTok guarantee**. Preview against the actual platform UI before posting.
- Put the AI label around x=80, y=220, above the main caption block. Keep it visible for the full video.
- Use a cutaway or small reframe when the idea changes. Do not zoom on every sentence.
- No long end card. Keep the final action inside the useful content.
- Music is optional. If used, keep it well below the voice and confirm commercial and cross-platform rights.

See [PRODUCTION.md](./PRODUCTION.md) for the step-by-step CapCut workflow, weekly batches and publishing checks.

## 7. Caption and CTA rules

Hook → useful explanation or example → one action → relevant hashtags. Include the AI disclosure for synthetic presenters/voices and the sample label for demos. Use 3–5 specific hashtags rather than a large generic block.

Do not stack “comment, save, share, follow, visit and buy” in one post. Use the CTA in the brief. For a DIY offer, name one keyword and tell the buyer to confirm current order details. For a custom project, ask for the business link and the problem, not a vague “DM us”.

## 8. Final review

- [ ] Correct owner likeness/voice permission, or no synthetic person.
- [ ] Script read aloud; facts, prices, names and exclusions checked.
- [ ] Every demo labelled concept/sample; every hypothetical labelled example.
- [ ] Captions corrected; essential text inside the previewed safe area.
- [ ] AI disclosure visible and platform setting enabled where required.
- [ ] Audio licensed for the intended use; no private information on screen.
- [ ] One CTA and a tested destination.
- [ ] Export watched on a phone with sound and muted.
- [ ] Human approval recorded before the sheet says “Ready” or “Scheduled”.
