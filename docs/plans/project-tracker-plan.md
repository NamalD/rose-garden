# Project Tracker - Plan

> A GitHub Pages static site that tracks project ideas (from your wiki backlog) alongside active GitHub repos — a personal project dashboard.

**artifact_contract:** `ce-unified-plan/v1`
**artifact_readiness:** `requirements-only`
**product_contract_source:** `ce-brainstorm`

---

## Goal Capsule

**Objective:** Build a personal static-site project tracker that surfaces what you want to build (wiki ideas) and what you're actively working on (GitHub repos), all in one dashboard with filtering by category and tech stack.

**Product authority:** Single-user personal tool — you own the data, the repo, and the decisions.

**Open blockers:** None — all scope and UX decisions resolved below.

---

## Product Contract

### Key Decisions

| # | Decision | Choice |
|---|----------|--------|
| 1 | Data source | Seed from `~/wiki/raw/Project ideas 1/`, auto-pull active GitHub repos via API at build time |
| 2 | Architecture | Static site generated at build time (Astro), deployed to GitHub Pages |
| 3 | GitHub ↔ wiki linking | Manual `github: owner/repo` field in `projects.yaml` — edit the file and push |
| 4 | Site generator | Astro |
| 5 | Layout | Dashboard-style cards with color-coded left borders, stats bar at top, no detail pages (all info on cards) |
| 6 | Tag system | Two independent dimensions: `category` (fun / learning / useful) + `tech` (tech stack list) |
| 7 | Filtering | Category and tech filter pills, combinable simultaneously |
| 8 | Deployment | GitHub Action on push → builds Astro → deploys `dist/` to Pages |

### Primary Actors

- **You** — the sole user. View the dashboard, filter by category and/or tech stack. Add or update projects by editing `projects.yaml` and pushing to the repo.

### Data Model

Each **Project** has:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | yes | Display name |
| `status` | enum | yes | `backlog` / `active` / `stalled` / `completed` |
| `category` | enum | yes | `fun` / `learning` / `useful` |
| `tech` | list[string] | no | Tech stack tags (e.g., rust, python, godot, astro) |
| `github` | string | no | `owner/repo` — links idea to active GitHub repo |
| `description` | string | no | Free-text summary or notes |
| `source` | string | no | File path from the wiki ideas, e.g., `Fun/ASCII Rougelike.md` |

**Status semantics:**

- `backlog` — idea captured, not started
- `active` — currently working on it
- `stalled` — paused but intend to resume
- `completed` — shipped / satisfied

### Data Source Strategy

**Local data file** (`src/data/projects.yaml`): The canonical project list. Initially seeded by a one-time script that reads the wiki directory and generates YAML entries (all `backlog`, `category` determined by which subfolder the file lives in).

**Build-time GitHub enrichment:** Astro's build step calls the GitHub API to pull info (stars, description, last push, language) for any project that has a `github` field. This data is merged into the project display but does not override the local YAML.

### Site Structure

```
metaproj/
├── src/
│   ├── pages/
│   │   └── index.astro            # Single-page dashboard
│   ├── data/
│   │   └── projects.yaml          # Canonical project data
│   ├── layouts/
│   │   └── BaseLayout.astro       # Shared page shell
│   └── components/
│       ├── StatsBar.astro         # Count summary (total / active / backlog / stalled / completed)
│       ├── FilterBar.astro        # Category pills + tech pills, combinable
│       ├── ProjectCard.astro      # Card with status border, tags, static GH link
│       ├── ProjectGrid.astro      # Responsive card grid layout
│       └── StatusBadge.astro      # Color-coded status indicator
├── public/
│   └── style.css                  # Global styles
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── .github/workflows/
│   └── deploy.yml                 # Build + deploy to Pages
└── scripts/
    └── seed-from-wiki.sh          # One-time: generate projects.yaml from wiki dir
```

### Page Design — Dashboard (index.astro)

No separate detail pages — all project information is visible on the cards themselves.

