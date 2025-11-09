# Project Guidelines

## Architecture Overview

- Next.js App Router for pages and API route handlers.
- Supabase for Auth and Postgres (local via CLI; QA/Prod managed).
- State: lightweight via Zustand for UI and org selection.
- APIs are global and accept `organization_id` for scoping.

### High-level Flow

1. Client requests page (server component where possible).
2. API calls via Next.js route handlers under `/api/v1/*`.
3. Each API validates session and uses `organization_id` query param.
4. Data access via Supabase client (RLS-first in later phases).

### Directories

- `app/` pages and APIs (`app/api/v1/**/route.ts`).
- `stores/` small Zustand stores (UI, org).
- `domain/` business logic (pure TS utilities).
- `docs/` concise living documentation.
- `Dockerfile` for production builds; Supabase via CLI.

---

## Onboarding (5 minutes)

**Prerequisites:** Node 18+, Docker Desktop. pnpm via Corepack.

1. Clone repo and cd into `next-supabase-scaffold/`.
2. Copy envs: `cp env.example .env.local` and fill values.
3. Enable Corepack (pnpm): `corepack enable` (first time only).
4. Install deps: `pnpm install`.
5. Start app: `pnpm dev`
6. (Optional) Start local Supabase: `npx supabase start`.

**Conventions:**

- UI components via `npx shadcn@latest add <component>`.
- Keep docs concise; update after each feature.

---

## Environments

- **Development:** Local Next.js + Supabase CLI (containers).
- **QA/Production:** Managed Supabase; Next.js deployed to your target platform.

### Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Create `.env.local` from `env.example`. Do not commit secrets.

### Running Locally

1. `corepack enable` (first time only) and `pnpm install`
2. (Optional DB) `npx supabase start`
3. App: `pnpm dev`

---

## Docker & Production Deployment

### Dockerfile

Production-ready multi-stage Dockerfile optimized for Next.js:

- **Stage 1 (deps):** Installs dependencies with frozen lockfile
- **Stage 2 (builder):** Builds the Next.js application
- **Stage 3 (runner):** Minimal production image with non-root user

### Building and Running Production Image

```bash
# Build the image
docker build -t next-supabase-scaffold:latest .

# Run locally
docker run -p 3000:3000 --env-file .env.local next-supabase-scaffold:latest
```

**Note:** When you have multiple services (e.g., web + Supabase local + Redis), create a `docker-compose.yml` to orchestrate them together.

### Production Considerations

- Image uses `node:20-alpine` for minimal size (~150MB)
- Runs as non-root user (`nextjs:nodejs`) for security
- Uses Next.js standalone output for optimal bundle size
- Environment variables should be provided via `.env.local` or container orchestration
- For large-scale deployments, consider:
  - Container orchestration (Kubernetes, Docker Swarm)
  - Load balancing
  - Health checks
  - Resource limits and requests
  - Horizontal scaling

---

## API Guidelines

- **Base path:** `/api/v1/*`
- **Global APIs:** Pass `organization_id` as a query param for org-scoped reads/writes.
- **JSON in/out:** Consistent error shape `{ error: { code, message } }`.

### Versioning

- Keep `/v1` stable; introduce `/v2` when breaking changes are necessary.

### Conventions

- GET lists: `/resource?organization_id=...&limit=&cursor=`
- GET one: `/resource/:id?organization_id=...`
- POST/PUT/PATCH/DELETE: include `organization_id` as query param; server asserts authorization.
- Idempotency for mutations when applicable (headers: `Idempotency-Key`).

### Auth

- Session via Supabase (cookie-based); server validates.
- No secrets on the client.

---

## DB Migrations

- **SQL-first** using Supabase CLI migrations.
- **Forward-only:** Never edit past migrations.
- **Environments:** Local (CLI), QA/Prod (managed).

### Commands

- Init: `npx supabase init`
- Start local: `npx supabase start`
- New migration: `npx supabase migration new <name>`
- Reset (local): `npx supabase db reset`
- Push (linked env): `npx supabase db push`
- Generate types: `npx supabase gen types typescript --local > lib/db/types.ts`

### Conventions

- One logical change per migration; order: types → tables → constraints → indexes → functions → policies.
- Idempotent seeds per environment (`seed/dev|qa|prod/`).
