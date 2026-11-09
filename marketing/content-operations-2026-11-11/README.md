# Easywurld · November 11–30 content operations

**New track, not a rewrite of the old repository campaign.** User confirmed **11–30 November 2026** and selected the entire old `Easywurld — November 2026 (by day)` Drive folder for trash. It was **already marked trashed** when checked; this build did not delete it again or permanently purge it. The curriculum and repository originals remain intact.

## Open the actual system

**[Offline Android/desktop operations console](output/studio.html)** · [Full first-day editorial packages](output/pilot/DAY_2026-11-11.md) · [Candidate calendar](output/calendar.csv)

The offline console displays the full pilot, numbered editable SVGs, draft stories and LinkedIn copy, the 20-day calendar, weighted QC/veto checklist, local real-metrics entry, series dashboard and JSON backup/restore. It **does not connect to publishing accounts**, schedule or approve anything. Local browser notes require export to survive device changes.

## Delivered vs not delivered

| Delivered | State |
|---|---|
| Workspace/Drive audit | `00_AUDIT.md` |
| Research engine and claim ledger | `01_RESEARCH_AND_FACT_CHECK.md` |
| 12-carousel/3-story/5+3 LinkedIn and daily release workflows | `02_OPERATING_WORKFLOWS.md` |
| Nine editable SVG templates and weighted QA | `templates/*.svg`, `03_DESIGN_AND_QC.md`, `output/qc_tracker.csv` |
| First day's **12 fully written draft packages**, **81 editable slide SVGs**, 3 story scripts/frames, 5 business + 3 personal LinkedIn text drafts | `output/pilot/`; **G1–G4 pending; no final phone-reviewed art** |
| 20-day candidate calendar, 228 provisional topic prompts for 19 later dates, duplication screen, blank metrics | `output/calendar.csv`, `output/topic_queue.csv`, `output/duplication_screen.csv`, `output/performance.csv`; topics are **not researched or written content** |
| Nine offer inventory | `offer_inventory.csv` — repository-coded, live terms unverified |
| Integration/cost report and honest QA | `04_INTEGRATIONS_COST_BLOCKERS.md`, `05_QA_PILOT_REPORT.md` |
| Self-contained usable offline console | `output/studio.html`; mobile CSS, local QC and metrics, backup/restore |
| Reproducible build and tests | `pilot_source.py`, `build.py`, `check.py`, `studio.template.html` |

**Not yet delivered:** authored Nov 12–30 content (19 days), approved timetable, signed approvals, final artwork with licensed fonts, actual social account connection, live slot audit, scheduled/published posts or performance results. The 20-day calendar reserves **940 candidate rows**: 720 feed adaptations, 60 master-story placeholders (channel TBD) and 160 LinkedIn posts. Only 11 Nov's **23 master pieces** have editorial drafts. A planning row is not an asset or a post. This volume must not drive low-quality mass generation.

## Daily use

1. Confirm live queue, date and approved time in each account. Open `output/studio.html` or the CSV; do not use old campaign slots automatically.
2. Work LISTEN → DIAGNOSE → DECIDE → CREATE → CHECK → DISTRIBUTE → LEARN. Use the source ledger and `pilot_source.py` as the canonical **draft**. Edit the source, then regenerate: `python marketing/content-operations-2026-11-11/build.py`.
3. Have a human review source, offer terms, rights, copy and visual quality; score with the 100-point rubric. A serious truth/privacy/right/brand breach vetoes approval. Only the named release approver can release after G4.
4. In a licensed editor, replace font fallbacks with **Lora + Canva Sans**, finish art, export carousel images in order and check on a phone. Stories need native interactive stickers where supported. Manually schedule only after platform confirmation, recording the exact platform ID/URL in the tracker/export.
5. After publication, record platform metrics with source/date and business-relevant enquiry definitions. Use real results to choose the next content batch. Browser entries are local: export a backup after every review.

Check: `python marketing/content-operations-2026-11-11/check.py`. It validates structure only, **not** the 85/100 human score, real account access or publication. Regeneration overwrites **this folder's generated `output/`** (including `studio.html`) but not browser-local notes or prior campaigns; copy any manually edited output back to the canonical source first.
