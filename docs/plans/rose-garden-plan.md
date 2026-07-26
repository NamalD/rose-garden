---
title: Rose Garden - Plan
type: feat
date: 2026-07-26
artifact_contract: ce-unified-plan/v1
artifact_readiness: implementation-ready
product_contract_source: ce-brainstorm
execution: code
origin: docs/plans/rose-garden-plan.md
---

## Goal Capsule

**Objective:** Build Rose Garden — a personal static-site project tracker that surfaces what you want to build (wiki ideas) and what you're actively working on (GitHub repos), all in one dashboard with filtering by category and tech stack.

**Product authority:** Single-user personal tool — you own the data, the repo, and the decisions.

**Stop conditions:** Do not add authentication, drag-and-drop kanban, client-side editing, blog/RSS features, or detail pages beyond the dashboard.

**Execution profile:** Fresh Astro project scaffolded in this repo, deployed to GitHub Pages via Action. All design tokens sourced from `docs/plans/DESIGN.md`.

---

## Product Contract

### Requirements

R1. The site SHALL display all projects as cards on a single dashboard page. (see origin: docs/plans/project-tracker-plan.md)
R2. Each card SHALL show title, status badge, description, category tag, tech tags, and optional GitHub link. (see origin: docs/plans/project-tracker-plan.md)
R3. The site SHALL provide a stats bar showing Total, Active, Backlog, Stalled, and Completed counts. (see origin: docs/plans/project-tracker-plan.md)
R4. The site SHALL provide category filter pills (All, Fun, Learning, Useful) that are single-select. (see origin: docs/plans/project-tracker-plan.md)
R5. The site SHALL provide tech filter pills that are multi-select and combinable with category filters. (see origin: docs/plans/project-tracker-plan.md)
R6. The site SHALL source project data from a local `src/data/projects.yaml` file. (see origin: docs/plans/project-tracker-plan.md)
R7. At build time, the site SHALL fetch GitHub repo metadata for any project with a `github` field and merge it into the display. (see origin: docs/plans/project-tracker-plan.md)
R8. The site SHALL be deployed to GitHub Pages via a GitHub Action that triggers on push to main. (see origin: docs/plans/project-tracker-plan.md)
R9. The site SHALL use the Rose palette with monospace typography defined in `docs/plans/DESIGN.md`. (see origin: docs/plans/DESIGN.md)
R10. The site SHALL be fully static — no client-side editing, no auth, no dynamic routes beyond the dashboard. (see origin: docs/plans/project-tracker-plan.md)

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
| 9 | Visual design | Rose gradient palette + monospace typography, per `docs/plans/DESIGN.md` |
| 10 | Editing workflow | All data changes via editing `projects.yaml` and pushing — no client-side write path |

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

### Out of Scope

- Authentication / user accounts — single-user, public site
- Drag-and-drop kanban board — static card grid only
- Automated matching from GitHub to wiki ideas — manual link field
- Detail pages — all info on cards
- Blog, RSS, or other site features beyond project tracking
- Any client-side editing — all edits by pushing to the repo

---

## Planning Contract

### Key Technical Decisions

KTD1. (session-settled: user-directed) Astro as the static site generator — chosen over custom Python scripts, Jekyll, and client-side JS for its built-in data fetching, component model, and GitHub Pages deployment support. (see origin: docs/plans/project-tracker-plan.md) (Governs R1, R2, R3, R4, R5, R6, R7, R8, R9, R10)

KTD2. (session-settled: user-directed) Rose palette + monospace typology as the visual identity — chosen from four design directions after prototyping, combining Design C's playful gradient aesthetic with Design B's developer-focused monospace type. (see origin: docs/plans/DESIGN.md) (Governs R9)

KTD3. (session-settled: user-directed) GitHub API enrichment at build time only — no client-side API calls, no auth tokens, no write path from the browser. All data changes via `projects.yaml` + git push. (see origin: docs/plans/project-tracker-plan.md) (Governs R6, R7, R10)

