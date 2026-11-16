# A narrow, reproducible offline-workflow comparison

## Reference

- Repository: [coupler-io/skills](https://github.com/coupler-io/skills).
- Fixed commit: `3a8982e788283faa2ec90238df4961d34c7a2f7f`.
- [Amazon Ads Budget Pacing skill, section A](https://github.com/coupler-io/skills/blob/3a8982e788283faa2ec90238df4961d34c7a2f7f/marketing-and-ads/amazon-ads/amazon-ads-budget-pacing/SKILL.md#L61-L68).
- [MIT license at that commit](https://github.com/coupler-io/skills/blob/3a8982e788283faa2ec90238df4961d34c7a2f7f/LICENSE).

The reference is an agent skill, not a standalone offline calculator. Its connection stage explicitly stops without a live Coupler.io connection and does not accept pasted tables or CSV as a substitute.

## Same narrow task, different prerequisites

Scenario: a person has checked completed-day campaign spending and a personal period budget, but has not authorized any advertising data connection. They want a local arithmetic view and a portable saved notebook.

Use one currency and these manually supplied inputs:

- Period: November 1–30, 2026 (30 days).
- Spend complete through November 10 (10 days); review November 11.
- Personal period plan: 1,500.
- Recorded spend: 600.
- Effective daily setting: 50 (not used as a charge ceiling).
- Uplift unknown, rule evidence blank.

Expected local output:

- Linear plan to date: 500; spend is 100 ahead.
- Remaining personal plan: 900.
- 20 days after the cutoff; arithmetic remaining allowance/day: 45.
- Constant-pace scenario total: 1,800, not a forecast.
- No daily uplift illustration.
- Saving and restoring preserves the calculation.

Ad Budget Notebook performs this workflow without a connection. Under the reference's fixed published instructions, the agent must stop at its connection gate in this no-connection scenario. This is a concrete access/workflow advantage for manual offline review, **not a claim that our arithmetic is more accurate**.

## Evidence and limits

The reference's pinned public source and license were inspected. Its agent and connector were not executed, and no account was connected. Our 1,500/600 → 45 example and save/restore result are covered by an executed internal regression check; internal tests are not shipped.

Our downloaded and extracted release was also manually checked in real Chromium through localhost on a cloud computer: two-campaign arithmetic, unknown/stale inputs, backup/restore, bad-import state preservation, CSV negative-number and formula-like-text handling, and 1180 px / 400 px layouts. This does not constitute execution of the reference skill or an end-to-end comparison against its connector. Direct file double-click opening, other browsers and physical mobile devices remain unverified.

The reference supports connected live datasets, broader advertising products, attribution and budget-allocation analysis that this notebook does not provide. Its refusal to use manual data is an explicit workflow policy, not necessarily a defect. This notebook cannot detect stale or incorrectly transcribed spend, reconcile account totals, fetch platform settings, or replace that richer connected analysis.

No claim of overall superiority, lower ad costs, greater returns or customer willingness to pay is made.
