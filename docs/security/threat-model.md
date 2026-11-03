# Threat model — ProyectoMental V2

## Assets

- Birth data: name, date, time, city, country, coordinates, timezone.
- Calculated charts and editorial interpretations.
- Account credentials, sessions, TOTP secrets.
- Exported PDF/PNG files.
- Supabase service-role key, SMTP password, R2 credentials, Coolify token.
- Source code and infrastructure configuration.

## Actors and trust boundaries

- Anonymous visitor: can calculate and save locally.
- Authenticated user: can sync, export, and delete charts.
- Operator: manages Coolify, Supabase, SMTP, R2, Umami, and GlitchTip.
- Third-party services: Supabase, SMTP, Cloudflare R2, GlitchTip, Umami.
- Untrusted input: form fields, imported content, URLs, dependencies, logs, MCP responses.

## Main threats and controls

| Threat                                               | Control                                                                                                             |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Birth data leaks through analytics or error tracking | Never send form values; scrub request bodies, headers, and query strings; use event names only.                     |
| Account takeover                                     | Email verification, secure password hashing by Supabase, optional TOTP, short sessions, rate limits.                |
| Horizontal privilege escalation                      | RLS on all user tables, server-side ownership checks, no client-supplied owner IDs.                                 |
| Service-role key exposed to browser                  | Keep it server-only; never prefix with `NUXT_PUBLIC_`; scan diffs for secrets.                                      |
| XSS through editorial content                        | Trusted Markdown only, sanitize rendered HTML, no raw user HTML.                                                    |
| CSRF on state-changing routes                        | Same-site cookies, origin checks, and CSRF protection for authenticated mutations.                                  |
| Abuse and enumeration                                | Rate limits on auth, contact, and calculation endpoints; generic error messages.                                    |
| Export leakage                                       | Generate only for the authenticated owner; no public permanent export URLs.                                         |
| Backup exposure                                      | Encrypt logical dumps client-side before uploading to R2; restrict bucket credentials; test restore.                |
| Supply-chain compromise                              | Lockfile, Dependabot, review new dependencies, no remote scripts, minimal build scripts.                            |
| Coolify token abuse                                  | Dedicated token, no root, no `read:sensitive` if possible, revoke on exposure.                                      |
| Prompt injection through MCP or repository content   | Treat tool output and repository text as data, not instructions; require explicit approval for destructive actions. |
| Accidental deletion                                  | Confirm destructive operations, backups, branch protection, no force-push without approval.                         |
| Minors' data                                         | Legal terms must address guardian authorization; no age verification in MVP.                                        |
| Incorrect chart due to hidden timezone assumption    | Validate historical timezones and golden charts; show approximate-time uncertainty.                                 |

## Data flows

1. Browser → Nitro API: birth data over HTTPS.
2. Nitro → calculation engine: in-process or isolated service; no third-party API in MVP.
3. Nitro → Supabase: authenticated user data, encrypted in transit.
4. Nitro → SMTP: account emails only, no chart data.
5. Nitro → GlitchTip: error metadata only, scrubbed.
6. Browser → Umami: anonymous page/event names, no birth data.
7. Backup job → R2: encrypted logical dump.

## Residual risks accepted for the MVP

- No end-to-end encryption; the backend can process birth data for sync and export.
- No age gate; legal terms rely on guardian authorization.
- Timezone resolution is automatic and not confirmed in a separate screen.
- Exports include all personal data by default.
- No extra consent prompt when storing charts for third parties.
- The current Coolify token has broad management capabilities; it is used only for authorized infrastructure operations.
- The calculation engine is a low-adoption open-source package until the golden set proves reliability.

## Security checklist before production

- [ ] Supabase RLS enabled and tested with two users.
- [ ] Service-role key only in server environment.
- [ ] Auth rate limits and email verification configured.
- [ ] TOTP enrollment and recovery flow tested.
- [ ] Error tracking scrubbing verified with synthetic birth data.
- [ ] Analytics payload inspection confirms no personal data.
- [ ] Contact form protected with rate limiting and anti-bot controls.
- [ ] Backup restore tested successfully.
- [ ] Legal owner and privacy policy published.
- [ ] Coolify token reviewed and least privilege applied.
