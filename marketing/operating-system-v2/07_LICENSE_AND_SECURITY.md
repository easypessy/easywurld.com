# License register and security decisions

Checked 8 Nov 2026. This is a **discovery review**, not an installation or legal opinion. `02_RESOURCE_REGISTRY.csv` is the complete scored registry (approved text reference / experimental / rejected). No new network integration, installer, social credential or executable third-party package was added in this v2 phase.

| Resource | Licence / commercial boundary | Security status / decision |
|---|---|---|
| Agent Skills specification | Apache-2.0 repository; review notices if copying code | Approved to **read** specification only; no runtime granted. |
| `coreyhaines31/marketingskills` | MIT, licence vendored in `marketing/ai-training/external-skills/` | Already pinned text references; no scripts executed. Recheck each upstream update. |
| `Yuzzyuk/marketing-os` | MIT, licence vendored in same library | Already pinned text references; not a second Easywurld approval system. |
| `anthropics/skills` | Mixed/per-skill rights and notices; **not blanket MIT** | Experimental; do not bulk install. Inspect target SKILL, scripts, dependencies and licence first. |
| n8n | Sustainable Use License plus enterprise-only code; internal/commercial restrictions require legal review | Experimental; no client data or webhooks until owner/rights/security approval. Never rebrand or redistribute by assumption. |
| Playwright | Apache-2.0 | Experimental here; browser binaries, external network requests and sandbox footprint not yet tested. |
| Next.js | MIT | Experimental here because this is already a Vite project; migration has no approved product requirement. |
| Autonomous carousel autopublisher (`msitarzewski/agency-agents`) | Repository MIT | **Rejected**: zero-confirmation publish posture conflicts with existing human G0–G5 release; no files or scripts copied from it. |

**Install gate for any candidate:** inspect exact commit/licence, scripts and transitive packages; inventory endpoints and requested scopes; test with anonymised fixtures in isolation; record cost/rollback; secure only least-privilege credentials via approved vault; require tool-level approval for external sends/publication; obtain human G3/G4 signoff. An instruction saying “ask for approval” is not a technical access control. Document incident contact and revocation before going live.
