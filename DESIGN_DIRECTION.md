# Design Direction: Clean Modern Dashboard (Bringova-Style)

## Overview
A light, airy dashboard design with soft shadows, generous spacing, and subtle color accents. The design emphasizes readability and simplicity over visual density.

---

## Color Palette

### Background Colors
- **Page Background**: Very light lavender gradient (`bg-gradient-to-br from-purple-50/30 via-white to-purple-50/30`)
- **Card Background**: Pure white (`bg-white`)
- **Sidebar Background**: Pure white (`bg-white`)
- **Table Row (Alternate)**: Very light gray (`bg-gray-50/50`)
- **Table Row (Hover)**: Light gray (`hover:bg-gray-100/50`)

### Accent Colors
- **Primary Accent**: Coral/Red (`#EF4444` or `bg-red-500`) - Used for active states, key actions, warnings
- **Secondary Accent**: Amber/Yellow (`#F59E0B` or `bg-amber-500`) - Used for pending/in-progress states
- **Success**: Green (`#10B981` or `bg-green-500`) - Used for completed states
- **Neutral**: Gray (`#6B7280` or `text-gray-500`) - Used for secondary text

### Text Colors
- **Primary Text**: Near-black (`text-gray-900`)
- **Secondary Text**: Medium gray (`text-gray-500` or `text-gray-600`)
- **Muted Text**: Light gray (`text-gray-400`)

---

## Typography

### Font Family
- **Headings**: Sans-serif, medium-to-bold weight (500-600)
- **Body**: Sans-serif, regular weight (400)
- **Use system fonts**: `font-sans` (Inter, SF Pro, or similar)

### Hierarchy
- **Page Title**: `text-2xl font-semibold text-gray-900` (e.g., "Order History")
- **Section Headers**: `text-base font-medium text-gray-900`
- **Body Text**: `text-sm text-gray-600`
- **Secondary Info**: `text-xs text-gray-500`
- **Labels/Badges**: `text-xs font-medium`

---

## Layout & Spacing

### Container Structure
```
[Sidebar: 240px fixed width] | [Main Content: flex-1 with max-width constraint]
```

### Spacing System
- **Card Padding**: `p-6` (24px) or `p-8` (32px) for large cards
- **Section Gaps**: `gap-6` (24px) between major sections
- **Element Gaps**: `gap-3` or `gap-4` (12px-16px) between related elements
- **Table Row Padding**: `py-4 px-6` (vertical: 16px, horizontal: 24px)

### Max Width
- Main content area: `max-w-7xl mx-auto` (constrain to ~1280px, centered)

---

## Component Styling

### Cards
```
bg-white 
rounded-xl (12px border radius)
shadow-sm (very subtle: 0 1px 2px rgba(0,0,0,0.05))
p-6 or p-8
border-none (no visible borders, shadow only)
```

### Sidebar Navigation
```
- White background (bg-white)
- Fixed width: w-60 (240px)
- Vertical list of nav items
- Each item:
  - flex items-center gap-3
  - px-4 py-3
  - rounded-lg (when hovered/active)
  - Icon + Text layout
  - Active state: bg-red-50 text-red-600 (light background + colored text/icon)
  - Hover state: bg-gray-50
  - Default state: text-gray-600
```

### Table/List Rows
```
- Alternating backgrounds: bg-white and bg-gray-50/50
- Row structure:
  - py-4 px-6
  - grid or flex layout for columns
  - hover:bg-gray-100/50 transition-colors
- Borders: No visible borders between rows, rely on alternating backgrounds
- Corner rounding: First/last rows have rounded corners (rounded-t-lg / rounded-b-lg)
```

### Tabs
```
- Horizontal flex layout
- Each tab:
  - px-4 py-2
  - text-sm font-medium
  - Default: text-gray-500
  - Active: text-red-600 border-b-2 border-red-600
  - Hover: text-gray-700
- Underline indicator for active tab (not background fill)
```

### Status Badges/Pills
```
- Small, rounded pills: px-2.5 py-1 rounded-full
- Text: text-xs font-medium
- Colors based on status:
  - Delivered/Success: bg-amber-100 text-amber-700
  - Cancelled/Error: bg-red-100 text-red-700
  - Collected/Neutral: bg-gray-100 text-gray-700
  - In Progress: bg-blue-100 text-blue-700
- Include small dot indicator: 
  - w-1.5 h-1.5 rounded-full bg-[color]-500
  - Positioned before text
```

