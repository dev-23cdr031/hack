-- HackConnect hackathon platform setup
-- Run in the Supabase SQL editor.

create type public.user_role as enum ('student', 'mentor', 'admin');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  bio text,
  location text,
  role public.user_role not null default 'student',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, bio, location, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'bio',
    new.raw_user_meta_data ->> 'location',
    case
      when new.raw_user_meta_data ->> 'role' in ('student', 'mentor', 'admin')
        then (new.raw_user_meta_data ->> 'role')::public.user_role
      else 'student'::public.user_role
    end
  )
  on conflict (id) do update set
    full_name = excluded.full_name,
    bio = excluded.bio,
    location = excluded.location,
    role = excluded.role,
    updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create table public.hackathons (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  start_date timestamptz not null,
  end_date timestamptz not null,
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  constraint hackathons_valid_dates check (end_date >= start_date)
);

create index hackathons_created_at_idx on public.hackathons (created_at desc);

alter table public.profiles enable row level security;
alter table public.hackathons enable row level security;

create policy "Authenticated users can read profiles"
on public.profiles for select to authenticated using (true);

create policy "Authenticated users can read hackathons"
on public.hackathons for select to authenticated using (true);

create policy "Public can read hackathons"
on public.hackathons for select to anon using (true);

create policy "Admins can create hackathons"
on public.hackathons for insert to authenticated
with check (
  created_by = auth.uid()
  and exists (
    select 1 from public.profiles
    where profiles.id = auth.uid() and profiles.role = 'admin'
  )
);

revoke all on public.profiles from anon;
revoke all on public.hackathons from anon;
grant select on public.hackathons to anon;
grant select on public.profiles, public.hackathons to authenticated;
grant insert on public.hackathons to authenticated;
