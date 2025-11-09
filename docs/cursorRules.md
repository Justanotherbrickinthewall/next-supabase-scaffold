### Cursor rules and conventions

#### General

- Use pnpm. Do not use npm/yarn. Do not commit `package-lock.json`.
- Use `npx shadcn@latest add ...` to add UI primitives (on-demand).
- Keep code changes focused; update docs when a use case is completed.
- Delete `.gitkeep` once the first real file is added to that folder.

#### Project structure

- Pages: `app/**/page.tsx`. APIs: `app/api/v1/**/route.ts`.
- Keep biz logic in `domain/` (framework-agnostic).
- Small Zustand stores in `stores/` for UI/org state only.

#### Code style

- TypeScript strict; prefer explicit types on exports.
- Early returns, small functions, minimal nesting.
- Comments only for non-obvious context; avoid TODOs—implement instead.

#### API

- Global endpoints; pass `organization_id` as query param.
- JSON responses; consistent error shape `{ error: { code, message } }`.
- Version under `/api/v1/*`.

#### Tooling

- Supabase: SQL-first migrations via CLI (forward-only).
- Dev-only docs (Swagger) guarded by env; not enabled in prod.
- Local dev:
  - Install deps: `pnpm install` (if pnpm missing, run `corepack enable`).
  - Run app: `pnpm dev`
  - Production: Build with `docker build -t next-supabase-scaffold:latest .`

---

### Folder usage guide

- `app/`:
  - Pages: `.../page.tsx` (server components by default; add `'use client'` when needed).
  - Layouts: `.../layout.tsx` for section shells.
  - APIs: `api/v1/**/route.ts` (export `GET`, `POST`, etc.). Keep handlers thin.
  - Dev-only docs: `(dev)/api-docs/page.tsx` and `api/openapi/route.ts` (guarded by env).
- `components/`:
  - Global, reusable presentational components used across multiple pages.
  - `components/ui/` for shadcn components (added via `npx shadcn@latest add ...`).
  - Prefer placing a component here only if it is reused by more than one page/feature.
  - For page-scoped reuse, co-locate components inside that page’s folder (see below).
  - Examples:
    - Global: `components/common/EmptyState.tsx` used by several features.
    - Local (page-scoped): `app/(app)/dashboard/components/Chart.tsx` used only by dashboard pages.
- `domain/`:
  - Framework-agnostic business logic (pure TS). No React/Supabase instances here.
- `lib/`:
  - Cross-cutting helpers (auth/session, supabase client/server, fetcher, utils).
  - `lib/db/types.ts` is generated from Supabase (do not hand-edit).
- `stores/`:
  - Global UI state with Zustand. One store per concern (e.g., `org.store.ts`, `ui.store.ts`).
- `docs/`:
  - Living docs: `guideline.md` (architecture, API guidelines, migrations, environments, onboarding), `cursorRules.md`, `use-cases/`.
  - Add concise writeups to `docs/use-cases/` per feature (see rules below).
- `supabase/`:
  - `migrations/` (SQL), `seed/` (dev/qa/prod), `config.toml` (CLI).

Delete `.gitkeep` after the first real file lands in a folder.

---

### State management (Zustand)

- Location: `stores/*.store.ts` (e.g., `stores/org.store.ts`).
- Scope:
  - Keep only UI and cross-page ephemeral state (selected organization, modals, toggles).
  - Do not store server-fetched records or secrets; fetch per page/API.
- Patterns:
  - Prefer small stores; avoid a “god” store.
  - Use selectors: `useStore((s) => s.slice)` to reduce re-renders.
  - Persistence is optional; if used, persist only non-sensitive prefs.

---

### API route handlers

- Path: `app/api/v1/**/route.ts`
- Handlers export HTTP methods:
  - `export async function GET(req: Request) { ... }`
  - `export async function POST(req: Request) { ... }`
- Org context:
  - Pass `organization_id` as a query parameter; validate presence for org-scoped endpoints.
- Keep thin:
  - Parse/validate input (consider Zod).
  - Authorize.
  - Call `domain/*` functions.
  - Return JSON with a consistent error shape: `{ error: { code, message } }`.

---

### Pages and layouts

