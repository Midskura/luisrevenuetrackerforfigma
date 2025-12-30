export type UnitStatus = 
  | 'Available'
  | 'Reserved'
  | 'Move-in Scheduled'
  | 'Move-in Confirmed'
  | 'In Payment Cycle'
  | 'Overdue'
  | 'At Risk'
  | 'Critical'
  | 'Fully Paid';

export type Unit = {
  id: string;
  blockLot: string;
  unitType: string;
  project: string;
  phase: string;
  sellingPrice: number;
  buyer: {
    name: string;
    contact: string;
  } | null;
  status: UnitStatus;
  moveInDate: string | null;
  paymentTerms: {
    totalMonths: number;
    monthsPaid: number;
    monthlyAmount: number;
    nextDueDate: string | null;
    arrears: number;
    daysLate: number;
  } | null;
  propertyManagement: {
    electricityDue: number;
    waterDue: number;
    garbageDue: number;
    maintenanceDue: number;
    lastPaymentDate: string | null;
  } | null;
  notes: string[];
};

export const PROJECTS = ['Vista Verde', 'Palm Heights', 'Sunrise Homes'];
export const PHASES = ['Phase 1', 'Phase 2', 'Phase 3'];

// Global current date for all calculations (January 15, 2026)
export const CURRENT_DATE = new Date('2026-01-15');

