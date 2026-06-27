-- Execute the functions to create the meetings tables
SELECT create_meetings_table_if_not_exists();
SELECT create_meeting_participants_table_if_not_exists();

-- Create publication for realtime
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime FOR TABLE 
  meetings, 
  meeting_participants;

-- Enable realtime for meetings tables
ALTER PUBLICATION supabase_realtime ADD TABLE meetings;
ALTER PUBLICATION supabase_realtime ADD TABLE meeting_participants;

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_meetings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER meetings_updated_at
BEFORE UPDATE ON meetings
FOR EACH ROW
EXECUTE FUNCTION update_meetings_updated_at();