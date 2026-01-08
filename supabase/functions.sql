CREATE OR REPLACE FUNCTION public.user_organization_id()
RETURNS UUID AS $$
  SELECT organization_id
  FROM users
  WHERE id = auth.uid()
    AND status = 'active'
$$ LANGUAGE SQL SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.generate_org_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_letters TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  v_code TEXT;
  v_try INTEGER := 0;
BEGIN
  LOOP
    v_try := v_try + 1;
    v_code := substr(v_letters, floor(random() * length(v_letters))::int + 1, 1)
      || substr(v_letters, floor(random() * length(v_letters))::int + 1, 1)
      || lpad(floor(random() * 100000)::int::text, 5, '0');

    EXIT WHEN NOT EXISTS (SELECT 1 FROM organizations WHERE org_code = v_code);

    IF v_try > 50 THEN
      RAISE EXCEPTION 'Unable to generate organization code';
    END IF;
  END LOOP;

  RETURN v_code;
END;
$$;

CREATE OR REPLACE FUNCTION public.ensure_org_codes()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count INTEGER := 0;
BEGIN
  PERFORM set_config('row_security', 'off', true);

  UPDATE organizations
  SET org_code = public.generate_org_code()
  WHERE org_code IS NULL;

  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$;

CREATE OR REPLACE FUNCTION public.validate_org_code(
  p_org_code TEXT,
  p_email TEXT
)
RETURNS TABLE(valid BOOLEAN, org_name TEXT, organization_id UUID)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_code TEXT;
  v_email TEXT;
  v_attempts INTEGER;
  v_org_id UUID;
  v_org_name TEXT;
BEGIN
  PERFORM set_config('row_security', 'off', true);

  v_code := upper(trim(COALESCE(p_org_code, '')));
  v_email := lower(trim(COALESCE(p_email, '')));

  IF v_code = '' OR v_email = '' THEN
    RAISE EXCEPTION 'Org ID and email are required.';
  END IF;

  SELECT COUNT(*)
  INTO v_attempts
  FROM org_id_attempts
  WHERE email = v_email
    AND attempted_at > NOW() - INTERVAL '1 hour';

  IF v_attempts >= 5 THEN
    RAISE EXCEPTION 'Too many attempts. Please try again later.';
  END IF;

  SELECT id, name
  INTO v_org_id, v_org_name
  FROM organizations
  WHERE org_code = v_code
  LIMIT 1;

  INSERT INTO org_id_attempts (email, org_code, success)
  VALUES (v_email, v_code, v_org_id IS NOT NULL);

  RETURN QUERY SELECT v_org_id IS NOT NULL, v_org_name, v_org_id;
END;
$$;

DROP FUNCTION IF EXISTS public.ensure_user_profile();
CREATE OR REPLACE FUNCTION public.ensure_user_profile()
RETURNS TABLE(organization_id UUID, status TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_user_id UUID;
  v_user_email TEXT;
  v_metadata JSONB;
  v_full_name TEXT;
  v_join_code TEXT;
  v_org_id UUID;
  v_org_name TEXT;
  v_slug_base TEXT;
  v_slug TEXT;
  v_org_code TEXT;
  v_role TEXT;
  v_status TEXT;
BEGIN
  PERFORM set_config('row_security', 'off', true);

  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Unauthorized.';
  END IF;

  SELECT email, raw_user_meta_data
  INTO v_user_email, v_metadata
  FROM auth.users
  WHERE id = v_user_id;

  IF v_user_email IS NULL THEN
    RAISE EXCEPTION 'User not found.';
  END IF;

  v_join_code := NULLIF(v_metadata->>'join_org_code', '');

  SELECT organization_id, status
  INTO v_org_id, v_status
  FROM public.users
  WHERE id = v_user_id;

  IF v_org_id IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM organizations WHERE id = v_org_id
    ) THEN
      IF v_join_code IS NOT NULL THEN
        RAISE EXCEPTION 'Organization not found.';
      END IF;

      v_org_name := COALESCE(
        v_metadata->>'organization_name',
        split_part(v_user_email, '@', 1),
        'New Organization'
      );

      v_slug_base := lower(regexp_replace(v_org_name, '[^a-z0-9]+', '-', 'g'));
      v_slug_base := trim(both '-' from v_slug_base);
      IF v_slug_base = '' THEN
        v_slug_base := 'org';
      END IF;
      v_slug := v_slug_base || '-' || substr(replace(v_user_id::text, '-', ''), 1, 6);
      v_org_code := public.generate_org_code();

      INSERT INTO organizations (name, slug, org_code, subscription_tier, subscription_status)
      VALUES (v_org_name, v_slug, v_org_code, 'trial', 'active')
      RETURNING id INTO v_org_id;

      UPDATE public.users
      SET organization_id = v_org_id,
          role = COALESCE(role, 'admin')
      WHERE id = v_user_id;
    END IF;

    IF v_status IS NULL OR trim(v_status) = '' THEN
      UPDATE public.users
      SET status = 'active',
          approved_at = NOW(),
          approved_by = NULL
      WHERE id = v_user_id;
      v_status := 'active';
    END IF;

    RETURN QUERY SELECT v_org_id, v_status;
    RETURN;
  END IF;

  v_full_name := COALESCE(v_metadata->>'full_name', v_user_email, 'New User');

  IF v_join_code IS NOT NULL THEN
    v_join_code := upper(trim(v_join_code));
    SELECT id INTO v_org_id
    FROM organizations
    WHERE org_code = v_join_code
    LIMIT 1;

    IF v_org_id IS NULL THEN
      RAISE EXCEPTION 'Organization not found.';
    END IF;

    v_role := 'viewer';
    v_status := 'pending';
  ELSE
    v_org_name := COALESCE(
      v_metadata->>'organization_name',
      split_part(v_user_email, '@', 1),
      'New Organization'
    );

    v_slug_base := lower(regexp_replace(v_org_name, '[^a-z0-9]+', '-', 'g'));
    v_slug_base := trim(both '-' from v_slug_base);
    IF v_slug_base = '' THEN
      v_slug_base := 'org';
    END IF;
    v_slug := v_slug_base || '-' || substr(replace(v_user_id::text, '-', ''), 1, 6);
    v_org_code := public.generate_org_code();

    INSERT INTO organizations (name, slug, org_code, subscription_tier, subscription_status)
    VALUES (v_org_name, v_slug, v_org_code, 'trial', 'active')
    RETURNING id INTO v_org_id;

    v_role := 'admin';
    v_status := 'active';
  END IF;

  INSERT INTO public.users (
    id,
    organization_id,
    email,
    full_name,
    role,
    status,
    approved_at,
    approved_by
  )
  VALUES (
    v_user_id,
    v_org_id,
    v_user_email,
    v_full_name,
    v_role,
    v_status,
    CASE WHEN v_status = 'active' THEN NOW() ELSE NULL END,
    NULL
  );

  IF v_status = 'pending' THEN
    INSERT INTO org_join_requests (
      organization_id,
      user_id,
      email,
      full_name,
      role_requested,
      status,
      created_at
    )
    VALUES (
      v_org_id,
      v_user_id,
      v_user_email,
      v_full_name,
      'viewer',
      'pending',
      NOW()
    );
  END IF;

  RETURN QUERY SELECT v_org_id, v_status;
END;
$$;

CREATE OR REPLACE FUNCTION calculate_unit_status(p_unit_id UUID)
RETURNS TEXT AS $$
DECLARE
  unit_record RECORD;
BEGIN
  SELECT * INTO unit_record FROM units WHERE id = p_unit_id;

  IF unit_record.total_months IS NOT NULL AND unit_record.months_paid >= unit_record.total_months THEN
    RETURN 'fully_paid';
  END IF;

  IF unit_record.days_late > 60 THEN
    RETURN 'critical';
  END IF;

  IF unit_record.days_late > 30 THEN
    RETURN 'overdue';
  END IF;

  IF unit_record.days_late > 0 THEN
    RETURN 'at_risk';
  END IF;

  IF unit_record.customer_id IS NOT NULL THEN
    RETURN 'in_payment_cycle';
  END IF;

  RETURN 'available';
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_days_late(p_as_of_date DATE DEFAULT CURRENT_DATE)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM set_config('row_security', 'off', true);

  UPDATE units u
  SET
    days_late = COALESCE((
      SELECT MAX(p_as_of_date - ps.due_date)
      FROM payment_schedules ps
      WHERE ps.unit_id = u.id
        AND ps.status IN ('unpaid', 'partial', 'overdue')
        AND ps.due_date < p_as_of_date
    ), 0),
    arrears = COALESCE((
      SELECT SUM(
        CASE
          WHEN ps.status = 'partial' THEN ps.amount - COALESCE(ps.partial_amount, 0)
          ELSE ps.amount
        END
      )
      FROM payment_schedules ps
      WHERE ps.unit_id = u.id
        AND ps.status IN ('unpaid', 'partial', 'overdue')
        AND ps.due_date < p_as_of_date
    ), 0),
    next_due_date = (
      SELECT MIN(ps.due_date)
      FROM payment_schedules ps
      WHERE ps.unit_id = u.id
        AND ps.status IN ('unpaid', 'partial', 'overdue')
    ),
    status = CASE
      WHEN u.status IN ('reserved', 'move_in_scheduled', 'move_in_confirmed') THEN u.status
      WHEN u.customer_id IS NULL THEN 'available'
      ELSE calculate_unit_status(u.id)
    END,
    updated_at = NOW()
  WHERE u.customer_id IS NOT NULL;
