import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { sender_id, receiver_id } = await request.json()

    if (!sender_id || !receiver_id) {
      return NextResponse.json({ error: 'sender_id and receiver_id are required' }, { status: 400 })
    }
    if (sender_id === receiver_id) {
      return NextResponse.json({ error: 'Cannot send request to yourself' }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // Check if a request already exists between these users
    const { data: existing } = await supabase
      .from('connection_requests')
      .select('*')
      .or(`and(sender_id.eq.${sender_id},receiver_id.eq.${receiver_id}),and(sender_id.eq.${receiver_id},receiver_id.eq.${sender_id})`)
      .limit(1)

    if (existing && existing.length > 0) {
      return NextResponse.json({ 
        success: true, 
        request: existing[0],
        message: 'Request already exists'
      })
    }

    const { data, error } = await supabase
      .from('connection_requests')
      .insert({ sender_id, receiver_id, status: 'pending' })
      .select()
      .single()

    if (error) {
      console.error('Database error in requests:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, request: data })
  } catch (e: any) {
    console.error('Error sending request:', e)
    return NextResponse.json({ error: e?.message || 'Failed to send request' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const receiver_id = searchParams.get('receiver_id')
    const sender_id = searchParams.get('sender_id')

    if (!receiver_id && !sender_id) {
      return NextResponse.json({ error: 'receiver_id or sender_id is required' }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    let query = supabase
      .from('connection_requests')
      .select(`
        *,
        sender:users!connection_requests_sender_id_fkey(id, name, email, avatar_url, bio, title, skills)
      `)
      .order('created_at', { ascending: false })

    if (receiver_id) query = query.eq('receiver_id', receiver_id)
    if (sender_id) query = query.eq('sender_id', sender_id)

    const { data: reqs, error } = await query

    if (error) {
      console.error('Error fetching requests:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(reqs || [])
  } catch (e: any) {
    console.error('Error in GET requests:', e)
    return NextResponse.json({ error: e?.message || 'Failed to load requests' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, status } = await request.json()

    if (!id || !status) {
      return NextResponse.json({ error: 'id and status are required' }, { status: 400 })
    }
    if (!['accepted', 'ignored'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from('connection_requests')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating request:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, request: data })
  } catch (e: any) {
    console.error('Error in PATCH requests:', e)
    return NextResponse.json({ error: e?.message || 'Failed to update request' }, { status: 500 })
  }
}