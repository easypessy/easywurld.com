# External resource review — research, not installation

Checked 8 Nov 2026 (UTC+1). The scores are **documented reviewer heuristics**, not third-party certification. Weights: practical 20, quality 15, compatibility 15, maintenance 10, security 15, licensing 10, cost 10, documentation 5. A severe licence/security issue can veto a high score. `02_RESOURCE_REGISTRY.csv` contains the scored details. No scripts, MCP servers, plugins, agents or publishing APIs were installed in this phase.

## Primary sources and scope

- Agent Skills formal specification: https://agentskills.io/specification — a directory with `SKILL.md`, required `name` and `description` frontmatter and optional references/scripts. **Format compatibility is not evidence that Arena automatically loads a directory.** Arena supports editable Markdown and repository file persistence here; no automatic skill loader has been demonstrated.
- Claude SDK official docs: https://docs.anthropic.com/en/docs/claude-code/sdk — documents project skills and MCP in Claude environments. Claude Code availability/invocation was **not tested** in this sandbox.
- n8n official changelog: https://docs.n8n.io/changelog — reports optional human approval at AI tool invocation (v2.6); do not assume Easywurld has an n8n instance, credentials or approved data flow. The repository https://github.com/n8n-io/n8n has a Sustainable Use License with commercial distribution limits and enterprise exceptions (read `LICENSE.md`); **do not vendor or white-label it without legal review**.
- GitHub official dependency review: https://docs.github.com/en/code-security/supply-chain-security/understanding-your-software-supply-chain/configuring-the-dependency-review-action — optional future supply-chain gate; not configured here.
- Repository metadata checked with `gh api` for https://github.com/agentskills/agentskills (Apache-2.0), https://github.com/coreyhaines31/marketingskills (MIT), https://github.com/Yuzzyuk/marketing-os (MIT), https://github.com/anthropics/skills (mixed/per-skill notices), https://github.com/microsoft/playwright (Apache-2.0), https://github.com/vercel/next.js (MIT), https://github.com/scanny/python-pptx (MIT). These are discovery candidates, **not** blanket recommendations to install.
- Actual repository already uses React/Vite, TypeScript and npm; do not switch to Next.js merely because it exists. Web QA can use existing code, no new framework dependency needed. Google Drive is available for reference backup in this conversation; GitHub branch is versioned canonical. Social publishing, Canva, n8n, Anthropic/Claude SDK and external APIs are **not configured or tested here**.

## Security checklist required before any future deployment

1. Pin version/commit and inspect requested files; check licence **at file/package level**, commercial use and attribution.
2. Inspect scripts, dependencies, network destinations, filesystem writes, telemetry and permission scopes in a disposable test. Do not execute unknown installers against client data.
3. Test only anonymised sample data first; avoid credential collection in chat. Limit tool rights; human-gate sends, purchases, publication and destructive actions.
4. Confirm operational ownership, cost ceiling, rollback and rate limits. Test integration on the actual account before claiming compatibility.
5. Record approval at the existing G0–G5 gates. External resources cannot redefine the gates.

## Registry policy

`approved`: approved for **textual reference only** after licence/provenance check; no automatic execution. `experimental`: plausible but permissions, environment, cost or licence need review. `rejected`: conflicts with human approval or licence/risks. Each row records installation and test procedure. Revise classifications only with a decision log, not a popularity score.
