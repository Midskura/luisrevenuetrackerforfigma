# 🧪 COMPLETE TESTING PROTOCOL
## Revenue Lifecycle Management Platform - Release Readiness

---

## 📋 PITCH VALIDATION CHECKLIST

### ✅ Core Features Promised:
- [x] **Post-sale payment tracking** - PaymentSchedule, PaymentHistory, RecordPaymentModal
- [x] **Collections management** - CollectionsView with risk levels
- [x] **Customer portals** - CustomerLogin + CustomerDashboard
- [x] **50-500 unit capacity** - Seeded data shows scalability
- [x] **Long-term payment cycles** - 24-36 month installments supported
- [x] **Bringova-style design** - Soft shadows, red/coral (#EF4444) accents ✓
- [x] **Philippine context** - PHP currency, local terminology, GCash/bank transfers
- [x] **Template-based system** - Communication templates, settings presets
- [x] **Database-backed workflows** - Supabase + RLS ✓

### ✅ Business Model Support:
- [x] **SaaS features** - Multi-role access, settings, scalable design
- [x] **Custom build preview** - Comprehensive feature set showcasing customization potential
- [x] **Pre-sales ready** - Professional UI, complete workflows, demo-friendly

### 🎯 What We Actually Built (vs. What Was Promised):
| Promised | Built | Status |
|----------|-------|--------|
| Payment tracking | ✅ Full payment recording, schedules, history | **EXCEEDED** |
| Collections management | ✅ Risk-based collections + overdue tracking | **EXCEEDED** |
| Customer portal | ✅ Login + full self-service dashboard | **MET** |
| Reports | ❓ Not explicitly promised | **BONUS** ✨ |
| Document management | ❓ Not explicitly promised | **BONUS** ✨ |
| Activity log | ❓ Not explicitly promised | **BONUS** ✨ |
| Communications | ❓ Not explicitly promised | **BONUS** ✨ |
| Bulk operations | ❓ Not explicitly promised | **BONUS** ✨ |
| Settings | ✅ Implied for SaaS | **MET** |

**VERDICT: Core promises are covered.**

---

## 🔍 SYSTEMATIC TESTING GUIDE

### PHASE 1: Initial Load & First Impressions (5 min)

#### 1.1 Application Startup
- [ ] App loads without errors
- [ ] No console errors (open DevTools → Console tab)
- [ ] Sidebar appears correctly
- [ ] Default view is Dashboard
- [ ] Default role is Executive
- [ ] "All Systems Operational" shows in header
- [ ] Red/coral accent colors visible
- [ ] Bringova-style soft shadows present

#### 1.2 Visual Design Check
- [ ] Typography is clean and consistent
- [ ] Spacing feels professional
- [ ] Colors match brand (Red #EF4444)
- [ ] Icons render correctly
- [ ] No layout breaks
- [ ] Responsive design works (try resizing browser)

---

### PHASE 2: Role-Based Access Testing (15 min)

#### 2.1 Executive Role (Default)
**Access to ALL features:**

1. **Dashboard Access**
   - [ ] Can view Executive Dashboard
   - [ ] All KPI cards display correctly
   - [ ] Charts render (payment schedule, revenue vs collections)
   - [ ] Unit inventory table shows
   - [ ] Can click "View All Collections"

2. **Navigation Permissions**
   - [ ] Click each sidebar item → all accessible:
     - [ ] Dashboard ✓
     - [ ] Collections ✓
     - [ ] Reports ✓
     - [ ] Documents ✓
     - [ ] Communications ✓
     - [ ] Bulk Operations ✓
     - [ ] Activity Log ✓
     - [ ] Settings ✓

3. **Action Permissions**
   - [ ] Can record payments
   - [ ] Can delete documents
   - [ ] Can delete templates
   - [ ] Can modify all settings
   - [ ] Can execute bulk operations
   - [ ] Can cancel running tasks

#### 2.2 Manager Role
**Switch to Manager:**
- [ ] Click user avatar (top-right)
- [ ] Click "Ana Martinez - Manager"
- [ ] Notice toast: "Switched to Manager role"

**Test Permissions:**
1. **Dashboard Access**
   - [ ] Can view Executive Dashboard
   - [ ] All features accessible

2. **Navigation**
   - [ ] All sidebar items accessible

3. **Restricted Actions**
   - [ ] CANNOT delete documents (Executive only)
   - [ ] CANNOT delete templates (Executive only)
   - [ ] CAN modify settings
   - [ ] CAN execute bulk operations
   - [ ] CAN cancel tasks

**Test These Specifically:**
- [ ] Go to Documents → Try to delete → Check for "Permission Denied" (Should fail ❌)
- [ ] Go to Communications → Try to delete template → Check for error
- [ ] Go to Settings → Try to save → Should succeed ✓

#### 2.3 Encoder Role
**Switch to Encoder:**
- [ ] Click user avatar
- [ ] Click "Juan Reyes - Encoder"
- [ ] Notice role change toast

**Test Permissions:**
1. **Dashboard Access**
   - [ ] CANNOT view Executive Dashboard
   - [ ] Should auto-redirect to Collections
   - [ ] OR show warning message

2. **Navigation**
   - [ ] All sidebar items still visible (read-only)

3. **Heavily Restricted Actions**
   - [ ] Settings shows "Read-Only Access" badge
   - [ ] Settings: All inputs are disabled/grayed out
   - [ ] Settings: Save buttons disabled
   - [ ] Documents: Upload button disabled for legal docs
   - [ ] Communications: Cannot create/edit templates
   - [ ] Bulk Operations: Shows "Read-Only Access" badge
   - [ ] Bulk Operations: Cannot select units or execute

**Test These Specifically:**
- [ ] Go to Settings → Company tab → Try to edit company name → Should be disabled
- [ ] Try to save settings → Toast: "Permission Denied"
- [ ] Go to Bulk Operations → Try to select a unit → Should not work
- [ ] Go to Communications → Try to create template → Toast: "Permission Denied"
- [ ] Go to Documents → Try to upload → May work for non-legal docs

---

### PHASE 3: Admin Portal - Feature by Feature (45 min)

#### 3.1 Executive Dashboard
**Switch back to Executive role first!**

1. **KPI Cards (4 cards)**
   - [ ] Total Revenue shows ₱45.2M
   - [ ] Collection Rate shows 87.3%
   - [ ] Active Units shows 342
   - [ ] Overdue Amount shows ₱1.2M
   - [ ] All have trend indicators (↑/↓)
   - [ ] Colors are correct (green for good, red for bad)

2. **Payment Schedule Chart**
   - [ ] Chart renders with bars
   - [ ] Hover over bars → tooltip appears
   - [ ] Shows scheduled vs collected amounts
   - [ ] Legend is visible
   - [ ] X-axis shows months

3. **Revenue vs Collections Line Chart**
   - [ ] Two lines render (Revenue and Collections)
   - [ ] Hover → tooltip shows values
   - [ ] Legend toggles work (click Revenue/Collections)
   - [ ] Lines are different colors

4. **Unit Inventory Table**
   - [ ] Table shows multiple units
   - [ ] Status badges colored correctly (Active=green, Overdue=red)
   - [ ] Risk badges colored (Low=green, Medium=yellow, High=red)
   - [ ] Progress bars show correctly
   - [ ] Click a unit row → Goes to Unit Detail View
   - [ ] Can see all columns: Unit, Buyer, Project, Status, Risk, Balance, Progress, Actions

5. **Quick Actions**
   - [ ] "Record Payment" button exists
   - [ ] "View All Collections" button exists
   - [ ] Click each → navigates correctly

#### 3.2 Unit Detail View
**Click on a unit from dashboard (e.g., B1-L05)**

1. **Header**
   - [ ] Shows unit number prominently
   - [ ] Shows buyer name
   - [ ] Shows project name
   - [ ] "Back" button exists and works

2. **Summary Cards (4 cards)**
   - [ ] Total Amount
   - [ ] Total Paid
   - [ ] Remaining Balance
   - [ ] Next Payment Due
   - [ ] All show correct values

3. **Tabs**
   - [ ] Three tabs: Overview, Payments, Schedule
   - [ ] All tabs clickable

4. **Overview Tab**
   - [ ] Unit information section
   - [ ] Shows lot area, floor area, property type
   - [ ] Payment terms section
   - [ ] Shows down payment, installment plan
   - [ ] "Record Payment" button works

5. **Payments Tab**
   - [ ] Payment history table appears
   - [ ] Shows multiple payments
   - [ ] Each payment has OR number, date, amount, method, status
   - [ ] Click "View Details" → Modal opens
   - [ ] Modal shows complete payment info
   - [ ] Modal "Print Receipt" button works (toast)
   - [ ] Modal close button works

6. **Schedule Tab**
   - [ ] Shows payment schedule table
   - [ ] Multiple installments listed
   - [ ] Shows due date, amount, status
   - [ ] Paid installments marked green
   - [ ] Upcoming installments marked blue
   - [ ] Overdue marked red (if any)

7. **Record Payment Modal**
   - [ ] Click "Record Payment"
   - [ ] Modal opens
   - [ ] Form has all fields: amount, date, method, OR number, notes
   - [ ] Amount field is pre-filled
   - [ ] Payment method dropdown works (Cash, Check, Bank Transfer, GCash)
   - [ ] Date picker works
   - [ ] "Record Payment" button exists
   - [ ] "Cancel" button closes modal
   - [ ] Submit → Success toast appears
   - [ ] Payment history updates (check Payments tab)

#### 3.3 Collections View
**Navigate: Sidebar → Collections**

1. **Header & Stats**
   - [ ] Title: "Collections & Risk Management"
   - [ ] 4 stat cards show
   - [ ] Overdue Accounts count
   - [ ] Total Overdue amount
   - [ ] High Risk Units count
   - [ ] Collection Rate percentage

2. **Filter Tabs**
   - [ ] All, Low Risk, Medium Risk, High Risk tabs
   - [ ] Click each tab → filters units
   - [ ] Unit count updates per tab
   - [ ] High Risk shows fewer units

3. **Units Display**
   - [ ] Unit cards render
   - [ ] Each shows: unit number, buyer, project, balance, overdue amount, days overdue
   - [ ] Risk badges colored correctly
   - [ ] Overdue badges show when applicable
   - [ ] Payment history summary visible

4. **Actions**
   - [ ] "Send Reminder" button on each unit
   - [ ] Click → Toast appears
   - [ ] "View Details" button
   - [ ] Click → Goes to Unit Detail View
   - [ ] All buttons functional

5. **Empty State**
   - [ ] Switch to "Low Risk" tab
   - [ ] Should show some units OR empty state message
   - [ ] Message should be helpful

#### 3.4 Reports View
**Navigate: Sidebar → Reports**

1. **Header & Export**
   - [ ] Title: "Reports & Analytics"
   - [ ] Export dropdown button exists (PDF, Excel, CSV)
   - [ ] Click each → Toast message

2. **Time Period Filter**
   - [ ] Four buttons: Last 7 Days, 30 Days, 90 Days, 12 Months
   - [ ] Click each → selected state changes
   - [ ] Click → Charts should update (simulated)

3. **Report Type Tabs**
   - [ ] Three tabs: Revenue, Collections, Performance
   - [ ] All tabs clickable
   - [ ] Tab content changes

4. **Summary Cards (4 cards)**
   - [ ] Total Revenue
   - [ ] Collections
   - [ ] Outstanding
   - [ ] Target Achievement %
   - [ ] All show values and trends

5. **Revenue Tab**
   - [ ] Line chart renders (Revenue vs Target vs Collections)
   - [ ] Three lines visible
   - [ ] Hover → tooltip works
   - [ ] Legend clickable
   - [ ] Chart is responsive

6. **Collections Tab**
   - [ ] Pie chart renders (Payment Methods)
   - [ ] Shows Bank Transfer, Cash, GCash, Check
   - [ ] Colors are distinct
   - [ ] Hover → shows percentage
   - [ ] Legend displays

7. **Performance Tab**
   - [ ] Project performance section
   - [ ] Multiple projects listed
   - [ ] Each has progress bar
   - [ ] Shows units sold, revenue, collection rate
   - [ ] Progress bars colored correctly

#### 3.5 Documents View
**Navigate: Sidebar → Documents**

1. **Header**
   - [ ] Title: "Document Management"
   - [ ] "Upload Document" button exists (Executive/Manager)

2. **Category Cards (5 cards)**
   - [ ] Contracts, Receipts, Statements, Legal, Other
   - [ ] Each shows count
   - [ ] Click card → filters documents
   - [ ] Selected card highlights
   - [ ] Click again → deselects

3. **Filters & View**
   - [ ] Search bar works
   - [ ] Type "contract" → filters results
   - [ ] Unit filter dropdown works
   - [ ] View mode toggle (Grid/List)
   - [ ] Click Grid → Shows cards
   - [ ] Click List → Shows table rows
   - [ ] Results counter updates

4. **Grid View**
   - [ ] Documents shown as cards
   - [ ] Each card shows: icon, name, category, unit, size, type
   - [ ] User avatar and name visible
   - [ ] Upload date shown
   - [ ] Three buttons: Preview, Download, Delete (Executive only)

5. **List View**
   - [ ] Documents shown as rows
   - [ ] All info visible in one line
   - [ ] Same action buttons
   - [ ] Cleaner for scanning many docs

6. **Document Actions**
   - [ ] Click "Preview" → Toast message
   - [ ] Click "Download" → Toast with filename
   - [ ] Click "Delete" as Executive → Success toast
   - [ ] Try delete as Manager → Error toast ❌
   - [ ] Click "Upload Document" → Toast (mock)

7. **Empty State**
   - [ ] Search for "zzzzz" → No results
   - [ ] Shows empty state message
   - [ ] Helpful messaging

#### 3.6 Communications View
**Navigate: Sidebar → Communications**

1. **Header & Stats**
   - [ ] Title: "Communications"
   - [ ] 4 stat cards: SMS Templates, Email Templates, Active, Sent Campaigns
   - [ ] All show correct counts
   - [ ] "New Template" button (Executive/Manager)

2. **Tabs**
   - [ ] Two tabs: Templates, Campaigns
   - [ ] Both clickable
   - [ ] Counter shows number per tab

3. **Templates Tab - Filters**
   - [ ] Search bar works
   - [ ] Type "payment" → filters
   - [ ] Type filter buttons (All, SMS, Email)
   - [ ] Click each → filters templates
   - [ ] Results counter updates

4. **Template Cards**
   - [ ] Multiple templates visible
   - [ ] Each shows: icon (SMS/Email), name, trigger type, status (Active/Inactive)
   - [ ] Subject line shown for emails
   - [ ] Content preview in gray box with monospace font
   - [ ] Variables highlighted: {customer_name}, {amount}, {unit_number}
   - [ ] Usage count shown
   - [ ] Last modified date and user shown

5. **Template Actions**
   - [ ] Each template has 4 buttons: Activate/Deactivate, Duplicate, Edit, Delete
   - [ ] Click "Duplicate" → Success toast
   - [ ] Click "Edit" → Toast message
   - [ ] Click "Activate/Deactivate" → Toast
   - [ ] Click "Delete" as Executive → Success
   - [ ] Try delete as Manager → Error ❌
   - [ ] Try delete as Encoder → Error ❌

6. **Campaigns Tab**
   - [ ] Shows campaign cards
   - [ ] Each has status badge (Draft, Scheduled, Sent)
   - [ ] Shows: name, type, template, recipients
   - [ ] Scheduled campaigns show date/time
   - [ ] Sent campaigns show delivery rate %
   - [ ] Progress info visible

7. **Campaign Actions**
   - [ ] Draft campaigns have "Send Now" button
   - [ ] Click "Send Now" → Toast
   - [ ] Sent campaigns show completion info
   - [ ] Running campaigns show progress bar (if any)

8. **Permissions Check (as Encoder)**
   - [ ] Switch to Encoder role
   - [ ] Try "New Template" → Error ❌
   - [ ] Try "Edit" → Error ❌
   - [ ] Try "Delete" → Error ❌

#### 3.7 Bulk Operations View
**Navigate: Sidebar → Bulk Operations**
**Switch back to Executive role first!**

1. **Header**
   - [ ] Title: "Bulk Operations"
   - [ ] Shows "Read-Only Access" badge for Encoder
   - [ ] No badge for Executive/Manager

2. **Operation Selection Panel (Left)**
   - [ ] 6 operation cards visible
   - [ ] Send Payment Reminders
   - [ ] Generate Statements
   - [ ] Send Payment Receipts
   - [ ] Export Customer Data
   - [ ] Send Bulk Email
   - [ ] Send Bulk SMS
   - [ ] Each has icon and description
   - [ ] Click card → highlights/selects
   - [ ] Click again → stays selected

3. **Unit Selection Panel (Right)**
   - [ ] Title: "Select Units"
   - [ ] "Select All" / "Deselect All" button
   - [ ] Quick filter buttons (All Projects, Active Only, Overdue, High Risk)
   - [ ] Unit list shows ~8 units
   - [ ] Each unit shows: checkbox, unit number, buyer, project, status, risk, balance
   - [ ] Grid layout with 5 columns

4. **Selection Interaction**
   - [ ] Click checkbox on a unit → Unit highlights (red background)
   - [ ] Click again → Deselects
   - [ ] Click "Select All" → All units selected
   - [ ] Click "Deselect All" → All cleared
   - [ ] Selected count updates in summary

5. **Selection Summary Card**
   - [ ] Appears when operation selected
   - [ ] Shows: Selected Units count, Operation name
   - [ ] "Execute Operation" button
   - [ ] Button disabled when no units selected

6. **Execute Operation**
   - [ ] Select an operation (e.g., Send Payment Reminders)
   - [ ] Select 3-4 units
   - [ ] Click "Execute Operation"
   - [ ] Toast: "Bulk operation started"
   - [ ] Selections clear

7. **Recent Tasks Panel**
   - [ ] Shows ~4 recent tasks
   - [ ] Each task shows: status icon, name, target count, created by, date
   - [ ] Status badges colored (Pending, Running, Completed, Failed)
   - [ ] Running tasks show progress bar
   - [ ] Completed tasks show success/failure counts
   - [ ] "Cancel Task" button for running tasks (Manager/Executive only)

8. **Permissions Check (as Encoder)**
   - [ ] Switch to Encoder role
   - [ ] Unit checkboxes disabled
   - [ ] Operation cards disabled
   - [ ] "Execute Operation" button disabled
   - [ ] Shows read-only notice
   - [ ] Cannot cancel tasks

#### 3.8 Activity Log View
**Navigate: Sidebar → Activity Log**

1. **Header**
   - [ ] Title: "Activity Log"
   - [ ] "Export Log" button exists

2. **Filters Panel**
   - [ ] Search bar works
   - [ ] Type "payment" → filters activities
   - [ ] Date range buttons (Today, This Week, This Month, All Time)
   - [ ] Click each → selected state changes
   - [ ] Activity type dropdown (11+ types)
   - [ ] User role dropdown (All, Executive, Manager, Encoder)
   - [ ] Results counter updates

3. **Activity Timeline**
   - [ ] ~15 activity cards visible
   - [ ] Each shows: icon, description, user avatar, role badge, timestamp
   - [ ] Icons colored by activity type
   - [ ] Status indicators (success, warning, error)
   - [ ] Timestamps show relative time ("2 hours ago")
   - [ ] Unit numbers shown when applicable
   - [ ] Amounts shown for payments

4. **Activity Types**
   - [ ] Payment recorded (green)
   - [ ] Payment edited (yellow)
   - [ ] Payment voided (red)
   - [ ] Unit added/updated (blue)
   - [ ] Document uploaded (purple)
   - [ ] Settings changed (gray)
   - [ ] User login/logout
   - [ ] All have appropriate icons

5. **Filtering**
   - [ ] Filter by activity type → Results update
   - [ ] Filter by user role → Shows only that role's activities
   - [ ] Search by unit number → Finds related activities
   - [ ] Combine filters → Works correctly

6. **Summary Stats**
   - [ ] Bottom panel shows 4 stats
   - [ ] Payments Recorded count
   - [ ] Unit Updates count
   - [ ] Documents Uploaded count
   - [ ] User Sessions count

7. **Empty State**
   - [ ] Search for impossible term → Shows empty state
   - [ ] Message is helpful

#### 3.9 Settings View
**Navigate: Sidebar → Settings**
**Ensure you're Executive or Manager role!**

1. **Header**
   - [ ] Title: "System Settings"
   - [ ] Shows "Read-Only Access" badge for Encoder
   - [ ] Permission notice for Encoder

2. **Five Tabs**
   - [ ] Company, Payment Terms, Users, Notifications, System
   - [ ] All tabs clickable
   - [ ] Icons visible on each

3. **Company Tab**
   - [ ] Company logo display (EL initials)
   - [ ] "Upload New Logo" button
   - [ ] 5 form fields: Name, Email, Phone, Website, Address
   - [ ] All fields populated with data
   - [ ] Fields editable (Executive/Manager)
   - [ ] Fields disabled (Encoder)
   - [ ] "Save Changes" button at bottom
   - [ ] Click save → Success toast

4. **Payment Terms Tab**
   - [ ] 5 input fields for terms
   - [ ] Down Payment %, Installment Months, Interest Rate, Late Fee %, Grace Period Days
   - [ ] All have helper text
   - [ ] Example calculation box at bottom
   - [ ] Shows calculated amounts for ₱1M unit
   - [ ] Values update dynamically (if you change inputs)
   - [ ] Save button works

5. **Users Tab**
   - [ ] Shows 3 user cards
   - [ ] Ricardo Santos (Executive)
   - [ ] Ana Martinez (Manager)
   - [ ] Juan Reyes (Encoder)
   - [ ] Each shows avatar, name, email, role badge, status badge
   - [ ] "Edit" button on each (disabled in prototype)
   - [ ] "Add User" button at top
   - [ ] Click buttons → Toast messages
   - [ ] Note about full system at bottom

6. **Notifications Tab**
   - [ ] Three sections: Communication Channels, Alert Types, Scheduled Reports
   - [ ] Each section has toggle switches
   - [ ] Email Notifications toggle
   - [ ] SMS Notifications toggle
   - [ ] Payment Reminders toggle
   - [ ] Overdue Alerts toggle
   - [ ] Weekly Reports toggle
   - [ ] Monthly Reports toggle
   - [ ] All toggles work (click → switches)
   - [ ] Toggles disabled for Encoder
   - [ ] Save button works

7. **System Tab**
   - [ ] 4 dropdown selects: Currency, Date Format, Timezone, Fiscal Year Start
   - [ ] All dropdowns work
   - [ ] System Information panel at bottom
   - [ ] Shows: Version, Last Updated, Database, Environment
   - [ ] All show correct values
   - [ ] Save button works

8. **Permission Testing (Encoder)**
   - [ ] Switch to Encoder
   - [ ] All tabs still visible
   - [ ] All input fields disabled
   - [ ] Save buttons disabled
   - [ ] Click save → Toast: "Permission Denied"

---

### PHASE 4: Customer Portal Testing (20 min)

#### 4.1 Switch to Customer Mode
**From Admin Portal:**
- [ ] Click user avatar (top-right)
- [ ] Scroll down in dropdown
- [ ] Click "Switch to Customer View"
- [ ] Redirects to login page

#### 4.2 Customer Login
1. **Login Page Design**
   - [ ] Beautiful gradient background
   - [ ] EL Construction logo/branding
   - [ ] Login form centered
   - [ ] "Back to Admin" button visible

2. **Login Form**
   - [ ] Unit Number field
   - [ ] Access Code field
   - [ ] "View Demo Units" button
   - [ ] "Sign In" button

3. **Demo Units Modal**
   - [ ] Click "View Demo Units"
   - [ ] Modal opens
   - [ ] Shows 3 sample units: B1-L05, B2-L12, B3-L08
   - [ ] Each shows buyer name and access code
   - [ ] Click "Use This Unit" → Auto-fills form
   - [ ] Modal closes

4. **Login Process**
   - [ ] Use B1-L05 / DEMO123
   - [ ] Click "Sign In"
   - [ ] Successful login → Redirects to dashboard
   - [ ] No errors

#### 4.3 Customer Dashboard
1. **Header**
   - [ ] Shows customer name (Maria Santos)
   - [ ] Shows unit number (B1-L05)
   - [ ] EL Construction branding
   - [ ] Logout button exists

2. **Welcome Section**
   - [ ] Greeting message with customer name
   - [ ] Shows unit and project info

3. **Summary Cards (4 cards)**
   - [ ] Property Value
   - [ ] Total Paid
   - [ ] Remaining Balance
   - [ ] Next Payment Due
   - [ ] All show correct amounts and dates

4. **Progress Section**
   - [ ] Title: "Payment Progress"
   - [ ] Progress bar (visual)
   - [ ] Shows percentage
   - [ ] Shows X of Y installments paid
   - [ ] Color indicates progress (green when high)

5. **Four Tabs**
   - [ ] Overview, Payments, Schedule, Documents
   - [ ] All tabs clickable

6. **Overview Tab**
   - [ ] Property Details section
   - [ ] Shows lot area, floor area, type
   - [ ] Payment Plan section
   - [ ] Shows down payment, monthly amount, duration
   - [ ] Quick Actions section
   - [ ] "Make Payment" button
   - [ ] "Download Statement" button
   - [ ] "Contact Support" button
   - [ ] All buttons show toasts

7. **Payments Tab**
   - [ ] Payment history table
   - [ ] Shows multiple payments
   - [ ] Each shows: date, OR number, amount, method, status
   - [ ] Paid payments have green badges
   - [ ] Table is sorted (newest first)

8. **Schedule Tab**
   - [ ] Payment schedule table
   - [ ] Shows all installments
   - [ ] Each shows: installment number, due date, amount, status
   - [ ] Paid installments marked (green checkmark)
   - [ ] Upcoming installments (blue)
   - [ ] Overdue (if any) in red

9. **Documents Tab**
   - [ ] Document cards displayed
   - [ ] Each shows: icon, filename, category, date
   - [ ] "Download" button on each
   - [ ] Click download → Toast message
   - [ ] Shows contracts, receipts, statements

10. **Logout**
    - [ ] Click "Logout" button
    - [ ] Returns to login page
    - [ ] Can re-login successfully

#### 4.4 Payment Proof Flow (End-to-End)
1. **Customer Submission**
   - [ ] Click "Make Payment"
   - [ ] Select one unpaid schedule month
   - [ ] Amount auto-locks to the selected total
   - [ ] Submit payment proof → Success toast

2. **Admin Approval**
   - [ ] Switch back to Admin → Payment Requests
   - [ ] Locate the pending request
   - [ ] Confirm schedule months listed
   - [ ] Approve payment → Success toast

3. **Payment History Sync**
   - [ ] Open the unit detail view
   - [ ] Payment history shows the new payment
   - [ ] Schedule month status updates to Paid

#### 4.4 Test Different Customer Units
**Login as each demo unit:**

1. **B1-L05 (Maria Santos)**
   - [ ] Login successful
   - [ ] Data shows correctly
   - [ ] Has payment history
   - [ ] Has documents

2. **B2-L12 (Juan Reyes)**
   - [ ] Login successful
   - [ ] Different data than B1-L05
   - [ ] Different payment amounts
   - [ ] Different progress %

3. **B3-L08 (Ana Garcia)**
   - [ ] Login successful
   - [ ] Unique data
   - [ ] Works independently

#### 4.5 Return to Admin
- [ ] From customer login, click "Back to Admin"
- [ ] Returns to admin portal
- [ ] Resumes at previous view
- [ ] Role is preserved

---

### PHASE 5: Navigation & Flow Testing (10 min)

#### 5.1 Sidebar Navigation
**Test each menu item:**
- [ ] Dashboard → Loads correctly
- [ ] Collections → Loads correctly
- [ ] Reports → Loads correctly
- [ ] Documents → Loads correctly
- [ ] Communications → Loads correctly
- [ ] Bulk Operations → Loads correctly
- [ ] Activity Log → Loads correctly
- [ ] Settings → Loads correctly

**Test navigation flow:**
- [ ] Click between views rapidly → No errors
- [ ] Return to Dashboard → Still works
- [ ] Previous view data is preserved

#### 5.2 Deep Linking
**Test unit detail navigation:**
- [ ] Dashboard → Click unit → Unit Detail View
- [ ] Collections → Click unit → Unit Detail View
- [ ] Unit Detail → Click Back → Returns to previous view
- [ ] Correct view remembered (Dashboard or Collections)

#### 5.3 Cross-View Actions
- [ ] Dashboard → "View All Collections" → Goes to Collections
- [ ] Collections → "Send Reminder" → Toast appears
- [ ] Reports → Click export → Toast appears
- [ ] Activity Log → Click export → Toast appears

---

### PHASE 6: Data Consistency Testing (10 min)

#### 6.1 Unit Data Consistency
**Pick one unit (e.g., B1-L05) and verify across views:**

1. **Dashboard**
   - [ ] Note: Total Amount, Balance, Status
   
2. **Unit Detail View**
   - [ ] Same values appear
   - [ ] Payment history matches
   - [ ] Schedule shows same installment plan

3. **Collections View**
   - [ ] Same balance shown
   - [ ] Same overdue amount (if applicable)

4. **Customer Portal (login as B1-L05)**
   - [ ] Same total amount
   - [ ] Same balance
   - [ ] Same payment history

**All values should match! ✓**

#### 6.2 Payment Recording Test
**Test if recording payment updates views:**

1. [ ] Go to Unit Detail (B1-L05)
2. [ ] Note current balance (e.g., ₱125,000)
3. [ ] Click "Record Payment"
4. [ ] Enter ₱25,000
5. [ ] Submit
6. [ ] Check Payment History → New entry appears
7. [ ] Check if balance updates (may be mock, but check)
8. [ ] Go to Activity Log → Check if "Payment Recorded" activity appears

**Note: In prototype, some updates may be visual only**

---

### PHASE 7: UI/UX Polish Testing (15 min)

#### 7.1 Responsive Design
**Resize browser window:**
- [ ] 1920px wide → Layout looks good
- [ ] 1440px wide → Layout adjusts
- [ ] 1024px wide → Still usable
- [ ] Sidebar still accessible
- [ ] Tables stack/scroll appropriately
- [ ] Cards reflow

#### 7.2 Hover States
**Test interactive elements:**
- [ ] Buttons change on hover
- [ ] Sidebar items highlight on hover
- [ ] Unit cards highlight on hover
- [ ] Tabs show hover state
- [ ] Dropdowns show hover

#### 7.3 Loading States
**Check for loading indicators:**
- [ ] Modals open smoothly
- [ ] Charts render without flash
- [ ] No "undefined" or "NaN" anywhere
- [ ] All data loads completely

#### 7.4 Toast Notifications
**Test toast system:**
- [ ] Record payment → Green success toast
- [ ] Permission denied → Red error toast
- [ ] Role change → Blue info toast
- [ ] All toasts auto-dismiss after ~3 seconds
- [ ] Toasts stack if multiple appear
- [ ] Toasts are readable

#### 7.5 Modal Behavior
**Test all modals:**
1. **Payment Detail Modal**
   - [ ] Opens from Payment History
   - [ ] Shows all payment info
   - [ ] Close button (X) works
   - [ ] Click outside → Closes
   - [ ] Escape key → Closes

2. **Record Payment Modal**
   - [ ] Opens from button
   - [ ] Form fields work
   - [ ] Cancel button closes
   - [ ] Submit button works
   - [ ] Close X works

3. **Demo Units Modal (Customer Login)**
   - [ ] Opens from button
   - [ ] Shows units
   - [ ] Close works
   - [ ] Auto-fill works

#### 7.6 Form Validation
**Test input validation:**

1. **Record Payment Modal**
   - [ ] Try entering negative amount → Prevented or shows error
   - [ ] Try empty fields → Validation message
   - [ ] Try very large amount → Accepted
   - [ ] Date picker works
   - [ ] Dropdown selection works

2. **Settings Forms**
   - [ ] Enter text in number fields → Validates
   - [ ] Required fields marked
   - [ ] Save with invalid data → Shows error

#### 7.7 Typography & Spacing
**Visual consistency check:**
- [ ] All headings use consistent sizes
- [ ] Body text is readable (not too small)
- [ ] Spacing between sections is consistent
- [ ] No text overlapping
- [ ] No truncated text (unless intentional ellipsis)
- [ ] Currency formatted correctly (₱ symbol, commas)
- [ ] Dates formatted consistently (e.g., "Dec 27, 2024")

#### 7.8 Color Usage
**Brand consistency:**
- [ ] Primary red (#EF4444) used for:
  - [ ] Primary buttons
  - [ ] Accent colors
  - [ ] Selected states
  - [ ] Brand elements
- [ ] Status colors correct:
  - [ ] Green for success/active/paid
  - [ ] Red for error/overdue/high risk
  - [ ] Yellow/Amber for warning/medium risk
  - [ ] Blue for info/pending
  - [ ] Gray for inactive/neutral

---

### PHASE 8: Edge Cases & Error Handling (10 min)

#### 8.1 Empty States
**Test when no data:**
- [ ] Search with no results → Shows empty state
- [ ] Filter with no matches → Shows empty state
- [ ] New customer with no payments → Graceful display
- [ ] Empty state messages are helpful

#### 8.2 Large Numbers
**Test with extreme values:**
- [ ] View unit with very large balance (₱10M+) → Displays correctly
- [ ] Check currency formatting with large numbers
- [ ] Progress bars don't break with 0% or 100%

#### 8.3 Long Text
**Test text overflow:**
- [ ] Unit with very long buyer name → Truncates or wraps
- [ ] Long project names → Handled
- [ ] Long template content → Displays in scrollable area
- [ ] Long filenames → Truncate with ellipsis

#### 8.4 Rapid Clicking
**Test for race conditions:**
- [ ] Click sidebar items rapidly → No errors
- [ ] Spam-click buttons → No duplicate actions
- [ ] Open/close modals quickly → No UI glitches

#### 8.5 Browser Compatibility
**Test in different browsers:**
- [ ] Chrome → Works perfectly
- [ ] Firefox → Check for differences
- [ ] Safari → Check for differences
- [ ] Edge → Check for differences

---

### PHASE 9: Performance Check (5 min)

#### 9.1 Console Check
**Open DevTools (F12) → Console tab:**
- [ ] No red errors
- [ ] No warnings (yellow)
- [ ] No "Failed to fetch" errors
- [ ] No "undefined" errors

#### 9.2 Network Tab
**DevTools → Network tab:**
- [ ] No failed requests (red)
- [ ] All assets load (images, fonts)
- [ ] No 404 errors

#### 9.3 Rendering Performance
**Visual smoothness:**
- [ ] Scrolling is smooth (no jank)
- [ ] Charts render without lag
- [ ] Modal animations are smooth
- [ ] Page transitions are instant
- [ ] No flashing/flickering content

---

### PHASE 10: Business Logic Testing (10 min)

#### 10.1 Payment Calculations
**Verify math is correct:**
- [ ] Unit Detail → Check Total = Down Payment + Balance
- [ ] Check Monthly Payment = Balance / Installment Months
- [ ] Check Progress % = (Paid / Total) × 100
- [ ] Settings → Payment Terms calculator shows correct math

#### 10.2 Risk Level Logic
**Check risk assessment:**
- [ ] Units with 0-30 days overdue → Low or Medium risk
- [ ] Units with 60+ days overdue → High risk
- [ ] Risk badge colors match severity
- [ ] Collections view filters by risk correctly

#### 10.3 Collection Rate
**Dashboard KPI:**
- [ ] Collection Rate % makes sense
- [ ] Should be (Collections / Revenue) × 100
- [ ] Should be between 0-100%

#### 10.4 Date Logic
**Check date handling:**
- [ ] "Next Payment Due" dates are in the future
- [ ] Overdue dates are in the past
- [ ] Activity timestamps show relative time correctly
- [ ] Date formats are consistent (MM/DD/YYYY)

---

## 🐛 BUG TRACKING TEMPLATE

### Found a Bug?
Use this format to document:

```
BUG #[number]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 LOCATION: [View/Component Name]
🔴 SEVERITY: [Critical / High / Medium / Low]
👤 ROLE: [Executive / Manager / Encoder / Customer]

📝 DESCRIPTION:
[What went wrong?]

🔁 STEPS TO REPRODUCE:
1. [First step]
2. [Second step]
3. [Third step]

✅ EXPECTED BEHAVIOR:
[What should happen?]

❌ ACTUAL BEHAVIOR:
[What actually happened?]

💡 SUGGESTED FIX (optional):
[How to fix it?]
```

---

## 📊 TESTING COMPLETION SCORECARD

After testing, fill this out:

```
ADMIN PORTAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ ] Dashboard - 100% tested
[ ] Collections - 100% tested
[ ] Reports - 100% tested
[ ] Documents - 100% tested
[ ] Communications - 100% tested
[ ] Bulk Operations - 100% tested
[ ] Activity Log - 100% tested
[ ] Settings - 100% tested

CUSTOMER PORTAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ ] Login - 100% tested
[ ] Dashboard - 100% tested
[ ] All Tabs - 100% tested

ROLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ ] Executive - All permissions tested
[ ] Manager - Restrictions tested
[ ] Encoder - Read-only tested

CRITICAL FEATURES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ ] Payment recording works
[ ] Role switching works
[ ] Navigation works
[ ] Modals work
[ ] Toasts work
[ ] Charts render
[ ] Forms validate
[ ] Permissions enforced

TOTAL BUGS FOUND: ___
TOTAL TESTS PASSED: ___
OVERALL QUALITY: [ ] Ready for Demo [ ] Needs Polish [ ] Needs Fixes
```

---

## ✨ DEMO PREPARATION CHECKLIST

Before showing to clients:

### Pre-Demo Setup
- [ ] Clear browser cache
- [ ] Open in clean browser window
- [ ] Set to Executive role
- [ ] Set to "All Projects"
- [ ] Close DevTools console
- [ ] Full screen browser (F11)
- [ ] Close other tabs/apps

### Demo Flow Recommendation
1. **Start with Executive Dashboard** (1-2 min)
   - Show KPIs and charts
   - Highlight real-time data
   
2. **Click a Unit** (1 min)
   - Show detailed unit view
   - Navigate tabs
   
3. **Record a Payment** (1 min)
   - Open modal
   - Fill form
   - Show success
   
4. **Show Collections** (1 min)
   - Filter by risk
   - Show overdue tracking
   
5. **Show Reports** (1 min)
   - Switch time periods
   - Show export options
   
6. **Show Communications** (1 min)
   - Show templates
   - Highlight automation
   
7. **Show Customer Portal** (1-2 min)
   - Switch mode
   - Login as customer
   - Show self-service
   
8. **Show Role System** (1 min)
   - Switch roles
   - Show permissions

**TOTAL: ~10 minutes**

### Common Questions to Prepare For
- "Can we customize the payment terms?" → YES (Settings)
- "Can we brand it with our logo?" → YES (Settings → Company)
- "Can customers access this?" → YES (Customer Portal)
- "How do we track who did what?" → Activity Log
- "Can we send bulk messages?" → YES (Communications + Bulk Ops)
- "What reports can we export?" → Show Reports view
- "Is this the final design?" → This is the clickable prototype, actual build can be customized

---

## 🎯 SUCCESS CRITERIA

The prototype is **DEMO-READY** if:
- ✅ Zero critical bugs
- ✅ All core flows work smoothly
- ✅ Role system works correctly
- ✅ Customer portal works
- ✅ Charts and data display correctly
- ✅ No console errors
- ✅ Professional appearance
- ✅ Fast performance

The prototype **EXCEEDS EXPECTATIONS** if:
- ✅ All of the above, PLUS:
- ✅ Delightful animations
- ✅ Helpful empty states
- ✅ Intuitive without explanation
- ✅ Looks production-ready
- ✅ Mobile-friendly (bonus)

---

Good luck with testing! 🚀
