-- Create events table for calendar
create extension if not exists pgcrypto;

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references teams(id) on delete set null,
  title text not null,
  description text,
  date date not null,
  time text, -- store human-friendly time like "09:00 AM"
  duration text,
  location text,
  type text, -- e.g., hackathon | meeting | conference | workshop
  participants integer,
  prize text,
  status text, -- e.g., registered | upcoming | interested | confirmed | deadline-soon
  color text, -- e.g., bg-blue-500
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_events_team_date on events(team_id, date);