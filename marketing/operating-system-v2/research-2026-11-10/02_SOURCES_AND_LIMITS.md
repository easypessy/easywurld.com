# 02 — Sources, method and honest limits

Research pass: **10 November 2026**. Register: `01_FACT_REGISTER.csv` (34 rows). This note says how those rows
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

## What could not be opened, and is therefore marked down

| Source | Problem | Consequence in the register |
|---|---|---|
| ARCON's own vetting guidelines and Standards Panel Form 001 | `arcon.gov.ng` returned HTTP 403 to this environment | The submission procedure is recorded as `NG-ARCON-06` at **secondary** confidence |
| Nigerian Code of Advertising Practice | not retrieved as primary text | The clause that sets pre-exposure clearance is described, not quoted |
| LinkedIn Help — scheduled posts for Pages | HTTP 500 on the official page | `PL-LI-01` is **unverified**; scheduling limits are reported, not confirmed |
| TikTok Music Terms / Commercial Music Library terms | policy pages blocked to this environment | `PL-TT-01` is **secondary**; scope wording comes from licensing commentary |
| NDPA s.65 definition and NDPA penalty schedule | not read in this pass | Registration thresholds are quoted from the Guidance Notice only; penalties are **not** quoted anywhere |

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
