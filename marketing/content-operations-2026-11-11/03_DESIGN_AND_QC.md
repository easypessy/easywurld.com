# Design library, checks and pilot limitations

Nine actual editable SVG templates exist in `templates/`: diagnosis, education, myth, niche, before-after, copywriting, automation, offer and brand. Each is a 1080×1350 text-and-shape source with purposeful variants (question, contrast, progression, checklist, metric, closing). They are **starting layouts**, not fully finished artwork. The pilot exports 81 numbered carousel SVG slides and three 1080×1920 story SVGs in `output/pilot/svg/`; they have editable text, a 78px editorial inset, beige/green colours, varying diagram motifs and an exact ID/order stamp. No third-party illustration or synthetic screenshot is used. Visual directions in the Markdown describe additional elements for an art director; a label/motif alone does not fulfil that full art direction.

Requested brand typography: Lora headings, Canva Sans body. SVG declares these families and falls back to Georgia/Arial when not installed. The sandbox has not verified or licensed the Canva Sans font; final assets MUST be opened in an approved design tool with correct fonts/rights, then exported and inspected on an actual phone before G3/G4. SVGs are not Instagram/TikTok upload-ready JPGs or a finished LinkedIn document. The nine template sources can be edited as SVG in compatible tools. Brand slogan and colour values are in code; existing logo artwork should be reviewed before integrating it, not stamped on every slide.

## Weighted scorecard (100)

| Criterion | Weight |
|---|---:|
| Hook strength | 15 |
| Accuracy and research | 15 |
| Copywriting quality | 15 |
| Practical usefulness | 15 |
| Storytelling and flow | 10 |
| Visual design and readability | 15 |
| Audience relevance | 5 |
| CTA effectiveness | 5 |
| Brand consistency | 5 |

**Pass arithmetic:** 85/100, scored 0–5 per criterion weighted /5. **Mandatory veto:** serious factual/misleading claim, copyright/rights, privacy or brand violation; approval is blocked regardless of score. Reviewer records source checks, exact asset version, font/visual rights, mobile legibility, contrast, crop, alt text/caption, hashtag relevance, destination and platform rules. Existing G0–G5 meanings are unchanged. The offline console stores a reviewer-entered G4-eligibility note, **not** a signed release or a social scheduling command. All pilot items are currently unscored and held.

## Visual inspection that has *not* happened

SVGs were XML parsed and copy/asset references validated; no trustworthy renderer/browser or licensed Canva Sans font is available in this sandbox. **No phone preview, visual contrast test, page-by-page art-direction check, raster export, platform crop test, logo rights review or human signoff** has been completed. Do not equate “81 files” with 81 production-ready slides. The story SVGs likewise need interactive stickers placed in the real app after review.
