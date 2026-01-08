# 🎯 CURRENT STATE - Quick Pickup Document

**Last Updated:** January 15, 2026  
**Purpose:** Single source of truth for exactly where we are NOW. Read this first when context resets.

---

## 📍 WHERE WE ARE RIGHT NOW

**Phase:** Phase 5.4 - Mobile UX Overhaul  
**Progress:** Phase 5.3 Production Tooling completed (monitoring/error reporting + backup + release checklist)  
**Status:** Mobile nav/layout in progress; core lists + detail views transitioning to touch-first layouts  
**Next Action:** Finish mobile list/detail conversions, then mobile forms/sheets + portal pass

---

## ✅ WHAT'S COMPLETED (HIGH LEVEL)

### Core Product (Real Data)
- Supabase-backed admin + customer portal flows (org-scoped portal login + PIN reset).
- Manual payment proof flow with admin approval and duplicate handling.
- Announcements/reminders dispatch pipeline with recipients refresh + send triggers.
- Collections workbench: filters, batch actions, unit timeline.
- Reports: cashflow, AR aging, unit profitability + CSV exports.
- Operations: move-in checklist + warranty/defect tracking, surfaced in portal.
- Onboarding: guided setup checklist + marketplace/private templates + preset seeding (templates stay
  editable later via Template Configs for custom fields/statuses).

### Security & QA
- RLS core policies in `supabase/rls_core.sql` (storage policies via UI).
- Audit triggers for payments, unit status, documents.
- RLS role coverage + perf sanity SQL tests.
- Mock data removed; shared domain types live in `src/app/types` and date helpers in `src/app/utils/date.ts`.
- Simulation seed script added in `scripts/seed-simulation.ts` with a full workflow dataset.

### Billing & Access (Phase 5.2)
- Subscription tiers + feature flags + usage limits (projects/units/exports).
- Export usage tracking stored in `organizations.settings.usage`.
- Gated bulk import and report exports by tier.
- Limits enforced in Add Project/Unit flows.
- Subscription/usage card in Settings.
- Org ID join flow with pending approvals and role-based approval UI.

---

## 🚧 WHAT'S NOT DONE YET

### Phase 5.4 - Mobile UX Overhaul
- Convert remaining dense tables to mobile card lists (Collections, Payment Requests, Reports in progress).
- Mobile-stacked detail views with accordion sections + sticky action bars.
- Replace modals with full-screen sheets on mobile; fix overflow on payment flows.
- Portal mobile UX pass (login, unit view, payment proof upload).

### Known Open Issues
- Payment requests queue can stall “Loading payment requests” (investigate API/query).
- Customer portal warranty tab may fail if RPC `customer_portal_get_defects` not applied in DB.
- Project creation failed for user (likely RLS/limit/error); needs repro + error string.
 - Add unit flow missing occupancy prompt and “Add new customer” option.
 - Add unit asks for “next collection date” (unexpected).
 - Some pages do not reflect unit changes immediately on switch.
 - Payment popup overflows on small screens (no scroll).
 - Notification click-through for “new payment request” opens empty queue view.
 - Settings header duplicated.
 - Simulation seed failed: missing function.
 - Collection phase count mismatch (shows 0 units).
 - Customer portal reload redirects to executive dashboard.

---

## ✅ KEY SYSTEMS VERIFIED
- Customer portal: login + PIN reset + unit data + payments + documents + announcements/reminders + feedback.
- Payment intent approval: creates payment + logs activity + supersedes duplicates.
- RLS: core tables locked by org + role; portal sessions scoped by unit/org.
- Template engine: entity fields/statuses applied, dynamic labels across UI.

---

## 📦 TECH STACK

**Frontend:** React 18 + TypeScript + Vite + Tailwind + shadcn/ui + Recharts + Sonner  
**Backend:** Supabase (Auth + Postgres + RPC + Storage + RLS)  
**Testing:** SQL smoke tests in `supabase/tests`

---

## 🔥 CRITICAL CONTEXT FOR ANY AI
- Follow `PLAN.md` strictly without asking what to do next.
- Keep everything aligned to construction/real-estate developer workflows.
- Do not re-run full `supabase/schema.sql` in existing DB; apply deltas only.
- Storage policies for `documents` bucket must be configured in Supabase UI.
