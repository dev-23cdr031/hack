import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { mockTeams } from '@/lib/mock-teams'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const hackathon_id = searchParams.get('hackathon_id')
  const user_id = searchParams.get('user_id')
  const status = searchParams.get('status')

  console.log('Teams API called with filters:', { hackathon_id, user_id, status })

  try {
    // Add a small delay to simulate network latency
    await new Promise(resolve => setTimeout(resolve, 300))

    // Filter teams based on parameters
    let filteredTeams = [...mockTeams]

    if (hackathon_id) {
      filteredTeams = filteredTeams.filter(team => team.hackathon_id === hackathon_id)
    }

    if (status && status !== 'all') {
      filteredTeams = filteredTeams.filter(team => team.status === status)
    }

    // Only filter by user if specifically requested
    if (user_id) {
      filteredTeams = filteredTeams.filter(team => 
        team.leader_id === user_id || 
        team.members?.some(member => member.id === user_id)
      )
    }

    console.log('Teams query result:', filteredTeams.length, 'teams found')

    return NextResponse.json(filteredTeams)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch teams' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Create a new team with mock data
    const newTeam = {
      id: `team${mockTeams.length + 1}`,
      name: body.name,
      description: body.description,
      hackathon_id: body.hackathon_id,
      hackathon: mockTeams.find(team => team.hackathon_id === body.hackathon_id)?.hackathon,
      leader_id: body.leader_id,
      leader: mockTeams[0].leader, // Mock leader data
      members: [mockTeams[0].leader], // Start with just the leader
      max_members: body.max_members || 5,
      current_members: 1, // Leader only
      skills_needed: body.skills_needed || [],
      status: body.status || "forming",
      project_idea: body.project_idea || "",
      communication_platform: body.communication_platform || "Discord",
      meeting_schedule: body.meeting_schedule || "",
      roles_needed: body.roles_needed || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    // Add to mock teams (this won't persist between requests in development)
    mockTeams.push(newTeam as any)
    
    return NextResponse.json(newTeam, { status: 201 })
  } catch (error) {
    console.error('Error creating team:', error)
    return NextResponse.json(
      { error: 'Failed to create team' },
      { status: 500 }
    )
  }
}
