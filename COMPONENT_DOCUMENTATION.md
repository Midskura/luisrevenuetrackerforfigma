# NEXSYS - Component Documentation

## Component Architecture

All components follow a consistent pattern:
- **TypeScript** for type safety
- **Tailwind CSS** for styling (no external CSS files except theme)
- **Controlled components** with React hooks
- **Prop drilling** avoided with proper composition

---

## Component Directory Structure

```
/src/app/components/
├── collections/
│   └── CollectionCard.tsx
├── payments/
│   ├── RecordPaymentModal.tsx
│   ├── PaymentSchedule.tsx
│   ├── PaymentHistory.tsx
│   └── PaymentDetailModal.tsx
├── ui/
│   ├── button.tsx
│   ├── card.tsx
│   ├── badge.tsx
│   ├── dialog.tsx
│   ├── progress.tsx
│   └── separator.tsx
├── Sidebar.tsx
├── DashboardView.tsx
├── CollectionsView.tsx
├── UnitDetailView.tsx
├── StatCard.tsx
└── DemoTour.tsx
```

---

## Core Components

### 1. Sidebar.tsx
**Location:** `/src/app/components/Sidebar.tsx`

**Purpose:** Main navigation with role switcher and project selector.

**Props:**
```typescript
type SidebarProps = {
  currentView: string;
  onNavigate: (view: string) => void;
  selectedProject: string;
  onProjectChange: (project: string) => void;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
};
```

