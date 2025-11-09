---
id: 20251109-sample-use-case
title: Sample Use Case Title
status: in_progress # in_progress | completed | deprecated
owners: [github-handle]
created: 2025-11-09
updated: 2025-11-09
links:
  - pr: ""
  - design: ""
---

## Context
Briefly explain the problem and why we’re doing this. One short paragraph.

## Goals
- What success looks like.

## Non-goals
- What is explicitly out of scope.

## API surface
- Endpoints (global; pass `organization_id` when required)
  - GET `/api/v1/...` — params: `organization_id`, ...
  - POST `/api/v1/...`

## Pages / Components
- Pages: `app/(app)/feature/page.tsx`
- Local components: `app/(app)/feature/components/...`
- Global components (if reused): `components/...`

## State / Org handling
- Where Zustand is used (if any) and how `?org=<id>` is managed.

## Migrations (if any)
- `supabase/migrations/2025..._add_feature.sql`
- Seeds: `supabase/seed/dev/seed.sql`

## Acceptance criteria
- [ ] Criterion A
- [ ] Criterion B

## Changelog
- 2025-11-09: Created doc (PR #).


