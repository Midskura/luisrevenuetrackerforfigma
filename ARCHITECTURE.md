# System Architecture Blueprint
## Revenue Lifecycle Management Platform

**Version:** 1.2  
**Last Updated:** January 15, 2026  
**Status:** Live Architecture (Supabase-backed)

---

## ⚠️ IMPORTANT: Phased Implementation

**This architecture reflects the current Supabase-backed system and the remaining production-readiness work.**

**Current Phase: Phase 3 (Production Readiness)**
- Database + RPCs live (Supabase/Postgres)
- Customer portal is org-scoped with project selection + PIN reset
- Communications dispatch pipeline live (delivery providers pending)
- Payment intents now support manual proof submission + admin approval (gateway pending)

---

## 🏗 System Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                       │
├─────────────────────────────────────────────────────────────┤
│  Web App (React + TypeScript)                               │
│  ├── Executive Dashboard                                     │
│  ├── Unit/Asset Management                                   │
│  ├── Collections & Risk                                      │
│  ├── Payment Processing                                      │
│  ├── Customer Portal                                         │
│  ├── Reports & Analytics                                     │
│  ├── Settings & Admin                                        │
│  └── Workflows & Automation                                  │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                      API/BUSINESS LAYER                      │
├─────────────────────────────────────────────────────────────┤
│  RESTful API (Node.js/Express or Supabase Edge Functions)  │
│  ├── Authentication & Authorization                          │
│  ├── Business Logic Services                                │
│  ├── Payment Processing Engine                              │
│  ├── Workflow Automation Engine                             │
│  ├── Notification Service                                   │
│  ├── Report Generation                                       │
│  └── Integration Handlers                                    │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                       DATA LAYER                             │
├─────────────────────────────────────────────────────────────┤
│  Database (Supabase/PostgreSQL)                             │
│  ├── Core Data Tables                                        │
│  ├── Transaction Logs                                        │
│  ├── Audit Trail                                            │
│  └── File Storage                                            │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                  INTEGRATION LAYER                           │
├─────────────────────────────────────────────────────────────┤
│  ├── Payment Gateways (PayMongo, GCash, PayMaya)           │
│  ├── Email Service (SendGrid, AWS SES)                      │
│  ├── SMS Gateway (Semaphore, Twilio)                        │
│  ├── Accounting Software (QuickBooks, Xero)                 │
│  └── Document Storage (AWS S3, Supabase Storage)            │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Database Schema Design

### Core Tables

#### 1. **organizations**
Primary tenant table for multi-tenancy support
```sql
- id (uuid, PK)
- name (text)
- industry_type (enum: real_estate, franchise, leasing, etc.)
- subscription_tier (enum: starter, professional, enterprise)
- settings (jsonb) -- industry-specific configurations
- logo_url (text)
- created_at (timestamp)
- updated_at (timestamp)
- is_active (boolean)
```

#### 2. **users**
User accounts with role-based access
```sql
- id (uuid, PK)
- organization_id (uuid, FK)
- email (text, unique)
- full_name (text)
- role (enum: executive, manager, encoder, customer)
- permissions (jsonb)
- avatar_url (text)
- last_login (timestamp)
- created_at (timestamp)
- is_active (boolean)
```

#### 3. **projects**
Top-level grouping for units/assets
```sql
- id (uuid, PK)
- organization_id (uuid, FK)
- name (text)
- project_type (enum: subdivision, condo, franchise_location, etc.)
- location (text)
- total_units (integer)
- status (enum: planning, active, completed)
- metadata (jsonb) -- flexible data for different industries
- created_at (timestamp)
- updated_at (timestamp)
```

#### 4. **units** (or assets - terminology flexible)
Individual trackable items
```sql
- id (uuid, PK)
- organization_id (uuid, FK)
- project_id (uuid, FK)
- unit_code (text) -- B1-L05, Unit 301, Store #5, etc.
- unit_type (text) -- Single Detached, 2BR Condo, Franchise, etc.
- selling_price (decimal)
- status (enum: available, reserved, active, overdue, critical, completed)
- customer_id (uuid, FK, nullable)
- move_in_date (date, nullable)
- metadata (jsonb) -- industry-specific fields
- created_at (timestamp)
- updated_at (timestamp)
```