- Pages belong under `app/**/page.tsx`.
- Use route groups `(public)`, `(app)`, `(dev)` when helpful for organization.
- Keep `organization_id` in the URL (`?org=<id>`) as the source of truth; mirror to a small store if needed.
- Use `'use client'` only when interactivity is required.
- Local components for a page/section should live under `app/.../components/` next to the page using them. Promote to `components/` only when reused broadly.

---

### Supabase migrations (where and how)

- Files live in: `supabase/migrations/` (SQL-first, forward-only).
- Seeds live in: `supabase/seed/dev|qa|prod/seed.sql` (idempotent; safe to rerun).
- Create a new migration:
  1. `pnpm db:new <name>` (wraps `npx supabase migration new <name>`).
  2. Edit the generated SQL in `supabase/migrations/<timestamp>_<name>.sql`.
  3. Apply locally and verify: `pnpm db:reset` (recreates DB, applies all migrations, runs seed if present).
  4. Generate types: `pnpm db:types:local` → writes to `lib/db/types.ts`.
  5. Commit migration + updated types.
- Promote to QA/Prod:
  - Link once (outside of repo state): `npx supabase link --project-ref <PROJECT_REF>`
  - Apply: `pnpm db:push` (wraps `npx supabase db push`).
  - Run environment seeds via CI or SQL editor.
- Conventions:
  - One logical change per migration.
  - Order statements: types → tables → constraints → indexes → functions → policies.
  - Use forward-only; for “rollback,” write a new reversing migration.

---

### Naming and conventions

- Files: `kebab-case` for routes, `PascalCase` for components, `camelCase` for helpers.
- Tables/columns (DB): `snake_case` (see `docs/guideline.md` for migration conventions).
- Keep exports typed; prefer explicit types on public functions.
- Use short, descriptive module boundaries (feature-first).

---

### Developer workflow

- Install: `corepack enable` (once), then `pnpm install`.
- Run app: `pnpm dev`
- Production build: `docker build -t next-supabase-scaffold:latest .`
- Supabase local (optional for now): `pnpm db:init` (once), `pnpm db:start`, `pnpm db:reset`.
- Adding a page:
  - Create `app/(app)/feature/page.tsx`, server component by default.
  - If interactive, mark `'use client'` and use small stores/hooks.
- Adding an API:
  - Add `app/api/v1/<resource>/route.ts` with method exports.
  - Validate `organization_id` when required.
  - Keep logic in `domain/feature/*`.
- Adding a migration:
  - `pnpm db:new <name>` → edit SQL → `pnpm db:reset` → `pnpm db:types:local` → commit.

---

### Use-cases documentation (discography)

- Folder: `docs/use-cases/`
- Naming: `YYYYMMDD-area-slug.md` (e.g., `20251109-staff-management-crud.md`)
- Template: copy `docs/use-cases/_template.md`
- When to add:
  - New user-facing capability/workflow/module.
  - Significant backend/API capability referenced by product or multiple teams.
  - Cross-cutting changes (auth/tenancy/observability) altering implementation strategy.
- When not to add:
  - Minor fixes, copy tweaks, small refactors (instead update the related use-case if needed).
- Working rules:
  1. Before starting, search existing use-cases. If a match exists, update it and mark `status: in_progress`.
  2. If none exists, create a new one from the template with minimal context and set `status: in_progress`.
  3. Keep docs concise; link to code paths and PRs rather than duplicating code.
  4. On PR, link the use-case in the description. After merge, set `status: completed` and add a changelog entry with the PR number.

This process helps Cursor and teammates quickly locate relevant files and decisions.

---

### Swagger (dev-only)

- UI page: `app/(dev)/api-docs/page.tsx` (guarded by `NEXT_PUBLIC_ENABLE_DOCS` and non-prod).
- JSON: `app/api/openapi/route.ts`.
- Enable locally with: `pnpm dev:docs`.

---

### Git and PRs

- Do not commit `.env.local`, `package-lock.json`, or build artifacts.
- Keep PRs focused; update `docs/use-cases/` and relevant docs when features land.
- Review checklist for migrations: locking risk, RLS impact, indexes, seeds, types regenerated.