END;
$$;

CREATE OR REPLACE FUNCTION record_payment(
  p_unit_id UUID,
  p_amount DECIMAL,
  p_payment_date DATE,
  p_payment_method TEXT,
  p_reference_number TEXT,
  p_notes TEXT,
  p_recorded_by UUID,
  p_as_of_date DATE DEFAULT CURRENT_DATE
)
RETURNS UUID AS $$
DECLARE
  v_payment_id UUID;
  v_remaining_amount DECIMAL := p_amount;
  v_schedule_record RECORD;
  v_applied_months INTEGER[] := '{}';
  v_remaining_for_month DECIMAL;
BEGIN
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

  FOR v_schedule_record IN
    SELECT * FROM payment_schedules
    WHERE unit_id = p_unit_id
      AND status IN ('unpaid', 'partial', 'overdue')
    ORDER BY month_number ASC
  LOOP
    EXIT WHEN v_remaining_amount <= 0;

    v_remaining_for_month := v_schedule_record.amount - COALESCE(v_schedule_record.partial_amount, 0);

    IF v_remaining_amount >= v_remaining_for_month THEN
      UPDATE payment_schedules
      SET
        status = 'paid',
        paid_date = p_payment_date,
        partial_amount = NULL,
        updated_at = NOW()
      WHERE id = v_schedule_record.id;

      v_remaining_amount := v_remaining_amount - v_remaining_for_month;
      v_applied_months := array_append(v_applied_months, v_schedule_record.month_number);
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

  UPDATE payments
  SET applied_to_months = v_applied_months
  WHERE id = v_payment_id;

  UPDATE units
  SET
    months_paid = (
      SELECT COUNT(*) FROM payment_schedules
      WHERE unit_id = p_unit_id AND status = 'paid'
    ),
    last_payment_date = p_payment_date,
    updated_at = NOW()
  WHERE id = p_unit_id;

  PERFORM update_days_late(p_as_of_date);

  RETURN v_payment_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.seed_current_org(
  p_profile TEXT DEFAULT 'standard'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_org_id UUID;
  v_user_id UUID;
  v_role TEXT;
  v_project_id UUID;
  v_financing_program_id UUID;
  v_customer_ids UUID[];
  v_unit_ids UUID[];
  v_today DATE := CURRENT_DATE;
  v_monthly_amount NUMERIC := 25000;
  v_total_months INTEGER := 6;
  v_index INTEGER;
  v_month INTEGER;
  v_unit_id UUID;
BEGIN
  PERFORM set_config('row_security', 'off', true);

  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Unauthorized.';
  END IF;

  v_org_id := public.user_organization_id();
  IF v_org_id IS NULL THEN
    RAISE EXCEPTION 'Organization not found.';
  END IF;

  SELECT role INTO v_role
  FROM users
  WHERE id = v_user_id;

  IF v_role NOT IN ('admin', 'manager') THEN
    RAISE EXCEPTION 'Unauthorized.';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM projects
    WHERE organization_id = v_org_id
      AND code = 'SIM'
  ) THEN
    RAISE EXCEPTION 'Seed already applied for this organization.';
  END IF;

  SELECT id INTO v_financing_program_id
  FROM financing_programs
  WHERE organization_id = v_org_id
  ORDER BY created_at
  LIMIT 1;

  INSERT INTO projects (
    organization_id,
    name,
    code,
    location,
    total_units,
    units_sold,
    units_available,
    created_at,
    updated_at
  )
  VALUES (
    v_org_id,
    'Simulation Project',
    'SIM',
    'Metro Manila',
    0,
    0,
    0,
    NOW(),
    NOW()
  )
  RETURNING id INTO v_project_id;

  WITH customer_rows AS (
    INSERT INTO customers (
      organization_id,
      full_name,
      email,
      phone,
      buyer_type,
      city,
      province,
      created_at,
      updated_at
    )
    VALUES
      (v_org_id, 'Carla Mendoza', 'carla.mendoza+sim@example.com', '+63 917 555 0101', 'individual', 'Makati City', 'Metro Manila', NOW(), NOW()),
      (v_org_id, 'Rafael Cruz', 'rafael.cruz+sim@example.com', '+63 917 555 0102', 'individual', 'Quezon City', 'Metro Manila', NOW(), NOW()),
      (v_org_id, 'Vera Santos', 'vera.santos+sim@example.com', '+63 917 555 0103', 'individual', 'Taguig City', 'Metro Manila', NOW(), NOW())
    RETURNING id
  )
  SELECT array_agg(id) INTO v_customer_ids FROM customer_rows;

  WITH unit_rows AS (
    INSERT INTO units (
      organization_id,
      project_id,
      customer_id,
      financing_program_id,
      block_lot,
      unit_type,
      phase,
      selling_price,
      total_amount,
      monthly_amount,
      total_months,
      months_paid,
      move_in_date,
      payment_start_date,
      status,
      arrears,
      days_late,
      electricity_due,
      water_due,
      garbage_due,
      maintenance_due,
      notes,
      created_at,
      updated_at
    )
    VALUES
      (v_org_id, v_project_id, v_customer_ids[1], v_financing_program_id, 'B1-L01', 'Townhouse', 'Phase 1',
       1500000, 1500000, v_monthly_amount, v_total_months, 2, v_today + INTERVAL '60 days',
       v_today - INTERVAL '30 days', 'in_payment_cycle', 0, 0, 450, 220, 150, 600,
       ARRAY['Simulation account', 'On track'], NOW(), NOW()),
      (v_org_id, v_project_id, v_customer_ids[2], v_financing_program_id, 'B1-L02', 'Townhouse', 'Phase 1',
       1600000, 1600000, v_monthly_amount, v_total_months, 0, v_today + INTERVAL '60 days',
       v_today, 'in_payment_cycle', 0, 0, 450, 220, 150, 600,
       ARRAY['Simulation account', 'New buyer'], NOW(), NOW()),
      (v_org_id, v_project_id, NULL, v_financing_program_id, 'B1-L03', 'Townhouse', 'Phase 1',
       1550000, 1550000, NULL, NULL, 0, NULL, NULL, 'available', 0, 0, 0, 0, 0, 0,
       ARRAY['Simulation inventory'], NOW(), NOW())
    RETURNING id
  )
  SELECT array_agg(id) INTO v_unit_ids FROM unit_rows;

  v_index := 1;
  FOREACH v_unit_id IN ARRAY v_unit_ids
  LOOP
    IF v_index <= 2 THEN
      FOR v_month IN 1..v_total_months LOOP
        INSERT INTO payment_schedules (
          organization_id,
          unit_id,
          month_number,
          month_name,
          due_date,
          amount,
          status,
          paid_date,
          partial_amount,
          created_at,
          updated_at
        )
        VALUES (
          v_org_id,
          v_unit_id,
          v_month,
          to_char(v_today + (v_month - 1) * INTERVAL '1 month', 'Month YYYY'),
          (v_today + (v_month - 1) * INTERVAL '1 month')::date,
          v_monthly_amount,
          CASE WHEN v_index = 1 AND v_month <= 2 THEN 'paid' ELSE 'unpaid' END,
          CASE WHEN v_index = 1 AND v_month <= 2 THEN (v_today + (v_month - 1) * INTERVAL '1 month')::date ELSE NULL END,
          NULL,
          NOW(),
          NOW()
        );
      END LOOP;
    END IF;
    v_index := v_index + 1;
  END LOOP;

  INSERT INTO payments (
    organization_id,
    unit_id,
    customer_id,
    recorded_by,
    amount,
    payment_date,
    payment_method,
    status,
    applied_to_months,
    notes,
    created_at,
    updated_at
  )
  VALUES (
    v_org_id,
    v_unit_ids[1],
    v_customer_ids[1],
    v_user_id,
    v_monthly_amount,
    v_today - INTERVAL '1 month',
    'bank_transfer',
    'completed',
    ARRAY[1],
    'Seeded payment record',
    NOW(),
    NOW()
  );

  INSERT INTO project_announcements (
    organization_id,
    project_id,
    title,
    message,
    status,
    send_to_customers,
    notify_channel,
    publish_at,
    created_by,
    created_at,
    updated_at
  )
  VALUES (
    v_org_id,
    v_project_id,
    'Welcome to your simulation project',
    'This seeded dataset is ready for end-to-end validation. Explore collections, payments, and comms.',
    'published',
    true,
    'sms',
    NOW(),
    v_user_id,
    NOW(),
    NOW()
  );

  INSERT INTO payment_intents (
    organization_id,
    unit_id,
    customer_id,
    amount,
    status,
    provider,
    metadata,
    created_at,
    updated_at
  )
  VALUES (
    v_org_id,
    v_unit_ids[2],
    v_customer_ids[2],
    v_monthly_amount,
    'pending_verification',
    'manual',
    jsonb_build_object(
      'source', 'customer_portal',
      'payment_method', 'bank_transfer',
      'reference_number', 'SIM-TRX-001',
      'notes', 'Seeded payment proof for approval.'
    ),
    NOW(),
    NOW()
  );

  PERFORM update_days_late(v_today);

  UPDATE projects
  SET
    total_units = 3,
    units_sold = 2,
    units_available = 1,
    updated_at = NOW()
  WHERE id = v_project_id;

  RETURN jsonb_build_object(
    'organization_id', v_org_id,
    'project_id', v_project_id,
    'customers_created', array_length(v_customer_ids, 1),
    'units_created', array_length(v_unit_ids, 1),
    'profile', p_profile
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.audit_payment_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  v_user_id := COALESCE(NEW.recorded_by, auth.uid());

  INSERT INTO activity_logs (
    organization_id,
    user_id,
    action,
    entity_type,
    entity_id,
    changes
  )
  VALUES (
    NEW.organization_id,
    v_user_id,
    'payment_recorded',
    'payment',
    NEW.id,
    jsonb_build_object(
      'amount', NEW.amount,
      'payment_date', NEW.payment_date,
      'payment_method', NEW.payment_method,
      'reference_number', NEW.reference_number,
      'unit_id', NEW.unit_id,
      'customer_id', NEW.customer_id
    )
  );

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.audit_unit_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    v_user_id := auth.uid();

    INSERT INTO activity_logs (
      organization_id,
      user_id,
      action,
      entity_type,
      entity_id,
      changes
    )
    VALUES (
      NEW.organization_id,
      v_user_id,
      'unit_status_changed',
      'unit',
      NEW.id,
      jsonb_build_object(
        'from', OLD.status,
        'to', NEW.status
      )
    );
  END IF;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.audit_document_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  v_user_id := COALESCE(NEW.uploaded_by, auth.uid());

  INSERT INTO activity_logs (
    organization_id,
    user_id,
    action,
    entity_type,
    entity_id,
    changes
  )
  VALUES (
    NEW.organization_id,
    v_user_id,
    'document_uploaded',
    'document',
    NEW.id,
    jsonb_build_object(
      'unit_id', NEW.unit_id,
      'payment_id', NEW.payment_id,
      'document_type', NEW.document_type,
      'file_name', NEW.file_name,
      'storage_path', NEW.storage_path
    )
  );

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.audit_document_delete()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  v_user_id := auth.uid();

  INSERT INTO activity_logs (
    organization_id,
    user_id,
    action,
    entity_type,
    entity_id,
    changes
  )
  VALUES (
    OLD.organization_id,
    v_user_id,
    'document_deleted',
    'document',
    OLD.id,
    jsonb_build_object(
      'unit_id', OLD.unit_id,
      'payment_id', OLD.payment_id,
      'document_type', OLD.document_type,
      'file_name', OLD.file_name,
      'storage_path', OLD.storage_path
    )
  );

  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS audit_payment_insert ON payments;
CREATE TRIGGER audit_payment_insert
AFTER INSERT ON payments
FOR EACH ROW
EXECUTE FUNCTION public.audit_payment_insert();

DROP TRIGGER IF EXISTS audit_unit_status_change ON units;
CREATE TRIGGER audit_unit_status_change
AFTER UPDATE OF status ON units
FOR EACH ROW
EXECUTE FUNCTION public.audit_unit_status_change();

DROP TRIGGER IF EXISTS audit_document_insert ON documents;
CREATE TRIGGER audit_document_insert
AFTER INSERT ON documents
FOR EACH ROW
EXECUTE FUNCTION public.audit_document_insert();

DROP TRIGGER IF EXISTS audit_document_delete ON documents;
CREATE TRIGGER audit_document_delete
AFTER DELETE ON documents
FOR EACH ROW
EXECUTE FUNCTION public.audit_document_delete();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_org_id UUID;
  v_full_name TEXT;
  v_org_name TEXT;
  v_slug_base TEXT;
  v_slug TEXT;
  v_org_code TEXT;
  v_join_code TEXT;
  v_role TEXT;
  v_status TEXT;
BEGIN
  PERFORM set_config('row_security', 'off', true);

  v_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email, 'New User');
  v_join_code := NULLIF(NEW.raw_user_meta_data->>'join_org_code', '');

  IF v_join_code IS NOT NULL THEN
    v_join_code := upper(trim(v_join_code));
    SELECT id INTO v_org_id
    FROM organizations
    WHERE org_code = v_join_code
    LIMIT 1;

    IF v_org_id IS NULL THEN
      RAISE EXCEPTION 'Organization not found.';
    END IF;

    v_role := 'viewer';
    v_status := 'pending';
  ELSE
    v_org_name := COALESCE(
      NEW.raw_user_meta_data->>'organization_name',
      split_part(NEW.email, '@', 1),
      'New Organization'
    );

    v_slug_base := lower(regexp_replace(v_org_name, '[^a-z0-9]+', '-', 'g'));
    v_slug_base := trim(both '-' from v_slug_base);
    IF v_slug_base = '' THEN
      v_slug_base := 'org';
    END IF;
    v_slug := v_slug_base || '-' || substr(replace(NEW.id::text, '-', ''), 1, 6);
    v_org_code := public.generate_org_code();

    INSERT INTO organizations (name, slug, org_code, subscription_tier, subscription_status)
    VALUES (v_org_name, v_slug, v_org_code, 'trial', 'active')
    RETURNING id INTO v_org_id;
    v_role := 'admin';
    v_status := 'active';
  END IF;

  INSERT INTO public.users (
    id,
    organization_id,
    email,
    full_name,
    role,
    status,
    approved_at,
    approved_by
  )
  VALUES (
    NEW.id,
    v_org_id,
    NEW.email,
    v_full_name,
    v_role,
    v_status,
    CASE WHEN v_status = 'active' THEN NOW() ELSE NULL END,
    NULL
  );

  IF v_status = 'pending' THEN
    INSERT INTO org_join_requests (
      organization_id,
      user_id,
      email,
      full_name,
      role_requested,
      status,
      created_at
    )
    VALUES (
      v_org_id,
      NEW.id,
      NEW.email,
      v_full_name,
      'viewer',
      'pending',
      NOW()
    );
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

