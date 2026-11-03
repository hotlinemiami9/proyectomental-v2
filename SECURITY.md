# Security policy

## Reporting

Report security or privacy issues privately to `soporte@proyectomental.com`. Do not open a public issue containing personal data, credentials, or reproduction steps that expose a vulnerability.

## Scope

This repository handles birth data, optional accounts, and synchronized charts. Treat the following as sensitive:

- names, birth dates, times, and places;
- account identifiers and sessions;
- Supabase service-role keys and SMTP credentials;
- backup credentials and exported reports;
- internal Coolify tokens.

## Rules

- Never commit `.env` files or real credentials.
- Use least-privilege tokens and revoke credentials that may have leaked.
- Do not put birth data in analytics, error reports, logs, or URLs.
- Keep Supabase RLS enabled and deny by default.
- Validate all input on the server; client validation is only a UX aid.
- Use HTTPS everywhere outside local development.

## Supported versions

Only the current `main` branch is supported during the MVP.
