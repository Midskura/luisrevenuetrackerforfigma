# NEXSYS - Changelog

All notable changes to the Nexsys project.

---

## [1.3.1] - January 15, 2026 - Org ID Join + Pending Approval

### ✨ Added
- Org ID (`org_code`) for organizations; Org ID join flow with pending approvals.
- Join request tracking (`org_join_requests`) + rate limiting (`org_id_attempts`).
- RPCs: `validate_org_code`, `get_join_request_status`, `admin_approve_join_request`,
  `admin_reject_join_request`, `admin_update_user_role`, `ensure_org_codes`.
- Pending approval holding screen with encoder guide + “Powered by: Nexsys Solutions”.
- Settings → Users shows pending access requests and Org ID display.
- Managers can only promote encoders to manager; only executives can demote managers.

### 🗂 Files Updated
- `supabase/schema.sql`, `supabase/functions.sql`, `supabase/rls.sql`, `supabase/rls_core.sql`
- `src/app/components/AdminLogin.tsx`, `src/app/App.tsx`
- `src/app/components/SettingsView.tsx`, `src/hooks/useProfile.ts`, `src/hooks/useOnboarding.ts`

## [1.3.0] - January 15, 2026 - Operations + Billing/Access

### ✨ Added
- Collections workbench (filters, batch actions, unit timeline).
- Reports: cashflow by project, AR aging, unit profitability + CSV exports.
- Move-in checklist + warranty/defect tracking (admin + portal surfacing).
- Onboarding: guided setup checklist + marketplace/private templates + preset seeding.
- Subscription tiers + usage limits (projects/units/exports) + export tracking.
- Feature gating for exports, bulk import, and add project/unit limits.
- Production tooling playbook (`PRODUCTION_TOOLING.md`).

### 🗂 Files Updated
- `src/app/components/CollectionsView.tsx`
- `src/app/components/UnitDetailView.tsx`
- `src/app/components/ReportsView.tsx`
- `src/app/components/SetupOrganization.tsx`
- `src/app/components/SettingsView.tsx`
- `src/app/components/BulkOperationsView.tsx`
- `src/app/components/AddProjectModal.tsx`
- `src/app/components/AddUnitModal.tsx`
- `src/app/utils/subscription.ts`
- `supabase/schema.sql`, `supabase/rls_core.sql`

## [1.2.0] - January 15, 2026 - Org-Scoped Customer Portal

### ✨ Added
- Org-scoped customer portal login (org slug + project + unit number + PIN)
- Auto-provisioned portal users on unit creation/import
- First-login PIN reset flow (`must_change_pin`)
- Project selector in customer portal login
- Portal session guard remains RPC-based

### 📄 Docs Updated
- `PLAN.md` (portal scope + reset flow)
- `ARCHITECTURE.md` (portal access model)
- `CURRENT_STATE.md` and `SUMMARY.md` (status refresh)

## [1.2.1] - January 15, 2026 - Communications Dispatch Queue

### ✨ Added
- Dispatch runner RPC to enqueue communications
- Announcements/reminders can auto-queue to dispatch (optional toggle)
- Campaigns now compute recipients with filters before send
- Scheduled dispatch runner for due campaigns
- Admin button to run due dispatches from Campaigns tab

## [1.2.2] - January 15, 2026 - Payment Intents Scaffold

### ✨ Added
- `payment_intents` table with RLS and indexes for gateway tracking

## [1.2.3] - January 15, 2026 - Portal Payment Requests

### ✨ Added
- Customer portal RPC to create payment intents (manual placeholder)
- Customer portal "Make Payment" now logs a payment request

## [1.2.4] - January 15, 2026 - Manual Payment Verification

### ✨ Added
- Payment proof submission fields stored on payment intents
- Admin approval RPC posts payments and records approving user
- Unit detail view shows pending payment requests with approve action
- Customer portal payment modal for receipt details

### 🗂 Files Updated
- `supabase/schema.sql`
- `supabase/functions.sql`
- `src/app/components/customer/CustomerDashboard.tsx`
- `src/app/components/UnitDetailView.tsx`

