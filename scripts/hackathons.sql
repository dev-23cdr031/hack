-- Tables
create table if not exists public.hackathons (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image_url text,
  start_date timestamptz not null,
  end_date timestamptz not null,
  location text,
  type text check (type in ('online','in-person','hybrid')) not null default 'online',
  themes text[] default '{}',
  max_participants int,
  current_participants int not null default 0,
  status text check (status in ('upcoming','ongoing','past')) not null default 'upcoming',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.hackathon_participants (
  hackathon_id uuid not null references public.hackathons(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (hackathon_id, user_id)
);

-- Optional function to increment participants safely
create or replace function public.increment_hackathon_participants(h_id uuid)
returns void
language plpgsql
as $$
begin
  update public.hackathons
    set current_participants = current_participants + 1,
        updated_at = now()
    where id = h_id;
end;
$$;