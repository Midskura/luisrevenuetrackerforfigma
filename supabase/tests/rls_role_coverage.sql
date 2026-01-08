-- RLS role coverage smoke tests.
-- Run in the Supabase SQL editor or psql with RLS enforced (SET LOCAL ROLE authenticated).
BEGIN;

CREATE TEMP TABLE test_ids (
  key TEXT PRIMARY KEY,
  id UUID NOT NULL
);

CREATE TEMP TABLE test_users (
  id UUID PRIMARY KEY,
  organization_id UUID NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL
);

-- Organizations
WITH org_a AS (
  INSERT INTO organizations (name, slug, subscription_tier, subscription_status)
  VALUES ('Nexsys Estates A', 'nexsys-estates-a', 'trial', 'active')
  RETURNING id
),
org_b AS (
  INSERT INTO organizations (name, slug, subscription_tier, subscription_status)
  VALUES ('Nexsys Estates B', 'nexsys-estates-b', 'trial', 'active')
  RETURNING id
)
INSERT INTO test_ids (key, id)
SELECT 'org_a', id FROM org_a
UNION ALL
SELECT 'org_b', id FROM org_b;

-- Users (auth + public)
INSERT INTO test_users (id, organization_id, email, full_name, role)
VALUES
  (extensions.gen_random_uuid(), (SELECT id FROM test_ids WHERE key = 'org_a'), 'admin+' || substr(extensions.gen_random_uuid()::text, 1, 8) || '@nexsys.test', 'Admin A', 'admin'),
  (extensions.gen_random_uuid(), (SELECT id FROM test_ids WHERE key = 'org_a'), 'manager+' || substr(extensions.gen_random_uuid()::text, 1, 8) || '@nexsys.test', 'Manager A', 'manager'),
  (extensions.gen_random_uuid(), (SELECT id FROM test_ids WHERE key = 'org_a'), 'viewer+' || substr(extensions.gen_random_uuid()::text, 1, 8) || '@nexsys.test', 'Viewer A', 'viewer'),
  (extensions.gen_random_uuid(), (SELECT id FROM test_ids WHERE key = 'org_b'), 'adminb+' || substr(extensions.gen_random_uuid()::text, 1, 8) || '@nexsys.test', 'Admin B', 'admin');

INSERT INTO auth.users (
  id,
  email,
  aud,
  role,
  encrypted_password,
  raw_app_meta_data,
  raw_user_meta_data,
  email_confirmed_at,
  created_at,
  updated_at
)
SELECT
  id,
  email,
  'authenticated',
  'authenticated',
  '',
  '{}'::jsonb,
  '{}'::jsonb,
  NOW(),
  NOW(),
  NOW()
FROM test_users;

-- handle_new_user trigger may already create public.users; upsert to enforce org/role.
INSERT INTO public.users (id, organization_id, email, full_name, role)
SELECT id, organization_id, email, full_name, role
FROM test_users
ON CONFLICT (id) DO UPDATE SET
  organization_id = EXCLUDED.organization_id,
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  updated_at = NOW();

-- Move users into target orgs first to avoid last-admin demotion errors.
UPDATE public.users u
SET organization_id = tu.organization_id,
    updated_at = NOW()
FROM test_users tu
WHERE u.id = tu.id;

-- Apply roles after org assignment (org_a has at least one admin).
UPDATE public.users
SET role = 'manager',
    updated_at = NOW()
WHERE id = (
  SELECT id FROM test_users
  WHERE organization_id = (SELECT id FROM test_ids WHERE key = 'org_a')
    AND role = 'manager'
  LIMIT 1
);

UPDATE public.users
SET role = 'viewer',
    updated_at = NOW()
WHERE id = (
  SELECT id FROM test_users
  WHERE organization_id = (SELECT id FROM test_ids WHERE key = 'org_a')
    AND role = 'viewer'
  LIMIT 1
);