### 🗂 Files Updated
- `supabase/functions.sql`
- `src/app/components/customer/CustomerDashboard.tsx`

## [1.0.0] - December 30, 2025 - READY FOR CODEX MIGRATION

### 📚 Documentation Created (10 files)

#### Core Documentation
- ✅ **NEXSYS_PROJECT_OVERVIEW.md** - Complete business and technical overview
- ✅ **TECHNICAL_SPECIFICATION.md** - Full database schema and backend architecture
- ✅ **COMPONENT_DOCUMENTATION.md** - All 13 components documented
- ✅ **DESIGN_SYSTEM_GUIDE.md** - Complete design system specification
- ✅ **BUG_TRACKING.md** - Bug history and known issues

#### Helper Documentation
- ✅ **START_HERE.md** - AI assistant onboarding guide
- ✅ **MIGRATION_CHECKLIST.md** - Quick reference for developers
- ✅ **CODEX_PROMPT_TEMPLATE.md** - Pre-written prompts for Codex
- ✅ **QUICK_REFERENCE.md** - One-page quick reference card
- ✅ **README.md** - Documentation index and navigation
- ✅ **CHANGELOG.md** - This file

**Total:** ~15,000 lines of documentation, 90-minute read time

---

## [0.9.0] - December 30, 2025 - Bug Fix Session #2

### 🐛 Critical Bugs Fixed (3 bugs)

#### Bug #15: Date Validation Using Real Dates
**Severity:** Critical  
**Impact:** Payment validation broken, accepting invalid dates  

**Problem:**
- RecordPaymentModal was using `new Date()` instead of simulation date
- Default date was real-world date (Dec 30, 2025)
- Max date validation using real-world date
- Breaking simulation consistency (Jan 15, 2026)

**Fix:**
- Switched to date helpers in `src/app/utils/date.ts`
- Default payment date uses runtime date
- Max date validation uses runtime date

**Files Modified:**
- `/src/app/components/payments/RecordPaymentModal.tsx`

**Commit:** "Fix date validation to use simulation date"

---

#### Bug #16: Payments Not Updating Schedule
**Severity:** Critical  
**Impact:** Payment recording appeared to work but didn't update anything  

**Problem:**
- Recording payment showed success toast
- Payment schedule remained unchanged (all "Unpaid")
- Dashboard metrics didn't update
- No persistence of payment state
- Changes only in local component state

**Fix:**
- Schedule updates now happen in the database (record_payment + update_days_late RPC)
- UI refetches real data after payments are recorded

**Files Modified:**
- `/src/app/App.tsx` - Added `handleUpdateUnit` handler
- `/src/app/components/UnitDetailView.tsx` - Added payment calculation logic

**Logic Implemented:**
```typescript
// Calculate months paid
let remainingPayment = paymentAmount;
for each unpaid month in schedule:
  if remainingPayment >= monthlyAmount:
    mark as "Paid", remainingPayment -= monthlyAmount
  else if remainingPayment > 0:
    mark as "Partial", partialAmount = remainingPayment
```

**Commit:** "Implement payment schedule updates and arrears calculation"

---

#### Bug #17: Tour Not Auto-Scrolling to Targets
**Severity:** Medium  
**Impact:** Demo tour unusable - couldn't see highlighted elements  

**Problem:**
- Tour would highlight target element (e.g., "Log Payment" button)
- Element remained off-screen
- User couldn't see what to click
- Tour card blocked view of target
- No automatic scrolling

**Fix:**
- Added `element.scrollIntoView()` in DemoTour useEffect
- Implemented auto-scroll with smooth behavior
- Centers element in viewport
- Dynamic card positioning to avoid blocking
- Added 300ms delay for DOM to settle

**Features Added:**
- Smooth scroll animation
- Block: 'center' positioning
- Card repositioning logic (top-left vs bottom-right)
- Animated pointer (👇/☝️) pointing to target
- 150ms polling to keep tracking element

**Files Modified:**
- `/src/app/components/DemoTour.tsx`

**Code Added:**
```typescript
element.scrollIntoView({ 
  behavior: 'smooth', 
  block: 'center' 
});
```

