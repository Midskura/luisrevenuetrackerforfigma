## 📐 Design Philosophy

**"Stroke Borders Over Shadows, Green Over Everything"**

Neuron OS uses a **minimalist, stroke-based design system** inspired by financial software and modern SaaS applications. The aesthetic prioritizes **clarity, hierarchy, and professionalism** through:

- **Stroke borders** (1px solid lines) instead of drop shadows for definition
- **Deep green** color palette for brand identity and trust
- **Pure white backgrounds** for maximum readability
- **Generous padding** (32px-48px) for breathing room
- **Subtle elevation** (minimal shadows when necessary)
- **Negative letter-spacing** on headings for a premium feel

---

## 🎨 Color System

### Primary Palette

#### Backgrounds
```css
--neuron-bg-page: #F7FAF8          /* Soft off-white page background */
--neuron-bg-elevated: #FFFFFF       /* Pure white for cards/modals */
```

#### Ink (Text Colors)
```css
--neuron-ink-primary: #12332B       /* Deep green - headings, primary text */
--neuron-ink-secondary: #2E5147     /* Medium green - body text */
--neuron-ink-muted: #6B7A76         /* Light green-gray - meta text, labels */
```

#### Brand Colors
```css
--neuron-brand-green: #237F66       /* Primary brand - CTAs, active states */
--neuron-brand-green-600: #1E6D59   /* Darker green - hover states */
--neuron-brand-green-100: #E8F2EE   /* Light green - backgrounds, pills */
```

#### Accent
```css
--neuron-accent-terracotta: #B06A4F /* Secondary highlight (use sparingly) */
```

#### UI Colors
```css
--neuron-ui-border: #E5ECE9         /* Standard border color */
--neuron-ui-divider: #EEF3F1        /* Lighter divider lines */
```

#### States
```css
--neuron-state-hover: #F1F6F4       /* Hover background (very subtle) */
--neuron-state-selected: #E4EFEA    /* Selected item background */
```

#### Semantic Colors
```css
--neuron-semantic-success: #2B8A6E  /* Success green */
--neuron-semantic-warn: #C88A2B     /* Warning amber */
--neuron-semantic-danger: #C94F3D   /* Error red */
```

### Color Usage Rules

✅ **DO:**
- Use `--neuron-brand-green` for all primary CTAs
- Use semantic colors for status indicators
- Use `--neuron-ink-primary` for headings
- Use `--neuron-ink-secondary` for body text
- Use `--neuron-ink-muted` for metadata and labels

❌ **DON'T:**
- Never use shadows for layout definition (use borders)
- Never mix blue, orange, or other brand colors
- Never use pure black (`#000000`) for text
- Never use accent terracotta as primary CTA color

---

## 📝 Typography System

### Font Family
```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif;
```

**Source:** Google Fonts  
**Weights:** 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)

### Font Sizes & Weights

#### Headings (Negative Letter-Spacing)
```
H1 (Page Title)
├─ Size: 24px
├─ Weight: 600 (Semibold)
├─ Line Height: 36px
└─ Letter Spacing: -0.01em (-1.0%)

H2 (Section Title)
├─ Size: 20px
├─ Weight: 500 (Medium)
├─ Line Height: 30px
└─ Letter Spacing: -0.005em (-0.5%)

H3 (Subsection)
├─ Size: 18px
├─ Weight: 500 (Medium)
├─ Line Height: 27px
└─ Letter Spacing: -0.005em (-0.5%)

H4 (Component Title)
├─ Size: 16px
├─ Weight: 500 (Medium)
├─ Line Height: 24px
└─ Letter Spacing: 0
```

#### Body Text (Zero Tracking)
```
Body / Paragraph
├─ Size: 15px
├─ Weight: 400 (Regular)
├─ Line Height: 22.5px
└─ Letter Spacing: 0

Label
├─ Size: 14px
├─ Weight: 500 (Medium)
├─ Line Height: 21px
└─ Letter Spacing: 0

Button Text
├─ Size: 15px
├─ Weight: 500 (Medium)
├─ Line Height: 22.5px
└─ Letter Spacing: 0

Table Text
├─ Size: 14px
├─ Weight: 400 (Regular)
├─ Line Height: 21px
├─ Letter Spacing: 0
└─ Font Variant: tabular-nums (for numeric columns)
```

