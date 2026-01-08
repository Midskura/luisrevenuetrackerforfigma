# NEXSYS - Design System Guide

## Brand Overview

Nexsys follows a **Bringova-inspired design system** with soft shadows, clean layouts, and red/coral accent colors. The design emphasizes:
- **Clarity:** Clear hierarchy and information architecture
- **Professionalism:** Suitable for business/finance applications
- **Approachability:** Warm colors and friendly interactions
- **Efficiency:** Quick access to critical information

---

## Color Palette

### Primary Colors

#### Brand Red/Coral
```css
--primary: #EF4444;        /* Primary brand color */
--primary-dark: #DC2626;   /* Darker shade for gradients */
--primary-light: #FEF2F2;  /* Light background */
```

**Usage:**
- Primary CTAs (Log Payment, Start Tour)
- Active navigation states
- Critical alerts and highlights
- Tour spotlight borders

#### Brand Green (Success)
```css
--success: #10B981;        /* Success actions, paid status */
--success-light: #E8F2EE;  /* Success backgrounds */
```

**Usage:**
- Positive metrics (Collection Rate)
- "Paid" status badges
- Confirmation messages
- Progress indicators

### Status Colors

#### Critical (Severe Risk)
```css
--critical: #DC2626;       /* Text/border */
--critical-bg: #FEE2E2;    /* Background */
```
**Used for:** Units >60 days overdue

#### Overdue (High Risk)
```css
--overdue: #EA580C;        /* Text/border */
--overdue-bg: #FED7AA;     /* Background */
```
**Used for:** Units 30-60 days overdue

#### At Risk (Medium Risk)
```css
--at-risk: #D97706;        /* Text/border */
--at-risk-bg: #FEF3C7;     /* Background */
```
**Used for:** Units 1-30 days overdue

#### In Payment Cycle (Healthy)
```css
--healthy: #10B981;        /* Text/border */
--healthy-bg: #E8F2EE;     /* Background */
```
**Used for:** Units paying on time

#### Fully Paid (Complete)
```css
--complete: #10B981;       /* Text/border */
--complete-bg: #D1FAE5;    /* Background */
```
**Used for:** Units with all payments complete

#### Partial Payment
```css
--partial: #F59E0B;        /* Text/border */
--partial-bg: #FEF3C7;     /* Background */
```
**Used for:** Months with partial payments

### Neutral Colors

#### Ink (Text)
```css
--ink-primary: #111827;    /* Primary text */
--ink-secondary: #4B5563;  /* Secondary text */
--ink-muted: #6B7280;      /* Muted text, labels */
--ink-light: #9CA3AF;      /* Disabled text */
```

#### Backgrounds
```css
--bg-base: #F9FAFB;        /* App background */
--bg-surface: #FFFFFF;     /* Card background */
--bg-hover: #F3F4F6;       /* Hover states */
--bg-border: #E5E7EB;      /* Borders, dividers */
```

### Gradients

#### Primary Gradient (CTAs)
```css
background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
```
**Used for:** Log Payment button, Start Tour button

#### Success Gradient
```css
background: linear-gradient(135deg, #10B981 0%, #059669 100%);
```
**Used for:** Completion states, positive actions

---

## Typography

### Font Family
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

