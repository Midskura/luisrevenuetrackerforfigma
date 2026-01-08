# NEXSYS - Quick Start Guide for AI Assistant

## First Steps

**You are continuing the Nexsys project.** This is a Revenue Lifecycle Management Platform for Philippine real estate SMBs. All foundation work is complete - 13 components built, design system established, and ready for Supabase backend integration.

---

## Quick Context

### What is Nexsys?
- **Revenue Lifecycle Management Platform** for real estate SMBs managing 50-500 units
- **Target Market:** Philippine construction/real estate companies with long-term payment cycles
- **Business Model:** SaaS (₱20k-30k/year) or Custom Build (₱150k one-time)
- **Current Status:** Production build in progress → Codex implementation with Supabase

### Current State
✅ **Completed:**
- 13 React components (TypeScript + Tailwind)
- Full payment workflow (Collections → Unit Detail → Payment Recording → Dashboard)
- Guided onboarding flows in place
- Design system (Bringova-inspired, red/coral accents)
- Simulation seed script for realistic datasets

🚧 **Next Phase:**
- Supabase backend integration (PostgreSQL + Auth + Real-time)
- Database schema implementation
- Authentication system
- Multi-tenant architecture (RLS policies)

---

## Essential Files to Review

### 📋 Documentation (START HERE)
1. **`/NEXSYS_PROJECT_OVERVIEW.md`** - Business context, strategy, timeline
2. **`/TECHNICAL_SPECIFICATION.md`** - Database schema, Supabase setup, API layer
3. **`/COMPONENT_DOCUMENTATION.md`** - All 13 components explained
4. **`/DESIGN_SYSTEM_GUIDE.md`** - Colors, typography, patterns

### 💻 Key Code Files
1. **`/src/app/App.tsx`** - Main application entry point
2. **`/src/app/types/`** - Shared domain types
3. **`/src/app/components/UnitDetailView.tsx`** - Core unit management UI
4. **`/src/app/components/payments/RecordPaymentModal.tsx`** - Payment recording logic
5. **`/src/styles/theme.css`** - Design tokens and CSS variables

---

## Project File Structure

```
/
├── NEXSYS_PROJECT_OVERVIEW.md       ← Business & strategy
├── TECHNICAL_SPECIFICATION.md       ← Database & backend
├── COMPONENT_DOCUMENTATION.md       ← Component guide
├── DESIGN_SYSTEM_GUIDE.md          ← Design patterns
├── MIGRATION_CHECKLIST.md          ← This file
│
├── src/
│   ├── app/
│   │   ├── App.tsx                 ← Main app (state management)
│   │   ├── components/
│   │   │   ├── Sidebar.tsx         ← Navigation
│   │   │   ├── DashboardView.tsx   ← Portfolio overview
│   │   │   ├── CollectionsView.tsx ← At-risk units list
│   │   │   ├── UnitDetailView.tsx  ← Unit details & payments
│   │   │   ├── DemoTour.tsx        ← Interactive tour
│   │   │   ├── collections/
│   │   │   │   └── CollectionCard.tsx
│   │   │   ├── payments/
│   │   │   │   ├── RecordPaymentModal.tsx
│   │   │   │   ├── PaymentSchedule.tsx
│   │   │   │   ├── PaymentHistory.tsx
│   │   │   │   └── PaymentDetailModal.tsx
│   │   │   └── ui/
│   │   │       ├── button.tsx
│   │   │       ├── card.tsx
│   │   │       ├── badge.tsx
│   │   │       └── dialog.tsx
│   │   └── types/
│   │       └── unit.ts             ← Shared domain types
│   └── styles/
│       ├── theme.css               ← Design tokens
│       └── fonts.css               ← Font imports
│
└── package.json
```

---

## Quick Reference

### Current Date
Use runtime date helpers in `src/app/utils/date.ts` for validation and schedules.

### Validation Walkthrough
Use the simulation dataset to surface overdue/at-risk units during workflow checks.

### Color Palette
- **Primary:** #EF4444 (Red/Coral)
- **Success:** #10B981 (Green)
- **Critical:** #DC2626 (Red)
- **Overdue:** #EA580C (Orange)
- **At Risk:** #D97706 (Amber)

### Key Components
1. **Sidebar** - Navigation with role/project switcher
2. **DashboardView** - Metrics + critical accounts
3. **CollectionsView** - At-risk units list
4. **UnitDetailView** - Unit details + payment schedule
5. **RecordPaymentModal** - Payment entry form
6. **CustomerDashboard** - Self-service payment portal

