-- 21-fix-users-table-columns.sql
-- Fixes "Could not find the 'github_url' column of 'users' in the schema cache"
-- Run this ONCE in your Supabase SQL Editor (https://supabase.com/dashboard/project/[ref]/sql)
-- It safely adds the optional profile columns if they are missing.

ALTER TABLE users ADD COLUMN IF NOT EXISTS github_url TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS portfolio_url TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS website_url TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS experience_level TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT;

-- Optional: also ensure updated_at stays fresh
ALTER TABLE users ALTER COLUMN updated_at SET DEFAULT NOW();
