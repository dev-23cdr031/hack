-- ==============================
-- HACKATHONS TABLE UPDATES
-- ==============================
-- Add created_by column to track which user created each hackathon
ALTER TABLE hackathons ADD COLUMN IF NOT EXISTS created_by TEXT;

-- Create index for faster queries on created_by
CREATE INDEX IF NOT EXISTS idx_hackathons_created_by ON hackathons(created_by);

-- Enable Row Level Security (RLS) on hackathons table
ALTER TABLE hackathons ENABLE ROW LEVEL SECURITY;

-- Policy 1: All authenticated users can VIEW all hackathons (ensures explore page works for all signed-in users)
CREATE POLICY "All users can view all hackathons" ON hackathons
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy 2: Users can CREATE hackathons (they must provide their own user ID as created_by)
CREATE POLICY "Users can create hackathons" ON hackathons
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = created_by);

-- Policy 3: Users can UPDATE their own hackathons OR admins can update any hackathon
CREATE POLICY "Users can update own hackathons, admins can update all" ON hackathons
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid()::text = created_by -- Creator can edit their own
    OR auth.jwt()->>'email' IN ('devdharrshans.23csd@kongu.edu', 'divyadharshinis.23csd@kongu.edu', 'anusreed.23csd@kongu.edu', 'bharanin.23csd@kongu.edu') -- Your actual admin emails
  );

-- Policy 4: Users can DELETE their own hackathons OR admins can delete any hackathon
CREATE POLICY "Users can delete own hackathons, admins can delete all" ON hackathons
  FOR DELETE
  TO authenticated
  USING (
    auth.uid()::text = created_by -- Creator can delete their own
    OR auth.jwt()->>'email' IN ('devdharrshans.23csd@kongu.edu', 'divyadharshinis.23csd@kongu.edu', 'anusreed.23csd@kongu.edu', 'bharanin.23csd@kongu.edu') -- Your actual admin emails
  );

-- ==============================
-- HACKATHON_PARTICIPANTS TABLE (REGISTRATIONS) UPDATES
-- ==============================
-- Enable Row Level Security (RLS) on hackathon_participants table
ALTER TABLE hackathon_participants ENABLE ROW LEVEL SECURITY;

-- Policy 1: Users can view their own registrations
CREATE POLICY "Users can view their own registrations" ON hackathon_participants
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id::text);

-- Policy 2: Admins can view ALL registrations (critical for admin dashboard)
CREATE POLICY "Admins can view all registrations" ON hackathon_participants
  FOR SELECT
  TO authenticated
  USING (
    auth.jwt()->>'email' IN ('devdharrshans.23csd@kongu.edu', 'divyadharshinis.23csd@kongu.edu', 'anusreed.23csd@kongu.edu', 'bharanin.23csd@kongu.edu')
  );

-- Policy 3: Hackathon creators can view registrations for their hackathons
CREATE POLICY "Hackathon creators can view their hackathon registrations" ON hackathon_participants
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM hackathons 
      WHERE hackathons.id = hackathon_participants.hackathon_id 
      AND hackathons.created_by = auth.uid()::text
    )
  );

-- Policy 4: Users can register for hackathons (create their own registration)
CREATE POLICY "Users can create their own registrations" ON hackathon_participants
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id::text);