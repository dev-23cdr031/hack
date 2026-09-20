-- Add all missing columns to hackathons table for the creation flow
-- Run this in your Supabase SQL Editor

-- Add format column
ALTER TABLE hackathons 
ADD COLUMN IF NOT EXISTS format TEXT DEFAULT 'competitive';

-- Add prize_amount column
ALTER TABLE hackathons 
ADD COLUMN IF NOT EXISTS prize_amount INTEGER;

-- Add skill_level column
ALTER TABLE hackathons 
ADD COLUMN IF NOT EXISTS skill_level TEXT DEFAULT 'all-levels';

-- Add eligibility column
ALTER TABLE hackathons 
ADD COLUMN IF NOT EXISTS eligibility TEXT DEFAULT 'Open to all';

-- Add rules column (JSONB array)
ALTER TABLE hackathons 
ADD COLUMN IF NOT EXISTS rules JSONB DEFAULT '[]';

-- Add schedule column (JSONB array)
ALTER TABLE hackathons 
ADD COLUMN IF NOT EXISTS schedule JSONB DEFAULT '[]';

-- Add judges column (JSONB array)
ALTER TABLE hackathons 
ADD COLUMN IF NOT EXISTS judges JSONB DEFAULT '[]';

-- Add sponsors column (JSONB array)
ALTER TABLE hackathons 
ADD COLUMN IF NOT EXISTS sponsors JSONB DEFAULT '[]';

-- Add faq column (JSONB array)
ALTER TABLE hackathons 
ADD COLUMN IF NOT EXISTS faq JSONB DEFAULT '[]';

-- Add resources column (JSONB array)
ALTER TABLE hackathons 
ADD COLUMN IF NOT EXISTS resources JSONB DEFAULT '[]';

-- Add created_by column (if not already added by script 11)
ALTER TABLE hackathons 
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES users(id) ON DELETE SET NULL;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_hackathons_created_by ON hackathons(created_by);
CREATE INDEX IF NOT EXISTS idx_hackathons_status ON hackathons(status);
CREATE INDEX IF NOT EXISTS idx_hackathons_type ON hackathons(type);

-- Add RLS policies for hackathons if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'hackathons' AND policyname = 'Allow public read access to hackathons'
  ) THEN
    CREATE POLICY "Allow public read access to hackathons" ON hackathons FOR SELECT USING (true);
  END IF;
END $$;

-- Allow authenticated users to insert hackathons
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'hackathons' AND policyname = 'Allow authenticated users to create hackathons'
  ) THEN
    CREATE POLICY "Allow authenticated users to create hackathons" ON hackathons FOR INSERT WITH CHECK (true);
  END IF;
END $$;

-- Allow users to update their own hackathons
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'hackathons' AND policyname = 'Allow users to update their own hackathons'
  ) THEN
    CREATE POLICY "Allow users to update their own hackathons" ON hackathons FOR UPDATE USING (created_by = auth.uid() OR created_by IS NULL);
  END IF;
END $$;

-- Allow users to delete their own hackathons
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'hackathons' AND policyname = 'Allow users to delete their own hackathons'
  ) THEN
    CREATE POLICY "Allow users to delete their own hackathons" ON hackathons FOR DELETE USING (created_by = auth.uid() OR created_by IS NULL);
  END IF;
END $$;