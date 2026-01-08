# NEXSYS - Technical Specification

## Database Schema (Supabase PostgreSQL)

### Overview
The Nexsys platform uses Supabase for backend services, providing PostgreSQL database, real-time subscriptions, authentication, and Row-Level Security (RLS) for multi-tenant data isolation.

### Template-Driven Schema (Direction)
Core revenue tracking stays consistent, while templates customize labels, fields, and statuses.
The database will keep core tables (organizations, users, projects, customers, units, payments, schedules)
and add configurable tables for template fields and statuses.

---

## Tables

### 1. organizations
Multi-tenant root table for each SMB customer.

```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL, -- URL-friendly identifier
  org_code TEXT UNIQUE NOT NULL, -- Short Org ID for join flow
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Business details
  business_type TEXT, -- 'real_estate', 'construction', etc.
  contact_email TEXT,
  contact_phone TEXT,
  address TEXT,
  
  -- Subscription
  subscription_tier TEXT DEFAULT 'trial', -- 'trial', 'basic', 'premium'
  subscription_status TEXT DEFAULT 'active', -- 'active', 'suspended', 'cancelled'
  subscription_start_date DATE,
  subscription_end_date DATE,
  
  -- Settings
  settings JSONB DEFAULT '{}'::jsonb
);

-- Indexes
CREATE INDEX idx_organizations_slug ON organizations(slug);
CREATE INDEX idx_organizations_status ON organizations(subscription_status);
CREATE INDEX idx_organizations_org_code ON organizations(org_code);
```

### 2. users
User accounts with organization membership.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'viewer', -- 'admin', 'manager', 'viewer'
  status TEXT DEFAULT 'active', -- 'active', 'pending', 'rejected'
  approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
  approved_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ,
  
  -- Preferences
  avatar_url TEXT,
  preferences JSONB DEFAULT '{}'::jsonb
);

-- Indexes
CREATE INDEX idx_users_org ON users(organization_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);

### 2a. org_join_requests
Join requests created when a user signs up with an Org ID.

```sql
CREATE TABLE org_join_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role_requested TEXT DEFAULT 'viewer',
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
  approved_at TIMESTAMPTZ,
  rejected_by UUID REFERENCES users(id) ON DELETE SET NULL,
  rejected_at TIMESTAMPTZ
);

CREATE INDEX idx_org_join_requests_org ON org_join_requests(organization_id);
CREATE INDEX idx_org_join_requests_status ON org_join_requests(status);
```

### 2b. org_id_attempts
Rate-limits Org ID validation attempts by email.

```sql
CREATE TABLE org_id_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  org_code TEXT NOT NULL,
  success BOOLEAN DEFAULT false,
  attempted_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_org_id_attempts_email ON org_id_attempts(email);
CREATE INDEX idx_org_id_attempts_attempted_at ON org_id_attempts(attempted_at);
```
```

### 3. projects
Subdivisions/developments within an organization.

```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL, -- "EL Construction - Phase 1"
  code TEXT NOT NULL, -- "ELC-P1"
  location TEXT,
  
  total_units INTEGER DEFAULT 0,
  units_sold INTEGER DEFAULT 0,
  units_available INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(organization_id, code)
);

-- Indexes
CREATE INDEX idx_projects_org ON projects(organization_id);
```

### 4. customers
Buyers/clients associated with units.

```sql
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Personal Info
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  
  -- Business Info
  buyer_type TEXT NOT NULL, -- 'individual', 'corporate'
  company_name TEXT, -- For corporate buyers
  tax_id TEXT,
  
  -- Address
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  province TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'Philippines',
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT
);

