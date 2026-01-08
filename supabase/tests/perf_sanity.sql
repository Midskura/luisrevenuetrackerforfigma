-- Performance sanity checks for key dashboards and queues.
-- Replace the slug/project/unit values as needed for your org.

BEGIN;

-- Use authenticated role to match app RLS behavior.
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claim.role', 'authenticated', true);

-- Pick a real org admin user before running.
-- SELECT set_config('request.jwt.claim.sub', '<admin-user-uuid>', true);

-- Resolve org/project/unit context.
WITH org AS (
  SELECT id FROM organizations WHERE slug = 'nexsys-estates-a' LIMIT 1
),
project AS (
  SELECT id FROM projects WHERE organization_id = (SELECT id FROM org) LIMIT 1
),
unit AS (
  SELECT id FROM units WHERE organization_id = (SELECT id FROM org) LIMIT 1
)
SELECT
  (SELECT id FROM org) AS org_id,
  (SELECT id FROM project) AS project_id,
  (SELECT id FROM unit) AS unit_id;

-- Dashboard: unit status distribution.
EXPLAIN (ANALYZE, BUFFERS)
SELECT status, COUNT(*) AS total
FROM units
WHERE organization_id = (SELECT id FROM organizations WHERE slug = 'nexsys-estates-a' LIMIT 1)
GROUP BY status;

-- Dashboard: total collected by project.
EXPLAIN (ANALYZE, BUFFERS)
SELECT u.project_id, SUM(p.amount) AS total_collected
FROM payments p
JOIN units u ON u.id = p.unit_id
WHERE u.organization_id = (SELECT id FROM organizations WHERE slug = 'nexsys-estates-a' LIMIT 1)
GROUP BY u.project_id;

-- Collections: overdue schedules by unit.
EXPLAIN (ANALYZE, BUFFERS)
SELECT u.id, u.block_lot, COUNT(*) AS overdue_count
FROM payment_schedules ps
JOIN units u ON u.id = ps.unit_id
WHERE u.organization_id = (SELECT id FROM organizations WHERE slug = 'nexsys-estates-a' LIMIT 1)
  AND ps.status = 'overdue'
GROUP BY u.id, u.block_lot;

-- Payment requests queue.
EXPLAIN (ANALYZE, BUFFERS)
SELECT pi.id, pi.amount, pi.status, u.block_lot, c.full_name
FROM payment_intents pi
JOIN units u ON u.id = pi.unit_id
LEFT JOIN customers c ON c.id = pi.customer_id
WHERE pi.organization_id = (SELECT id FROM organizations WHERE slug = 'nexsys-estates-a' LIMIT 1)
  AND pi.status IN ('pending', 'pending_verification')
ORDER BY pi.created_at DESC;

-- Documents per unit.
EXPLAIN (ANALYZE, BUFFERS)
SELECT d.id, d.document_type, d.created_at
FROM documents d
WHERE d.organization_id = (SELECT id FROM organizations WHERE slug = 'nexsys-estates-a' LIMIT 1)
ORDER BY d.created_at DESC
LIMIT 50;

ROLLBACK;
