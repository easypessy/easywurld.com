# Easywurld visual library v1.0 — art direction & replacement index

Open [`preview.html`](preview.html) (served over HTTP for the gallery) or the SVGs directly. **85 self-contained editable SVGs:** 44 carousel pages (11 families × cover + two different interiors + conclusion), 11 reflowed TikTok photo covers, 12 stories (four each category), 17 LinkedIn pages (seven company families + five personal families, plus five document internals), and one component sheet. `manifest.json` lists exact paths, canvas sizes and conservative safe rectangles. The 22 files in `TEST_PROOFS/` are stress tests, **not extra deliverables to post**. Design and copy are sample/illustrative; no G3/G4 approval.

## Carousel families — 1080×1350 SVG masters

Every family contains `cover.svg`, `interior-a.svg`, `interior-b.svg`, `conclusion.svg` and a `tiktok-photo-cover.svg` **reflow** (1080×1920, narrower text lane and raised content to avoid bottom/right overlay). Future posts can repeat/interleave the two internal layouts; do not force a four-slide finished post. A real carousel can use 6–10 slides, alternating suitable pages with one idea per slide.

| Family | Art direction / visual grammar | Cover → internal A → internal B → close | Image treatment / practical replacement |
|---|---|---|---|
| 01 Marketing Diagnosis | Consulting report with a folded evidence sheet, numbered findings and a broken decision path. | Hidden issue → evidence ledger → three-stage gap → action to audit. | Use permissioned, anonymised inputs; never display a fake analytics screenshot. Replace finding rows with checked buyer questions. |
| 02 Marketing Education | Learning journal with a chapter spine, circles for a framework and staggered steps. | Lesson → chapter/step explanation → numbered process → one takeaway. | Use line diagrams, not stock classroom photography. Replace three steps with the real sequence. |
| 03 Myths and Truths | Investigative file: struck/redacted claim, contextual evidence and a restrained verdict seal. | Claim → source context → claim/context/verdict progression → a testable correction. | Do not show a fake source or crop a creator's ad; record real source/date in caption or final footnote. |
| 04 Relatable Enemy | Culture magazine's interrupted dialogue rather than a meme panel. | Shared frustration → speech contrast → ‘we say / they hear’ → named human action. | If photo is useful, crop an owned or licensed contextual image with proof of rights; otherwise keep the vector editorial layout. |
| 05 If I Were Hired Today | Hypothetical strategy folio with a distinctive bicycle-repair route drawing and a two-axis priority map. | Niche situation → first inquiry → prioritisation map → first move. | Replace the bicycle vector with *niche-specific licensed/owned* imagery or a custom vector. Keep HYPOTHETICAL label; never imply a client engagement. |
| 06 Client Process | Service blueprint with G0–G4 gate nodes and a claim approval/return fork. | The claim → verified owner → decision fork → accountable handoff. | Diagram actual stages only; G0/G1/G2/G3/G4 meanings come from curriculum module 00. No fake clients/testimonials. |
| 07 Proof & Demonstration | Portfolio specimen / redline sheets with an explicit SAMPLE before/after comparison. | Problem → sample baseline → annotated change → qualified conclusion. | Label hypothetical samples; for real work obtain permission and preserve exact original/provenance. Never claim a lift without data. |
| 08 Growth & Copywriting | Literary marginal notes, highlighted phrase and a line-level editing proof. | Principle → vague example → checkable edit → practical rewrite task. | Quote briefly only with real source, correct context and rights. No invented expert endorsement. |
| 09 AI & Automation | Systems architecture with input/rule/human nodes and a stop/exception fork. | Human boundary → route → stop rule → sandbox test. | Interfaces are **diagram abstractions**, not synthetic screenshots of a deployed product. Keep consent/privacy and human gate visible. |
| 10 Offer & Solution | Direct-response offer specification instead of a sales sticker; included/excluded/terms ledger. | Buyer need → scope → exclusions/verification → ask what is currently available. | `[VERIFY CURRENT TERMS]` is a deliberate G1 hold, not publishable copy. Insert only owner-confirmed current price, inclusions and destination. |
| 11 Meet Easywurld | Agency manifesto with monumental S/O/G initials and three aligned principles. | Brand thought → belief → working pillars → invitation. | Use own/permissioned agency imagery only; no fake founder portrait. Brand name appears intentionally on cover/close, not every slide. |