-- Indexes
CREATE INDEX idx_customers_org ON customers(organization_id);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_phone ON customers(phone);
```

### 5. units
Property units with payment tracking.

```sql
CREATE TABLE units (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  
  -- Unit Identification
  block_lot TEXT NOT NULL, -- "B4-L08"
  
  -- Property Details
  property_type TEXT NOT NULL, -- 'residential', 'commercial'
  area_sqm DECIMAL(10,2),
  floor INTEGER,
  bedrooms INTEGER,
  bathrooms DECIMAL(3,1), -- 2.5 bathrooms
  
  -- Status
  status TEXT NOT NULL DEFAULT 'available',
  /* Possible values:
     - 'available'
     - 'reserved'
     - 'in_payment_cycle'
     - 'at_risk'
     - 'overdue'
     - 'critical'
     - 'fully_paid'
     - 'move_in_scheduled'
  */
  
  -- Payment Terms
  total_amount DECIMAL(12,2),
  downpayment DECIMAL(12,2),
  balance DECIMAL(12,2),
  monthly_amount DECIMAL(12,2),
  total_months INTEGER,
  months_paid INTEGER DEFAULT 0,
  payment_start_date DATE,
  
  -- Arrears Calculation
  arrears DECIMAL(12,2) DEFAULT 0,
  days_overdue INTEGER DEFAULT 0,
  last_payment_date DATE,
  
  -- Property Management Dues
  electricity_due DECIMAL(10,2) DEFAULT 0,
  water_due DECIMAL(10,2) DEFAULT 0,
  garbage_due DECIMAL(10,2) DEFAULT 0,
  maintenance_due DECIMAL(10,2) DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(organization_id, project_id, block_lot)
);

-- Indexes
CREATE INDEX idx_units_org ON units(organization_id);
CREATE INDEX idx_units_project ON units(project_id);
CREATE INDEX idx_units_customer ON units(customer_id);
CREATE INDEX idx_units_status ON units(status);
CREATE INDEX idx_units_overdue ON units(days_overdue) WHERE days_overdue > 0;
```

### 6. payment_schedules
Monthly payment schedule for each unit.

```sql
CREATE TABLE payment_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
  
  -- Schedule Details
  month_number INTEGER NOT NULL, -- 1-based (1 = first month)
  month_name TEXT NOT NULL, -- "January 2026"
  due_date DATE NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  
  -- Payment Status
  status TEXT NOT NULL DEFAULT 'unpaid', -- 'unpaid', 'partial', 'paid', 'overdue'
  paid_date DATE,
  partial_amount DECIMAL(12,2),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(unit_id, month_number)
);

-- Indexes
CREATE INDEX idx_payment_schedules_unit ON payment_schedules(unit_id);
CREATE INDEX idx_payment_schedules_status ON payment_schedules(status);
CREATE INDEX idx_payment_schedules_due_date ON payment_schedules(due_date);
```

### 7. payments
Actual payment records.

```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  recorded_by UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Payment Details
  amount DECIMAL(12,2) NOT NULL,
  payment_date DATE NOT NULL,
  payment_method TEXT NOT NULL, -- 'cash', 'gcash', 'bank_transfer', 'check'
  reference_number TEXT,
  
  -- Allocation
  applied_to_months INTEGER[] DEFAULT '{}', -- Array of month_numbers
  
  -- Metadata
  notes TEXT,
  receipt_url TEXT, -- Supabase Storage URL
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_payments_org ON payments(organization_id);
CREATE INDEX idx_payments_unit ON payments(unit_id);
CREATE INDEX idx_payments_customer ON payments(customer_id);
CREATE INDEX idx_payments_date ON payments(payment_date);
```

### 8. communications
Activity log and customer communications.

```sql
CREATE TABLE communications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Communication Details
  type TEXT NOT NULL, -- 'email', 'sms', 'call', 'note', 'reminder'
  subject TEXT,
  message TEXT,
  
  -- Status
  status TEXT DEFAULT 'pending', -- 'pending', 'sent', 'delivered', 'failed'
  sent_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_communications_org ON communications(organization_id);