KTD4. (session-settled: user-directed) GitHub username configured as `GITHUB_USER` repository variable in the Action — passed as an environment variable at build time, making the site forkable by others without code changes. (see origin: docs/plans/project-tracker-plan.md) (Governs R7, R8)

KTD5. Card grid with combined category + tech filtering as the sole page — no separate detail routes, no sidebar navigation. All filtering is implemented as client-side JavaScript for instant response without rebuilds. (see origin: docs/plans/project-tracker-plan.md) (Governs R1, R4, R5, R10)

### Assumptions

- The wiki project ideas directory structure (`Fun/`, `Learning/`, `Useful/` subfolders) will remain the canonical mapping to `category`.
- You'll be comfortable editing a YAML file for all project data (title, status, category, tech, github link, description) and pushing to the repo.
- GitHub repos you want to link are public (API access without auth for reading at build time).
- Your GitHub username is set as a `GITHUB_USER` variable in the repo settings, passed to the build by the Action.
- The site is served from the `dist/` directory via GitHub Pages. The Action handles deployment.

### High-Level Technical Design

```
metaproj/
├── src/
│   ├── pages/
│   │   └── index.astro            # Single-page dashboard
│   ├── data/
│   │   └── projects.yaml          # Canonical project data
│   ├── layouts/
│   │   └── BaseLayout.astro       # Shared page shell with global styles
│   └── components/
│       ├── StatsBar.astro         # Count summary (total / active / backlog / stalled / completed)
│       ├── FilterBar.astro        # Category pills + tech pills, combinable
│       ├── ProjectCard.astro      # Card with status border, tags, GH link
│       ├── ProjectGrid.astro      # Responsive card grid layout
│       └── StatusBadge.astro      # Color-coded status indicator
├── public/
│   └── style.css                  # Global styles (design tokens from DESIGN.md)
├── astro.config.mjs               # Astro config (output: dist, trailingSlash: always)
├── package.json
├── tsconfig.json
├── .github/workflows/
│   └── deploy.yml                 # Build + deploy to Pages (uses GITHUB_USER)
└── scripts/
    └── seed-from-wiki.sh          # One-time: generate projects.yaml from wiki dir
```

**Build-time data flow:**
1. `projects.yaml` is the source of truth
2. Astro reads it at build time
3. For each project with a `github` field, Astro fetches `https://api.github.com/repos/{owner}/{repo}` (unauthenticated, public repos only)
4. Merged data (stars, description, language, last push) is passed as props to components
5. Static HTML is generated to `dist/`

**Client-side filtering:**
- All project data is embedded in the page as a JSON script tag
- Client-side JavaScript reads the embedded data and filters cards based on pill selections
- No page reloads, no rebuilds needed for filtering

### Dependencies

