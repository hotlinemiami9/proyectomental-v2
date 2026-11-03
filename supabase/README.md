# Supabase — prepared, not connected

The application currently runs in local-only mode. These migrations are prepared but have not been applied to any Supabase instance.

## Planned topology

- `supabase-dev.proyectomental.com`: staging, reusing the self-hosted Supabase in Coolify after repair.
- `supabase.proyectomental.com`: production, on a separate minimal self-hosted stack.
- Separate JWT secrets, database volumes, SMTP settings and backups.

The existing Coolify Supabase service is degraded and its public endpoint is not currently reachable. Do not use it for production until its health, Kong/PostgREST routing, CORS, redirect URLs and backups are verified.

## Apply migrations

Do not apply these from the agent environment without a dedicated migration credential. The recommended path is:

1. Create a dedicated migration role or connection URL with schema-owner permissions.
2. Store it only in Coolify or GitHub Actions secrets.
3. Apply to staging first:

```bash
psql "$SUPABASE_STAGING_DB_URL" -v ON_ERROR_STOP=1 \
  -f supabase/migrations/202611040001_initial_schema.sql \
  -f supabase/migrations/202611040002_rls.sql
```

4. Run the RLS checks with two users.
5. Generate TypeScript types.
6. Only then repeat against production.

## RLS acceptance checks

- User A can create, read, update and delete their own charts.
- User A cannot read, update or delete User B's charts.
- Anonymous users cannot read or write charts.
- Deleting an auth user cascades to the profile and charts.
- The service-role key is never shipped to the browser.

## Pending

- [ ] Repair the staging Supabase instance.
- [ ] Create the production minimal Supabase stack.
- [ ] Apply migrations to staging.
- [ ] Run RLS tests with two users.
- [ ] Configure SMTP and auth redirects.
- [ ] Generate types and connect the app behind a feature flag.
- [ ] Encrypted logical backups and restore drill.