CREATE INDEX idx_communications_unit ON communications(unit_id);
CREATE INDEX idx_communications_customer ON communications(customer_id);
CREATE INDEX idx_communications_type ON communications(type);
```

### 9. documents
File attachments (receipts, contracts, etc.).

```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
  payment_id UUID REFERENCES payments(id) ON DELETE CASCADE,
  uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- File Details
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL, -- MIME type
  file_size INTEGER, -- bytes
  storage_path TEXT NOT NULL, -- Supabase Storage path
  
  -- Metadata
  document_type TEXT, -- 'receipt', 'contract', 'id', 'other'
  description TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_documents_org ON documents(organization_id);
CREATE INDEX idx_documents_unit ON documents(unit_id);
CREATE INDEX idx_documents_payment ON documents(payment_id);
```

### 10. activity_logs
Audit trail for all system actions.

```sql
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Action Details
  action TEXT NOT NULL, -- 'payment_recorded', 'unit_updated', 'reminder_sent', etc.
  entity_type TEXT, -- 'unit', 'payment', 'customer'
  entity_id UUID,
  
  -- Change Details
  changes JSONB, -- Before/after values
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_activity_logs_org ON activity_logs(organization_id);
CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_action ON activity_logs(action);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);
```

---

## Row-Level Security (RLS) Policies

### Enable RLS on all tables
```sql
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
```

### Helper Function
```sql
-- Get user's organization_id
CREATE OR REPLACE FUNCTION auth.user_organization_id()
RETURNS UUID AS $$
  SELECT organization_id FROM users WHERE id = auth.uid()
$$ LANGUAGE SQL SECURITY DEFINER;
```

### RLS Policies (Example for units table)
```sql
-- Users can only see units in their organization
CREATE POLICY "Users can view own organization units"
  ON units FOR SELECT
  USING (organization_id = auth.user_organization_id());

-- Only admins and managers can insert units
CREATE POLICY "Admins/Managers can insert units"
  ON units FOR INSERT
  WITH CHECK (
    organization_id = auth.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('admin', 'manager')
    )
  );

-- Only admins and managers can update units
CREATE POLICY "Admins/Managers can update units"
  ON units FOR UPDATE
  USING (organization_id = auth.user_organization_id())
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('admin', 'manager')
    )
  );

-- Only admins can delete units
CREATE POLICY "Admins can delete units"
  ON units FOR DELETE
  USING (
    organization_id = auth.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );
```

**Note:** Apply similar RLS policies to all other tables, adjusting permissions based on roles.

---

## Database Functions

### 1. Calculate Unit Status
Automatically determine unit status based on payment state.

```sql
CREATE OR REPLACE FUNCTION calculate_unit_status(unit_id UUID)
RETURNS TEXT AS $$
DECLARE
  unit_record RECORD;
BEGIN
  SELECT * INTO unit_record FROM units WHERE id = unit_id;
  
  -- Fully Paid
  IF unit_record.months_paid >= unit_record.total_months THEN
    RETURN 'fully_paid';
  END IF;
  
  -- Critical (more than 60 days overdue)
  IF unit_record.days_overdue > 60 THEN
    RETURN 'critical';
  END IF;
  
  -- Overdue (30-60 days)
  IF unit_record.days_overdue > 30 THEN
    RETURN 'overdue';
  END IF;
  
  -- At Risk (1-30 days)
  IF unit_record.days_overdue > 0 THEN
    RETURN 'at_risk';
  END IF;
  
  -- In Payment Cycle (active, no issues)
  IF unit_record.customer_id IS NOT NULL THEN
    RETURN 'in_payment_cycle';
  END IF;
  
  -- Available
  RETURN 'available';
END;
$$ LANGUAGE plpgsql;
```

### 2. Update Days Overdue
Calculate overdue days based on current date and payment schedule.

```sql
CREATE OR REPLACE FUNCTION update_days_overdue()
RETURNS VOID AS $$
BEGIN
  UPDATE units u
  SET 
    days_overdue = GREATEST(0, 
      (SELECT COALESCE(MAX(CURRENT_DATE - due_date), 0)
       FROM payment_schedules
       WHERE unit_id = u.id
       AND status IN ('unpaid', 'overdue')
       AND due_date < CURRENT_DATE)
    ),
    status = calculate_unit_status(u.id)
  WHERE u.customer_id IS NOT NULL;
