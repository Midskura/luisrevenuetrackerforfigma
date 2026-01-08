# CODEX AI - First Prompt Template

Copy and paste this into Codex when starting:

---

## The Prompt

```
I'm continuing development of the Nexsys Revenue Lifecycle Management Platform. This project is now in production build with Supabase backend.

📋 FIRST: Please read these documentation files in order:
1. START_HERE.md - Your onboarding guide
2. MIGRATION_CHECKLIST.md - Quick reference
3. NEXSYS_PROJECT_OVERVIEW.md - Business context
4. TECHNICAL_SPECIFICATION.md - Database schema & architecture
5. COMPONENT_DOCUMENTATION.md - All 13 components
6. DESIGN_SYSTEM_GUIDE.md - Design patterns
7. BUG_TRACKING.md - Known issues & fixes

After reading, confirm you understand:
- The business model (SaaS targeting Philippine real estate SMBs)
- Current status (13 components built, ready for Supabase)
- Timeline (2-3 days for backend integration)
- Seeded data is used for validation

🎯 MY IMMEDIATE GOAL:
Validate end-to-end workflows and ensure payments persist across sessions with accurate metrics.

❓ MY QUESTION FOR YOU:
Based on the documentation, what's the best approach to integrate Supabase? Should we:
A) Migrate all components to Supabase at once?
B) Migrate one component at a time (starting with Dashboard)?
C) Set up authentication first, then migrate data?
D) Something else?

Please recommend a plan with estimated time for each step.
```

---

## What to Expect

The Codex AI should respond with something like:

> "I've reviewed all 7 documentation files. I understand this is a Revenue Lifecycle Management Platform targeting Philippine real estate SMBs with 13 working components and Supabase integration ready for workflow validation.
>
> I recommend **Option B: Incremental Migration** starting with Dashboard, because:
> 1. Less risky (can rollback if issues)
> 2. Tests Supabase integration with simplest component
> 3. Provides immediate value (dashboard metrics)
> 
> Proposed Plan:
> - **Hour 1:** Supabase setup + schema deployment
> - **Hour 2:** Database seeding with simulation dataset
> - **Hour 3:** Create useUnits() hook + migrate Dashboard
> - **Hour 4:** Migrate Collections view
> - **Hour 5:** Migrate UnitDetailView + payment recording
> - **Hour 6:** Add real-time subscriptions
> - **Hour 7-8:** Authentication flows
> 
> Does this plan work for you? Should we start with Supabase setup?"

---

## If AI Doesn't Read Docs

If the AI skips documentation and jumps straight to code:

```
STOP - Please read the 7 documentation files first:
1. START_HERE.md
2. MIGRATION_CHECKLIST.md
3. NEXSYS_PROJECT_OVERVIEW.md
4. TECHNICAL_SPECIFICATION.md
5. COMPONENT_DOCUMENTATION.md
6. DESIGN_SYSTEM_GUIDE.md
7. BUG_TRACKING.md

I need you to understand the full project context before we proceed. This is critical because:
- The business strategy affects technical decisions
- The design system must be maintained
- Seeded data should be used for validation
- 13 components are already built and working
- We're NOT starting from scratch

After reading, please confirm what you understand about:
1. The target market
2. Current implementation status
3. Why we need Supabase (not just "add database")
4. Workflow validation requirements
5. Multi-tenant architecture needs
```

---

## If You Need to Share Code

If the AI asks to see specific code:

```
The full codebase is in this repository. Key files:
- /src/app/App.tsx - Main application
- /src/app/types/ - Shared domain types
- /src/app/components/UnitDetailView.tsx - Core UI
- /src/app/components/payments/RecordPaymentModal.tsx - Payment logic
- /src/styles/theme.css - Design system

But FIRST, please read the documentation (especially COMPONENT_DOCUMENTATION.md) which explains all components in detail. The docs are more comprehensive than reading raw code.
```

---

## Supabase Setup Prompt

After initial discussion, when ready to create Supabase:

```
I've created a new Supabase project. Here are my credentials:

Project URL: [paste your URL]
Anon Key: [paste your key]

Now please:
1. Create the database schema from TECHNICAL_SPECIFICATION.md
2. Enable Row-Level Security policies
3. Set up the Supabase client in /src/lib/supabase.ts
4. Create environment variables (.env.local)
5. Create a seed script to generate a full simulation dataset in Supabase

After that, we'll start migrating components one by one.
```

---

## Testing Prompt

After migration is complete:

```
Before we call this done, let's test the critical workflow:

1. Navigate to Collections view
2. Find Irene Villanueva (Unit B4-L08) - she should be 45 days overdue with ₱35,000 arrears
3. Click to view unit details
4. Click "Log Payment" button
5. Enter a payment with a reference number
6. Submit payment

VERIFY:
- Payment schedule immediately shows updated status
- Arrears decreased to ₱0
- MonthsPaid count increased
- Dashboard metrics changed (if we navigate back)
- MOST IMPORTANT: Refresh the page → changes should persist

If all of this works, run a full end-to-end workflow and verify the payment records to the database.

Let me know the test results!
```

