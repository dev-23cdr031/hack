import { WebRTCService } from './webrtc'
import { meetingsService } from './meetings-service'
import { Meeting, MeetingParticipant, User } from './types'
import { supabase } from './supabase'

export interface MeetingParticipantStream {
  participant: MeetingParticipant
  stream: MediaStream | null
  audioEnabled: boolean
  videoEnabled: boolean
  speaking: boolean
  connectionQuality: 'excellent' | 'good' | 'fair' | 'poor'
}

export class MeetingRTCService {
  private webrtcService: WebRTCService
  private meeting: Meeting | null = null
  private localParticipant: MeetingParticipant | null = null
  private participants: Map<string, MeetingParticipantStream> = new Map()
  private roomSubscription: (() => void) | null = null
  private participantsSubscription: (() => void) | null = null
  private signalSubscription: any = null
  
  // Event callbacks
  public onMeetingUpdated?: (meeting: Meeting) => void
  public onParticipantJoined?: (participant: MeetingParticipantStream) => void
  public onParticipantUpdated?: (participant: MeetingParticipantStream) => void
  public onParticipantLeft?: (participantId: string) => void
  public onLocalStream?: (stream: MediaStream) => void
  public onError?: (error: string) => void
  
  constructor() {
    this.webrtcService = new WebRTCService()
    
    // Set up WebRTC event handlers
    this.webrtcService.onLocalStream = (stream) => {
      this.onLocalStream?.(stream)
    }
    
    this.webrtcService.onRemoteStream = (stream) => {
      // In a real implementation, this would be associated with a specific participant
      console.log('Remote stream received, but not yet associated with a participant')
    }
    
    this.webrtcService.onError = (error) => {
      this.onError?.(error)
    }
  }
  
  // Join a meeting by room ID
  async joinMeeting(roomId: string, currentUser: User, audioEnabled = true, videoEnabled = true): Promise<Meeting | null> {
    try {
      // Get meeting details from Supabase
      const meeting = await meetingsService.getMeetingByRoomId(roomId)
      
      if (!meeting) {
        throw new Error('Meeting not found')
      }
      
      this.meeting = meeting
      
      // Subscribe to meeting updates
      this.roomSubscription = meetingsService.subscribeToMeetingUpdates(roomId, (updatedMeeting) => {
        this.meeting = updatedMeeting
        this.onMeetingUpdated?.(updatedMeeting)
      })
      
      // Subscribe to participant updates
      this.participantsSubscription = meetingsService.subscribeToParticipantUpdates(meeting.id, (participant) => {
        this.handleParticipantUpdate(participant)
      })
      
      // Subscribe to signaling channel
      this.subscribeToSignalingChannel(meeting.id)
      
      // Add current user as participant
      const participant = await meetingsService.addParticipant(
        meeting.id,
        currentUser.id,
        audioEnabled,
        videoEnabled
      )
      
      if (!participant) {
        throw new Error('Failed to join as participant')
      }
      
      this.localParticipant = participant
      
      // Initialize WebRTC
      await this.initializeWebRTC(audioEnabled, videoEnabled)
      
      // Return the meeting
      return meeting
    } catch (error) {
      console.error('Error joining meeting:', error)
      this.onError?.(error instanceof Error ? error.message : 'Failed to join meeting')
      return null
    }
  }
  
  // Create a new meeting
  async createMeeting(currentUser: User, teamId?: string, hackathonId?: string, title?: string, description?: string): Promise<Meeting | null> {
    try {
      // Generate a unique room ID
      const roomId = this.generateRoomId()
      
      // Create meeting in Supabase
      const meeting = await meetingsService.createMeeting({
        room_id: roomId,
        host_id: currentUser.id,
        team_id: teamId,
        hackathon_id: hackathonId,
        title: title || `${currentUser.name}'s Meeting`,
        description: description,
        status: 'active',
        actual_start: new Date().toISOString()
      })
      
      if (!meeting) {
        throw new Error('Failed to create meeting')
      }
      
      // Join the newly created meeting
      return this.joinMeeting(roomId, currentUser)
    } catch (error) {
      console.error('Error creating meeting:', error)
      this.onError?.(error instanceof Error ? error.message : 'Failed to create meeting')
      return null
    }
  }
  
