# Easywurld — master visual template production prompt v1.0

Use this file to create/replace **template layouts**, not to generate fabricated client work or hundreds of posts. Brand: intelligent, calm, confident, strategic, human. Slogan: **Simplify. Optimize. Grow.** Beige `#FBE7C5`, deep green `#144D3C`, white/black support, gold `#D4AF37` only as a purposeful micro-accent. Lora editorial display; Canva Sans UI/body (licensed local file required for final export). Use precise, typographic, editorial structure, not a recolour-only grid. Do not insert fake platform UI, live screenshots, results, portraits, star ratings, prices or logos with uncertain rights.

## Non-negotiable platform-occlusion rule — added from owner feedback

**Never place the first-slide hook, main message, critical evidence, offer conditions, CTA, link/DM instruction, slide number needed for sequence or story poll/question prompt where a platform's caption, action rail, account header, reply bar, sticker, crop or composer control could cover it.** Put essential meaning wholly inside the content-safe rectangle. Put only dispensable motifs/bleed colour outside. Treat the rects below as **internal conservative starting envelopes**, not official universal platform policy. Preview a real exported file in the actual account's current composer and on an Android phone; if any important text is clipped or covered, reflow the design and check again. A safety overlay in `preview.html` is for checking, not part of a public export.

| Placement / file | Canvas | Internal essential-content envelope (pixels, x1 y1 x2 y2) | Exclusion to plan for |
|---|---|---|---|
| Instagram/Facebook feed carousel master | 1080×1350 (4:5) | `110 155 970 1170` | top account chrome, feed crop, bottom controls/caption; verify composer |
| TikTok photo adaptation | 1080×1920 (9:16 optional reflow) | `110 300 850 1460` | top name, right actions, bottom caption/audio/CTA; do **not** merely stretch/crop 4:5 |
| Instagram/Facebook story | 1080×1920 (9:16) | `110 260 970 1500` | top account bar, bottom reply/links; reserve central `x160–920 y1110–1390` for actual sticker where needed |
| LinkedIn document page | 1080×1350 (4:5) | `110 155 970 1180` | document crop, controls/caption; verify upload preview |
| LinkedIn square graphic | 1200×1200 | `110 135 1090 1030` | possible thumbnail crop and feed controls |
| LinkedIn landscape graphic | 1200×628 | `110 120 1090 520` | feed crop; avoid long body copy |

**No fake buttons:** story layouts draw a *reserved blank zone* annotated `NATIVE STICKER SPACE / add in app` outside that zone's essential text, not a fake interactive button. Story conversion layouts reserve a link/contact-sticker space only after destination and offer verification. When a photo/image is unavailable or rights unclear, use a vector diagram/negative space; do not fabricate a documentary screenshot. TikTok 9:16 cover reflows to a narrower x-range and shifts information upward; the 4:5 master stays 4:5 for IG/FB. Do not assume any fixed safe zone overrides current account-specific overlays.

## Design instructions

1. Start from the **series purpose**, not a shared card. Use the family-specific concept and its four layouts (cover, two different interiors, final) from `TEMPLATE_INDEX.md`. Select a type treatment, diagram grammar, evidence/footnote pattern, and placement appropriate to that family.
2. Headline 76–104 px on 4:5 cover (with conservative wrap); internal headline 54–72 px; body 34–42 px; labels 21–27 px; slide number 20–24 px. For story, headline 72–98 px and body 40–52 px; for LinkedIn square/landscape simplify hierarchy accordingly. Lora line-height 1.1–1.18; Canva Sans 1.28–1.45. Avoid under-30 px informational copy at 1080 except source footnotes, which must still remain readable when resized.
3. Use a 12-column implied grid with 110 px essential-text inset for 4:5, 28–46 px vertical gaps, and one dominant focal point. One hook, one idea per slide; keep the supporting image/diagram subordinate. Put the brand name on cover or final, not as a repeated watermark on every slide.
4. Make every sample claim, quotation, source reference and price truthful. Label `ILLUSTRATIVE EXAMPLE` or `SAMPLE` if it is invented. For offer layouts use `[VERIFY CURRENT TERMS]`; never publish the placeholder. Obtain G1 claim/offer approval and G3 rights/production, then G4 final asset/platform approval from the named reviewer before scheduling.
5. For future replacement, edit named `<g id="content-...">` text groups or regenerate from the editable `library.py` sample data. If content runs long, rewrap/reflow before reducing below the minimum type size; never clip, shrink invisibly, or push essential text into UI zones. Replace fallback fonts with licensed Lora/Canva Sans in the chosen design tool, then export PNG/JPG/PDF at target size, check crop/contrast/legibility/slide order on a phone and log actual platform preview.

**Stop condition:** if proof, font rights, source terms, sticker placement or platform visibility is unknown, output `HOLD — visual review needed` instead of asserting that the template or asset has been approved.
