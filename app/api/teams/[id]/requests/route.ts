import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { fetchTeamJoinRequests, summarizeJoinRequests } from '@/lib/team-requests'

// GET /api/teams/:id/requests
// All join requests for a team, with requester profiles joined.
// Used by the team leader's Accept Requests / management page.
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id: teamId } = params
    const supabase = createServerSupabaseClient()

    const requests = await fetchTeamJoinRequests(teamId, supabase)
    return NextResponse.json(summarizeJoinRequests(requests))
  } catch (e: any) {
    console.error('Team Requests API: error getting requests:', e)
    return NextResponse.json({ error: e?.message || 'Failed to get requests' }, { status: 500 })
  }
}

// PATCH /api/teams/:id/requests
// Approve or reject a join request. ONLY the team leader (creator) can run
// this. Approving adds the requester as a team member and updates the count.
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id: teamId } = params
    const { request_id, action, reviewer_id } = await request.json()

    if (!request_id || !action || !reviewer_id) {
      return NextResponse.json({
        error: 'Request ID, action, and reviewer ID are required',
      }, { status: 400 })
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Action must be either "approve" or "reject"' }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // Load the request
    const { data: joinRequest, error: reqError } = await supabase
      .from('team_join_requests')
      .select('*')
      .eq('id', request_id)
      .eq('team_id', teamId)
      .maybeSingle()

    if (reqError || !joinRequest) {
      return NextResponse.json({ error: 'Join request not found' }, { status: 404 })
    }

    if (joinRequest.status !== 'pending') {
      return NextResponse.json({ error: `Request has already been ${joinRequest.status}` }, { status: 400 })
    }

    // Load the team
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .select('*')
      .eq('id', teamId)
      .maybeSingle()

    if (teamError || !team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 })
    }

    // Security: only the team leader can manage join requests.
    if (team.leader_id !== reviewer_id) {
      return NextResponse.json({ error: 'Only the team leader can manage join requests' }, { status: 403 })
    }

    if (action === 'approve') {
      // Team full check
      const { count } = await supabase
        .from('team_members')
        .select('*', { count: 'exact', head: true })
        .eq('team_id', teamId)
      const memberCount = typeof count === 'number' ? count : team.current_members || 0
      if (memberCount >= (team.max_members || 5)) {
        return NextResponse.json({ error: 'Team is already full' }, { status: 400 })
      }

      // Add the requester as a team member
      const { error: memberError } = await supabase
        .from('team_members')
        .upsert(
          { team_id: teamId, user_id: joinRequest.user_id, role: 'member' },
          { onConflict: 'team_id,user_id' }
        )

      if (memberError) {
        console.error('Team Requests API: add member failed:', memberError.message)
        return NextResponse.json({ error: memberError.message }, { status: 500 })
      }

      // Recalculate the member count
      const { count: newCount } = await supabase
        .from('team_members')
        .select('*', { count: 'exact', head: true })
        .eq('team_id', teamId)
      if (typeof newCount === 'number') {
        await supabase.from('teams').update({ current_members: newCount }).eq('id', teamId)
      }
    }

    // Update the request status
    let { data: updatedRequest, error: updateError } = await supabase
      .from('team_join_requests')
      .update({
        status: action === 'approve' ? 'approved' : 'rejected',
        reviewed_at: new Date().toISOString(),
        reviewed_by: reviewer_id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', request_id)
      .select()
      .single()

    if (updateError) {
      // Safety net: older tables may be missing reviewed_at/reviewed_by.
      console.warn('Team Requests API: full update failed, retrying status-only:', updateError.message)
      ;({ data: updatedRequest, error: updateError } = await supabase
        .from('team_join_requests')
        .update({
          status: action === 'approve' ? 'approved' : 'rejected',
          updated_at: new Date().toISOString(),
        })
        .eq('id', request_id)
        .select()
        .single())
    }

    if (updateError) {
      console.error('Team Requests API: update failed:', updateError.message)
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: action === 'approve' ? 'Join request approved successfully' : 'Join request rejected',
      request: updatedRequest,
      team,
    })
  } catch (e: any) {
    console.error('Team Requests API: error managing request:', e)
    return NextResponse.json({ error: e?.message || 'Failed to manage request' }, { status: 500 })
  }
}
