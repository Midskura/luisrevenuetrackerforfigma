import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: 'env.local' });
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

type DbRole = 'admin' | 'manager' | 'viewer';

type ProjectSeed = {
  name: string;
  code: string;
  location: string;
  phases: string[];
  unitCount: number;
};

type CustomerSeed = {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  province: string;
};

type PaymentProfile = 'current' | 'at_risk' | 'overdue' | 'new' | 'fully_paid';

type UnitSeed = {
  projectId: string;
  projectCode: string;
  blockLot: string;
  unitType: string;
  phase: string;
  sellingPrice: number;
  customerId: string | null;
  financingProgramId: string | null;
  paymentTerms: null | {
    totalMonths: number;
    monthlyAmount: number;
    monthsPaid: number;
    startDate: Date;
    profile: PaymentProfile;
  };
};

const formatMonthName = (date: Date) =>
  new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date);

const toIsoDate = (date: Date) => date.toISOString().split('T')[0];

const addMonths = (date: Date, months: number) => {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
};

const chunk = <T,>(items: T[], size: number) => {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
};

const getRunId = () => {
  const now = new Date();
  return now
    .toISOString()
    .replace(/[-:.TZ]/g, '')
    .slice(0, 12);
};

const ensureAuthUser = async (payload: {
  email: string;
  password: string;
  fullName: string;
  orgName: string;
}) => {
  const { data, error } = await supabase.auth.admin.createUser({
    email: payload.email,
    password: payload.password,
    email_confirm: true,
    user_metadata: {
      full_name: payload.fullName,
      organization_name: payload.orgName
    }
  });

  if (error || !data.user) {
    throw new Error(error?.message || `Failed to create auth user ${payload.email}`);
  }

  return data.user;
};