### Buttons

**Primary Button**:
```
bg-red-500 hover:bg-red-600
text-white
px-4 py-2
rounded-lg
text-sm font-medium
shadow-sm
transition-colors
```

**Secondary Button**:
```
bg-white hover:bg-gray-50
text-gray-700
border border-gray-300
px-4 py-2
rounded-lg
text-sm font-medium
transition-colors
```

**Icon-only Button** (three-dot menu):
```
p-2
hover:bg-gray-100
rounded-lg
text-gray-500
transition-colors
```

### Input Fields
```
- Border: border border-gray-300
- Background: bg-white
- Padding: px-3 py-2
- Rounded: rounded-lg
- Focus: ring-2 ring-red-500/20 border-red-500
- Text: text-sm
- Placeholder: text-gray-400
```

### Date Picker
```
- Display as button-like input
- Icon (calendar) on left
- Text in center
- Border: border border-gray-300
- Rounded: rounded-lg
- Hover: bg-gray-50
```

### Avatars
```
- Circular: rounded-full
- Size: w-8 h-8 (32px) or w-10 h-10 (40px)
- Border: Optional ring-2 ring-white (if overlapping)
- Fallback: bg-gray-200 with initials
```

### Dropdown/Context Menu
```
- White background: bg-white
- Shadow: shadow-lg (0 10px 15px rgba(0,0,0,0.1))
- Border: border border-gray-200
- Rounded: rounded-lg
- Padding: py-1
- Items:
  - px-4 py-2
  - hover:bg-gray-100
  - text-sm text-gray-700
  - cursor-pointer
```

---

## Shadows

### Philosophy
Use shadows for elevation, NOT borders for separation.

### Shadow Scale
- **Card/Container**: `shadow-sm` (0 1px 2px rgba(0,0,0,0.05))
- **Dropdown/Modal**: `shadow-lg` (0 10px 15px rgba(0,0,0,0.1))
- **Hover State**: `hover:shadow-md` (0 4px 6px rgba(0,0,0,0.07))

**Never use**: Harsh shadows or dark borders

---

## Border Radius

- **Large Cards**: `rounded-xl` (12px)
- **Buttons/Inputs**: `rounded-lg` (8px)
- **Small Pills/Badges**: `rounded-full`
- **Avatars**: `rounded-full`
- **Modals**: `rounded-2xl` (16px)

---

## Icons

### Style
- **Outlined/Stroke icons** (not filled)
- **Size**: `w-5 h-5` (20px) for nav items, `w-4 h-4` (16px) for inline icons
- **Color**: Match text color or use accent color for active states
- **Library**: Lucide React or similar minimal icon set

### Usage
- Navigation items: Icon on left, text on right
- Table columns: Small icons for time, status
- Action buttons: Icon-only or icon + text

---

## Transitions & Interactions

### Hover States
```css
transition-colors duration-150
hover:bg-gray-50 (for subtle elements)
hover:bg-red-600 (for primary buttons)
hover:shadow-md (for cards)
```

### Active States
- Sidebar nav: Background fill (bg-red-50) + text color change (text-red-600)
- Tabs: Underline indicator (border-b-2 border-red-600)
- Buttons: Slight darkening of background

### Focus States
- Ring-based focus: `focus:ring-2 focus:ring-red-500/20 focus:border-red-500`
- Never remove focus indicators for accessibility

---

## Special Components

### Search Bar (Header)
```
- White background
- Border: border border-gray-300
- Icon (search) on left
- Placeholder text: light gray
- Rounded: rounded-lg
- Width: w-64 or similar
```

### Status Button (Header - "Open For Order")
```
- Display as pill/badge
- Green dot indicator: w-2 h-2 rounded-full bg-green-500
- Text: "Open For Order"
- Background: bg-green-50
- Text color: text-green-700
- Padding: px-3 py-1.5
- Rounded: rounded-full
```

### User Profile (Header)
```
- Avatar (rounded-full) + Name + Dropdown icon
- Flex layout: items-center gap-2
- Clickable: hover:bg-gray-100 rounded-lg px-3 py-2
- Name: text-sm font-medium text-gray-900
```

---

## Data Table Specifics

### Column Headers
```
- Text: text-xs font-medium text-gray-500 uppercase tracking-wide
- Padding: pb-3 px-6
- Background: bg-gray-50/50 (very subtle)
- Sortable columns: cursor-pointer with sort icon
```

