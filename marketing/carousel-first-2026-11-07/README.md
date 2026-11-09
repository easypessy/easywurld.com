# Easywurld carousel-first proposal · 7–15 November 2026

**Status: REVIEW DRAFT, not an approved schedule.** This is an add-on to the existing campaign, not a replacement for `NOVEMBER_DELIVERY`, `marketing/series-plan.json`, or Drive November packs. No social platform account or publishing API was available to confirm a scheduled post. At 23:35 WAT on 7 Nov, all remaining Saturday feed slots had expired.

| Deliverable | File |
|---|---|
| Workspace/prompt audit and decisions needed | `00_WORKSPACE_AUDIT.md` |
| Nine-day topic calendar, 11 series/date | `01_NINE_DAY_CALENDAR.md` |
| Complete *draft copy* and numbered art direction, captions and 5 channel variations | `02_COPY_DESIGN_2026-11-07.md` … `02_COPY_DESIGN_2026-11-15.md` |
| Platform adaptation policy and index | `03_PLATFORM_ADAPTATIONS.md` |
| Candidate placement, approval and performance tracker | `04_PUBLISHING_TRACKER.csv` |
| Same-date and historical similarity screening | `05_DUPLICATION_TRACKER.csv` |
| Evidence / research register | `06_RESEARCH_SOURCE_REGISTER.md` |
| QA release decision | `07_QA_REPORT.md` |
| Shared design brief and export checklist | `08_DESIGN_BRIEFS.md` |
| Editable structured copy + reproducible generator/checks | `posts.json`, `build.py`, `check.py` |

**Draft counts:** 99 unique hooks/concepts, 612 slide-copy blocks with individual visual directions; 11 series on all 9 dates. Saturday's 11 are archive-only; future 88 are proposals. Eight separate LinkedIn company document pulls are *optional* and unapproved. No final JPG/PDF carousel assets were rendered; the 99 drafts are not G4-complete production packages. No actual posts scheduled. See QA for gates.

**Production sequence:** read audit → resolve G0/G1 strategy/brand/cadence → approve G2 concepts → confirm sources/rights and design G3 → create/export slides and inspect platform variants G4 → authorized scheduler verifies queue and records confirmation → G5 review after publication. No external skill can bypass these steps.

`python marketing/carousel-first-2026-11-07/build.py` regenerates the dated packages and indexes from hand-authored source data; `python marketing/carousel-first-2026-11-07/check.py` runs structural checks only. Do not regenerate after manual editing of output without copying changes back to `build.py` first.
