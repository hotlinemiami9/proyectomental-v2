# Development

## Requirements

- Node.js 24
- pnpm 12
- Chromium for Playwright (preinstalled in the development container; otherwise `pnpm exec playwright install chromium`)

## Setup

```bash
pnpm install
cp .env.example .env
pnpm dev
```

Never commit `.env`. In production, set values in Coolify.

## Quality checks

```bash
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm build
```

## Project structure

```text
app/                  Nuxt pages, components, styles, composables
content/              Markdown guides, versioned in Git
docs/                 Product, architecture, security and runbooks
i18n/locales/         UI messages
public/               Static assets
scripts/              Operational helper scripts
server/api/           Nitro server routes
tests/unit/           Pure unit tests
tests/nuxt/           Nuxt component/integration tests
tests/e2e/            Playwright browser tests
```

## Environment variables

All names are documented in `.env.example`. Public variables are prefixed with `NUXT_PUBLIC_`; secrets must never use that prefix. The production check is:

```bash
pnpm check:env
```

## Git

- Branch from `main`.
- Use Conventional Commits in English.
- Open a Pull Request; do not push directly to `main`.
- Wait for CI and review before merging.
- Do not force-push or rewrite history without explicit approval.

## Deployment

See [deployment](runbooks/deployment.md), [backups](runbooks/backups.md), and [observability](runbooks/observability.md).
