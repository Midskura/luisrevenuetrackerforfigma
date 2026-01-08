# NEXSYS - Quick Reference Card

**Print this or keep it handy for instant lookup!**

---

## 🎯 Project Essentials

| Item | Value |
|------|-------|
| **Project Name** | Nexsys Revenue Lifecycle Management |
| **Target Market** | Philippine real estate SMBs (50-500 units) |
| **Business Model** | SaaS ₱20k-30k/year OR Custom ₱150k |
| **Tech Stack** | React + TypeScript + Tailwind + Supabase |
| **Simulation Date** | January 15, 2026 ⚠️ USE THIS, NOT REAL DATE |
| **Status** | 13 components done, ready for database |
| **Timeline** | 2-3 days for Supabase integration |

---

## 🎨 Design System

| Element | Value |
|---------|-------|
| **Primary Color** | #EF4444 (Red/Coral) |
| **Success Color** | #10B981 (Green) |
| **Critical** | #DC2626 (Red) |
| **Overdue** | #EA580C (Orange) |
| **At Risk** | #D97706 (Amber) |
| **Font** | Inter |
| **Spacing** | 8px grid (4, 8, 12, 16, 24, 32, 48, 64) |
| **Border Radius** | 6px (small), 8px (medium), 12px (large) |
| **Shadow** | 0 2px 8px rgba(0,0,0,0.08) |

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `/src/app/App.tsx` | Main app entry |
| `/src/app/types/` | Shared domain types |
| `/src/app/components/UnitDetailView.tsx` | Core unit UI |
| `/src/app/components/payments/RecordPaymentModal.tsx` | Payment logic |
| `/src/styles/theme.css` | CSS design tokens |

---

## 📚 Documentation Files

| File | Read When |
|------|-----------|
| **START_HERE.md** | First! Onboarding for new AI |
| **MIGRATION_CHECKLIST.md** | Need quick reference |
| **NEXSYS_PROJECT_OVERVIEW.md** | Need business context |
| **TECHNICAL_SPECIFICATION.md** | Implementing database |
| **COMPONENT_DOCUMENTATION.md** | Modifying components |
| **DESIGN_SYSTEM_GUIDE.md** | Creating/styling UI |
| **BUG_TRACKING.md** | Testing or debugging |
| **CODEX_PROMPT_TEMPLATE.md** | Starting in Codex |
| **README.md** | Navigation index |

---

## 🗃️ Database Tables (10 tables)

1. **organizations** - Multi-tenant root
2. **users** - User accounts
3. **projects** - Subdivisions/developments
4. **customers** - Buyers/clients
5. **units** - Property units
6. **payment_schedules** - Monthly schedules
7. **payments** - Payment records
8. **communications** - Activity log
9. **documents** - File attachments
10. **activity_logs** - Audit trail

---

## 🔧 Components (13 total)

