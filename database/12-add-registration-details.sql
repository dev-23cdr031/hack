-- Add registration detail columns to hackathon_participants table
ALTER TABLE hackathon_participants 
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS occupation TEXT,
ADD COLUMN IF NOT EXISTS organization TEXT,
ADD COLUMN IF NOT EXISTS experience TEXT,
ADD COLUMN IF NOT EXISTS skills JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS interests TEXT,
ADD COLUMN IF NOT EXISTS portfolio TEXT,
ADD COLUMN IF NOT EXISTS github TEXT,
ADD COLUMN IF NOT EXISTS linkedin TEXT,
ADD COLUMN IF NOT EXISTS team_status TEXT,
ADD COLUMN IF NOT EXISTS team_name TEXT,
ADD COLUMN IF NOT EXISTS team_size TEXT,
ADD COLUMN IF NOT EXISTS project_idea TEXT,
ADD COLUMN IF NOT EXISTS motivation TEXT,
ADD COLUMN IF NOT EXISTS expectations TEXT,
ADD COLUMN IF NOT EXISTS dietary_restrictions TEXT,
ADD COLUMN IF NOT EXISTS tshirt_size TEXT,
ADD COLUMN IF NOT EXISTS accommodation_needed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS special_assistance TEXT,
ADD COLUMN IF NOT EXISTS how_did_you_hear TEXT,
ADD COLUMN IF NOT EXISTS previous_hackathons TEXT,
ADD COLUMN IF NOT EXISTS agree_to_terms BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS agree_to_code_of_conduct BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS agree_to_data_sharing BOOLEAN DEFAULT FALSE;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_hackathon_participants_hackathon_id ON hackathon_participants(hackathon_id);
CREATE INDEX IF NOT EXISTS idx_hackathon_participants_user_id ON hackathon_participants(user_id);