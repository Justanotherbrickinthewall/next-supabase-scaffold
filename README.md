# Next.js + Supabase Scaffold

A production-ready scaffold for building multi-tenant SaaS applications with Next.js, Supabase, and TypeScript.

## Features

- **Next.js 16** with App Router (TypeScript)
- **Supabase** for authentication and database (PostgreSQL)
- **Zustand** for lightweight state management
- **Tailwind CSS** for styling
- **Production-ready Dockerfile** with multi-stage builds
- **SQL-first migrations** via Supabase CLI
- **Comprehensive documentation** and development guidelines

## Quick Start

1. Clone the repository:

   ```bash
   git clone <your-repo-url>
   cd next-supabase-scaffold
   ```

2. Install dependencies:

   ```bash
   corepack enable  # First time only
   pnpm install
   ```

3. Set up environment variables:

   ```bash
   cp env.example .env.local
   # Fill in your Supabase credentials
   ```

4. Start the development server:

   ```bash
   pnpm dev
   ```

5. (Optional) Start local Supabase:
   ```bash
   pnpm db:start
   ```

## Documentation

- **[Guidelines](./docs/guideline.md)** - Architecture, onboarding, API guidelines, DB migrations
- **[Cursor Rules](./docs/cursorRules.md)** - Development conventions and best practices
- **[Use Cases](./docs/use-cases/)** - Feature documentation and project discography

## Project Structure

```
next-supabase-scaffold/
├── app/              # Next.js pages and API routes
├── components/       # Reusable React components
├── domain/           # Business logic (framework-agnostic)
├── lib/              # Utilities and Supabase clients
├── stores/           # Zustand state stores
├── supabase/         # Migrations and seeds
└── docs/             # Documentation
```

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm db:new <name>` - Create new migration
- `pnpm db:reset` - Reset local database
- `pnpm db:types:local` - Generate TypeScript types from local DB

## Production Deployment

Build and run with Docker:

```bash
docker build -t next-supabase-scaffold:latest .
docker run -p 3000:3000 --env-file .env.local next-supabase-scaffold:latest
```

## License

MIT
