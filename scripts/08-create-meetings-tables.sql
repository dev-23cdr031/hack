-- Create meetings table
CREATE TABLE IF NOT EXISTS meetings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id VARCHAR(20) NOT NULL UNIQUE,
  host_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  hackathon_id UUID REFERENCES hackathons(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'active', -- active, completed, cancelled
  scheduled_start TIMESTAMP WITH TIME ZONE,
  scheduled_end TIMESTAMP WITH TIME ZONE,
  actual_start TIMESTAMP WITH TIME ZONE,
  actual_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create meeting participants table
CREATE TABLE IF NOT EXISTS meeting_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meeting_id UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  join_time TIMESTAMP WITH TIME ZONE NOT NULL,
  leave_time TIMESTAMP WITH TIME ZONE,
  audio_enabled BOOLEAN DEFAULT TRUE,
  video_enabled BOOLEAN DEFAULT TRUE,
  connection_quality VARCHAR(20) DEFAULT 'good',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create stored procedures for table creation
CREATE OR REPLACE FUNCTION create_meetings_table_if_not_exists()
RETURNS VOID AS $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'meetings') THEN
    CREATE TABLE meetings (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      room_id VARCHAR(20) NOT NULL UNIQUE,
      host_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
      team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
      hackathon_id UUID REFERENCES hackathons(id) ON DELETE SET NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      status VARCHAR(20) NOT NULL DEFAULT 'active',
      scheduled_start TIMESTAMP WITH TIME ZONE,
      scheduled_end TIMESTAMP WITH TIME ZONE,
      actual_start TIMESTAMP WITH TIME ZONE,
      actual_end TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION create_meeting_participants_table_if_not_exists()
RETURNS VOID AS $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'meeting_participants') THEN
    CREATE TABLE meeting_participants (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      meeting_id UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
      user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
      join_time TIMESTAMP WITH TIME ZONE NOT NULL,
      leave_time TIMESTAMP WITH TIME ZONE,
      audio_enabled BOOLEAN DEFAULT TRUE,
      video_enabled BOOLEAN DEFAULT TRUE,
      connection_quality VARCHAR(20) DEFAULT 'good',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create function to get meeting statistics
CREATE OR REPLACE FUNCTION get_meeting_statistics()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_meetings', (SELECT COUNT(*) FROM meetings),
    'active_meetings', (SELECT COUNT(*) FROM meetings WHERE status = 'active'),
    'completed_meetings', (SELECT COUNT(*) FROM meetings WHERE status = 'completed'),
    'total_participants', (SELECT COUNT(*) FROM meeting_participants),
    'avg_duration_minutes', (
      SELECT EXTRACT(EPOCH FROM AVG(actual_end - actual_start))/60 
      FROM meetings 
      WHERE actual_start IS NOT NULL AND actual_end IS NOT NULL
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create RLS policies
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_participants ENABLE ROW LEVEL SECURITY;

-- Meetings policies
CREATE POLICY "Meetings are viewable by participants" ON meetings
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM meeting_participants WHERE meeting_id = id
    ) OR host_id = auth.uid()
  );

CREATE POLICY "Hosts can insert meetings" ON meetings
  FOR INSERT WITH CHECK (host_id = auth.uid());

CREATE POLICY "Hosts can update meetings" ON meetings
  FOR UPDATE USING (host_id = auth.uid());

CREATE POLICY "Hosts can delete meetings" ON meetings
  FOR DELETE USING (host_id = auth.uid());

-- Meeting participants policies
CREATE POLICY "Participants are viewable by meeting members" ON meeting_participants
  FOR SELECT USING (
    meeting_id IN (
      SELECT id FROM meetings WHERE host_id = auth.uid()
    ) OR user_id = auth.uid()
  );

CREATE POLICY "Users can insert themselves as participants" ON meeting_participants
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own participant status" ON meeting_participants
  FOR UPDATE USING (user_id = auth.uid());

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_meetings_room_id ON meetings(room_id);
CREATE INDEX IF NOT EXISTS idx_meetings_host_id ON meetings(host_id);
CREATE INDEX IF NOT EXISTS idx_meetings_team_id ON meetings(team_id);
CREATE INDEX IF NOT EXISTS idx_meetings_status ON meetings(status);
CREATE INDEX IF NOT EXISTS idx_meeting_participants_meeting_id ON meeting_participants(meeting_id);
CREATE INDEX IF NOT EXISTS idx_meeting_participants_user_id ON meeting_participants(user_id);