// Generate realistic mock data - Consistent narrative
export const mockUnits: Unit[] = [
  // ========================================
  // FULLY PAID UNITS (9 units) - U001 to U009
  // Payment cycles completed on or before Jan 2026
  // ========================================
  {
    id: 'U001',
    blockLot: 'B1-L05',
    unitType: 'Single Detached',
    project: 'Vista Verde',
    phase: 'Phase 1',
    sellingPrice: 2800000,
    buyer: {
      name: 'Maria Santos',
      contact: '+63 917 123 4567'
    },
    status: 'Fully Paid',
    moveInDate: '2023-02-01', // Started Feb 2023
    paymentTerms: {
      totalMonths: 24,
      monthsPaid: 24, // Completed Jan 2025
      monthlyAmount: 45000,
      nextDueDate: null,
      arrears: 0,
      daysLate: 0
    },
    propertyManagement: {
      electricityDue: 0,
      waterDue: 0,
      garbageDue: 0,
      maintenanceDue: 0,
      lastPaymentDate: '2026-01-05'
    },
    notes: ['Completed payment plan January 2025', 'Good payment history', 'Active HOA member']
  },
  {
    id: 'U002',
    blockLot: 'B2-L12',
    unitType: 'Townhouse',
    project: 'Vista Verde',
    phase: 'Phase 1',
    sellingPrice: 1850000,
    buyer: {
      name: 'Juan Dela Cruz',
      contact: '+63 918 234 5678'
    },
    status: 'Fully Paid',
    moveInDate: '2023-07-01', // Started July 2023
    paymentTerms: {
      totalMonths: 18,
      monthsPaid: 18, // Completed Dec 2024
      monthlyAmount: 32000,
      nextDueDate: null,
      arrears: 0,
      daysLate: 0
    },
    propertyManagement: {
      electricityDue: 0,
      waterDue: 0,
      garbageDue: 0,
      maintenanceDue: 0,
      lastPaymentDate: '2025-12-20'
    },
    notes: ['Completed payment plan December 2024', 'Had some late payments but cleared all']
  },
  {
    id: 'U003',
    blockLot: 'B3-L08',
    unitType: 'Single Detached',
    project: 'Palm Heights',
    phase: 'Phase 2',
    sellingPrice: 3200000,
    buyer: {
      name: 'Ana Reyes',
      contact: '+63 919 345 6789'
    },
    status: 'Fully Paid',
    moveInDate: '2023-04-01',
    paymentTerms: {
      totalMonths: 24,
      monthsPaid: 24, // Completed Mar 2025
      monthlyAmount: 50000,
      nextDueDate: null,
      arrears: 0,
      daysLate: 0
    },
    propertyManagement: {
      electricityDue: 0,
      waterDue: 0,
      garbageDue: 0,
      maintenanceDue: 0,
      lastPaymentDate: '2026-01-10'
    },
    notes: ['Completed March 2025', 'Exemplary payment record']
  },
  {
    id: 'U004',
    blockLot: 'B1-L15',
    unitType: 'Townhouse',
    project: 'Vista Verde',
    phase: 'Phase 1',
    sellingPrice: 1950000,
    buyer: {
      name: 'Roberto Garcia',
      contact: '+63 920 456 7890'
    },
    status: 'Fully Paid',
    moveInDate: '2022-08-01',
    paymentTerms: {
      totalMonths: 18,
      monthsPaid: 18, // Completed Jan 2024
      monthlyAmount: 35000,
      nextDueDate: null,
      arrears: 0,
      daysLate: 0
    },
    propertyManagement: {
      electricityDue: 0,
      waterDue: 0,
      garbageDue: 0,
      maintenanceDue: 0,
      lastPaymentDate: '2026-01-08'
    },
    notes: ['Completed January 2024', 'One of our first buyers', 'Excellent record']
  },
  {
    id: 'U005',
    blockLot: 'B4-L03',
    unitType: 'Single Detached',
    project: 'Sunrise Homes',
    phase: 'Phase 3',
    sellingPrice: 2950000,
    buyer: {
      name: 'Carmen Torres',
      contact: '+63 921 567 8901'
    },
    status: 'Fully Paid',
    moveInDate: '2023-09-01',
    paymentTerms: {
      totalMonths: 18,
      monthsPaid: 18, // Completed Feb 2025
      monthlyAmount: 48000,
      nextDueDate: null,
      arrears: 0,
      daysLate: 0
    },
    propertyManagement: {
      electricityDue: 0,
      waterDue: 0,
      garbageDue: 0,
      maintenanceDue: 0,
      lastPaymentDate: '2025-12-28'
    },
    notes: ['Completed February 2025', 'Always paid ahead of schedule']
  },
  {
    id: 'U006',
    blockLot: 'B2-L20',
    unitType: 'Townhouse',
    project: 'Palm Heights',
    phase: 'Phase 2',
    sellingPrice: 1750000,
    buyer: {
      name: 'Patricia Lim',
      contact: '+63 922 678 9012'
    },
    status: 'Fully Paid',
    moveInDate: '2024-01-01',
    paymentTerms: {
      totalMonths: 12,
      monthsPaid: 12, // Completed Dec 2024
      monthlyAmount: 40000,
      nextDueDate: null,
      arrears: 0,
      daysLate: 0
    },
    propertyManagement: {
      electricityDue: 0,
      waterDue: 0,
      garbageDue: 0,
      maintenanceDue: 0,
      lastPaymentDate: '2026-01-12'
    },
    notes: ['Completed December 2024', 'Short payment term']
  },
  {
    id: 'U007',
    blockLot: 'B3-L14',
    unitType: 'Single Detached',
    project: 'Sunrise Homes',
    phase: 'Phase 3',
    sellingPrice: 3100000,
    buyer: {
      name: 'Michael Tan',
      contact: '+63 923 789 0123'
    },
    status: 'Fully Paid',
    moveInDate: '2023-05-01',
    paymentTerms: {
      totalMonths: 24,
      monthsPaid: 24, // Completed Apr 2025
      monthlyAmount: 52000,
      nextDueDate: null,
      arrears: 0,
      daysLate: 0
    },
    propertyManagement: {
      electricityDue: 0,
      waterDue: 0,
      garbageDue: 0,
      maintenanceDue: 0,
      lastPaymentDate: '2026-01-03'
    },
    notes: ['Completed April 2025', 'Overseas buyer - very reliable']
  },
  {
    id: 'U008',
    blockLot: 'B1-L22',
    unitType: 'Townhouse',
    project: 'Vista Verde',
    phase: 'Phase 1',
    sellingPrice: 1820000,
    buyer: {
      name: 'Sofia Mendoza',
      contact: '+63 924 890 1234'
    },
    status: 'Fully Paid',
    moveInDate: '2024-02-01',
    paymentTerms: {
      totalMonths: 12,
      monthsPaid: 12, // Completed Jan 2025
      monthlyAmount: 38000,
      nextDueDate: null,
      arrears: 0,
      daysLate: 0
    },
    propertyManagement: {
      electricityDue: 0,
      waterDue: 0,
      garbageDue: 0,
      maintenanceDue: 0,
      lastPaymentDate: '2026-01-11'
    },
    notes: ['Completed January 2025', 'Automated payment setup']
  },
  {
    id: 'U009',
    blockLot: 'B5-L07',
    unitType: 'Single Detached',
    project: 'Palm Heights',
    phase: 'Phase 2',
    sellingPrice: 2880000,
    buyer: {
      name: 'David Nguyen',
      contact: '+63 925 901 2345'
    },
    status: 'Fully Paid',
    moveInDate: '2023-11-01',
    paymentTerms: {
      totalMonths: 18,
      monthsPaid: 18, // Completed Apr 2025
      monthlyAmount: 46000,
      nextDueDate: null,
      arrears: 0,
      daysLate: 0
    },
    propertyManagement: {
      electricityDue: 0,
      waterDue: 0,
      garbageDue: 0,
      maintenanceDue: 0,
      lastPaymentDate: '2026-01-07'
    },
    notes: ['Completed April 2025', 'Recommended 2 new buyers']
  },

  // ========================================
  // IN PAYMENT CYCLE - CLEAN (12 units) - U010 to U021
  // All payments before Jan 2026 are paid
  // Varying progress levels
  // ========================================
  {
    id: 'U010',
    blockLot: 'B2-L18',
    unitType: 'Townhouse',
    project: 'Sunrise Homes',
    phase: 'Phase 3',
    sellingPrice: 1920000,
    buyer: {
      name: 'Elena Cruz',
      contact: '+63 926 012 3456'
    },
    status: 'In Payment Cycle',
    moveInDate: '2024-02-01', // Near completion - month 23/24
    paymentTerms: {
      totalMonths: 24,
      monthsPaid: 23,
      monthlyAmount: 34000,
      nextDueDate: '2026-01-01', // Last payment was on time!
      arrears: 0,
      daysLate: 0
    },
    propertyManagement: {
      electricityDue: 0,
      waterDue: 0,
      garbageDue: 0,
      maintenanceDue: 0,
      lastPaymentDate: '2026-01-01'
    },
    notes: ['One payment left!', 'Perfect payment record']
  },
  {
    id: 'U011',
    blockLot: 'B3-L25',
    unitType: 'Single Detached',
    project: 'Vista Verde',
    phase: 'Phase 1',
    sellingPrice: 2650000,
    buyer: {
      name: 'Ramon Bautista',
      contact: '+63 927 123 4567'
    },
    status: 'In Payment Cycle',
    moveInDate: '2024-04-01', // Month 21/24
    paymentTerms: {
      totalMonths: 24,
      monthsPaid: 21,
      monthlyAmount: 42000,
      nextDueDate: '2026-01-01',
      arrears: 0,
      daysLate: 0
    },
    propertyManagement: {
      electricityDue: 0,
      waterDue: 0,
      garbageDue: 0,
      maintenanceDue: 0,
      lastPaymentDate: '2026-01-01'
    },
    notes: [
      '3 payments remaining',
      '✅ RESOLVED: Was 2 months late in March 2025 (missed Jan & Feb payments)',
      'Caught up with double payment in May 2025',
      'Now current and on track'
    ]
  },
  {
    id: 'U012',
    blockLot: 'B4-L11',
    unitType: 'Townhouse',
    project: 'Palm Heights',
    phase: 'Phase 2',
    sellingPrice: 1680000,
    buyer: {
      name: 'Lisa Fernandez',
      contact: '+63 928 234 5678'
    },
    status: 'In Payment Cycle',
    moveInDate: '2024-06-01', // Month 19/24 - middle
    paymentTerms: {
      totalMonths: 24,
      monthsPaid: 19,
      monthlyAmount: 31000,
      nextDueDate: '2026-01-01',
      arrears: 0,
      daysLate: 0
    },
    propertyManagement: {
      electricityDue: 0,
      waterDue: 0,
      garbageDue: 0,
      maintenanceDue: 0,
      lastPaymentDate: '2026-01-01'
    },
    notes: [
      'Midway through payment plan',
      '✅ RESOLVED: Missed 2 months in June 2025 (Apr & May payments)',
      'Caught up with payment plan in August 2025',
      'Now consistent payer'
    ]
  },
  {
    id: 'U013',
    blockLot: 'B1-L09',
    unitType: 'Single Detached',
    project: 'Sunrise Homes',
    phase: 'Phase 3',
    sellingPrice: 2980000,
    buyer: {
      name: 'George Alvarez',
      contact: '+63 929 345 6789'
    },
    status: 'In Payment Cycle',
    moveInDate: '2024-08-01', // Month 17/24
    paymentTerms: {
      totalMonths: 24,
      monthsPaid: 17,
      monthlyAmount: 49000,
      nextDueDate: '2026-01-01',
      arrears: 0,
      daysLate: 0
    },
    propertyManagement: {
      electricityDue: 0,
      waterDue: 0,
      garbageDue: 0,
      maintenanceDue: 0,
      lastPaymentDate: '2026-01-01'
    },
    notes: ['About 70% complete', 'Good communication']
  },
  {
    id: 'U014',
    blockLot: 'B5-L16',
    unitType: 'Townhouse',
    project: 'Vista Verde',
    phase: 'Phase 1',
    sellingPrice: 1550000,
    buyer: {
      name: 'Natalie Ramos',
      contact: '+63 930 456 7890'
    },
    status: 'In Payment Cycle',
    moveInDate: '2024-10-01', // Month 15/24
    paymentTerms: {
      totalMonths: 24,
      monthsPaid: 15,
      monthlyAmount: 29000,
      nextDueDate: '2026-01-01',
      arrears: 0,
      daysLate: 0
    },
    propertyManagement: {
      electricityDue: 0,
      waterDue: 0,
      garbageDue: 0,
      maintenanceDue: 0,
      lastPaymentDate: '2026-01-01'
    },
    notes: ['Just past midpoint', 'Always pays early']
  },
  {
    id: 'U015',
    blockLot: 'B2-L07',
    unitType: 'Single Detached',
    project: 'Palm Heights',
    phase: 'Phase 2',
    sellingPrice: 3150000,
    buyer: {
      name: 'Victor Salazar',
      contact: '+63 931 567 8901'
    },
    status: 'In Payment Cycle',
    moveInDate: '2024-07-01', // Month 18/24
    paymentTerms: {
      totalMonths: 24,
      monthsPaid: 18,
      monthlyAmount: 51000,
      nextDueDate: '2026-01-01',
      arrears: 0,
      daysLate: 0
    },
    propertyManagement: {
      electricityDue: 0,
      waterDue: 0,
      garbageDue: 0,
      maintenanceDue: 0,
      lastPaymentDate: '2026-01-01'
    },
    notes: ['75% complete', 'Had 2 late payments but caught up']
  },
  {
    id: 'U016',
    blockLot: 'B3-L19',
    unitType: 'Townhouse',
    project: 'Sunrise Homes',
    phase: 'Phase 3',
    sellingPrice: 1720000,
    buyer: {
      name: 'Michelle Yu',
      contact: '+63 932 678 9012'
    },
    status: 'In Payment Cycle',
    moveInDate: '2024-11-01', // Month 14/18
    paymentTerms: {
      totalMonths: 18,
      monthsPaid: 14,
      monthlyAmount: 33000,
      nextDueDate: '2026-01-01',
      arrears: 0,
      daysLate: 0
    },
    propertyManagement: {
      electricityDue: 0,
      waterDue: 0,
      garbageDue: 0,
      maintenanceDue: 0,
      lastPaymentDate: '2026-01-01'
    },
    notes: [
      'Almost done - 4 payments left',
      '✅ RESOLVED: Was 45 days late on June 2025 payment',
      'Caught up in July, back on track since then'
    ]
  },
  {
    id: 'U017',
    blockLot: 'B4-L23',
    unitType: 'Single Detached',
    project: 'Vista Verde',
    phase: 'Phase 1',
    sellingPrice: 2750000,
    buyer: {
      name: 'Benjamin Chan',
      contact: '+63 933 789 0123'
    },
    status: 'In Payment Cycle',
    moveInDate: '2025-01-01', // Month 12/24 - exactly midway
    paymentTerms: {
      totalMonths: 24,
      monthsPaid: 12,
      monthlyAmount: 44000,
      nextDueDate: '2026-01-01',
      arrears: 0,
      daysLate: 0
    },
    propertyManagement: {
      electricityDue: 0,
      waterDue: 0,
      garbageDue: 0,
      maintenanceDue: 0,
      lastPaymentDate: '2026-01-01'
    },
    notes: ['Exactly halfway through', 'Reliable OFW']
  },
  {
    id: 'U018',
    blockLot: 'B1-L28',
    unitType: 'Townhouse',
    project: 'Palm Heights',
    phase: 'Phase 2',
    sellingPrice: 1890000,
    buyer: {
      name: 'Cynthia Reyes',
      contact: '+63 934 890 1234'
    },
    status: 'In Payment Cycle',
    moveInDate: '2025-03-01', // Month 10/18
    paymentTerms: {
      totalMonths: 18,
      monthsPaid: 10,
      monthlyAmount: 36000,
      nextDueDate: '2026-01-01',
      arrears: 0,
      daysLate: 0
    },
    propertyManagement: {
      electricityDue: 0,
      waterDue: 0,
      garbageDue: 0,
      maintenanceDue: 0,
      lastPaymentDate: '2026-01-01'
    },
    notes: ['Over halfway mark', 'Teacher - stable income']
  },
  {
    id: 'U019',
    blockLot: 'B5-L13',
    unitType: 'Single Detached',
    project: 'Sunrise Homes',
    phase: 'Phase 3',
    sellingPrice: 3050000,
    buyer: {
      name: 'Anthony Diaz',
      contact: '+63 935 901 2345'
    },
    status: 'In Payment Cycle',
    moveInDate: '2025-05-01', // Month 8/24 - still early
    paymentTerms: {
      totalMonths: 24,
      monthsPaid: 8,
      monthlyAmount: 50000,
      nextDueDate: '2026-01-01',
      arrears: 0,
      daysLate: 0
    },
    propertyManagement: {
      electricityDue: 0,
      waterDue: 0,
      garbageDue: 0,
      maintenanceDue: 0,
      lastPaymentDate: '2026-01-01'
    },
    notes: ['One-third complete', 'Business owner']
  },
  {
    id: 'U020',
    blockLot: 'B2-L31',
    unitType: 'Townhouse',
    project: 'Vista Verde',
    phase: 'Phase 1',
    sellingPrice: 1640000,
    buyer: {
      name: 'Diana Lopez',
      contact: '+63 936 012 3456'
    },
    status: 'In Payment Cycle',
    moveInDate: '2025-07-01', // Month 6/18 - early stage
    paymentTerms: {
      totalMonths: 18,
      monthsPaid: 6,
      monthlyAmount: 32000,
      nextDueDate: '2026-01-01',
      arrears: 0,
      daysLate: 0
    },
    propertyManagement: {
      electricityDue: 0,
      waterDue: 0,
      garbageDue: 0,
      maintenanceDue: 0,
      lastPaymentDate: '2026-01-01'
    },
    notes: ['Still in early stage', 'Young couple - first home']
  },
  {
    id: 'U021',
    blockLot: 'B3-L04',
    unitType: 'Single Detached',
    project: 'Palm Heights',
    phase: 'Phase 2',
    sellingPrice: 2920000,
    buyer: {
      name: 'Harold Santos',
      contact: '+63 937 123 4567'
    },
    status: 'In Payment Cycle',
    moveInDate: '2025-09-01', // Month 4/24 - just started
    paymentTerms: {
      totalMonths: 24,
      monthsPaid: 4,
      monthlyAmount: 47000,
      nextDueDate: '2026-01-01',
      arrears: 0,
      daysLate: 0
    },
    propertyManagement: {
      electricityDue: 0,
      waterDue: 0,
      garbageDue: 0,
      maintenanceDue: 0,
      lastPaymentDate: '2026-01-01'
    },
    notes: ['Just started - 4 months in', 'So far so good']
  },

  // ========================================
  // AT RISK (5 units) - U022 to U026
  // December 2025 payment unpaid
  // Due: Dec 1, 2025 → 45 days overdue (as of Jan 15, 2026)
  // ========================================
  {
    id: 'U022',
    blockLot: 'B4-L08',
    unitType: 'Townhouse',
    project: 'Sunrise Homes',
    phase: 'Phase 3',
    sellingPrice: 1780000,
    buyer: {
      name: 'Irene Villanueva',
      contact: '+63 938 234 5678'
    },
    status: 'At Risk',
    moveInDate: '2024-05-01', // Month 20/24
    paymentTerms: {
      totalMonths: 24,
      monthsPaid: 19, // Missed December
      monthlyAmount: 35000,
      nextDueDate: '2025-12-01',
      arrears: 35000,
      daysLate: 45 // Dec 1 to Jan 15
    },
    propertyManagement: {
      electricityDue: 2100,
      waterDue: 850,
      garbageDue: 0,
      maintenanceDue: 0,
      lastPaymentDate: '2025-11-02'
    },
    notes: ['Missed December payment', 'Called - said will pay this week', 'Previously good record']
  },
  {
    id: 'U023',
    blockLot: 'B1-L17',
    unitType: 'Single Detached',
    project: 'Vista Verde',
    phase: 'Phase 1',
    sellingPrice: 2890000,
    buyer: {
      name: 'Francis Aquino',
      contact: '+63 939 345 6789'
    },
    status: 'At Risk',
    moveInDate: '2024-09-01', // Month 16/24
    paymentTerms: {
      totalMonths: 24,
      monthsPaid: 15, // Missed December
      monthlyAmount: 46000,
      nextDueDate: '2025-12-01',
      arrears: 46000,
      daysLate: 45
    },
    propertyManagement: {
      electricityDue: 3800,
      waterDue: 1200,
      garbageDue: 250,
      maintenanceDue: 0,
      lastPaymentDate: '2025-11-05'
    },
    notes: ['Missed December - unexpected medical expense', 'Committed to pay by Jan 20']
  },
  {
    id: 'U024',
    blockLot: 'B5-L21',
    unitType: 'Townhouse',
    project: 'Palm Heights',
    phase: 'Phase 2',
    sellingPrice: 1710000,
    buyer: {
      name: 'Gina Mercado',
      contact: '+63 940 456 7890'
    },
    status: 'At Risk',
    moveInDate: '2025-02-01', // Month 11/18
    paymentTerms: {
      totalMonths: 18,
      monthsPaid: 10, // Missed December
      monthlyAmount: 34000,
      nextDueDate: '2025-12-01',
      arrears: 34000,
      daysLate: 45
    },
    propertyManagement: {
      electricityDue: 2500,
      waterDue: 900,
      garbageDue: 0,
      maintenanceDue: 0,
      lastPaymentDate: '2025-11-10'
    },
    notes: ['First missed payment', 'Holiday expenses cited as reason']
  },
  {
    id: 'U025',
    blockLot: 'B2-L26',
    unitType: 'Single Detached',
    project: 'Sunrise Homes',
    phase: 'Phase 3',
    sellingPrice: 3080000,
    buyer: {
      name: 'Kenneth Vargas',
      contact: '+63 941 567 8901'
    },
    status: 'At Risk',
    moveInDate: '2024-12-01', // Month 13/24
    paymentTerms: {
      totalMonths: 24,
      monthsPaid: 12, // Missed December
      monthlyAmount: 50000,
      nextDueDate: '2025-12-01',
      arrears: 50000,
      daysLate: 45
    },
    propertyManagement: {
      electricityDue: 4200,
      waterDue: 1350,
      garbageDue: 300,
      maintenanceDue: 0,
      lastPaymentDate: '2025-11-08'
    },
    notes: ['Missed December - business cash flow issue', 'Sent follow-up SMS']
  },
  {
    id: 'U026',
    blockLot: 'B3-L12',
    unitType: 'Townhouse',
    project: 'Vista Verde',
    phase: 'Phase 1',
    sellingPrice: 1620000,
    buyer: {
      name: 'Jenny Rivera',
      contact: '+63 942 678 9012'
    },
    status: 'At Risk',
    moveInDate: '2025-04-01', // Month 9/18
    paymentTerms: {
      totalMonths: 18,
      monthsPaid: 8, // Missed December
      monthlyAmount: 31000,
      nextDueDate: '2025-12-01',
      arrears: 31000,
      daysLate: 45
    },
    propertyManagement: {
      electricityDue: 1800,
      waterDue: 750,
      garbageDue: 0,
      maintenanceDue: 0,
      lastPaymentDate: '2025-11-12'
    },
    notes: ['Missed December - delayed salary', 'Responsive to calls']
  },

  // ========================================
  // OVERDUE (3 units) - U027 to U029
  // November AND December 2025 unpaid
  // Due: Nov 1, 2025 → 75 days overdue (as of Jan 15, 2026)
  // ========================================
  {
    id: 'U027',
    blockLot: 'B4-L29',
    unitType: 'Single Detached',
    project: 'Palm Heights',
    phase: 'Phase 2',
    sellingPrice: 2970000,
    buyer: {
      name: 'Oscar Domingo',
      contact: '+63 943 789 0123'
    },
    status: 'Overdue',
    moveInDate: '2024-03-01', // Month 22/24
    paymentTerms: {
      totalMonths: 24,
      monthsPaid: 20, // Missed Nov & Dec
      monthlyAmount: 48000,
      nextDueDate: '2025-11-01',
      arrears: 96000, // 2 months
      daysLate: 75 // Nov 1 to Jan 15
    },
    propertyManagement: {
      electricityDue: 6500,
      waterDue: 2100,
      garbageDue: 600,
      maintenanceDue: 0,
      lastPaymentDate: '2025-10-05'
    },
    notes: ['2 months behind', 'Scheduled site visit this week', 'Job loss - looking for work']
  },
  {
    id: 'U028',
    blockLot: 'B1-L34',
    unitType: 'Townhouse',
    project: 'Sunrise Homes',
    phase: 'Phase 3',
    sellingPrice: 1850000,
    buyer: {
      name: 'Paula Santiago',
      contact: '+63 944 890 1234'
    },
    status: 'Overdue',
    moveInDate: '2024-10-01', // Month 15/18
    paymentTerms: {
      totalMonths: 18,
      monthsPaid: 13, // Missed Nov & Dec
      monthlyAmount: 37000,
      nextDueDate: '2025-11-01',
      arrears: 74000, // 2 months
      daysLate: 75
    },
    propertyManagement: {
      electricityDue: 5200,
      waterDue: 1600,
      garbageDue: 400,
      maintenanceDue: 0,
      lastPaymentDate: '2025-10-08'
    },
    notes: ['2 months overdue', 'Not answering calls', 'Left voicemail & SMS']
  },
  {
    id: 'U029',
    blockLot: 'B5-L06',
    unitType: 'Single Detached',
    project: 'Vista Verde',
    phase: 'Phase 1',
    sellingPrice: 2820000,
    buyer: {
      name: 'Ricardo Flores',
      contact: '+63 945 901 2345'
    },
    status: 'Overdue',
    moveInDate: '2025-06-01', // Month 7/24
    paymentTerms: {
      totalMonths: 24,
      monthsPaid: 5, // Missed Nov & Dec
      monthlyAmount: 45000,
      nextDueDate: '2025-11-01',
      arrears: 90000, // 2 months
      daysLate: 75
    },
    propertyManagement: {
      electricityDue: 4800,
      waterDue: 1400,
      garbageDue: 350,
      maintenanceDue: 0,
      lastPaymentDate: '2025-10-12'
    },
    notes: ['2 months behind - still early in cycle', 'Family emergency cited', 'Needs payment plan adjustment']
  },

  // ========================================
  // CRITICAL (1 unit) - U030
  // Started July 2025, paid July & August
  // Stopped after August - Sept/Oct/Nov/Dec all unpaid
  // Due: Sep 1, 2025 → 136 days overdue (as of Jan 15, 2026)
  // ========================================
  {
    id: 'U030',
    blockLot: 'B2-L14',
    unitType: 'Townhouse',
    project: 'Palm Heights',
    phase: 'Phase 2',
    sellingPrice: 1590000,
    buyer: {
      name: 'Sandra Castillo',
      contact: '+63 946 012 3456'
    },
    status: 'Critical',
    moveInDate: '2025-07-01', // Started July 2025
    paymentTerms: {
      totalMonths: 18,
      monthsPaid: 2, // Only July & August paid
      monthlyAmount: 30000,
      nextDueDate: '2025-09-01', // September never paid
      arrears: 120000, // 4 months unpaid (Sept, Oct, Nov, Dec)
      daysLate: 136 // Sep 1 to Jan 15
    },
    propertyManagement: {
      electricityDue: 8900,
      waterDue: 2800,
      garbageDue: 800,
      maintenanceDue: 1500,
      lastPaymentDate: '2025-08-05'
    },
    notes: [
      'CRITICAL: 4 months unpaid',
      'Paid first 2 months on time then stopped',
      'No contact since October',
      'Legal notice sent Dec 20',
      'Considering foreclosure proceedings'
    ]
  },

  // ========================================
  // AVAILABLE UNITS (5 units) - U031 to U035
  // Ready for sale, no occupants
  // ========================================
  {
    id: 'U031',
    blockLot: 'B1-L30',
    unitType: 'Townhouse',
    project: 'Vista Verde',
    phase: 'Phase 1',
    sellingPrice: 1680000,
    buyer: null,
    status: 'Available',
    moveInDate: null,
    paymentTerms: null,
    propertyManagement: null,
    notes: ['Newly completed', 'Ready for immediate occupancy']
  },
  {
    id: 'U032',
    blockLot: 'B3-L22',
    unitType: 'Single Detached',
    project: 'Palm Heights',
    phase: 'Phase 2',
    sellingPrice: 2950000,
    buyer: null,
    status: 'Available',
    moveInDate: null,
    paymentTerms: null,
    propertyManagement: null,
    notes: ['Premium lot with garden space', 'Corner unit']
  },
  {
    id: 'U033',
    blockLot: 'B5-L18',
    unitType: 'Townhouse',
    project: 'Sunrise Homes',
    phase: 'Phase 3',
    sellingPrice: 1720000,
    buyer: null,
    status: 'Available',
    moveInDate: null,
    paymentTerms: null,
    propertyManagement: null,
    notes: ['Near entrance', 'Good street visibility']
  },
  {
    id: 'U034',
    blockLot: 'B2-L35',
    unitType: 'Single Detached',
    project: 'Vista Verde',
    phase: 'Phase 1',
    sellingPrice: 3100000,
    buyer: null,
    status: 'Available',
    moveInDate: null,
    paymentTerms: null,
    propertyManagement: null,
    notes: ['Largest lot in phase', 'Mountain view']
  },
  {
    id: 'U035',
    blockLot: 'B4-L27',
    unitType: 'Townhouse',
    project: 'Palm Heights',
    phase: 'Phase 2',
    sellingPrice: 1650000,
    buyer: null,
    status: 'Available',
    moveInDate: null,
    paymentTerms: null,
    propertyManagement: null,
    notes: ['Fully furnished option available', 'Near amenities']
  }
];

