---
name: content-distribution
description: Use after G4 approval to prepare Easywurld carousel placements and verify platform queue, adaptations, publication evidence and reporting.
compatibility: Markdown runbook; no social API integration installed or verified in Arena.
---
# Easywurld Content Distribution

**Purpose:** Prevent duplicate, late, wrong-account or unapproved publication. Plan ≠ scheduled ≠ live.

**Inputs:** G4 release record with asset version/checksum, approved account/timetable/timezone, exact ordered files, platform caption, CTA destination, owner, queue access, moderation plan.

**Workflow:**
1. Compare intended placement with existing official November run, draft calendars and the **actual platform queue**; stop on collisions. If queue cannot be viewed, record `QUEUE UNKNOWN` and hold.
2. Adapt wording for the approved platform: Instagram searchable opening; TikTok still photo carousel and short context; Facebook natural explanatory caption; LinkedIn company PDF document. Personal LinkedIn only if owner has approved first-person language and a slot.
3. Check WAT date/time and account, slide count/order/dimensions/file format, caption/links/hashtags, destination and any AI disclosure. Prepare upload checklist, not an imagined API call.
4. Only an authorised operator uploads and schedules. Record `Scheduled` **only** after platform confirmation ID/screenshot; later record live URL and publication time. If a slot passes, hold, do not stack into a made-up time.
5. G5: record saves, shares and qualified enquiries with definitions; compare to baseline and write one learning/next test, including data limitations.

**Tools/dependencies:** approved channel accounts/composers, calendar CSV, secure analytics; no social credentials are stored in repo or chat.

**Output:** placement ledger with status `draft / approved / queued-confirmed / live-verified / held`, schedule confirmation, asset checksums, owner and rollback contact.

**Quality:** all values independently checked per account. **Fail/hold:** missing schedule decision, queue unknown, login missing, no G4, unconfirmed upload, expired time or duplicate post.

**Test:** given `Draft` CSV but no platform access, status remains `held / not scheduled` and no post URL is invented. References: `../../../ai-training/modules/00-department-operating-system.md`, `../../../ai-training/modules/07-social-growth-and-distribution.md`, `../../../ai-training/modules/08-measurement-experimentation-and-learning.md`, `../../../SCHEDULING_RUNBOOK.md`.
