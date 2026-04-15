# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## Artifacts

### Quiz Badge System (`artifacts/quiz-badge`)
- **Route**: `/` (root)
- **Type**: React + Vite frontend
- **Stack**: React, TypeScript, Tailwind CSS, Framer Motion, Supabase JS client
- **Description**: Typeform-style quiz app with timed questions, badge awards, and admin panel
- **Environment Variables**: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_ADMIN_PASSWORD`

## Quiz Badge System — Setup Required

### 1. Supabase Database Schema

Run this SQL in your Supabase project → SQL Editor:

```sql
create extension if not exists "uuid-ossp";

create table questions (
  id uuid primary key default uuid_generate_v4(),
  text text not null,
  options text[] not null,
  correct_index int2 not null,
  "order" int4 not null default 0,
  created_at timestamptz default now()
);

create table attempts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id),
  answers jsonb not null default '[]',
  started_at timestamptz default now(),
  completed_at timestamptz,
  passed boolean,
  badge_url text
);

create table badges (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id),
  attempt_id uuid references attempts(id),
  awarded_at timestamptz default now(),
  image_url text
);

alter table questions enable row level security;
alter table attempts enable row level security;
alter table badges enable row level security;

create policy "Public can read questions" on questions for select using (true);
create policy "Users can insert own attempts" on attempts for insert with check (auth.uid() = user_id);
create policy "Users can read own attempts" on attempts for select using (auth.uid() = user_id);
create policy "Users can update own attempts" on attempts for update using (auth.uid() = user_id);
create policy "Users can read own badges" on badges for select using (auth.uid() = user_id);
```

### 2. Supabase Auth

Enable **Anonymous Sign-ins** in: Supabase Dashboard → Authentication → Providers → Anonymous

### 3. Supabase Storage

Create a public storage bucket named `badges` and upload a `badge.png` image to it.

### 4. Deploy the Edge Function

```bash
supabase functions deploy grade-attempt --project-ref dutbkluisrvamstnpebx
```

Set these secrets in Supabase Dashboard → Settings → Edge Functions:
- `SUPABASE_URL` = `https://dutbkluisrvamstnpebx.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY` = your service role key (from Project Settings → API)

### 5. Add Questions

Go to `/admin`, enter password `sabelo`, and use the form to create questions.

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
