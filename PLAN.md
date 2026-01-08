# Development Plan & Roadmap
## Nexsys – Construction & Real Estate Developer Revenue System

**Version:** 3.0  
**Last Updated:** January 15, 2026  
**Status:** 🚧 Functional MVP Build In Progress  
**Strategy:** Build core developer workflow → Validate → Expand (build tracker + portal)

---

## Guiding Rule (Execution Discipline)
**The AI follows this plan without asking what to do next.** If a prerequisite is missing for a downstream feature, the prerequisite is built first. The end goal is a **fully working product**, not a partial demo.

---

## Product Focus (Non‑Negotiable)
**Target users:** Construction and real estate developers who sell units on installment or staged payment plans.  
**Core pain:** scale a unit‑based payment system and track delays/arrears to prevent loss.  
**Out of scope (for now):** general multi‑industry platform.

---

## Current Phase
**Phase 5.4: Mobile UX Overhaul**
- Navigation + layout system
- List/detail conversions for mobile
- Forms, reports, portal pass, and QA

---

## Success Criteria (for Phase 1)
- [x] Onboarding applies template → fields/statuses are visible everywhere
- [x] Add unit works for real data (not mock)
- [x] Unit detail view renders dynamic fields (no legacy real‑estate UI)
- [x] Payment schedule and payment history use real data
- [x] Dashboard KPIs reflect real data and template statuses
- [x] Collections view works with real statuses
- [x] Bulk import for units + customers + schedules

---

## Level‑By‑Level Build Plan

### Level 1 — Template Engine (Foundation)
**Goal:** Template controls labels, fields, statuses, and display structure.
- Apply template on onboarding (fields + statuses) ✅ done
- Read template labels everywhere ✅ done
- Use entity statuses everywhere ✅ done
- Define template config contract (labels/fields/statuses/metrics) ✅ in docs

**Remaining:**
- Ensure all views use template labels + status set
- Ensure unit detail view uses template fields ✅

### Level 2 — Data Entry (Input)
**Goal:** Everything users enter follows template and persists.
- Add unit (template fields + status) ✅ done
- Add customer (basic fields) ✅ done
- Edit customer (basic fields) ✅ done
- Edit customer (template fields) ✅ done
- Edit unit (template fields) ✅ done
- Validation based on required fields ✅ partial (units)

### Level 3 — Data Display (Output)
**Goal:** UI displays real data using template structure.
- Unit detail view (dynamic sections) ✅ done
- Customer detail view (dynamic sections) ✅ done
- Dashboard KPIs based on template metrics ✅ done
- Collections view aligned to template statuses ✅ done

### Level 4 — Core Workflow
**Goal:** Payments and risk tracking end‑to‑end.
- Create payment schedule for units ✅ done
- Record payment and update schedule ✅ done
- Update unit status automatically ✅ done
- Collections actions + risk indicators ✅ done

### Level 5 — Scale & Onboarding
**Goal:** Real businesses can migrate quickly.
- CSV bulk import for units + customers + schedules ✅ done
- Project creation flow in app ✅ done

---

## Immediate Execution (Next Actions)
**We will execute these in order, without skipping:**
1) **Reports view** uses real data (remove mock charts/metrics). ✅ done
2) **Customer portal** data uses real payments and documents. ✅ done
3) **Phase 5.3 Production Tooling** (monitoring + backups + release checklist) ✅ done
4) **Phase 5.4 Mobile UX Overhaul** (see below)

---

## Phase 2 (After Core Works)
- Project build tracker (construction progress tied to collections risk) ✅ done
- Customer portal per project (announcements, reminders, feedback) ✅ done

---

## Phase 3 — Production Readiness (Required for Marketable Launch)
**Goal:** Replace remaining mock/demo flows, harden security, and finalize UX for real clients.

### 3.1 Authentication & Access (Customer Portal)
1) Customer auth model:
   - Add `customer_portal_users` (email, phone, unit_id, customer_id, hashed_pin, last_login_at, is_active).
   - Decision: use custom login with `customer_portal_users` (no Supabase Auth for customers) and document in-plan.
2) Customer login:
   - Replace mock PIN validation with real lookup.
   - Lockout throttling + audit log.
3) Session boundaries:
   - Enforce customer portal access to only assigned unit(s).
   - Add RLS for customer portal tables.
4) Org-scoped portal:
   - Portal URL is org-scoped (subdomain or `/portal/{orgSlug}`).
   - Login requires org slug + project + unit number + PIN.
   - Project dropdown lists only org projects.
5) First-login reset:
   - Auto-provision portal user on unit create/import.
   - Default PIN `123456` with `must_change_pin` enforcement.

### 3.2 Communications (Templates + Real Delivery)
1) Replace mock templates with real `template_configs` rows.
2) Build admin CRUD for templates:
   - Create/edit/duplicate/delete (real).
   - Activate/deactivate.
2.1) Template variables:
   - Support placeholders (e.g. `{unit_block_lot}`, `{project_name}`, `{amount_due}`, `{days_late}`).
   - Add variable preview/sample data before send.
3) Delivery:
   - Add `communications_dispatch` table for jobs.
   - Implement send pipeline (email + SMS provider).
   - Add retry, failure reason, and delivery status.