#### 5. **customers**
Buyers/lessees/franchisees
```sql
- id (uuid, PK)
- organization_id (uuid, FK)
- first_name (text)
- last_name (text)
- email (text)
- phone (text)
- address (text)
- id_type (text) -- driver's license, passport, etc.
- id_number (text)
- emergency_contact (jsonb)
- customer_type (enum: individual, corporate)
- credit_rating (text, nullable)
- notes (text)
- created_at (timestamp)
- updated_at (timestamp)
```

#### 6. **payment_schedules**
Defines payment terms for each unit
```sql
- id (uuid, PK)
- organization_id (uuid, FK)
- unit_id (uuid, FK)
- customer_id (uuid, FK)
- total_amount (decimal)
- total_months (integer)
- monthly_amount (decimal)
- start_date (date)
- end_date (date)
- payment_day_of_month (integer) -- 1-31
- late_fee_percentage (decimal)
- late_fee_grace_days (integer)
- status (enum: active, paused, completed, defaulted)
- created_at (timestamp)
- updated_at (timestamp)
```

#### 7. **payment_transactions**
Actual payment records
```sql
- id (uuid, PK)
- organization_id (uuid, FK)
- unit_id (uuid, FK)
- customer_id (uuid, FK)
- payment_schedule_id (uuid, FK)
- transaction_date (date)
- due_date (date)
- amount_due (decimal)
- amount_paid (decimal)
- payment_method (enum: cash, check, bank_transfer, gcash, paymaya, credit_card)
- payment_reference (text) -- receipt #, transaction ID, etc.
- payment_type (enum: regular, late_fee, partial, advance)
- status (enum: pending, completed, failed, refunded)
- processed_by (uuid, FK to users)
- notes (text)
- receipt_url (text, nullable)
- created_at (timestamp)
- updated_at (timestamp)
```

#### 8. **recurring_charges**
Property management fees, HOA dues, etc.
```sql
- id (uuid, PK)
- organization_id (uuid, FK)
- unit_id (uuid, FK)
- charge_type (enum: electricity, water, garbage, maintenance, hoa_dues)
- amount (decimal)
- frequency (enum: monthly, quarterly, annual)
- last_charged_date (date)
- next_charge_date (date)
- is_active (boolean)
- created_at (timestamp)
- updated_at (timestamp)
```

#### 9. **documents**
Contracts, receipts, notices
```sql
- id (uuid, PK)
- organization_id (uuid, FK)
- unit_id (uuid, FK, nullable)
- customer_id (uuid, FK, nullable)
- document_type (enum: contract, receipt, notice, report)
- file_name (text)
- file_url (text)
- file_size (integer)
- mime_type (text)
- uploaded_by (uuid, FK to users)
- tags (text[])
- created_at (timestamp)
```

#### 10. **activity_logs**
Audit trail for all actions
```sql
- id (uuid, PK)
- organization_id (uuid, FK)
- user_id (uuid, FK)
- action (text) -- "payment_recorded", "status_updated", etc.
- entity_type (text) -- "unit", "payment", "customer"
- entity_id (uuid)
- old_value (jsonb, nullable)
- new_value (jsonb, nullable)
- ip_address (text)
- user_agent (text)
- created_at (timestamp)
```

#### 11. **notifications**
System notifications and alerts
```sql
- id (uuid, PK)
- organization_id (uuid, FK)
- user_id (uuid, FK)
- notification_type (enum: payment_due, payment_overdue, system_alert)
- title (text)
- message (text)
- priority (enum: low, normal, high, urgent)
- is_read (boolean)
- read_at (timestamp, nullable)
- action_url (text, nullable)
- created_at (timestamp)
```

#### 12. **automation_workflows**
Configurable automation rules
```sql
- id (uuid, PK)
- organization_id (uuid, FK)
- name (text)
- trigger_type (enum: payment_overdue, payment_received, status_change)
- trigger_conditions (jsonb) -- flexible rule engine
- actions (jsonb) -- send_email, send_sms, update_status, etc.
- is_active (boolean)
- last_run (timestamp, nullable)
- created_at (timestamp)
- updated_at (timestamp)
```

#### 13. **workflow_executions**
Log of automation runs
```sql
- id (uuid, PK)
- organization_id (uuid, FK)
- workflow_id (uuid, FK)
- entity_id (uuid) -- unit or customer that triggered it
- status (enum: success, failed, skipped)
- execution_details (jsonb)
- executed_at (timestamp)
```

#### 14. **reports_cache**
Cached report data for performance
```sql
- id (uuid, PK)
- organization_id (uuid, FK)
- report_type (text)
- filters (jsonb)
- data (jsonb)
- generated_at (timestamp)
- expires_at (timestamp)
```