#### Small UI Text (Positive Tracking)
```
Small (Badges, Pills, Meta)
├─ Size: 12px
├─ Weight: 600 (Semibold)
├─ Line Height: 18px
├─ Letter Spacing: +0.002em (+0.2%)
└─ Text Transform: UPPERCASE

Tiny (Captions)
├─ Size: 11px
├─ Weight: 500 (Medium)
├─ Line Height: 16.5px
└─ Letter Spacing: +0.002em (+0.2%)
```

#### Large Numbers (Dashboard KPIs)
```
Display 32
├─ Size: 32px
├─ Weight: 600-700
├─ Line Height: 40px
├─ Letter Spacing: -0.015em (-1.5%)
└─ Font Variant: tabular-nums

Display 28
├─ Size: 28px
├─ Weight: 600-700
├─ Line Height: 36px
├─ Letter Spacing: -0.01em (-1.0%)
└─ Font Variant: tabular-nums

Display 24
├─ Size: 24px
├─ Weight: 600-700
├─ Line Height: 32px
├─ Letter Spacing: -0.01em (-1.0%)
└─ Font Variant: tabular-nums
```

### Typography Rules

✅ **DO:**
- Use **tabular numerals** (`font-variant-numeric: tabular-nums`) for all numbers in tables, KPIs, and dashboards
- Use **negative letter-spacing** on headings (18px and above) for premium feel
- Use **uppercase + increased tracking** on small labels (10-12px) for readability
- Apply **font-smoothing** (`-webkit-font-smoothing: antialiased`)

❌ **DON'T:**
- **NEVER use Tailwind font size classes** (`text-xl`, `text-2xl`, `font-bold`, etc.) unless user explicitly asks
- Don't mix font families - Inter only
- Don't use negative tracking on body text (14-16px)
- Don't use bold (700) for body text - use Semibold (600) for emphasis

---

## 📦 Spacing System

### Base Unit: 4px

Spacing follows an **8px grid** (multiples of 4):

```
xs:  4px   (rare, only for tight inline spacing)
sm:  8px   (gap between related items)
md:  12px  (gap between form fields, list items)
base: 16px (standard gap, card padding)
lg:  20px  (section gaps)
xl:  24px  (subsection padding)
2xl: 32px  (page padding, major section gaps)
3xl: 48px  (hero sections, modal padding)
```

### Layout Spacing Standards

```css
/* Page Container */
padding: 32px 48px;  /* Desktop pages */
padding: 32px;       /* Responsive/mobile */

/* Card/Panel Padding */
padding: 24px;  /* Large cards */
padding: 16px;  /* Medium cards */
padding: 12px;  /* Small cards, KPI tiles */

/* Section Gaps */
gap: 24px;  /* Between major sections */
gap: 16px;  /* Between related components */
gap: 12px;  /* Between form fields */
gap: 8px;   /* Between inline elements (icon + text) */

/* Table Cell Padding */
padding: 16px;  /* Standard cell */
padding: 12px 16px;  /* Header cell */

/* Button Padding */
padding: 8px 24px;   /* Large button */
padding: 6px 16px;   /* Medium button */
padding: 4px 12px;   /* Small button */
```

### Grid System

```css
/* 12-Column Grid */
max-width: 1200px;
grid-template-columns: repeat(12, 1fr);
gap: 24px;
```

---

## 🔲 Border & Radius System

### Border Widths
```css
/* Only use 1px borders - no thick borders */
border: 1px solid var(--neuron-ui-border);
border-bottom: 1px solid var(--neuron-ui-divider); /* Lighter for dividers */
```

### Border Radius
```css
--neuron-radius-s: 6px;   /* Small elements (badges, pills) */
--neuron-radius-m: 10px;  /* Medium elements (buttons, inputs) */
--neuron-radius-l: 14px;  /* Large elements (cards, modals) */
```