const fetchPublicUser = async (userId: string, retries = 5) => {
  for (let attempt = 0; attempt < retries; attempt += 1) {
    const { data, error } = await supabase
      .from('users')
      .select('id, organization_id, role')
      .eq('id', userId)
      .single();

    if (data && !error) return data as { id: string; organization_id: string; role: DbRole };

    if (attempt < retries - 1) {
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }

  throw new Error(`Public user record not found for auth user ${userId}`);
};

const moveUserToOrg = async (payload: {
  userId: string;
  targetOrgId: string;
  role: DbRole;
}) => {
  const { error: orgError } = await supabase
    .from('users')
    .update({ organization_id: payload.targetOrgId })
    .eq('id', payload.userId);

  if (orgError) {
    throw new Error(orgError.message || `Failed to move user ${payload.userId} to org`);
  }

  const { error: roleError } = await supabase
    .from('users')
    .update({ role: payload.role })
    .eq('id', payload.userId);

  if (roleError) {
    throw new Error(roleError.message || `Failed to update role for ${payload.userId}`);
  }
};

const seedSimulation = async () => {
  const today = new Date();
  const runId = process.env.SEED_RUN_ID ?? getRunId();
  const orgName = process.env.SEED_ORG_NAME ?? 'Nexsys Simulation Group';
  const orgSlug = process.env.SEED_ORG_SLUG ?? `nexsys-sim-${runId}`;
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? `admin+${orgSlug}@nexsys.local`;
  const managerEmail = process.env.SEED_MANAGER_EMAIL ?? `manager+${orgSlug}@nexsys.local`;
  const encoderEmail = process.env.SEED_ENCODER_EMAIL ?? `encoder+${orgSlug}@nexsys.local`;
  const defaultPassword = process.env.SEED_PASSWORD ?? 'ChangeMe123!';

  const adminAuth = await ensureAuthUser({
    email: adminEmail,
    password: defaultPassword,
    fullName: 'Ava Santos',
    orgName
  });

  const adminPublic = await fetchPublicUser(adminAuth.id);
  const orgId = adminPublic.organization_id;

  const { error: orgUpdateError } = await supabase
    .from('organizations')
    .update({
      name: orgName,
      slug: orgSlug,
      subscription_tier: 'premium',
      subscription_status: 'active'
    })
    .eq('id', orgId);

  if (orgUpdateError) {
    throw new Error(orgUpdateError.message || 'Failed to update organization');
  }

  await moveUserToOrg({ userId: adminAuth.id, targetOrgId: orgId, role: 'admin' });

  const extraUsers = [
    {
      email: managerEmail,
      fullName: 'Marco Reyes',
      role: 'manager' as DbRole
    },
    {
      email: encoderEmail,
      fullName: 'Lea Dominguez',
      role: 'viewer' as DbRole
    }
  ];

  for (const user of extraUsers) {
    const authUser = await ensureAuthUser({
      email: user.email,
      password: defaultPassword,
      fullName: user.fullName,
      orgName
    });
    const publicUser = await fetchPublicUser(authUser.id);
    const autoOrgId = publicUser.organization_id;

    await moveUserToOrg({ userId: authUser.id, targetOrgId: orgId, role: user.role });

    if (autoOrgId && autoOrgId !== orgId) {
      await supabase.from('organizations').delete().eq('id', autoOrgId);
    }
  }

  const { data: financingRows, error: financingError } = await supabase
    .from('financing_programs')
    .insert([
      {
        organization_id: orgId,
        name: 'In-House Installment',
        program_type: 'installment',
        terms: { billing_frequency: 'monthly', grace_period_days: 5 }
      },
      {
        organization_id: orgId,
        name: 'Bank Financing - BDO',
        provider: 'BDO',
        program_type: 'bank_financing',
        terms: { billing_frequency: 'monthly', interest_rate: 0.08 }
      },
      {
        organization_id: orgId,
        name: 'Rent-to-Own 24 Months',
        program_type: 'rent_to_own',
        terms: { billing_frequency: 'monthly', term_months: 24 }
      },
      {
        organization_id: orgId,
        name: 'Contractual Rental 12 Months',
        program_type: 'rental_contract',
        terms: { billing_frequency: 'monthly', term_months: 12 }
      }
    ])
    .select('id, program_type');

  if (financingError || !financingRows) {
    throw new Error(financingError?.message || 'Failed to create financing programs');
  }

  const financingByType = financingRows.reduce<Record<string, string>>((acc, row) => {
    acc[row.program_type] = row.id;
    return acc;
  }, {});

  const { data: paymentMethodRows, error: paymentMethodError } = await supabase
    .from('payment_methods')
    .insert([
      {
        organization_id: orgId,
        name: 'Cash',
        method_type: 'cash',
        requires_reference: false
      },
      {
        organization_id: orgId,
        name: 'Bank Transfer',
        method_type: 'bank_transfer',
        provider: 'BPI',
        requires_reference: true
      },
      {
        organization_id: orgId,
        name: 'Bank Financing',
        method_type: 'financing',
        provider: 'BDO',
        requires_reference: true,
        requires_approval: true
      },
      {
        organization_id: orgId,
        name: 'Loan Servicer',
        method_type: 'loan',
        provider: 'PAG-IBIG',
        requires_reference: true
      },
      {
        organization_id: orgId,
        name: 'Rental Auto-Debit',
        method_type: 'auto_debit',
        requires_reference: false
      }
    ])
    .select('id, method_type');

  if (paymentMethodError || !paymentMethodRows) {
    throw new Error(paymentMethodError?.message || 'Failed to create payment methods');
  }

  const paymentMethodByType = paymentMethodRows.reduce<Record<string, string>>((acc, row) => {
    acc[row.method_type] = row.id;
    return acc;
  }, {});

  const projects: ProjectSeed[] = [
    {
      name: 'Vista Verde Residences',
      code: 'VV',
      location: 'Makati City, Metro Manila',
      phases: ['Phase 1', 'Phase 2'],
      unitCount: 12
    },
    {
      name: 'Palm Heights',
      code: 'PH',
      location: 'Quezon City, Metro Manila',
      phases: ['Phase 1', 'Phase 2'],
      unitCount: 12
    },
    {
      name: 'Harbor Point Estates',
      code: 'HP',
      location: 'Cebu City',
      phases: ['Phase 1'],
      unitCount: 10
    }
  ];

  const projectRows = await Promise.all(
    projects.map(async (project) => {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          organization_id: orgId,
          name: project.name,
          code: project.code,
          location: project.location,
          total_units: 0,
          units_sold: 0,
          units_available: 0
        })
        .select()
        .single();

      if (error || !data) {
        throw new Error(error?.message || `Failed to create project ${project.name}`);
      }

      return { seed: project, id: data.id };
    })
  );

  const customers: CustomerSeed[] = [
    {
      fullName: 'Bianca Santos',
      email: `bianca.santos+${runId}@example.com`,
      phone: '+63 917 210 1021',
      city: 'Makati City',
      province: 'Metro Manila'
    },
    {
      fullName: 'Jose Navarro',
      email: `jose.navarro+${runId}@example.com`,
      phone: '+63 917 210 1022',
      city: 'Pasig City',
      province: 'Metro Manila'
    },
    {
      fullName: 'Clara Mendoza',
      email: `clara.mendoza+${runId}@example.com`,
      phone: '+63 917 210 1023',
      city: 'Quezon City',
      province: 'Metro Manila'
    },
    {
      fullName: 'Rafael Tan',
      email: `rafael.tan+${runId}@example.com`,
      phone: '+63 917 210 1024',
      city: 'Cebu City',
      province: 'Cebu'
    },
    {
      fullName: 'Mina Flores',
      email: `mina.flores+${runId}@example.com`,
      phone: '+63 917 210 1025',
      city: 'Baguio City',
      province: 'Benguet'
    },
    {
      fullName: 'Andre Villanueva',
      email: `andre.villanueva+${runId}@example.com`,
      phone: '+63 917 210 1026',
      city: 'Mandaluyong City',
      province: 'Metro Manila'
    },
    {
      fullName: 'Cynthia Cruz',
      email: `cynthia.cruz+${runId}@example.com`,
      phone: '+63 917 210 1027',
      city: 'Davao City',
      province: 'Davao del Sur'
    },
    {
      fullName: 'Renzo Alvarez',
      email: `renzo.alvarez+${runId}@example.com`,
      phone: '+63 917 210 1028',
      city: 'Taguig City',
      province: 'Metro Manila'
    },
    {
      fullName: 'Mae Ramos',
      email: `mae.ramos+${runId}@example.com`,
      phone: '+63 917 210 1029',
      city: 'Iloilo City',
      province: 'Iloilo'
    },
    {
      fullName: 'Julian Soriano',
      email: `julian.soriano+${runId}@example.com`,
      phone: '+63 917 210 1030',
      city: 'Makati City',
      province: 'Metro Manila'
    },
    {
      fullName: 'Isabel Castro',
      email: `isabel.castro+${runId}@example.com`,
      phone: '+63 917 210 1031',
      city: 'Quezon City',
      province: 'Metro Manila'
    },
    {
      fullName: 'Paolo Lim',
      email: `paolo.lim+${runId}@example.com`,
      phone: '+63 917 210 1032',
      city: 'Cebu City',
      province: 'Cebu'
    },
    {
      fullName: 'Erika Uy',
      email: `erika.uy+${runId}@example.com`,
      phone: '+63 917 210 1033',
      city: 'Taguig City',
      province: 'Metro Manila'
    }
  ];

  const customerRows: Array<{ id: string; full_name: string }> = [];
  for (const batch of chunk(customers, 6)) {
    const { data, error } = await supabase
      .from('customers')
      .insert(
        batch.map((customer) => ({
          organization_id: orgId,
          full_name: customer.fullName,
          email: customer.email,
          phone: customer.phone,
          buyer_type: 'individual',
          city: customer.city,
          province: customer.province
        }))
      )
      .select('id, full_name');

    if (error || !data) {
      throw new Error(error?.message || 'Failed to create customers');
    }

    customerRows.push(...data);
  }

  const unitTypes = ['Townhouse', 'Single Detached', 'Loft Condo'];
  const unitSeeds: UnitSeed[] = [];

  projectRows.forEach((projectRow, projectIndex) => {
    const { seed, id: projectId } = projectRow;
    for (let i = 1; i <= seed.unitCount; i += 1) {
      const block = Math.ceil(i / 6);
      const lot = String(i % 6 === 0 ? 6 : i % 6).padStart(2, '0');
      const blockLot = `B${block}-L${lot}`;
      const assigned = i <= Math.round(seed.unitCount * 0.7);
      const customerId = assigned
        ? customerRows[(projectIndex * 5 + i) % customerRows.length].id
        : null;

      const sellingPrice = 1800000 + (i * 75000) + projectIndex * 150000;
      const totalMonths = i % 3 === 0 ? 18 : i % 3 === 1 ? 24 : 30;
      const monthlyAmount = Math.round(sellingPrice / totalMonths);

      let profile: PaymentProfile = 'current';
      let monthsPaid = Math.max(0, totalMonths - (i % 8) - 6);

      if (i % 7 === 0 && assigned) {
        profile = 'fully_paid';
        monthsPaid = totalMonths;
      } else if (i % 5 === 0) {
        profile = 'overdue';
      } else if (i % 4 === 0) {
        profile = 'at_risk';
      } else if (i % 6 === 0) {
        profile = 'new';
        monthsPaid = Math.min(monthsPaid, 2);
      }

      const startOffset = profile === 'fully_paid'
        ? totalMonths
        : profile === 'current'
          ? Math.max(monthsPaid - 1, 1)
          : profile === 'at_risk'
            ? monthsPaid + 1
            : profile === 'overdue'
              ? monthsPaid + 3
              : 1;

      const startDate = addMonths(today, -startOffset);
      let financingProgramId = financingByType.installment;

      if (assigned) {
        if (i % 11 === 0) {
          financingProgramId = financingByType.rental_contract ?? financingProgramId;
        } else if (i % 10 === 0) {
          financingProgramId = financingByType.rent_to_own ?? financingProgramId;
        } else if (i % 9 === 0) {
          financingProgramId = financingByType.bank_financing ?? financingProgramId;
        }
      } else {
        financingProgramId = financingByType.installment ?? null;
      }

      unitSeeds.push({
        projectId,
        projectCode: seed.code,
        blockLot,
        unitType: unitTypes[i % unitTypes.length],
        phase: seed.phases[i % seed.phases.length],
        sellingPrice,
        customerId,
        financingProgramId: financingProgramId ?? null,
        paymentTerms: assigned
          ? {
              totalMonths,
              monthlyAmount,
              monthsPaid,
              startDate,
              profile
            }
          : null
      });
    }
  });

  const unitRows: Array<{ id: string; customer_id: string | null; project_id: string; block_lot: string }> = [];
  for (const batch of chunk(unitSeeds, 20)) {
    const { data, error } = await supabase
      .from('units')
      .insert(
        batch.map((unit) => {
          const payment = unit.paymentTerms;
          const totalAmount = unit.sellingPrice;
          const paidAmount = payment ? payment.monthsPaid * payment.monthlyAmount : 0;
          const balance = Math.max(totalAmount - paidAmount, 0);
          const lastPaymentDate = payment?.monthsPaid
            ? toIsoDate(addMonths(payment.startDate, payment.monthsPaid - 1))
            : null;

          return {
            organization_id: orgId,
            project_id: unit.projectId,
            customer_id: unit.customerId,
            financing_program_id: unit.financingProgramId,
            block_lot: unit.blockLot,
            unit_type: unit.unitType,
            phase: unit.phase,
            selling_price: unit.sellingPrice,
            total_amount: totalAmount,
            balance,
            monthly_amount: payment?.monthlyAmount ?? null,
            total_months: payment?.totalMonths ?? null,
            months_paid: payment?.monthsPaid ?? 0,
            move_in_date: payment ? toIsoDate(addMonths(payment.startDate, 2)) : null,
            payment_start_date: payment ? toIsoDate(payment.startDate) : null,
            next_due_date: null,
            status: unit.customerId ? 'in_payment_cycle' : 'available',
            arrears: 0,
            days_late: 0,
            last_payment_date: lastPaymentDate,
            electricity_due: unit.customerId ? 450 : 0,
            water_due: unit.customerId ? 220 : 0,
            garbage_due: unit.customerId ? 150 : 0,
            maintenance_due: unit.customerId ? 600 : 0,
            notes: unit.customerId ? ['On track', 'Preferred payment channel: bank'] : ['Available inventory']
          };
        })
      )
      .select('id, customer_id, project_id, block_lot');

    if (error || !data) {
      throw new Error(error?.message || 'Failed to create units');
    }

    unitRows.push(...data);
  }

  const unitRowByKey = new Map<string, { id: string; customer_id: string | null; project_id: string }>();
  unitRows.forEach((row) => {
    unitRowByKey.set(`${row.project_id}:${row.block_lot}`, row);
  });

  const scheduleRows: Array<Record<string, unknown>> = [];
  const paymentRows: Array<Record<string, unknown>> = [];

  unitSeeds.forEach((unit, index) => {
    if (!unit.paymentTerms) return;
    const payment = unit.paymentTerms;
    const unitRow = unitRowByKey.get(`${unit.projectId}:${unit.blockLot}`);

    if (!unitRow) return;

    for (let month = 1; month <= payment.totalMonths; month += 1) {
      const dueDate = addMonths(payment.startDate, month - 1);
      let status: string = 'unpaid';
      let paidDate: string | null = null;
      let partialAmount: number | null = null;

      if (month <= payment.monthsPaid) {
        status = 'paid';
        paidDate = toIsoDate(addMonths(payment.startDate, month - 1));
      } else if (month === payment.monthsPaid + 1 && payment.profile !== 'new' && payment.profile !== 'fully_paid') {
        const overdue = dueDate < today;
        status = overdue ? 'overdue' : 'unpaid';
        if (payment.profile === 'overdue' && month % 2 === 0) {
          status = 'partial';
          partialAmount = Math.round(payment.monthlyAmount * 0.45);
        }
      } else if (dueDate < today) {
        status = 'overdue';
      }

      scheduleRows.push({
        organization_id: orgId,
        unit_id: unitRow.id,
        month_name: formatMonthName(dueDate),
        due_date: toIsoDate(dueDate),
        amount: payment.monthlyAmount,
        status,
        paid_date: paidDate,
        partial_amount: partialAmount,
        month_number: month
      });
    }

    if (payment.monthsPaid > 0) {
      const lastPaid = payment.monthsPaid;
      const paidDate = addMonths(payment.startDate, lastPaid - 1);
      paymentRows.push({
        organization_id: orgId,
        unit_id: unitRow.id,
        customer_id: unit.customerId,
        recorded_by: adminAuth.id,
        amount: payment.monthlyAmount,
        payment_date: toIsoDate(paidDate),
        payment_method: 'bank_transfer',
        payment_method_id: paymentMethodByType.bank_transfer ?? null,
        reference_number: `${unit.projectCode}-${unit.blockLot}-P${lastPaid}`,
        status: 'completed',
        applied_to_months: [lastPaid],
        notes: 'Seeded payment history'
      });
    }
  });

  for (const batch of chunk(scheduleRows, 200)) {
    const { error } = await supabase.from('payment_schedules').insert(batch);
    if (error) {
      throw new Error(error.message || 'Failed to create payment schedules');
    }
  }

  for (const batch of chunk(paymentRows, 100)) {
    const { error } = await supabase.from('payments').insert(batch);
    if (error) {
      throw new Error(error.message || 'Failed to create payments');
    }
  }

  const { error: updateDaysError } = await supabase.rpc('update_days_late', {
    p_as_of_date: toIsoDate(today)
  });

  if (updateDaysError) {
    throw new Error(updateDaysError.message || 'Failed to update unit statuses');
  }

  const milestones = projectRows.flatMap((projectRow) => {
    return [
      {
        organization_id: orgId,
        project_id: projectRow.id,
        name: 'Foundation Works',
        description: 'Excavation, pile works, and slab pour',
        status: 'completed',
        progress_percent: 100,
        order_index: 1
      },
      {
        organization_id: orgId,
        project_id: projectRow.id,
        name: 'Structural Build',
        description: 'Main framing and utilities rough-in',
        status: 'in_progress',
        progress_percent: 65,
        order_index: 2
      },
      {
        organization_id: orgId,
        project_id: projectRow.id,
        name: 'Finishes & Turnover',
        description: 'Interior finishes and handover prep',
        status: 'planned',
        progress_percent: 0,
        order_index: 3
      }
    ];
  });

  for (const batch of chunk(milestones, 50)) {
    const { error } = await supabase.from('project_milestones').insert(batch);
    if (error) {
      throw new Error(error.message || 'Failed to create milestones');
    }
  }

  const announcements = projectRows.map((projectRow) => ({
    organization_id: orgId,
    project_id: projectRow.id,
    title: `${projectRow.seed.name} progress update`,
    message: 'Structural works are tracking on schedule. We will share turnover dates next month.',
    status: 'published',
    send_to_customers: true,
    notify_channel: 'sms',
    publish_at: addMonths(today, -1).toISOString(),
    created_by: adminAuth.id
  }));

  const reminders = projectRows.map((projectRow) => ({
    organization_id: orgId,
    project_id: projectRow.id,
    title: 'Monthly payment reminder',
    message: 'Please settle your monthly amortization on or before the 5th to avoid penalties.',
    status: 'published',
    send_to_customers: true,
    notify_channel: 'sms',
    remind_at: addMonths(today, 1).toISOString(),
    created_by: adminAuth.id
  }));

  await supabase.from('project_announcements').insert(announcements);
  await supabase.from('project_reminders').insert(reminders);

  const feedbackRows = unitRows
    .filter((row, idx) => idx % 5 === 0 && row.customer_id)
    .map((row) => ({
      organization_id: orgId,
      project_id: row.project_id,
      unit_id: row.id,
      customer_id: row.customer_id,
      subject: 'Move-in checklist clarification',
      message: 'Please confirm the schedule for unit inspection and key turnover.',
      status: 'new'
    }));

  if (feedbackRows.length > 0) {
    await supabase.from('project_feedback').insert(feedbackRows);
  }

  const defectRows = unitRows
    .filter((row, idx) => idx % 6 === 0)
    .map((row) => ({
      organization_id: orgId,
      unit_id: row.id,
      reported_by: adminAuth.id,
      title: 'Minor paint retouch',
      description: 'Observed uneven paint finish in living room wall. Schedule repaint before turnover.',
      status: 'open',
      severity: 'low'
    }));

  if (defectRows.length > 0) {
    await supabase.from('unit_defects').insert(defectRows);
  }

  const checklistRows = unitRows
    .filter((row, idx) => idx % 4 === 0)
    .flatMap((row) => [
      {
        organization_id: orgId,
        unit_id: row.id,
        label: 'Utilities activated',
        is_required: true,
        is_completed: true,
        completed_at: today.toISOString(),
        completed_by: adminAuth.id,
        order_index: 1
      },
      {
        organization_id: orgId,
        unit_id: row.id,
        label: 'Unit walkthrough completed',
        is_required: true,
        is_completed: false,
        order_index: 2
      }
    ]);

  if (checklistRows.length > 0) {
    await supabase.from('move_in_checklist_items').insert(checklistRows);
  }

  const intentRows = unitRows
    .filter((row, idx) => idx % 7 === 0 && row.customer_id)
    .map((row) => ({
      organization_id: orgId,
      unit_id: row.id,
      customer_id: row.customer_id,
      amount: 25000,
      status: 'pending_verification',
      provider: 'manual',
      assigned_to: adminAuth.id,
      payment_method_id: paymentMethodByType.financing ?? null,
      metadata: {
        source: 'customer_portal',
        payment_method: 'bank_financing',
        reference_number: `${row.id.slice(0, 6)}-TRX`,
        receipt_url: null,
        notes: 'Payment proof submitted for review.'
      }
    }));

  if (intentRows.length > 0) {
    await supabase.from('payment_intents').insert(intentRows);
  }

  const dispatchRows = [
    {
      organization_id: orgId,
      name: 'Bulk payment reminder wave',
      channel: 'sms',
      status: 'sent',
      sent_at: today.toISOString(),
      recipients_count: intentRows.length,
      audience_filter: { status: 'overdue' },
      subject: 'Payment Reminder',
      message: 'Please settle overdue balances to avoid penalties.',
      created_by: adminAuth.id
    },
    {
      organization_id: orgId,
      name: 'Upcoming turnover briefing',
      channel: 'email',
      status: 'scheduled',
      scheduled_for: addMonths(today, 1).toISOString(),
      recipients_count: 0,
      audience_filter: { status: 'in_payment_cycle' },
      subject: 'Turnover briefing',
      message: 'We will host a turnover briefing next month. Watch for the schedule.',
      created_by: adminAuth.id
    }
  ];

  await supabase.from('communications_dispatch').insert(dispatchRows);

  const countsByProject = new Map<string, { sold: number; available: number; total: number }>();
  unitSeeds.forEach((unit) => {
    const entry = countsByProject.get(unit.projectId) || { sold: 0, available: 0, total: 0 };
    entry.total += 1;
    if (unit.customerId) {
      entry.sold += 1;
    } else {
      entry.available += 1;
    }
    countsByProject.set(unit.projectId, entry);
  });

  for (const [projectId, counts] of countsByProject.entries()) {
    await supabase
      .from('projects')
      .update({
        total_units: counts.total,
        units_sold: counts.sold,
        units_available: counts.available
      })
      .eq('id', projectId);
  }

  console.log('Seed complete.');
  console.log(`Org slug: ${orgSlug}`);
  console.log(`Admin: ${adminEmail}`);
  console.log(`Manager: ${managerEmail}`);
  console.log(`Encoder: ${encoderEmail}`);
  console.log(`Password: ${defaultPassword}`);
};

seedSimulation().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