export type UserRole = 'Executive' | 'Manager' | 'Encoder';

export type UserProfile = {
  role: UserRole;
  name: string;
  email: string;
  avatar: string;
  initials: string;
  department: string;
};

export const USER_PROFILES: Record<UserRole, UserProfile> = {
  'Executive': {
    role: 'Executive',
    name: 'Maria Elena Santos',
    email: 'maria.santos@elconstruction.ph',
    avatar: '',
    initials: 'MS',
    department: 'Executive Office'
  },
  'Manager': {
    role: 'Manager',
    name: 'Roberto Cruz',
    email: 'roberto.cruz@elconstruction.ph',
    avatar: '',
    initials: 'RC',
    department: 'Property Management'
  },
  'Encoder': {
    role: 'Encoder',
    name: 'Ana Marie Reyes',
    email: 'ana.reyes@elconstruction.ph',
    avatar: '',
    initials: 'AR',
    department: 'Data Entry'
  }
};

export const ROLE_PERMISSIONS = {
  Executive: {
    canViewDashboard: true,
    canViewAllUnits: true,
    canEditStatus: false,
    canLogPayments: false,
    canViewReports: true
  },
  Manager: {
    canViewDashboard: true,
    canViewAllUnits: true,
    canEditStatus: true,
    canLogPayments: true,
    canViewReports: true
  },
  Encoder: {
    canViewDashboard: false,
    canViewAllUnits: true,
    canEditStatus: true,
    canLogPayments: true,
    canViewReports: false
  }
};