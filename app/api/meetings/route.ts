import { NextRequest, NextResponse } from 'next/server'
import { meetingsService, serverMeetingsService } from '@/lib/meetings-service'
import { createServerSupabaseClient } from '@/lib/supabase'

// GET /api/meetings - Get meetings for the current user
export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const teamId = searchParams.get('teamId')
    
    // Get current user from Supabase
    const supabase = createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get meetings based on query parameters
    let meetings
    if (teamId) {
      meetings = await meetingsService.getTeamMeetings(teamId)
    } else {
      meetings = await meetingsService.getUserActiveMeetings(user.id)
    }
    
    return NextResponse.json({ meetings })
  } catch (error) {
    console.error('Error in GET /api/meetings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/meetings - Create a new meeting
export async function POST(request: NextRequest) {
  try {
    // Get request body
    const body = await request.json()
    const { title, description, teamId, hackathonId } = body
    
    // Get current user from Supabase
    const supabase = createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Create meeting
    const meeting = await meetingsService.createMeeting({
      room_id: generateRoomId(),
      title: title || `${user.user_metadata.name || 'User'}'s Meeting`,
      description,
      host_id: user.id,
      team_id: teamId,
      hackathon_id: hackathonId,
      status: 'active',
      actual_start: new Date().toISOString()
    })
    
    if (!meeting) {
      return NextResponse.json({ error: 'Failed to create meeting' }, { status: 500 })
    }
    
    return NextResponse.json({ meeting })
  } catch (error) {
    console.error('Error in POST /api/meetings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Helper function to generate a random room ID
function generateRoomId(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}