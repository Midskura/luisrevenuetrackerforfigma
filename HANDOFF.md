# Nexsys Revenue Tracker – Handoff

## Ground Rules (must follow)
- Follow `PLAN.md` without asking what to do next. If a prerequisite is missing for a downstream feature, build the prerequisite first.
- Do not ask the user to choose a path when the plan already dictates the next step.
- The goal is a fully working product, not partial demos.
- When user says “proceed,” continue the next plan step immediately.
- Keep changes aligned to construction/real-estate developer use case (no multi-industry drift).
- Follow the level-by-level development strategy: stabilize core/pillars before higher-floor polish.

## Repo & Context
- Repo: `/home/alstan/projects/NexsysRevenueTracker`
- App: Nexsys Revenue Tracker (construction/real estate developer revenue lifecycle)
- Phase 5.3 completed; Phase 5.4 in progress.

## Current Plan Status (PLAN.md)
- Phase 1 Core: complete (auth/onboarding/units/customers/payments/collections/bulk import).
- Immediate Execution: done (Reports real data, Customer Portal real data).
- Phase 2:
  - Build tracker: done (milestones + collections summary).
  - Customer portal per project: done (org-scoped portal, project selector, announcements/reminders/feedback).
  - Manual payment proof flow: done (payment requests + admin approval).
- Phase 3:
  - 3.4 Finance Ops: done (manual approval flow, admin queue UI, duplicate handling).
  - 3.5 QA/Security: done (audit triggers + RPC validation + RLS/perf test scripts added).
- Phase 4:
  - 4.1 Collections + Risk Workbench: done (filters, batch actions, timeline).
  - 4.2 Reports: done (cashflow, AR aging, profitability + CSV export).
  - 4.3 Ops: done (move-in checklist + warranty/defects + portal surfacing).
- Phase 5:
  - 5.1 Onboarding/Templates: done (setup checklist + marketplace/private templates).
  - 5.2 Billing & Access: done (subscription tiers, feature flags, usage limits).

## Recent Changes (high level)
0) **Phase 5.4 Mobile UX (in progress)**
   - Added mobile bottom navigation + “More” sheet and compact mobile header.
   - Collections, Payment Requests, and Reports now have mobile card layouts, stacked filters, and full-width actions.
   - Unit and customer detail views are now mobile-stacked with responsive grids and sticky primary action on mobile.
   - Files: `src/app/components/MobileNav.tsx`, `src/app/App.tsx`,
     `src/app/components/CollectionsView.tsx`, `src/app/components/PaymentRequestsView.tsx`,
     `src/app/components/ReportsView.tsx`, `src/app/components/UnitsView.tsx`,
     `src/app/components/CustomersView.tsx`, `src/app/components/UnitDetailView.tsx`,
     `src/app/components/CustomerDetailView.tsx`.

0.1) **Error reporting context**
   - Sentry now receives user/org context for better triage.
   - Files: `src/lib/errorReporter.ts`, `src/app/App.tsx`.
0.2) **Onboarding repair + org bootstrap (still unresolved)**
   - Added org-creation guard screen when org profile is missing, with Retry + Sign out.
   - Added RPC `ensure_user_profile()` to backfill missing user/org linkage and fix NULL status.
   - `useOnboarding` now attempts recovery via `ensure_user_profile()` when user/org load fails.
   - Files: `src/app/App.tsx`, `src/hooks/useOnboarding.ts`, `supabase/functions.sql`.
1) **Org join + pending approval flow (Org ID-based)**
   - Orgs now have `org_code` (short, shareable Org ID).
   - New join flow: signup with `join_org_code` → user is created as `pending`, approved by Executive/Manager.
   - New tables: `org_join_requests`, `org_id_attempts` (rate limit org code validation).
   - New RPCs: `validate_org_code`, `get_join_request_status`,
     `admin_approve_join_request`, `admin_reject_join_request`, `admin_update_user_role`, `ensure_org_codes`.
   - UI: AdminLogin “Create Org / Join Org” toggle, pending approval holding screen,
     Settings → Users now shows join requests + Org ID display.
   - Files: `supabase/schema.sql`, `supabase/functions.sql`, `supabase/rls.sql`,
     `supabase/rls_core.sql`, `src/app/components/AdminLogin.tsx`,
     `src/app/App.tsx`, `src/app/components/SettingsView.tsx`,
     `src/hooks/useProfile.ts`, `src/hooks/useOnboarding.ts`.

2) **Org-scoped customer portal login + first-login PIN**
   - New RPCs: `customer_portal_login(p_org_slug, p_project_id, p_unit_number, p_pin)`,
     `customer_portal_get_projects_by_slug(p_org_slug)`, `customer_portal_set_pin(session, new_pin)`.
   - Auto-creates portal user for each unit via trigger (default PIN `123456`, `must_change_pin = true`).
   - Files: `supabase/functions.sql`, `supabase/schema.sql`, `supabase/rls.sql`.