---

## Authentication Prompt

After data migration works:

```
Now let's add authentication. Requirements:

1. Email/password auth using Supabase Auth
2. Simple login/signup forms (follow existing design system)
3. Session persistence (stay logged in on refresh)
4. Protected routes (redirect to login if not authenticated)
5. User role stored in users table (admin, manager, viewer)

Don't overcomplicate - we just need basic auth working. We'll add role-based permissions later.

Create the login UI following the design system in DESIGN_SYSTEM_GUIDE.md (red #EF4444 primary color, Inter font, etc.)
```

---

## Multi-Tenant Setup Prompt

After authentication works:

```
Now for multi-tenant setup:

1. Each organization should have isolated data (RLS policies)
2. When user signs up, create a new organization
3. When user logs in, load their organization's data only
4. Test with 2 different accounts → they shouldn't see each other's units

Verify the RLS policies from TECHNICAL_SPECIFICATION.md are working correctly.

Test plan:
- Create Account A → Add some units
- Create Account B → Add different units
- Login as A → Should only see A's units
- Login as B → Should only see B's units
```

---

## Final Validation Prompt

When everything is working:

```
Perfect! Now let's do a final end-to-end test:

1. Create a fresh account (simulate new customer)
2. Seed their database with simulation data
3. Run the end-to-end workflow (onboarding → payment)
4. Record a payment with a reference number
5. Verify it persists after refresh
6. Log out and log back in → data should still be there

If all of this works, we're ready for pre-sales! 🎉

Let me know the results and any issues you find.
```

---

## Troubleshooting Prompts

### If payment doesn't persist:
```
Payment recorded but didn't persist after refresh. Let's debug:

1. Check if Supabase RPC call succeeded (any errors?)
2. Verify the record_payment() function exists in Supabase
3. Check if RLS policies allow the insert
4. Look at Supabase Table Editor → is the payment in the table?
5. Check if useUnits() hook is refetching after payment

Share the error messages and we'll fix it.
```

### If RLS blocks everything:
```
RLS policies seem too restrictive - I can't see any data. Let's check:

1. Is auth.user_organization_id() function created?
2. Are the SELECT policies using the correct organization_id check?
3. Is the user's organization_id field populated in the users table?
4. Try disabling RLS temporarily to verify data exists

Share the RLS policy definitions and I'll help debug.
```

### If real-time doesn't work:
```
Real-time updates not propagating. Let's debug:

1. Is the subscription channel name correct?
2. Are we listening to the right table?
3. Is Real-time enabled in Supabase project settings?
4. Check browser console for WebSocket errors
5. Try a simple test: open 2 tabs, change data in one, verify other updates

Share any error messages from console.
```

---

## What Success Looks Like

You'll know everything is working when:

✅ Login works and persists across sessions  
✅ Dashboard loads data from Supabase  
✅ Collections filters at-risk units correctly  
✅ Unit details display with payment schedule  
✅ Recording payment updates schedule immediately  
✅ Dashboard metrics change after payment  
✅ Page refresh preserves all data  
✅ Demo tour runs end-to-end with real persistence  
✅ Two different users can't see each other's data  
✅ Real-time updates work across browser tabs  

---

## Estimated Timeline

**Day 1 (6-8 hours):**
- Morning: Supabase setup + schema + seeding
- Afternoon: Migrate Dashboard + Collections + UnitDetail
- Evening: Test payment recording persistence

**Day 2 (6-8 hours):**
- Morning: Add real-time subscriptions
- Afternoon: Implement authentication
- Evening: Test multi-tenant isolation

**Day 3 (4-6 hours):**
- Morning: Polish + bug fixes
- Afternoon: Full end-to-end testing + Demo tour
- Evening: Documentation updates

**Total:** 16-22 hours of dev time over 2-3 days

---

## Post-Migration Checklist

After Codex completes everything:

- [ ] All data persists across page refreshes
- [ ] Demo tour works end-to-end with real database
- [ ] Authentication flows work (login/signup/logout)
- [ ] Multi-tenant isolation tested (2+ accounts)
- [ ] Real-time updates work across tabs
- [ ] Payment recording updates all related data
- [ ] Dashboard metrics calculate correctly
- [ ] Collections filters work
- [ ] Design system maintained (colors, typography, spacing)
- [ ] No console errors
- [ ] Performance acceptable (<2s page load, <500ms queries)

---

**Copy the appropriate prompt above and paste into Codex to begin!** 🚀

---

**Last Updated:** December 30, 2025  
**Status:** Ready for Codex migration
