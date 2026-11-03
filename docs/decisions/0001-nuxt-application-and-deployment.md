# ADR 0001 — Nuxt application and deployment model

- Status: accepted
- Date: 2026-11-03

## Context

The product is a Spanish-first, SEO-sensitive web application with a future native iOS/Android experience. The team is small and the existing technical direction is Vue/Nuxt.

## Decision

Use a single Nuxt 4 application with Vue 3, TypeScript, Tailwind CSS, pnpm, and a Node server built into a Docker image. Use server-side rendering for public pages. Add Capacitor later for the native shell, reusing the same application.

## Consequences

- One codebase and one design system.
- SEO and fast public pages remain possible.
- Native apps do not require a second UI implementation.
- Mobile-specific behavior must be isolated carefully when Capacitor is added.
- A monorepo is deliberately postponed.