### Radius Usage
- **Pills/Badges:** `999px` (full round)
- **Buttons:** `8px` (medium-large)
- **Input Fields:** `8px`
- **Cards:** `12px`
- **Modals:** `14px` (large radius)
- **Tables:** `8px` (corners only)

---

## ✨ Elevation & Shadows

### Shadow System (Use Sparingly!)

```css
/* Subtle elevation for cards */
--elevation-1: 0 1px 2px 0 rgba(16, 24, 20, 0.04);

/* Modal/dropdown elevation */
--elevation-2: 0 2px 8px 0 rgba(16, 24, 20, 0.06);
```

### Usage Rules

✅ **USE shadows for:**
- Modals and dialogs (elevation-2)
- Dropdowns and popovers (elevation-2)
- Floating action buttons (elevation-1)

❌ **DON'T use shadows for:**
- Page layout structure (use borders instead)
- Cards in main content (use borders)
- Table rows or list items
- Section dividers

**Design Principle:** Stroke borders define structure, shadows only for floating elements.

---

## 🧩 Component Patterns

### 1. Page Header

```tsx
<div style={{
  padding: "32px 48px 24px 48px",
  borderBottom: "1px solid var(--neuron-ui-border)",
  background: "var(--neuron-bg-page)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "start"
}}>
  <div>
    <h1 style={{
      fontSize: "28px",
      fontWeight: 600,
      color: "var(--neuron-ink-primary)",
      lineHeight: "36px",
      letterSpacing: "-0.01em",
      marginBottom: "6px"
    }}>
      Page Title
    </h1>
    <p style={{
      fontSize: "14px",
      color: "var(--neuron-ink-muted)",
      lineHeight: "20px"
    }}>
      Page description or metadata
    </p>
  </div>
  <button style={{
    background: "var(--neuron-brand-green)",
    color: "white",
    height: "40px",
    padding: "0 20px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 500,
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "background 120ms ease-out"
  }}>
    + Create New
  </button>
</div>
```

### 2. Primary Button (Neuron Green)

```tsx
<button style={{
  background: "var(--neuron-brand-green)",
  color: "white",
  height: "40px",
  padding: "0 20px",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: 500,
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  transition: "all 120ms ease-out"
}}>
  Action Label
</button>

/* Hover State */
button:hover {
  background: var(--neuron-brand-green-600);
  transform: translateY(-1px);
}

/* Active State */
button:active {
  transform: translateY(0);
}

/* Disabled State */
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}
```

### 3. Secondary Button (Outline)

```tsx
<button style={{
  background: "transparent",
  color: "var(--neuron-brand-green)",
  height: "40px",
  padding: "0 20px",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: 500,
  border: "1px solid var(--neuron-ui-border)",
  cursor: "pointer",
  transition: "all 120ms ease-out"
}}>
  Secondary Action
</button>

/* Hover State */
button:hover {
  background: var(--neuron-state-hover);
  border-color: var(--neuron-brand-green);
}
```

### 4. KPI Card (Dashboard Metric)

```tsx
<div style={{
  flex: 1,
  background: "white",
  borderRadius: "12px",
  border: "1px solid var(--neuron-ui-border)",
  padding: "20px 24px",
  display: "flex",
  flexDirection: "column",
  gap: "12px"
}}>
  <div style={{
    display: "flex",
    alignItems: "center",
    gap: "8px"
  }}>
    <Icon size={16} style={{ color: "var(--neuron-ink-muted)" }} />
    <span style={{
      fontSize: "12px",
      fontWeight: 600,
      color: "var(--neuron-ink-muted)",
      textTransform: "uppercase",
      letterSpacing: "0.002em"
    }}>
      METRIC LABEL
    </span>
  </div>
  <div style={{
    fontSize: "32px",
    fontWeight: 700,
    color: "var(--neuron-brand-green)",
    lineHeight: "1.2",
    letterSpacing: "-0.015em",
    fontVariantNumeric: "tabular-nums"
  }}>
    ₱1,245,680
  </div>
  <div style={{
    fontSize: "13px",
    color: "var(--neuron-ink-muted)"
  }}>
    +12% from last month
  </div>
</div>
```

