# ADR 0004 — Coolify staging and production

- Status: accepted
- Date: 2026-11-03

## Context

The existing VPS already runs Coolify and OpenCode Manager. The user wants controlled deployments, staging, and a simple Git workflow without managing Kubernetes.

## Decision

Run the application in Coolify from a Dockerfile. Use a dedicated `ProyectoMental V2` project with `staging` and `production` environments. Connect the new GitHub repository through the existing `hotline-github-app`. Production deploys from `main`; Pull Requests provide staging previews. The user approves merges to `main`.

## Consequences

- Reproducible containers and HTTPS through the existing panel.
- No direct server administration for routine deploys.
- The Coolify token must be scoped and protected.
- Branch protection and CI checks are required before production deploys.
- Staging is a review environment, not a second permanent data store.