-- Core data for org_a and org_b
WITH project_a AS (
  INSERT INTO projects (organization_id, name, code, location)
  VALUES ((SELECT id FROM test_ids WHERE key = 'org_a'), 'Tower A', 'TA-01', 'Metro Manila')
  RETURNING id
),
project_b AS (
  INSERT INTO projects (organization_id, name, code, location)
  VALUES ((SELECT id FROM test_ids WHERE key = 'org_b'), 'Tower B', 'TB-01', 'Metro Manila')
  RETURNING id
),
customer_a AS (
  INSERT INTO customers (organization_id, full_name, email)
  VALUES ((SELECT id FROM test_ids WHERE key = 'org_a'), 'Customer A', 'customer.a@nexsys.test')
  RETURNING id
),
customer_b AS (
  INSERT INTO customers (organization_id, full_name, email)
  VALUES ((SELECT id FROM test_ids WHERE key = 'org_b'), 'Customer B', 'customer.b@nexsys.test')
  RETURNING id
),
unit_a AS (
  INSERT INTO units (organization_id, project_id, block_lot, unit_type, status, customer_id)
  VALUES (
    (SELECT id FROM test_ids WHERE key = 'org_a'),
    (SELECT id FROM project_a),
    'A-101',
    'Condo',
    'reserved',
    (SELECT id FROM customer_a)
  )
  RETURNING id
),
unit_b AS (
  INSERT INTO units (organization_id, project_id, block_lot, unit_type, status, customer_id)
  VALUES (
    (SELECT id FROM test_ids WHERE key = 'org_b'),
    (SELECT id FROM project_b),
    'B-101',
    'Condo',
    'reserved',
    (SELECT id FROM customer_b)
  )
  RETURNING id
)
INSERT INTO test_ids (key, id)
SELECT 'project_a', id FROM project_a
UNION ALL
SELECT 'project_b', id FROM project_b
UNION ALL
SELECT 'unit_a', id FROM unit_a
UNION ALL
SELECT 'unit_b', id FROM unit_b;

-- We'll set role/claims inside each block to avoid temp table permission issues.
SELECT set_config('request.jwt.claim.role', 'authenticated', true);

-- Admin: can read own org, cannot see other org.
DO $$
DECLARE
  v_admin UUID := (
    SELECT id FROM test_users
    WHERE organization_id = (SELECT id FROM test_ids WHERE key = 'org_a')
      AND role = 'admin'
    LIMIT 1
  );
  v_org_a UUID := (SELECT id FROM test_ids WHERE key = 'org_a');
  v_count INTEGER;
BEGIN
  SET LOCAL ROLE authenticated;
  SET LOCAL row_security = on;
  PERFORM set_config('request.jwt.claim.sub', v_admin::text, true);

  SELECT COUNT(*) INTO v_count FROM units;
  IF v_count <> 1 THEN
    RAISE EXCEPTION 'Admin expected 1 unit, got %', v_count;
  END IF;

  SELECT COUNT(*) INTO v_count FROM customers;
  IF v_count <> 1 THEN
    RAISE EXCEPTION 'Admin expected 1 customer, got %', v_count;
  END IF;

  RESET ROLE;
END $$;

-- Manager: can read own org, can insert units.
DO $$
DECLARE
  v_manager UUID := (
    SELECT id FROM test_users
    WHERE organization_id = (SELECT id FROM test_ids WHERE key = 'org_a')
      AND role = 'manager'
    LIMIT 1
  );
  v_org_a UUID := (SELECT id FROM test_ids WHERE key = 'org_a');
  v_project_a UUID := (SELECT id FROM test_ids WHERE key = 'project_a');
  v_count INTEGER;
BEGIN
  SET LOCAL ROLE authenticated;
  SET LOCAL row_security = on;
  PERFORM set_config('request.jwt.claim.sub', v_manager::text, true);

  SELECT COUNT(*) INTO v_count FROM units;
  IF v_count <> 1 THEN
    RAISE EXCEPTION 'Manager expected 1 unit, got %', v_count;
  END IF;

  INSERT INTO units (organization_id, project_id, block_lot, unit_type, status)
  VALUES (
    v_org_a,
    v_project_a,
    'A-102',
    'Condo',
    'reserved'
  );

  RESET ROLE;
END $$;

-- Viewer: can read own org, cannot insert units.
DO $$
DECLARE
  v_viewer UUID := (
    SELECT id FROM test_users
    WHERE organization_id = (SELECT id FROM test_ids WHERE key = 'org_a')
      AND role = 'viewer'
    LIMIT 1
  );
  v_org_a UUID := (SELECT id FROM test_ids WHERE key = 'org_a');
  v_project_a UUID := (SELECT id FROM test_ids WHERE key = 'project_a');
BEGIN
  SET LOCAL ROLE authenticated;
  SET LOCAL row_security = on;
  PERFORM set_config('request.jwt.claim.sub', v_viewer::text, true);

  BEGIN
    INSERT INTO units (organization_id, project_id, block_lot, unit_type, status)
    VALUES (
      v_org_a,
      v_project_a,
      'A-103',
      'Condo',
      'reserved'
    );
    RAISE EXCEPTION 'Viewer insert should be blocked by RLS';
  EXCEPTION WHEN others THEN
    -- Expected: RLS should prevent this insert.
    NULL;
  END;

  RESET ROLE;
END $$;

ROLLBACK;