```
┌──────────────────────────────────────────────────────┐
│  Project Tracker                                     │
│  24 projects · 3 active · 8 completed               │
├──────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────┐    │
│  │ Total: 24  │ Active: 3 │ Backlog: 11  │ ... │    │
│  └──────────────────────────────────────────────┘    │
│                                                      │
│  Category: [All(24)] [Fun(8)] [Learning(7)] [Useful(9)]│
│  Tech:    [rust(4)] [python(5)] [c++(2)] [godot(1)]…│
│                                                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐             │
│  │ Vim Clone ││ OS Scratch││ Swarm Sim │             │
│  │ 🟢 active ││ 🟡 stalled││ ⬜ backlog│             │
│  │ fun, rust ││ learning,c││ fun,python│             │
│  │ ──────── ││ ──────── ││           │             │
│  │ 🔗namal/ ││ 🔗namal/ ││           │             │
│  │  vim-clone││  minios  ││           │             │
│  └──────────┘ └──────────┘ └──────────┘             │
└──────────────────────────────────────────────────────┘
```

#### Components

**Stats bar** — 5 stat boxes in a row: Total, Active, Backlog, Stalled, Completed. Each shows a count with a color-matched number.

**Filter bar** — Two filter rows:
- **Category row:** pills for All, Fun, Learning, Useful. Each shows count in parentheses. Clicking activates/deactivates (only one category active at a time, or "All").
- **Tech row:** pills for each unique tech tag across all projects. Each shows count. Multiple tech pills can be active simultaneously.
- Category and tech filters **combine** — e.g., Fun + rust shows only fun projects using Rust.
- Active filter pills are visually distinct: category pills use a dark background (`#1a1a2e`), tech pills use indigo (`#4338ca`).
- A "✕ clear tech filter" pill appears when any tech filter is active.

**Project card** — Each card shows:
- **Left border** 4px wide, color-coded by status (green=active, gray=backlog, yellow=stalled, blue=completed)
- **Header row:** project title (left), status badge with emoji (right)
- **Description:** single-line summary in light gray
- **Tag row:** category tag (pink/orange/green) + tech stack tags (indigo)
- **GitHub link section** (separated by a thin divider): shows "🔗 owner/repo" (clickable link) if the project has a `github` field, or nothing if unlinked

**Card grid** — Responsive grid: 3 columns on desktop, 2 on tablet, 1 on mobile. Cards have subtle hover elevation.

**Empty state** — When filters match nothing: centered "No projects match these filters" message.

### Build-Time Behavior

On each `git push` to `main`:

1. GitHub Action triggers
2. `npm ci` installs dependencies
3. `npm run build` runs Astro, with `GITHUB_USER` passed as an environment variable from the Action
4. During build, Astro reads `src/data/projects.yaml`
5. For each project with a `github` field, Astro fetches repo info via GitHub API (unauthenticated — public repos only; uses `owner/repo` format)
6. Merges API data into project objects (stars, description, language, last push)
7. Generates static HTML pages
8. Action deploys `dist/` to GitHub Pages

**GitHub username:** Set as a repository variable (`GITHUB_USER`) in the GitHub repo settings. The Action passes it to the build as an environment variable. This keeps it dynamic — fork the repo, set your own username, and it just works.

**API rate limit note:** Unauthenticated GitHub API is limited to 60 requests/hour. For a personal tracker with ~dozens of projects, this is fine. If scaling up, add a `GITHUB_TOKEN` secret to the Action for 5000/hr.

### Out of Scope (Explicitly)

- Authentication / user accounts — single-user, public site
- Drag-and-drop kanban board — static card grid only
- Automated matching from GitHub to wiki ideas — manual link field with autocomplete
- Detail pages — all info on cards
- Blog, RSS, or other site features beyond project tracking
- Any client-side editing (GitHub linking, status changes, etc.) — all edits by pushing to the repo

### Prototype Artifacts

A refined functional prototype was built at `prototype/index.html` to validate the design decisions above. It includes:
- Card grid with sample data
- Stats bar
- Combined category + tech filtering
- Inline GitHub link editing with autocomplete (prototyped for UX validation, not included in production — all edits are via git push)

The prototype code is retained on a separate branch for reference but is not part of the production build.

---

## Key Assumptions

- The wiki project ideas directory structure (`Fun/`, `Learning/`, `Useful/` subfolders) will remain the canonical mapping to `category`.
- You'll be comfortable editing a YAML file for all project data (title, status, category, tech, github link, description) and pushing to the repo.
- GitHub repos you want to link are public (API access without auth for reading at build time).
- Your GitHub username is set as a `GITHUB_USER` variable in the repo settings, passed to the build by the Action.