3) **Announcements/reminders + dispatch pipeline**
   - Announcements/reminders are project-scoped and can generate dispatch records.
   - Functions: `communications_dispatch_refresh_recipients`, `communications_dispatch_run`,
     `communications_dispatch_run_due`, trigger handlers for announcements/reminders.
   - Files: `supabase/functions.sql`, `supabase/schema.sql`, `supabase/rls.sql`.

4) **Manual payment proof flow + admin approval**
   - Customer portal can submit a payment proof request (amount + method + reference + receipt URL + notes).
   - Requests create `payment_intents` rows with `pending_verification`.
   - Admin approval RPC records the approving user (`approved_by`, `approved_at`) and creates a payment.
   - Duplicate handling: approving one intent supersedes other pending intents for same unit+amount.
   - Added admin reject RPC (`admin_reject_payment_intent`).
   - UI: Customer portal dialog + unit detail “Pending Payment Requests.”
   - Files: `supabase/functions.sql`, `supabase/schema.sql`,
     `src/app/components/customer/CustomerDashboard.tsx`, `src/app/components/UnitDetailView.tsx`.

5) **Activity logs for payment intents**
   - Logs `payment_intent_created`, `payment_intent_approved`, `payment_intent_rejected`, `payment_intent_assigned`.
   - File: `supabase/functions.sql`.

6) **Audit coverage for payments, unit status, documents**
   - Added triggers for `payment_recorded`, `unit_status_changed`, `document_uploaded`, `document_deleted`.
   - File: `supabase/functions.sql`.

7) **RPC input validation tightened**
   - Added basic validation and org-scope checks for portal/payment/admin RPCs.
   - File: `supabase/functions.sql`.

8) **RLS + performance test scripts**
   - Manual SQL test scripts for RLS role coverage and dashboard perf checks.
   - Files: `supabase/tests/rls_role_coverage.sql`, `supabase/tests/perf_sanity.sql`.

9) **RLS core trimmed**
   - `supabase/rls_core.sql` created to avoid `storage.objects` ownership issues in SQL editor.
   - Storage policies must be configured via Supabase Storage UI.

10) **Collections workbench + timeline**
   - Queue filters (project/phase/days late), bulk actions, and unit timeline logs.
   - Files: `src/app/components/CollectionsView.tsx`, `src/app/components/UnitDetailView.tsx`.

11) **Reports upgrades**
   - Cashflow by project, AR aging buckets, unit profitability summary + CSV exports.
   - File: `src/app/components/ReportsView.tsx`.

12) **Move-in checklist + warranty/defects**
   - New tables: `move_in_checklist_items`, `unit_defects`, with RLS policies.
   - UI: checklist + defects in unit detail; defects surfaced in customer portal.
   - Files: `supabase/schema.sql`, `supabase/rls_core.sql`, `supabase/rls.sql`,
     `src/app/components/UnitDetailView.tsx`, `src/app/components/customer/CustomerDashboard.tsx`.

13) **Onboarding setup checklist + templates**
   - Setup UI with “Marketplace” vs “Private” template choices (seeded into `template_configs`), with
     marketplace presets as curated starting points and private templates editable later via Template Configs.
   - File: `src/app/components/SetupOrganization.tsx`.

14) **Subscription tiers + usage limits**
   - Tier definitions and usage limits (projects/units/exports).
   - Gated exports and bulk import by plan; limits enforced on add project/unit.
   - Usage card in Settings.
   - Files: `src/app/utils/subscription.ts`, `src/app/components/ReportsView.tsx`,
     `src/app/components/BulkOperationsView.tsx`, `src/app/components/AddProjectModal.tsx`,
     `src/app/components/AddUnitModal.tsx`, `src/app/components/SettingsView.tsx`, `src/app/App.tsx`.

15) **Production tooling playbook**
   - Added `PRODUCTION_TOOLING.md` (monitoring, backups, release checklist).

16) **Activity log now uses real data**
   - Activity log UI is backed by `activity_logs` (no more mock list), with unit context lookup and action labels.
   - File: `src/app/components/ActivityLogView.tsx`.

17) **Mock data removed + simulation seed**
   - Mock data module removed; shared types now in `src/app/types`.
   - Date logic uses runtime helpers in `src/app/utils/date.ts`.
   - Added `scripts/seed-simulation.ts` for realistic workflow dataset seeding.

