# Jovian validation status

Jovian Archive does not expose a public chart-calculation API. MyBodyGraph is a consumer web application. Its terms prohibit systematic or automated data collection, scraping and robot access without express written consent.

For that reason the project must not automate chart generation against Jovian.

## What is implemented

- The calculation engine is isolated behind `server/utils/chart-engine.ts`.
- A smoke test checks a known public example (Bangkok, 1972-08-02 14:30).
- The response includes a reproducibility snapshot and engine version.
- Approximate birth times are recalculated at ±30 minutes and unstable fields are marked.

## What is not proven

The calculation has not been validated against a 50-chart Jovian golden set. That remains a release blocker.

## How to close it

1. Obtain written permission from Jovian for automated reference generation, or
2. Have the user provide reference charts generated manually through an official tool, with permission to use them as test fixtures, or
3. Use a licensed calculation API strictly as a reference dataset, subject to cost and privacy review.

Until then, do not claim Jovian parity or “official” accuracy. Document discrepancies and keep the release blocked.
