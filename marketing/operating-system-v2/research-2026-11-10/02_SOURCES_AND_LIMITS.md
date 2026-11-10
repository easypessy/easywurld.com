# 02 — Sources, method and honest limits

Research pass: **10 November 2026**. Register: `01_FACT_REGISTER.csv` (38 rows). This note says how those rows
were checked and where the research is still thin, so nobody mistakes a register entry for legal advice.

## What was actually opened

| Source | Type | Used for | Read on |
|---|---|---|---|
| Advertising Regulatory Council of Nigeria Act, 2022 (Act No. 23), Nigeria Official Gazette — Policy and Legal Advocacy Centre copy | primary statute, full text | ARCON powers, objectives, Standards Panel, offences and statutory minimum fines | 2026-11-10 |
| Nigeria Data Protection Act, 2023 (Act No. 37) — Nigeria Data Protection Commission copy | primary statute, full text | data principles, lawful basis, consent, notice, data-subject rights, automated decisions, breach reporting, cross-border transfer | 2026-11-10 |
| NDPC Guidance Notice on Registration of Data Controllers and Processors of Major Importance (NDPC/HQ/GN/VOL.03/B/24) | regulator guidance, full text | the 200-in-six-months threshold, sector list, fee categories | 2026-11-10 |
| FCCPA 2018 ss.114, 115, 123, 125, 126, 129 | statute text via a public statute compendium | plain language, displayed price, marketing standards, misleading representation, testimonials, void terms | 2026-11-10 |
| Meta Advertising Standards — introduction and Privacy Violations/Personal Attributes | platform policy, full text | ad review process, re-review, personal-attribute rule | 2026-11-10 |
| Meta Music Guidelines (effective 26 March 2024) | platform policy, full text | commercial use of music, muting/removal, music density | 2026-11-10 |
| WhatsApp Business Messaging Policy | platform policy, full text | opt-in, approved templates, 24-hour service window, escalation path | 2026-11-10 |
| FCCPC consumer-rights pages and enforcement releases | regulator | evidence that description/quantity enforcement happens | 2026-11-10 |
| Kobocourse, *Digital Products for African Creators: From Idea to First Sale* (2026) | secondary commentary, full text | Nigerian price bands for guides, workbooks and template packs (`MKT-01`) | 2026-11-10 |

## What could not be opened, and is therefore marked down

| Source | Problem | Consequence in the register |
|---|---|---|
| ARCON's own vetting guidelines and Standards Panel Form 001 | `arcon.gov.ng` returned HTTP 403 to this environment | The submission procedure is recorded as `NG-ARCON-06` at **secondary** confidence |
| Nigerian Code of Advertising Practice | not retrieved as primary text | The clause that sets pre-exposure clearance is described, not quoted |
| LinkedIn Help — scheduled posts for Pages | HTTP 500 on the official page | `PL-LI-01` is **unverified**; scheduling limits are reported, not confirmed |
| TikTok Music Terms / Commercial Music Library terms | policy pages blocked to this environment | `PL-TT-01` is **secondary**; scope wording comes from licensing commentary |
| NDPA s.65 definition and NDPA penalty schedule | not read in this pass | Registration thresholds are quoted from the Guidance Notice only; penalties are **not** quoted anywhere |

## The price rows (added when the offer series was rewritten)

The December offer carousels no longer describe services at an unconfirmed scope. They sell the nine
published packs. That made the price itself a claim, so four rows now carry it:

| Row | What it says | Tier / confidence | How to read it |
|---|---|---|---|
| `REPO-04` | The site sells nine packs at ₦5,000 each, ordered by keyword on WhatsApp | repository evidence / verified | Read straight from `client/src/data/offers.ts`. If the figure there changes, this row is stale. |
| `REPO-05` | Custom service work is deliberately unpriced; a pack includes no consultation | repository evidence / verified | Taken from the site's own FAQ. It is why no slide offers bespoke work at a fixed price. |
| `MKT-01` | ₦5,000 sits inside or below published Nigerian ranges for guides and template packs | secondary commentary / verified-secondary | **One commercial blog, not a survey.** It supports "inside a published range" and nothing stronger. It must never be turned into a discount or a struck-through price. |
| `NG-FCCPA-07` (existing) | A displayed price is binding, and the lowest displayed price wins | primary statute / verified | Why the figure on the slides has to equal the figure on the site, exactly, at the moment of posting. |

The market benchmark was checked directly on 2026-11-10. The same page gives: short guides and PDFs
₦2,000–₦10,000, comprehensive workbooks ₦8,000–₦25,000, and template packs of 3–10 items ₦3,000–₦20,000.
Each Easywurld pack is one guide plus three editable files, so ₦5,000 sits at the low end of the
template-pack band and inside the guide band. That is the entire claim the register will support.

**What this does not license.** Three other 2026 Nigerian pricing articles were read in search results and
broadly agree, but they are listed here only as corroboration of direction, not as citations: they were not
opened in full, so they are not register rows. None of them is evidence that ₦5,000 is right for Easywurld's
particular packs, and none of them justifies a "worth ₦X" or "save ₦Y" framing.

## The two reading traps this register is built to prevent

**1. "Meta approved it, so it is legal."** Meta's own standards say advertisers must comply with local laws and
self-regulatory codes *in addition to* Meta policy, and that review is automated, re-run, and can be reversed at
any time (`PL-META-03`). A cleared ad is not a Nigerian clearance.

**2. "ARCON has banned all social media posts."** The statute is real and the penalty is real. What is genuinely
unsettled — and reported inconsistently across Nigerian outlets — is the *scope* of pre-exposure vetting for
ordinary organic posts, and whether administrative fines imposed outside a hearing survive challenge. That
dispute is recorded as `NG-ARCON-07` at **unverified** confidence. Do not let any draft state the settled
position in either direction.

## Method

1. Read the instrument. Quote it. Record the pinpoint (section, subsection, paragraph).
2. If only commentary was reachable, mark `secondary` or `unverified` and write a `caveat` saying what would
   change the answer.
3. Map each draft series to the facts it leans on (`03_DRAFT_FACT_PACKETS.md`), and each regulated sector to its
   extra facts.
4. Push what a source cannot answer into `05_OWNER_VERIFICATION_CHECKLIST.md` instead of guessing.
5. Regenerate rather than hand-edit: `python marketing/operating-system-v2/research_facts.py`.

## Refresh rules

| Row type | Re-check |
|---|---|
| Platform policy (`PL-*`) | Before every batch that uses it — these change fastest |
| Regulator guidance (`NG-NDPA-10`, `NG-ARCON-07`) | Before any client-facing claim about obligations |
| Statute (`NG-ARCON-*`, `NG-FCCPA-*`, `NG-NDPA-*`) | Annually, and whenever a lawyer flags an amendment |
| Repository evidence (`REPO-*`) | Whenever the underlying file changes |

## Limits you should hold onto

- **Not legal advice.** Every row is a pointer to a source plus a plain-language gloss. A qualified Nigerian
  lawyer should review anything that goes into a client deliverable or a public claim about the law.
- **Snapshot, not a subscription.** Nothing here updates itself. `checked` is the only date that counts.
- **No compliance conclusion.** Attaching facts to a draft does not make the draft compliant, approved,
  on-brand, readable, or publishable. The G0–G5 gates still hold, and only a named release approver clears G4.
- **Secondary sources are named as secondary.** Where a row says `secondary commentary`, a reader can see that
  the wording came from a firm's summary and go read the instrument themselves.