END;
$$ LANGUAGE plpgsql;
```

### 3. Record Payment and Update Schedule
Apply payment to payment schedule and update unit.

```sql
CREATE OR REPLACE FUNCTION record_payment(
  p_unit_id UUID,
  p_amount DECIMAL,
  p_payment_date DATE,
  p_payment_method TEXT,
  p_reference_number TEXT,
  p_notes TEXT,
  p_recorded_by UUID
)
RETURNS UUID AS $$
DECLARE
  v_payment_id UUID;
  v_remaining_amount DECIMAL := p_amount;
  v_schedule_record RECORD;
  v_months_paid INTEGER := 0;
  v_applied_months INTEGER[] := '{}';
BEGIN
  -- Insert payment record
  INSERT INTO payments (
    organization_id,
    unit_id,
    customer_id,
    recorded_by,
    amount,
    payment_date,
    payment_method,
    reference_number,
    notes
  )
  SELECT 
    u.organization_id,
    u.id,
    u.customer_id,
    p_recorded_by,
    p_amount,
    p_payment_date,
    p_payment_method,
    p_reference_number,
    p_notes
  FROM units u
  WHERE u.id = p_unit_id
  RETURNING id INTO v_payment_id;
  
  -- Apply payment to schedule (oldest unpaid first)
  FOR v_schedule_record IN
    SELECT * FROM payment_schedules
    WHERE unit_id = p_unit_id
    AND status IN ('unpaid', 'partial', 'overdue')
    ORDER BY month_number ASC
  LOOP
    EXIT WHEN v_remaining_amount <= 0;
    
    -- Full payment of this month
    IF v_remaining_amount >= v_schedule_record.amount THEN
      UPDATE payment_schedules
      SET 
        status = 'paid',
        paid_date = p_payment_date,
        updated_at = NOW()
      WHERE id = v_schedule_record.id;
      
      v_remaining_amount := v_remaining_amount - v_schedule_record.amount;
      v_months_paid := v_months_paid + 1;
      v_applied_months := array_append(v_applied_months, v_schedule_record.month_number);
      
    -- Partial payment
    ELSE
      UPDATE payment_schedules
      SET 
        status = 'partial',
        partial_amount = COALESCE(partial_amount, 0) + v_remaining_amount,
        updated_at = NOW()
      WHERE id = v_schedule_record.id;
      
      v_applied_months := array_append(v_applied_months, v_schedule_record.month_number);
      v_remaining_amount := 0;
    END IF;
  END LOOP;
  
  -- Update payment record with applied months
  UPDATE payments
  SET applied_to_months = v_applied_months
  WHERE id = v_payment_id;
  
  -- Update unit
  UPDATE units
  SET 
    months_paid = months_paid + v_months_paid,
    arrears = GREATEST(0, arrears - p_amount),
    last_payment_date = p_payment_date,
    updated_at = NOW()
  WHERE id = p_unit_id;
  
  -- Recalculate days overdue and status
  PERFORM update_days_overdue();
  
  RETURN v_payment_id;
END;
$$ LANGUAGE plpgsql;
```

---

## Supabase Client Setup (Frontend)

### Install Dependencies
```bash
npm install @supabase/supabase-js @supabase/auth-helpers-react
```

### Environment Variables
Create `.env.local`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Supabase Client (`/src/lib/supabase.ts`)
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### Auth Provider (`/src/app/App.tsx`)
```typescript
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from './lib/supabase';

function App() {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      {/* Your app components */}
    </SessionContextProvider>
  );
}
```

---

## API Layer (Frontend Hooks)

### Units Hook (`/src/hooks/useUnits.ts`)
```typescript
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Unit } from '../types';

