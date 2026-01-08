# NEXSYS - Bug Fixes & Known Issues

**Last Updated:** January 15, 2026

---

## ✅ Recently Resolved
- Preset templates load now include `organization_id` on insert (RLS-friendly).
- Customer portal warranty RPC surfaced; ensure DB function is applied to avoid 404.
- Nullish coalescing error in `CustomerDashboard` fixed.
- Activity logs UI now uses real `activity_logs` data.
- Customer portal reload no longer redirects to admin dashboard.
- Settings header duplication resolved.
- Add Unit default form includes Unit Full Price.
- Add Unit default form includes customer selector.
- Profile role indicator pill removed from top-right profile card.
- Communications → Campaigns “New Campaign” Select error resolved.
- Available units no longer show next payment due prompt.

---

## Current Known Issues 🔧

### Issue 14: Org ID generation fails (missing ensure_org_codes RPC)
**Severity:** High  
**Impact:** Org ID not shown; join flow blocked  
**Status:** Fixed  
**Notes:** Applied updated `supabase/functions.sql` and backfilled org codes.

### Issue 15: Join requests table missing in DB
**Severity:** High  
**Impact:** Join requests fail to load; join flow blocked  
**Status:** Open  
**Notes:** Create `org_join_requests` and `org_id_attempts` from `supabase/schema.sql`.

### Issue 16: Simulation seed fails (missing seed_current_org RPC)
**Severity:** Medium  
**Impact:** “Seed Current Org” button fails  
**Status:** Open  
**Notes:** Apply latest `supabase/functions.sql` and grant `seed_current_org` to authenticated.

### Issue 17: Communications → Campaigns “New Campaign” fails
**Severity:** Medium  
**Impact:** Cannot create or send campaigns  
**Status:** Fixed  
**Notes:** Removed empty Select item and aligned default filter value.

### Issue 18: Prevent last Executive demotion (self-demotion allowed)
**Severity:** Medium  
**Impact:** Organization can lose all executive access  
**Status:** Fixed  
**Notes:** Added server-side guard in `admin_update_user_role`.

### Issue 19: Project setup/settings missing
**Severity:** High  
**Impact:** Teams cannot tailor workflow per project  
**Status:** Open  
**Notes:** Add project-level settings UI and data model (per-project defaults, labels, statuses).

### Issue 20: Unit detail customization needs to be per-project
**Severity:** High  
**Impact:** Mixed project types cannot be modeled cleanly  
**Status:** In Progress  
**Notes:** Added project-scoped unit fields + project template selection on create; requires DB migration to add `entity_fields.project_id` and updated uniqueness.

### Issue 1: Payment requests queue stuck loading
**Severity:** High  
**Impact:** Admin queue can stall at “Loading payment requests”  
**Status:** Open  
**Notes:** Investigate RPC/network error in `PaymentRequestsView`.

### Issue 2: Project creation failure
**Severity:** Medium  
**Impact:** User cannot add project in UI  
**Status:** Open  
**Notes:** Could be RLS policy, plan limit, or API error. Capture toast error string.

### Issue 3: Portal warranty tab 404 (if RPC missing)
**Severity:** Medium  
**Impact:** “Unable to load warranty items”  
**Status:** Fixed  
**Notes:** `customer_portal_get_defects` applied and granted.

### Issue 4: Add Unit flow missing occupancy prompt
**Severity:** Medium  
**Impact:** Users cannot indicate if unit is already occupied  
**Status:** Fixed  
**Notes:** Occupancy selector added; verify dropdown selection behavior.

### Issue 5: Add Unit flow lacks “Add new customer”
**Severity:** Medium  
**Impact:** Must leave unit form to create a customer  
**Status:** Open  
**Notes:** Add inline customer creation or quick-add modal.

### Issue 6: Unexpected “Next collection date” prompt
**Severity:** Low  
**Impact:** Confusing extra field during add unit flow  
**Status:** Open  
**Notes:** Confirm whether it should be removed or auto-calculated.

### Issue 7: Unit switch does not reflect updates immediately
**Severity:** Medium  
**Impact:** Stale unit detail when switching units  
**Status:** Open  
**Notes:** Check state refresh + query invalidation on selection change.

### Issue 8: Payment popup overflows on small screens
**Severity:** Medium  
**Impact:** Modal content is cut off, no scroll  
**Status:** Open  
**Notes:** Use full-screen sheet or scrollable dialog.

### Issue 9: Notification click-through opens empty queue
**Severity:** Medium  
**Impact:** Executive sees empty “My Queue” when clicking new payment request notification  
**Status:** Open  
**Notes:** Update deep link to “All Requests” or correct queue filter.

### Issue 10: Settings header duplicated
**Severity:** Low  
**Impact:** UI duplication in Settings view  
**Status:** Fixed  
**Notes:** Resolved in UI layout.

### Issue 11: Simulation seed failed (missing function)
**Severity:** Medium  
**Impact:** Seed script or UI seed fails  
**Status:** Open  
**Notes:** Identify missing RPC/SQL function and add grant.

### Issue 12: Collection phase count mismatch
**Severity:** Medium  
**Impact:** Collections phase shows 0 units when units exist  
**Status:** Open  
**Notes:** Investigate filtering + data source.

### Issue 13: Customer portal reload redirects to admin dashboard
**Severity:** Medium  
**Impact:** Portal session breaks on refresh  
**Status:** Fixed  
**Notes:** Portal routing/session detection resolved.

### Issue 14: Add Unit missing full price field
**Severity:** High  
**Impact:** Users cannot enter the total unit selling price in the default Add Unit flow  
**Status:** Fixed  
**Notes:** “Unit Full Price” added to default unit form.

### Issue 15: Add Unit missing customer field
**Severity:** High  
**Impact:** Users cannot assign customer when creating a unit via default form  
**Status:** Fixed  
**Notes:** Customer selector added to default unit form.

### Issue 16: Profile pill overlaps name card
**Severity:** Low  
**Impact:** Role indicator pill clutters profile UI  
**Status:** Fixed  
**Notes:** Role indicator pill removed from profile card.

### Issue 21: Reports page crash (safeRevenueData not defined)
**Severity:** High  
**Impact:** Reports view crashes on load  
**Status:** Open  
**Notes:** Investigate runtime error pointing to `ReportsView.tsx` with `safeRevenueData` undefined.

### Issue 22: Occupancy dropdown not working in Add Unit modal
**Severity:** Medium  
**Impact:** Occupancy selection cannot be changed  
**Status:** Open  
**Notes:** Verify Select component state binding and value propagation.

---

## Bug-Catching Philosophy

### Fix Immediately (Critical)
- Data corruption or loss
- Payment calculation errors
- Authentication bypasses
- Crashes

### Batch (Non-Critical)
- UI polish
- Minor performance issues
- Cosmetic inconsistencies
