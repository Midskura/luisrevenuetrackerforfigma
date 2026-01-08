# START HERE - Codex AI Onboarding

**Welcome!** You're taking over the Nexsys project from Figma Make. This file is your entry point.

---

## What You Need to Know in 60 Seconds

**Project:** Nexsys - Revenue Lifecycle Management Platform  
**Target:** Philippine SMBs with unit-based revenue cycles (real estate first, templates expand to other industries)  
**Status:** Core UI built + Supabase backend in progress  
**Timeline:** Build functional MVP with configurable templates, then pre-sales  
**Current Date (Simulation):** January 15, 2026  

---

## Read These Files IN ORDER

1. **`MIGRATION_CHECKLIST.md`** ← Quick reference guide (10 min read)
2. **`NEXSYS_PROJECT_OVERVIEW.md`** ← Business context (15 min read)
3. **`TECHNICAL_SPECIFICATION.md`** ← Database schema (20 min read)
4. **`COMPONENT_DOCUMENTATION.md`** ← All components (20 min read)
5. **`DESIGN_SYSTEM_GUIDE.md`** ← Design patterns (15 min read)

**Total Reading Time:** ~80 minutes

---

## Your First Task

The user wants to build a **production-ready app with real database** because:
- Seeded data is the reference set for validation
- Guided walkthrough is planned after cleanup and needs real persistence
- It's end-of-year week (Dec 30), can't do outreach yet
- 2-3 days of dev time available before Jan 2026 outreach

**Your job:** Deliver a functional MVP with Supabase backend and a template-driven setup that keeps the core revenue tracking engine consistent.

---

## Step-by-Step: First 2 Hours

### Hour 1: Setup Supabase

1. **User creates Supabase project:**
   - Go to supabase.com → Create new project
   - Wait for database to provision (~2 min)
   - Get Project URL and anon key from Settings → API

2. **You create database schema:**
   - Copy full schema from TECHNICAL_SPECIFICATION.md
   - Run in Supabase SQL Editor
   - Enable RLS policies
   - Verify tables created

3. **You add Supabase client:**
   ```bash
   npm install @supabase/supabase-js @supabase/auth-helpers-react
   ```
   
   Create `/src/lib/supabase.ts`:
   ```typescript
   import { createClient } from '@supabase/supabase-js';
   
   const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
   const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
   
   export const supabase = createClient(supabaseUrl, supabaseAnonKey);
   ```
   
   Create `.env.local`:
   ```
   VITE_SUPABASE_URL=<user provides>
   VITE_SUPABASE_ANON_KEY=<user provides>
   ```

### Hour 2: Seed Database

1. **You create seed script:**
   - Generate a simulation dataset for a fresh org (users, projects, units, schedules)
   - See TECHNICAL_SPECIFICATION.md → "Simulation Seeding"
   - Create `/scripts/seed-simulation.ts`

2. **You run seed:**
   ```bash
   npm run seed
   ```

3. **Verify data in Supabase:**
   - Open Supabase Table Editor
   - Check units, customers, payment_schedules populated

---

## What's Already Built (Don't Rebuild)

✅ **Core React Components:**
- Sidebar with navigation
- Dashboard with metrics
- Collections view (at-risk units)
- Unit detail view with payment schedule
- Payment recording modal
- Payment history display
- Bulk operations view