CREATE OR REPLACE FUNCTION public.prevent_last_admin_demotion()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_admin_count INTEGER;
BEGIN
  PERFORM set_config('row_security', 'off', true);

  IF OLD.role = 'admin' AND NEW.role <> 'admin' THEN
    SELECT COUNT(*) INTO v_admin_count
    FROM users
    WHERE organization_id = OLD.organization_id
      AND role = 'admin'
      AND id <> OLD.id;

    IF v_admin_count <= 0 THEN
      RAISE EXCEPTION 'Cannot demote the last admin in the organization';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_users_prevent_last_admin ON public.users;
CREATE TRIGGER on_users_prevent_last_admin
BEFORE UPDATE OF role ON public.users
FOR EACH ROW EXECUTE PROCEDURE public.prevent_last_admin_demotion();

CREATE OR REPLACE FUNCTION public.create_portal_user_for_unit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_email TEXT;
  v_phone TEXT;
BEGIN
  PERFORM set_config('row_security', 'off', true);

  SELECT c.email, c.phone
  INTO v_email, v_phone
  FROM customers c
  WHERE c.id = NEW.customer_id;

  INSERT INTO customer_portal_users (
    organization_id,
    unit_id,
    customer_id,
    email,
    phone,
    hashed_pin,
    must_change_pin,
    pin_set_at,
    is_active,
    created_at,
    updated_at
  )
  VALUES (
    NEW.organization_id,
    NEW.id,
    NEW.customer_id,
    v_email,
    v_phone,
    extensions.crypt('123456', extensions.gen_salt('bf')),
    true,
    NULL,
    true,
    NOW(),
    NOW()
  )
  ON CONFLICT (organization_id, unit_id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_units_create_portal_user ON public.units;
CREATE TRIGGER on_units_create_portal_user
AFTER INSERT ON public.units
FOR EACH ROW EXECUTE PROCEDURE public.create_portal_user_for_unit();

DROP FUNCTION IF EXISTS public.customer_portal_login(TEXT, TEXT);
CREATE OR REPLACE FUNCTION public.customer_portal_login(
  p_org_slug TEXT,
  p_project_id UUID,
  p_unit_number TEXT,
  p_pin TEXT
)
RETURNS TABLE(success BOOLEAN, unit_id UUID, session_token UUID, must_change_pin BOOLEAN, error TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_unit_id UUID;
  v_org_id UUID;
  v_portal_id UUID;
  v_hash TEXT;
  v_locked_until TIMESTAMPTZ;
  v_failed INTEGER;
  v_session_token UUID;
  v_must_change_pin BOOLEAN;
BEGIN
  PERFORM set_config('row_security', 'off', true);

  IF p_org_slug IS NULL OR trim(p_org_slug) = ''
     OR p_project_id IS NULL
     OR p_unit_number IS NULL OR trim(p_unit_number) = ''
     OR p_pin IS NULL OR p_pin !~ '^[0-9]{6}$' THEN
    RETURN QUERY SELECT false, NULL::UUID, NULL::UUID, false, 'Invalid credentials';
    RETURN;
  END IF;

  SELECT u.id,
         u.organization_id,
         cpu.id,
         cpu.hashed_pin,
         cpu.locked_until,
         cpu.failed_attempts,
         cpu.must_change_pin
  INTO v_unit_id,
       v_org_id,
       v_portal_id,
       v_hash,
       v_locked_until,
       v_failed,
       v_must_change_pin
  FROM organizations o
  JOIN projects p ON p.organization_id = o.id
  JOIN units u ON u.project_id = p.id
  JOIN customer_portal_users cpu ON cpu.unit_id = u.id
  WHERE o.slug = lower(trim(p_org_slug))
    AND p.id = p_project_id
    AND upper(u.block_lot) = upper(trim(p_unit_number))
    AND cpu.is_active = true
  LIMIT 1;

  IF v_unit_id IS NULL OR v_hash IS NULL THEN
    RETURN QUERY SELECT false, NULL::UUID, NULL::UUID, false, 'Invalid credentials';
    RETURN;
  END IF;

  IF v_locked_until IS NOT NULL AND v_locked_until > NOW() THEN
    RETURN QUERY SELECT false, NULL::UUID, NULL::UUID, false, 'Account locked. Try again later.';
    RETURN;
  END IF;

  IF extensions.crypt(p_pin, v_hash) <> v_hash THEN
    v_failed := COALESCE(v_failed, 0) + 1;

    UPDATE customer_portal_users
    SET
      failed_attempts = v_failed,
      locked_until = CASE WHEN v_failed >= 5 THEN NOW() + INTERVAL '15 minutes' ELSE NULL END,
      updated_at = NOW()
    WHERE id = v_portal_id;

    INSERT INTO activity_logs (
      organization_id,
      user_id,
      action,
      entity_type,
      entity_id,
      changes
    )
    VALUES (
      v_org_id,
      NULL,
      'customer_portal_login_failed',
      'unit',
      v_unit_id,
      jsonb_build_object('attempts', v_failed)
    );

    RETURN QUERY SELECT
      false,
      NULL::UUID,
      NULL::UUID,
      false,
      CASE WHEN v_failed >= 5 THEN 'Account locked. Try again later.' ELSE 'Invalid credentials' END;
    RETURN;
  END IF;

  v_session_token := extensions.gen_random_uuid();
  INSERT INTO customer_portal_sessions (id, unit_id, expires_at)
  VALUES (v_session_token, v_unit_id, NOW() + INTERVAL '7 days');

  UPDATE customer_portal_users
  SET
    failed_attempts = 0,
    locked_until = NULL,
    last_login_at = NOW(),
    updated_at = NOW()
  WHERE id = v_portal_id;

  INSERT INTO activity_logs (
    organization_id,
    user_id,
    action,
    entity_type,
    entity_id,
    changes
  )
  VALUES (
    v_org_id,
    NULL,
    'customer_portal_login_success',
    'unit',
    v_unit_id,
    jsonb_build_object('portal_user_id', v_portal_id)
  );

  RETURN QUERY SELECT true, v_unit_id, v_session_token, COALESCE(v_must_change_pin, false), NULL::TEXT;
END;
$$;

CREATE OR REPLACE FUNCTION public.customer_portal_get_projects_by_slug(
  p_org_slug TEXT
)
RETURNS TABLE(
  id UUID,
  name TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM set_config('row_security', 'off', true);

  IF p_org_slug IS NULL OR trim(p_org_slug) = '' THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT p.id, p.name
  FROM projects p
  JOIN organizations o ON o.id = p.organization_id
  WHERE o.slug = lower(trim(p_org_slug))
  ORDER BY p.name;
END;
$$;

CREATE OR REPLACE FUNCTION public.customer_portal_set_pin(
  p_session_token UUID,
  p_new_pin TEXT
)
RETURNS TABLE(success BOOLEAN, error TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_unit_id UUID;
  v_portal_id UUID;
BEGIN
  PERFORM set_config('row_security', 'off', true);

  IF p_session_token IS NULL THEN
    RETURN QUERY SELECT false, 'Session expired. Please log in again.';
    RETURN;
  END IF;

  IF p_new_pin IS NULL OR p_new_pin !~ '^[0-9]{6}$' THEN
    RETURN QUERY SELECT false, 'PIN must be exactly 6 digits';
    RETURN;
  END IF;

  SELECT cps.unit_id,
         cpu.id
  INTO v_unit_id,
       v_portal_id
  FROM customer_portal_sessions cps
  JOIN customer_portal_users cpu ON cpu.unit_id = cps.unit_id
  WHERE cps.id = p_session_token
    AND cps.expires_at > NOW()
  LIMIT 1;

  IF v_unit_id IS NULL OR v_portal_id IS NULL THEN
    RETURN QUERY SELECT false, 'Session expired. Please log in again.';
    RETURN;
  END IF;

  UPDATE customer_portal_users
  SET
    hashed_pin = extensions.crypt(p_new_pin, extensions.gen_salt('bf')),
    must_change_pin = false,
    pin_set_at = NOW(),
    failed_attempts = 0,
    locked_until = NULL,
    updated_at = NOW()
  WHERE id = v_portal_id;

  RETURN QUERY SELECT true, NULL::TEXT;
END;
$$;

CREATE OR REPLACE FUNCTION public.communications_dispatch_refresh_recipients(
  p_dispatch_id UUID
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_org_id UUID;
  v_filter JSONB;
  v_project_id UUID;
  v_status TEXT;
  v_count INTEGER := 0;
BEGIN
  PERFORM set_config('row_security', 'off', true);

  IF p_dispatch_id IS NULL THEN
    RETURN 0;
  END IF;

  SELECT organization_id, audience_filter
  INTO v_org_id, v_filter
  FROM communications_dispatch
  WHERE id = p_dispatch_id;

  IF v_org_id IS NULL THEN
    RETURN 0;
  END IF;

  v_project_id := NULLIF(v_filter->>'project_id', '')::UUID;
  v_status := NULLIF(v_filter->>'status', '');

  SELECT COUNT(*)
  INTO v_count
  FROM units u
  WHERE u.organization_id = v_org_id
    AND (v_project_id IS NULL OR u.project_id = v_project_id)
    AND (v_status IS NULL OR u.status = v_status);

  UPDATE communications_dispatch
  SET
    recipients_count = v_count,
    updated_at = NOW()
  WHERE id = p_dispatch_id;

  RETURN v_count;
END;
$$;

CREATE OR REPLACE FUNCTION public.communications_dispatch_run(
  p_dispatch_id UUID
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_org_id UUID;
  v_template_id UUID;
  v_channel TEXT;
  v_filter JSONB;
  v_project_id UUID;
  v_status TEXT;
  v_subject TEXT;
  v_message TEXT;
  v_count INTEGER := 0;
BEGIN
  PERFORM set_config('row_security', 'off', true);

  IF p_dispatch_id IS NULL THEN
    RETURN 0;
  END IF;

  SELECT organization_id, template_id, channel, audience_filter, subject, message
  INTO v_org_id, v_template_id, v_channel, v_filter, v_subject, v_message
  FROM communications_dispatch
  WHERE id = p_dispatch_id;

  IF v_org_id IS NULL THEN
    RETURN 0;
  END IF;

  IF v_template_id IS NOT NULL THEN
    SELECT
      COALESCE(config->>'subject', NULL),
      COALESCE(config->>'content', NULL)
    INTO v_subject, v_message
    FROM template_configs
    WHERE id = v_template_id;
  END IF;

  v_project_id := NULLIF(v_filter->>'project_id', '')::UUID;
  v_status := NULLIF(v_filter->>'status', '');

  INSERT INTO communications (
    organization_id,
    unit_id,
    customer_id,
    created_by,
    type,
    subject,
    message,
    status,
    created_at,
    updated_at
  )
  SELECT
    u.organization_id,
    u.id,
    u.customer_id,
    NULL,
    v_channel,
    v_subject,
    v_message,
    'pending',
    NOW(),
    NOW()
  FROM units u
  LEFT JOIN customers c ON c.id = u.customer_id
  WHERE u.organization_id = v_org_id
    AND (v_project_id IS NULL OR u.project_id = v_project_id)
    AND (v_status IS NULL OR u.status = v_status)
    AND u.customer_id IS NOT NULL;

  GET DIAGNOSTICS v_count = ROW_COUNT;

  UPDATE communications_dispatch
  SET
    status = 'sent',
    sent_at = NOW(),
    recipients_count = v_count,
    updated_at = NOW()
  WHERE id = p_dispatch_id;

  RETURN v_count;
END;
$$;

CREATE OR REPLACE FUNCTION public.communications_dispatch_run_due()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_ids UUID[];
  v_total INTEGER := 0;
  v_count INTEGER := 0;
  v_id UUID;
BEGIN
  PERFORM set_config('row_security', 'off', true);

  SELECT array_agg(id)
  INTO v_ids
  FROM communications_dispatch
  WHERE status = 'scheduled'
    AND scheduled_for <= NOW();

  IF v_ids IS NULL THEN
    RETURN 0;
  END IF;

  FOREACH v_id IN ARRAY v_ids
  LOOP
    v_count := public.communications_dispatch_run(v_id);
    v_total := v_total + COALESCE(v_count, 0);
  END LOOP;

  RETURN v_total;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_project_announcement_dispatch()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_dispatch_id UUID;
  v_scheduled_at TIMESTAMPTZ;
  v_status TEXT;
BEGIN
  PERFORM set_config('row_security', 'off', true);

  IF NEW.status <> 'published' OR NEW.send_to_customers IS DISTINCT FROM true THEN
    RETURN NEW;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM communications_dispatch
    WHERE source_type = 'announcement'
      AND source_id = NEW.id
  ) THEN
    RETURN NEW;
  END IF;

  v_scheduled_at := NEW.publish_at;
  v_status := CASE
    WHEN v_scheduled_at IS NOT NULL AND v_scheduled_at > NOW() THEN 'scheduled'
    ELSE 'draft'
  END;

  INSERT INTO communications_dispatch (
    organization_id,
    template_id,
    name,
    channel,
    status,
    scheduled_for,
    recipients_count,
    audience_filter,
    subject,
    message,
    source_type,
    source_id,
    created_at,
    updated_at
  )
  VALUES (
    NEW.organization_id,
    NULL,
    'Announcement: ' || NEW.title,
    COALESCE(NEW.notify_channel, 'sms'),
    v_status,
    v_scheduled_at,
    0,
    jsonb_build_object('project_id', NEW.project_id, 'status', NULL),
    NEW.title,
    NEW.message,
    'announcement',
    NEW.id,
    NOW(),
    NOW()
  )
  RETURNING id INTO v_dispatch_id;

  PERFORM public.communications_dispatch_refresh_recipients(v_dispatch_id);

  IF v_scheduled_at IS NULL OR v_scheduled_at <= NOW() THEN
    PERFORM public.communications_dispatch_run(v_dispatch_id);
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_project_announcements_dispatch ON public.project_announcements;
CREATE TRIGGER on_project_announcements_dispatch
AFTER INSERT OR UPDATE ON public.project_announcements
FOR EACH ROW EXECUTE PROCEDURE public.handle_project_announcement_dispatch();

CREATE OR REPLACE FUNCTION public.handle_project_reminder_dispatch()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_dispatch_id UUID;
  v_scheduled_at TIMESTAMPTZ;
  v_status TEXT;
BEGIN
  PERFORM set_config('row_security', 'off', true);

  IF NEW.status <> 'published' OR NEW.send_to_customers IS DISTINCT FROM true THEN
    RETURN NEW;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM communications_dispatch
    WHERE source_type = 'reminder'
      AND source_id = NEW.id
  ) THEN
    RETURN NEW;
  END IF;

  v_scheduled_at := NEW.remind_at;
  v_status := CASE
    WHEN v_scheduled_at IS NOT NULL AND v_scheduled_at > NOW() THEN 'scheduled'
    ELSE 'draft'
  END;

  INSERT INTO communications_dispatch (
    organization_id,
    template_id,
    name,
    channel,
    status,
    scheduled_for,
    recipients_count,
    audience_filter,
    subject,
    message,
    source_type,
    source_id,
    created_at,
    updated_at
  )
  VALUES (
    NEW.organization_id,
    NULL,
    'Reminder: ' || NEW.title,
    COALESCE(NEW.notify_channel, 'sms'),
    v_status,
    v_scheduled_at,
    0,
    jsonb_build_object('project_id', NEW.project_id, 'status', NULL),
    NEW.title,
    NEW.message,
    'reminder',
    NEW.id,
    NOW(),
    NOW()
  )
  RETURNING id INTO v_dispatch_id;

  PERFORM public.communications_dispatch_refresh_recipients(v_dispatch_id);

  IF v_scheduled_at IS NULL OR v_scheduled_at <= NOW() THEN
    PERFORM public.communications_dispatch_run(v_dispatch_id);
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_project_reminders_dispatch ON public.project_reminders;
CREATE TRIGGER on_project_reminders_dispatch
AFTER INSERT OR UPDATE ON public.project_reminders
FOR EACH ROW EXECUTE PROCEDURE public.handle_project_reminder_dispatch();

CREATE OR REPLACE FUNCTION public.customer_portal_validate_session(
  p_session_token UUID
)
RETURNS TABLE(unit_id UUID, project_id UUID, organization_id UUID, customer_id UUID)
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    u.id,
    u.project_id,
    u.organization_id,
    u.customer_id
  FROM customer_portal_sessions cps
  JOIN units u ON u.id = cps.unit_id
  WHERE cps.id = p_session_token
    AND cps.expires_at > NOW()
  LIMIT 1;
$$;

DROP FUNCTION IF EXISTS public.customer_portal_create_payment_intent(UUID, NUMERIC, TEXT);
DROP FUNCTION IF EXISTS public.customer_portal_create_payment_intent(UUID, NUMERIC, TEXT, TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS public.customer_portal_create_payment_intent(UUID, NUMERIC, TEXT, TEXT, TEXT, TEXT, INTEGER[]);
CREATE OR REPLACE FUNCTION public.customer_portal_create_payment_intent(
  p_session_token UUID,
  p_amount NUMERIC,
  p_payment_method TEXT DEFAULT NULL,
  p_reference_number TEXT DEFAULT NULL,
  p_receipt_url TEXT DEFAULT NULL,
  p_notes TEXT DEFAULT NULL,
  p_month_numbers INTEGER[] DEFAULT NULL
)
RETURNS TABLE(id UUID, amount NUMERIC, status TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_unit_id UUID;
  v_project_id UUID;
  v_org_id UUID;
  v_customer_id UUID;
  v_intent_id UUID;
  v_amount NUMERIC;
  v_expected_amount NUMERIC;
  v_selected_count INTEGER;
  v_month_numbers INTEGER[];
  v_month_names TEXT[];
BEGIN
  PERFORM set_config('row_security', 'off', true);

  IF p_payment_method IS NOT NULL AND length(trim(p_payment_method)) > 40 THEN
    RAISE EXCEPTION 'Invalid payment method.';
  END IF;

  IF p_reference_number IS NOT NULL AND length(trim(p_reference_number)) > 120 THEN
    RAISE EXCEPTION 'Reference number is too long.';
  END IF;

  IF p_notes IS NOT NULL AND length(p_notes) > 500 THEN
    RAISE EXCEPTION 'Notes are too long.';
  END IF;

  IF p_month_numbers IS NOT NULL AND array_length(p_month_numbers, 1) IS NOT NULL THEN
    IF EXISTS (
      SELECT 1 FROM unnest(p_month_numbers) AS m
      WHERE m IS NULL OR m <= 0
    ) THEN
      RAISE EXCEPTION 'Invalid schedule months.';
    END IF;

    IF (
      SELECT COUNT(*) FROM (
        SELECT DISTINCT m FROM unnest(p_month_numbers) AS m
      ) AS distinct_months
    ) <> array_length(p_month_numbers, 1) THEN
      RAISE EXCEPTION 'Duplicate schedule months are not allowed.';
    END IF;
  END IF;

  SELECT unit_id, project_id, organization_id, customer_id
  INTO v_unit_id, v_project_id, v_org_id, v_customer_id
  FROM public.customer_portal_validate_session(p_session_token);

  IF v_unit_id IS NULL THEN
    RAISE EXCEPTION 'Session expired. Please log in again.';
  END IF;

  v_amount := COALESCE(p_amount, 0);
  IF v_amount <= 0 THEN
    RAISE EXCEPTION 'Invalid payment amount.';
  END IF;

  IF p_month_numbers IS NOT NULL AND array_length(p_month_numbers, 1) IS NOT NULL THEN
    SELECT
      array_agg(ps.month_number ORDER BY ps.month_number),
      array_agg(ps.month_name ORDER BY ps.month_number)
    INTO v_month_numbers, v_month_names
    FROM payment_schedules ps
    WHERE ps.unit_id = v_unit_id
      AND ps.month_number = ANY(p_month_numbers)
      AND ps.status IN ('unpaid', 'partial', 'overdue');

    SELECT COUNT(*)
    INTO v_selected_count
    FROM payment_schedules ps
    WHERE ps.unit_id = v_unit_id
      AND ps.month_number = ANY(p_month_numbers)
      AND ps.status IN ('unpaid', 'partial', 'overdue');

    IF v_selected_count <> array_length(p_month_numbers, 1) THEN
      RAISE EXCEPTION 'Selected months are not payable.';
    END IF;

    SELECT SUM(
      CASE
        WHEN ps.status = 'partial' THEN ps.amount - COALESCE(ps.partial_amount, 0)
        ELSE ps.amount
      END
    )
    INTO v_expected_amount
    FROM payment_schedules ps
    WHERE ps.unit_id = v_unit_id
      AND ps.month_number = ANY(p_month_numbers)
      AND ps.status IN ('unpaid', 'partial', 'overdue');

    IF v_expected_amount IS NULL OR v_expected_amount <= 0 THEN
      RAISE EXCEPTION 'Selected months have no outstanding balance.';
    END IF;

    IF v_amount <> v_expected_amount THEN
      RAISE EXCEPTION 'Payment amount must match the selected schedule total.';
    END IF;
  END IF;

  INSERT INTO payment_intents (
    organization_id,
    unit_id,
    customer_id,
    amount,
    status,
    provider,
    metadata,
    created_at,
    updated_at
  )
  VALUES (
    v_org_id,
    v_unit_id,
    v_customer_id,
    v_amount,
    'pending_verification',
    'manual',
    jsonb_build_object(
      'source', 'customer_portal',
      'payment_method', p_payment_method,
      'reference_number', p_reference_number,
      'receipt_url', p_receipt_url,
      'notes', p_notes,
      'month_numbers', v_month_numbers,
      'month_names', v_month_names
    ),
    NOW(),
    NOW()
  )
  RETURNING payment_intents.id INTO v_intent_id;

  INSERT INTO activity_logs (
    organization_id,
    user_id,
    action,
    entity_type,
    entity_id,
    changes
  )
  VALUES (
    v_org_id,
    NULL,
    'payment_intent_created',
    'payment_intent',
    v_intent_id,
    jsonb_build_object(
      'amount', v_amount,
      'month_numbers', v_month_numbers,
      'payment_method', p_payment_method,
      'reference_number', p_reference_number,
      'receipt_url', p_receipt_url
    )
  );

  INSERT INTO notifications (
    organization_id,
    user_id,
    type,
    title,
    body,
    entity_type,
    entity_id,
    created_at
  )
  SELECT
    v_org_id,
    u.id,
    'payment_request',
    'New payment request submitted',
    'A customer payment proof is waiting for approval.',
    'payment_intent',
    v_intent_id,
    NOW()
  FROM users u
  WHERE u.organization_id = v_org_id
    AND u.role IN ('admin', 'manager');

  RETURN QUERY SELECT v_intent_id, v_amount, 'pending_verification';
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_approve_payment_intent(
  p_intent_id UUID,
  p_payment_date DATE DEFAULT CURRENT_DATE
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_user_org_id UUID;
  v_intent RECORD;
  v_method TEXT;
  v_reference TEXT;
  v_notes TEXT;
  v_payment_id UUID;
  v_month_numbers INTEGER[];
  v_expected_amount NUMERIC;
  v_selected_count INTEGER;
BEGIN
  PERFORM set_config('row_security', 'off', true);

  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Unauthorized.';
  END IF;

  SELECT organization_id
  INTO v_user_org_id
  FROM users
  WHERE id = v_user_id
    AND role IN ('admin', 'manager');

  IF v_user_org_id IS NULL THEN
    RAISE EXCEPTION 'Unauthorized.';
  END IF;

  IF p_payment_date IS NULL THEN
    RAISE EXCEPTION 'Payment date is required.';
  END IF;

  IF p_payment_date > CURRENT_DATE THEN
    RAISE EXCEPTION 'Payment date cannot be in the future.';
  END IF;

  SELECT *
  INTO v_intent
  FROM payment_intents
  WHERE id = p_intent_id;

  IF v_intent.id IS NULL THEN
    RAISE EXCEPTION 'Payment intent not found.';
  END IF;

  IF v_intent.organization_id <> v_user_org_id THEN
    RAISE EXCEPTION 'Unauthorized.';
  END IF;

  IF v_intent.status NOT IN ('pending', 'pending_verification') THEN
    RAISE EXCEPTION 'Payment intent already processed.';
  END IF;

  v_method := COALESCE(v_intent.metadata->>'payment_method', 'manual');
  v_method := lower(regexp_replace(trim(v_method), '\\s+', '_', 'g'));
  v_reference := v_intent.metadata->>'reference_number';
  v_notes := v_intent.metadata->>'notes';

  SELECT array_agg(value::int)
  INTO v_month_numbers
  FROM jsonb_array_elements_text(COALESCE(v_intent.metadata->'month_numbers', '[]'::jsonb));

  IF v_month_numbers IS NOT NULL AND array_length(v_month_numbers, 1) IS NOT NULL THEN
    SELECT COUNT(*)
    INTO v_selected_count
    FROM payment_schedules ps
    WHERE ps.unit_id = v_intent.unit_id
      AND ps.month_number = ANY(v_month_numbers)
      AND ps.status IN ('unpaid', 'partial', 'overdue');

    IF v_selected_count <> array_length(v_month_numbers, 1) THEN
      RAISE EXCEPTION 'Selected months are not payable.';
    END IF;

    SELECT SUM(
      CASE
        WHEN ps.status = 'partial' THEN ps.amount - COALESCE(ps.partial_amount, 0)
        ELSE ps.amount
      END
    )
    INTO v_expected_amount
    FROM payment_schedules ps
    WHERE ps.unit_id = v_intent.unit_id
      AND ps.month_number = ANY(v_month_numbers)
      AND ps.status IN ('unpaid', 'partial', 'overdue');

    IF v_expected_amount IS NULL OR v_expected_amount <= 0 THEN
      RAISE EXCEPTION 'Selected months have no outstanding balance.';
    END IF;

    IF v_expected_amount <> v_intent.amount THEN
      RAISE EXCEPTION 'Payment amount does not match selected schedule.';
    END IF;

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
      v_user_id,
      v_intent.amount,
      p_payment_date,
      v_method,
      v_reference,
      v_notes
    FROM units u
    WHERE u.id = v_intent.unit_id
    RETURNING id INTO v_payment_id;

    UPDATE payment_schedules
    SET
      status = 'paid',
      paid_date = p_payment_date,
      partial_amount = NULL,
      updated_at = NOW()
    WHERE unit_id = v_intent.unit_id
      AND month_number = ANY(v_month_numbers);

    UPDATE payments
    SET applied_to_months = v_month_numbers
    WHERE id = v_payment_id;

    UPDATE units
    SET
      months_paid = (
        SELECT COUNT(*) FROM payment_schedules
        WHERE unit_id = v_intent.unit_id AND status = 'paid'
      ),
      last_payment_date = p_payment_date,
      updated_at = NOW()
    WHERE id = v_intent.unit_id;

    PERFORM update_days_late(p_payment_date);
  ELSE
    v_payment_id := record_payment(
      v_intent.unit_id,
      v_intent.amount,
      p_payment_date,
      v_method,
      v_reference,
      v_notes,
      v_user_id,
      p_payment_date
    );
  END IF;

  UPDATE payment_intents
  SET
    payment_id = v_payment_id,
    status = 'approved',
    approved_by = v_user_id,
    approved_at = NOW(),
    updated_at = NOW()
  WHERE id = p_intent_id;

  INSERT INTO activity_logs (
    organization_id,
    user_id,
    action,
    entity_type,
    entity_id,
    changes
  )
  VALUES (
    v_intent.organization_id,
    v_user_id,
    'payment_intent_approved',
    'payment_intent',
    p_intent_id,
    jsonb_build_object(
      'payment_id', v_payment_id,
      'amount', v_intent.amount,
      'payment_date', p_payment_date
    )
  );

  IF v_intent.assigned_to IS NOT NULL THEN
    INSERT INTO notifications (
      organization_id,
      user_id,
      type,
      title,
      body,
      entity_type,
      entity_id,
      created_at
    )
    VALUES (
      v_intent.organization_id,
      v_intent.assigned_to,
      'payment_request',
      'Payment request approved',
      'A payment request you handled was approved.',
      'payment_intent',
      p_intent_id,
      NOW()
    );
  END IF;

  UPDATE payment_intents
  SET
    status = 'superseded',
    updated_at = NOW()
  WHERE unit_id = v_intent.unit_id
    AND amount = v_intent.amount
    AND id <> p_intent_id
    AND COALESCE(metadata->'month_numbers', '[]'::jsonb) = COALESCE(v_intent.metadata->'month_numbers', '[]'::jsonb)
    AND status IN ('pending', 'pending_verification');

  RETURN v_payment_id;
END;
$$;

DROP FUNCTION IF EXISTS public.admin_assign_payment_intent(UUID, UUID);
CREATE OR REPLACE FUNCTION public.admin_assign_payment_intent(
  p_intent_id UUID,
  p_assigned_to UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_user_org_id UUID;
  v_intent RECORD;
  v_assigned UUID;
BEGIN
  PERFORM set_config('row_security', 'off', true);

  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Unauthorized.';
  END IF;

  SELECT organization_id
  INTO v_user_org_id
  FROM users
  WHERE id = v_user_id
    AND role IN ('admin', 'manager');

  IF v_user_org_id IS NULL THEN
    RAISE EXCEPTION 'Unauthorized.';
  END IF;

  v_assigned := COALESCE(p_assigned_to, v_user_id);

  SELECT *
  INTO v_intent
  FROM payment_intents
  WHERE id = p_intent_id;

  IF v_intent.id IS NULL THEN
    RAISE EXCEPTION 'Payment intent not found.';
  END IF;

  IF v_intent.organization_id <> v_user_org_id THEN
    RAISE EXCEPTION 'Unauthorized.';
  END IF;

  IF p_assigned_to IS NOT NULL AND NOT EXISTS (
    SELECT 1
    FROM users
    WHERE id = p_assigned_to
      AND organization_id = v_user_org_id
      AND role IN ('admin', 'manager')
  ) THEN
    RAISE EXCEPTION 'Assigned user is not valid.';
  END IF;

  UPDATE payment_intents
  SET
    assigned_to = v_assigned,
    updated_at = NOW()
  WHERE id = p_intent_id;

  INSERT INTO activity_logs (
    organization_id,
    user_id,
    action,
    entity_type,
    entity_id,
    changes
  )
  VALUES (
    v_intent.organization_id,
    v_user_id,
    'payment_intent_assigned',
    'payment_intent',
    p_intent_id,
    jsonb_build_object('assigned_to', v_assigned)
  );

  INSERT INTO notifications (
    organization_id,
    user_id,
    type,
    title,
    body,
    entity_type,
    entity_id,
    created_at
  )
  VALUES (
    v_intent.organization_id,
    v_assigned,
    'payment_request',
    'Payment request assigned to you',
    'A payment request has been assigned to your queue.',
    'payment_intent',
    p_intent_id,
    NOW()
  );

  RETURN p_intent_id;
END;
$$;

DROP FUNCTION IF EXISTS public.admin_reject_payment_intent(UUID);
CREATE OR REPLACE FUNCTION public.admin_reject_payment_intent(
  p_intent_id UUID
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_user_org_id UUID;
  v_intent RECORD;
BEGIN
  PERFORM set_config('row_security', 'off', true);

  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Unauthorized.';
  END IF;

  SELECT organization_id
  INTO v_user_org_id
  FROM users
  WHERE id = v_user_id
    AND role IN ('admin', 'manager');

  IF v_user_org_id IS NULL THEN
    RAISE EXCEPTION 'Unauthorized.';
  END IF;

  SELECT *
  INTO v_intent
  FROM payment_intents
  WHERE id = p_intent_id;

  IF v_intent.id IS NULL THEN
    RAISE EXCEPTION 'Payment intent not found.';
  END IF;

  IF v_intent.organization_id <> v_user_org_id THEN
    RAISE EXCEPTION 'Unauthorized.';
  END IF;

  IF v_intent.status NOT IN ('pending', 'pending_verification') THEN
    RAISE EXCEPTION 'Payment intent already processed.';
  END IF;

  UPDATE payment_intents
  SET
    status = 'voided',
    approved_by = v_user_id,
    approved_at = NOW(),
    updated_at = NOW()
  WHERE id = p_intent_id;

  INSERT INTO activity_logs (
    organization_id,
    user_id,
    action,
    entity_type,
    entity_id,
    changes
  )
  VALUES (
    v_intent.organization_id,
    v_user_id,
    'payment_intent_rejected',
    'payment_intent',
    p_intent_id,
    jsonb_build_object('status', 'voided')
  );

  IF v_intent.assigned_to IS NOT NULL THEN
    INSERT INTO notifications (
      organization_id,
      user_id,
      type,
      title,
      body,
      entity_type,
      entity_id,
      created_at
    )
    VALUES (
      v_intent.organization_id,
      v_intent.assigned_to,
      'payment_request',
      'Payment request rejected',
      'A payment request you handled was rejected.',
      'payment_intent',
      p_intent_id,
      NOW()
    );
  END IF;

  RETURN p_intent_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.customer_portal_get_unit(
  p_session_token UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_unit_id UUID;
  v_project_id UUID;
  v_org_id UUID;
  v_customer_id UUID;
  v_result JSONB;
BEGIN
  SELECT unit_id, project_id, organization_id, customer_id
  INTO v_unit_id, v_project_id, v_org_id, v_customer_id
  FROM public.customer_portal_validate_session(p_session_token);

  IF v_unit_id IS NULL THEN
    RETURN NULL;
  END IF;

  SELECT jsonb_build_object(
    'id', u.id,
    'block_lot', u.block_lot,
    'unit_type', u.unit_type,
    'phase', u.phase,
    'selling_price', u.selling_price,
    'status', u.status,
    'move_in_date', u.move_in_date,
    'project', jsonb_build_object('id', p.id, 'name', p.name),
    'customer', CASE
      WHEN c.id IS NULL THEN NULL
      ELSE jsonb_build_object('id', c.id, 'full_name', c.full_name, 'phone', c.phone)
    END,
    'payment_terms', jsonb_build_object(
      'total_months', u.total_months,
      'months_paid', u.months_paid,
      'monthly_amount', u.monthly_amount,
      'next_due_date', u.next_due_date,
      'arrears', u.arrears,
      'days_late', u.days_late
    ),
    'property_management', jsonb_build_object(
      'electricity_due', u.electricity_due,
      'water_due', u.water_due,
      'garbage_due', u.garbage_due,
      'maintenance_due', u.maintenance_due,
      'last_payment_date', u.last_payment_date
    ),
    'schedule', (
      SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'month_name', ps.month_name,
        'due_date', ps.due_date,
        'amount', ps.amount,
        'status', ps.status,
        'paid_date', ps.paid_date,
        'partial_amount', ps.partial_amount,
        'month_number', ps.month_number
      ) ORDER BY ps.month_number), '[]'::jsonb)
      FROM payment_schedules ps
      WHERE ps.unit_id = u.id
    )
  )
  INTO v_result
  FROM units u
  JOIN projects p ON p.id = u.project_id
  LEFT JOIN customers c ON c.id = u.customer_id
  WHERE u.id = v_unit_id
  LIMIT 1;

  RETURN v_result;
END;
$$;

CREATE OR REPLACE FUNCTION public.customer_portal_get_payments(
  p_session_token UUID
)
RETURNS TABLE(
  id UUID,
  payment_date DATE,
  amount NUMERIC,
  payment_method TEXT,
  reference_number TEXT,
  status TEXT,
  notes TEXT
)
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    p.id,
    p.payment_date,
    p.amount,
    p.payment_method,
    p.reference_number,
    p.status,
    p.notes
  FROM payments p
  JOIN public.customer_portal_validate_session(p_session_token) s
    ON s.unit_id = p.unit_id
  ORDER BY p.payment_date DESC;
$$;

CREATE OR REPLACE FUNCTION public.customer_portal_get_documents(
  p_session_token UUID
)
RETURNS TABLE(
  id UUID,
  file_name TEXT,
  file_type TEXT,
  file_size INTEGER,
  storage_path TEXT,
  document_type TEXT,
  created_at TIMESTAMPTZ
)
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    d.id,
    d.file_name,
    d.file_type,
    d.file_size,
    d.storage_path,
    d.document_type,
    d.created_at
  FROM documents d
  JOIN public.customer_portal_validate_session(p_session_token) s
    ON s.unit_id = d.unit_id
  ORDER BY d.created_at DESC;
$$;

CREATE OR REPLACE FUNCTION public.customer_portal_get_announcements(
  p_session_token UUID
)
RETURNS TABLE(
  id UUID,
  title TEXT,
  message TEXT,
  status TEXT,
  publish_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ
)
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    a.id,
    a.title,
    a.message,
    a.status,
    a.publish_at,
    a.expires_at,
    a.created_at
  FROM project_announcements a
  JOIN public.customer_portal_validate_session(p_session_token) s
    ON s.project_id = a.project_id
  WHERE a.status = 'published'
  ORDER BY a.publish_at DESC NULLS LAST, a.created_at DESC;
$$;

CREATE OR REPLACE FUNCTION public.customer_portal_get_reminders(
  p_session_token UUID
)
RETURNS TABLE(
  id UUID,
  title TEXT,
  message TEXT,
  status TEXT,
  remind_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ
)
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    r.id,
    r.title,
    r.message,
    r.status,
    r.remind_at,
    r.expires_at,
    r.created_at
  FROM project_reminders r
  JOIN public.customer_portal_validate_session(p_session_token) s
    ON s.project_id = r.project_id
  WHERE r.status = 'published'
  ORDER BY r.remind_at DESC NULLS LAST, r.created_at DESC;
$$;

CREATE OR REPLACE FUNCTION public.customer_portal_get_feedback(
  p_session_token UUID
)
RETURNS TABLE(
  id UUID,
  subject TEXT,
  message TEXT,
  status TEXT,
  created_at TIMESTAMPTZ
)
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    f.id,
    f.subject,
    f.message,
    f.status,
    f.created_at
  FROM project_feedback f
  JOIN public.customer_portal_validate_session(p_session_token) s
    ON s.unit_id = f.unit_id
  ORDER BY f.created_at DESC;
$$;

CREATE OR REPLACE FUNCTION public.customer_portal_create_feedback(
  p_session_token UUID,
  p_subject TEXT,
  p_message TEXT
)
RETURNS TABLE(
  id UUID,
  subject TEXT,
  message TEXT,
  status TEXT,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_unit_id UUID;
  v_project_id UUID;
  v_org_id UUID;
  v_customer_id UUID;
  v_id UUID;
  v_subject TEXT;
  v_message TEXT;
BEGIN
  SELECT unit_id, project_id, organization_id, customer_id
  INTO v_unit_id, v_project_id, v_org_id, v_customer_id
  FROM public.customer_portal_validate_session(p_session_token);

  IF v_unit_id IS NULL THEN
    RAISE EXCEPTION 'Session expired. Please log in again.';
  END IF;

  v_subject := trim(COALESCE(p_subject, ''));
  v_message := trim(COALESCE(p_message, ''));

  IF v_subject = '' THEN
    RAISE EXCEPTION 'Subject is required.';
  END IF;

  IF v_message = '' THEN
    RAISE EXCEPTION 'Message is required.';
  END IF;

  IF length(v_subject) > 120 THEN
    RAISE EXCEPTION 'Subject is too long.';
  END IF;

  IF length(v_message) > 2000 THEN
    RAISE EXCEPTION 'Message is too long.';
  END IF;

  INSERT INTO project_feedback (
    organization_id,
    project_id,
    unit_id,
    customer_id,
    subject,
    message,
    status
  )
  VALUES (
    v_org_id,
    v_project_id,
    v_unit_id,
    v_customer_id,
    v_subject,
    v_message,
    'new'
  )
  RETURNING id INTO v_id;

  RETURN QUERY
  SELECT f.id, f.subject, f.message, f.status, f.created_at
  FROM project_feedback f
  WHERE f.id = v_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.customer_portal_get_defects(
  p_session_token UUID
)
RETURNS TABLE(
  id UUID,
  title TEXT,
  description TEXT,
  status TEXT,
  severity TEXT,
  reported_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ
)
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    d.id,
    d.title,
    d.description,
    d.status,
    d.severity,
    d.reported_at,
    d.resolved_at
  FROM unit_defects d
  JOIN public.customer_portal_validate_session(p_session_token) s
    ON s.unit_id = d.unit_id
  ORDER BY d.reported_at DESC;
$$;

DROP FUNCTION IF EXISTS public.health_check();
CREATE OR REPLACE FUNCTION public.health_check()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_org_count BIGINT := 0;
  v_unit_count BIGINT := 0;
  v_payment_count BIGINT := 0;
  v_policy_count BIGINT := 0;
  v_latest_payment_date TIMESTAMPTZ;
  v_db_version TEXT;
BEGIN
  PERFORM set_config('row_security', 'off', true);

  SELECT COUNT(*) INTO v_org_count FROM organizations;
  SELECT COUNT(*) INTO v_unit_count FROM units;
  SELECT COUNT(*) INTO v_payment_count FROM payments;
  SELECT MAX(payment_date) INTO v_latest_payment_date FROM payments;
  SELECT COUNT(*) INTO v_policy_count FROM pg_policies WHERE schemaname = 'public';
  v_db_version := current_setting('server_version', true);

  RETURN jsonb_build_object(
    'status', 'ok',
    'timestamp', NOW(),
    'app', jsonb_build_object('status', 'ok'),
    'database', jsonb_build_object(
      'version', v_db_version,
      'organizations', v_org_count,
      'units', v_unit_count,
      'payments', v_payment_count,
      'latest_payment_date', v_latest_payment_date
    ),
    'rls', jsonb_build_object(
      'policies', v_policy_count,
      'has_policies', v_policy_count > 0
    )
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.get_join_request_status()
RETURNS TABLE(status TEXT, org_name TEXT, org_code TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  PERFORM set_config('row_security', 'off', true);
  v_user_id := auth.uid();

  IF v_user_id IS NULL THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT
    u.status,
    o.name,
    o.org_code
  FROM users u
  LEFT JOIN organizations o ON o.id = u.organization_id
  WHERE u.id = v_user_id
  LIMIT 1;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_approve_join_request(
  p_request_id UUID,
  p_role TEXT DEFAULT 'viewer'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_role TEXT;
  v_request RECORD;
BEGIN
  PERFORM set_config('row_security', 'off', true);

  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Unauthorized.';
  END IF;

  SELECT role INTO v_role
  FROM users
  WHERE id = v_user_id;

  IF v_role NOT IN ('admin', 'manager') THEN
    RAISE EXCEPTION 'Unauthorized.';
  END IF;

  SELECT *
  INTO v_request
  FROM org_join_requests
  WHERE id = p_request_id;

  IF v_request.id IS NULL THEN
    RAISE EXCEPTION 'Join request not found.';
  END IF;

  IF v_request.status <> 'pending' THEN
    RAISE EXCEPTION 'Join request already processed.';
  END IF;

  IF v_role = 'manager' AND p_role = 'admin' THEN
    RAISE EXCEPTION 'Unauthorized.';
  END IF;

  UPDATE users
  SET
    status = 'active',
    role = p_role,
    approved_by = v_user_id,
    approved_at = NOW(),
    updated_at = NOW()
  WHERE id = v_request.user_id;

  UPDATE org_join_requests
  SET
    status = 'approved',
    role_requested = p_role,
    approved_by = v_user_id,
    approved_at = NOW()
  WHERE id = p_request_id;

  INSERT INTO activity_logs (
    organization_id,
    user_id,
    action,
    entity_type,
    entity_id,
    changes
  )
  VALUES (
    v_request.organization_id,
    v_user_id,
    'org_join_approved',
    'user',
    v_request.user_id,
    jsonb_build_object('role', p_role)
  );

  RETURN v_request.user_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_reject_join_request(
  p_request_id UUID,
  p_reason TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_role TEXT;
  v_request RECORD;
BEGIN
  PERFORM set_config('row_security', 'off', true);

  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Unauthorized.';
  END IF;

  SELECT role INTO v_role
  FROM users
  WHERE id = v_user_id;

  IF v_role NOT IN ('admin', 'manager') THEN
    RAISE EXCEPTION 'Unauthorized.';
  END IF;

  SELECT *
  INTO v_request
  FROM org_join_requests
  WHERE id = p_request_id;

  IF v_request.id IS NULL THEN
    RAISE EXCEPTION 'Join request not found.';
  END IF;

  IF v_request.status <> 'pending' THEN
    RAISE EXCEPTION 'Join request already processed.';
  END IF;

  UPDATE users
  SET
    status = 'rejected',
    approved_by = v_user_id,
    approved_at = NOW(),
    updated_at = NOW()
  WHERE id = v_request.user_id;

  UPDATE org_join_requests
  SET
    status = 'rejected',
    rejected_by = v_user_id,
    rejected_at = NOW()
  WHERE id = p_request_id;

  INSERT INTO activity_logs (
    organization_id,
    user_id,
    action,
    entity_type,
    entity_id,
    changes
  )
  VALUES (
    v_request.organization_id,
    v_user_id,
    'org_join_rejected',
    'user',
    v_request.user_id,
    jsonb_build_object('reason', p_reason)
  );

  RETURN v_request.user_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_update_user_role(
  p_user_id UUID,
  p_role TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_actor_role TEXT;
  v_target RECORD;
  v_admin_count INTEGER;
BEGIN
  PERFORM set_config('row_security', 'off', true);

  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Unauthorized.';
  END IF;

  SELECT role INTO v_actor_role
  FROM users
  WHERE id = v_user_id;

  IF v_actor_role NOT IN ('admin', 'manager') THEN
    RAISE EXCEPTION 'Unauthorized.';
  END IF;

  SELECT id, organization_id, role
  INTO v_target
  FROM users
  WHERE id = p_user_id;

  IF v_target.id IS NULL THEN
    RAISE EXCEPTION 'User not found.';
  END IF;

  IF v_target.organization_id <> public.user_organization_id() THEN
    RAISE EXCEPTION 'Unauthorized.';
  END IF;

  IF v_target.role = 'admin' AND p_role <> 'admin' THEN
    SELECT COUNT(*) INTO v_admin_count
    FROM users
    WHERE organization_id = v_target.organization_id
      AND role = 'admin'
      AND id <> v_target.id;

    IF v_admin_count <= 0 THEN
      RAISE EXCEPTION 'Cannot demote the last executive in the organization';
    END IF;
  END IF;

  IF v_actor_role = 'manager' THEN
    IF v_target.role <> 'viewer' THEN
      RAISE EXCEPTION 'Unauthorized.';
    END IF;
    IF p_role NOT IN ('viewer', 'manager') THEN
      RAISE EXCEPTION 'Unauthorized.';
    END IF;
  END IF;

  UPDATE users
  SET
    role = p_role,
    updated_at = NOW()
  WHERE id = p_user_id;

  INSERT INTO activity_logs (
    organization_id,
    user_id,
    action,
    entity_type,
    entity_id,
    changes
  )
  VALUES (
    v_target.organization_id,
    v_user_id,
    'user_role_updated',
    'user',
    v_target.id,
    jsonb_build_object('role', p_role)
  );

  RETURN v_target.id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.customer_portal_login(TEXT, UUID, TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.customer_portal_get_projects_by_slug(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.customer_portal_set_pin(UUID, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.customer_portal_create_payment_intent(UUID, NUMERIC, TEXT, TEXT, TEXT, TEXT, INTEGER[]) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_approve_payment_intent(UUID, DATE) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_assign_payment_intent(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_reject_payment_intent(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.customer_portal_get_unit(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.customer_portal_get_payments(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.customer_portal_get_documents(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.customer_portal_get_announcements(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.customer_portal_get_reminders(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.customer_portal_get_feedback(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.customer_portal_get_defects(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.customer_portal_create_feedback(UUID, TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.communications_dispatch_refresh_recipients(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.communications_dispatch_run(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.communications_dispatch_run_due() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.seed_current_org(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.health_check() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.validate_org_code(TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_join_request_status() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_approve_join_request(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_reject_join_request(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_update_user_role(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.ensure_org_codes() TO authenticated;
GRANT EXECUTE ON FUNCTION public.ensure_user_profile() TO authenticated;
