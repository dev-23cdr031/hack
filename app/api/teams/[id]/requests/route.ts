import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { mockJoinRequests, updateJoinRequest, getJoinRequestsByTeam } from '@/lib/mock-join-requests'
import { mockTeams } from '@/lib/mock-teams'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id: teamId } = params
    console.log('Team Requests API: Getting requests for team:', teamId)
    
    // Add a small delay to simulate network latency
    await new Promise(resolve => setTimeout(resolve, 200))

    // Get all requests for this team
    const teamRequests = getJoinRequestsByTeam(teamId)
    
    return NextResponse.json({
      requests: teamRequests,
      count: teamRequests.length,
      pending: teamRequests.filter(req => req.status === 'pending').length,
      approved: teamRequests.filter(req => req.status === 'approved').length,
      rejected: teamRequests.filter(req => req.status === 'rejected').length
    })

  } catch (e: any) {
    console.error('Team Requests API: Error getting requests:', e)
    return NextResponse.json({ error: e?.message || 'Failed to get requests' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id: teamId } = params
    const { request_id, action, reviewer_id } = await request.json()
    
    console.log('Team Requests API: Managing request:', { teamId, request_id, action, reviewer_id })
    
    // Add a small delay to simulate network latency
    await new Promise(resolve => setTimeout(resolve, 300))

    if (!request_id || !action || !reviewer_id) {
      return NextResponse.json({ 
        error: 'Request ID, action, and reviewer ID are required' 
      }, { status: 400 })
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({ 
        error: 'Action must be either "approve" or "reject"' 
      }, { status: 400 })
    }

    // Find the join request
    const joinRequest = mockJoinRequests.find(req => req.id === request_id && req.team_id === teamId)
    if (!joinRequest) {
      return NextResponse.json({ error: 'Join request not found' }, { status: 404 })
    }

    if (joinRequest.status !== 'pending') {
      return NextResponse.json({ 
        error: `Request has already been ${joinRequest.status}` 
      }, { status: 400 })
    }

    // Find the team
    const teamIndex = mockTeams.findIndex(t => t.id === teamId)
    if (teamIndex === -1) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 })
    }

    const team = mockTeams[teamIndex]

    // Check if reviewer is the team leader
    if (team.leader_id !== reviewer_id) {
      return NextResponse.json({ 
        error: 'Only team leaders can manage join requests' 
      }, { status: 403 })
    }

    if (action === 'approve') {
      // Check if team is full
      if (team.current_members >= team.max_members) {
        return NextResponse.json({ 
          error: 'Team is already full' 
        }, { status: 400 })
      }

      // Add user to team members
      const newMember = joinRequest.user || {
        id: joinRequest.user_id,
        name: `User ${joinRequest.user_id.substring(0, 4)}`,
        email: `user${joinRequest.user_id.substring(0, 4)}@example.com`,
        avatar_url: '/placeholder-user.jpg',
        title: 'Developer',
        skills: ['JavaScript'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      if (!mockTeams[teamIndex].members) {
        mockTeams[teamIndex].members = []
      }

      // Check if user is not already a member (double check)
      const isAlreadyMember = mockTeams[teamIndex].members?.some(member => member.id === joinRequest.user_id)
      if (!isAlreadyMember) {
        mockTeams[teamIndex].members!.push(newMember)
        mockTeams[teamIndex].current_members = mockTeams[teamIndex].members!.length
      }

      // Update the join request
      const updatedRequest = updateJoinRequest(request_id, {
        status: 'approved',
        reviewed_at: new Date().toISOString(),
        reviewed_by: reviewer_id
      })

      console.log('Team Requests API: Approved request and added member to team')
      
      return NextResponse.json({
        success: true,
        message: 'Join request approved successfully',
        request: updatedRequest,
        team: mockTeams[teamIndex]
      })

    } else if (action === 'reject') {
      // Update the join request
      const updatedRequest = updateJoinRequest(request_id, {
        status: 'rejected',
        reviewed_at: new Date().toISOString(),
        reviewed_by: reviewer_id
      })

      console.log('Team Requests API: Rejected request')
      
      return NextResponse.json({
        success: true,
        message: 'Join request rejected',
        request: updatedRequest
      })
    }

  } catch (e: any) {
    console.error('Team Requests API: Error managing request:', e)
    return NextResponse.json({ error: e?.message || 'Failed to manage request' }, { status: 500 })
  }
}