---

## 🎨 Frontend Architecture

### Technology Stack
- **Framework:** React 18+ with TypeScript
- **Styling:** Tailwind CSS v4.0
- **State Management:** React Context + Hooks (upgrade to Zustand if needed)
- **Routing:** React Router v6
- **Forms:** React Hook Form
- **Data Fetching:** Supabase Client (or React Query if custom backend)
- **Charts:** Recharts
- **Date Handling:** date-fns
- **Notifications:** Custom toast system
- **Icons:** Lucide React

### Module Structure

```
/src
├── /app
│   ├── App.tsx                    # Main app component
│   ├── /components
│   │   ├── /common               # Shared components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── Dropdown.tsx
│   │   │   ├── DatePicker.tsx
│   │   │   └── SearchInput.tsx
│   │   │
│   │   ├── /dashboard            # Executive Dashboard
│   │   │   ├── ExecutiveDashboard.tsx
│   │   │   ├── MetricsCard.tsx
│   │   │   ├── RevenueChart.tsx
│   │   │   ├── CollectionRateChart.tsx
│   │   │   └── QuickStats.tsx
│   │   │
│   │   ├── /units                # Unit/Asset Management
│   │   │   ├── UnitList.tsx
│   │   │   ├── UnitDetailView.tsx
│   │   │   ├── UnitCard.tsx
│   │   │   ├── UnitFilters.tsx
│   │   │   ├── AddUnitModal.tsx
│   │   │   └── EditUnitModal.tsx
│   │   │
│   │   ├── /payments             # Payment Management
│   │   │   ├── PaymentsList.tsx
│   │   │   ├── RecordPaymentModal.tsx
│   │   │   ├── PaymentSchedule.tsx
│   │   │   ├── PaymentHistory.tsx
│   │   │   └── BulkPaymentUpload.tsx
│   │   │
│   │   ├── /collections          # Collections & Risk
│   │   │   ├── CollectionsView.tsx
│   │   │   ├── OverdueTable.tsx
│   │   │   ├── RiskMatrix.tsx
│   │   │   └── CollectionActions.tsx
│   │   │
│   │   ├── /customers            # Customer Management
│   │   │   ├── CustomerList.tsx
│   │   │   ├── CustomerDetail.tsx
│   │   │   ├── AddCustomerModal.tsx
│   │   │   └── CustomerNotes.tsx
│   │   │
│   │   ├── /portal               # Customer Portal
│   │   │   ├── CustomerDashboard.tsx
│   │   │   ├── CustomerLogin.tsx
│   │   │   ├── CustomerSetPin.tsx
│   │   │   ├── PaymentPortal.tsx
│   │   │   ├── StatementView.tsx
│   │   │   └── DocumentDownloads.tsx
│   │   │
│   │   ├── /reports              # Reports & Analytics
│   │   │   ├── ReportsView.tsx
│   │   │   ├── ReportBuilder.tsx
│   │   │   ├── ExportOptions.tsx
│   │   │   └── ScheduledReports.tsx
│   │   │
│   │   ├── /workflows            # Automation
│   │   │   ├── WorkflowsList.tsx
│   │   │   ├── WorkflowBuilder.tsx
│   │   │   ├── WorkflowTriggers.tsx
│   │   │   └── WorkflowActions.tsx
│   │   │
│   │   ├── /settings             # Settings & Admin
│   │   │   ├── OrganizationSettings.tsx
│   │   │   ├── UserManagement.tsx
│   │   │   ├── IntegrationSettings.tsx
│   │   │   └── BillingSettings.tsx
│   │   │
│   │   ├── /layout               # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Footer.tsx
│   │   │
│   │   └── /figma                # Figma integration components
│   │       └── ImageWithFallback.tsx
│   │
│   └── /types
│       ├── unit.ts               # Shared domain types
│       └── user.ts               # Role/permission types
│
├── /lib
│   ├── /api                      # API clients
│   │   ├── supabase.ts
│   │   ├── payments.ts
│   │   ├── notifications.ts
│   │   └── reports.ts
│   │
│   ├── /hooks                    # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useUnits.ts
│   │   ├── usePayments.ts
│   │   └── useNotifications.ts
│   │
│   ├── /utils                    # Utility functions
│   │   ├── dateHelpers.ts
│   │   ├── currencyHelpers.ts
│   │   ├── validation.ts
│   │   └── calculations.ts
│   │
│   └── /types                    # TypeScript types
│       ├── units.ts
│       ├── payments.ts
│       ├── customers.ts
│       └── common.ts
│
└── /styles
    ├── theme.css                 # Global theme variables
    ├── fonts.css                 # Font imports
    └── globals.css               # Global styles
```

