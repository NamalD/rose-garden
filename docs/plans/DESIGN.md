---
version: alpha
name: Project Tracker
description: Visual identity for a personal project dashboard — rose palette with monospace typography.
colors:
  primary: "#be123c"
  primary-gradient-end: "#e11d48"
  secondary: "#9d174d"
  secondary-gradient-end: "#db2777"
  surface: "rgba(255,255,255,0.85)"
  surface-variant: "rgba(255,255,255,0.65)"
  outline: "rgba(225,29,72,0.12)"
  outline-strong: "rgba(225,29,72,0.15)"
  background-start: "#fff1f2"
  background-mid: "#fecdd3"
  background-end: "#fda4af"
  background-last: "#fbcfe8"
  on-surface: "#1a1a2e"
  on-surface-variant: "#6b7280"
  active: "#10b981"
  backlog: "#9ca3af"
  stalled: "#f59e0b"
  completed: "#3b82f6"
  tag-fun-bg: "#fae8ff"
  tag-fun-text: "#a21caf"
  tag-learning-bg: "#fff7ed"
  tag-learning-text: "#c2410c"
  tag-useful-bg: "#ecfdf5"
  tag-useful-text: "#059669"
  tag-tech-bg: "#eef2ff"
  tag-tech-text: "#4338ca"
  status-backlog-bg: "#e5e7eb"
  status-backlog-text: "#4b5563"
  status-active-bg: "#d1fae5"
  status-active-text: "#059669"
  status-stalled-bg: "#fef3c7"
  status-stalled-text: "#d97706"
  status-completed-bg: "#dbeafe"
  status-completed-text: "#2563eb"
typography:
  headline-display:
    fontFamily: "'SF Mono', 'Cascadia Code', 'Fira Code', 'Consolas', monospace"
    fontSize: 32px
    fontWeight: 800
    letterSpacing: 0px
  body-lg:
    fontFamily: "'SF Mono', 'Cascadia Code', 'Fira Code', 'Consolas', monospace"
    fontSize: 14px
    fontWeight: 400
  body-md:
    fontFamily: "'SF Mono', 'Cascadia Code', 'Fira Code', 'Consolas', monospace"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: "'SF Mono', 'Cascadia Code', 'Fira Code', 'Consolas', monospace"
    fontSize: 11px
    fontWeight: 500
  label-lg:
    fontFamily: "'SF Mono', 'Cascadia Code', 'Fira Code', 'Consolas', monospace"
    fontSize: 13px
    fontWeight: 500
  label-md:
    fontFamily: "'SF Mono', 'Cascadia Code', 'Fira Code', 'Consolas', monospace"
    fontSize: 12px
    fontWeight: 600
    letterSpacing: 0.5px
  label-sm:
    fontFamily: "'SF Mono', 'Cascadia Code', 'Fira Code', 'Consolas', monospace"
    fontSize: 10px
    fontWeight: 600
    letterSpacing: 0.5px
rounded:
  none: 0px
  sm: 6px
  md: 10px
  lg: 16px
  xl: 20px
  full: 9999px
spacing:
  none: 0px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 20px
  xl: 24px
  xxl: 36px
  xxxl: 40px
components:
  stat-bar:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface-variant}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
  filter-pill:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface-variant}"
    rounded: "{rounded.xl}"
    padding: 6px 16px
  filter-pill-active:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.xl}"
    padding: 6px 16px
  filter-pill-active-tech:
    backgroundColor: "{colors.secondary}"
    textColor: "#ffffff"
    rounded: "{rounded.xl}"
    padding: 6px 16px
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.lg}"
    padding: "{rounded.xl}"
  status-badge:
    backgroundColor: "{colors.status-backlog-bg}"
    textColor: "{colors.status-backlog-text}"
    rounded: "{rounded.md}"
    padding: 3px 10px
  gh-link:
    textColor: "{colors.primary}"
---

## Overview

Project Tracker is a personal dashboard for tracking project ideas alongside active GitHub repos. The design combines a warm, energetic rose palette with developer-focused monospace typography — playful yet technical. Frosted glass surfaces on a gradient background give it a light, airy feel while the monospace type keeps it grounded as a tool rather than a marketing page.

## Colors

The palette is built around a rose-to-pink primary gradient on a warm blush background. Status colors use conventional green/gray/amber/blue semantics so they're immediately readable. Tag colors use pastel backgrounds with saturated text for quick visual scanning.

