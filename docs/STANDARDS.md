# Rose Garden Codebase Standards

These standards apply to all code in the `rose-garden` repo. When in doubt, match the surrounding code.

---

## Stack & Runtime

- **Framework:** Astro 7 (static output, `trailingSlash: 'always'`)
- **Language:** TypeScript (strict mode via `astro/tsconfigs/strict`)
- **Module system:** ESM (`"type": "module"` in `package.json`)
- **Node:** >= 22.12.0 (per `engines` in `package.json`)

---

## Directory Layout

```
src/
  components/   # Reusable Astro components (PascalCase: ProjectCard.astro)
  layouts/      # Page layouts (BaseLayout.astro)
  pages/        # File-based routes (index.astro → /)
  scripts/      # Client-side JS/TS modules (imported from <script type="module">)
  data/         # Static data files (YAML preferred)

scripts/        # One-off bash scripts (seed-from-wiki.sh)
docs/
  plans/        # Planning artifacts (rose-garden-plan.md, DESIGN.md)
  STANDARDS.md  # This file
public/         # Static assets copied as-is
```

---

## Naming

- **Files:** kebab-case for scripts (`seed-from-wiki.sh`), PascalCase for Astro components (`ProjectCard.astro`)
- **Variables / functions:** camelCase
- **Constants:** UPPER_SNAKE_CASE for exported / script-level constants
- **Types / interfaces:** PascalCase

---

## Data

- Static data lives in `src/data/` as **YAML** files.
- YAML is imported directly in Astro components via `import projects from '../data/projects.yaml'`.
- Do not store parallel JSON versions of the same data.
- The `scripts/seed-from-wiki.sh` script regenerates `projects.yaml` from the wiki directory.

---

## Components

- Use **scoped `<style>` blocks** inside each `.astro` component (the project convention, not global CSS).
- Use **CSS custom properties** for colors, spacing, and typography tokens. Token definitions live in the root layout or a global stylesheet. Never hardcode colors that have a token.
- Define **Astro interfaces** for component props at the top of the `<script>` block.
- Pass data down via props; avoid global state.

```astro
---
interface Props {
  title: string;
  status: string;
}
const { title, status } = Astro.props;
---
```

---

## Client Scripts

- Place browser logic in `src/scripts/` as TS/JS modules.
- Import them in Astro pages with `<script type="module">`.
- Use the JSON bridge pattern to pass server-rendered data to client scripts:

```astro
<script type="application/json" id="my-data" set:html={JSON.stringify(data)} />
<script type="module">
  import { init } from '../scripts/my-module';
  init(document.getElementById('my-data')!.textContent);
</script>
```

- Avoid large inline `<script>` blocks in `.astro` files.

---

## TypeScript

- Enable strict mode. All Astro props must have an explicit interface.
- Use `import type` for type-only imports.
- Do not use `any` except when bridging JSON data.

---

## Git

- **Conventional commits** for all messages:
  - `feat:` — new feature
  - `fix:` — bug fix
  - `refactor:` — code change that neither fixes a bug nor adds a feature
  - `docs:` — documentation only
  - `chore:` — tooling, dependencies, build
- Branch from `main`, open PRs to `main`.
- One logical change per commit. Do not mix refactors with features in a single commit.

---

## Testing

- No test framework is configured yet.
- When adding tests, place them next to the source file or in a matching `__tests__/` directory.

---

## Deployment

- **Target:** GitHub Pages via `.github/workflows/deploy.yml`.
- Build runs on push to `main`. The `GITHUB_USER` secret is injected at build time.
- Do not bypass the GitHub Action for production deploys.

---

## One-off Scripts

- Bash scripts live in `scripts/` (e.g., `scripts/seed-from-wiki.sh`).
- Use `set -euo pipefail` at the top of every bash script.
- Accept configuration via positional arguments with sensible defaults.
- Print clear progress and error messages to stdout/stderr.

---

## Docs & Plans

- `docs/plans/` contains planning artifacts. Do not edit plan files during implementation unless the plan is wrong.
- `docs/STANDARDS.md` (this file) is the source of truth for code style and conventions.
- Design tokens and visual identity are documented in `docs/plans/DESIGN.md`.
