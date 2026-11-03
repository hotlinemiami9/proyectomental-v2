# ADR 0003 — Supabase for accounts and data

- Status: accepted
- Date: 2026-11-03

## Context

The MVP needs optional email/password accounts, email verification, password recovery, optional TOTP, several charts per account, EU data residency, and a small operational footprint.

## Decision

Use Supabase in an EU region for Auth and PostgreSQL. Use separate development and production projects. Keep the service-role key server-side, enable RLS on all user tables, and use server routes for sensitive writes and exports.

## Consequences

- Faster delivery of authentication and MFA.
- Managed backups and PostgreSQL operations.
- Some vendor coupling; the data model remains standard PostgreSQL.
- RLS and server-side ownership checks must both be tested.
- Free-plan limitations must be reviewed before production.
