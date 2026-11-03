# ADR 0005 — Nuxt UI and visual system

- Status: accepted
- Date: 2026-11-03

## Context

The product needs a distinctive nocturnal identity, accessible forms and overlays, and a small team that should not rebuild complex UI behavior from scratch.

## Decision

Use Nuxt UI v4, built on Reka UI and Tailwind CSS, as the component foundation. Customize it with project tokens, typography, and a dark signature theme. Build the BodyGraph, celestial canvas, and brand components specifically for ProyectoMental.

## Consequences

- Accessible behavior, focus management, and keyboard support come from the library.
- Visual differentiation requires disciplined theming rather than default component styling.
- The BodyGraph remains a custom, testable SVG component.
- Avoid adding a second component library.
- Accessibility still needs manual and automated checks; library defaults are not certification.