**Features:**
- Collapsible sidebar (280px width)
- NEXSYS branding with gradient logo
- Navigation items with icons (lucide-react)
- Active state highlighting (#EF4444)
- Role switcher dropdown (Admin, Manager, Viewer)
- Project selector dropdown
- Hover states with smooth transitions

**Navigation Items:**
- Dashboard (LayoutDashboard icon)
- Collections (AlertCircle icon)
- Reports (FileText icon)
- Settings (Settings icon)
- Documents (FileText icon)
- Activity (Activity icon)
- Communications (MessageSquare icon)
- Bulk Operations (Package icon)

**Styling Notes:**
- Background: `#FFFFFF`
- Border: `1px solid #E5E7EB`
- Active state: Left border (#EF4444), background (#FEF2F2)
- Hover: Background `#F9FAFB`

---

### 2. DashboardView.tsx
**Location:** `/src/app/components/DashboardView.tsx`

**Purpose:** Portfolio overview with key metrics and critical accounts.

**Props:**
```typescript
type DashboardProps = {
  units: Unit[];
  onViewUnit: (unit: Unit) => void;
  onViewCollections: () => void;
  currentRole: UserRole;
};
```

**Features:**
- 4 metric cards (StatCard components)
  - Total Receivables
  - Collection Rate
  - Overdue Amount
  - Critical Accounts
- Critical accounts list (units with days_overdue > 60)
- "View All Collections" button
- Real-time metric calculations
- Tour target: `data-tour-target="dashboard-metrics"`

**Metrics Calculations:**
```typescript
totalReceivables = sum(unit.paymentTerms.balance) for all units
collectionRate = (totalPaid / totalExpected) * 100
overdueAmount = sum(unit.paymentTerms.arrears) where daysOverdue > 0
criticalAccounts = count(units where daysOverdue > 60)
```

---

### 3. CollectionsView.tsx
**Location:** `/src/app/components/CollectionsView.tsx`

**Purpose:** List of at-risk units requiring collections attention.

**Props:**
```typescript
type CollectionsViewProps = {
  units: Unit[];
  onViewUnit: (unit: Unit) => void;
  currentRole: UserRole;
};
```

**Features:**
- Filters at-risk units (Critical, Overdue, At Risk)
- Sorts by days overdue (descending)
- Grid layout of CollectionCard components
- Search/filter controls (placeholder for future)
- Tour target: `data-tour-target="collections-list"`

**Filter Logic:**
```typescript
const atRiskUnits = units.filter(unit => 
  ['Critical', 'Overdue', 'At Risk'].includes(unit.status)
);
```

---

### 4. CollectionCard.tsx
**Location:** `/src/app/components/collections/CollectionCard.tsx`

**Purpose:** Individual unit card in collections view.

**Props:**
```typescript
type CollectionCardProps = {
  unit: Unit;
  onClick: () => void;
};
```

**Features:**
- Status badge with color coding
- Unit block/lot identifier
- Customer name
- Days overdue (red badge)
- Arrears amount (formatted currency)
- Hover effect (lift + shadow)
- Clickable to view unit details

**Styling:**
- Card background: `#FFFFFF`
- Border radius: `12px`
- Shadow: `0 2px 8px rgba(0, 0, 0, 0.08)`
- Hover: Translate Y -4px, stronger shadow

---

### 5. UnitDetailView.tsx
**Location:** `/src/app/components/UnitDetailView.tsx`

**Purpose:** Comprehensive unit details with payment management.

**Props:**
```typescript
type UnitDetailProps = {
  unit: Unit;
  onBack: () => void;
  onUpdateUnit?: (unit: Unit) => void;
};
```

**Features:**
- Back button to return to dashboard
- Unit overview card
  - Status badge
  - Customer info
  - Property details
  - Payment progress bar
- Action buttons
  - Log Payment (opens RecordPaymentModal)
  - Send Reminder
  - View Communications
- Payment Schedule section (PaymentSchedule component)
- Payment History section (PaymentHistory component)
- Tour targets: `data-tour-target="log-payment-button"`, `data-tour-target="payment-schedule"`

**Payment Progress Calculation:**
```typescript
const paymentProgress = (monthsPaid / totalMonths) * 100;
```

**State Management:**
```typescript
const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
const [payments, setPayments] = useState<PaymentRecord[]>([]);
```

---

### 6. RecordPaymentModal.tsx
**Location:** `/src/app/components/payments/RecordPaymentModal.tsx`

**Purpose:** Modal form for recording new payments.

**Props:**
```typescript
type RecordPaymentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  unit: Unit;
  onPaymentRecorded: (payment: PaymentRecord) => void;
};

type PaymentRecord = {
  id: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'Cash' | 'GCash' | 'Bank Transfer' | 'Check';
  referenceNumber: string;
  notes?: string;
};
```

**Features:**
- Amount input with validation (max = arrears)
- Payment date picker (defaults to today, max = today)
- Payment method dropdown
- Reference number input
- Notes textarea (optional)
- Form validation
- Success toast notification

**Validation Rules:**
- Amount > 0 and <= unit.paymentTerms.arrears
- Payment date <= today
- Payment method required
- Reference number required

**Important:** Uses date helpers from `src/app/utils/date.ts`.

---

### 7. PaymentSchedule.tsx
**Location:** `/src/app/components/payments/PaymentSchedule.tsx`

**Purpose:** Display monthly payment schedule with status indicators.

**Props:**
```typescript
type PaymentScheduleProps = {
  schedule: PaymentScheduleItem[];
};

type PaymentScheduleItem = {
  month: string; // "January 2026"
  dueDate: string; // ISO date
  amount: number;
  status: 'Paid' | 'Unpaid' | 'Partial' | 'Overdue';
  paidDate?: string;
  partialAmount?: number;
};
```

**Features:**
- Table layout with columns: Month, Due Date, Amount, Status, Paid Date
- Color-coded status badges
  - Paid: Green (#10B981)
  - Unpaid: Gray (#6B7280)
  - Partial: Yellow (#F59E0B)
  - Overdue: Red (#DC2626)
- Scrollable container for long schedules
- Tour target: `data-tour-target="payment-schedule"`

**Status Badge Colors:**
```typescript
Paid: background #E8F2EE, text #10B981
Unpaid: background #F3F4F6, text #6B7280
Partial: background #FEF3C7, text #D97706
Overdue: background #FEE2E2, text #DC2626
```

---

### 8. PaymentHistory.tsx
**Location:** `/src/app/components/payments/PaymentHistory.tsx`

**Purpose:** List of historical payment records.

**Props:**
```typescript
type PaymentHistoryProps = {
  payments: PaymentHistoryRecord[];
  onViewDetail: (payment: PaymentHistoryRecord) => void;
};

type PaymentHistoryRecord = {
  id: string;
  date: string;
  amount: number;
  method: string;
  reference: string;
  recordedBy: string;
};
```

**Features:**
- Chronological list (newest first)
- Click to view full payment details
- Empty state when no payments
- Formatted dates and currency

---

### 9. PaymentDetailModal.tsx
**Location:** `/src/app/components/payments/PaymentDetailModal.tsx`

**Purpose:** Read-only view of payment details.

**Props:**
```typescript
type PaymentDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  payment: PaymentHistoryRecord;
};
```

**Features:**
- All payment details displayed
- Receipt view (placeholder)
- Close button

---

### 10. StatCard.tsx
**Location:** `/src/app/components/StatCard.tsx`

**Purpose:** Reusable metric display card for dashboard.

**Props:**
```typescript
type StatCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  color?: string;
};
```

**Features:**
- Icon with colored background
- Large value display
- Optional trend indicator (percentage)
- Hover effect

**Usage Example:**
```typescript
<StatCard
  title="Total Receivables"
  value={formatCurrency(totalReceivables)}
  icon={<DollarSign size={24} />}
  color="#EF4444"
/>
```

---

### 11. DemoTour.tsx
**Location:** `/src/app/components/DemoTour.tsx`

**Purpose:** Interactive guided tour through payment workflow.

**Props:**
```typescript
type DemoTourProps = {
  isOpen: boolean;
  onClose: () => void;
  currentView: string;
  onNavigate: (view: any) => void;
  onActionCompleted?: (action: string) => void;
};
```

**Features:**
- 8-step workflow tour
- Auto-scroll to target elements
- Dynamic positioning (avoids blocking UI)
- Progress indicator
- Red border spotlight on targets
- Animated arrow pointer
- Auto-advance on user actions

**Tour Steps:**
1. Welcome screen
2. Navigate to Collections
3. Find Irene Villanueva unit
4. Review payment schedule
5. Click Log Payment button
6. Record ₱35,000 payment
7. Return to dashboard
8. Completion celebration

**Target Selectors:**
- `[data-tour-id="nav-collections"]`
- `[data-tour-target="collections-list"]`
- `[data-tour-target="payment-schedule"]`
- `[data-tour-target="log-payment-button"]`
- `[data-tour-target="dashboard-metrics"]`

**Auto-scroll Logic:**
```typescript
element.scrollIntoView({ behavior: 'smooth', block: 'center' });
```

---

## UI Components (Reusable)

### Button
**Location:** `/src/app/components/ui/button.tsx`

**Variants:**
- `default`: Primary button (green)
- `outline`: Outlined button
- `ghost`: Text-only button
- `destructive`: Red button

**Sizes:**
- `sm`: Small (32px height)
- `md`: Medium (40px height)
- `lg`: Large (48px height)

### Card
**Location:** `/src/app/components/ui/card.tsx`

**Components:**
- `Card`: Container
- `CardHeader`: Header section
- `CardTitle`: Title text
- `CardContent`: Body content

### Badge
**Location:** `/src/app/components/ui/badge.tsx`

**Variants:**
- `default`: Gray
- `success`: Green
- `warning`: Yellow
- `destructive`: Red

### Dialog
**Location:** `/src/app/components/ui/dialog.tsx`

**Components:**
- `Dialog`: Root provider
- `DialogTrigger`: Button to open
- `DialogContent`: Modal content
- `DialogHeader`: Header section
- `DialogTitle`: Title text
- `DialogDescription`: Subtitle text

### Progress
**Location:** `/src/app/components/ui/progress.tsx`

**Props:**
```typescript
type ProgressProps = {
  value: number; // 0-100
};
```

### Separator
**Location:** `/src/app/components/ui/separator.tsx`

**Props:**
```typescript
type SeparatorProps = {
  orientation?: 'horizontal' | 'vertical';
};
```

---

## State Management Patterns

### App-level State (App.tsx)
```typescript
const [currentView, setCurrentView] = useState('dashboard');
const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
const [selectedProject, setSelectedProject] = useState('all');
const [currentRole, setCurrentRole] = useState<UserRole>('admin');
const [showDemoTour, setShowDemoTour] = useState(false);
```

### Component-level State
- Use `useState` for local state (modals, forms, etc.)
- No global state management (Redux, Context) needed yet
- Parent-child communication via props

### Future: Supabase Integration
- Replace local state with Supabase queries
- Use `useEffect` for real-time subscriptions
- Consider React Query or SWR for caching

---

## Common Patterns

### Currency Formatting
```typescript
const formatCurrency = (amount: number) => 
  `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
```

### Date Formatting
```typescript
import { format, parseISO } from 'date-fns';

const formattedDate = format(parseISO(dateString), 'MMM dd, yyyy');
```

### Status Color Mapping
```typescript
const getStatusColor = (status: string) => {
  switch (status) {
    case 'Critical': return '#DC2626';
    case 'Overdue': return '#EA580C';
    case 'At Risk': return '#D97706';
    case 'In Payment Cycle': return '#10B981';
    case 'Fully Paid': return '#10B981';
    default: return '#6B7280';
  }
};
```

### Hover State Pattern
```typescript
<button
  onMouseOver={(e) => {
    e.currentTarget.style.transform = 'translateY(-2px)';
  }}
  onMouseOut={(e) => {
    e.currentTarget.style.transform = 'translateY(0)';
  }}
>
  Click Me
</button>
```

---

## Component Migration to Supabase

### Before (Local-only state)
```typescript
// UnitDetailView.tsx
const handlePaymentRecorded = (payment: PaymentRecord) => {
  setPayments(prev => [payment, ...prev]);
  // Local state only, no persistence
};
```

### After (Supabase)
```typescript
// UnitDetailView.tsx
const handlePaymentRecorded = async (payment: PaymentRecord) => {
  try {
    const paymentId = await recordPayment({
      unitId: unit.id,
      amount: payment.amount,
      paymentDate: payment.paymentDate,
      paymentMethod: payment.paymentMethod,
      referenceNumber: payment.referenceNumber,
      notes: payment.notes
    });
    
    // Real-time subscription will automatically update UI
    toast.success('Payment recorded successfully!');
  } catch (error) {
    toast.error('Failed to record payment');
  }
};
```

---

## Testing Components

### Unit Tests (Vitest + React Testing Library)
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { CollectionCard } from './CollectionCard';

test('renders unit details correctly', () => {
  const unit = {
    id: '1',
    blockLot: 'B4-L08',
    customer: { name: 'Sample Buyer' },
    status: 'Overdue',
    daysOverdue: 45,
    paymentTerms: { arrears: 35000 }
  };
  
  render(<CollectionCard unit={unit} onClick={() => {}} />);
  
  expect(screen.getByText('B4-L08')).toBeInTheDocument();
  expect(screen.getByText('Sample Buyer')).toBeInTheDocument();
  expect(screen.getByText('45 days')).toBeInTheDocument();
});
```

### Integration Tests
- Test full workflows (Collections → Unit Detail → Payment Recording)
- Stub Supabase client responses
- Verify UI updates after actions

---

## Accessibility

### Keyboard Navigation
- All interactive elements focusable with Tab
- Enter/Space to activate buttons
- Escape to close modals

### Screen Readers
- Semantic HTML (`<button>`, `<nav>`, etc.)
- ARIA labels where needed
- Proper heading hierarchy

### Color Contrast
- All text meets WCAG AA standards
- Status colors chosen for accessibility

---

## Performance Considerations

### Optimization Techniques
- Use `React.memo()` for expensive components
- Lazy load large lists (virtualization)
- Debounce search/filter inputs
- Optimize images (if any)

### Bundle Size
- Current bundle: ~200KB (gzipped)
- Largest dependencies: react, lucide-react
- No unnecessary libraries

---

**Last Updated:** December 30, 2025
**Status:** All components documented and production-ready
