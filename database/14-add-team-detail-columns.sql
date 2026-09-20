-- Add missing columns to teams table
ALTER TABLE teams 
ADD COLUMN IF NOT EXISTS project_idea TEXT;

ALTER TABLE teams 
ADD COLUMN IF NOT EXISTS communication_platform TEXT;

ALTER TABLE teams 
ADD COLUMN IF NOT EXISTS meeting_schedule TEXT;

ALTER TABLE teams 
ADD COLUMN IF NOT EXISTS roles_needed JSONB DEFAULT '[]';

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_teams_leader_id ON teams(leader_id);

-- RLS policies for teams if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'teams' AND policyname = 'Allow public read access to teams'
  ) THEN
    CREATE POLICY "Allow public read access to teams" ON teams FOR SELECT USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'teams' AND policyname = 'Allow authenticated users to create teams'
  ) THEN
    CREATE POLICY "Allow authenticated users to create teams" ON teams FOR INSERT WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'teams' AND policyname = 'Allow users to update their own teams'
  ) THEN
    CREATE POLICY "Allow users to update their own teams" ON teams FOR UPDATE USING (leader_id = auth.uid());
  END IF;
END $$;