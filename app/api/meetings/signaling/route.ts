import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

// POST /api/meetings/signaling - Send WebRTC signaling message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { meetingId, message } = body
    
    if (!meetingId || !message) {
      return NextResponse.json({ error: 'Meeting ID and message are required' }, { status: 400 })
    }
    
    // Get current user from Supabase
    const supabase = createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Send message to signaling channel
    const { error } = await supabase
      .channel(`signaling:${meetingId}`)
      .send({
        type: 'broadcast',
        event: 'signal',
        payload: {
          ...message,
          from: user.id
        }
      })
    
    if (error) {
      return NextResponse.json({ error: 'Failed to send signaling message' }, { status: 500 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in POST /api/meetings/signaling:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}