### 5. Status Pill

```tsx
/* Success Variant */
<div style={{
  display: "inline-flex",
  alignItems: "center",
  padding: "4px 12px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.002em",
  backgroundColor: "#E8F2EE",
  color: "#0F766E"
}}>
  Approved
</div>

/* Warning Variant */
<div style={{
  backgroundColor: "#FFF3E0",
  color: "#C88A2B"
}}>
  Pending
</div>

/* Danger Variant */
<div style={{
  backgroundColor: "#FEE2E2",
  color: "#C94F3D"
}}>
  Rejected
</div>

/* Neutral Variant */
<div style={{
  backgroundColor: "#F3F4F6",
  color: "#6B7280"
}}>
  Draft
</div>
```

### 6. Table Pattern

```tsx
<table style={{
  width: "100%",
  borderCollapse: "collapse",
  background: "white",
  borderRadius: "8px",
  border: "1px solid var(--neuron-ui-border)",
  overflow: "hidden"
}}>
  <thead>
    <tr style={{
      borderBottom: "1px solid var(--neuron-ui-border)"
    }}>
      <th style={{
        padding: "12px 16px",
        textAlign: "left",
        fontSize: "11px",
        fontWeight: 600,
        color: "var(--neuron-ink-muted)",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        background: "var(--neuron-bg-page)"
      }}>
        COLUMN HEADER
      </th>
    </tr>
  </thead>
  <tbody>
    <tr style={{
      borderBottom: "1px solid var(--neuron-ui-divider)",
      transition: "background 120ms ease-out"
    }}>
      <td style={{
        padding: "16px",
        fontSize: "14px",
        color: "var(--neuron-ink-secondary)"
      }}>
        Cell content
      </td>
    </tr>
  </tbody>
</table>

/* Row Hover State (via JavaScript) */
tr:hover {
  background: var(--neuron-state-hover);
}
```

### 7. Input Field

```tsx
<input
  type="text"
  placeholder="Enter value..."
  style={{
    width: "100%",
    height: "40px",
    padding: "0 12px",
    fontSize: "14px",
    color: "var(--neuron-ink-primary)",
    background: "white",
    border: "1px solid var(--neuron-ui-border)",
    borderRadius: "8px",
    transition: "all 120ms ease-out"
  }}
/>

/* Focus State */
input:focus {
  outline: 2px solid rgba(35, 127, 102, 0.3);
  outline-offset: 0;
  border-color: var(--neuron-brand-green);
}

/* Disabled State */
input:disabled {
  background: var(--neuron-bg-page);
  color: var(--neuron-ink-muted);
  cursor: not-allowed;
}
```

### 8. Card/Panel

```tsx
<div style={{
  background: "white",
  border: "1px solid var(--neuron-ui-border)",
  borderRadius: "12px",
  padding: "24px"
}}>
  <h3 style={{
    fontSize: "16px",
    fontWeight: 600,
    color: "var(--neuron-ink-primary)",
    marginBottom: "16px"
  }}>
    Section Title
  </h3>
  <div>
    {/* Card content */}
  </div>
</div>
```

### 9. Search Bar with Icon

```tsx
<div style={{
  position: "relative",
  width: "100%",
  maxWidth: "400px"
}}>
  <Search size={16} style={{
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "var(--neuron-ink-muted)",
    pointerEvents: "none"
  }} />
  <input
    type="text"
    placeholder="Search..."
    style={{
      width: "100%",
      height: "40px",
      paddingLeft: "40px",
      paddingRight: "12px",
      fontSize: "14px",
      border: "1px solid var(--neuron-ui-border)",
      borderRadius: "8px"
    }}
  />
</div>
```

---

## 🎭 Interaction & Motion

### Transition Timing
```css
/* Standard transition for all hover effects */
transition: all 120ms ease-out;

/* For sliding panels */
transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);

/* For fading elements */
transition: opacity 200ms ease-out;
```

