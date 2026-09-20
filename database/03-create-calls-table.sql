-- Create calls table for storing call history and metadata
CREATE TABLE IF NOT EXISTS calls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  caller_id VARCHAR(255) NOT NULL,
  receiver_id VARCHAR(255) NOT NULL,
  call_type VARCHAR(10) NOT NULL CHECK (call_type IN ('audio', 'video')),
  team_id VARCHAR(255),
  status VARCHAR(20) NOT NULL DEFAULT 'initiated' CHECK (status IN ('initiated', 'ringing', 'answered', 'ended', 'missed', 'declined')),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  answered_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_calls_caller_id ON calls(caller_id);
CREATE INDEX IF NOT EXISTS idx_calls_receiver_id ON calls(receiver_id);
CREATE INDEX IF NOT EXISTS idx_calls_team_id ON calls(team_id);
CREATE INDEX IF NOT EXISTS idx_calls_status ON calls(status);
CREATE INDEX IF NOT EXISTS idx_calls_started_at ON calls(started_at);

-- Add some sample call data
INSERT INTO calls (caller_id, receiver_id, call_type, status, started_at, ended_at, duration_seconds) VALUES
('1', '2', 'audio', 'ended', '2024-02-15T10:00:00Z', '2024-02-15T10:05:30Z', 330),
('2', '3', 'video', 'ended', '2024-02-15T11:30:00Z', '2024-02-15T11:45:15Z', 915),
('1', '4', 'audio', 'missed', '2024-02-15T14:20:00Z', '2024-02-15T14:20:30Z', 0),
('3', '1', 'video', 'ended', '2024-02-14T16:45:00Z', '2024-02-14T17:12:20Z', 1640);