18) **Mock/placeholder cleanup + settings persistence**
   - Removed demo tour UI and demo role switch from the main app shell.
   - Settings now load/save organization data to Supabase, including contact fields and settings JSONB.
   - Neutralized placeholder UI copy across onboarding, login, payments, and customer portal surfaces.
   - Files: `src/app/App.tsx`, `src/app/components/SettingsView.tsx`,
     `src/hooks/useOnboarding.ts`, `src/app/components/SetupOrganization.tsx`,
     `src/app/components/AddProjectModal.tsx`, `src/app/components/AdminLogin.tsx`,
     `src/app/components/customer/CustomerDashboard.tsx`,
     `src/app/components/customer/CustomerLogin.tsx`,
     `src/app/components/payments/RecordPaymentModal.tsx`,
     `src/app/components/AddUnitModal.tsx`, `index.html`.

19) **Docs cleanup**
   - Removed “mock/demo/prototype” language and replaced with “simulation seed/validation walkthrough.”
   - Files: `START_HERE.md`, `MIGRATION_CHECKLIST.md`, `QUICK_REFERENCE.md`,
     `NEXSYS_PROJECT_OVERVIEW.md`, `README.md`, `CHANGELOG.md`, `ARCHITECTURE.md`,
     `CODEX_PROMPT_TEMPLATE.md`, `COMPONENT_DOCUMENTATION.md`,
     `TESTING_PROTOCOL.md`, `BUSINESS_DEVELOPMENT_PLAN.md`.

20) **Seed safety fix (admin demotion trigger)**
   - Updated `prevent_last_admin_demotion` to avoid blocking user moves during seed.
   - File: `supabase/functions.sql`.

21) **Seed current org (UI + RPC)**
   - Added RPC `seed_current_org(p_profile)` to seed a realistic dataset into the signed-in org.
   - Added Settings → System → Simulation Data button for Executives/Managers.
   - Files: `supabase/functions.sql`, `src/app/components/SettingsView.tsx`, `TESTING_GUIDE.md`, `SIMULATION_GUIDE.md`.

## Required DB Setup (apply deltas only)
Important: **Do not re-run full `supabase/schema.sql`** if tables already exist (causes “relation already exists”).
Apply only new changes or use `IF NOT EXISTS`/`DROP FUNCTION` patterns.

Minimum required deltas for the latest payment flow:
```sql
ALTER TABLE payment_intents
  ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;
```

Then run the updated function definitions in `supabase/functions.sql`
(they already include `DROP FUNCTION IF EXISTS` for signature changes).
Ensure `seed_current_org` is granted to authenticated users.

Minimum required deltas for Org ID join flow:
```sql
ALTER TABLE organizations
  ADD COLUMN IF NOT EXISTS org_code TEXT UNIQUE;

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;
```

Create new tables and indexes from `supabase/schema.sql`:
- `org_join_requests`
- `org_id_attempts`

Then run the updated function definitions in `supabase/functions.sql`,
and execute `SELECT public.ensure_org_codes();` once to backfill Org IDs.

RLS is in `supabase/rls.sql`; use `supabase/rls_core.sql` in SQL editor to avoid storage ownership issues.

Newer schema deltas to apply if missing:
- `move_in_checklist_items` table + index (`supabase/schema.sql`).
- `unit_defects` table + index (`supabase/schema.sql`).
- RLS policies for `move_in_checklist_items` and `unit_defects` (`supabase/rls_core.sql` or `supabase/rls.sql`).

Storage policies must be created in Supabase Storage UI (documents bucket):
- Auth SELECT/INSERT/DELETE: `bucket_id = 'documents'`
- Anon SELECT/INSERT for receipts: `bucket_id = 'documents' AND name LIKE 'portal/receipts/%'`

## Known Behavior / Gaps
- Storage policies cannot be applied from SQL editor due to `storage.objects` ownership; must use Storage UI.
- Org invitation links are deprecated; Org ID + approval flow is now the supported join path.
- Pending users are blocked from org data until approved (holding screen only).
- **Blocking:** Create-org flow still shows “We’re still preparing your organization” (org profile not loading) even after retries; onboarding cannot proceed.
- Notification click-through is still pending (notification is visible but not actionable).
- Admin payment requests queue can stall in loading if backend query fails; check console/network.
- Customer portal warranty tab may show “Unable to load warranty items” if RPC `customer_portal_get_defects` is not created/applied in DB (404 on `/rpc/customer_portal_get_defects`). Run the function definition + grant from `supabase/functions.sql`.
- Demo tour feature is deferred (planned after cleanup for ROI presentation advantage). `DemoTour` component exists but is unused.
 - Some UI bugs reported during testing (see `BUG_TRACKING.md` for details).

## Next Step (execute immediately on “proceed”)
**Phase 5.4 Mobile UX Plan (see PLAN.md)**
- Mobile-first UX pass across admin + portal surfaces.

Afterward:
**End-to-end testing + simulation walkthroughs**
