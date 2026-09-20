import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const hackathon_id = searchParams.get('hackathon_id')
  const user_id = searchParams.get('user_id')
  const status = searchParams.get('status')

  console.log('Teams API called with filters:', { hackathon_id, user_id, status })

  try {
    const supabase = createServerSupabaseClient()
    let query = supabase
      .from('teams')
      .select('*')
      .order('created_at', { ascending: false })

    if (hackathon_id) {
      query = query.eq('hackathon_id', hackathon_id)
    }

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json([])
    }

    // Map teams and enrich with leader/members info
    const teams = await Promise.all((data || []).map(async (team: any) => {
      let leader = null
      let members: any[] = []
      let hackathon = null

      // Fetch leader info
      try {
        if (team.leader_id) {
          const { data: leaderData, error: leaderError } = await supabase
            .from('users')
            .select('id, name, email, avatar_url, title, bio, skills')
            .eq('id', team.leader_id)
            .single()

          if (!leaderError && leaderData) {
            leader = leaderData
          }
        }
      } catch (e) {
        console.log('Leader fetch failed:', e)
      }

      // Fetch team members
      try {
        const { data: memberRows, error: membersError } = await supabase
          .from('team_members')
          .select('id, user_id, role')
          .eq('team_id', team.id)

        if (!membersError && memberRows) {
          const memberIds = memberRows.map((mr: any) => mr.user_id).filter(Boolean)
          if (memberIds.length > 0) {
            const { data: users, error: usersError } = await supabase
              .from('users')
              .select('id, name, email, avatar_url, title, bio, skills')
              .in('id', memberIds)

            if (!usersError && users) {
              members = users
            }
          }
        }
      } catch (e) {
        console.log('Members fetch failed:', e)
      }

      // Fetch hackathon info
      try {
        if (team.hackathon_id) {
          const { data: hackData, error: hackError } = await supabase
            .from('hackathons')
            .select('id, title')
            .eq('id', team.hackathon_id)
            .single()

          if (!hackError && hackData) {
            hackathon = hackData
          }
        }
      } catch (e) {
        console.log('Hackathon fetch failed:', e)
      }

      return {
        id: team.id,
        name: team.name,
        description: team.description,
        hackathon_id: team.hackathon_id,
        hackathon,
        leader_id: team.leader_id,
        leader,
        members,
        max_members: team.max_members,
        current_members: team.current_members,
        skills_needed: team.skills_needed || [],
        status: team.status,
        project_idea: team.project_idea,
        communication_platform: team.communication_platform,
        meeting_schedule: team.meeting_schedule,
        roles_needed: team.roles_needed || [],
        created_at: team.created_at,
        updated_at: team.updated_at,
      }
    }))

    // Filter by user if specified
    let filteredTeams = teams
    if (user_id) {
      filteredTeams = teams.filter((team: any) => 
        team.leader_id === user_id || 
        team.members?.some((member: any) => member.id === user_id)
      )
    }

    console.log('Teams query result:', filteredTeams.length, 'teams found')

    return NextResponse.json(filteredTeams)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json([])
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const supabase = createServerSupabaseClient()

    // Try full insert first
    const { data, error } = await supabase
      .from('teams')
      .insert({
        name: body.name,
        description: body.description,
        hackathon_id: body.hackathon_id || null,
        leader_id: body.leader_id,
        max_members: body.max_members || 5,
        current_members: 1,
        skills_needed: body.skills_needed || [],
        status: body.status || "forming",
        project_idea: body.project_idea || "",
        communication_platform: body.communication_platform || "",
        meeting_schedule: body.meeting_schedule || "",
        roles_needed: body.roles_needed || [],
      })
      .select()
      .single()

    if (error) {
      console.error('Full insert failed, retrying with core fields only:', error.message)
      
      // If full insert fails due to missing columns, retry with core fields
      const { data: coreData, error: coreError } = await supabase
        .from('teams')
        .insert({
          name: body.name,
          description: body.description,
          hackathon_id: body.hackathon_id || null,
          leader_id: body.leader_id,
          max_members: body.max_members || 5,
          current_members: 1,
          skills_needed: body.skills_needed || [],
          status: body.status || "forming",
        })
        .select()
        .single()

      if (coreError) {
        console.error('Core insert also failed:', coreError.message)
        return NextResponse.json({ error: coreError.message }, { status: 500 })
      }

      // Add leader as team member
      const { error: memberError } = await supabase
        .from('team_members')
        .insert({
          team_id: coreData.id,
          user_id: body.leader_id,
          role: 'leader',
        })

      if (memberError) {
        console.error('Error adding leader as member:', memberError)
      }

      return NextResponse.json(coreData, { status: 201 })
    }

    // Add leader as team member
    const { error: memberError } = await supabase
      .from('team_members')
      .insert({
        team_id: data.id,
        user_id: body.leader_id,
        role: 'leader',
      })

    if (memberError) {
      console.error('Error adding leader as member:', memberError)
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error creating team:', error)
    return NextResponse.json(
      { error: 'Failed to create team' },
      { status: 500 }
    )
  }
}