export function useUnits() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchUnits();

    // Real-time subscription
    const subscription = supabase
      .channel('units_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'units' },
        (payload) => {
          console.log('Unit changed:', payload);
          fetchUnits(); // Refetch on change
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function fetchUnits() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('units')
        .select(`
          *,
          customer:customers(*),
          project:projects(*)
        `)
        .order('days_overdue', { ascending: false });

      if (error) throw error;
      setUnits(data || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }

  return { units, loading, error, refetch: fetchUnits };
}
```

### Payment Recording Hook
```typescript
export async function recordPayment(paymentData: {
  unitId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  referenceNumber: string;
  notes?: string;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data, error } = await supabase.rpc('record_payment', {
    p_unit_id: paymentData.unitId,
    p_amount: paymentData.amount,
    p_payment_date: paymentData.paymentDate,
    p_payment_method: paymentData.paymentMethod,
    p_reference_number: paymentData.referenceNumber,
    p_notes: paymentData.notes,
    p_recorded_by: user?.id
  });

  if (error) throw error;
  return data; // Returns payment_id
}
```

---

## Real-time Features

### Dashboard Metrics Subscription
```typescript
useEffect(() => {
  const subscription = supabase
    .channel('dashboard_updates')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'payments' },
      () => {
        // Recalculate metrics
        refetchDashboard();
      }
    )
    .on('postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'units' },
      () => {
        refetchDashboard();
      }
    )
    .subscribe();

  return () => subscription.unsubscribe();
}, []);
```

---

## Scheduled Jobs (Supabase Edge Functions)

### Daily Overdue Update
Run daily at midnight to update all unit statuses.

```typescript
// /supabase/functions/update-overdue/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  // Call update function
  const { error } = await supabase.rpc('update_days_overdue');

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' }
  });
});
```

Schedule via Supabase cron:
```sql
SELECT cron.schedule(
  'update-overdue-daily',
  '0 0 * * *', -- Every day at midnight
  $$
  SELECT net.http_post(
    url:='https://your-project.supabase.co/functions/v1/update-overdue',
    headers:='{"Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb
  );
  $$
);
```

---

## Simulation Seeding

### Seed Script
Use `/scripts/seed-simulation.ts` to generate a full workflow dataset (org, users, projects, units, schedules, payments, intents, dispatches).

```bash
npm run seed
```

## Performance Optimization

### Database Indexes
All critical indexes already included in schema above:
- Foreign keys automatically indexed
- Status fields indexed for filtering
- Date fields indexed for sorting
- Organization IDs indexed for RLS

### Query Optimization
- Use `.select()` with specific columns instead of `*` when possible
- Leverage Supabase's automatic query optimization
- Use `.limit()` and pagination for large datasets
- Cache dashboard metrics with React Query or SWR

### Real-time Optimization
- Subscribe only to relevant channels
- Unsubscribe when components unmount
- Debounce rapid updates (use `useDebounce` hook)

---

## Testing Strategy

### Unit Tests
- Database functions (payment recording, status calculation)
- RLS policies (ensure data isolation)
- API hooks (mocked Supabase client)

### Integration Tests
- Full payment workflow (record → update schedule → refresh dashboard)
- Multi-tenant data isolation
- Real-time subscription updates

### E2E Tests
- Demo tour workflow
- Collections → Unit Detail → Payment Recording
- Dashboard metrics accuracy

---

## Deployment

### Supabase Setup
1. Create project at supabase.com
2. Run schema SQL scripts in SQL Editor
3. Enable RLS policies
4. Set up Edge Functions for scheduled jobs
5. Configure auth providers (email/password initially)

### Frontend Deployment (Vercel)
1. Connect GitHub repo
2. Add environment variables (Supabase URL, keys)
3. Deploy automatically on push to main

### Custom Domain
- Point domain to Vercel deployment
- Configure Supabase auth callback URLs

---

**Last Updated:** December 30, 2025
**Status:** Ready for implementation in Codex
