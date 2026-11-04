# Architecture

## Overview

ProyectoMental V2 is a single Nuxt 4 application deployed as a Node server in Docker. The web app uses server-side rendering for public pages and can later be wrapped by Capacitor for iOS and Android.

```text
Browser / Capacitor WebView
        │
        ▼
Nuxt 4 + Vue 3 + Nuxt UI
        │
        ├── Public pages and editorial content (Nuxt Content)
        ├── Chart UI and BodyGraph (SVG)
        ├── Domain services (calculation, validation, export)
        │
        ▼
Nitro server routes
        │
        ├── Supabase Auth + PostgreSQL (EU)
        ├── SMTP provider
        ├── GlitchTip
        └── Umami
```

## Application boundaries

- `app/` — pages, components, layouts, composables, design tokens.
- `server/` — API routes, server-only integrations, validation, rate limits.
- `shared/` or domain modules — pure calculation and chart types, testable without Nuxt.
- `content/` — reviewed Markdown guides.
- `docs/` — product, architecture, security, and operations.

The calculation engine must sit behind an internal interface. The rest of the app should not import the third-party engine directly.

## Stack

| Concern       | Decision                                               |
| ------------- | ------------------------------------------------------ |
| Runtime       | Node.js 24                                             |
| Framework     | Nuxt 4 / Vue 3                                         |
| Language      | TypeScript strict                                      |
| Styling       | Tailwind CSS 4 + Nuxt UI v4                            |
| State         | Pinia                                                  |
| Content       | Nuxt Content v3, native SQLite connector               |
| i18n          | `@nuxtjs/i18n`, Spanish only initially                 |
| Database/auth | Supabase EU, separate dev and production projects      |
| Calculation   | Isolated MIT engine, validated against Jovian Archive  |
| Hosting       | Coolify on existing VPS, Dockerfile + healthcheck      |
| Backups       | Supabase + encrypted logical dumps in Cloudflare R2 EU |
| Email         | Own SMTP                                               |
| Analytics     | Umami self-hosted, cookieless                          |
| Errors        | GlitchTip self-hosted                                  |
| CI            | GitHub Actions                                         |

## Environments

| Environment       | Domain                   | Branch           | Purpose               |
| ----------------- | ------------------------ | ---------------- | --------------------- |
| Local             | `localhost:3000`         | feature branches | Development and tests |
| Staging / preview | `dev.proyectomental.com` | Pull Requests    | Review before merge   |
| Production        | `proyectomental.com`     | `main`           | Public users          |

The production deployment must not happen until CI passes and the user approves the merge. Coolify is connected through its GitHub App and MCP.

## Data model (initial)

- `profiles` — optional account profile, linked to Supabase Auth.
- `charts` — owner, name, birth data, calculation result snapshot, timestamps.
- `chart_exports` — optional metadata for generated files; no permanent export storage by default.
- `content` — versioned in Git, not the application database.

Birth data is personal data. Do not store it in analytics, error payloads, logs, or URLs.

## Security boundaries

- Browser receives only the public Supabase anon key.
- Service-role key stays server-side and must never be exposed in a public runtime config.
- All chart writes are validated server-side and scoped to the authenticated user.
- RLS is enabled on all user tables and denies by default.
- Exports are generated server-side or in a controlled client flow without leaking other users' data.
- The Coolify MCP token is scoped to the team and used only for infrastructure operations.

## Current implementation

- Nuxt application, Dockerfile, healthcheck and CI are in place.
- The local MVP implements a single-step form, offline lookup of 135,233 places, chart engine wrapper, BodyGraph, local library and PNG/PDF export.
- The BodyGraph uses an adapted MIT SVG renderer in `app/lib/bodygraph/` with all 64 gates, 36 channels, nine centers and activation columns.
- The calculation engine is isolated in `server/utils/chart-engine.ts` and requires an exact birth time.
- Supabase migrations and RLS policies are prepared in `supabase/`, but not applied.
- Accounts remain behind `NUXT_PUBLIC_ACCOUNTS_ENABLED=false`.

## Pending technical work

- Validate the calculation against a legal Jovian reference set.
- Repair the staging Supabase instance and create the minimal production instance.
- Apply migrations and test RLS with two users.
- Connect optional accounts and synchronization behind the feature flag.
- Add Umami and GlitchTip services.
- Add Cloudflare R2 backup workflow and restore drill.
- Add Capacitor shell after web MVP.
