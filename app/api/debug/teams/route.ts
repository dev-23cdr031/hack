import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()
    
    // Get teams count and sample data
    const { data: teams, error: teamsError, count } = await supabase
      .from('teams')
      .select(`
        *,
        hackathon:hackathons(title),
        leader:users!teams_leader_id_fkey(name)
      `, { count: 'exact' })
      .limit(5)
    
    // Get team members count
    const { count: membersCount } = await supabase
      .from('team_members')
      .select('*', { count: 'exact' })
    
    return NextResponse.json({
      status: 'success',
      teams: {
        count: count || 0,
        error: teamsError?.message,
        sample: teams || []
      },
      teamMembers: {
        count: membersCount || 0
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
