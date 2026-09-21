import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { fetchTeamJoinRequests, summarizeJoinRequests } from '@/lib/team-requests'

// POST /api/teams/:id/request
// Persists a "request to join this team" in Supabase. The team leader
// (creator) reviews it on the Accept Requests / team management page.
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id: teamId } = params
    const body = await request.json()
    const user_id = body?.user_id
    const message = body?.message || ''

    if (!user_id) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // The team must exist (and be a real database team).
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .select('*')
      .eq('id', teamId)
      .maybeSingle()

    if (teamError || !team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 })
    }

    // Safety net: make sure the requester has a profile row (foreign key).
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', user_id)
      .maybeSingle()

    if (!existingUser) {
      const { error: userInsertError } = await supabase.from('users').insert({
        id: user_id,
        email: '',
        name: `User ${String(user_id).substring(0, 6)}`,
        title: 'Developer',
        bio: '',
        skills: ['JavaScript', 'React'],
        avatar_url: '/placeholder-user.jpg',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      if (userInsertError && userInsertError.code !== '23505') {
        console.log('Join Request API: requester row insert warning:', userInsertError.message)
      }
    }

    // Already a member?
    const { data: memberRow } = await supabase
      .from('team_members')
      .select('user_id')
      .eq('team_id', teamId)
      .eq('user_id', user_id)
      .maybeSingle()
    if (memberRow) {
      return NextResponse.json({ error: 'You are already a member of this team' }, { status: 400 })
    }

    // Team full?
    const { count } = await supabase
      .from('team_members')
      .select('*', { count: 'exact', head: true })
      .eq('team_id', teamId)
    const memberCount = typeof count === 'number' ? count : team.current_members || 0
    if (memberCount >= (team.max_members || 5)) {
      return NextResponse.json({ error: 'Team is already full' }, { status: 400 })
    }

    // Persist the request. Re-applying reopens a rejected request (upsert).
    const coreRequest = {
      team_id: teamId,
      user_id,
      message: message || '',
      status: 'pending',
    }
    let { data: joinRequest, error: insertError } = await supabase
      .from('team_join_requests')
      .upsert(
        {
          ...coreRequest,
          reviewed_at: null,
          reviewed_by: null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'team_id,user_id' }
      )
      .select()
      .single()

    if (insertError) {
      // Safety net: older tables may be missing reviewed_at/reviewed_by/updated_at.
      console.warn('Join Request API: full upsert failed, retrying core-only:', insertError.message)
      ;({ data: joinRequest, error: insertError } = await supabase
        .from('team_join_requests')
        .upsert(coreRequest, { onConflict: 'team_id,user_id' })
        .select()
        .single())
    }

    if (insertError) {
      console.error('Join Request API: insert failed:', insertError.message)
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      request: joinRequest,
      message: 'Join request submitted successfully. The team leader will review your request.',
    })
  } catch (e: any) {
    console.error('Join Request API: error creating request:', e)
    return NextResponse.json({ error: e?.message || 'Failed to submit join request' }, { status: 500 })
  }
}

// GET /api/teams/:id/request?user_id=...
// With user_id: the requesting user's own request for this team.
// Without user_id: all requests for the team (team leader view).
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id: teamId } = params
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')
    const supabase = createServerSupabaseClient()

    if (userId) {
      const { data: userRequest } = await supabase
        .from('team_join_requests')
        .select('*')
        .eq('team_id', teamId)
        .eq('user_id', userId)
        .maybeSingle()

      return NextResponse.json({
        request: userRequest || null,
        hasRequest: !!userRequest,
        status: userRequest?.status || null,
      })
    }

    const requests = await fetchTeamJoinRequests(teamId, supabase)
    return NextResponse.json(summarizeJoinRequests(requests))
  } catch (e: any) {
    console.error('Get Join Requests API: error:', e)
    return NextResponse.json({ error: e?.message || 'Failed to get join requests' }, { status: 500 })
  }
}
