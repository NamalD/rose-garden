# Rose Garden

A personal static project tracker that surfaces wiki project ideas alongside active GitHub repos on a single dashboard. Built with Astro and deployed to GitHub Pages.

## What it does

- Shows all projects as cards on one dashboard
- Filters by category (`fun`, `learning`, `useful`) and tech stack
- Enriches linked GitHub repos with stars, language, and last push at build time
- Fully static — no auth, no client-side editing, no backend

## Prerequisites

- [Bun](https://bun.sh) >= 1.3
- Node.js >= 22.12

## Getting started

```bash
bun install
bun run dev
```

Open `http://localhost:4321`.

## Available scripts

| Script | Purpose |
|--------|---------|
| `bun run dev` | Start the dev server |
| `bun run build` | Build the static site to `dist/` |
| `bun run preview` | Preview the production build locally |
| `bun run seed` | Seed `src/data/projects.yaml` from the wiki directory |

## Project structure

```
src/
  components/   # Reusable Astro components
  layouts/      # Shared page layout
  pages/        # File-based routes (index.astro → /)
  scripts/      # Client-side JS/TS modules
  data/         # Static YAML data
public/         # Static assets copied as-is
```

## Data

Project data lives in `src/data/projects.yaml`. Run the seed script to regenerate it from the wiki:

```bash
scripts/seed-from-wiki.sh
```

Each project supports `title`, `status`, `category`, `tech`, `description`, `github`, and `source`.

## Deployment

Deploys to GitHub Pages via `.github/workflows/deploy.yml` on push to `main`. The workflow uses `oven-sh/setup-bun@v1` and `bun install --frozen-lockfile`.

## Conventions

See `docs/STANDARDS.md` for code style, commit conventions, and architecture decisions.