4) Connect reminders/announcements to dispatch:
   - Announcements published → customer portal only.
   - Reminders can optionally trigger messages.

### 3.3 Payments (Real Payment Gateway)
1) Payment intents:
   - Add `payment_intents` table to track gateway state.
   - Add portal RPC to create intents with payment proof metadata.
   - Add admin approval RPC to post `payments` and record approving user.
2) Customer portal “Make Payment”:
   - Create intent → submit proof for manual verification (gateway later).
2.1) Payment request queue + notifications:
   - Add assigned approver/encoder queue (owner + status filters).
   - Send in-app notifications for new requests and approvals.
2.2) Payment intent precision:
   - Allow customer to select specific schedule month(s) to pay (backlog/advance).
   - Support multi-month intent metadata and display schedule before submission.
3) Webhook handling:
   - Receive payment success/failed, reconcile to `payments`.
   - Update schedules + units (reuse existing `record_payment`).

### 3.4 Documents (Real Download + Upload)
1) Connect `documents` to Supabase Storage buckets.
2) Replace mock download with signed URLs.
3) Add upload flow for admin with metadata (document_type).
4) Customer portal receipt upload for payment proof (store in storage, link to payment_intents metadata).

### 3.5 QA + Security
1) Add auditing for critical actions (payments, status, documents).
2) Add input validation on server functions (Supabase RPC).
3) Role coverage tests for RLS.
4) Performance sanity checks on key dashboards.

**Status:** ✅ done

---

## Phase 4 — Operations & Reporting
**Goal:** Make the system usable daily by admins and finance teams.

### 4.1 Collections + Risk Workbench
1) Add queue view with filters (risk, days late, project, phase).
2) Batch actions: schedule reminder, log call, add note.
3) Timeline log in unit detail.

**Status:** ✅ done

### 4.2 Financial Reporting
1) Exportable cashflow report by project.
2) AR aging buckets per project.
3) Unit profitability summary (price vs collected).

**Status:** ✅ done

### 4.3 Customer Lifecycle
1) Move-in readiness checklist per unit.
2) Warranty/defect tracking (optional if requested).

**Status:** ✅ done

---

## Phase 5 — Marketable Product (Packaging)
**Goal:** Make the app safe, sellable, and easy to onboard.

### 5.1 Onboarding & Templates
1) Templates marketplace (create/save/clone).
2) Preset templates for common developer workflows.
3) Guided setup checklist.
4) Selected template remains fully customizable via Template Configs (labels/fields/statuses can be updated after onboarding).

**Status:** ✅ done

### 5.2 Billing & Access
1) Subscription tiers with feature flags.
2) Usage limits (projects/units/exports).

**Status:** ✅ done

### 5.3 Production Tooling
1) Monitoring + error reporting.
2) Backups + migration playbook.
3) Release checklist.

**Status:** ✅ done

### 5.4 Mobile UX Overhaul (Admin + Portal)
**Goal:** Mobile experience is first‑class, not a scaled desktop. Prioritize speed, clarity, and touch-first workflows.

1) **Mobile UX Audit + Task Map**
   - Inventory top flows by role (Executive, Manager, Encoder, Customer).
   - Identify “must‑do” mobile tasks per role (record payment, approve requests, view arrears, upload docs).
   - Define mobile information architecture (IA) for admin vs customer portal.

2) **Navigation & Layout System**
   - Replace sidebar on mobile with bottom navigation + “More” drawer.
   - Add compact top bar with project selector and quick actions.
   - Standardize safe‑area spacing + minimum touch targets (44px).
   - Create mobile page templates (list, detail, form, report).

3) **Lists, Tables, and Filters**
   - Convert dense tables into card lists with primary/secondary info.
   - Add sticky search + filter chips, with filter drawer/bottom sheet.
   - Support quick sort + saved filters for Collections.

4) **Detail Views & Master‑Detail**
   - Use stacked layout (list → detail) with back affordances.
   - Move critical actions to sticky bottom action bar.
   - Collapse large panels into accordions (Payments, Notes, Schedule).

5) **Forms & Data Entry**
   - Break long forms into steps with progress.
   - Use numeric keypad for amounts; inline validation; explicit error states.
   - Replace modals with full‑screen sheets on mobile.

6) **Charts & Reports**
   - Provide simplified mobile report views (summary cards + trend chart).
   - Enable tap‑to‑expand for full chart/table.
   - Add export CTA with confirmation sheet.

7) **Customer Portal Mobile Pass**
   - Mobile‑first landing, schedule list, and payment proof upload flow.
   - Full‑screen PIN change flow; sticky “Pay Now” CTA.
   - Improve document preview/download UX on mobile.

8) **Performance & Loading**
   - Lazy‑load heavy views and charts on mobile routes.
   - Skeleton loaders for lists and detail sections.
   - Reduce initial JS footprint for mobile entrypoints.

9) **Accessibility & QA**
   - Touch target audit, contrast checks, keyboard focus order.
   - Test on iOS Safari + Android Chrome (portrait/landscape).
   - Regression checklist for core flows per role.
