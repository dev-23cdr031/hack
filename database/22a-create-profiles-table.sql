-- =====================================================================
-- HackConnect - Step 0: Create the missing `profiles` table ONLY.
-- =====================================================================
-- Run this tiny snippet FIRST if the full migration failed with:
--   ERROR: 42P01: relation "public.profiles" does not exist
-- It is safe to run any number of times.
--
-- Then run the full migration: database/22-profiles-messaging-system.sql
-- (the full script is idempotent and now also creates this table for you,
-- so this step is optional - it simply guarantees the table exists.)
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  username text,
  email text,
  avatar_url text,
  bio text,
  skills jsonb DEFAULT '[]'::jsonb,
  college text,
  hackathon_interests jsonb DEFAULT '[]'::jsonb,
  location text,
  role text DEFAULT 'student',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Add the discovery columns to the existing users table (also safe to re-run).
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS username TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS college TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS hackathon_interests JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS full_name TEXT;
