import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { mockTeams, mockMentorRequests, addMentorRequest, updateTeamMentorStatus } from '@/lib/mock-teams'

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const { id: teamId } = params
  const { mentor_id, team_leader_id, message } = await request.json()

  if (!teamId || !mentor_id || !team_leader_id) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    // In production, use Supabase:
    // Check if team exists
    // const { data: team, error: teamError } = await supabase
    //   .from('teams')
    //   .select('*')
    //   .eq('id', teamId)
    //   .single()
    
    // if (teamError || !team) {
    //   return NextResponse.json({ error: 'Team not found' }, { status: 404 })
    // }

    // Mock implementation - get team from mock data
    const team = mockTeams.find(t => t.id === teamId)
    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 })
    }

    // Check if team already has an approved mentor
    if (team.mentor_status === 'approved') {
      return NextResponse.json({ error: 'Team already has an assigned mentor' }, { status: 400 })
    }

    // Check if there's already a pending request
    if (team.mentor_status === 'requested') {
      return NextResponse.json({ error: 'There is already a pending mentor request for this team' }, { status: 400 })
    }

    // Check if this mentor has already requested to mentor this team
    const existingRequest = mockMentorRequests.find(
      r => r.team_id === teamId && r.mentor_id === mentor_id
    )
    if (existingRequest) {
      return NextResponse.json({ error: 'You have already submitted a mentorship request for this team' }, { status: 400 })
    }

    // Create the mentor request
    const mentorRequest = addMentorRequest({
      team_id: teamId,
      mentor_id,
      team_leader_id,
      message: message || '',
      status: 'pending'
    })

    // Update the team's mentor status to 'requested'
    updateTeamMentorStatus(teamId, 'requested', mentor_id)

    return NextResponse.json({ 
      success: true, 
      request: mentorRequest,
      message: 'Mentor request submitted successfully'
    })
  } catch (error) {
    console.error('Error creating mentor request:', error)
    return NextResponse.json({ error: 'Failed to create mentor request' }, { status: 500 })
  }
}