# Ad Budget Notebook

A zero-dependency, local-only spending worksheet for **manually supplied Amazon Sponsored Products campaign notes**. No account connection, API key, tracking, paid service, or automatic budget change.

Your planning budget is not Amazon's monthly charge limit, lifetime budget, account balance, or available budget. This tool does not predict spend, sales, ad delivery, or returns.

## The useful task

You have checked completed-day spend figures and want to see:

- How spend compares with a linear allocation of **your own period plan**.
- The unspent planning allowance, including overruns, per campaign and in total.
- The arithmetic daily allowance after the spend cutoff, without hiding a campaign overrun in the aggregate.
- A constant-observed-pace scenario, explicitly not a forecast.
- An optional percentage-only daily illustration with source notes and a user-selected recheck deadline. Unknown or stale evidence yields no illustration, not a guessed zero.

Enter a single marketplace, advertising product, currency and reporting basis. Save and restore the notebook locally; export CSV or JSON reports. No data is fetched, verified, uploaded or automatically persisted.

This is an experimental worksheet, not an Amazon product. Practical value and input quality still depend on the person checking the source reports. See [SOURCES.md](SOURCES.md) before interpreting budget settings.

## Run locally

Download and extract the ZIP. With Python 3 already installed, run this inside the directory containing `index.html`:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Windows Python Launcher: `py -3 -m http.server 8000 --bind 127.0.0.1`.

Open `http://127.0.0.1:8000`. Stop the server with Ctrl+C. Serve only this project folder, not a parent directory containing private files. Python only serves static files; there is no application backend.

The release ZIP was downloaded and extracted on a cloud computer and verified in real Chromium through the localhost server above. Direct `file:///` double-click opening, other browsers and physical mobile devices remain unverified.

## Workflow

1. Start with a blank notebook, or explore the clearly fictional example. No amounts, time zones, dates or account rules are defaulted for a blank notebook.
2. Specify the planning period and spend complete-through date, inclusive. The review date must be later than the cutoff. Enter only fully completed days using your account's reporting time zone; dates are calendar labels, not automatically converted.
3. Record the spend report/basis. Keep tax treatment, attribution and scope consistent. Late adjustments can change reported spend; this app does not detect them.
4. Enter each campaign's personal period planning budget, recorded spend, and effective current daily budget. Do not mix currencies. Remove duplicates or overlapping campaign totals first.
5. Optionally record a rule/setting source, when you checked it, your own recheck-by date, and an uplift percentage for each campaign. The recheck-by date is your deadline, **not an Amazon rule expiry date**. All such facts are user supplied.
6. Run the self-check. Edit an input to invalidate the old report. Failed file imports leave the existing inputs and report usable.
7. Save a restorable notebook before closing. CSV and JSON reports are outputs, not restorable notebook files. New / Example replaces unsaved inputs. A notebook must pass validation before it can be saved; incomplete drafts are not saved.

## Transparent arithmetic

Let `D` be all inclusive calendar days in the planning period, `E` the completed days through the cutoff and `R = D - E`. For each campaign:

| Result | Calculation |
|---|---|
| Linear plan to date | personal period budget × E / D |
| Difference | recorded spend − linear plan to date |
| Remaining plan | personal period budget − recorded spend |
| Remaining allowance/day | max(0, remaining plan) / R; unavailable if R = 0 |
| Constant-pace total | recorded spend / E × D |
| Optional daily illustration | effective daily budget × (1 + user uplift / 100) |

**Remaining days are after the spend cutoff, not after today's date or the review date.** Negative remaining plan is shown as an overrun, while future arithmetic allowance is floored at zero. Aggregate allowance can conceal individual campaign overruns, so inspect every row.

Daily illustrations assume enough unused carryover and ignore account and portfolio caps, budget changes, budget-rule interactions, pauses and other restrictions. They are not actual available funds or maximum spend. A current source note only passes your chosen date check; the app does not verify its content. Percentage-only arithmetic is not evidence that the account permits or will use that amount.

The linear and constant-pace scenarios assume uniform daily allocation/pace. They do not model auctions, conversions, seasonality, future traffic, reporting lag or varying activity. This tool neither recommends a new budget nor calculates Amazon's month-end charge limit. A planning period can differ from an Amazon billing month.

## Input boundaries and privacy

- 1–100 uniquely named campaigns; one shared 1–366 day planning period.
- Money inputs: 0 to 1,000,000,000; uplift: 0 to 1,000 percent. These are software validation bounds, **not Amazon platform limits**.
- Three uppercase currency letters are required; currency validity and minor units are not inferred. Screens show two decimals for readability, while JSON retains arithmetic precision. Not invoice-grade billing.
- Unknown uplift stays blank. Missing or stale rule evidence blocks only the daily illustration, not the user-budget arithmetic.
- Save and restore share a 500,000 UTF-8 byte limit on the full serialized notebook.
- No browser storage, remote fonts, telemetry or network requests. Only selected local files are read.
- Exported notes may reveal private campaign data. Do not post real account reports or credentials in issues. The tool never needs credentials.
- CSV text cells guard common spreadsheet formula prefixes; finite numeric values, including negative variances and balances, are exported as numbers rather than formula-protected text. Review exported files before sharing them.

## Verification status

73 internal checks pass: 53 arithmetic/validation/serialization/export checks and 20 minimal-DOM interaction checks. The latter are simulated DOM checks, not real browser tests. Coverage includes inclusive dates, leap days, completed periods, unknown/stale rules, duplicate names, malformed/oversized restore, UTF-8 limits, failed-import state preservation and import/edit races.

Separately, real Chromium checks on a cloud computer used the downloaded, extracted release through localhost. Verified flows include two-campaign planning-budget arithmetic, missing-data and stale-rule handling, notebook backup and restoration, preserving the current notebook/report after bad JSON imports, and CSV export with numeric negative amounts and formula-like text. Layout was checked at 1180 px and 400 px viewport widths. This was not a physical-phone test. Direct `file:///` double-click opening and other browsers were not checked. These checks verify the worksheet behavior, not Amazon account data, platform limits or future spend.

Internal tests and dedicated fixtures are excluded from the public distribution. `sample.json` and `sample.js` are the fictional interactive product example.

## Comparison and license

[COMPARISON.md](COMPARISON.md) records one reproducible offline-workflow difference against a fixed MIT-licensed Amazon Ads budget-pacing skill. It does not establish better algorithms or overall feature superiority.

MIT. Original implementation. No competitor code, Amazon reports or account data are bundled. Not affiliated with Amazon or Coupler.io.
