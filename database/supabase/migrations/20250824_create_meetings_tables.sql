-- Create meetings table
CREATE OR REPLACE FUNCTION create_meetings_table_if_not_exists()
RETURNS void AS $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'meetings') THEN
    CREATE TABLE public.meetings (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      room_id TEXT NOT NULL UNIQUE,
      title TEXT,
      description TEXT,
      host_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
      hackathon_id UUID REFERENCES public.hackathons(id) ON DELETE SET NULL,
      status TEXT NOT NULL CHECK (status IN ('scheduled', 'active', 'completed', 'cancelled')),
      scheduled_start TIMESTAMP WITH TIME ZONE,
      scheduled_end TIMESTAMP WITH TIME ZONE,
      actual_start TIMESTAMP WITH TIME ZONE,
      actual_end TIMESTAMP WITH TIME ZONE,
      recording_url TEXT,
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
    );

    -- Add RLS policies
    ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;

    -- Everyone can view meetings they're part of
    CREATE POLICY "Users can view meetings they're part of" ON public.meetings
      FOR SELECT
      USING (
        auth.uid() = host_id OR
        EXISTS (
          SELECT 1 FROM public.meeting_participants
          WHERE meeting_id = id AND user_id = auth.uid()
        )
      );

    -- Only hosts can update their meetings
    CREATE POLICY "Hosts can update their meetings" ON public.meetings
      FOR UPDATE
      USING (auth.uid() = host_id);

    -- Only hosts can delete their meetings
    CREATE POLICY "Hosts can delete their meetings" ON public.meetings
      FOR DELETE
      USING (auth.uid() = host_id);

    -- Anyone can create a meeting
    CREATE POLICY "Anyone can create a meeting" ON public.meetings
      FOR INSERT
      WITH CHECK (auth.uid() = host_id);

    -- Create index for faster queries
    CREATE INDEX meetings_host_id_idx ON public.meetings(host_id);
    CREATE INDEX meetings_team_id_idx ON public.meetings(team_id);
    CREATE INDEX meetings_hackathon_id_idx ON public.meetings(hackathon_id);
    CREATE INDEX meetings_status_idx ON public.meetings(status);
    CREATE INDEX meetings_room_id_idx ON public.meetings(room_id);

    -- Set up realtime
    ALTER TABLE public.meetings REPLICA IDENTITY FULL;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create meeting participants table
CREATE OR REPLACE FUNCTION create_meeting_participants_table_if_not_exists()
RETURNS void AS $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'meeting_participants') THEN
    CREATE TABLE public.meeting_participants (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      meeting_id UUID NOT NULL REFERENCES public.meetings(id) ON DELETE CASCADE,
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      join_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
      leave_time TIMESTAMP WITH TIME ZONE,
      connection_quality TEXT CHECK (connection_quality IN ('excellent', 'good', 'fair', 'poor')),
      audio_enabled BOOLEAN NOT NULL DEFAULT true,
      video_enabled BOOLEAN NOT NULL DEFAULT true,
      UNIQUE(meeting_id, user_id, join_time)
    );

    -- Add RLS policies
    ALTER TABLE public.meeting_participants ENABLE ROW LEVEL SECURITY;

    -- Everyone can view participants in meetings they're part of
    CREATE POLICY "Users can view participants in meetings they're part of" ON public.meeting_participants
      FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM public.meetings
          WHERE id = meeting_id AND (
            host_id = auth.uid() OR
            EXISTS (
              SELECT 1 FROM public.meeting_participants
              WHERE meeting_id = meetings.id AND user_id = auth.uid()
            )
          )
        )
      );

    -- Users can add themselves as participants
    CREATE POLICY "Users can add themselves as participants" ON public.meeting_participants
      FOR INSERT
      WITH CHECK (user_id = auth.uid());

    -- Users can update their own participant status
    CREATE POLICY "Users can update their own participant status" ON public.meeting_participants
      FOR UPDATE
      USING (user_id = auth.uid());

    -- Create index for faster queries
    CREATE INDEX meeting_participants_meeting_id_idx ON public.meeting_participants(meeting_id);
    CREATE INDEX meeting_participants_user_id_idx ON public.meeting_participants(user_id);

    -- Set up realtime
    ALTER TABLE public.meeting_participants REPLICA IDENTITY FULL;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create function to get meeting statistics
CREATE OR REPLACE FUNCTION get_meeting_statistics()
RETURNS json AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'total_meetings', (SELECT COUNT(*) FROM public.meetings),
    'active_meetings', (SELECT COUNT(*) FROM public.meetings WHERE status = 'active'),
    'completed_meetings', (SELECT COUNT(*) FROM public.meetings WHERE status = 'completed'),
    'total_participants', (SELECT COUNT(*) FROM public.meeting_participants),
    'avg_meeting_duration_minutes', (
      SELECT EXTRACT(EPOCH FROM AVG(actual_end - actual_start)) / 60
      FROM public.meetings
      WHERE status = 'completed' AND actual_start IS NOT NULL AND actual_end IS NOT NULL
    ),
    'meetings_by_day', (
      SELECT json_agg(json_build_object(
        'date', date,
        'count', count
      ))
      FROM (
        SELECT DATE(created_at) as date, COUNT(*) as count
        FROM public.meetings
        GROUP BY DATE(created_at)
        ORDER BY DATE(created_at) DESC
        LIMIT 30
      ) as daily
    )
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql;