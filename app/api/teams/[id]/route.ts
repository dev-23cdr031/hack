import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { mockTeams } from '@/lib/mock-teams'

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    
    console.log('API: Received request for team ID:', id)
    
    // Add a small delay to simulate network latency
    await new Promise(resolve => setTimeout(resolve, 300))

    // Check if we're dealing with a mock team (id starts with "team")
    if (id.startsWith('team')) {
      console.log('API: Looking for mock team with ID:', id)
      
      // Find the mock team
      const mockTeam = mockTeams.find(t => t.id === id)
      
      if (!mockTeam) {
        console.log('API: Mock team not found')
        return NextResponse.json({ error: 'Team not found' }, { status: 404 })
      }
      
      console.log('API: Mock team found:', mockTeam.name)
      
      // Return the mock team data
      return NextResponse.json({ team: mockTeam })
    } else {
      // For demo purposes, try to find the team in mockTeams regardless of ID format
      console.log('API: Checking all mock teams as fallback')
      const mockTeam = mockTeams.find(t => t.id === id)
      
      if (mockTeam) {
        console.log('API: Found team in mock data:', mockTeam.name)
        return NextResponse.json({ team: mockTeam })
      }
      
      // Handle real team with Supabase
      console.log('API: Attempting to fetch from database')
      const supabase = createServerSupabaseClient()
      
      // Validate that the team ID is a valid UUID before proceeding
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
        console.log('API: Invalid UUID format')
        return NextResponse.json({ error: 'Invalid team ID format' }, { status: 400 })
      }

      // Team
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .select('*')
        .eq('id', id)
        .single()

      if (teamError) {
        console.log('API: Database error:', teamError.message)
        return NextResponse.json({ error: teamError.message }, { status: 404 })
      }

      // Members
      const { data: members } = await supabase
        .from('team_members_view')
        .select('*')
        .eq('team_id', id)

      // Hackathon (optional)
      let hackathon = null
      if (team.hackathon_id) {
        const { data: h } = await supabase
          .from('hackathons')
          .select('*')
          .eq('id', team.hackathon_id)
          .single()
        hackathon = h || null
      }

      console.log('API: Successfully fetched team from database')
      return NextResponse.json({ team: { ...team, members: members || [], hackathon } })
    }
  } catch (e: any) {
    console.error('API: Error fetching team:', e)
    return NextResponse.json({ error: e?.message || 'Failed to fetch team' }, { status: 500 })
  }
}