### Hover States
- Buttons: Background color change + subtle lift (`transform: translateY(-1px)`)
- Table rows: Background changes to `var(--neuron-state-hover)`
- Cards: No hover effect (only if clickable, then add hover background)
- Links: Underline appears

### Focus States
```css
/* Keyboard focus indicator */
*:focus-visible {
  outline: 2px solid rgba(35, 127, 102, 0.3);
  outline-offset: 2px;
}

/* Remove outline for mouse clicks */
*:focus:not(:focus-visible) {
  outline: none;
}
```

### Active States
- Buttons: Slight press effect (`transform: translateY(0)` from hover state)
- Clickable items: Momentary background change

---

## 🖼️ Icon System

### Library: Lucide React
```bash
npm install lucide-react
```

### Icon Sizes
```tsx
import { Icon } from "lucide-react";

// Small (inline with text)
<Icon size={14} />

// Medium (buttons, table cells)
<Icon size={16} />

// Standard (sidebar navigation)
<Icon size={20} />

// Large (page headers)
<Icon size={24} />
```

### Icon Colors
```tsx
// Default (muted)
<Icon style={{ color: "var(--neuron-ink-muted)" }} />

// Active (brand green)
<Icon style={{ color: "var(--neuron-brand-green)" }} />

// Primary text color
<Icon style={{ color: "var(--neuron-ink-primary)" }} />
```

---

## 📱 Responsive Behavior

### Breakpoints
```css
/* Mobile */
@media (max-width: 767px) {
  /* Stack layouts, reduce padding */
}

/* Tablet */
@media (min-width: 768px) and (max-width: 1023px) {
  /* 2-column grids, moderate padding */
}

/* Desktop */
@media (min-width: 1024px) {
  /* Full layout, standard padding */
}

/* Large Desktop */
@media (min-width: 1280px) {
  /* Max-width containers: 1200px */
}
```

### Responsive Patterns

**Desktop (≥1024px):**
- Sidebar: Fixed 272px width
- Page padding: 32px 48px
- KPI cards: 4 columns
- Tables: All columns visible

**Tablet (768px-1023px):**
- Sidebar: Collapsible to 72px
- Page padding: 24px 32px
- KPI cards: 2 columns
- Tables: Hide less important columns

**Mobile (<768px):**
- Sidebar: Drawer overlay
- Page padding: 16px
- KPI cards: 1 column, stacked
- Tables: Card view or horizontal scroll

---

## ♿ Accessibility Guidelines

### Contrast Ratios
- Primary text on white: **7.2:1** (AAA compliant)
- Secondary text on white: **5.8:1** (AA compliant)
- Muted text on white: **4.5:1** (AA compliant)

### Focus Indicators
- All interactive elements must have visible focus state
- Use 2px outline with 2px offset
- Color: `rgba(35, 127, 102, 0.3)` (green at 30% opacity)

### Touch Targets
- Minimum 40px height for all buttons
- Minimum 32px for icon buttons
- Adequate spacing between interactive elements (≥8px)

### Semantic HTML
- Use proper heading hierarchy (h1 → h2 → h3)
- Use `<button>` for actions, `<a>` for navigation
- Use `<table>` for tabular data, not for layout
- Include ARIA labels for icon-only buttons

---

## 🚫 Common Mistakes to Avoid

### ❌ DON'T DO THIS:

1. **Using Tailwind font classes**
   ```tsx
   ❌ <h1 className="text-2xl font-bold">Title</h1>
   ✅ <h1 style={{ fontSize: "28px", fontWeight: 600 }}>Title</h1>
   ```

2. **Using shadows for layout**
   ```tsx
   ❌ <div style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>Card</div>
   ✅ <div style={{ border: "1px solid var(--neuron-ui-border)" }}>Card</div>
   ```

3. **Mixing color palettes**
   ```tsx
   ❌ <button style={{ background: "#3B82F6" }}>Submit</button>
   ✅ <button style={{ background: "var(--neuron-brand-green)" }}>Submit</button>
   ```

4. **Inconsistent spacing**
   ```tsx
   ❌ <div style={{ padding: "17px" }}>Content</div>
   ✅ <div style={{ padding: "16px" }}>Content</div>  // 8px grid
   ```

