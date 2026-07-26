# Design — Project Tracker

> Visual design decisions for the project tracker static site.

**Chosen direction:** Rose palette (Design C) × monospace typography (Design B)

---

## Color Palette

### Primary: Rose

| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| Primary gradient | Rose → Pink | `#be123c` → `#e11d48` | Title text, active filter pills, link text, stat numbers |
| Secondary gradient | Fuchsia | `#9d174d` → `#db2777` | Active tech filter pills |
| Background gradient | Blush → Rose → Pink | `#fff1f2` → `#fecdd3` → `#fda4af` → `#fbcfe8` | Page background (160° angle) |
| Card/stat background | White with alpha | `rgba(255,255,255,0.85)` → `0.65` | Frosted glass effect on cards and stat boxes |
| Card border | Rose with alpha | `rgba(225,29,72,0.12)` | Subtle rose tint on card borders |

### Status Colors (unchanged)

| Status | Color | Hex |
|--------|-------|-----|
| Active | Green | `#10b981` |
| Backlog | Gray | `#9ca3af` |
| Stalled | Amber | `#f59e0b` |
| Completed | Blue | `#3b82f6` |

### Tag Colors (unchanged)

| Tag | Background | Text |
|-----|-----------|------|
| Fun | `#fae8ff` | `#a21caf` |
| Learning | `#fff7ed` | `#c2410c` |
| Useful | `#ecfdf5` | `#059669` |
| Tech | `#eef2ff` | `#4338ca` |

---

## Typography

**Primary font stack:** `'SF Mono', 'Cascadia Code', 'Fira Code', monospace`

| Element | Size | Weight | Style |
|---------|------|--------|-------|
| Page title (h1) | 32px | 800 | Gradient text (rose → pink) |
| Subtitle | 14px | normal | `#6b7280` |
| Card title (h3) | 16px | 600 | `#1a1a2e` |
| Card description | 13px | normal | `#6b7280` |
| Status badge | 11px | 600 | Uppercase, letter-spaced |
| Filter pills | 13px | 500 | — |
| Tags | 11px | 500 | — |
| GitHub link | 13px | 500 | Rose color |

---

## Layout & Spacing

| Section | Spacing |
|---------|---------|
| App container padding | 40px horizontal, 32px vertical |
| Header → Stats | 36px margin-bottom |
| Stats → Filters | 36px margin-bottom |
| Filter sections | 24px margin-bottom each |
| Card grid gap | 20px |
| Card padding | 24px |
| Card inner gaps | 6px (header), 10px (desc), 10px (tags), 10px (GH link) |

---

## Component Styles

### Stats Bar
- 5 boxes in a row: Total, Active, Backlog, Stalled, Completed
- Frosted glass background (white gradient with alpha)
- Rounded corners: 16px
- Subtle rose-tinted border
- Numbers use rose gradient text (except status colors which use their own)

### Filter Pills
- Rounded: 20px
- Inactive: frosted glass, subtle border
- Hover: border shifts to rose
- Active (category): rose gradient background, white text
- Active (tech): fuchsia gradient background, white text
- Clear button: transparent, gray text

### Cards
- Frosted glass background (white gradient with alpha)
- Rounded corners: 16px
- Subtle rose-tinted border
- Hover: elevated shadow (`0 8px 24px rgba(0,0,0,0.08)`), slight lift (`-2px`)
- Left border: 4px color-coded by status (green/gray/amber/blue)

### GitHub Link
- Separated by thin rose-tinted divider
- Rose-colored link text
- Opens in new tab

---

## Background

Full-page gradient at 160°:
```
#fff1f2  →  #fecdd3  →  #fda4af  →  #fbcfe8
  0%          30%         60%        100%
```

---

## Responsive Behavior

- Card grid: 3 columns desktop, 2 tablet, 1 mobile
- `auto-fill, minmax(280px, 1fr)` for natural wrapping
- All spacing scales down proportionally on smaller screens

---

## Design Rationale

The rose palette was chosen for its warmth and energy — it makes the project tracker feel like an inspiration board rather than a dry spreadsheet. The monospace typography (borrowed from the Dark/Technical design) adds a developer-friendly edge that keeps it feeling like a tool, not a marketing page. The combination is playful but technical — fitting for a personal project dashboard.