-- 20-hackathon-registration.sql
-- Makes hackathon registrations fully persistent in Supabase so they appear on the
-- Admin dashboard's "Registrations" tab. Run ONCE in the Supabase SQL Editor.
-- https://supabase.com/dashboard/project/uzsygzfchokeotyqlako/sql

-- 1) Base table for registrations (idempotent)
create table if not exists public.hackathon_participants (
  id uuid primary key default gen_random_uuid(),
  hackathon_id uuid references public.hackathons(id) on delete cascade,
  user_id uuid references public.users(id) on delete cascade,
  team_id uuid references public.teams(id) on delete set null,
  joined_at timestamptz default now(),
  unique (hackathon_id, user_id)
);

-- 2) Every field captured by the registration form
alter table public.hackathon_participants add column if not exists full_name text;
alter table public.hackathon_participants add column if not exists email text;
alter table public.hackathon_participants add column if not exists phone text;
alter table public.hackathon_participants add column if not exists city text;
alter table public.hackathon_participants add column if not exists state text;
alter table public.hackathon_participants add column if not exists country text;
alter table public.hackathon_participants add column if not exists date_of_birth text;
alter table public.hackathon_participants add column if not exists gender text;
alter table public.hackathon_participants add column if not exists occupation text;
alter table public.hackathon_participants add column if not exists organization text;
alter table public.hackathon_participants add column if not exists experience text;
alter table public.hackathon_participants add column if not exists skills jsonb default '[]';
alter table public.hackathon_participants add column if not exists interests text;
alter table public.hackathon_participants add column if not exists portfolio text;
alter table public.hackathon_participants add column if not exists github text;
alter table public.hackathon_participants add column if not exists linkedin text;
alter table public.hackathon_participants add column if not exists team_status text;
alter table public.hackathon_participants add column if not exists team_name text;
alter table public.hackathon_participants add column if not exists team_size text;
alter table public.hackathon_participants add column if not exists project_idea text;
alter table public.hackathon_participants add column if not exists motivation text;
alter table public.hackathon_participants add column if not exists expectations text;
alter table public.hackathon_participants add column if not exists dietary_restrictions text;
alter table public.hackathon_participants add column if not exists tshirt_size text;
alter table public.hackathon_participants add column if not exists accommodation_needed boolean default false;
alter table public.hackathon_participants add column if not exists special_assistance text;
alter table public.hackathon_participants add column if not exists how_did_you_hear text;
alter table public.hackathon_participants add column if not exists previous_hackathons text;
alter table public.hackathon_participants add column if not exists agree_to_terms boolean default false;
alter table public.hackathon_participants add column if not exists agree_to_code_of_conduct boolean default false;
alter table public.hackathon_participants add column if not exists agree_to_data_sharing boolean default false;

-- 3) Indexes for fast lookups on the admin page
create index if not exists idx_hackathon_participants_hackathon_id on public.hackathon_participants(hackathon_id);
create index if not exists idx_hackathon_participants_user_id on public.hackathon_participants(user_id);

-- 4) Ensure hackathons has the counters the join route updates
alter table public.hackathons add column if not exists current_participants integer default 0;
alter table public.hackathons add column if not exists max_participants integer;
alter table public.hackathons add column if not exists created_by uuid;

-- 5) Row Level Security - public read (admin list + public page), authenticated insert
alter table public.hackathon_participants enable row level security;

drop policy if exists "Allow public read registrations" on public.hackathon_participants;
create policy "Allow public read registrations"
  on public.hackathon_participants
  for select using (true);

drop policy if exists "Allow public insert registrations" on public.hackathon_participants;
create policy "Allow public insert registrations"
  on public.hackathon_participants
  for insert with check (true);

drop policy if exists "Allow users to update registrations" on public.hackathon_participants;
create policy "Allow users to update registrations"
  on public.hackathon_participants
  for update using (auth.uid() is not null) with check (auth.uid() is not null);
