# Backup, Migration & Release Playbook

Provides the concrete steps for keeping Nexsys safe once the product is live. This is the in-repo checklist that complements `PRODUCTION_TOOLING.md` and the overall Phase 5.3 goals.

## Manual Backup Routine

1. Ensure `SUPABASE_DB_URL` (or `DATABASE_URL`) is set so the script can reach the production Postgres instance with a service role key.
2. Run `npm run backup`. The script reads the key tables (`organizations`, `users`, `projects`, `units`, `customers`, `payment_schedules`, `payments`, `payment_intents`, `documents`, `activity_logs`) and writes a timestamped JSON dump under `backups/`.
3. Store or archive the generated files (the log prints the relative path) and verify the files can be decrypted or parsed before relying on them for restores.

## Migration Flow

1. Create an idempotent SQL migration (`sql/migrations/<timestamp>_description.sql`) and keep it scoped to the new columns or functions your change needs.
2. Apply the migration in Staging and run the SQL sanity suites:
   - `supabase/tests/rls_role_coverage.sql`
   - `supabase/tests/perf_sanity.sql`
3. Rerun `npm run backup` after the staging run if you need an auditable snapshot before production.
4. Apply the migration in Production.
5. Run the suites listed in step 2 again (Production run) and capture the results in your deployment notes.
6. Update `CURRENT_STATE.md` (phase/status) and `HANDOFF.md` (recent changes + next steps) so the next handoff stays fresh.

## Release Checklist

### Pre-Release
- Confirm environment variables:
  - `VITE_SENTRY_DSN` is populated for the new Sentry instrumentation and points to the production project.
  - `SUPABASE_DB_URL` is available for the backup script and any CLI-based migrations.
- Run `npm run build` (ensures Vite/Sentry compile path works) and smoke the main flows manually: add project/unit/customer, portal login + payment proof upload, payment request approval, and the reports export gated by tier.
- Call the health endpoint (`/rest/v1/rpc/health_check`) with the anon key and verify the JSON shows `status: ok`, the expected `database` counts, and `rls.policies > 0`. Use this same call to drive uptime alerts.
- Run `npm run backup` and archive the output before deployment.

### Post-Release
- Keep an eye on Sentry/error dashboards (customer and admin errors) for at least 24‑48 hours after release.
- Confirm scheduled backups (automated Supabase backups + manual export from this repo) have succeeded.
- Verify the health check still returns `status: ok` after traffic warms up.
- Update `CHANGELOG.md` with version notes, noting the Sentry/health-check instrumentation, backup tooling, or any schema deltas.
- Ensure `CURRENT_STATE.md` still reflects the active phase + next action.

If any step fails, pause the release, investigate (Supabase logs, Sentry breadcrumbs, `npm run backup` output), and rerun the scripts once the underlying cause is resolved.
