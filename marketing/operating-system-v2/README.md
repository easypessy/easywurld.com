# Easywurld operating-system v2 — separate draft track

**Keep the old work.** This folder does not edit `NOVEMBER_DELIVERY`, `marketing/series-plan.json`, `marketing/ai-training`, or `marketing/carousel-first-2026-11-07`. The user supplied v2 operating direction; the existing curriculum module 00–12 and G0–G5 still govern release. The clarification about new dates, cadence and skill scope was skipped, so this is an **unapproved proposal**.

## Deliverables

| Item | Location / state |
|---|---|
| Workspace/prompt/content audit and unresolved decisions | `00_AUDIT_AND_DECISIONS.md` |
| External/primary-source research and weighted rubric | `01_RESOURCE_REVIEW.md`, `02_RESOURCE_REGISTRY.csv` |
| License and security review, approved/experimental/rejected classification | `07_LICENSE_AND_SECURITY.md`, `02_RESOURCE_REGISTRY.csv` |
| 18-skill roadmap; seven original draft departments plus one cross-cutting human-intelligence/editorial review skill | `03_SKILL_ROADMAP.md`, `skills/*/SKILL.md` |
| Claude/Arena manual adapter and gate precedence | `04_INTEGRATION_AND_APPROVAL.md` |
| December draft QA and content source register | `05_CONTENT_QA.md`, `06_RESEARCH_SOURCE_REGISTER.md` |
| 30-day new topic calendar and 330 editable draft packages | `december-2026-DRAFT/30_DAY_CALENDAR.md`, `calendar.csv`, `2026-12-02.md` … `2026-12-31.md`, `posts.json` |
| Duplicate screening and unapproved publishing tracker | `december-2026-DRAFT/duplication-screen.csv`, `publishing-tracker.csv` |
| Rebuild and structural validation | `build_calendar.py`, `check.py` |

**Counts:** 30 assumed dates × 11 series = 330 **editorial draft** carousel packages; 2,040 numbered slide-copy blocks with individual visual instructions and five channel-text adaptations per package. No final artwork or PDF rendered; no posting timetable approved; no platform queued/verified; 0 posts scheduled. The drafts reuse series architecture and 30 authored hypothetical sector situations; they need individual editorial and source review before G2/G3. Eight local skills are drafted and structural-checkable: seven of the original 18-department roadmap plus the additional cross-cutting `easywurld-human-intelligence-and-editorial-system` review skill. The other 11 roadmap skills remain planned, **not** implemented. Structural checks never constitute human assessment or G4 approval. No third-party software installed or run by this v2 effort.

**Next decision:** owner confirms start date, cadence/times, brand/font rights, availability of services/offers and release approver. Then select a manageable batch for human copy rewrite, create assets, test on a phone and advance G0–G4. Do not publish the CSV as though it were a confirmed schedule.

Run `python marketing/operating-system-v2/check.py` for structural checks. `python marketing/operating-system-v2/build_calendar.py` regenerates `december-2026-DRAFT` from authored situations in the script, except the readable `30_DAY_CALENDAR.md` index; do not edit generated packages without also updating the source. Structural checks do not confer approval.
