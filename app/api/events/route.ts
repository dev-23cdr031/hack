import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { mockEvents, getNextEventId } from '@/lib/mock-events'

// GET /api/events?team_id=...&from=YYYY-MM-DD&to=YYYY-MM-DD
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const team_id = searchParams.get('team_id')
  const from = searchParams.get('from')
  const to = searchParams.get('to')

  try {
    // Try Supabase first
    const supabase = createServerSupabaseClient()
    
    let query = supabase.from('events').select('*').order('date', { ascending: true })

    if (team_id) query = query.eq('team_id', team_id)
    if (from) query = query.gte('date', from)
    if (to) query = query.lte('date', to)

    const { data, error } = await query
    
    if (error) {
      console.log('Supabase error, falling back to mock data:', error.message)
      return getMockEvents(team_id, from, to)
    }

    return NextResponse.json(data)
  } catch (e) {
    console.log('Supabase unavailable, using mock data:', e)
    return getMockEvents(team_id, from, to)
  }
}

function getMockEvents(team_id?: string | null, from?: string | null, to?: string | null) {
  let filteredEvents = [...mockEvents]

  if (team_id) {
    filteredEvents = filteredEvents.filter(event => event.team_id === team_id)
  }

  if (from) {
    filteredEvents = filteredEvents.filter(event => event.date >= from)
  }

  if (to) {
    filteredEvents = filteredEvents.filter(event => event.date <= to)
  }

  // Sort by date
  filteredEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return NextResponse.json(filteredEvents)
}

// POST /api/events
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Creating event with data:', body)

    try {
      // Try Supabase first
      const supabase = createServerSupabaseClient()
      
      body.created_at = new Date().toISOString()
      body.updated_at = new Date().toISOString()

      const { data, error } = await supabase.from('events').insert([body]).select('*').single()
      
      if (error) {
        console.log('Supabase error, falling back to mock creation:', error.message)
        return createMockEvent(body)
      }

      console.log('Event created successfully via Supabase:', data.title)
      return NextResponse.json(data, { status: 201 })
    } catch (supabaseError) {
      console.log('Supabase unavailable, using mock creation:', supabaseError)
      return createMockEvent(body)
    }
  } catch (e) {
    console.error('Event creation error:', e)
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
  }
}

function createMockEvent(eventData: any) {
  const newEvent = {
    id: getNextEventId(),
    title: eventData.title,
    description: eventData.description || '',
    date: eventData.date,
    time: eventData.time || '09:00',
    type: eventData.type || 'event',
    team_id: eventData.team_id || null,
    created_by: eventData.created_by || '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }

  // Add to mock events array
  mockEvents.push(newEvent)

  console.log('Event created successfully via mock:', newEvent.title)
  return NextResponse.json(newEvent, { status: 201 })
}