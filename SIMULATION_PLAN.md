# Simulation Plan

## Goal
Create a realistic, repeatable dataset and run end-to-end workflows that mirror a real developer operations cycle (sales, collections, customer comms, and turn-over readiness).

## Seed Dataset Scope
- One new organization with admin, manager, and encoder users.
- Three projects with phases, mixed unit inventory (available, in payment cycle, at risk, overdue, fully paid).
- Customers with contact details mapped to units.
- Payment schedules and historical payments.
- Payment intents awaiting verification.
- Communications dispatch records (sent + scheduled).
- Project announcements and reminders (published).
- Move-in checklist items and unit defects.
- Project milestones for build tracking.

## Seed Script
- Script: `scripts/seed-simulation.ts`
- Command: `npm run seed` (or `npm run seed:simulation`)
- Output: org slug + user credentials for login

## Workflow Simulation Checklist
1) Admin onboarding
- Login as admin user created by the seed.
- Verify organization settings, project list, and units.

2) Collections + risk
- Open Collections view; confirm overdue and at-risk units are surfaced.
- Run bulk SMS reminder on overdue units.

3) Payments
- Open Payment Requests queue; approve one intent and reject another.
- Record a manual payment on a unit and confirm schedule/arrears updates.

4) Customer portal
- Login with a seeded unit and default PIN; reset PIN; verify dashboard data.
- Submit a new payment intent and confirm it appears in admin queue.
- Check announcements/reminders and submit feedback.

5) Communications
- Review dispatch history and create a new dispatch for a project.
- Verify recipients count refresh.

6) Reports
- Validate cashflow, AR aging, and profitability with seeded data.
- Export CSV and verify content.

7) Documents (if storage configured)
- Upload a document and confirm signed URL behavior.

8) Ops / build tracker
- Review milestones and move-in checklist progress.
- Add a defect and confirm portal visibility.

## Reset Guidance
- Use a new run by re-running the seed script (creates a new org slug per run).
- Avoid reusing the same slug to prevent conflicts.

## Notes
- Storage uploads require the documents bucket and policies configured in Supabase Storage.
- The dataset is designed to reveal edge cases: partial payments, overdue schedules, and approvals.
