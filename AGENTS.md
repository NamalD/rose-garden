# AGENTS.md

This file gives instructions to coding agents (human or AI) working in this repository.

## First Steps

Before writing any code, read these files:

1. **`docs/STANDARDS.md`** — codebase standards, conventions, and architecture decisions. Follow these.
2. **`docs/plans/rose-garden-plan.md`** — product requirements and stop conditions. Do not build outside the plan.
3. **`docs/plans/DESIGN.md`** — visual identity, design tokens, and typography.

## Core Rules

- Match existing conventions. When in doubt, read the surrounding code and follow its style.
- Keep components in `src/components/`, pages in `src/pages/`, client scripts in `src/scripts/`, data in `src/data/`.
- Use YAML for static data. Do not create parallel JSON versions.
- Use scoped `<style>` blocks and CSS custom properties. Do not add global CSS.
- Write conventional commits (`feat:`, `fix:`, `refactor:`, `docs:`, `chore:`).
- One logical change per commit.
- The site is fully static. Do not add auth, client-side editing, dynamic routes, or a backend.

## Git Workflow

- Branch from `main`.
- Open PRs to `main`.
- Do not push directly to `main`.
- Commit, push, and open a PR as part of normal work — do not wait to be asked.

## When Stuck

- Re-read `docs/STANDARDS.md` and the relevant plan section.
- Check the existing code in `src/` for patterns to follow.
- If the plan is wrong, stop and discuss before changing code.
