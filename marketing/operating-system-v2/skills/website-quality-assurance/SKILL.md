---
name: website-quality-assurance
description: Use before launch or after changes to a small-business site: test content accuracy, mobile layout, accessibility, security basics and conversion path with evidence.
compatibility: Manual repository/browser checks; optional Playwright requires a separately reviewed install.
---
# Easywurld Website Quality Assurance

**Purpose:** Test a real buyer journey, not only whether the page builds.

**Inputs:** exact candidate URL/commit, approved service claims and contact route, target browsers/viewport, consented test data, acceptance criteria, deployment owner and rollback path.

**Workflow:**
1. Establish baseline and scope. Check navigation, key service and contact pages on a small phone and desktop; document broken links, overflow, legibility and first actionable screen.
2. Check content truth against approved offer/service register. Label concept portfolio work; do not imply sample projects are clients. Check links, forms, errors and WhatsApp route in a logged-out session.
3. Review keyboard navigation, meaningful heading order, labels, alt text, focus, contrast, motion and touch targets; record manual and tool findings separately. Automated checks never prove full accessibility.
4. Check response errors, HTTPS, secrets exposure, dependency risk, form validation, privacy/consent and backup/rollback. Do not claim a penetration test from a visual review.
5. Run existing build/tests in a disposable environment; compare intended change, screenshots and output; create defects with severity, reproduction steps, evidence and owner.
6. G4 release only after named owner accepts critical fixes and verifies deployment. G5 monitor user reports and broken paths.

**Tools/dependencies:** repo build and browser; optional Playwright after licence/security review. Do not switch frameworks for QA.

**Output:** test matrix, screenshots or reproducible steps, issue list, claim/rights check, release decision and rollback instructions.

**Quality:** test real destination, not source code alone. **Fail/hold:** broken primary CTA, unverified purchase terms, data exposure, missing owner or accessibility blocker.

**Test:** sample contact button pointing at localhost in production must fail; a concept project described as an actual client must fail. References: `../../../ai-training/modules/04-visual-design-and-creative-direction.md`, `../../../ai-training/modules/09-quality-safety-rights-and-governance.md`, `../../../../client/src/pages/Services.tsx`.