---

## 🔐 Security Architecture

### Authentication & Authorization

**Phase 1 (Current):**
- Role-based UI rendering
- Client-side permission checks
- Mock user switching

**Phase 2 (With Database):**
- Supabase Auth for user management
- Row Level Security (RLS) policies
- JWT tokens for API authentication
- Multi-factor authentication (optional)

### Data Security

**Multi-Tenancy Isolation:**
```sql
-- Every table has organization_id
-- RLS policies ensure users only see their org's data

CREATE POLICY "Users can only see their organization's data"
ON units FOR SELECT
USING (organization_id = auth.organization_id());

CREATE POLICY "Users can only insert to their organization"
ON units FOR INSERT
WITH CHECK (organization_id = auth.organization_id());
```

**Sensitive Data Handling:**
- Encrypt customer PII at rest
- Redact sensitive info in logs
- Secure file storage with signed URLs
- HTTPS only for all communications

### Audit Trail
- Log all data modifications
- Track user actions with IP and timestamp
- Immutable audit log (append-only)
- Retention policy (7 years for financial data)

---

## 🚀 Performance Optimization

### Frontend Optimization
- **Code Splitting:** Route-based lazy loading
- **Memoization:** React.memo for expensive components
- **Virtual Scrolling:** For large tables (1000+ rows)
- **Image Optimization:** WebP format, lazy loading
- **Bundle Size:** Keep under 500KB initial load

### Backend Optimization
- **Database Indexing:**
  ```sql
  CREATE INDEX idx_units_org_status ON units(organization_id, status);
  CREATE INDEX idx_payments_unit_date ON payment_transactions(unit_id, transaction_date);
  CREATE INDEX idx_customers_org ON customers(organization_id);
  ```

- **Query Optimization:**
  - Use database views for complex reports
  - Cache expensive queries (reports_cache table)
  - Pagination for all list views (50 items per page)

- **Caching Strategy:**
  - Dashboard metrics: 5-minute cache
  - Reports: 1-hour cache (refresh on demand)
  - User sessions: Redis/in-memory

---

## 🔌 Integration Architecture

### Payment Gateway Integration

**Phase 1:** Manual payment recording only  
**Phase 2:** Online payment integration

**Supported Gateways (PH Market):**
1. **PayMongo** - Primary (cards, GCash, PayMaya)
2. **Xendit** - Backup option
3. **Dragonpay** - Bank transfers
4. **Direct GCash/PayMaya** - QR code generation

**Integration Pattern:**
```typescript
interface PaymentGateway {
  createPaymentIntent(amount: number, metadata: object): Promise<PaymentIntent>;
  verifyPayment(transactionId: string): Promise<PaymentStatus>;
  refundPayment(transactionId: string): Promise<RefundStatus>;
  generateQRCode(amount: number): Promise<string>;
}
```

### Communication Channels

**Email (High Priority):**
- SendGrid or AWS SES
- Templates: Payment confirmations, reminders, statements
- Tracking: Open rates, click rates

**SMS (Critical Notifications):**
- Semaphore (PH-focused) or Twilio
- Use cases: Payment reminders, critical alerts
- Cost consideration: ₱0.50-1.00 per SMS

**In-App Notifications:**
- Real-time using Supabase Realtime
- Notification center in header
- Push notifications (future)

### Accounting Software Integration (Phase 3)

**Priority Order:**
1. **QuickBooks Online** - Most requested
2. **Xero** - Growing in SEA
3. **Excel Export** - Universal fallback

**Sync Strategy:**
- Daily batch sync (payments → accounting)
- Manual reconciliation reports
- Two-way sync (advanced)

---

## 📱 Responsive Design Strategy

### Breakpoints
- **Mobile:** < 640px (essential views only)
- **Tablet:** 640px - 1024px (adapted layouts)
- **Desktop:** > 1024px (full features)

### Mobile-First Features
- Dashboard: Simplified metrics, swipeable cards
- Payments: Quick record payment
- Units: Search and basic info
- Collections: Critical alerts only

