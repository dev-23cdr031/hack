import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { mockTeams } from '@/lib/mock-teams'

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    console.log('Join API: Received request for team ID:', id)
    
    // Add a small delay to simulate network latency
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const { user_id } = await request.json()
    console.log('Join API: User ID:', user_id)
    
    if (!user_id) return NextResponse.json({ error: 'User ID required' }, { status: 400 })

    // Check if we're dealing with a mock team (id starts with "team")
    if (id.startsWith('team')) {
      console.log('Join API: Processing mock team join')
      
      // Handle mock team join
      const teamIndex = mockTeams.findIndex(t => t.id === id)
      if (teamIndex === -1) {
        console.log('Join API: Mock team not found')
        return NextResponse.json({ error: 'Team not found' }, { status: 404 })
      }
      
      console.log('Join API: Found mock team:', mockTeams[teamIndex].name)
      
      // Check if user is already a member
      const existingMember = mockTeams[teamIndex].members?.find(m => m.id === user_id)
      if (!existingMember) {
        console.log('Join API: Adding new member to team')
        
        // Add user to members (using a mock user for simplicity)
        const mockUser = {
          id: user_id,
          name: `User ${user_id.substring(0, 4)}`,
          email: `user${user_id.substring(0, 4)}@example.com`,
          avatar_url: '/placeholder-user.jpg'
        }
        
        if (!mockTeams[teamIndex].members) {
          mockTeams[teamIndex].members = []
        }
        
        mockTeams[teamIndex].members.push(mockUser)
        mockTeams[teamIndex].current_members = (mockTeams[teamIndex].members?.length || 0)
        
        console.log('Join API: Updated team members count:', mockTeams[teamIndex].current_members)
      } else {
        console.log('Join API: User is already a member of this team')
      }
      
      return NextResponse.json({ success: true })
    } else {
      // For demo purposes, try to find the team in mockTeams regardless of ID format
      console.log('Join API: Checking all mock teams as fallback')
      const teamIndex = mockTeams.findIndex(t => t.id === id)
      
      if (teamIndex !== -1) {
        console.log('Join API: Found team in mock data:', mockTeams[teamIndex].name)
        
        // Check if user is already a member
        const existingMember = mockTeams[teamIndex].members?.find(m => m.id === user_id)
        if (!existingMember) {
          console.log('Join API: Adding new member to team')
          
          // Add user to members (using a mock user for simplicity)
          const mockUser = {
            id: user_id,
            name: `User ${user_id.substring(0, 4)}`,
            email: `user${user_id.substring(0, 4)}@example.com`,
            avatar_url: '/placeholder-user.jpg'
          }
          
          if (!mockTeams[teamIndex].members) {
            mockTeams[teamIndex].members = []
          }
          
          mockTeams[teamIndex].members.push(mockUser)
          mockTeams[teamIndex].current_members = (mockTeams[teamIndex].members?.length || 0)
          
          console.log('Join API: Updated team members count:', mockTeams[teamIndex].current_members)
        } else {
          console.log('Join API: User is already a member of this team')
        }
        
        return NextResponse.json({ success: true })
      }
      
      // Handle real team join with Supabase
      console.log('Join API: Attempting to join team in database')
      const supabase = createServerSupabaseClient()
      
      // Validate that the team ID is a valid UUID before proceeding
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
        console.log('Join API: Invalid UUID format')
        return NextResponse.json({ error: 'Invalid team ID format' }, { status: 400 })
      }

      // Upsert team member
      const { error: upsertError } = await supabase
        .from('team_members')
        .upsert({ team_id: id, user_id, role: 'member' }, { onConflict: 'team_id,user_id' })

      if (upsertError) {
        console.log('Join API: Database error:', upsertError.message)
        return NextResponse.json({ error: upsertError.message }, { status: 500 })
      }

      // Recalculate current_members from team_members
      const { count } = await supabase
        .from('team_members')
        .select('*', { count: 'exact', head: true })
        .eq('team_id', id)

      if (typeof count === 'number') {
        await supabase
          .from('teams')
          .update({ current_members: count })
          .eq('id', id)
      }

      console.log('Join API: Successfully joined team in database')
      return NextResponse.json({ success: true })
    }
  } catch (e: any) {
    console.error('Join API: Error joining team:', e)
    return NextResponse.json({ error: e?.message || 'Failed to join team' }, { status: 500 })
  }
}
