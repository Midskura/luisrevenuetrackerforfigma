# NEXSYS - Revenue Lifecycle Management Platform

## Project Summary
**Nexsys** is a Revenue Lifecycle Management Platform that started as a custom micro-ERP prototype for EL Construction and has pivoted into a template-based system targeting Philippine SMBs with unit-based revenue cycles. Real estate remains the first template, with reusable setups for adjacent industries.

**Current Status:** Completed 13 components (Days 1-5) in Figma Make prototype. Ready for full production development with database integration.

**Next Step:** Building a functional MVP with Supabase backend and a template-driven setup that keeps the core revenue engine consistent.

---

## Business Model

### Target Market
- **Primary:** Philippine real estate SMBs (small-to-medium businesses)
- **Unit Range:** 50-500 units on long-term payment cycles
- **Pain Point:** Post-sale payment tracking, collections management, and customer portals

### Pricing Strategy
1. **SaaS Subscription:** ₱20,000-30,000/year
2. **Custom Build:** ₱150,000 one-time fee

### Go-to-Market Strategy (Lean Startup)
- **Week 1-4:** Build clickable prototype (UI only, no database initially)
- **Week 5-8:** Pre-sales validation with 5+ paying deposits
- **Week 9-24:** Full development (16 weeks) only if validation succeeds
- **Current Timeline:** End of Week 5 - transitioning to full build with database

### Development Philosophy
- Core engine stays consistent: unit-based revenue tracking + schedule risk
- Templates provide customization without coding
- Bug-catching routines after every 5 milestones (not immediate fixes)
- Rapid iteration based on customer feedback

---

## Core Platform Features

### 1. Dashboard
- Real-time portfolio metrics
- Collection rate tracking
- Overdue accounts monitoring
- Revenue analytics

### 2. Unit Management
- Block/Lot tracking
- Customer assignment
- Payment status monitoring
- Property management dues (electricity, water, garbage, maintenance)

### 3. Collections Management
- Risk-based prioritization (Critical, Overdue, At Risk)
- Days overdue tracking
- Bulk collection actions
- Payment scheduling

### 4. Payment Processing
- Payment recording (Cash, GCash, Bank Transfer, Check)
- Receipt generation
- Payment history tracking
- Schedule management (monthly payment plans)

### 5. Customer Portal (Planned)
- Self-service payment viewing
- Statement downloads
- Communication with management

### 6. Reports & Analytics
- Revenue reports
- Collection performance
- Aging reports
- Export capabilities

---

## Technical Stack

### Frontend
- **Framework:** React 18+ with TypeScript
- **Styling:** Tailwind CSS v4.0
- **UI Components:** Custom component library (shadcn/ui style)
- **Icons:** lucide-react
- **Charts:** recharts (when needed)

### Backend (To Be Implemented)
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Real-time:** Supabase Real-time subscriptions
- **Storage:** Supabase Storage (for receipts, documents)

### Current Architecture
- **Entry Point:** `/src/app/App.tsx`
- **Components:** `/src/app/components/`
- **Types:** `/src/app/types/` (shared domain models)
- **Styles:** `/src/styles/` (fonts.css, theme.css)

---

## Design System