### Desktop-Only Features
- Advanced reports and analytics
- Bulk operations
- Workflow builder
- Multi-panel views

---

## 🧪 Testing Strategy

### Unit Tests
- **Coverage Target:** 70%+ for business logic
- **Tools:** Jest + React Testing Library
- **Priority:**
  - Payment calculations
  - Date/time helpers
  - Currency formatting
  - Validation functions

### Integration Tests
- **Database operations** (with test database)
- **API endpoints** (if custom backend)
- **Payment gateway mocks**

### E2E Tests
- **Tools:** Playwright or Cypress
- **Critical Flows:**
  - User login → Dashboard view
  - Record payment → Update status
  - Add unit → Assign customer
  - Generate report → Export

### Manual Testing Checklist
- [ ] Role-based access control
- [ ] Data validation and error handling
- [ ] Cross-browser compatibility (Chrome, Safari, Firefox)
- [ ] Mobile responsiveness
- [ ] Print layouts (for reports)

---

## 🚢 Deployment Architecture

### Phase 1: Static Hosting
- **Platform:** Vercel or Netlify
- **Setup:** Git-based deployment
- **Cost:** Free tier sufficient
- **Domain:** Custom domain (elconstruction.app)

### Phase 2: Full Stack with Database
- **Frontend:** Vercel/Netlify
- **Backend:** Supabase (managed PostgreSQL + Auth)
- **Storage:** Supabase Storage or AWS S3
- **Cost Estimate:** ₱2,000-5,000/month (starter tier)

### Phase 3: Production Scale
- **Frontend:** CDN distribution
- **Backend:** Load balanced API servers (if needed)
- **Database:** Supabase Pro with read replicas
- **Monitoring:** Sentry for errors, Mixpanel for analytics
- **Cost Estimate:** ₱15,000-30,000/month (100 customers)

### CI/CD Pipeline
```yaml
# GitHub Actions workflow
1. On push to main:
   - Run linting (ESLint)
   - Run tests (Jest)
   - Build production bundle
   - Deploy to staging

2. On release tag:
   - Run full test suite
   - Build production
   - Deploy to production
   - Run smoke tests
   - Notify team
```

---

## 🔄 Data Migration Strategy

### Import from Excel (Critical for Adoption)

**Step 1: Template Download**
- Provide standardized Excel template
- Match their current spreadsheet format
- Include validation rules

**Step 2: Upload & Validation**
- Parse Excel file (use SheetJS/xlsx)
- Validate data format
- Show preview with errors highlighted
- Allow corrections before import

**Step 3: Import Process**
- Create customers first
- Create units with associations
- Create payment schedules
- Import historical payment records
- Generate summary report

**Rollback Plan:**
- Keep original Excel file
- Transaction-based import (all or nothing)
- Export to Excel anytime for backup

---

## 📣 Communications Templates (Future)

### Message Variables
- Support placeholders in template content (e.g., `{amount_due}`, `{days_late}`, `{due_date}`, `{unit_number}`)
- Define a single source of truth for placeholder names + formatting rules
- Resolve variables at send time (payments, schedules, collections, unit status)

### Validation
- Warn when a template includes unknown placeholders
- Preview message with sample data before sending

---

## 🔐 Customer Portal Access (Org-Scoped)

### Login Scope
- Customer portal is scoped to a single organization.
- Slug resolution order: `*.customer.*` subdomain → `/portal/{orgSlug}` path → `?org=slug` query param.
- Portal users select a project from that org, then log in with unit number + PIN.

### Account Provisioning
- Portal accounts are auto-provisioned when units are created/imported.
- Default PIN is `123456`, and `must_change_pin` forces a reset on first login.

### Security Boundaries
- Session tokens only access the assigned unit.
- Project and unit matching require org slug + project id + unit number.

---

## 🌐 Multi-Language Support (Future)

### Internationalization (i18n)
- **Primary:** English (initial launch)
- **Phase 2:** Filipino/Tagalog
- **Phase 3:** Spanish (LatAm expansion)

### Implementation
- Use react-i18next
- Translate UI labels, messages, templates
- Date/currency formatting per locale
- RTL support (future)

---

## 📊 Analytics & Monitoring

### User Analytics
- **Tool:** Mixpanel or PostHog
- **Track:**
  - Feature usage (which modules are used most)
  - User flows (where do users get stuck)
  - Cohort retention
  - Payment recording frequency

