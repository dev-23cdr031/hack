import { NextRequest, NextResponse } from 'next/server'
import { meetingsService } from '@/lib/meetings-service'
import { createServerSupabaseClient } from '@/lib/supabase'

// POST /api/meetings/[id]/participants - Join meeting
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const meetingId = params.id
    const body = await request.json()
    const { audioEnabled = true, videoEnabled = true } = body
    
    // Get current user from Supabase
    const supabase = createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get meeting by room ID
    const meeting = await meetingsService.getMeetingByRoomId(meetingId)
    
    if (!meeting) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 })
    }
    
    // Check if meeting is active
    if (meeting.status !== 'active') {
      return NextResponse.json({ error: 'Meeting is not active' }, { status: 400 })
    }
    
    // Add participant to meeting
    const participant = await meetingsService.addParticipant(
      meeting.id,
      user.id,
      audioEnabled,
      videoEnabled
    )
    
    if (!participant) {
      return NextResponse.json({ error: 'Failed to join meeting' }, { status: 500 })
    }
    
    return NextResponse.json({ participant })
  } catch (error) {
    console.error(`Error in POST /api/meetings/${params.id}/participants:`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/meetings/[id]/participants - Update participant status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const meetingId = params.id
    const body = await request.json()
    const { participantId, audioEnabled, videoEnabled } = body
    
    // Get current user from Supabase
    const supabase = createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Update participant status
    const success = await meetingsService.updateParticipantStatus(
      participantId,
      audioEnabled,
      videoEnabled
    )
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to update participant status' }, { status: 500 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error in PATCH /api/meetings/${params.id}/participants:`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/meetings/[id]/participants - Leave meeting
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const meetingId = params.id
    const searchParams = request.nextUrl.searchParams
    const participantId = searchParams.get('participantId')
    
    if (!participantId) {
      return NextResponse.json({ error: 'Participant ID is required' }, { status: 400 })
    }
    
    // Get current user from Supabase
    const supabase = createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Record participant leaving
    const success = await meetingsService.recordParticipantLeave(participantId)
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to leave meeting' }, { status: 500 })
    }
    
    // Get meeting to check if user is host and if they're the last participant
    const meeting = await meetingsService.getMeetingByRoomId(meetingId)
    
    if (meeting && meeting.host_id === user.id && meeting.participants?.length <= 1) {
      // End the meeting if host is leaving and is the last participant
      await meetingsService.updateMeetingStatus(meeting.id, 'completed')
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error in DELETE /api/meetings/${params.id}/participants:`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}