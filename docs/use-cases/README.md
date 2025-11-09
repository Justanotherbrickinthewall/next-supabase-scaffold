### Use-cases directory

This folder contains concise, living documents that describe each meaningful product use case delivered on this scaffold. Think of it as the product discography: one doc per use case, updated as work progresses.

#### When to create or update

- Create a NEW use-case doc when:
  - A new user-facing capability, workflow, or module is being introduced.
  - A significant backend/API capability is added that product teams will reference.
  - A cross-cutting change (auth/tenancy/observability) alters how other features are built.
- Do NOT create a new doc for:
  - Minor bug fixes, copy/style tweaks, low-impact refactors (update the existing related use case if needed).
  - Internal cleanup not affecting behavior or developer workflow.

#### Naming convention

- File name: `YYYYMMDD-area-slug.md`
  - Examples:
    - `20251109-auth-login-signup.md`
    - `20251109-admin-onboard-organization.md`
    - `20251109-staff-management-crud.md`

#### Required sections (see `_template.md`)

- Title and metadata (id, status, owners, dates, links)
- Context and Goals/Non-goals
- API surface (endpoints, params such as `organization_id`)
- Pages/Components affected (paths)
- State/Org handling notes (Zustand usage, URL params)
- Migrations (if any) – reference migration filenames
- Acceptance criteria
- Changelog

#### Workflow (developer)

1. Before coding: check `docs/use-cases/` for an existing doc.
   - If found, set status to `in_progress` and update context/goals if needed.
   - If not found, copy `_template.md` to a new file using the naming convention and fill minimal context.
2. While coding: keep the doc short but up-to-date (endpoints, pages, state notes).
3. On PR: link the use-case file in the PR description.
4. After merge: set status to `completed` and add a brief entry to the Changelog with the PR number.

Keep it concise. Prefer links to code paths over long prose. 


