---
name: marketing-intelligence
description: Use for Easywurld market, audience, competitor or opportunity diagnosis before a marketing recommendation. Produces a sourced decision brief, not fabricated research.
compatibility: Markdown reference; manual invocation in Arena. Claude Code discovery untested. No external credentials required.
---
# Easywurld Marketing Intelligence

**Purpose:** Turn a vague growth request into one evidence-backed audience, problem, choice and test under curriculum G0/G1. Never treat this skill as approval.

**Required inputs:** project ID/owner/approver, business and confirmed offer, market and audience, baseline window, available customer-language evidence, competing alternatives, constraints, approved brand profile. Unknown = `UNKNOWN—CONFIRM`.

**Workflow:**
1. LISTEN: record requested outcome, channel, buyer decision, timeframe and what the team can actually measure.
2. DIAGNOSE: collect owner-approved first-party observations; compare at least two alternatives and separate observation, external source, inference and hypothesis. Record source/date/permission and contradiction.
3. DECIDE: recommend one primary buyer problem, one positioning statement and one measurable next action; name two things **not** to attempt yet. Do not infer market size, segment preference or conversion from views.
4. Handoff via BLUF + source ledger + risk + next action to strategy G1 approver; wait for signed decision before creative claims.

**Tools/dependencies:** repository files, authorized customer/analytics exports if provided; `gh` or web search for public primary sources. Never scrape private communities or send confidential input to unapproved providers.

**Output:** dated `intelligence-brief.md` with audience/need, alternatives, evidence table (claim/source/date/confidence/limitation), message hypothesis, baseline, KPI definition, recommendation, unknowns and approver field.

**Quality:** every factual claim traceable; buyer's words quoted only if authentic and permissioned; counter-argument included; success metric informs a decision, not vanity reach. **Fail/hold:** missing source for a market fact, invented interview, unverified offer, missing G1 approver or conflicting client profile.

**Test:** given a made-up café brief and no data, output `UNKNOWN—CONFIRM` for sales/competitor figures, one hypothetical test and G1 pending. Reject output that asserts the café's conversion rate or declares an approved strategy. References: `../../00_AUDIT_AND_DECISIONS.md`, `../../../ai-training/modules/00-department-operating-system.md`, `../../../ai-training/modules/01-market-intelligence-and-strategy.md`, `../../../ai-training/modules/11-sourcebook-and-evidence-policy.md`.
