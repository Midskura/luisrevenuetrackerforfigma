# Production Tooling

This playbook covers monitoring, error reporting, backups, and release readiness for Nexsys.

## Monitoring and Error Reporting

### Client and Server Errors
- Frontend: add a client error reporter (Sentry or equivalent) for React runtime errors and user-facing failures.
- Supabase: enable database log drains (Logflare or equivalent) for query errors and RPC failures.
- Track these events at minimum:
  - Auth failures (admin and portal)
  - Payment intent lifecycle (created/approved/rejected/superseded)
  - Customer portal login failures (lockouts)
  - Storage upload failures (documents/receipts)

### Health Checks
- Add lightweight health endpoints for:
  - App availability
  - Supabase connection and RLS sanity
- The Supabase RPC `public.health_check` now exposes both the app heartbeat and database metrics (counts for organizations, units, payments, latest payment date, and RLS policy status). Call it via REST at `/rest/v1/rpc/health_check` with your `anon` key so uptime monitors can validate the stack. Example:

```
curl -H "apikey: $SUPABASE_ANON_KEY" \
     -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
     -H "Content-Type: application/json" \
     https://<project>.supabase.co/rest/v1/rpc/health_check
```
The response includes an `app` block (`status: ok`), a `database` block (version + table counts), and an `rls` block (policy count).
- Establish alerting for:
  - Error rate spikes
  - Queue failures (payment intents, communications dispatch)
  - Storage policy denials

## Backups and Migration Playbook

### Database Backups
- Enable automated backups in Supabase.
- Run weekly manual export for:
  - `organizations`, `users`
  - `projects`, `units`, `customers`
  - `payment_schedules`, `payments`, `payment_intents`
  - `documents`, `activity_logs`

### Schema Migration Flow
1) Create SQL migration file (keep it idempotent where possible).
2) Apply in staging first.
3) Run RLS and performance sanity tests:
   - `supabase/tests/rls_role_coverage.sql`
   - `supabase/tests/perf_sanity.sql`
4) Apply in production.
5) Update `CURRENT_STATE.md` and `HANDOFF.md` after changes.

## Release Checklist

### Pre-Release
- Verify RLS policies in `supabase/rls_core.sql` are applied.
- Confirm storage policies in Supabase Storage UI (documents bucket).
- Run smoke tests and core flows:
  - Add project/unit/customer
  - Create and approve payment intent
  - Portal login + payment proof upload
  - Reports export (if enabled by tier)

### Post-Release
- Monitor error dashboards for 24-48 hours.
- Confirm backup snapshot completed.
- Update `CHANGELOG.md` with version notes.