  // Leave the current meeting
  async leaveMeeting(): Promise<boolean> {
    try {
      // Clean up WebRTC
      this.webrtcService.endCall()
      
      // Record participant leaving
      if (this.localParticipant) {
        await meetingsService.recordParticipantLeave(this.localParticipant.id)
      }
      
      // Check if this is the host and if they're the last participant
      if (this.meeting && this.meeting.host_id === this.localParticipant?.user_id && this.participants.size <= 1) {
        // End the meeting if host is leaving and is the last participant
        await meetingsService.updateMeetingStatus(this.meeting.id, 'completed')
      }
      
      // Clean up subscriptions
      if (this.roomSubscription) {
        this.roomSubscription()
        this.roomSubscription = null
      }
      
      if (this.participantsSubscription) {
        this.participantsSubscription()
        this.participantsSubscription = null
      }
      
      if (this.signalSubscription) {
        supabase.removeChannel(this.signalSubscription)
        this.signalSubscription = null
      }
      
      // Reset state
      this.meeting = null
      this.localParticipant = null
      this.participants.clear()
      
      return true
    } catch (error) {
      console.error('Error leaving meeting:', error)
      return false
    }
  }
  
  // Toggle audio
  toggleAudio(): boolean {
    const isMuted = this.webrtcService.toggleMute()
    
    // Update participant status in Supabase
    if (this.localParticipant) {
      meetingsService.updateParticipantStatus(this.localParticipant.id, !isMuted)
    }
    
    return !isMuted
  }
  
  // Toggle video
  toggleVideo(): boolean {
    const isVideoOff = this.webrtcService.toggleVideo()
    
    // Update participant status in Supabase
    if (this.localParticipant) {
      meetingsService.updateParticipantStatus(this.localParticipant.id, undefined, !isVideoOff)
    }
    
    return !isVideoOff
  }
  
  // Get current meeting
  getCurrentMeeting(): Meeting | null {
    return this.meeting
  }
  
  // Get all participants
  getParticipants(): MeetingParticipantStream[] {
    return Array.from(this.participants.values())
  }
  
  // Private methods
  private async initializeWebRTC(audioEnabled: boolean, videoEnabled: boolean): Promise<void> {
    try {
      // Initialize WebRTC with audio/video options
      await this.webrtcService.startCall(
        { id: 'room', name: this.meeting?.title || 'Meeting' },
        { audio: audioEnabled, video: videoEnabled }
      )
    } catch (error) {
      console.error('Error initializing WebRTC:', error)
      throw error
    }
  }
  
  private handleParticipantUpdate(participant: MeetingParticipant): void {
    // Check if this is a leave event
    if (participant.leave_time) {
      this.participants.delete(participant.id)
      this.onParticipantLeft?.(participant.id)
      return
    }
    
    // Check if this is the local participant
    if (this.localParticipant && participant.id === this.localParticipant.id) {
      this.localParticipant = participant
      return
    }
    
    // Update or add participant
    const existingParticipant = this.participants.get(participant.id)
    
    const participantStream: MeetingParticipantStream = {
      participant,
      stream: existingParticipant?.stream || null,
      audioEnabled: participant.audio_enabled,
      videoEnabled: participant.video_enabled,
      speaking: existingParticipant?.speaking || false,
      connectionQuality: participant.connection_quality || 'good'
    }
    
    this.participants.set(participant.id, participantStream)
    
    if (existingParticipant) {
      this.onParticipantUpdated?.(participantStream)
    } else {
      this.onParticipantJoined?.(participantStream)
    }
  }
  
  private subscribeToSignalingChannel(meetingId: string): void {
    this.signalSubscription = supabase
      .channel(`signaling:${meetingId}`)
      .on('broadcast', { event: 'signal' }, (payload) => {
        // Handle WebRTC signaling
        this.webrtcService.handleSignalingMessage(payload.payload)
      })
      .subscribe()
  }
  
  private generateRoomId(): string {
    // Generate a random 6-character alphanumeric code
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }
}

// Create singleton instance
export const meetingRTCService = new MeetingRTCService()