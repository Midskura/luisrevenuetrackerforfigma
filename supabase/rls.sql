-- Idempotent policy resets for reruns
DROP POLICY IF EXISTS "Organizations: select own" ON organizations;
DROP POLICY IF EXISTS "Organizations: update admin" ON organizations;
DROP POLICY IF EXISTS "Users: select own org" ON users;
DROP POLICY IF EXISTS "Users: select self" ON users;
DROP POLICY IF EXISTS "Users: insert self" ON users;
DROP POLICY IF EXISTS "Users: update self or admin" ON users;
DROP POLICY IF EXISTS "Users: delete admin" ON users;
DROP POLICY IF EXISTS "Org join requests: select self" ON org_join_requests;
DROP POLICY IF EXISTS "Org join requests: select admin or manager" ON org_join_requests;
DROP POLICY IF EXISTS "Org join requests: update admin or manager" ON org_join_requests;
DROP POLICY IF EXISTS "Projects: select own org" ON projects;
DROP POLICY IF EXISTS "Projects: insert admin or manager" ON projects;
DROP POLICY IF EXISTS "Projects: update admin or manager" ON projects;
DROP POLICY IF EXISTS "Projects: delete admin" ON projects;
DROP POLICY IF EXISTS "Customers: select own org" ON customers;
DROP POLICY IF EXISTS "Customers: insert admin or manager" ON customers;
DROP POLICY IF EXISTS "Customers: update admin or manager" ON customers;
DROP POLICY IF EXISTS "Customers: delete admin" ON customers;
DROP POLICY IF EXISTS "Financing programs: select own org" ON financing_programs;
DROP POLICY IF EXISTS "Financing programs: insert admin or manager" ON financing_programs;
DROP POLICY IF EXISTS "Financing programs: update admin or manager" ON financing_programs;
DROP POLICY IF EXISTS "Financing programs: delete admin" ON financing_programs;
DROP POLICY IF EXISTS "Payment methods: select own org" ON payment_methods;
DROP POLICY IF EXISTS "Payment methods: insert admin or manager" ON payment_methods;
DROP POLICY IF EXISTS "Payment methods: update admin or manager" ON payment_methods;
DROP POLICY IF EXISTS "Payment methods: delete admin" ON payment_methods;
DROP POLICY IF EXISTS "Units: select own org" ON units;
DROP POLICY IF EXISTS "Units: insert admin or manager" ON units;
DROP POLICY IF EXISTS "Units: update admin or manager" ON units;
DROP POLICY IF EXISTS "Units: delete admin" ON units;
DROP POLICY IF EXISTS "Payment schedules: select own org" ON payment_schedules;
DROP POLICY IF EXISTS "Payment schedules: insert admin or manager" ON payment_schedules;
DROP POLICY IF EXISTS "Payment schedules: update admin or manager" ON payment_schedules;
DROP POLICY IF EXISTS "Payment schedules: delete admin" ON payment_schedules;
DROP POLICY IF EXISTS "Payments: select own org" ON payments;
DROP POLICY IF EXISTS "Payments: insert admin or manager" ON payments;
DROP POLICY IF EXISTS "Payments: update admin or manager" ON payments;
DROP POLICY IF EXISTS "Payments: delete admin" ON payments;
DROP POLICY IF EXISTS "Payment intents: select own org" ON payment_intents;
DROP POLICY IF EXISTS "Payment intents: insert admin or manager" ON payment_intents;
DROP POLICY IF EXISTS "Payment intents: update admin or manager" ON payment_intents;
DROP POLICY IF EXISTS "Payment intents: delete admin" ON payment_intents;
DROP POLICY IF EXISTS "Communications: select own org" ON communications;
DROP POLICY IF EXISTS "Communications: insert admin or manager" ON communications;
DROP POLICY IF EXISTS "Communications: update admin or manager" ON communications;
DROP POLICY IF EXISTS "Communications: delete admin" ON communications;
DROP POLICY IF EXISTS "Notifications: select own" ON notifications;
DROP POLICY IF EXISTS "Notifications: insert own" ON notifications;
DROP POLICY IF EXISTS "Notifications: update own" ON notifications;
DROP POLICY IF EXISTS "Documents: select own org" ON documents;
DROP POLICY IF EXISTS "Documents: insert admin or manager" ON documents;
DROP POLICY IF EXISTS "Documents: update admin or manager" ON documents;
DROP POLICY IF EXISTS "Documents: delete admin" ON documents;
DROP POLICY IF EXISTS "Move-in checklist: select own org" ON move_in_checklist_items;
DROP POLICY IF EXISTS "Move-in checklist: insert admin or manager" ON move_in_checklist_items;
DROP POLICY IF EXISTS "Move-in checklist: update admin or manager" ON move_in_checklist_items;
DROP POLICY IF EXISTS "Move-in checklist: delete admin" ON move_in_checklist_items;
DROP POLICY IF EXISTS "Unit defects: select own org" ON unit_defects;
DROP POLICY IF EXISTS "Unit defects: insert admin or manager" ON unit_defects;
DROP POLICY IF EXISTS "Unit defects: update admin or manager" ON unit_defects;
DROP POLICY IF EXISTS "Unit defects: delete admin" ON unit_defects;
DROP POLICY IF EXISTS "Communications dispatch: select own org" ON communications_dispatch;
DROP POLICY IF EXISTS "Communications dispatch: insert admin or manager" ON communications_dispatch;
DROP POLICY IF EXISTS "Communications dispatch: update admin or manager" ON communications_dispatch;
DROP POLICY IF EXISTS "Communications dispatch: delete admin" ON communications_dispatch;
DROP POLICY IF EXISTS "Activity logs: select own org" ON activity_logs;
DROP POLICY IF EXISTS "Activity logs: insert admin or manager" ON activity_logs;
DROP POLICY IF EXISTS "Activity logs: update admin or manager" ON activity_logs;
DROP POLICY IF EXISTS "Activity logs: delete admin" ON activity_logs;
DROP POLICY IF EXISTS "Project milestones: select own org" ON project_milestones;
DROP POLICY IF EXISTS "Project milestones: insert admin or manager" ON project_milestones;
DROP POLICY IF EXISTS "Project milestones: update admin or manager" ON project_milestones;
DROP POLICY IF EXISTS "Project milestones: delete admin" ON project_milestones;
DROP POLICY IF EXISTS "Project announcements: select own org" ON project_announcements;
DROP POLICY IF EXISTS "Project announcements: insert admin or manager" ON project_announcements;
DROP POLICY IF EXISTS "Project announcements: update admin or manager" ON project_announcements;
DROP POLICY IF EXISTS "Project announcements: delete admin" ON project_announcements;
DROP POLICY IF EXISTS "Project reminders: select own org" ON project_reminders;
DROP POLICY IF EXISTS "Project reminders: insert admin or manager" ON project_reminders;
DROP POLICY IF EXISTS "Project reminders: update admin or manager" ON project_reminders;
DROP POLICY IF EXISTS "Project reminders: delete admin" ON project_reminders;
DROP POLICY IF EXISTS "Project feedback: select own org" ON project_feedback;
DROP POLICY IF EXISTS "Project feedback: insert own org" ON project_feedback;
DROP POLICY IF EXISTS "Project feedback: update admin or manager" ON project_feedback;
DROP POLICY IF EXISTS "Project feedback: delete admin" ON project_feedback;
DROP POLICY IF EXISTS "Customer portal users: select own org" ON customer_portal_users;
DROP POLICY IF EXISTS "Customer portal users: insert admin or manager" ON customer_portal_users;
DROP POLICY IF EXISTS "Customer portal users: update admin or manager" ON customer_portal_users;
DROP POLICY IF EXISTS "Customer portal users: delete admin" ON customer_portal_users;
DROP POLICY IF EXISTS "Customer portal sessions: select own org" ON customer_portal_sessions;
DROP POLICY IF EXISTS "Customer portal sessions: insert admin or manager" ON customer_portal_sessions;
DROP POLICY IF EXISTS "Customer portal sessions: delete admin" ON customer_portal_sessions;
DROP POLICY IF EXISTS "Template configs: select own org" ON template_configs;
DROP POLICY IF EXISTS "Template configs: insert admin or manager" ON template_configs;
DROP POLICY IF EXISTS "Template configs: update admin or manager" ON template_configs;
DROP POLICY IF EXISTS "Template configs: delete admin" ON template_configs;
DROP POLICY IF EXISTS "Entity fields: select own org" ON entity_fields;
DROP POLICY IF EXISTS "Entity fields: insert admin or manager" ON entity_fields;
DROP POLICY IF EXISTS "Entity fields: update admin or manager" ON entity_fields;
DROP POLICY IF EXISTS "Entity fields: delete admin" ON entity_fields;
DROP POLICY IF EXISTS "Entity values: select own org" ON entity_values;
DROP POLICY IF EXISTS "Entity values: insert admin or manager" ON entity_values;
DROP POLICY IF EXISTS "Entity values: update admin or manager" ON entity_values;
DROP POLICY IF EXISTS "Entity values: delete admin" ON entity_values;
DROP POLICY IF EXISTS "Entity statuses: select own org" ON entity_statuses;
DROP POLICY IF EXISTS "Entity statuses: insert admin or manager" ON entity_statuses;
DROP POLICY IF EXISTS "Entity statuses: update admin or manager" ON entity_statuses;
DROP POLICY IF EXISTS "Entity statuses: delete admin" ON entity_statuses;
DROP POLICY IF EXISTS "Storage documents: read auth" ON storage.objects;
DROP POLICY IF EXISTS "Storage documents: insert auth" ON storage.objects;
DROP POLICY IF EXISTS "Storage documents: delete auth" ON storage.objects;
DROP POLICY IF EXISTS "Storage documents: read portal receipts" ON storage.objects;
DROP POLICY IF EXISTS "Storage documents: insert portal receipts" ON storage.objects;

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_join_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE financing_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_intents ENABLE ROW LEVEL SECURITY;
ALTER TABLE communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE move_in_checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE unit_defects ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_portal_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_portal_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE communications_dispatch ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE entity_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE entity_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE entity_statuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Storage (documents bucket)
CREATE POLICY "Storage documents: read auth" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'documents'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Storage documents: insert auth" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'documents'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Storage documents: delete auth" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'documents'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Storage documents: read portal receipts" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'documents'
    AND auth.role() = 'anon'
    AND name LIKE 'portal/receipts/%'
  );

