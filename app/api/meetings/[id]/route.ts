import { NextRequest, NextResponse } from 'next/server'
import { meetingsService } from '@/lib/meetings-service'
import { createServerSupabaseClient } from '@/lib/supabase'

// GET /api/meetings/[id] - Get meeting by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const meetingId = params.id
    
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
    
    return NextResponse.json({ meeting })
  } catch (error) {
    console.error(`Error in GET /api/meetings/${params.id}:`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/meetings/[id] - Update meeting status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const meetingId = params.id
    const body = await request.json()
    const { status } = body
    
    // Get current user from Supabase
    const supabase = createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get meeting to check if user is host
    const meeting = await meetingsService.getMeetingByRoomId(meetingId)
    
    if (!meeting) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 })
    }
    
    // Only host can update meeting status
    if (meeting.host_id !== user.id) {
      return NextResponse.json({ error: 'Only the host can update meeting status' }, { status: 403 })
    }
    
    // Update meeting status
    const success = await meetingsService.updateMeetingStatus(meeting.id, status)
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to update meeting status' }, { status: 500 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error in PATCH /api/meetings/${params.id}:`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/meetings/[id] - End meeting (mark as completed)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const meetingId = params.id
    
    // Get current user from Supabase
    const supabase = createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get meeting to check if user is host
    const meeting = await meetingsService.getMeetingByRoomId(meetingId)
    
    if (!meeting) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 })
    }
    
    // Only host can end meeting
    if (meeting.host_id !== user.id) {
      return NextResponse.json({ error: 'Only the host can end the meeting' }, { status: 403 })
    }
    
    // Update meeting status to completed
    const success = await meetingsService.updateMeetingStatus(meeting.id, 'completed')
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to end meeting' }, { status: 500 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error in DELETE /api/meetings/${params.id}:`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}