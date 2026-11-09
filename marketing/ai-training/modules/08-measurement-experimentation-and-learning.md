# 08 — Measurement, experimentation & learning

**Owner:** Analytics / experimentation · **Prerequisites:** 00–07 · **Pass evidence:** Measurement plan, test design and learning memo

## What this department must know

Measurement makes performance interpretable and supports decisions; it does not retroactively prove a strategy. Metrics are signals with definitions, sources, instrumentation quality and limitations. Distinguish activity from outcome, association from causation, and a short-term response from durable customer value.

## Measurement framework

1. **Decision:** what decision will this measurement inform?
2. **Objective:** what audience/business change is intended?
3. **Metric:** define numerator, denominator, event, unit, segment, source, observation window and exclusion.
4. **Baseline/comparator:** previous period, control, benchmark or none; explain comparability and seasonality.
5. **Instrumentation:** consent, event naming, attribution tags, deduplication, QA, data retention and ownership.
6. **Interpretation:** uncertainty, sample/selection effects, platform reporting limits, confounders and alternative explanations.
7. **Action:** what result would prompt continue, change, stop or gather more evidence?

## Metric ladder (choose only what informs a decision)

- **Delivery:** planned/published, reach/impressions, delivery status; these describe exposure, not success by themselves.
- **Attention/consumption:** starts, qualified views, completion, watch time, scroll depth; definitions vary by platform.
- **Response:** saves, shares, comments, clicks, replies; quality and context matter.
- **Intent/action:** qualified enquiry, booking, add-to-cart, purchase, signup; use clear event definitions.
- **Business/customer:** revenue, margin, retention, repeat purchase, customer fit/satisfaction, refunds or complaints. Data may be unavailable or attributed imperfectly.

Never fabricate benchmarks or report a platform-defined “view” as a universal unit. State what the platform counts and when checked. Report denominator and period with rates. Track negative outcomes (unsubscribe, complaint, refund, low-fit enquiry) alongside positive metrics.

## Experiment design

Write a hypothesis as: **For [audience/context], changing [one element] from [current] to [variant] may change [metric] because [reason]. We will compare [method/window], while holding [factors] steady. We will interpret [limits] and act if [decision rule].**

Use random assignment and adequate sample/measurement where feasible. If not feasible, label the exercise directional and consider interrupted time series, matched comparisons, qualitative inquiry or staged rollout as appropriate. Predefine the primary outcome and decision rule; avoid peeking-driven winner declarations and multiple unplanned comparisons. Check that variants differ only as intended. A test can be inconclusive. A result for one segment, channel or period does not automatically generalize.

## Attribution and privacy

Last-click and platform-reported attribution are conventions, not necessarily causal credit. Document attribution window and gaps. Use privacy-conscious, consent-aware data collection; do not infer sensitive traits or join data in ways not authorized. Aggregate where possible. Follow applicable privacy rules and retention limits.

## Learning memo template

Question → plan and dates → actual change → source/quality → results with denominator → uncertainty and alternate causes → unexpected/negative effects → decision → next test → what we still do not know. Preserve a no-result memo; do not cherry-pick only successes.

## Connections

Strategy determines the decision and baseline; psychology informs hypotheses but not guaranteed outcomes; copy/design/film produce testable variants; distribution and instrumentation establish exposure; governance protects privacy and claim integrity; findings feed the next strategy iteration.

## Assessment

Build a measurement plan and a two-variant experiment proposal for a hypothetical campaign. Explain sample and instrumentation limitations and a false-positive risk. **Pass:** metric operationally defined; objective/business relevance clear; comparison method appropriate; primary outcome and decision rule predefined; privacy and negative outcomes considered; causal claims are no stronger than design allows.
