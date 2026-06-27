import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function GET() {
  try {
    // Check environment variables
    const requiredEnvVars = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    }

    const missingVars = Object.entries(requiredEnvVars)
      .filter(([_, value]) => !value)
      .map(([key]) => key)

    if (missingVars.length > 0) {
      return NextResponse.json({
        status: 'error',
        message: 'Missing environment variables',
        missing: missingVars
      }, { status: 500 })
    }

    // Test database connection
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .limit(1)

    if (error) {
      return NextResponse.json({
        status: 'error',
        message: 'Database connection failed',
        error: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      status: 'ok',
      message: 'All systems operational',
      database: 'connected',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Health check failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
