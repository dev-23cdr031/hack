-- Add created_by column to hackathons table
ALTER TABLE hackathons 
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES users(id) ON DELETE SET NULL;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_hackathons_created_by ON hackathons(created_by);

-- Add foreign key constraint if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'hackathons_created_by_fkey'
  ) THEN
    ALTER TABLE hackathons 
    ADD CONSTRAINT hackathons_created_by_fkey 
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL;
  END IF;
END $$;