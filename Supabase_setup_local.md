# Supabase Local Setup Guide

This guide will walk you through setting up Supabase for local development. This setup uses isolated ports to avoid conflicts with other Supabase instances running on your machine.

## Prerequisites

- **Node.js** 18+ installed
- **Docker Desktop** running (Supabase CLI uses Docker containers)
- **pnpm** package manager (via Corepack)

## Step 1: Check if Supabase CLI is Installed

First, check if you have the Supabase CLI installed:

```bash
supabase --version
```

If you see a version number, you're good to go! Skip to Step 3.

If you get a "command not found" error, proceed to Step 2.

## Step 2: Install Supabase CLI

### Option A: Using Homebrew (macOS/Linux)

```bash
brew install supabase/tap/supabase
```

### Option B: Using npm/npx (Cross-platform)

You can use Supabase CLI via npx without installing globally:

```bash
# This project already uses npx, so no installation needed!
# Just use: npx supabase <command>
```

### Option C: Using npm (Global Installation)

```bash
npm install -g supabase
```

After installation, verify it works:

```bash
supabase --version
```

## Step 3: Verify Docker is Running

Supabase CLI requires Docker Desktop to be running. Check if Docker is running:

```bash
docker ps
```

If you see a list of containers or no error, Docker is running. If you get an error, start Docker Desktop.

## Step 4: Initialize Supabase (First Time Only)

If this is your first time setting up Supabase for this project, initialize it:

```bash
pnpm db:init
```

Or directly:

```bash
npx supabase init
```

This will:

- Create a `supabase/` directory with configuration files
- Set up the project structure for migrations and seeds
- Create `supabase/config.toml` with default settings

**Note:** If you see prompts about VS Code or IntelliJ settings, you can answer "N" (No) unless you want those integrations.

## Step 5: Configure Ports (Avoid Conflicts)

If you have other Supabase instances running, you need to configure different ports to avoid conflicts.

Edit `supabase/config.toml` and update these ports if needed:

```toml
[api]
port = 54331  # API URL port (default: 54321)

[db]
port = 54332  # Database port (default: 54322)
shadow_port = 54330  # Shadow database port (default: 54320)

[studio]
port = 54333  # Supabase Studio port (default: 54323)

[inbucket]
port = 54334  # Email testing server port (default: 54324)

[analytics]
port = 54337  # Analytics port (default: 54327)

[db.pooler]
port = 54339  # Connection pooler port (default: 54329)
```

**This project is already configured with non-conflicting ports** (54331-54339 range).

## Step 6: Start Supabase

Start the local Supabase instance:

```bash
pnpm db:start
```

Or directly:

```bash
npx supabase start
```

This will:

- Pull Docker images (first time only, takes a few minutes)
- Start all Supabase services (database, API, Studio, etc.)
- Apply any migrations in `supabase/migrations/`
- Display your connection credentials

**Expected output:**

```
Starting database...
Initialising schema...
Applying migration 20251109132824_create_project_table.sql...
Starting containers...
Waiting for health checks...
         API URL: http://127.0.0.1:54331
     GraphQL URL: http://127.0.0.1:54331/graphql/v1
  S3 Storage URL: http://127.0.0.1:54331/storage/v1/s3
    Database URL: postgresql://postgres:postgres@127.0.0.1:54332/postgres
      Studio URL: http://127.0.0.1:54333
     Mailpit URL: http://127.0.0.1:54334
 Publishable key: sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH
      Secret key: sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz
Started supabase local development setup.
```

**Important:** Copy the `API URL` and `Publishable key` - you'll need them in the next step!

## Step 7: Set Up Environment Variables

Create a `.env.local` file in the project root (if it doesn't exist):

```bash
cp env.example .env.local
```

Then edit `.env.local` and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54331
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH
```

**Replace the values with:**

- `NEXT_PUBLIC_SUPABASE_URL`: The API URL from Step 6 (e.g., `http://127.0.0.1:54331`)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: The Publishable key from Step 6

## Step 8: Verify Setup

Check the status of your Supabase instance:

```bash
pnpm db:status
```

Or:

```bash
npx supabase status
```

This will show you all the running services and their URLs.

## Step 9: Access Supabase Studio (Optional)

Supabase Studio is a web interface for managing your database. Open it in your browser:

```
http://127.0.0.1:54333
```

You can:

- View and edit tables
- Run SQL queries
- Manage authentication
- View API documentation

## Step 10: Test the Connection

Start your Next.js development server:

```bash
pnpm dev
```

Visit `http://localhost:3000` - you should see:

- **Green background** = Supabase connected and Project table exists ✅
- **Red background** = Connection issue ❌
- **Gray background** = Still checking...

The page automatically checks the heartbeat every 5 seconds.

## Common Commands

### Start Supabase

```bash
pnpm db:start
```

### Stop Supabase

```bash
pnpm db:stop
```

### Check Status

```bash
pnpm db:status
```

### Reset Database (applies all migrations from scratch)

```bash
pnpm db:reset
```

### Create New Migration

```bash
pnpm db:new <migration_name>
```

### Generate TypeScript Types

```bash
pnpm db:types:local
```

## Troubleshooting

### Port Already in Use

If you get an error like:

```
Bind for 0.0.0.0:54322 failed: port is already allocated
```

**Solution:** Update the ports in `supabase/config.toml` (see Step 5) or stop the conflicting Supabase instance:

```bash
# Stop the conflicting project
npx supabase stop --project-id <project-id>
```

### Docker Not Running

If you see Docker-related errors, make sure Docker Desktop is running:

```bash
# Check Docker status
docker ps
```

### Migration Errors

If migrations fail, you can reset the database:

```bash
pnpm db:reset
```

This will:

- Drop all tables
- Reapply all migrations from scratch
- Run seed files (if any)

### Container Health Check Failed

If containers fail to start:

```bash
# Stop everything
pnpm db:stop

# Start again
pnpm db:start
```

If issues persist, check Docker Desktop for container errors.

## Next Steps

- Create new migrations: `pnpm db:new <name>`
- View database in Studio: `http://127.0.0.1:54333`
- Generate TypeScript types: `pnpm db:types:local`
- Read the [project guidelines](./docs/guideline.md) for API and database conventions

## Additional Resources

- [Supabase CLI Documentation](https://supabase.com/docs/guides/cli)
- [Local Development Guide](https://supabase.com/docs/guides/cli/local-development)
- [Migration Guide](https://supabase.com/docs/guides/cli/managing-environments)
