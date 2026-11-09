# Easywurld · November 11–30, 2026 — current content review

**Visual direction was approved for drafting only. Nothing here is a final post, booked slot, verified offer or publication approval.** This is separate from the older campaign and remains an alternative until real account queues are checked.

## Open the drafts

- [Browse all 20 dates](output/index.html) in the mobile-friendly preview (served by the November content review process on port 8092).
- [Batch 01 — 11–13 November combined](output/BATCH_01_COMBINED.md): **23 existing 11 Nov pilot masters imported**, plus **46 newly authored 12–13 Nov masters**.
- [Batch 02 — 14–20 November combined](output/BATCH_02_COMBINED.md), [Batch 03 — 21–27 November combined](output/BATCH_03_COMBINED.md), [Batch 04 — 28–30 November combined](output/BATCH_04_COMBINED.md): **structured first-pass text drafts**, composed from individually chosen sector questions, exceptions, sample wording and independent 12th angles. These still need a **human line edit and fact-check** before G2; generated structure is not the same as final editorial approval.
- [20-day production status](output/production_status.csv) distinguishes imported, authored and structured first-pass copy. **Copy counts are complete, artwork/rights/gates/scheduling are not.**

## Count and content

20 dates × (12 master carousels + 3 stories + 5 company LinkedIn + 3 personal LinkedIn) = **460 text masters**: 240 carousels with 1,449 individual on-slide text units, 60 story texts, 100 company and 60 personal LinkedIn text drafts. Carousel masters have six slides each except the imported 11 Nov pilot's 81 slides. All are adapted to Instagram, Facebook and TikTok **photo posts** at copy level; no video, reel or voiceover required. The twelfth carousel has a different buyer decision for each day, documented in the day brief; it is not a series rotation. Company and personal LinkedIn voices are distinct; personal wording is proposed for the real account owner to review, not a claimed experience.

Every post names an exact editable SVG *layout reference*, not a finished asset with its words set into the design. The [visual library](../visual-identity-v1/README.md) is a reusable editable design system. Font licensing, actual phone-size layout and account-specific platform overlay previews remain open. Essential text/qualifications/CTAs must be clear of caption rails and buttons. No fake native interaction UI.

## Holds and review

- Hypothetical business examples and sample quotes are **not case studies**. Obtain owner-confirmed operational terms before a final real-world claim. Do not invent clients, statistics, offers, prices or personal experience.
- Every S10 commercial-fit carousel and third/conversion story is **G1 HOLD** until current Easywurld service availability, inclusions, fulfilment, price if any and actual contact destination are confirmed. Do not silently remove holds to meet daily targets.
- LISTEN → DIAGNOSE → DECIDE → CREATE → CHECK → DISTRIBUTE → LEARN. Real sources and audience questions, live queue, times, claims, copy, rights and visual crop each need a named reviewer. A serious factual, privacy, IP or brand issue vetoes release regardless of numeric score. Only a named G3/G4 approver releases an exact export; no schedule or publish API runs here.
- Before G2/G4, apply the [Human Intelligence & Editorial System](../operating-system-v2/skills/easywurld-human-intelligence-and-editorial-system/SKILL.md) and its review card. The worked [November-batch review](../operating-system-v2/skills/easywurld-human-intelligence-and-editorial-system/examples/november-batch-review.md) explicitly flags repeated scaffolds in the 17 structured days; these need human-specific sentence-level rewrites and fact review, not mass scheduling. Measure real observations only after approved publication. If any piece fails evidence or quality, report it as held instead of filling a slot with weak content.

Run `python marketing/november-2026-content-drafts/build.py && python marketing/november-2026-content-drafts/check.py`. Canonical sources: `batch_source.py` for 12–13, the imported old pilot JSON for 11, and `remaining_source.py` plus `remaining_generate.py` for 14–30. Generated files under `output/` are overwritten; edit source, not output.
