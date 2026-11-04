# Dependency security status

Last reviewed: 2026-11-04.

## Current audit

`pnpm audit --prod` reports no high-severity vulnerabilities after overriding `zod` to `4.6.7`. The remaining findings are:

- **minimatch (moderate, build tooling):** patched versions require a major upgrade of a transitive build dependency. It is not used to process untrusted user input at runtime. Revisit with Dependabot and upstream releases.
- **glob (moderate, build tooling):** transitive through Nitro's file tracing. It is not exposed to runtime user input. Revisit with upstream releases.
- **esbuild (low, Windows development server):** the affected path is the Windows development server; production runs Linux containers. Revisit when `@nuxt/fonts` updates its dependency.
- **deepmerge (low, no patch):** transitive through Nitro's Rollup plugin. No patched version is published; track the upstream advisory.

## BodyGraph rendering

- `app/lib/bodygraph/` contains an adapted copy of the MIT-licensed renderer and geometry from `@gonzih/hd-bodygraph` 1.4.1.
- It has no runtime dependencies and does not add React to the Vue client bundle.
- Attribution and the MIT text are in `THIRD_PARTY_NOTICES.md`.

## Geographic data

- `all-the-cities` 3.1.0 (MIT): 135,233 populated places with population and coordinates. It is derived from [GeoNames](https://www.geonames.org/) data, licensed under CC BY 4.0; keep that attribution if the dataset is redistributed.
- `tz-lookup` 6.1.25 (CC0): resolves an IANA timezone from coordinates.
- Both run only on the server and are bundled with the application. No external geocoding service is called at runtime.
- Coverage starts at 1,000 inhabitants; smaller hamlets may still require using the nearest municipality.

## Policy

- Do not add `root` Coolify tokens or unnecessary `read:sensitive` permissions.
- Run `pnpm audit --prod` before each release and after dependency updates.
- Prefer upstream fixes over broad major-version overrides.
- Any new override must be tested with lint, typecheck, unit tests, build, and E2E.
- Document accepted residual risk in this file and the threat model.
