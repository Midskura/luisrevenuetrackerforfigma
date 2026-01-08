# 📋 Quick Reference Summary
## What We're Building & How

**Last Updated:** January 15, 2026

---

## 🎯 Strategy (Execution Phases)

```
Phase 1: Functional Core ✅
Phase 2: Build Tracker + Customer Portal ✅
Phase 3: Production Readiness ✅
Phase 4: Operations & Reporting ✅
Phase 5: Marketable Product (5.1/5.2/5.3 ✅, 5.4 🚧)
```

---

## 📚 Documentation Map

- `PLAN.md` — authoritative execution plan.
- `CURRENT_STATE.md` — current status and next action.
- `HANDOFF.md` — handoff for new chats/agents.
- `TECHNICAL_SPECIFICATION.md` — schema and architecture.
- `ARCHITECTURE.md` — system design context.

---

## 🚀 Current Phase: Phase 5.4 (Mobile UX Overhaul)

### What We’re Building Now
- Mobile-first admin + portal UX (navigation, list/detail layouts, sheets).
- Touch-first workflows for collections, payments, and reporting.
- Mobile performance + accessibility validation.

### What’s Already Done
- Supabase-backed core flows (payments, schedules, portal, documents, communications).
- RLS + audit coverage, role tests, perf sanity tests.
- Collections workbench + timeline.
- Reports (cashflow, AR aging, profitability + CSV exports).
- Move-in checklist + warranty/defect tracking.
- Onboarding templates (marketplace/private) + preset seeding; selected templates remain editable via Template Configs.
- Billing & Access: subscription tiers, usage limits, export tracking, and gating.
- Org ID join flow with pending approvals + role-based approval UI.

### Known Open Issues
- Payment requests queue can stall (needs investigation).
- Customer portal warranty RPC must exist in DB.
- Project creation failure needs repro/error string.
- Reported UI issues: add unit occupancy prompt, add new customer in unit form,
  “next collection date” prompt, stale unit view on switch, payment popup overflow,
  notification click-through for payment requests, settings header duplication,
  collection phase count mismatch, simulation seed missing function, portal reload redirect.

---

## 🧭 Operating Principles
- Follow `PLAN.md` without asking what to do next.
- Keep features aligned to construction/real-estate developer workflows.
- Stabilize core pillars before polish.
- Apply DB deltas only (avoid re-running full schema).
