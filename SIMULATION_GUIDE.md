# Simulation Guide

This guide documents the seeded simulation dataset and how to retrieve credentials.

## Seed script
- Script: `scripts/seed-simulation.ts`
- Loads env from `.env.local`, `env.local`, then `.env`.

## Default credentials (unless overridden)
- Org slug: `nexsys-sim-<runId>`
- Admin email: `admin+<orgSlug>@nexsys.local`
- Manager email: `manager+<orgSlug>@nexsys.local`
- Encoder email: `encoder+<orgSlug>@nexsys.local`
- Password: `ChangeMe123!`

At the end of the seed run, the script prints:
- Org slug
- Admin/Manager/Encoder emails
- Password

## Seed overrides (optional env vars)
- `SEED_RUN_ID` (used to build org slug and customer emails)
- `SEED_ORG_NAME`
- `SEED_ORG_SLUG`
- `SEED_ADMIN_EMAIL`
- `SEED_MANAGER_EMAIL`
- `SEED_ENCODER_EMAIL`
- `SEED_PASSWORD`

## Retrieve credentials from DB
Run in Supabase SQL editor:

```sql
select id, name, slug, created_at
from organizations
where slug like 'nexsys-sim-%'
order by created_at desc
limit 5;

select email, role, organization_id, created_at
from users
where email like '%@nexsys.local'
order by created_at desc
limit 10;
```

## Notes
- The seed script creates one org, three users (admin/manager/encoder), and multiple projects, units, customers, schedules, and related ops data.
- If you re-run the seed, it will create a new org slug unless you set `SEED_ORG_SLUG`.

## Seed current org (UI)
Use this when you want to seed the org you are currently signed into:
- Go to `Settings` → `System` → `Simulation Data`.
- Click `Seed Current Org` (Executive or Manager only).