CREATE POLICY "Storage documents: insert portal receipts" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'documents'
    AND auth.role() = 'anon'
    AND name LIKE 'portal/receipts/%'
  );

-- Organizations
CREATE POLICY "Organizations: select own" ON organizations
  FOR SELECT USING (id = public.user_organization_id());

CREATE POLICY "Organizations: update admin" ON organizations
  FOR UPDATE
  USING (
    id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (id = public.user_organization_id());

-- Users
CREATE POLICY "Users: select own org" ON users
  FOR SELECT USING (organization_id = public.user_organization_id());

CREATE POLICY "Users: select self" ON users
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users: insert self" ON users
  FOR INSERT WITH CHECK (id = auth.uid());

CREATE POLICY "Users: update self or admin" ON users
  FOR UPDATE
  USING (
    id = auth.uid()
    OR (
      organization_id = public.user_organization_id()
      AND EXISTS (
        SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
      )
    )
  )
  WITH CHECK (organization_id = public.user_organization_id());

CREATE POLICY "Users: delete admin" ON users
  FOR DELETE
  USING (
    organization_id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Org join requests
CREATE POLICY "Org join requests: select self" ON org_join_requests
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Org join requests: select admin or manager" ON org_join_requests
  FOR SELECT
  USING (
    organization_id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Org join requests: update admin or manager" ON org_join_requests
  FOR UPDATE
  USING (
    organization_id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  )
  WITH CHECK (organization_id = public.user_organization_id());

-- Projects
CREATE POLICY "Projects: select own org" ON projects
  FOR SELECT USING (organization_id = public.user_organization_id());

CREATE POLICY "Projects: insert admin or manager" ON projects
  FOR INSERT
  WITH CHECK (
    organization_id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Projects: update admin or manager" ON projects
  FOR UPDATE
  USING (
    organization_id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  )
  WITH CHECK (organization_id = public.user_organization_id());

CREATE POLICY "Projects: delete admin" ON projects
  FOR DELETE
  USING (
    organization_id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Customers
CREATE POLICY "Customers: select own org" ON customers
  FOR SELECT USING (organization_id = public.user_organization_id());

CREATE POLICY "Customers: insert admin or manager" ON customers
  FOR INSERT
  WITH CHECK (
    organization_id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Customers: update admin or manager" ON customers
  FOR UPDATE
  USING (
    organization_id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  )
  WITH CHECK (organization_id = public.user_organization_id());

CREATE POLICY "Customers: delete admin" ON customers
  FOR DELETE
  USING (
    organization_id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Financing programs
CREATE POLICY "Financing programs: select own org" ON financing_programs
  FOR SELECT USING (organization_id = public.user_organization_id());

CREATE POLICY "Financing programs: insert admin or manager" ON financing_programs
  FOR INSERT
  WITH CHECK (
    organization_id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Financing programs: update admin or manager" ON financing_programs
  FOR UPDATE
  USING (
    organization_id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  )
  WITH CHECK (organization_id = public.user_organization_id());

CREATE POLICY "Financing programs: delete admin" ON financing_programs
  FOR DELETE
  USING (
    organization_id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Payment methods
CREATE POLICY "Payment methods: select own org" ON payment_methods
  FOR SELECT USING (organization_id = public.user_organization_id());

CREATE POLICY "Payment methods: insert admin or manager" ON payment_methods
  FOR INSERT
  WITH CHECK (
    organization_id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Payment methods: update admin or manager" ON payment_methods
  FOR UPDATE
  USING (
    organization_id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  )
  WITH CHECK (organization_id = public.user_organization_id());

CREATE POLICY "Payment methods: delete admin" ON payment_methods
  FOR DELETE
  USING (
    organization_id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Units
CREATE POLICY "Units: select own org" ON units
  FOR SELECT USING (organization_id = public.user_organization_id());

CREATE POLICY "Units: insert admin or manager" ON units
  FOR INSERT
  WITH CHECK (
    organization_id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Units: update admin or manager" ON units
  FOR UPDATE
  USING (
    organization_id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  )
  WITH CHECK (organization_id = public.user_organization_id());

CREATE POLICY "Units: delete admin" ON units
  FOR DELETE
  USING (
    organization_id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Payment schedules
CREATE POLICY "Payment schedules: select own org" ON payment_schedules
  FOR SELECT USING (organization_id = public.user_organization_id());

CREATE POLICY "Payment schedules: insert admin or manager" ON payment_schedules
  FOR INSERT
  WITH CHECK (
    organization_id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Payment schedules: update admin or manager" ON payment_schedules
  FOR UPDATE
  USING (
    organization_id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  )
  WITH CHECK (organization_id = public.user_organization_id());

CREATE POLICY "Payment schedules: delete admin" ON payment_schedules
  FOR DELETE
  USING (
    organization_id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Payments
CREATE POLICY "Payments: select own org" ON payments
  FOR SELECT USING (organization_id = public.user_organization_id());

CREATE POLICY "Payments: insert admin or manager" ON payments
  FOR INSERT
  WITH CHECK (
    organization_id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Payments: update admin or manager" ON payments
  FOR UPDATE
  USING (
    organization_id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  )
  WITH CHECK (organization_id = public.user_organization_id());

CREATE POLICY "Payments: delete admin" ON payments
  FOR DELETE
  USING (
    organization_id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Payment intents
CREATE POLICY "Payment intents: select own org" ON payment_intents
  FOR SELECT USING (organization_id = public.user_organization_id());

CREATE POLICY "Payment intents: insert admin or manager" ON payment_intents
  FOR INSERT
  WITH CHECK (
    organization_id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Payment intents: update admin or manager" ON payment_intents
  FOR UPDATE
  USING (
    organization_id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  )
  WITH CHECK (organization_id = public.user_organization_id());

CREATE POLICY "Payment intents: delete admin" ON payment_intents
  FOR DELETE
  USING (
    organization_id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Communications
CREATE POLICY "Communications: select own org" ON communications
  FOR SELECT USING (organization_id = public.user_organization_id());

CREATE POLICY "Communications: insert admin or manager" ON communications
  FOR INSERT
  WITH CHECK (
    organization_id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- Notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Notifications: select own" ON notifications
  FOR SELECT USING (
    organization_id = public.user_organization_id()
    AND user_id = auth.uid()
  );

CREATE POLICY "Notifications: insert own" ON notifications
  FOR INSERT
  WITH CHECK (
    organization_id = public.user_organization_id()
    AND user_id = auth.uid()
  );

CREATE POLICY "Notifications: update own" ON notifications
  FOR UPDATE
  USING (
    organization_id = public.user_organization_id()
    AND user_id = auth.uid()
  )
  WITH CHECK (
    organization_id = public.user_organization_id()
    AND user_id = auth.uid()
  );

CREATE POLICY "Communications: update admin or manager" ON communications
  FOR UPDATE
  USING (
    organization_id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  )
  WITH CHECK (organization_id = public.user_organization_id());

CREATE POLICY "Communications: delete admin" ON communications
  FOR DELETE
  USING (
    organization_id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Documents
CREATE POLICY "Documents: select own org" ON documents
  FOR SELECT USING (organization_id = public.user_organization_id());

CREATE POLICY "Documents: insert admin or manager" ON documents
  FOR INSERT
  WITH CHECK (
    organization_id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Documents: update admin or manager" ON documents
  FOR UPDATE
  USING (
    organization_id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  )
  WITH CHECK (organization_id = public.user_organization_id());

CREATE POLICY "Documents: delete admin" ON documents
  FOR DELETE
  USING (
    organization_id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Move-in checklist items
CREATE POLICY "Move-in checklist: select own org" ON move_in_checklist_items
  FOR SELECT USING (organization_id = public.user_organization_id());

CREATE POLICY "Move-in checklist: insert admin or manager" ON move_in_checklist_items
  FOR INSERT
  WITH CHECK (
    organization_id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Move-in checklist: update admin or manager" ON move_in_checklist_items
  FOR UPDATE
  USING (
    organization_id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  )
  WITH CHECK (organization_id = public.user_organization_id());

CREATE POLICY "Move-in checklist: delete admin" ON move_in_checklist_items
  FOR DELETE
  USING (
    organization_id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Unit defects
CREATE POLICY "Unit defects: select own org" ON unit_defects
  FOR SELECT USING (organization_id = public.user_organization_id());

CREATE POLICY "Unit defects: insert admin or manager" ON unit_defects
  FOR INSERT
  WITH CHECK (
    organization_id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Unit defects: update admin or manager" ON unit_defects
  FOR UPDATE
  USING (
    organization_id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  )
  WITH CHECK (organization_id = public.user_organization_id());

CREATE POLICY "Unit defects: delete admin" ON unit_defects
  FOR DELETE
  USING (
    organization_id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Communications dispatch
CREATE POLICY "Communications dispatch: select own org" ON communications_dispatch
  FOR SELECT USING (organization_id = public.user_organization_id());

CREATE POLICY "Communications dispatch: insert admin or manager" ON communications_dispatch
  FOR INSERT
  WITH CHECK (
    organization_id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Communications dispatch: update admin or manager" ON communications_dispatch
  FOR UPDATE
  USING (
    organization_id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  )
  WITH CHECK (organization_id = public.user_organization_id());

CREATE POLICY "Communications dispatch: delete admin" ON communications_dispatch
  FOR DELETE
  USING (
    organization_id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Activity logs
CREATE POLICY "Activity logs: select own org" ON activity_logs
  FOR SELECT USING (organization_id = public.user_organization_id());

CREATE POLICY "Activity logs: insert admin or manager" ON activity_logs
  FOR INSERT
  WITH CHECK (
    organization_id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Activity logs: update admin or manager" ON activity_logs
  FOR UPDATE
  USING (
    organization_id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  )
  WITH CHECK (organization_id = public.user_organization_id());

CREATE POLICY "Activity logs: delete admin" ON activity_logs
  FOR DELETE
  USING (
    organization_id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Project milestones
CREATE POLICY "Project milestones: select own org" ON project_milestones
  FOR SELECT USING (organization_id = public.user_organization_id());

CREATE POLICY "Project milestones: insert admin or manager" ON project_milestones
  FOR INSERT
  WITH CHECK (
    organization_id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Project milestones: update admin or manager" ON project_milestones
  FOR UPDATE
  USING (
    organization_id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  )
  WITH CHECK (organization_id = public.user_organization_id());

CREATE POLICY "Project milestones: delete admin" ON project_milestones
  FOR DELETE
  USING (
    organization_id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Project announcements
CREATE POLICY "Project announcements: select own org" ON project_announcements
  FOR SELECT USING (organization_id = public.user_organization_id());

CREATE POLICY "Project announcements: insert admin or manager" ON project_announcements
  FOR INSERT
  WITH CHECK (
    organization_id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Project announcements: update admin or manager" ON project_announcements
  FOR UPDATE
  USING (
    organization_id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  )
  WITH CHECK (organization_id = public.user_organization_id());

CREATE POLICY "Project announcements: delete admin" ON project_announcements
  FOR DELETE
  USING (
    organization_id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Project reminders
CREATE POLICY "Project reminders: select own org" ON project_reminders
  FOR SELECT USING (organization_id = public.user_organization_id());

CREATE POLICY "Project reminders: insert admin or manager" ON project_reminders
  FOR INSERT
  WITH CHECK (
    organization_id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Project reminders: update admin or manager" ON project_reminders
  FOR UPDATE
  USING (
    organization_id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  )
  WITH CHECK (organization_id = public.user_organization_id());

CREATE POLICY "Project reminders: delete admin" ON project_reminders
  FOR DELETE
  USING (
    organization_id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Project feedback
CREATE POLICY "Project feedback: select own org" ON project_feedback
  FOR SELECT USING (organization_id = public.user_organization_id());

CREATE POLICY "Project feedback: insert own org" ON project_feedback
  FOR INSERT
  WITH CHECK (organization_id = public.user_organization_id());

CREATE POLICY "Project feedback: update admin or manager" ON project_feedback
  FOR UPDATE
  USING (
    organization_id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  )
  WITH CHECK (organization_id = public.user_organization_id());

CREATE POLICY "Project feedback: delete admin" ON project_feedback
  FOR DELETE
  USING (
    organization_id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Customer portal users
CREATE POLICY "Customer portal users: select own org" ON customer_portal_users
  FOR SELECT USING (organization_id = public.user_organization_id());

CREATE POLICY "Customer portal users: insert admin or manager" ON customer_portal_users
  FOR INSERT
  WITH CHECK (
    organization_id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Customer portal users: update admin or manager" ON customer_portal_users
  FOR UPDATE
  USING (
    organization_id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  )
  WITH CHECK (organization_id = public.user_organization_id());

CREATE POLICY "Customer portal users: delete admin" ON customer_portal_users
  FOR DELETE
  USING (
    organization_id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Customer portal sessions
CREATE POLICY "Customer portal sessions: select own org" ON customer_portal_sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1
      FROM units u
      WHERE u.id = customer_portal_sessions.unit_id
        AND u.organization_id = public.user_organization_id()
    )
  );

CREATE POLICY "Customer portal sessions: insert admin or manager" ON customer_portal_sessions
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM units u
      WHERE u.id = customer_portal_sessions.unit_id
        AND u.organization_id = public.user_organization_id()
    )
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Customer portal sessions: delete admin" ON customer_portal_sessions
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1
      FROM units u
      WHERE u.id = customer_portal_sessions.unit_id
        AND u.organization_id = public.user_organization_id()
    )
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Template configs
CREATE POLICY "Template configs: select own org" ON template_configs
  FOR SELECT USING (organization_id = public.user_organization_id());

CREATE POLICY "Template configs: insert admin or manager" ON template_configs
  FOR INSERT
  WITH CHECK (
    organization_id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Template configs: update admin or manager" ON template_configs
  FOR UPDATE
  USING (
    organization_id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  )
  WITH CHECK (organization_id = public.user_organization_id());

CREATE POLICY "Template configs: delete admin" ON template_configs
  FOR DELETE
  USING (
    organization_id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Entity fields
CREATE POLICY "Entity fields: select own org" ON entity_fields
  FOR SELECT USING (organization_id = public.user_organization_id());

CREATE POLICY "Entity fields: insert admin or manager" ON entity_fields
  FOR INSERT
  WITH CHECK (
    organization_id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Entity fields: update admin or manager" ON entity_fields
  FOR UPDATE
  USING (
    organization_id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  )
  WITH CHECK (organization_id = public.user_organization_id());

CREATE POLICY "Entity fields: delete admin" ON entity_fields
  FOR DELETE
  USING (
    organization_id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Entity values
CREATE POLICY "Entity values: select own org" ON entity_values
  FOR SELECT USING (organization_id = public.user_organization_id());

CREATE POLICY "Entity values: insert admin or manager" ON entity_values
  FOR INSERT
  WITH CHECK (
    organization_id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Entity values: update admin or manager" ON entity_values
  FOR UPDATE
  USING (
    organization_id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  )
  WITH CHECK (organization_id = public.user_organization_id());

CREATE POLICY "Entity values: delete admin" ON entity_values
  FOR DELETE
  USING (
    organization_id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Entity statuses
CREATE POLICY "Entity statuses: select own org" ON entity_statuses
  FOR SELECT USING (organization_id = public.user_organization_id());

CREATE POLICY "Entity statuses: insert admin or manager" ON entity_statuses
  FOR INSERT
  WITH CHECK (
    organization_id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Entity statuses: update admin or manager" ON entity_statuses
  FOR UPDATE
  USING (
    organization_id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  )
  WITH CHECK (organization_id = public.user_organization_id());

CREATE POLICY "Entity statuses: delete admin" ON entity_statuses
  FOR DELETE
  USING (
    organization_id = public.user_organization_id()
    AND EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );
