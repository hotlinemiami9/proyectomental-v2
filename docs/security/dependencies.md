# Dependency security status

Last reviewed: 2026-11-03.

## Current audit

`pnpm audit --prod` reports no high-severity vulnerabilities after overriding `zod` to `4.6.7`. The remaining findings are:

- **minimatch (moderate, build tooling):** patched versions require a major upgrade of a transitive build dependency. It is not used to process untrusted user input at runtime. Revisit with Dependabot and upstream releases.
- **glob (moderate, build tooling):** transitive through Nitro's file tracing. It is not exposed to runtime user input. Revisit with upstream releases.
- **esbuild (low, Windows development server):** the affected path is the Windows development server; production runs Linux containers. Revisit when `@nuxt/fonts` updates its dependency.
- **deepmerge (low, no patch):** transitive through Nitro's Rollup plugin. No patched version is published; track the upstream advisory.

## Policy

- Do not add `root` Coolify tokens or unnecessary `read:sensitive` permissions.
- Run `pnpm audit --prod` before each release and after dependency updates.
- Prefer upstream fixes over broad major-version overrides.
- Any new override must be tested with lint, typecheck, unit tests, build, and E2E.
- Document accepted residual risk in this file and the threat model.