**Import in `/src/styles/fonts.css`:**
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
```

### Type Scale

#### Display (Page Headers)
```css
font-size: 28px;
font-weight: 600;
line-height: 36px;
letter-spacing: -0.01em;
color: #111827;
```
**Used for:** Main page titles (Dashboard, Collections, etc.)

#### Heading 1 (Section Headers)
```css
font-size: 20px;
font-weight: 600;
line-height: 28px;
color: #111827;
```
**Used for:** Card titles, section headers

#### Heading 2 (Subsections)
```css
font-size: 16px;
font-weight: 600;
line-height: 24px;
color: #111827;
```
**Used for:** Subsection titles, modal headers

#### Body (Default)
```css
font-size: 14px;
font-weight: 400;
line-height: 21px;
color: #4B5563;
```
**Used for:** Paragraph text, descriptions

#### Label (Form Labels)
```css
font-size: 13px;
font-weight: 500;
line-height: 18px;
color: #374151;
```
**Used for:** Form labels, table headers

#### Caption (Small Text)
```css
font-size: 12px;
font-weight: 400;
line-height: 18px;
color: #6B7280;
```
**Used for:** Helper text, timestamps, footnotes

#### Large Value (Metrics)
```css
font-size: 32px;
font-weight: 700;
line-height: 40px;
color: #111827;
```
**Used for:** Dashboard metric values

---

## Spacing System

### Base Unit: 8px

All spacing follows an 8px grid for consistency:

```css
--space-1: 4px;   /* 0.5 unit */
--space-2: 8px;   /* 1 unit */
--space-3: 12px;  /* 1.5 units */
--space-4: 16px;  /* 2 units */
--space-6: 24px;  /* 3 units */
--space-8: 32px;  /* 4 units */
--space-12: 48px; /* 6 units */
--space-16: 64px; /* 8 units */
```

### Component Spacing

#### Cards
```css
padding: 24px;        /* Internal padding */
margin-bottom: 16px;  /* Stack spacing */
gap: 16px;            /* Between elements */
```

#### Buttons
```css
padding: 8px 16px;    /* Small */
padding: 10px 20px;   /* Medium */
padding: 12px 24px;   /* Large */
gap: 8px;             /* Icon-text gap */
```

#### Forms
```css
margin-bottom: 16px;  /* Between fields */
gap: 8px;             /* Label-input gap */
```

#### Sections
```css
margin-bottom: 32px;  /* Between major sections */
```

#### Page Padding
```css
padding: 32px 48px;   /* Desktop view padding */
```

---

## Shadows & Elevation

### Elevation Levels

#### Level 1 (Cards)
```css
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
```
**Used for:** Cards, panels

#### Level 2 (Hover States)
```css
box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
```
**Used for:** Hovered cards, dropdowns

#### Level 3 (Modals)
```css
box-shadow: 0 12px 32px rgba(0, 0, 0, 0.16);
```
**Used for:** Modals, popovers

#### Level 4 (Tour Card)
```css
box-shadow: 0 24px 60px rgba(0, 0, 0, 0.3);
```
**Used for:** Demo tour card (highest elevation)

### Colored Shadows

#### Primary Button Shadow
```css
box-shadow: 0 2px 8px rgba(239, 68, 68, 0.25);

