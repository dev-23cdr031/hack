import { supabase, createServerSupabaseClient } from './supabase'
import { Meeting, MeetingParticipant, User } from './types'

// Client-side meeting service
export class MeetingsService {
  // Create a new meeting
  async createMeeting(meetingData: Partial<Meeting>): Promise<Meeting | null> {
    try {
      const { data, error } = await supabase
        .from('meetings')
        .insert({
          ...meetingData,
          status: meetingData.status || 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select('*')
        .single()

      if (error) {
        console.error('Error creating meeting:', error)
        return null
      }

      return data as Meeting
    } catch (error) {
      console.error('Exception creating meeting:', error)
      return null
    }
  }

  // Get meeting by room ID
  async getMeetingByRoomId(roomId: string): Promise<Meeting | null> {
    try {
      const { data, error } = await supabase
        .from('meetings')
        .select(`
          *,
          host:host_id(id, name, email, avatar_url),
          team:team_id(*),
          hackathon:hackathon_id(*),
          participants:meeting_participants(
            *,
            user:user_id(id, name, email, avatar_url)
          )
        `)
        .eq('room_id', roomId)
        .single()

      if (error) {
        console.error('Error getting meeting:', error)
        return null
      }

      return data as Meeting
    } catch (error) {
      console.error('Exception getting meeting:', error)
      return null
    }
  }

  // Update meeting status
  async updateMeetingStatus(meetingId: string, status: Meeting['status']): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('meetings')
        .update({
          status,
          updated_at: new Date().toISOString(),
          ...(status === 'active' && { actual_start: new Date().toISOString() }),
          ...(status === 'completed' && { actual_end: new Date().toISOString() })
        })
        .eq('id', meetingId)

      if (error) {
        console.error('Error updating meeting status:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Exception updating meeting status:', error)
      return false
    }
  }

  // Add participant to meeting
  async addParticipant(meetingId: string, userId: string, audioEnabled = true, videoEnabled = true): Promise<MeetingParticipant | null> {
    try {
      const { data, error } = await supabase
        .from('meeting_participants')
        .insert({
          meeting_id: meetingId,
          user_id: userId,
          join_time: new Date().toISOString(),
          audio_enabled: audioEnabled,
          video_enabled: videoEnabled
        })
        .select('*')
        .single()

      if (error) {
        console.error('Error adding participant:', error)
        return null
      }

      return data as MeetingParticipant
    } catch (error) {
      console.error('Exception adding participant:', error)
      return null
    }
  }

  // Update participant status
  async updateParticipantStatus(participantId: string, audioEnabled?: boolean, videoEnabled?: boolean): Promise<boolean> {
    try {
      const updates: Partial<MeetingParticipant> = {}
      
      if (audioEnabled !== undefined) {
        updates.audio_enabled = audioEnabled
      }
      
      if (videoEnabled !== undefined) {
        updates.video_enabled = videoEnabled
      }
      
      const { error } = await supabase
        .from('meeting_participants')
        .update(updates)
        .eq('id', participantId)

      if (error) {
        console.error('Error updating participant status:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Exception updating participant status:', error)
      return false
    }
  }

  // Record participant leaving
  async recordParticipantLeave(participantId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('meeting_participants')
        .update({
          leave_time: new Date().toISOString()
        })
        .eq('id', participantId)

      if (error) {
        console.error('Error recording participant leave:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Exception recording participant leave:', error)
      return false
    }
  }

  // Get user's active meetings
  async getUserActiveMeetings(userId: string): Promise<Meeting[]> {
    try {
      const { data, error } = await supabase
        .from('meetings')
        .select(`
          *,
          host:host_id(id, name, email, avatar_url),
          team:team_id(id, name, description),
          hackathon:hackathon_id(id, title, image_url)
        `)
        .eq('status', 'active')
        .or(`host_id.eq.${userId},participants.user_id.eq.${userId}`)

      if (error) {
        console.error('Error getting user active meetings:', error)
        return []
      }

      return data as Meeting[]
    } catch (error) {
      console.error('Exception getting user active meetings:', error)
      return []
    }
  }

  // Get team's meetings
  async getTeamMeetings(teamId: string): Promise<Meeting[]> {
    try {
      const { data, error } = await supabase
        .from('meetings')
        .select(`
          *,
          host:host_id(id, name, email, avatar_url),
          team:team_id(id, name, description),
          hackathon:hackathon_id(id, title, image_url)
        `)
        .eq('team_id', teamId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error getting team meetings:', error)
        return []
      }

      return data as Meeting[]
    } catch (error) {
      console.error('Exception getting team meetings:', error)
      return []
    }
  }

  // Subscribe to meeting updates
  subscribeToMeetingUpdates(roomId: string, callback: (meeting: Meeting) => void): () => void {
    const subscription = supabase
      .channel(`meeting:${roomId}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'meetings',
        filter: `room_id=eq.${roomId}`
      }, (payload) => {
        callback(payload.new as Meeting)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }

  // Subscribe to participant updates
  subscribeToParticipantUpdates(meetingId: string, callback: (participant: MeetingParticipant) => void): () => void {
    const subscription = supabase
      .channel(`meeting_participants:${meetingId}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'meeting_participants',
        filter: `meeting_id=eq.${meetingId}`
      }, (payload) => {
        callback(payload.new as MeetingParticipant)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }
}

// Server-side meeting service
export class ServerMeetingsService {
  // Create meeting tables if they don't exist
  async ensureMeetingTables(): Promise<boolean> {
    const supabase = createServerSupabaseClient()
    
    try {
      // Create meetings table
      const { error: meetingsError } = await supabase.rpc('create_meetings_table_if_not_exists')
      
      if (meetingsError) {
        console.error('Error creating meetings table:', meetingsError)
        return false
      }
      
      // Create meeting participants table
      const { error: participantsError } = await supabase.rpc('create_meeting_participants_table_if_not_exists')
      
      if (participantsError) {
        console.error('Error creating meeting participants table:', participantsError)
        return false
      }
      
      return true
    } catch (error) {
      console.error('Exception ensuring meeting tables:', error)
      return false
    }
  }

  // Get all meetings (admin only)
  async getAllMeetings(): Promise<Meeting[]> {
    const supabase = createServerSupabaseClient()
    
    try {
      const { data, error } = await supabase
        .from('meetings')
        .select(`
          *,
          host:host_id(id, name, email, avatar_url),
          team:team_id(id, name, description),
          hackathon:hackathon_id(id, title, image_url)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error getting all meetings:', error)
        return []
      }

      return data as Meeting[]
    } catch (error) {
      console.error('Exception getting all meetings:', error)
      return []
    }
  }

  // Get meeting statistics
  async getMeetingStats(): Promise<any> {
    const supabase = createServerSupabaseClient()
    
    try {
      const { data, error } = await supabase.rpc('get_meeting_statistics')

      if (error) {
        console.error('Error getting meeting statistics:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Exception getting meeting statistics:', error)
      return null
    }
  }
}

// Create singleton instances
export const meetingsService = new MeetingsService()
export const serverMeetingsService = new ServerMeetingsService()