### System Monitoring
- **Tool:** Sentry (errors) + Supabase Dashboard
- **Alerts:**
  - Error rate > 1%
  - API response time > 2s
  - Database connection issues
  - Payment gateway failures

### Business Metrics Dashboard
- Monthly Recurring Revenue (MRR)
- Customer churn rate
- Average units per customer
- Support ticket volume
- Feature adoption rates

---

## 🔐 Compliance & Data Privacy

### PDPA Compliance (Philippines)
- **Data Collection:** Only necessary fields
- **Consent:** Explicit opt-in for communications
- **Right to Access:** Customers can request their data
- **Right to Deletion:** Data deletion upon request
- **Data Retention:** 7 years for financial records

### Terms & Policies
- [ ] Terms of Service
- [ ] Privacy Policy
- [ ] Cookie Policy
- [ ] Data Processing Agreement (for B2B)
- [ ] SLA (Service Level Agreement)

---

## 🎯 Scalability Plan

### Horizontal Scaling
- **Stateless Frontend:** Easy to scale with CDN
- **API Layer:** Load balanced app servers
- **Database:** Read replicas for reporting queries

### Vertical Limits
- **Current Architecture:** Good for 500-1,000 customers
- **Database:** PostgreSQL handles millions of rows
- **Storage:** Unlimited with object storage (S3)

### Performance Bottlenecks (Monitor)
- Dashboard query performance (>2s is bad)
- Report generation time (>10s is bad)
- File upload size (limit to 10MB per file)
- Concurrent users (test with 100+ simultaneous)

---

## 🛠 Technology Stack Summary

### Frontend
- React 18 + TypeScript
- Tailwind CSS v4.0
- React Router v6
- React Hook Form
- Recharts
- Lucide React
- date-fns

### Backend (Phase 2)
- Supabase (PostgreSQL + Auth + Storage + Realtime)
- Edge Functions (serverless)
- Row Level Security (RLS)

### DevOps
- GitHub (version control)
- GitHub Actions (CI/CD)
- Vercel/Netlify (hosting)
- Sentry (error tracking)

### Third-Party Services
- PayMongo (payments)
- SendGrid (email)
- Semaphore (SMS)
- AWS S3 (optional storage)

---

## 📝 Architecture Decision Records (ADRs)

### ADR-001: Choose Supabase over Custom Backend
**Decision:** Use Supabase instead of building custom Node.js API  
**Reasoning:**
- Faster development (2-3 months saved)
- Built-in auth, RLS, realtime
- Lower hosting costs
- Great TypeScript support
- Easy to migrate away if needed

**Trade-offs:**
- Less control over infrastructure
- Vendor lock-in risk (mitigated by PostgreSQL standard)
- Limited customization for complex business logic

---

### ADR-002: React Context vs Redux
**Decision:** Start with React Context + Hooks, upgrade to Zustand if needed  
**Reasoning:**
- Simpler for small to medium apps
- Less boilerplate
- Built into React
- Can migrate to Zustand/Redux later if state becomes complex

---

### ADR-003: Tailwind CSS over Component Library
**Decision:** Use Tailwind CSS instead of Material-UI or Ant Design  
**Reasoning:**
- Full design control (Bringova style)
- Smaller bundle size
- Faster iteration
- No framework bloat
- Modern utility-first approach

**Trade-offs:**
- Build components from scratch
- More initial development time
- Need to maintain design consistency

---

### ADR-004: Multi-Tenancy Strategy
**Decision:** Shared database with organization_id partitioning  
**Reasoning:**
- Simpler to maintain (one database)
- Lower infrastructure costs
- Easier to deploy features
- RLS provides strong isolation

**Alternative Considered:** Separate database per tenant (too complex for Phase 1)

---

## 🎓 Technical Debt & Future Considerations

### Known Limitations (Phase 1)
- Some settings still rely on defaults until organization data is saved
- Limited automated tests
- No CI/CD pipeline

### Planned Improvements (Phase 2)
- Add comprehensive test coverage
- Implement proper error boundaries
- Add loading states and skeletons
- Optimize bundle size

### Future Enhancements (Phase 3+)
- Mobile apps (React Native)
- Offline mode (Progressive Web App)
- Advanced analytics (BI dashboard)
- API for third-party integrations
- White-label multi-tenant SaaS

---

**Document Version:** 1.1  
**Last Updated:** December 27, 2024  
**Next Review:** After Phase 1 completion  
**Status:** ✅ Architecture Defined - Ready for Development Planning