5. **Heavy font weights on body text**
   ```tsx
   ❌ <p style={{ fontWeight: 700 }}>Body text</p>
   ✅ <p style={{ fontWeight: 400 }}>Body text</p>
   ```

6. **Pure black text**
   ```tsx
   ❌ <p style={{ color: "#000000" }}>Text</p>
   ✅ <p style={{ color: "var(--neuron-ink-primary)" }}>Text</p>
   ```

7. **No hover states**
   ```tsx
   ❌ <button>Click me</button>
   ✅ <button style={{ transition: "all 120ms ease-out" }}>Click me</button>
   ```

8. **Random border radius**
   ```tsx
   ❌ <button style={{ borderRadius: "5px" }}>Click</button>
   ✅ <button style={{ borderRadius: "8px" }}>Click</button>
   ```

---

## 📋 Implementation Checklist

When implementing a new page or component, verify:

### Visual
- [ ] All text uses `--neuron-ink-*` colors (no pure black)
- [ ] All backgrounds use `--neuron-bg-*` (no random grays)
- [ ] All borders are 1px solid (no 2px or dashed borders)
- [ ] All buttons use `--neuron-brand-green` (no blue/orange)
- [ ] All status indicators use semantic colors
- [ ] All cards have proper border radius (12px)
- [ ] No drop shadows except on modals/dropdowns

### Typography
- [ ] No Tailwind font classes used (`text-xl`, `font-bold`, etc.)
- [ ] Headings use negative letter-spacing
- [ ] Body text uses 0% letter-spacing
- [ ] Small UI text (10-12px) uses +0.2% tracking + uppercase
- [ ] Numbers use tabular numerals in tables/KPIs
- [ ] All fonts are Inter (no SF Pro/Instrument Sans)

### Spacing
- [ ] Page padding is 32px or 48px
- [ ] Section gaps are 24px
- [ ] Element gaps are 8px/12px/16px (multiples of 4)
- [ ] Card padding is 16px/20px/24px
- [ ] Button padding follows system (8px 24px, etc.)

### Interaction
- [ ] All hover states have 120ms ease-out transition
- [ ] All clickable items have cursor: pointer
- [ ] All buttons have focus-visible outline
- [ ] All inputs have focus state
- [ ] Table rows change background on hover

### Accessibility
- [ ] All interactive elements are ≥40px tall
- [ ] All icon-only buttons have aria-label
- [ ] All form inputs have associated labels
- [ ] Focus indicators are visible
- [ ] Contrast ratios meet AA standard (4.5:1)

### Responsive
- [ ] Content works on mobile (≥320px width)
- [ ] Padding reduces on smaller screens
- [ ] Tables scroll horizontally or become cards
- [ ] Sidebar collapses on tablet/mobile

---

## 🎯 Quick Reference

### Most Used Values

**Colors:**
- Primary text: `var(--neuron-ink-primary)` (#12332B)
- Body text: `var(--neuron-ink-secondary)` (#2E5147)
- Muted text: `var(--neuron-ink-muted)` (#6B7A76)
- Primary CTA: `var(--neuron-brand-green)` (#237F66)
- Border: `var(--neuron-ui-border)` (#E5ECE9)

**Sizes:**
- Page title: 28px / 600
- Section title: 16px / 600
- Body: 15px / 400
- Label: 14px / 500
- Small: 12px / 600

**Spacing:**
- Page: 32px 48px
- Section: 24px
- Card: 20px
- Element gap: 12px-16px

**Radius:**
- Button: 8px
- Card: 12px
- Pill: 999px

**Transitions:**
- Standard: `all 120ms ease-out`
- Panel slide: `transform 300ms cubic-bezier(0.4, 0, 0.2, 1)`

---

## 📚 Additional Resources

**Design Files:** N/A (coded design system)  
**Component Library:** Custom React components + shadcn/ui  
**Icons:** Lucide React  
**Charts:** Recharts  
**Font:** Inter (Google Fonts)

---

**Last Updated:** December 20, 2024  
**Version:** 2.0  
**Status:** ✅ Production Ready