**Typography:** Lora cover/statement 75–88 px in included sample; internal 68–74 px; body/diagram labels usually Canva Sans 21–42 px (22 px labels in masters are secondary to the headline; final informational copy should be phone-tested). Type line spacing for headings ≈1.19, explanatory text ≈1.36. Brand palette beige `#FBE7C5`, green `#144D3C`, white/black for support, gold `#D4AF37` reserved for sparing emphasis (not required in every template). Footer and page numbers remain inside the internal safe rectangle. SVG declares font families but **does not bundle** licensed files; a reviewer must replace fallbacks and re-check line breaks.

## Stories — twelve 1080×1920 SVGs

| Category | Four layouts | Interaction / safety |
|---|---|---|
| Engagement | `01_poll`, `02_question`, `03_this_or_that`, `04_opinion` | Main question and context at y310–855; leave x160–920/y1110–1390 empty for a **real native sticker**, not a drawn button. Check the final app's UI. |
| Education | `01_one_minute_lesson`, `02_tip`, `03_myth_truth`, `04_continuation` | Main insight above y1110; takeaway box at y1115–1355. Continuation links only to an actually published, approved carousel. |
| Conversion | `01_service_spotlight`, `02_offer`, `03_problem_solution`, `04_direct_enquiry` | Short CTA inside y1130–1320; destination/current terms held until G1. Link/contact sticker only after confirming composer capabilities and actual inbox owner. |

Stories deliberately do not imitate native poll buttons. Blank engagement zone is a design reservation, not an interface element. Top y0–260 and bottom y1500–1920 are not for essential copy. Confirm current interface overlays at export time.

## LinkedIn — seven company / five personal visual families

Company page: `01_insight` (square 1200×1200 index), `02_education_document` (1080×1350 editorial cover plus three internal document layouts), `03_diagnosis` (square report), `04_strategy_framework` (document network), `05_service_explanation` (square scope spec), `06_practical_demo` (document sample before/after plus internal), `07_principle` (landscape 1200×628). Use substantive native text with graphics when helpful; do not force every post to be a document.

Personal page: `01_observation` (square marginal note), `02_lessons_learned` (document notebook), `03_industry_opinion` (landscape point of view), `04_project_update` (square progress), `05_educational_breakdown` (document annotation plus internal). These are **editorial proposals**, not a real account holder's experience. A person must verify first-person language and approve their use. No fake portrait, project update, certificate or result is supplied.

## Component source, art direction and export

`TEMPLATE_LIBRARY/COMPONENTS/COMPONENT_LIBRARY.svg` provides actual editable headline hierarchy, section label, evidence/comparison frames, process connector, sample-not-client notice, source footnote and CTA band. Apply the components selectively: do not create a clone of every series. Thin dividers are 1–3 px, main inset 110 px, x-grids aligned to 110/970, decorative parts allowed to bleed only if they convey no essential copy. On source SVGs `<g id="content-headline">`, `<g id="content-body">`, `<g id="content-cta">` etc. hold editable text. All graphics are vector shapes; no remote dependencies.

**Replacement workflow:** pick family and slide role → copy SVG into an *asset-specific* working folder → edit its named text groups in a vector editor or update `library.py` and regenerate → adjust wrapping and layout for copy length (see stress proofs; never force small invisible type) → replace optional imagery with permissioned niche-specific work → verify facts/terms and alt text → export PNG/JPG at exact feed/story dimensions or PDF document pages for LinkedIn → check rendered order/crop/right rail/caption and interface on an actual phone → document G3/G4 decisions. Do not use a template as approval for the content placed into it. `library.py` regeneration overwrites generated files in **this new library only**; do not hand-edit a source SVG and then regenerate without porting its edits back to `library.py`.
