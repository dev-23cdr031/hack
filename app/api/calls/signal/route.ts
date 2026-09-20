import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, target, sender, ...data } = body

    if (!type || !target || !sender) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Store the signaling message in the database
    const { error } = await supabase
      .from('call_signals')
      .insert({
        type,
        target_user_id: target,
        sender_user_id: sender,
        data,
        created_at: new Date().toISOString()
      })

    if (error) {
      console.error('Error storing signal:', error)
      return NextResponse.json({ error: 'Failed to store signal' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in call signaling:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Create a GET endpoint to poll for incoming signals
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const lastSignalTime = searchParams.get('lastSignalTime')

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId parameter' }, { status: 400 })
    }

    // Query for new signals for this user
    let query = supabase
      .from('call_signals')
      .select('*')
      .eq('target_user_id', userId)
      .order('created_at', { ascending: true })

    if (lastSignalTime) {
      query = query.gt('created_at', lastSignalTime)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching signals:', error)
      return NextResponse.json({ error: 'Failed to fetch signals' }, { status: 500 })
    }

    return NextResponse.json({ signals: data || [] })
  } catch (error) {
    console.error('Error in call signaling GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}