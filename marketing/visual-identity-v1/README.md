# Easywurld editorial visual system · v1.0

**[Open the live template gallery](preview.html)** to browse the actual editable files; use **Show safe areas** to check where the owner’s message, CTA and story-sticker space sit relative to provisional app chrome. **[Review all 85 layouts in Google Slides](https://docs.google.com/presentation/d/1Uy20zdmNa_xCBx_9Xx23iU_HtaLGRrNIIYYHnhMqnEs/edit?usp=drivesdk)**; the [Drive handoff](DRIVE_HANDOFF.md) links every source folder and the [approval checklist](APPROVAL_CHECKLIST.md). This is a separate new design library; the Nov 11 pilot and older campaigns remain untouched.

| Deliverable | Location |
|---|---|
| Existing asset/tool/prompt audit | `00_AUDIT.md` |
| **Master visual production prompt**, including new UI/caption-occlusion requirement | `01_MASTER_VISUAL_PROMPT.md` |
| 85 individually editable self-contained SVG source files | `TEMPLATE_LIBRARY/` |
| Exact role, size and essential safe rectangles per file | `manifest.json` |
| Family art direction, typography, replacement/export guide | `TEMPLATE_INDEX.md` |
| Responsive gallery with optional safe-area/sticker overlay | `preview.html` / `index.html` |
| 22 long-headline/text-heavy visual stress proofs | `TEST_PROOFS/` (QA only, not a post library) |
| Structural + render QA and remaining release holds | `check.py`, `QA_REPORT.md` |
| Reproducible source | `library.py`, `make_gallery.py` |

**Counts:** 44 carousel SVGs (11 × four slide roles), 11 9:16 TikTok photo-cover *reflows*, 12 story SVGs, 12 LinkedIn family starting SVGs plus 5 extra document-interior layouts, and 1 component sheet = **85 editable source files**. SVG is a text/vector source, **not a Canva-native file**. The gallery is a browser for source files, not a publishing platform. No logo/photo rights, font licence or platform account is assumed. No new content posts have been scheduled or published.

**Platform safety:** the most important new rule is in `01_MASTER_VISUAL_PROMPT.md`: the hook, meaningful evidence, CTA, prices/conditions and prompts must stay within the internal conservative content envelope, away from possible account header, right action rail, caption and bottom reply overlay. An outlined overlay in the gallery is for *review only*; actual platform controls vary and must be tested in a real composer. A final export fails review if any essential message is covered. Story layouts leave native sticker space blank, never fake a button.

**Editing:** open a family folder, copy the role SVG into a working asset folder, edit named `content-*` text groups in SVG/vector editor, replace placeholder/example facts only with approved claims, adjust wrapping and licensed fonts, export at the target dimensions and phone-check each slide. Regeneration by `library.py` overwrites generated SVGs **within this new library**; port edits back into source first. See `TEMPLATE_INDEX.md` for all family-specific rules. Run `python marketing/visual-identity-v1/check.py` after changing any source; structural PASS never means G3/G4 release.

**Holds:** no local Canva Sans or Lora font files were found and neither font licence nor account-specific UI crop has been verified. None of these templates is a final, ready-to-publish campaign asset. See `QA_REPORT.md`.
