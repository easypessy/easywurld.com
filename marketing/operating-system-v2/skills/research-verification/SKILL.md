---
name: research-verification
description: Use whenever Easywurld copy or strategy relies on a statistic, platform policy, market trend, third-party example, price, attribution or named offer.
compatibility: Markdown reference; manual invocation in Arena. Claude Code discovery untested. Search access varies by environment.
---
# Easywurld Research Verification

**Purpose:** Keep claims testable and qualified; applies to content, websites, automation and business documents.

**Inputs:** draft exact wording (including implied claim), intended audience/channel/date, proposed source links, permission to use first-party material, evidence expiry/reviewer.

**Workflow:**
1. Extract every fact, comparison, attribution, result, quote and materially implied promise. Label `observed`, `documented external`, `inference`, `illustration`, `opinion`, or `unknown`.
2. Open the original source where possible; capture title, author/publisher, publication and check dates, exact supporting passage, scope, method, limitations and rights. Trace copied summaries to primary material. If inaccessible, flag, do not invent a citation.
3. Check whether source actually supports **this wording** and geography/time; qualify or remove unsupported assertions. Platform algorithm and trends expire rapidly; check official current guidance immediately before release.
4. Record in claims register: claim, implied claim, evidence, qualifiers, allowed placement, owner, review date, decision `pass / revise / hold`.
5. Send to G1 claims reviewer and G4 release reviewer; no automated approval.

**Tools/dependencies:** approved browser/search, repository source ledger and file comparison. No external API key or confidential upload required.

**Output:** `claims-register.csv` plus short evidence memo and unresolved questions. If all claims are illustrative, state that and mark slides/captions accordingly.

**Quality:** citations link to genuine supporting text; no extrapolated performance or fabricated testimonials. **Fail/hold:** inaccessible source presented as verified, outdated platform rule treated as current, hypothetical customer represented as real, unauthorised source material, or reviewer missing.

**Test:** input “Our bot doubles sales” with no sales data; expected `hold`, not a softer invented percent. Input “Illustrative order reply” with labelled example; expected permissible as sample, not a measured result. References: `../../../ai-training/modules/09-quality-safety-rights-and-governance.md`, `../../../ai-training/modules/11-sourcebook-and-evidence-policy.md`.