| Token | Value | Usage |
|-------|-------|-------|
| `primary` | `#be123c` | Title gradient start, active pills, links, stat numbers |
| `primary-gradient-end` | `#e11d48` | Title gradient end, active pill gradient end |
| `secondary` | `#9d174d` | Active tech filter pill start |
| `secondary-gradient-end` | `#db2777` | Active tech filter pill end |
| `background-start` | `#fff1f2` | Page background gradient (0°) |
| `background-mid` | `#fecdd3` | Page background gradient (30%) |
| `background-end` | `#fda4af` | Page background gradient (60%) |
| `background-last` | `#fbcfe8` | Page background gradient (100%) |
| `surface` | `rgba(255,255,255,0.85)` | Cards, stat boxes, filter pills — frosted glass |
| `surface-variant` | `rgba(255,255,255,0.65)` | Frosted glass at gradient end |
| `outline` | `rgba(225,29,72,0.12)` | Card borders, dividers |
| `outline-strong` | `rgba(225,29,72,0.15)` | Stat bar and filter pill borders |
| `on-surface` | `#1a1a2e` | Card titles, body text |
| `on-surface-variant` | `#6b7280` | Subtitles, descriptions |
| `active` | `#10b981` | Active status |
| `backlog` | `#9ca3af` | Backlog status |
| `stalled` | `#f59e0b` | Stalled status |
| `completed` | `#3b82f6` | Completed status |

## Typography

Monospace across the board — `'SF Mono', 'Cascadia Code', 'Fira Code', 'Consolas', monospace`. This gives the dashboard a terminal/developer-tool feel while the rose palette keeps it warm. Size and weight variations create hierarchy without switching to a proportional font.

| Token | Font Family | Size | Weight | Usage |
|-------|-------------|------|--------|-------|
| `headline-display` | monospace | 32px | 800 | Page title (gradient text) |
| `body-lg` | monospace | 14px | 400 | Subtitle |
| `body-md` | monospace | 13px | 400 | Card descriptions |
| `body-sm` | monospace | 11px | 500 | Tags |
| `label-lg` | monospace | 13px | 500 | Filter pills, GitHub links |
| `label-md` | monospace | 12px | 600 | Filter section labels (uppercase) |
| `label-sm` | monospace | 10px | 600 | Status badges (uppercase, letter-spaced) |

## Layout & Spacing

The layout uses a single-column dashboard on a 1200px max-width container. Spacing is generous between sections to let the frosted glass cards breathe.

| Token | Value | Usage |
|-------|-------|-------|
| `spacing.none` | 0px | — |
| `spacing.xs` | 4px | Tag gaps |
| `spacing.sm` | 8px | Card inner header gap |
| `spacing.md` | 12px | Card desc/tags/gh-link gaps |
| `spacing.lg` | 20px | Card grid gap |
| `spacing.xl` | 24px | App padding (vertical), filter sections |
| `spacing.xxl` | 36px | Header → stats, stats → filters |
| `spacing.xxxl` | 40px | App padding (horizontal) |

## Elevation & Depth

Cards sit flat (no shadow) with a subtle rose-tinted border. On hover, cards elevate with `0 8px 24px rgba(0,0,0,0.08)` and lift 2px. This is the only elevation change — the design stays mostly flat to keep the frosted glass effect clean.

## Shapes

| Token | Value | Usage |
|-------|-------|-------|
| `rounded.none` | 0px | — |
| `rounded.sm` | 6px | Tech tags |
| `rounded.md` | 10px | Status badges |
| `rounded.lg` | 16px | Cards, stat bars |
| `rounded.xl` | 20px | Filter pills |
| `rounded.full` | 9999px | — |

## Components

### Stats Bar
Five boxes in a row showing project counts. Frosted glass background (`surface` → `surface-variant` gradient), rounded `lg`, rose-tinted border. Numbers use primary gradient text, except status-specific counts which use their status color.

### Filter Pills
Two rows — Category (single-select) and Tech Stack (multi-select, combinable with category). Inactive pills use frosted glass with subtle rose border. Active category pills use primary gradient background. Active tech pills use secondary gradient background. Hover shifts border to primary.

### Cards
Frosted glass background with rose-tinted border, rounded `lg`. 4px left border color-coded by status (green/ gray/ amber/ blue). Hover elevates with shadow and slight lift. Contains: title + status badge, description, tags row, optional GitHub link.

### Status Badge
Rounded `md`, uppercase monospace label with emoji. Background and text color vary by status (green active, gray backlog, amber stalled, blue completed).

## Do's and Don'ts

- **Do** use the rose gradient for primary interactive elements (active filters, links)
- **Do** use monospace typography everywhere for consistency
- **Do** keep frosted glass surfaces light and airy — avoid solid white or dark surfaces
- **Don't** add additional colors beyond the rose palette for primary actions
- **Don't** switch to proportional fonts — the monospace identity should be consistent
- **Don't** add heavy shadows or depth — the design stays flat with minimal hover elevation