### Cell Content Alignment
- **Order ID**: Left-aligned, monospace if numbers
- **Name**: Left-aligned, with avatar
- **Payment/Type**: Left-aligned
- **Status**: Left-aligned, use badge/pill
- **Time/Price**: Left-aligned or right-aligned
- **Actions**: Right-aligned (three-dot menu)

### Row Behavior
```
- On hover: Slight background change (hover:bg-gray-100/50)
- Clickable rows: cursor-pointer
- Selected row: bg-red-50/30 (very subtle highlight)
```

---

## Overall Design Principles

1. **Light & Airy**: Generous whitespace, don't cram elements
2. **Soft Shadows > Hard Borders**: Use elevation instead of lines
3. **Subtle Colors**: Pastels for backgrounds, bold colors only for accents
4. **Readability First**: High contrast text, comfortable font sizes
5. **Consistent Rounding**: Everything has rounded corners (8-12px)
6. **Minimal Borders**: Only where absolutely necessary (inputs, some separators)
7. **Status Through Color**: Red = urgent/cancelled, Yellow = pending, Green = success, Gray = neutral
8. **Icons as Helpers**: Not decorative, functional (show time, payment method, etc.)

---

## Implementation Checklist

- [ ] Page has subtle gradient background (lavender/purple tint)
- [ ] Sidebar is pure white, fixed width, vertical nav
- [ ] Main content area is white card with soft shadow
- [ ] Table rows alternate between white and very light gray
- [ ] Status badges are colorful pills with dot indicators
- [ ] All corners are rounded (no sharp edges)
- [ ] Hover states are smooth (transition-colors)
- [ ] Text hierarchy is clear (bold headings, regular body)
- [ ] Icons are outlined style, not filled
- [ ] Active nav item has red accent (background + text)
- [ ] No harsh borders anywhere (only subtle shadows)

---

## Code Example (Tailwind CSS)

```tsx
// Page wrapper
<div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-white to-purple-50/30">
  
  {/* Sidebar */}
  <aside className="w-60 bg-white h-screen fixed left-0 top-0 shadow-sm">
    {/* Nav items */}
    <button className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
      <IconComponent className="w-5 h-5" />
      <span className="text-sm font-medium">Nav Item</span>
    </button>
    
    {/* Active nav item */}
    <button className="flex items-center gap-3 px-4 py-3 bg-red-50 text-red-600 rounded-lg">
      <IconComponent className="w-5 h-5" />
      <span className="text-sm font-medium">Active Item</span>
    </button>
  </aside>
  
  {/* Main content */}
  <main className="ml-60 p-8">
    <div className="max-w-7xl mx-auto">
      
      {/* Card */}
      <div className="bg-white rounded-xl shadow-sm p-8">
        
        {/* Page title */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Order History</h1>
        
        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-200 mb-6">
          <button className="pb-2 text-sm font-medium text-red-600 border-b-2 border-red-600">
            All Order
          </button>
          <button className="pb-2 text-sm font-medium text-gray-500 hover:text-gray-700">
            Summary
          </button>
        </div>
        
        {/* Table */}
        <div className="space-y-1">
          {/* Row (alternate: bg-white and bg-gray-50/50) */}
          <div className="grid grid-cols-7 gap-4 py-4 px-6 bg-gray-50/50 hover:bg-gray-100/50 rounded-lg transition-colors">
            <div className="text-sm text-gray-900">#2832</div>
            <div className="flex items-center gap-2">
              <img src="avatar.jpg" className="w-8 h-8 rounded-full" />
              <span className="text-sm text-gray-900">Brooklyn Zoe</span>
            </div>
            <div className="text-sm text-gray-600">Cash</div>
            <div className="text-sm text-gray-600">13 min</div>
            <div className="text-sm text-red-600">Delivery</div>
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                Delivered
              </span>
            </div>
            <div className="text-sm font-medium text-gray-900">£12.00</div>
          </div>
        </div>
        
      </div>
      
    </div>
  </main>
  
</div>
```

---

## Final Note

This design is about **simplicity and elegance through restraint**. Every element should feel light, spacious, and easy to scan. Avoid:
- Heavy borders
- Dark shadows
- Dense layouts
- Too many colors
- Complex gradients

Keep it clean, keep it soft, keep it readable.
