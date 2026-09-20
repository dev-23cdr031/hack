-- Teams table (if not exists)
create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  leader_id uuid not null references auth.users(id) on delete cascade,
  hackathon_id uuid references public.hackathons(id) on delete set null,
  max_members int not null default 4,
  current_members int not null default 1,
  skills_needed text[] default '{}',
  status text check (status in ('forming','active','completed')) not null default 'forming',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Team members table
create table if not exists public.team_members (
  team_id uuid not null references public.teams(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text check (role in ('leader','member')) not null default 'member',
  joined_at timestamptz not null default now(),
  primary key (team_id, user_id)
);

-- Optional view to fetch member details quickly
create or replace view public.team_members_view as
  select tm.team_id,
         u.id as id,
         coalesce(u.raw_user_meta_data->>'name', u.email) as name,
         u.email as email,
         u.raw_user_meta_data->>'avatar_url' as avatar_url,
         u.raw_user_meta_data->>'title' as title,
         tm.role,
         tm.joined_at
  from public.team_members tm
  join auth.users u on u.id = tm.user_id;