### Brand Identity
- **Style:** Bringova-inspired (soft shadows, clean layouts)
- **Primary Brand:** Red/Coral (#EF4444)
- **Success Green:** #10B981
- **Typography:** Inter font family
- **Spacing:** 8px base unit

### Status Colors
- **Critical:** Red (#DC2626, bg: #FEE2E2)
- **Overdue:** Orange (#EA580C, bg: #FED7AA)
- **At Risk:** Amber (#D97706, bg: #FEF3C7)
- **In Payment Cycle:** Green (#10B981)
- **Fully Paid:** Success green (#10B981, bg: #E8F2EE)

### Component Patterns
- Soft shadows with subtle blur
- 8-12px border radius
- Hover states with smooth transitions (120-200ms)
- Cards with white backgrounds
- Consistent 32-48px padding on views

---

## Key User Flows

### Collections Workflow
1. Navigate to Collections view
2. See all at-risk accounts sorted by priority
3. Click a unit card to view details
4. Review payment schedule and history
5. Click "Log Payment" button
6. Enter payment details (amount, method, reference)
7. Record payment → Updates schedule, dashboard metrics, and status

### Unit Detail Workflow
1. Select unit from dashboard or collections
2. View unit overview (customer, property, payment status)
3. See payment schedule with status indicators
4. View payment history
5. Record new payments
6. Send reminders or view communications

### Validation Walkthrough
1. Sign in and open Collections
2. Select an overdue unit from the seeded dataset
3. Review payment schedule and history
4. Record a payment with a reference number
5. Confirm status, arrears, and dashboard metrics update

---

## Data Model

### Date Handling
Date logic uses real-time dates via the helper in `src/app/utils/date.ts` (no mock clock).

### Units (Template Concept)
```typescript
{
  id: string;
  blockLot: string; // e.g., "B4-L08"
  status: 'Critical' | 'Overdue' | 'At Risk' | 'In Payment Cycle' | 'Fully Paid' | 'Available' | 'Reserved';
  daysOverdue: number;
  customer: {
    name: string;
    email: string;
    phone: string;
    buyerType: 'Individual' | 'Corporate';
  };
  property: {
    type: 'Residential' | 'Commercial';
    area: number; // sqm
    floor?: number;
    bedrooms?: number;
    bathrooms?: number;
  };
  paymentTerms: {
    totalAmount: number;
    downpayment: number;
    balance: number;
    monthlyAmount: number;
    totalMonths: number;
    monthsPaid: number;
    startDate: string;
    arrears: number;
    schedule: PaymentScheduleItem[];
  };
  propertyManagement: {
    electricityDue: number;
    waterDue: number;
    garbageDue: number;
    maintenanceDue: number;
  };
}
```

**Template Note:** "Unit" is the core revenue item. Templates can rename and extend fields
without changing the underlying revenue lifecycle tracking.

### Payment Schedule Item
```typescript
{
  month: string; // "January 2026"
  dueDate: string; // ISO date
  amount: number;
  status: 'Paid' | 'Unpaid' | 'Partial' | 'Overdue';
  paidDate?: string;
  partialAmount?: number;
}
```

### Payment Record
```typescript
{
  id: string;
  unitId: string;
  amount: number;
  paymentDate: string; // ISO date
  paymentMethod: 'Cash' | 'GCash' | 'Bank Transfer' | 'Check';
  referenceNumber: string;
  notes?: string;
}
```

---

## Current Implementation Status

### ✅ Completed (Days 1-5, 13 Components)

#### Navigation
- **Sidebar.tsx** - Main navigation with role switcher, project selector
- Sections: Dashboard, Collections, Reports, Settings, Documents, Activity, Communications, Bulk Operations

#### Dashboard
- **DashboardView.tsx** - Overview with metrics cards
- **StatCard.tsx** - Reusable metric display
- Real-time portfolio statistics
- Critical accounts alerts

#### Collections
- **CollectionsView.tsx** - At-risk units list
- **CollectionCard.tsx** - Unit summary cards with status badges
- Risk-based sorting and filtering

#### Unit Management
- **UnitDetailView.tsx** - Comprehensive unit details
- **PaymentSchedule.tsx** - Monthly payment tracking
- **PaymentHistory.tsx** - Historical payment records
- **RecordPaymentModal.tsx** - Payment entry form
- **PaymentDetailModal.tsx** - Payment detail viewer

#### UI Components
- **ui/button.tsx** - Button component
- **ui/card.tsx** - Card container
- **ui/badge.tsx** - Status badges
- **ui/dialog.tsx** - Modal dialogs
- **ui/progress.tsx** - Progress bars
- **ui/separator.tsx** - Dividers

#### Features
- **Guided workflows** - Collections to payment recording flow

### 🔧 Recent Bug Fixes (All Resolved)
1. ✅ Date validation using runtime date helpers
2. ✅ Payment recording now updates unit payment schedule
3. ✅ Dashboard metrics reflect payment changes
4. ✅ Activity logging and status updates after payments

### 🚧 Known Issues
- Some settings still use defaults until organization data is populated

---

## Next Development Phase

### Immediate Priorities (Codex Migration)

#### 1. Supabase Integration
- Set up new Supabase project
- Create database schema (units, customers, payments, schedules)
- Implement Row Level Security (RLS) policies
- Set up authentication system

#### 2. Database Schema Migration
- Convert domain models to PostgreSQL tables
- Seed database with the simulation dataset
- Implement real-time subscriptions

#### 3. Backend API Layer
- Replace remaining local state fallbacks with Supabase queries
- Implement CRUD operations for units, payments, customers
- Add payment schedule calculations
- Build reports aggregation queries

#### 4. Authentication & Multi-tenancy
- Implement login/signup flows
- Add organization/project management
- Set up role-based access control (Admin, Manager, Viewer)
- Implement RLS for data isolation

#### 5. Production Features
- File uploads for receipts/documents
- Email notifications for overdue payments
- Bulk operations (mass emails, status updates)
- Advanced reporting and exports

### Phase 2 Features (Post-Launch)
- Customer portal (self-service)
- Mobile responsiveness optimization
- WhatsApp/SMS integration
- Payment gateway integration (PayMongo, GCash API)
- Advanced analytics dashboard

---

## Migration Notes for Codex AI

### Code Export
All React components are production-ready and can be directly migrated:
- No framework-specific dependencies
- Standard React patterns
- TypeScript types defined
- Tailwind classes compatible

### Environment Setup
```bash
# Install dependencies
npm install

# Key packages already installed:
- react, react-dom
- lucide-react (icons)
- date-fns (date utilities)

# Need to add:
- @supabase/supabase-js
- @supabase/auth-helpers-react
```

### Supabase Configuration
Create `.env.local`:
```
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### File Structure to Maintain
```
/src
  /app
    /components
      /collections
      /payments
      /ui
    /data (replace with /lib/supabase)
    /hooks (add custom hooks)
  /styles
```

---

## Important Context

### Date Logic
All logic uses the current date at runtime for validation, overdue calculations, and schedule generation.

### Narrative Dataset
The simulation seed script creates a coherent story with mixed payment behaviors (on-time, at-risk, overdue, fully paid), realistic arrears, and project milestones.

### Bug-Catching Philosophy
- Don't fix minor issues immediately
- Batch fixes after every 5 milestones
- Critical bugs (data corruption, crashes) fixed immediately
- UI polish issues deferred

### Pre-Sales Strategy
- Target: 5+ paying deposits before full buildout
- Deposit: ₱5,000-10,000 commitment
- Timeline: 4 weeks of outreach starting early January 2026
- Product walkthrough must be credible and data-backed

---

## Contact & Business Context

### Original Use Case
- **Client:** EL Construction (Philippines)
- **Need:** Custom micro-ERP for real estate payment tracking
- **Pivot:** Saw opportunity to template-ize for broader market

### Market Insights
- Philippine real estate SMBs are underserved
- Most use Excel or generic accounting software
- Need: Purpose-built collections and payment tracking
- Price sensitivity: ₱20k-30k annual subscription is sweet spot

### Competitive Landscape
- Few specialized solutions for PH market
- Most ERPs are too complex/expensive for SMBs
- Opportunity: Simple, focused, affordable solution

---

## Developer Handoff Checklist

### Before Starting in Codex
- [ ] Review all 13 completed components
- [ ] Understand data model and relationships
- [ ] Study payment calculation logic
- [ ] Review design system (colors, spacing, patterns)
- [ ] Understand business context and pricing

### First Steps in Codex
- [ ] Set up new Supabase project
- [ ] Create database schema
- [ ] Implement authentication
- [ ] Migrate one component (e.g., Dashboard) to Supabase
- [ ] Test data persistence and real-time updates
- [ ] Migrate remaining components systematically

### Testing Priorities
- [ ] Payment recording updates all related data
- [ ] Dashboard metrics calculate correctly
- [ ] Collections view filters and sorts properly
- [ ] Guided onboarding flows work end-to-end
- [ ] Multi-tenant data isolation (RLS)

---

## Success Criteria

### Current Milestone
✅ Core components built
✅ Core workflows implemented
✅ Design system consistent

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

**Last Updated:** December 30, 2025
**Status:** Ready for production hardening and rollout preparation
**Next AI Prompt:** "I'm continuing the Nexsys project. Review NEXSYS_PROJECT_OVERVIEW.md and TECHNICAL_SPECIFICATION.md to understand context."
