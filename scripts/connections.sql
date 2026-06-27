-- Connection requests table (aligns with app /api/requests)
create table if not exists public.connection_requests (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.users(id) on delete cascade,
  receiver_id uuid not null references public.users(id) on delete cascade,
  status text not null check (status in ('pending','accepted','ignored')) default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (sender_id, receiver_id)
);

-- Helpful indexes
create index if not exists idx_connection_requests_receiver on public.connection_requests(receiver_id);
create index if not exists idx_connection_requests_sender on public.connection_requests(sender_id);