-- Run in Supabase SQL Editor (Dashboard → SQL → New query)
-- Re-runnable: migrates the old shared table to per-user isolation.

create table if not exists public.problems (
  id text primary key,
  user_id uuid references auth.users (id) on delete cascade,
  leetcode_id integer not null,
  title text not null default '',
  slug text not null default '',
  topics jsonb not null default '[]'::jsonb,
  difficulty text not null default 'Medium',
  attempts integer not null default 0,
  status text not null default '做过',
  notes text not null default '',
  last_practiced_at text not null default '',
  code_versions jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Add user_id if upgrading from the old shared schema
alter table public.problems
  add column if not exists user_id uuid references auth.users (id) on delete cascade;

-- Old shared rows have no owner — remove them
delete from public.problems where user_id is null;

-- Drop global unique (one leetcode_id for everyone)
drop index if exists problems_leetcode_id_uidx;

-- Each user can track the same problem once
create unique index if not exists problems_user_leetcode_uidx
  on public.problems (user_id, leetcode_id);

alter table public.problems enable row level security;

-- Remove open-to-everyone policy
drop policy if exists "problems_anon_all" on public.problems;
drop policy if exists "problems_select_own" on public.problems;
drop policy if exists "problems_insert_own" on public.problems;
drop policy if exists "problems_update_own" on public.problems;
drop policy if exists "problems_delete_own" on public.problems;

create policy "problems_select_own"
  on public.problems
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "problems_insert_own"
  on public.problems
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "problems_update_own"
  on public.problems
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "problems_delete_own"
  on public.problems
  for delete
  to authenticated
  using (auth.uid() = user_id);
