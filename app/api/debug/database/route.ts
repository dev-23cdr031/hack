import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()
    
    // Check if tables exist and get row counts
    const results: any = {}
    
    // Check hackathons table
    const { data: hackathons, error: hackathonsError, count: hackathonsCount } = await supabase
      .from('hackathons')
      .select('*', { count: 'exact' })
      .limit(5)
    
    results.hackathons = {
      exists: !hackathonsError,
      count: hackathonsCount || 0,
      error: hackathonsError?.message,
      sample: hackathons?.slice(0, 2) || []
    }
    
    // Check users table
    const { data: users, error: usersError, count: usersCount } = await supabase
      .from('users')
      .select('*', { count: 'exact' })
      .limit(3)
    
    results.users = {
      exists: !usersError,
      count: usersCount || 0,
      error: usersError?.message,
      sample: users?.slice(0, 2) || []
    }
    
    // Check teams table
    const { data: teams, error: teamsError, count: teamsCount } = await supabase
      .from('teams')
      .select('*', { count: 'exact' })
      .limit(3)
    
    results.teams = {
      exists: !teamsError,
      count: teamsCount || 0,
      error: teamsError?.message,
      sample: teams?.slice(0, 2) || []
    }

    return NextResponse.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      tables: results
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Database check failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