**Commit:** "Add auto-scroll and dynamic positioning to guided walkthrough"

---

### ✅ Testing Completed
- ✅ Payment recording updates schedule immediately
- ✅ Dashboard metrics reflect payment changes
- ✅ Tour auto-scrolls to all target elements
- ✅ Tour card positions correctly to avoid blocking
- ✅ All 3 bugs verified fixed

---

## [0.8.0] - Before December 30, 2025 - Bug Fix Session #1

### 🐛 Critical Infrastructure Bugs Fixed (14 bugs)

1. ✅ Sidebar navigation broken - Fixed active state detection
2. ✅ Collections view not filtering - Fixed status filtering logic
3. ✅ Payment modal validation - Added proper form validation
4. ✅ Date picker not working - Fixed date input component
5. ✅ Dashboard metrics incorrect - Fixed calculation logic
6. ✅ Unit detail not loading - Fixed data passing
7. ✅ Payment schedule not displaying - Fixed component props
8. ✅ Status badges wrong colors - Fixed color mapping
9. ✅ Back button not working - Fixed navigation handler
10. ✅ Progress bar not showing - Fixed percentage calculation
11. ✅ Empty state not displaying - Added conditional rendering
12. ✅ Hover effects not working - Added onMouseOver/Out handlers
13. ✅ Typography inconsistent - Applied design system
14. ✅ Spacing inconsistent - Applied 8px grid

**Impact:** All core functionality working, UI polished

---

## [0.7.0] - Days 1-5 Complete

### ✨ Features Implemented

#### Components Built (13 total)
- ✅ Sidebar - Navigation with role/project switcher
- ✅ DashboardView - Portfolio metrics and alerts
- ✅ CollectionsView - At-risk units list
- ✅ UnitDetailView - Comprehensive unit details
- ✅ CollectionCard - Unit card in collections
- ✅ StatCard - Reusable metric display
- ✅ RecordPaymentModal - Payment entry form
- ✅ PaymentSchedule - Monthly schedule display
- ✅ PaymentHistory - Payment records list
- ✅ PaymentDetailModal - Payment detail viewer
- ✅ DemoTour - Interactive guided tour
- ✅ ui/button - Button component
- ✅ ui/card - Card container
- ✅ ui/badge - Status badges
- ✅ ui/dialog - Modal dialogs
- ✅ ui/progress - Progress bars
- ✅ ui/separator - Dividers

#### Features
- ✅ Payment workflow (Collections → Unit → Payment → Dashboard)
- ✅ Dashboard metrics calculation
- ✅ Collections filtering and sorting
- ✅ Payment schedule tracking
- ✅ Payment history display
- ✅ Status badges with color coding
- ✅ Demo tour (8 steps, 80% functional)

