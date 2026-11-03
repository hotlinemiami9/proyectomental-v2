# ADR 0002 — Isolated calculation engine

- Status: accepted, pending validation
- Date: 2026-11-03

## Context

Human Design calculation needs precise planetary positions, the 88-degree solar arc, gate/line mapping, centers, channels, and derived fields. A managed API adds cost, network dependency, and personal-data transfer. A completely custom engine adds high domain risk.

## Decision

Use an open-source MIT JavaScript engine (`free-human-design`) as the initial implementation, wrapped behind an internal `ChartEngine` interface. Validate at least 50 reference charts against Jovian Archive, covering all types, authorities, profiles, timezones, DST transitions, and boundary dates. Do not let UI code import the package directly. Keep a replacement path to Swiss Ephemeris if validation fails.

## Consequences

- No external calculation API and no per-request cost.
- Works in Node and future Capacitor builds.
- The chosen package has low adoption and must be treated as untrusted until the golden set passes.
- The golden set and validation report are release blockers.
- The wrapper makes a future engine swap possible without rewriting the product.
