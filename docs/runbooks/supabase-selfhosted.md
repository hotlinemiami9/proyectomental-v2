# Supabase self-hosted runbook

## Current state

- Existing Coolify service: `supabase` (`tlpqsoiprwi93pmtacldypn5`).
- PostgreSQL container is healthy.
- The service as a whole is degraded: `edge-functions` restarts and `supabase-rest` is excluded.
- Public endpoint `https://supabase.proyectomental.com:8000` times out from the agent environment.
- The service has persistent PostgreSQL and MinIO volumes.
- SMTP environment keys exist, but their values must never be read into chat or logs.

## Target topology

| Environment | Instance                         | Domain                            |
| ----------- | -------------------------------- | --------------------------------- |
| Staging     | Existing full Supabase, repaired | `supabase-dev.proyectomental.com` |
| Production  | New minimal stack                | `supabase.proyectomental.com`     |

Production stack: PostgreSQL, Auth, PostgREST, Kong and optionally Studio. Do not include Storage, Realtime, Edge Functions, Analytics, MinIO, imgproxy or Vector unless a concrete feature needs them.

## Repair checklist for staging

- [ ] Fix or disable the restarting edge-functions container.
- [ ] Confirm PostgREST is reachable and not intentionally excluded.
- [ ] Expose Kong through Traefik on HTTPS port 443, not port 8000.
- [ ] Set `SUPABASE_PUBLIC_URL`, `API_EXTERNAL_URL`, `GOTRUE_SITE_URL` and redirect URLs.
- [ ] Allow the app and preview origins in CORS/auth redirects.
- [ ] Verify `/auth/v1/health` and `/rest/v1/` over HTTPS.
- [ ] Confirm SMTP delivery with a synthetic account.
- [ ] Restrict Studio access.
- [ ] Create encrypted logical backups and test a restore.

## Production checklist

- [ ] Verify available RAM and disk before provisioning.
- [ ] Create the minimal service with separate volumes and secrets.
- [ ] Set the production auth URLs and SMTP.
- [ ] Apply migrations with a dedicated migration role.
- [ ] Run RLS tests with two users.
- [ ] Generate TypeScript types.
- [ ] Connect the app behind `NUXT_PUBLIC_ACCOUNTS_ENABLED`.
- [ ] Verify account deletion and export.
- [ ] Enable backups and monitoring.
- [ ] Do not deploy production automatically while the app is being developed.
