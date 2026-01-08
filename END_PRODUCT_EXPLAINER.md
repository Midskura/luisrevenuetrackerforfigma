# Nexsys Revenue Tracker – End Product Explainer

## What it is
Nexsys Revenue Tracker is a revenue‑lifecycle system built for **construction and real estate developers** who sell units on installment or staged payment plans. It helps teams manage schedules, payments, delays, and risk across large portfolios of units with consistent workflows.

This is a **focused, industry‑depth product**. It is not a general multi‑industry platform.

---

## Core outcomes
- **Set up unit‑based payment tracking** for hundreds or thousands of units.
- **Track schedules and delays** to reduce leakage and manage risk.
- **Give teams a single source of truth** for status, history, and actions per unit and project.

---

## How it works (end‑to‑end flow)

### 0) First time setup (admin)
1. **Sign up / sign in** (Supabase auth).
2. **Organization onboarding**:
   - Name + business type
   - Choose the developer setup
   - Create the first project (site / tower / subdivision)
3. **Configuration applied automatically**:
   - Entity labels (Unit/Customer/Project naming)
   - Custom fields per entity (unit/customer/project)
   - Statuses and their order

### 1) Day‑to‑day use (operations)
1. **Add units** with minimal required info (or import in bulk).
2. **Assign a customer** (optional at first if pre‑sale pipeline).
3. **Track status + schedule** (due dates, payments, late days, arrears).
4. **Record payments** and automatically update schedules and unit status.
5. **Review dashboards** for KPIs: total units, in‑cycle, overdue, risk, revenue.
6. **Follow‑up workflows** (collections and communications).

### 2) Ongoing maintenance
- Adjust template fields/statuses as the business evolves.
- Add more projects/categories.
- Audit activity and performance.
- Export or report for leadership decisions.

---

## What the product does (feature list)

### Data model & configuration
- Developer‑focused configuration per organization.
- Custom fields for units/customers/projects.
- Custom statuses with ordering.

### Core operations
- Units inventory + filtering + search.
- Bulk import for existing units and schedules.
- Customer directory.
- Payment schedule tracking.
- Payment recording + history.
- Collections view with risk indicators.

### Visibility & decision‑making
- Executive dashboard with KPIs and risk breakdown.
- Project‑based filtering.
- Unit detail pages with history.

### Phase 2 extensions (after core is solid)
- Project build tracker (construction progress vs. collections risk).
- Customer portal per project (announcements, reminders, feedback).

---

## What it doesn’t do (explicitly)
- **No automated payments** (no payment gateway processing).
- **No automated email/SMS delivery** (only placeholders for now).
- **No full CRM replacement** (focus is revenue lifecycle, not full sales pipeline).
- **No deep accounting/ledger system** (not an ERP).
- **No custom code scripting** (configuration is template + fields, not programming).
- **No general multi‑industry support** in the core product.

---

## Who uses it
- **Executives**: see health of revenue, risk, and outstanding amounts.
- **Managers**: manage schedules, follow‑ups, and oversight.
- **Encoders**: enter unit/customer/payment updates.

---

## How this aligns with the original pain
- EL Construction needed a **unit‑based payment system** that scales.
- EL Construction needed **schedule and delay tracking** to reduce loss.
- Nexsys solves both with construction‑grade workflows and reporting.

---

## What success looks like
- A developer can onboard and import real portfolios fast.
- Units, payments, and statuses reflect the developer workflow.
- Collections risk is visible early enough to prevent loss.
