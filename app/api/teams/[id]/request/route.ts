import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { mockJoinRequests, addJoinRequest, getJoinRequestsByTeam } from '@/lib/mock-join-requests'
import { mockTeams } from '@/lib/mock-teams'

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id: teamId } = params
    console.log('Join Request API: Received request for team ID:', teamId)
    
    // Add a small delay to simulate network latency
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const { user_id, message } = await request.json()
    console.log('Join Request API: User ID:', user_id, 'Message:', message)
    
    if (!user_id) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Check if team exists
    const team = mockTeams.find(t => t.id === teamId)
    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 })
    }

    // Check if user is already a member
    const isAlreadyMember = team.members?.some(member => member.id === user_id)
    if (isAlreadyMember) {
      return NextResponse.json({ error: 'You are already a member of this team' }, { status: 400 })
    }

    // Check if user already has a pending request
    const existingRequest = mockJoinRequests.find(
      req => req.team_id === teamId && req.user_id === user_id && req.status === 'pending'
    )
    if (existingRequest) {
      return NextResponse.json({ error: 'You already have a pending request for this team' }, { status: 400 })
    }

    // Check if team is full
    if (team.current_members >= team.max_members) {
      return NextResponse.json({ error: 'Team is already full' }, { status: 400 })
    }

    // Create mock user data for the request
    const mockUser = {
      id: user_id,
      name: `User ${user_id.substring(0, 4)}`,
      email: `user${user_id.substring(0, 4)}@example.com`,
      avatar_url: '/placeholder-user.jpg',
      title: 'Developer',
      skills: ['JavaScript', 'React'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Create the join request
    const joinRequest = addJoinRequest({
      team_id: teamId,
      user_id: user_id,
      user: mockUser,
      team: team,
      message: message || '',
      status: 'pending'
    })

    console.log('Join Request API: Created request:', joinRequest.id)
    
    return NextResponse.json({
      success: true,
      request: joinRequest,
      message: 'Join request submitted successfully. The team leader will review your request.'
    })

  } catch (e: any) {
    console.error('Join Request API: Error creating request:', e)
    return NextResponse.json({ error: e?.message || 'Failed to submit join request' }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id: teamId } = params
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')
    
    console.log('Get Join Requests API: Team ID:', teamId, 'User ID:', userId)
    
    // Add a small delay to simulate network latency
    await new Promise(resolve => setTimeout(resolve, 200))

    if (userId) {
      // Get user's request for this team
      const userRequest = mockJoinRequests.find(
        req => req.team_id === teamId && req.user_id === userId
      )
      
      return NextResponse.json({
        request: userRequest || null,
        hasRequest: !!userRequest,
        status: userRequest?.status || null
      })
    } else {
      // Get all requests for this team (for team leaders)
      const teamRequests = getJoinRequestsByTeam(teamId)
      
      return NextResponse.json({
        requests: teamRequests,
        count: teamRequests.length,
        pending: teamRequests.filter(req => req.status === 'pending').length
      })
    }

  } catch (e: any) {
    console.error('Get Join Requests API: Error:', e)
    return NextResponse.json({ error: e?.message || 'Failed to get join requests' }, { status: 500 })
  }
}
