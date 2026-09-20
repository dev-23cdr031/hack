-- 19-profile-extra-details.sql
-- Adds profile columns so every signup detail (location, experience level, role)
-- and the user's records (work experience, education, achievements) can be stored
-- on the profile page and edited from /profile.
-- Run ONCE in the Supabase SQL Editor.
-- https://supabase.com/dashboard/project/uzsygzfchokeotyqlako/sql

alter table public.users add column if not exists location text;
alter table public.users add column if not exists experience_level text default 'beginner';
alter table public.users add column if not exists role text default 'student';
alter table public.users add column if not exists experience jsonb default '[]';
alter table public.users add column if not exists education jsonb default '[]';
alter table public.users add column if not exists achievements jsonb default '[]';
