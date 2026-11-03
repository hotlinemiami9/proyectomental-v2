# Backup and restore runbook

## Objectives

- Recover from accidental deletion, corruption, or a bad migration.
- Keep an independent copy outside Supabase.
- Encrypt backups before they leave the application environment.
- Verify restoration, not just backup creation.

## Sources

- Supabase PostgreSQL: primary data store.
- Supabase automated backups: provider-level recovery, subject to the contracted plan.
- Cloudflare R2 (EU jurisdiction): independent encrypted logical dumps.

## Schedule

- Daily logical `pg_dump` for production.
- Keep 7 daily, 4 weekly, and 3 monthly copies.
- Retain deleted user data in backups for no more than 30 days.
- Run a restore drill at least quarterly and before a major migration.

## Security

- Encrypt dumps with `age` or GPG using a key stored outside the repository.
- Upload only encrypted files to R2.
- Use a dedicated R2 token limited to the backup bucket.
- Never place database credentials or encryption keys in Git, logs, or chat.
- Restrict bucket access and enable object versioning if available.

## Restore procedure

1. Create a temporary database, never restore directly over production.
2. Decrypt the selected dump in a controlled environment.
3. Restore into the temporary database.
4. Run row counts and a sample of user-owned charts.
5. Verify RLS and application login against the restored database.
6. Document the result and delete the temporary database after verification.
7. Only restore production after explicit user approval.

## Pending implementation

- [ ] Create the Supabase production project in the EU.
- [ ] Create the R2 bucket with EU jurisdiction.
- [ ] Add encrypted backup script and scheduler.
- [ ] Store the encryption key outside the repository.
- [ ] Perform and document the first restore drill.
- [ ] Add backup failure alerts.