| Component | Purpose |
|-----------|---------|
| **Sidebar** | Navigation |
| **DashboardView** | Portfolio metrics |
| **CollectionsView** | At-risk units list |
| **UnitDetailView** | Unit details + payments |
| **CollectionCard** | Unit card in list |
| **StatCard** | Metric display |
| **RecordPaymentModal** | Payment entry form |
| **PaymentSchedule** | Monthly schedule table |
| **PaymentHistory** | Payment records list |
| **PaymentDetailModal** | Payment detail viewer |
| **ui/*** | Reusable UI (button, card, badge, etc.) |

---

## 🔎 Validation Spotlight Unit

Use any seeded overdue unit to validate payment flow, arrears updates, and activity logs.

---

## 🐛 Bug Status

| Status | Count |
|--------|-------|
| **Fixed** | 17 bugs |
| **Known Issues** | 5 (4 need Supabase, 1 minor) |
| **Critical** | 0 |
| **Blockers** | 0 |

---

## ✅ Current Status Checklist

- [x] 13 components built
- [x] Design system complete
- [x] Simulation seed data available
- [x] Payment workflow functional
- [x] All 17 bugs fixed
- [ ] Database persistence (needs Supabase)
- [ ] Authentication (needs Supabase)
- [ ] Multi-tenant isolation (needs RLS)
- [ ] Real-time updates (needs Supabase)

---

## 🚀 Next Steps (In Order)

1. ✅ Read documentation (90 min)
2. 🔲 Create Supabase project
3. 🔲 Deploy database schema
4. 🔲 Seed database with simulation data
5. 🔲 Create Supabase client
6. 🔲 Migrate Dashboard component
7. 🔲 Migrate Collections component
8. 🔲 Migrate UnitDetailView + payments
9. 🔲 Add real-time subscriptions
10. 🔲 Implement authentication
11. 🔲 Test multi-tenant isolation
12. 🔲 Run end-to-end workflow test
13. 🔲 Fix any bugs found
14. 🔲 Ready for pre-sales! 🎉

---

## 💻 Commands

```bash
# Development
npm install
npm run dev
npm run build

# After Supabase setup
npm run seed        # Seed simulation dataset
npm run test        # Run tests
```

---

## 🔗 Important Imports

```typescript
// Current date helpers
import { getCurrentDateIso } from './utils/date';

// Supabase client (after setup)
import { supabase } from '../lib/supabase';

// Icons
import { DollarSign } from 'lucide-react';

// Date formatting
import { format, parseISO } from 'date-fns';
```

---

## 📊 Metrics Calculations

```typescript
// Total Receivables
totalReceivables = sum(unit.paymentTerms.balance)

// Collection Rate
collectionRate = (totalPaid / totalExpected) * 100

// Overdue Amount
overdueAmount = sum(unit.paymentTerms.arrears where daysOverdue > 0)

// Critical Accounts
criticalAccounts = count(units where daysOverdue > 60)
```

---

## 🎯 Success Criteria

### Current Milestone ✅
- Core components built
- Core workflows working
- Design consistent

### Production Success (Goal)
- Database persistence
- Authentication working
- Real-time updates
- Multi-tenant ready
- Customer-ready for pre-sales

### Business Success (Q1 2026)
- 5+ paying deposits (₱5k-10k each)
- Customer feedback incorporated
- Pricing validated
- Go/no-go decision made

---

## ⚠️ Critical Reminders

1. **Use `src/app/utils/date.ts` helpers for date logic**
2. **Maintain design system (colors, spacing, typography)**
3. **Test payment recording end-to-end**
4. **Verify RLS policies for multi-tenant**
5. **Use simulation seed data for end-to-end testing**
6. **Don't skip documentation - read it all!**

---

## 🆘 Quick Help

| Need | File |
|------|------|
| Business context? | NEXSYS_PROJECT_OVERVIEW.md |
| Database schema? | TECHNICAL_SPECIFICATION.md |
| Component details? | COMPONENT_DOCUMENTATION.md |
| Design rules? | DESIGN_SYSTEM_GUIDE.md |
| Bug status? | BUG_TRACKING.md |
| Quick reference? | MIGRATION_CHECKLIST.md |
| Getting started? | START_HERE.md |
| Codex prompts? | CODEX_PROMPT_TEMPLATE.md |

---

## 📞 Emergency Contacts

**Current Date (Simulation):** January 15, 2026  
**Featured Unit:** Irene Villanueva (B4-L08)  
**Primary Color:** #EF4444  
**Font:** Inter  
**Spacing:** 8px grid  

---

## 🎉 You're Ready!

**Everything you need is documented.**  
**Start with START_HERE.md.**  
**Use CODEX_PROMPT_TEMPLATE.md for Codex.**  
**Reference this card anytime.**  

**Good luck! 🚀**

---

**Last Updated:** December 30, 2025  
**Version:** 1.0  
**Status:** Complete and ready
