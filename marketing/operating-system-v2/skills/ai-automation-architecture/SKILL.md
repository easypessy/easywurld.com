---
name: ai-automation-architecture
description: Use to scope a small-business assistant or automation with explicit data permissions, human review, exceptions, cost and rollback; never promise a magic chatbot.
compatibility: Tool-neutral Markdown workflow. n8n, Make, MCP and business APIs require separate availability, licence and security checks.
---
# Easywurld AI Automation Architecture

**Purpose:** Solve one repetitive business job safely, not deploy an unchecked agent.

**Inputs:** confirmed current workflow and volume, authorized data fields, exception examples, software/accounts available, business owner, budget/cost ceiling, retention requirements and approved scope.

**Workflow:**
1. Map trigger → inputs → rule → proposed output → human owner → customer-facing action. List exceptions, sensitive inputs and what remains manual.
2. Compare no-code rule, human checklist and AI option on cost, maintenance, failure modes and data access. If a simple rule wins, recommend it.
3. Design state transitions and stop rules: e.g. enquiry received → structured draft → human approval → send → record; a rejected draft cannot send itself. Define timeouts, duplicate detection and opt-out.
4. Produce an anonymised test set: normal, missing field, ambiguous, malicious prompt, expired price, sensitive query, duplicate and provider outage. Document expected safe behaviour and manual fallback.
5. Check chosen platform's licence, API permissions, credentials storage, webhooks, logging/retention, rate limits, billing and rollback. Gate external messages, purchases, deletions and publication with a **real tool-level human approval**, not just words in a prompt.
6. Obtain G1 scope/claims, G3 security/rights and G4 release approval before live data. Monitor false answers, failed handoffs and customer complaints; revisit at G5.

**Tools/dependencies:** approved integration only; n8n/Make/MCP are candidate technologies, not installed or claimed connected. Do not put customer messages into unapproved AI tools.

**Output:** architecture diagram in text, data inventory, permissions matrix, 8-case test, cost estimate marked provisional, failure/rollback runbook and approval log.

**Quality:** no invented integrations or accuracy claim. **Fail/hold:** no data owner, no human escalation, unknown legal basis, hidden customer data or live send without gate.

**Test:** sample late-night booking enquiry with no capacity source must yield acknowledgement + human availability check, not a confirmed appointment. References: `../../../ai-training/modules/00-department-operating-system.md`, `../../../ai-training/modules/09-quality-safety-rights-and-governance.md`, `../../01_RESOURCE_REVIEW.md`.
