# ADR 0006 — Typography and final landing atmosphere

- Status: accepted
- Date: 2026-11-06

## Context

The landing explored several combinations of sky, typography and form presentation. The chosen direction keeps the readability and editorial character of the nocturnal version, while adopting the golden nebula from the editorial variant. The product needs one consistent visual system, not a permanent theme switcher.

## Decision

Use **Fraunces Variable** for display and headings, and **Manrope Variable** for interface and body text. Both are self-hosted through `@fontsource-variable` and loaded as local WOFF2 assets.

Use one landing atmosphere: a midnight base with a golden nebula, warm stars and the embedded single-step form. Remove the alternate landing styles and the preview switcher.

## Typography rules

- **Fraunces** is limited to the wordmark, `h1`–`h3`, short editorial statements and the chart title. It is not used for body copy, labels, inputs, buttons or dense data.
- **Manrope** is used for navigation, paragraphs, form labels, inputs, buttons, helper text and tables.
- Date and time inputs use tabular numerals so the values do not shift while typing.
- Display headings use tight tracking and balanced line breaks only at large sizes. Body text keeps normal tracking and generous line height.
- Fallbacks are Georgia for Fraunces and the system sans stack for Manrope, so the page remains usable if a font fails to load.
- Text contrast is checked against the night background, including muted helper text and gold accents.

## Why this pairing

- The serif/sans contrast gives the brand an editorial, human tone without sacrificing interface legibility.
- Fraunces has a distinctive display voice and good Spanish diacritic coverage.
- Manrope stays neutral at small sizes and works well for forms, numbers and navigation.
- Two variable families keep the request count and payload bounded; no external font service is called at runtime.
- Both families are open-licensed and can be self-hosted.

## Consequences

- Typography roles are explicit and must be preserved in new components.
- The landing no longer needs a style preview bar or alternate form variants.
- The golden nebula is part of the single signature theme, not a separate theme.
- Font changes require a visual check at mobile and desktop sizes, plus lint, typecheck, tests, build and E2E.