---

## Immediate Next Steps (In Order)

### Phase 1: Supabase Setup (Day 1 Morning)
1. Create new Supabase project at supabase.com
2. Copy database schema from TECHNICAL_SPECIFICATION.md
3. Run schema SQL in Supabase SQL Editor
4. Enable Row-Level Security (RLS) policies
5. Get Project URL and anon key

### Phase 2: Frontend Integration (Day 1 Afternoon)
1. Install dependencies:
   ```bash
   npm install @supabase/supabase-js @supabase/auth-helpers-react
   ```
2. Create `/src/lib/supabase.ts` with Supabase client
3. Add environment variables (.env.local)
4. Create custom hooks (`/src/hooks/useUnits.ts`, etc.)

### Phase 3: Replace Static Data (Day 2 Morning)
1. Migrate one component at a time (start with Dashboard)
2. Replace static data imports with Supabase queries/hooks
3. Add real-time subscriptions
4. Test data persistence

### Phase 4: Authentication (Day 2 Afternoon)
1. Implement login/signup flows
2. Add session management
3. Test RLS policies
4. Add role-based permissions

### Phase 5: Testing & Polish (Day 3)
1. Test full payment workflow end-to-end
2. Verify dashboard metrics calculate correctly
3. Test guided onboarding flows with real data
4. Fix any edge cases

---

## Common User Questions You'll Get

### "How do I add Supabase integration?"
→ See TECHNICAL_SPECIFICATION.md sections:
- "Supabase Client Setup"
- "API Layer (Frontend Hooks)"
- "Database Schema"

### "Where is the payment recording logic?"
→ `/src/app/components/payments/RecordPaymentModal.tsx`
→ Function: `handlePaymentRecorded()` in UnitDetailView.tsx

### "How do I run the project?"
```bash
npm install
npm run dev
```

### "What's the database schema?"
→ See TECHNICAL_SPECIFICATION.md - Full PostgreSQL schema with RLS policies

### "How do I test the onboarding flow?"
→ Complete Setup Organization → Create project → Add units → Record first payment

### "Where's the design system documented?"
→ DESIGN_SYSTEM_GUIDE.md - Complete color palette, typography, patterns

---

## Important Constraints & Context

### Date Handling
Use `src/app/utils/date.ts` helpers for date validation, overdue calculations, and schedule generation.

### Business Philosophy
- **Lean Startup Approach:** Build minimal, validate with pre-sales, iterate
- **Bug Batching:** Fix minor issues every 5 milestones (not immediately)
- **Critical bugs:** Data corruption, crashes → fix immediately
- **UI polish:** Defer until after validation

### Pre-Sales Strategy
- **Goal:** 5+ paying deposits (₱5k-10k each) before full buildout
- **Timeline:** 4 weeks of outreach starting early January 2026
- **Requirement:** Impressive, interactive prototype

### Multi-Tenant Architecture
- Each SMB customer = 1 organization
- Row-Level Security (RLS) isolates data
- Users belong to one organization
- Projects (subdivisions) within organizations

---

## Code Style & Patterns

### TypeScript
- Strict types enabled
- Explicit prop types for all components
- No `any` types

### Styling
- **Tailwind CSS v4.0** (no tailwind.config.js)
- **Inline styles** for dynamic values (colors, transforms)
- **No font size/weight classes** (uses theme.css defaults)

### State Management
- React hooks (useState, useEffect)
- Props for parent-child communication
- No Redux or global state (yet)

### Data Fetching Pattern
```typescript
// Supabase hook
const { units, loading, error } = useUnits();
```

---

## Testing Priorities

### Must Test
1. ✅ Payment recording updates schedule immediately
2. ✅ Dashboard metrics calculate correctly
3. ✅ Collections view filters and sorts properly
4. ✅ Multi-tenant data isolation (RLS)
5. ✅ Real-time updates work across views

### Nice to Test
- Demo tour works end-to-end
- Forms validate correctly
- Error handling (network failures)
- Empty states display properly

---

## Common Pitfalls to Avoid

### ❌ Don't
- Rewrite existing components unnecessarily
- Change design system colors without reason
- Use runtime date helpers (avoid hardcoded dates)
- Skip RLS policies (critical for multi-tenant)
- Add dependencies without checking package.json first

### ✅ Do
- Follow existing component patterns
- Maintain consistent styling
- Use `getCurrentDateIso()` for date logic
- Test RLS policies thoroughly
- Install packages only if needed

---

## Helpful Commands