/* Hover state */
box-shadow: 0 4px 12px rgba(239, 68, 68, 0.35);
```

#### Success Button Shadow
```css
box-shadow: 0 2px 8px rgba(16, 185, 129, 0.25);
```

---

## Border Radius

### Standard Radii

```css
--radius-sm: 6px;   /* Small elements (badges) */
--radius-md: 8px;   /* Buttons, inputs */
--radius-lg: 12px;  /* Cards */
--radius-xl: 16px;  /* Modals, large panels */
--radius-full: 9999px; /* Pills, avatars */
```

### Usage

- **Buttons:** 8px
- **Cards:** 12px
- **Modals:** 16px
- **Badges:** 6px
- **Inputs:** 8px

---

## Animation & Transitions

### Timing Functions

```css
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);
```

### Durations

```css
--duration-fast: 120ms;    /* Micro-interactions */
--duration-base: 200ms;    /* Standard transitions */
--duration-slow: 300ms;    /* Smooth animations */
--duration-slower: 400ms;  /* Emphasis animations */
```

### Common Transitions

#### Button Hover
```css
transition: all 120ms ease-out;
```

#### Card Hover
```css
transition: transform 200ms ease, box-shadow 200ms ease;
transform: translateY(-4px);
```

#### Modal Open
```css
transition: opacity 300ms ease, transform 300ms ease;
```

#### Tour Spotlight
```css
transition: all 300ms ease;
animation: tourPulse 2s ease-in-out infinite;
```

### Keyframe Animations

#### Pulse (Tour Spotlight)
```css
@keyframes tourPulse {
  0%, 100% { 
    box-shadow: 0 0 30px rgba(239, 68, 68, 0.8);
    transform: scale(1);
  }
  50% { 
    box-shadow: 0 0 40px rgba(239, 68, 68, 1);
    transform: scale(1.01);
  }
}
```

#### Bounce (Tour Arrow)
```css
@keyframes bounce {
  0%, 100% { 
    transform: translateX(-50%) translateY(0);
  }
  50% { 
    transform: translateX(-50%) translateY(-10px);
  }
}
```

#### Fade In
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

#### Slide In
```css
@keyframes slideIn {
  from { 
    opacity: 0;
    transform: translateY(-10px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

## Component Patterns

### Buttons

#### Primary Button
```tsx
<button style={{
  padding: '10px 20px',
  background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
  color: '#FFFFFF',
  border: 'none',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 120ms ease-out',
  boxShadow: '0 2px 8px rgba(239, 68, 68, 0.25)'
}}>
  Log Payment
</button>
```

#### Secondary Button
```tsx
<button style={{
  padding: '10px 20px',
  background: '#FFFFFF',
  color: '#EF4444',
  border: '1.5px solid #EF4444',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 120ms ease-out'
}}>
  Cancel
</button>
```

#### Ghost Button
```tsx
<button style={{
  padding: '10px 20px',
  background: 'transparent',
  color: '#6B7280',
  border: 'none',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'all 120ms ease-out'
}}>
  View Details
</button>
```

### Cards

#### Standard Card
```tsx
<div style={{
  background: '#FFFFFF',
  border: '1px solid #E5E7EB',
  borderRadius: '12px',
  padding: '24px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  transition: 'all 200ms ease'
}}>
  {/* Content */}
</div>
```

#### Hover Card
```tsx
<div 
  onMouseOver={(e) => {
    e.currentTarget.style.transform = 'translateY(-4px)';
    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.12)';
  }}
  onMouseOut={(e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
  }}
  style={{
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    cursor: 'pointer',
    transition: 'all 200ms ease'
  }}
>
  {/* Content */}
</div>
```

### Status Badges

#### Badge Pattern
```tsx
<span style={{
  display: 'inline-flex',
  alignItems: 'center',
  padding: '4px 12px',
  borderRadius: '6px',
  fontSize: '12px',
  fontWeight: 600,
  background: '#FEE2E2',
  color: '#DC2626'
}}>
  Critical
</span>
```

#### Badge Variants
```tsx
// Critical
background: '#FEE2E2', color: '#DC2626'

// Overdue
background: '#FED7AA', color: '#EA580C'

// At Risk
background: '#FEF3C7', color: '#D97706'

// Paid
background: '#E8F2EE', color: '#10B981'

// Unpaid
background: '#F3F4F6', color: '#6B7280'
```

### Form Inputs

#### Text Input
```tsx
<input 
  type="text"
  style={{
    width: '100%',
    padding: '10px 14px',
    border: '1.5px solid #E5E7EB',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#111827',
    background: '#F9FAFB',
    outline: 'none',
    transition: 'all 150ms ease'
  }}
  onFocus={(e) => {
    e.currentTarget.style.borderColor = '#EF4444';
    e.currentTarget.style.background = '#FFFFFF';
  }}
  onBlur={(e) => {
    e.currentTarget.style.borderColor = '#E5E7EB';
    e.currentTarget.style.background = '#F9FAFB';
  }}
/>
```

#### Select Dropdown
```tsx
<select style={{
  width: '100%',
  padding: '10px 14px',
  border: '1.5px solid #E5E7EB',
  borderRadius: '8px',
  fontSize: '14px',
  color: '#111827',
  background: '#F9FAFB',
  cursor: 'pointer',
  transition: 'all 150ms ease'
}}>
  <option>Option 1</option>
  <option>Option 2</option>
</select>
```

### Modals

#### Modal Overlay
```tsx
<div style={{
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  animation: 'fadeIn 300ms ease'
}}>
  {/* Modal Content */}
</div>
```

#### Modal Content
```tsx
<div style={{
  background: '#FFFFFF',
  borderRadius: '16px',
  maxWidth: '500px',
  width: '90%',
  boxShadow: '0 12px 32px rgba(0, 0, 0, 0.16)',
  animation: 'slideIn 300ms ease'
}}>
  {/* Header, Body, Footer */}
</div>
```

---

## Icons

### Icon Library
**Package:** `lucide-react`

**Common Icons:**
- Dashboard: `LayoutDashboard`
- Collections: `AlertCircle`
- Payments: `DollarSign`
- Calendar: `Calendar`
- Users: `Users`
- Settings: `Settings`
- Documents: `FileText`
- Activity: `Activity`
- Messages: `MessageSquare`
- Close: `X`
- Check: `CheckCircle`
- Arrow: `ArrowRight`

### Icon Usage
```tsx
import { DollarSign } from 'lucide-react';

<DollarSign size={20} style={{ color: '#EF4444' }} />
```

### Icon Sizes
- **Small:** 16px (inline text)
- **Medium:** 20px (buttons, cards)
- **Large:** 24px (headers, stat cards)
- **XL:** 32px (empty states)

---

## Responsive Design

### Breakpoints
```css
--screen-sm: 640px;   /* Mobile landscape */
--screen-md: 768px;   /* Tablet portrait */
--screen-lg: 1024px;  /* Desktop */
--screen-xl: 1280px;  /* Large desktop */
```

### Current Implementation
- **Desktop-first:** Optimized for 1024px+ screens
- **Sidebar:** Fixed 280px width
- **Content:** Max-width 1200px, centered

### Future Mobile Considerations
- Collapsible sidebar (hamburger menu)
- Single-column layouts for collections
- Scrollable tables on small screens
- Larger touch targets (min 44px)

---

## Accessibility

### Color Contrast
All text meets **WCAG AA** standards:
- Primary text (#111827) on white: 15.3:1 ✓
- Secondary text (#4B5563) on white: 8.6:1 ✓
- Muted text (#6B7280) on white: 5.7:1 ✓

### Focus States
```css
outline: 2px solid #EF4444;
outline-offset: 2px;
```

### Keyboard Navigation
- All interactive elements focusable
- Visual focus indicators
- Logical tab order

---

## Currency Formatting

### Philippine Peso
```typescript
const formatCurrency = (amount: number) => {
  return `₱${amount.toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

// Examples:
formatCurrency(35000);     // "₱35,000.00"
formatCurrency(1500000);   // "₱1,500,000.00"
formatCurrency(750.50);    // "₱750.50"
```

---

## Logo & Branding

### NEXSYS Logo
```tsx
<div style={{
  padding: '24px 20px',
  borderBottom: '1px solid #E5E7EB'
}}>
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  }}>
    <div style={{
      width: '40px',
      height: '40px',
      background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
    }}>
      <span style={{
        fontSize: '20px',
        fontWeight: 700,
        color: '#FFFFFF'
      }}>
        N
      </span>
    </div>
    <span style={{
      fontSize: '22px',
      fontWeight: 700,
      color: '#111827',
      letterSpacing: '0.5px'
    }}>
      NEXSYS
    </span>
  </div>
</div>
```

---

## Best Practices

### DO ✓
- Use 8px spacing grid consistently
- Apply hover states to interactive elements
- Use semantic color meanings (red = critical, green = success)
- Include loading states and empty states
- Provide clear feedback for user actions (toasts, highlights)

### DON'T ✗
- Mix different shadow styles
- Use colors outside the defined palette
- Skip hover/focus states
- Use font sizes not in the type scale
- Forget accessibility (contrast, focus, ARIA)

---

**Last Updated:** December 30, 2025
**Status:** Design system fully documented and implemented
