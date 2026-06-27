import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; participantId: string } }
) {
  const supabase = createRouteHandlerClient({ cookies })
  
  try {
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    
    // Get request body
    const body = await request.json()
    
    // Get participant to check permissions
    const { data: participant, error: participantError } = await supabase
      .from('meeting_participants')
      .select('user_id, meeting_id')
      .eq('id', params.participantId)
      .single()
    
    if (participantError) {
      if (participantError.code === 'PGRST116') {
        return NextResponse.json(
          { error: "Participant not found" },
          { status: 404 }
        )
      }
      throw participantError
    }
    
    // Check if participant belongs to the specified meeting
    if (participant.meeting_id !== params.id) {
      return NextResponse.json(
        { error: "Participant does not belong to this meeting" },
        { status: 400 }
      )
    }
    
    // Check if user is the participant or the meeting host
    if (participant.user_id !== session.user.id) {
      // Check if user is the meeting host
      const { data: meeting, error: meetingError } = await supabase
        .from('meetings')
        .select('host_id')
        .eq('id', params.id)
        .single()
      
      if (meetingError) {
        throw meetingError
      }
      
      if (meeting.host_id !== session.user.id) {
        return NextResponse.json(
          { error: "Only the participant or the meeting host can update participant status" },
          { status: 403 }
        )
      }
    }
    
    // Update participant
    const updates: any = {}
    
    if (body.audio_enabled !== undefined) {
      updates.audio_enabled = body.audio_enabled
    }
    
    if (body.video_enabled !== undefined) {
      updates.video_enabled = body.video_enabled
    }
    
    if (body.connection_quality !== undefined) {
      updates.connection_quality = body.connection_quality
    }
    
    if (body.leave_time !== undefined) {
      updates.leave_time = body.leave_time
    }
    
    const { data: updatedParticipant, error } = await supabase
      .from('meeting_participants')
      .update(updates)
      .eq('id', params.participantId)
      .select(`
        *,
        user:user_id(id, name, avatar_url)
      `)
      .single()
    
    if (error) {
      throw error
    }
    
    return NextResponse.json({ participant: updatedParticipant })
  } catch (error) {
    console.error('Error updating participant:', error)
    return NextResponse.json(
      { error: "Failed to update participant" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; participantId: string } }
) {
  const supabase = createRouteHandlerClient({ cookies })
  
  try {
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    
    // Get participant to check permissions
    const { data: participant, error: participantError } = await supabase
      .from('meeting_participants')
      .select('user_id, meeting_id')
      .eq('id', params.participantId)
      .single()
    
    if (participantError) {
      if (participantError.code === 'PGRST116') {
        return NextResponse.json(
          { error: "Participant not found" },
          { status: 404 }
        )
      }
      throw participantError
    }
    
    // Check if participant belongs to the specified meeting
    if (participant.meeting_id !== params.id) {
      return NextResponse.json(
        { error: "Participant does not belong to this meeting" },
        { status: 400 }
      )
    }
    
    // Check if user is the meeting host
    const { data: meeting, error: meetingError } = await supabase
      .from('meetings')
      .select('host_id')
      .eq('id', params.id)
      .single()
    
    if (meetingError) {
      throw meetingError
    }
    
    if (meeting.host_id !== session.user.id) {
      return NextResponse.json(
        { error: "Only the meeting host can remove participants" },
        { status: 403 }
      )
    }
    
    // Remove participant (update leave_time instead of deleting)
    const { error } = await supabase
      .from('meeting_participants')
      .update({ leave_time: new Date().toISOString() })
      .eq('id', params.participantId)
    
    if (error) {
      throw error
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing participant:', error)
    return NextResponse.json(
      { error: "Failed to remove participant" },
      { status: 500 }
    )
  }
}