#### Design System
- ✅ Color palette defined (#EF4444 primary red)
- ✅ Typography scale (Inter font)
- ✅ Spacing system (8px grid)
- ✅ Component patterns (cards, buttons, badges)
- ✅ Consistent shadows and borders
- ✅ Hover states and transitions

#### Simulation Seed Data
- ✅ Seed script creates multi-project, multi-status datasets
- ✅ Mixed statuses (Critical, Overdue, At Risk, etc.)
- ✅ Payment schedules with history

---

## [0.6.0] - Sidebar Rebrand

### ✨ Features
- ✅ New "NEXSYS" branding (replaced "Revenue Portal")
- ✅ Gradient logo with "N" initial
- ✅ Improved sidebar styling
- ✅ Consistent brand identity

---

## [0.5.0] - Initial Build

### ✨ Features
- ✅ Basic dashboard layout
- ✅ Unit listing
- ✅ Payment recording (basic)
- ✅ Seed data structure

---

## Known Issues (Current)

### 🔧 Issue #1: Guided Flow Polish
**Severity:** Low  
**Status:** Minor UX polish  
**Impact:** Some onboarding copy is generic  
**Fix:** Content refinement during validation

### 🔧 Issue #3: No Real-time Updates
**Severity:** Medium  
**Status:** By design, awaiting Supabase  
**Impact:** Single-tab usage only  
**Fix:** Supabase Real-time (planned)

### 🔧 Issue #4: No Authentication
**Severity:** High  
**Status:** Feature gap  
**Impact:** Cannot deploy to production  
**Fix:** Supabase Auth (planned)

### 🔧 Issue #5: Tour Unit ID Dependencies
**Severity:** Medium  
**Status:** Will break after Supabase  
**Impact:** Demo tour won't find Irene Villanueva  
**Fix:** Update tour to use blockLot instead of ID

---

## Roadmap

### Phase 1: Database Integration (Next - 2-3 days)
- [ ] Create Supabase project
- [ ] Deploy database schema (10 tables)
- [ ] Enable Row-Level Security policies
- [ ] Seed database with simulation data
- [ ] Create Supabase client
- [ ] Implement useUnits() hook
- [ ] Migrate Dashboard component
- [ ] Migrate Collections component
- [ ] Migrate UnitDetailView component
- [ ] Add real-time subscriptions
- [ ] Test end-to-end persistence

### Phase 2: Authentication (Week 2)
- [ ] Implement Supabase Auth
- [ ] Create login/signup forms
- [ ] Add session management
- [ ] Implement protected routes
- [ ] Test role-based access

### Phase 3: Multi-tenant (Week 2)
- [ ] Test RLS policies
- [ ] Add organization management
- [ ] Implement user invitations
- [ ] Test data isolation

### Phase 4: Polish (Week 3)
- [ ] Error handling
- [ ] Loading states
- [ ] Empty states
- [ ] Optimize queries
- [ ] Fix guided walkthrough timing

### Phase 5: Pre-Sales (Week 4-8)
- [ ] Deploy to staging
- [ ] Create demo account
- [ ] Prepare pitch deck
- [ ] Contact 20+ prospects
- [ ] Collect 5+ deposits
- [ ] Gather feedback

### Phase 6: Full Build (Week 9-24)
- [ ] Only if 5+ deposits secured
- [ ] Customer portal
- [ ] Advanced reporting
- [ ] Email/SMS notifications
- [ ] Payment gateway integration
- [ ] Mobile optimization
- [ ] Production deployment

---

## Statistics

### Current State
- **Total Files:** 60+ (components, docs, config)
- **Documentation:** 10 files, ~15,000 lines
- **Components:** 13 components
- **Lines of Code:** ~5,000 (TypeScript + JSX)
- **Bugs Fixed:** 17
- **Known Issues:** 5
- **Test Coverage:** Manual testing only

### Metrics
- **Bundle Size:** ~200KB gzipped
- **Page Load:** <1s (seed data)
- **Payment Recording:** Instant (in-memory)
- **Dashboard Metrics:** Instant (calculated locally)

### Timeline
- **Days 1-5:** Core components (13 components)
- **Bug Fix #1:** 14 infrastructure bugs
- **Bug Fix #2:** 3 critical bugs
- **Documentation:** All 10 files created
- **Total Time:** ~5 days

---

## Contributors

- **AI Assistant (Figma Make):** Initial prototype development
- **Project Owner:** Business strategy, requirements, testing

---

## Version History

| Version | Date | Description |
|---------|------|-------------|
| 0.5.0 | Week 1 | Initial prototype |
| 0.6.0 | Week 2 | Sidebar rebrand |
| 0.7.0 | Week 3 | Days 1-5 complete (13 components) |
| 0.8.0 | Week 4 | Bug fix session #1 (14 bugs) |
| 0.9.0 | Dec 30 | Bug fix session #2 (3 critical bugs) |
| **1.0.0** | **Dec 30** | **Documentation complete, ready for Codex** |

---

## Next Version

### [1.1.0] - Planned (2-3 days)
**Goal:** Supabase integration complete

**Features:**
- Database persistence
- Real-time updates
- Authentication flows
- Multi-tenant isolation

**Bug Fixes:**
- Issue #2: Seed data persistence → Resolved
- Issue #3: No real-time updates → Resolved
- Issue #4: No authentication → Resolved
- Issue #5: Tour unit ID dependencies → Resolved

---

**Last Updated:** December 30, 2025  
**Current Version:** 1.0.0  
**Status:** Ready for production development in Codex
