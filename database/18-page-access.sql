-- 18-page-access.sql
-- Page Access Control - run this ONCE in the Supabase SQL Editor
-- https://supabase.com/dashboard/project/uzsygzfchokeotyqlako/sql
--
-- Creates the page_access table used by /admin -> "Page Access" tab.
-- Every app page can be turned ON/OFF. When OFF, the middleware redirects
-- visitors to /blocked. Admin/Login/Auth/API routes are always allowed.

create table if not exists public.page_access (
  page_path text primary key,
  page_name text not null,
  is_enabled boolean not null default true,
  updated_by uuid references auth.users(id),
  updated_at timestamptz default now()
);

-- Seed all pages as ENABLED (safe to run multiple times - it just updates names)
insert into public.page_access (page_path, page_name, is_enabled) values
  ('/',                'Home',               true),
  ('/about',           'About Us',           true),
  ('/terms',           'Terms & Conditions', true),
  ('/privacy',         'Privacy Policy',     true),
  ('/faq',             'FAQ',                true),
  ('/help',            'Help Center',        true),
  ('/contact',         'Contact',            true),
  ('/get-started',     'Get Started',        true),
  ('/docs',            'Documentation',      true),
  ('/services',        'Services',           true),
  ('/downloads',       'Downloads',          true),
  ('/themes',          'Themes',             true),
  ('/feedback',        'Feedback',           true),
  ('/notifications',   'Notifications',      true),
  ('/quick-actions',   'Quick Actions',      true),
  ('/profile',         'My Profile',         true),
  ('/settings',        'Settings',           true),
  ('/saved',           'Saved',              true),
  ('/favorites',       'Favorites',          true),
  ('/achievements',    'Achievements',       true),
  ('/activity',        'Activity',           true),
  ('/calendar',        'Calendar',           true),
  ('/hack-streak',     'Hack Streak',        true),
  ('/rankings',        'Rankings',           true),
  ('/portfolio',       'Portfolio',          true),
  ('/resume',          'Resume',             true),
  ('/hackathons',      'Hackathons',         true),
  ('/create-hackathon','Create Hackathon',   true),
  ('/teams',           'Teams',              true),
  ('/admin',           'Admin Dashboard',    true),
  ('/public',          'Public Profiles',    true),
  ('/community',       'Community',          true),
  ('/messages',        'Messages',           true),
  ('/meetings',        'Meetings',           true),
  ('/hack-meet',       'Hack Meet',          true),
  ('/plagiarism',      'Plagiarism Checker', true),
  ('/code-hub',        'Code Hub',           true),
  ('/aadhaar-ai',      'Aadhaar AI',         true)
on conflict (page_path) do update set
  page_name = excluded.page_name;

-- Row Level Security:
--  - anyone (even logged out) can READ the status (needed by the middleware)
--  - only logged-in users can change pages
alter table public.page_access enable row level security;

drop policy if exists "page_access_public_read" on public.page_access;
create policy "page_access_public_read"
  on public.page_access
  for select using (true);

drop policy if exists "page_access_authenticated_write" on public.page_access;
create policy "page_access_authenticated_write"
  on public.page_access
  for all using (auth.uid() is not null) with check (auth.uid() is not null);

-- Quick utility for toggling from the SQL editor:
-- update public.page_access set is_enabled = false, updated_at = now() where page_path = '/messages';
