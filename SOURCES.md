# Amazon budget context and limits

Reviewed on **November 16, 2026**, using public Amazon Ads primary-source pages and their search-indexed text. Some direct Help page requests returned an empty page shell; indexed official page text supplied the readable content. No advertising account or marketplace-specific settings were inspected. These notes are dated context, not embedded account rules.

## Official sources

1. [Understand budgets in Sponsored ads](https://advertising.amazon.com/help/GTGPQGUXNCTHE2DS), marked updated November 2, 2026.
   - Daily budget is averaged over a calendar month, rather than an unconditional hard daily ceiling.
   - Extra spending can use unused amounts from earlier days. The page describes a default up-to-100% option and a 25% setting; this does not tell us which setting a particular account uses.
   - Its lifetime-budget discussion is specifically for Sponsored Brands. This Sponsored Products worksheet does not label a personal period plan an Amazon lifetime budget.

2. [Edit your Sponsored ads campaign budget](https://advertising.amazon.com/help/GVYUKBJQFPH7ZQ2L), marked updated September 2, 2026.
   - Budget edits take effect immediately. The midmonth example combines already-incurred spend with the new daily amount for remaining days, rather than treating the new daily amount times the whole month as a fresh cap.
   - It also describes a separate seller Sponsored Products account-level daily cap and distinguishes portfolio caps.
   - This notebook does not reproduce a monthly charge-limit calculation or discover any of those limits.

3. [Understand budget rules in Sponsored ads](https://advertising.amazon.com/help/GNSMLANWNF344YBE), indexed version marked updated November 2, 2026.
   - Schedule and performance rules can change daily budgets. Enter your effective current amount, not an assumed original amount.
   - The worksheet does not apply or combine budget rules.

4. [New sponsored ads daily budgeting policy and options](https://advertising.amazon.com/en-gb/resources/whats-new/sponsored-ads-daily-budgeting-policy-and-options), announcement dated May 9, 2023.
   - This describes unused-budget flexibility and selectable settings. It is historical context, not a new 2026 rule or proof of an individual account setting.

5. [Sponsored Products budget basics and best practices](https://advertising.amazon.com/library/guides/sponsored-products-budget-best-practices).
   - At review time, this guide still used a 25% example, while the more recent Help text described configurable behavior including 100%. Do not infer your account settings from an example on a generic guide.

## What the application deliberately does not assume

Marketplace, product, account settings, source dates and all input amounts must be supplied by the user. The app does not import platform minimums or caps, certify account eligibility, simulate carryover, handle effective-dated budget changes, or promise that a setting remains current.

The optional percentage illustration is simply user-entered daily amount × (1 + entered percentage / 100), under a sufficient-carryover assumption. It excludes account and portfolio caps and other rules. It is not the actual available budget, a forecast, or a verified upper bound.

Your rule recheck-by date is a self-imposed review deadline. Passing that date check means only that the note is within your selected window, not that Amazon validated it. If you cannot establish the current applicable rule, leave the percentage unknown and use only the personal planning-budget arithmetic.
