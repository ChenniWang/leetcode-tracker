-- Run this in Supabase SQL Editor (Dashboard → SQL → New query)

create table if not exists public.problems (
  id text primary key,
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

create unique index if not exists problems_leetcode_id_uidx
  on public.problems (leetcode_id);

alter table public.problems enable row level security;

-- Personal workbook: anon key can read/write (same pattern as a simple notes app).
-- Anyone who has your anon key + project URL can access this data.
drop policy if exists "problems_anon_all" on public.problems;
create policy "problems_anon_all"
  on public.problems
  for all
  to anon, authenticated
  using (true)
  with check (true);
