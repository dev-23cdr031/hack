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

    // Check if team exists (mock first, then real database)
    let team = mockTeams.find(t => t.id === teamId)

    if (!team && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(teamId)) {
      const supabase = createServerSupabaseClient()
      const { data: dbTeam, error: teamError } = await supabase
        .from('teams')
        .select('*')
        .eq('id', teamId)
        .single()

      if (teamError || !dbTeam) {
        console.log('Join Request API: Database error looking up team:', teamError?.message)
        return NextResponse.json({ error: 'Team not found' }, { status: 404 })
      }

      // Fetch team members so the "already a member" and "team is full" checks work
      let members: any[] = []
      try {
        const { data: memberRows } = await supabase
          .from('team_members')
          .select('user_id')
          .eq('team_id', dbTeam.id)
        if (memberRows) {
          members = memberRows.map((mr: any) => ({ id: mr.user_id }))
        }
      } catch (e) {
        console.log('Join Request API: Member fetch failed:', e)
      }

      // Build a team object compatible with the rest of the handler
      team = {
        id: dbTeam.id,
        name: dbTeam.name,
        description: dbTeam.description,
        leader_id: dbTeam.leader_id,
        max_members: dbTeam.max_members,
        current_members: dbTeam.current_members,
        skills_needed: dbTeam.skills_needed || [],
        status: dbTeam.status,
        project_idea: dbTeam.project_idea,
        members,
      } as any
    }

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
