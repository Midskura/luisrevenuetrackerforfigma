# 🐛 BUG FIX STATUS

**Last Updated:** January 15, 2026

---

## ✅ Latest Fixes
- Preset template seeding now includes `organization_id` to satisfy RLS.
- Template picker explanation added (Marketplace vs Private, changeable later).
- Export usage tracking + gating implemented for subscriptions.
- Add project/unit limit checks added to prevent silent failures.
- Activity logs UI now uses real `activity_logs` data.

---

## 🔧 Open Issues (Active)
- Payment requests queue can stall.
- Project creation failure needs error string (could be plan limit or RLS).
- Warranty RPC missing in DB can cause portal 404.
- Add unit flow missing occupancy prompt.
- Add unit flow missing “Add new customer”.
- Unexpected “next collection date” prompt.
- Unit view not refreshing immediately on switch.
- Payment popup overflow on mobile.
- Notification click-through opens empty queue.
- Settings header duplicated.
- Simulation seed missing function.
- Collection phase count mismatch.
- Customer portal reload redirects to admin dashboard.

---

## Next Debug Pass
- Capture toast error for project creation.
- Verify payment requests RPC/network response.
- Verify add-unit form fields and occupancy status handling.
- Audit portal routing on refresh and modal overflow on small screens.
