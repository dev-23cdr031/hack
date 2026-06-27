-- Add created_by column to events to track ownership
ALTER TABLE events ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES users(id) ON DELETE SET NULL;

-- Optional index if you query by creator
CREATE INDEX IF NOT EXISTS idx_events_created_by ON events(created_by);