# End-to-End Testing Guide

This guide walks through a realistic workflow test from onboarding to daily operations.

## 0) Prereqs
- Supabase project configured and migrations applied.
- `.env.local` contains `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
- App running locally.

## 1) Onboarding (first-class flow)
1. Sign up as a new admin user.
2. Complete onboarding:
   - Organization name + slug
   - Labels (customer/unit naming)
   - Choose a template (Marketplace or Private)
3. Confirm org settings are saved in `organizations` and `organization.settings`.

## 2) Configure custom fields
Custom fields are managed per entity (customers/units).

Paths:
- During onboarding: templates can prefill custom fields.
- After onboarding:
  - Customers: open any customer detail → `Edit Details` → add fields.
  - Units: open any unit detail → `Edit Details` → add fields.

Data lives in `entity_fields` and `entity_values`.

## 3) Seed realistic simulation data (current org preferred)
Use the in-app seed so the dataset matches the org you just onboarded:
- Go to `Settings` → `System` → `Simulation Data`.
- Click `Seed Current Org` (Executive/Manager only).

If you need a brand-new org dataset, run:
```
npm run seed
```
This creates a new org with realistic projects, units, schedules, payments, comms, and ops data.
Credentials and org slug print at the end of the script. See `SIMULATION_GUIDE.md`.

## 4) Daily ops walkthroughs by role
Use the seeded users (admin/manager/encoder) or create your own roles.

### Admin flow
- Dashboard: review risk heat (overdue/at-risk units).
- Payments: approve/reject pending payment intents.
- Collections: run bulk reminders and check recipients count.
- Reports: export cashflow + AR aging.
- Communications: review dispatch history.

### Manager flow
- Manage projects + units.
- Update customer assignments.
- Monitor milestones and unit status changes.

### Encoder flow
- Record payments.
- Upload receipts/documents.
- Confirm unit status and arrears updates.

### Customer portal flow
- Log in with org slug + project + unit + PIN.
- Change PIN on first login.
- View schedule, documents, and announcements.
- Submit payment proof (creates payment intent).

## 5) Validation checks (non-negotiables)
- No silent changes: every update should log activity.
- Nothing disappears: history/audit trails are visible.
- Risk surfaced early: overdue/at-risk units appear clearly.
- Separation of recording vs approving payments works.

## 6) Known gaps to validate
- Warranty tab requires `customer_portal_get_defects` RPC applied.
- Storage policies must be created via Supabase UI.

## 7) Suggested next improvement
- Add a seed option during onboarding to populate data that matches the chosen template.