- Node.js (version to be determined by Astro's default)
- GitHub repository with Pages enabled

### Scope Boundaries

- Single dashboard page — no routing beyond `/`
- No build step for filtering — filtering is client-side
- No API rate-limit handling beyond GitHub's unauthenticated 60 req/hr limit
- No error boundary for failed GitHub API calls — missing data renders as empty

---

## Implementation Units

### U1. Scaffold Astro project

**Goal:** Initialize a fresh Astro project with the correct directory structure and configuration for GitHub Pages deployment.

**Requirements:** R8, R10

**Files:**
- `astro.config.mjs` — new
- `package.json` — new
- `tsconfig.json` — new
- `src/pages/index.astro` — new (placeholder)
- `src/layouts/BaseLayout.astro` — new (placeholder)

**Approach:**
1. Run `npm create astro@latest` with the "empty" template, TypeScript enabled, no SSR
2. Update `astro.config.mjs` to set `output: 'static'` and `trailingSlash: 'always'`
3. Remove any sample content Astro generates
4. Create the directory structure matching the site structure above
5. Add a minimal `BaseLayout.astro` with the `<slot />` and global style import

**Test Scenarios:**
- `npm run dev` starts the dev server without errors
- `npm run build` produces a `dist/` directory with `index.html`
- Opening `dist/index.html` renders a blank page with no console errors

**Verification:** Run `npm run build` and confirm `dist/index.html` exists and contains the Astro boilerplate.

---

### U2. Implement design system (global styles)

**Goal:** Port the DESIGN.md tokens into a global CSS file that the entire site uses.

**Requirements:** R9

**Files:**
- `public/global.css` — new
- `src/layouts/BaseLayout.astro` — update

**Approach:**
1. Create `public/global.css` with:
   - CSS custom properties for all DESIGN.md color tokens (primary, surface, on-surface, status colors, tag colors)
   - CSS custom properties for spacing and rounded tokens
   - Base body styles: font-family (monospace stack), background gradient, min-height
   - Reset/normalize basics (box-sizing, margins)
2. Import `global.css` in `BaseLayout.astro` via `<link rel="stylesheet">`
3. Verify the gradient background and monospace font render on the placeholder page

**Design tokens to port (from DESIGN.md frontmatter):**
- Colors: primary `#be123c`, primary-gradient-end `#e11d48`, secondary `#9d174d`, surface `rgba(255,255,255,0.85)`, surface-variant `rgba(255,255,255,0.65)`, outline `rgba(225,29,72,0.12)`, outline-strong `rgba(225,29,72,0.15)`, background-start `#fff1f2`, background-mid `#fecdd3`, background-end `#fda4af`, background-last `#fbcfe8`, on-surface `#1a1a2e`, on-surface-variant `#6b7280`
- Status colors: active `#10b981`, backlog `#9ca3af`, stalled `#f59e0b`, completed `#3b82f6`
- Tag colors: fun-bg `#fae8ff` / text `#a21caf`, learning-bg `#fff7ed` / text `#c2410c`, useful-bg `#ecfdf5` / text `#059669`, tech-bg `#eef2ff` / text `#4338ca`
- Status badge colors: backlog-bg `#e5e7eb` / text `#4b5563`, active-bg `#d1fae5` / text `#059669`, stalled-bg `#fef3c7` / text `#d97706`, completed-bg `#dbeafe` / text `#2563eb`
- Rounded: sm `6px`, md `10px`, lg `16px`, xl `20px`
- Spacing: xs `4px`, sm `8px`, md `12px`, lg `20px`, xl `24px`, xxl `36px`, xxxl `40px`

**Test Scenarios:**
- Dev server renders with rose gradient background
- Text is monospace across the page
- No flash of unstyled content

**Verification:** Run `npm run dev`, open the page, confirm rose gradient background and monospace font.

---

### U3. Create data layer and seed script

**Goal:** Set up the project data file and a one-time script to seed it from the wiki directory.

**Requirements:** R6

**Files:**
- `src/data/projects.yaml` — new (seeded with sample data)
- `scripts/seed-from-wiki.sh` — new

**Approach:**
1. Create `src/data/projects.yaml` with 3-5 sample projects covering all statuses and categories
2. Create `scripts/seed-from-wiki.sh` that:
   - Scans `~/wiki/raw/Project ideas 1/{Fun,Learning,Useful}/` for `.md` files
   - Extracts the title (first H1 or filename)
   - Generates a YAML entry per file with `status: backlog`, `category` from the subfolder name
   - Writes to `src/data/projects.yaml`
   - Skips files that already have an entry (idempotent)
3. Make the script executable
4. Document usage in a comment at the top of the script

**YAML schema for each entry:**
```yaml
- id: <integer>
  title: <string>
  status: backlog|active|stalled|completed
  category: fun|learning|useful
  tech: []
  description: <string>
  github: <string|null>
  source: <path>
```

**Test Scenarios:**
- Run the script manually: it creates a valid `projects.yaml`
- Running it twice does not duplicate entries
- The YAML parses correctly with Astro's data loading

**Verification:** Run `node -e "console.log(await import('yaml'))"` or equivalent to confirm YAML parsing works, then run the script and inspect the output file.

---

### U4. Build core Astro components

**Goal:** Create all reusable Astro components for the dashboard.

**Requirements:** R1, R2, R3, R9

**Files:**
- `src/components/StatusBadge.astro` — new
- `src/components/ProjectCard.astro` — new
- `src/components/ProjectGrid.astro` — new
- `src/components/StatsBar.astro` — new
- `src/components/FilterBar.astro` — new

**Approach:**
1. **StatusBadge.astro** — accepts `status` prop, renders emoji + uppercase label with color-coded background
2. **ProjectCard.astro** — accepts `project` object prop, renders:
   - Card container with status-colored left border
   - Header: title + StatusBadge
   - Description text
   - Tags row: category pill + tech pills
   - GitHub link (if `project.github` is set)
3. **ProjectGrid.astro** — accepts `projects` array prop, renders responsive CSS grid of ProjectCard components
4. **StatsBar.astro** — accepts `projects` array prop, computes counts, renders 5 stat boxes
5. **FilterBar.astro** — accepts `categories`, `techs`, `activeCategory`, `activeTechs`, callbacks for selection. Renders two rows of filter pills.

All components use CSS classes that map to the global CSS custom properties defined in U2. Component-specific styles (hover effects, transitions) are scoped to each `.astro` file's `<style>` block.

**Test Scenarios:**
- Each component renders without errors when passed valid props
- StatusBadge renders correct emoji and color for each status
- ProjectCard renders GitHub link only when `github` is set
- ProjectGrid renders correct number of cards
- Filter pills show correct active/inactive states

**Verification:** Import each component into a test page and confirm visual output matches DESIGN.md spec.

---

### U5. Build dashboard page with client-side filtering

**Goal:** Assemble the components into the dashboard page and implement client-side filtering logic.

**Requirements:** R1, R2, R3, R4, R5, R9, R10

**Files:**
- `src/pages/index.astro` — new (main dashboard)

**Approach:**
1. In `index.astro`:
   - Import all components from U4
   - Load `projects.yaml` via Astro's `import` (build-time)
   - Fetch GitHub API data for linked repos (see U6)
   - Embed the full projects array as a JSON script tag for client-side access
   - Render StatsBar, FilterBar, and ProjectGrid with initial data
2. Add client-side JavaScript (inline in the page, no framework needed):
   - Read embedded project data from the script tag
   - Filter function: applies active category + active tech filters
   - Event handlers on filter pills to update active state and re-render the grid
   - Category pills are single-select (clicking one deselects others)
   - Tech pills are multi-select (toggle on/off)
   - "Clear tech" button resets tech filters
3. Render logic:
   - Filtered projects are passed to ProjectGrid
   - StatsBar always shows counts for all projects (not filtered counts)
   - Empty state shown when no projects match

**Test Scenarios:**
- Page loads with all projects visible
- Clicking a category pill filters to that category only
- Clicking a tech pill adds that filter (combines with category)
- Clicking an active tech pill removes it
- Clicking "clear tech" removes all tech filters
- Empty state appears when filters match nothing
- Stats bar always shows total counts, not filtered counts

**Verification:** Run `npm run dev`, open the page, interact with all filter combinations, confirm correct behavior.

---

### U6. GitHub API integration at build time

**Goal:** Fetch GitHub repo metadata during the Astro build and merge it into project data.

**Requirements:** R7

**Files:**
- `src/lib/github.ts` — new (or inline in `index.astro`)

**Approach:**
1. Create a utility function `fetchGitHubRepo(owner: string, repo: string)` that:
   - Calls `https://api.github.com/repos/{owner}/{repo}` (unauthenticated)
   - Returns `{ stars, description, language, lastPush }` or `null` on failure
   - Has a 5-second timeout to avoid blocking the build
2. In `index.astro`, during the Astro `load` function or frontmatter:
   - For each project with a `github` field, call the fetch function
   - Merge the result into the project object under a `githubData` key
   - Log a warning if the API call fails (don't block the build)
3. Pass the enriched data to components:
   - ProjectCard shows stars count and language if `githubData` exists
   - GitHub link includes the repo name from `githubData`

**API rate limit handling:**
- Unauthenticated: 60 req/hr — sufficient for ~dozens of projects
- If rate-limited, log a warning and continue without GitHub data
- Future: add `GITHUB_TOKEN` secret to Action for 5000/hr

**Test Scenarios:**
- Build succeeds when all GitHub API calls succeed
- Build succeeds when some GitHub API calls fail (graceful degradation)
- ProjectCard renders GitHub data when available
- ProjectCard does not show GitHub section when `github` is null

**Verification:** Run `npm run build` with at least one project having a `github` field. Inspect the generated HTML for GitHub data.

---

### U7. GitHub Actions deployment

**Goal:** Set up automated deployment to GitHub Pages on push to main.

**Requirements:** R8, R4

**Files:**
- `.github/workflows/deploy.yml` — new

**Approach:**
1. Create `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages
   on:
     push:
       branches: [main]
   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
           with:
             node-version: 20
         - run: npm ci
         - run: npm run build
           env:
             GITHUB_USER: ${{ vars.GITHUB_USER }}
         - uses: peaceiris/actions-gh-pages@v3
           with:
             publish_dir: ./dist
             github_token: ${{ secrets.GITHUB_TOKEN }}
   ```
2. Document in README that the user must set `GITHUB_USER` as a repository variable in the repo settings

**Test Scenarios:**
- Push to main triggers the Action
- Action completes successfully
- Site is live at the GitHub Pages URL
- `GITHUB_USER` is correctly passed to the build

**Verification:** Push a commit to main, monitor the Action run, confirm deployment succeeds.

---

### U8. Seed initial project data from wiki

**Goal:** Populate `projects.yaml` with the user's actual project ideas from the wiki directory.

**Requirements:** R6

**Files:**
- `src/data/projects.yaml` — update (replace sample data)
- `scripts/seed-from-wiki.sh` — update (from U3)

**Approach:**
1. Run `scripts/seed-from-wiki.sh` to generate the initial `projects.yaml`
2. Review the generated file for correctness
3. Manually adjust any entries that need refinement (descriptions, tech tags)
4. Commit the seeded `projects.yaml`
5. Verify the site renders correctly with the real data

**Test Scenarios:**
- All wiki project ideas appear in the dashboard
- Category is correctly assigned from the wiki subfolder
- Tech tags are populated from the YAML
- GitHub links render where set

**Verification:** Run the seed script, commit the output, push, and confirm the live site shows all projects.

---

## Verification Contract

### Repo-specific commands

| Command | Purpose | When |
|---------|---------|------|
| `npm run dev` | Start dev server for visual verification | After U2, U4, U5 |
| `npm run build` | Build static site for production | After U6, U7 |
| `npm run preview` | Preview production build locally | After U7 |
| `git push` | Trigger GitHub Action deployment | After U7 |
| `scripts/seed-from-wiki.sh` | Seed projects.yaml from wiki | U3, U8 |

### Quality gates

- Build completes without errors (`npm run build` exits 0)
- No console warnings in the dev server
- All filter combinations produce correct results
- GitHub API failures do not break the build
- Deployed site matches the DESIGN.md visual spec (rose gradient, monospace font, frosted glass cards)

---

## Definition of Done

- [ ] `npm run build` succeeds and produces a `dist/` directory
- [ ] Dashboard renders with rose gradient background and monospace typography
- [ ] All projects from `projects.yaml` appear as cards
- [ ] Stats bar shows correct counts for all statuses
- [ ] Category filters work (single-select)
- [ ] Tech filters work (multi-select, combinable with category)
- [ ] Empty state appears when filters match nothing
- [ ] GitHub repo data appears on cards with linked repos
- [ ] GitHub Action deploys to Pages on push to main
- [ ] `projects.yaml` is seeded with real project data from wiki
- [ ] `scripts/seed-from-wiki.sh` works and is documented
- [ ] No client-side editing, no auth, no dynamic routes beyond `/`