### Development
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Supabase (After Setup)
```bash
supabase start       # Start local Supabase
supabase db reset    # Reset database
supabase migration new <name>  # Create migration
```

---

## When User Says...

### "Let's add Supabase"
→ Follow Phase 1-2 steps above
→ Use schema from TECHNICAL_SPECIFICATION.md

### "Fix the payment update bug"
→ Already fixed! Payment recording now updates schedule immediately
→ See: `handlePaymentRecorded()` in UnitDetailView.tsx

### "The tour isn't working"
→ Tour is 80% functional, known minor issues
→ Major bugs already fixed (scroll, highlight, modal detection)

### "Show me the design system"
→ DESIGN_SYSTEM_GUIDE.md has everything
→ Colors, typography, spacing, patterns

### "I want to change [feature]"
→ Ask: "Is this for validation or nice-to-have?"
→ Prioritize features that help close pre-sales deals

---

## Key Metrics to Track

### Technical
- [ ] Database queries < 100ms
- [ ] Page load < 2 seconds
- [ ] Bundle size < 500KB (gzipped)
- [ ] Real-time updates < 500ms latency

### Business
- [ ] 5+ paying deposits (₱5k-10k each)
- [ ] Customer feedback incorporated
- [ ] Pricing validated
- [ ] Go/no-go decision by end of Week 8

---

## Success Criteria

### Current Milestone ✅
- Core components built
- Core workflows implemented
- Design system consistent

### Production Success (Next)
- [ ] Database integrated and persistent
- [ ] Authentication working
- [ ] Real-time updates functional
- [ ] Multi-tenant ready
- [ ] Customer-ready for pre-sales

### Business Success (Q1 2026)
- [ ] 5+ paying deposits secured
- [ ] Customer feedback incorporated
- [ ] Pricing validated
- [ ] Go/no-go decision made

---

## Quick Answers

**Q: What's the tech stack?**
A: React + TypeScript + Tailwind + Supabase (PostgreSQL + Auth + Real-time)

**Q: What's the timeline?**
A: 2-3 days for full backend integration, then ready for pre-sales

**Q: What's the business model?**
A: SaaS (₱20k-30k/year) or Custom (₱150k one-time)

**Q: Who's the target market?**
A: Philippine real estate SMBs with 50-500 units on payment plans

**Q: What's the current date in the simulation?**
A: Use runtime dates via `src/app/utils/date.ts` (no fixed mock date).

**Q: Where's the payment logic?**
A: RecordPaymentModal.tsx + handlePaymentRecorded() in UnitDetailView.tsx

**Q: How do I test it?**
A: `npm run dev` then run through onboarding → project → unit → payment flows

---

## Your Role as AI Assistant

### You Should:
1. **Read all 4 documentation files first** (this file + 3 others)
2. **Understand the business context** (not just code)
3. **Follow established patterns** (don't reinvent)
4. **Ask clarifying questions** when user intent is unclear
5. **Prioritize pre-sales validation** over perfection
6. **Maintain design consistency** (use DESIGN_SYSTEM_GUIDE.md)
7. **Test thoroughly** (especially payment workflows)

### You Should Not:
1. Rewrite working code unnecessarily
2. Change design system without good reason
3. Add features that delay validation
4. Skip RLS policies (security critical)
5. Use runtime date helpers (avoid hardcoded dates)

---

## Final Checklist Before Starting

- [ ] Read NEXSYS_PROJECT_OVERVIEW.md
- [ ] Read TECHNICAL_SPECIFICATION.md
- [ ] Read COMPONENT_DOCUMENTATION.md
- [ ] Read DESIGN_SYSTEM_GUIDE.md
- [ ] Understand current date simulation (Jan 15, 2026)
- [ ] Know where payment logic lives
- [ ] Understand multi-tenant architecture
- [ ] Ready to integrate Supabase

---

## Need Help?

### For Business Questions
→ See NEXSYS_PROJECT_OVERVIEW.md

### For Technical Questions
→ See TECHNICAL_SPECIFICATION.md

### For Component Questions
→ See COMPONENT_DOCUMENTATION.md

### For Design Questions
→ See DESIGN_SYSTEM_GUIDE.md

### For Quick Reference
→ You're reading it! (This file)

---

**You're ready to continue building Nexsys!** 🚀

Start with: "I'm continuing the Nexsys project. I've reviewed the documentation. What should we work on first?"

---

**Last Updated:** December 30, 2025
**Status:** Ready for Codex migration and Supabase integration
**Next Milestone:** Database setup and authentication