✅ **Design System:**
- Full color palette (#EF4444 primary red)
- Typography scale (Inter font)
- Component patterns (cards, buttons, badges)
- Consistent spacing (8px grid)

✅ **Seeded Data:**
- Simulation seed script for realistic org/project/unit/payment flows
- Seed run creates schedules, arrears states, and communications queues

---

## What Needs to Be Built (Your Tasks)

### Priority 1: Functional MVP ⭐⭐⭐
- [ ] Ensure onboarding creates org + first project
- [ ] Replace remaining local-state fallbacks with Supabase data
- [ ] Make add unit flow create real records
- [ ] Test payment recording persists and updates metrics

### Priority 2: Authentication ⭐⭐
- [ ] Add login/signup flows
- [ ] Session management
- [ ] Role-based access control

### Priority 3: Multi-tenant ⭐⭐
- [ ] Test RLS policies
- [ ] Organization/project management
- [ ] User invitations

### Priority 4: Template Engine (Foundations) ⭐
- [ ] Define template config model (fields, statuses, labels)
- [ ] Keep core revenue tracking consistent across templates
- [ ] Error handling
- [ ] Loading states
- [ ] Empty states
- [ ] Optimize queries

---

## Key Files You'll Modify

### Must Change
- `/src/app/App.tsx` - Wire real data hooks and role context
- `/src/app/components/DashboardView.tsx` - Use useUnits() hook
- `/src/app/components/CollectionsView.tsx` - Use useUnits() hook
- `/src/app/components/UnitDetailView.tsx` - Use Supabase for payments

### Must Create
- `/src/lib/supabase.ts` - Supabase client
- `/src/hooks/useUnits.ts` - Units query hook
- `/src/hooks/usePayments.ts` - Payments query hook
- `/src/hooks/useAuth.ts` - Authentication hook
- `/scripts/seed-simulation.ts` - Simulation dataset seeding

### Don't Touch (Unless Necessary)
- `/src/styles/theme.css` - Design tokens
- `/src/app/components/ui/*` - UI components

---

## Code Patterns to Follow

### After (Supabase)
```typescript
import { useUnits } from '../hooks/useUnits';

function DashboardView() {
  const { units, loading, error } = useUnits();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  // ...
}
```

### Recording Payment (Before)
```typescript
const handlePaymentRecorded = (payment: PaymentRecord) => {
  setPayments(prev => [payment, ...prev]);
  // Local state only
};
```

### Recording Payment (After)
```typescript
const handlePaymentRecorded = async (payment: PaymentRecord) => {
  try {
    await recordPayment({
      unitId: unit.id,
      amount: payment.amount,
      paymentDate: payment.paymentDate,
      paymentMethod: payment.paymentMethod,
      referenceNumber: payment.referenceNumber,
      notes: payment.notes
    });
    toast.success('Payment recorded!');
  } catch (error) {
    toast.error('Failed to record payment');
  }
};
```

---

## Critical Information

### Date Handling
⚠️ **IMPORTANT:** Use the runtime date helpers in `src/app/utils/date.ts` for validation, overdue calculations, and schedule generation.

### Validation Data
The simulation seed includes overdue and at-risk units to support validation scenarios.

### Database Functions
The payment recording logic is **already implemented as a PostgreSQL function**:
```sql
record_payment(
  p_unit_id UUID,
  p_amount DECIMAL,
  p_payment_date DATE,
  p_payment_method TEXT,
  p_reference_number TEXT,
  p_notes TEXT,
  p_recorded_by UUID
)
```

You just need to call it from the frontend:
```typescript
const { data, error } = await supabase.rpc('record_payment', {
  p_unit_id: unitId,
  p_amount: amount,
  // ...
});
```

---

## User Expectations

The user expects you to:
1. ✅ Understand the full project context (read all docs)
2. ✅ Follow existing patterns (don't reinvent)
3. ✅ Ask clarifying questions when unsure
4. ✅ Test thoroughly (especially payments workflow)
5. ✅ Maintain design consistency
6. ✅ Prioritize working features over perfection

The user does NOT want you to:
1. ❌ Rewrite working components unnecessarily
2. ❌ Change design system without reason
3. ❌ Add features that delay validation
4. ❌ Skip testing or security (RLS)
5. ❌ Use real-world dates (always Jan 15, 2026)

---

## Testing Strategy

### Must Test Before Calling It Done

1. **Payment Workflow:**
   - Navigate to Collections
   - Click Irene Villanueva unit
   - Record ₱35,000 payment
   - Verify payment schedule updates immediately
   - Go to Dashboard → metrics should change

2. **Real-time Updates:**
   - Open Dashboard in one tab
   - Record payment in another tab
   - Dashboard should update automatically

3. **Multi-tenant Isolation:**
   - Create 2 organizations
   - Add units to each
   - Verify users can't see other org's data

4. **Validation Walkthrough:**
   - Run full 8-step tour
   - Verify all steps work
   - Payment should actually record

---

## Common Issues & Solutions

### Issue: "Payments don't update dashboard"
**Solution:** Add real-time subscription to Dashboard:
```typescript
useEffect(() => {
  const subscription = supabase
    .channel('payments_changes')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'payments' },
      () => refetchUnits()
    )
    .subscribe();
  
  return () => subscription.unsubscribe();
}, []);
```

### Issue: "Can't see any data after Supabase setup"
**Solution:** Check RLS policies are set correctly:
```sql
-- Verify policies exist
SELECT * FROM pg_policies WHERE tablename = 'units';
```

### Issue: "Date validation errors"
**Solution:** Use `getCurrentDateIso()` from `src/app/utils/date.ts` for consistent runtime date handling.

### Issue: "Tour not working with Supabase"
**Solution:** Update tour to use actual unit IDs from database, not hardcoded IDs

---

## Success Checklist

### Phase 1: Database Setup ✓
- [ ] Supabase project created
- [ ] Schema deployed
- [ ] RLS policies enabled
- [ ] Database seeded with simulation dataset

### Phase 2: Frontend Integration ✓
- [ ] Supabase client configured
- [ ] useUnits() hook created
- [ ] Dashboard uses real data
- [ ] Collections uses real data

### Phase 3: Payment Recording ✓
- [ ] RecordPaymentModal calls Supabase function
- [ ] Payment schedule updates immediately
- [ ] Dashboard metrics recalculate
- [ ] Payment history displays

### Phase 4: Real-time ✓
- [ ] Dashboard subscribes to changes
- [ ] Multiple tabs stay in sync
- [ ] Latency < 500ms

### Phase 5: Authentication ✓
- [ ] Login/signup flows
- [ ] Session persistence
- [ ] Role-based access
- [ ] Protected routes

---

## When User Says...

### "Set up Supabase"
→ Follow Hour 1 steps above
→ Use schema from TECHNICAL_SPECIFICATION.md
→ Don't forget RLS policies!

### "Make payments persist"
→ Replace handlePaymentRecorded with Supabase RPC call
→ See TECHNICAL_SPECIFICATION.md → "Record Payment and Update Schedule"

### "Add authentication"
→ Use Supabase Auth
→ Create login/signup components
→ Wrap app in SessionContextProvider

### "Test the end-to-end workflow"
→ Make sure Irene Villanueva unit exists in database
→ Verify tour targets still work with real data
→ Payment should actually record to database

---

## Quick Reference

**Supabase Docs:** https://supabase.com/docs  
**RLS Guide:** https://supabase.com/docs/guides/auth/row-level-security  
**Real-time:** https://supabase.com/docs/guides/realtime  

**Colors:**
- Primary: #EF4444 (red)
- Success: #10B981 (green)
- Critical: #DC2626
- Overdue: #EA580C
- At Risk: #D97706

**Typography:**
- Font: Inter
- Display: 28px/600
- Heading: 20px/600
- Body: 14px/400

**Current Date:** Use live dates via `src/app/utils/date.ts`.

---

## Your First Message Should Be

**Option 1 (If user already has Supabase):**
"I've reviewed all the documentation and understand the Nexsys project. I see you want to integrate Supabase for data persistence. Do you already have a Supabase project set up, or should we create one together?"

**Option 2 (If starting fresh):**
"I've reviewed all the documentation and understand the Nexsys project. I'm ready to integrate Supabase. Let's start by creating a new Supabase project. Please go to supabase.com, create a new project, and share your Project URL and anon key once it's ready."

---

## Final Reminders

1. **Read all 5 documentation files** before writing any code
2. **Maintain existing patterns** - don't reinvent the wheel
3. **Test payment workflow thoroughly** - this is the core feature
4. **Keep design consistent** - follow DESIGN_SYSTEM_GUIDE.md
5. **Ask questions** if anything is unclear
6. **Prioritize working features** over perfection

---

**You've got this! The project is well-documented and the foundation is solid. Just add Supabase and you're done.** 🚀

---

**Last Updated:** December 30, 2025  
**Status:** Ready for Codex development  
**Estimated Time:** 2-3 days to production-ready
