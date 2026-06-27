import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { mockEvents } from '@/lib/mock-events'

// GET /api/events/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params
  
  try {
    // Try Supabase first
    const supabase = createServerSupabaseClient()
    
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.log('Supabase error, falling back to mock data:', error.message)
      return getMockEvent(id)
    }

    if (!data) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (e) {
    console.log('Supabase unavailable, using mock data:', e)
    return getMockEvent(id)
  }
}

function getMockEvent(eventId: string) {
  const event = mockEvents.find(event => event.id === eventId)
  
  if (!event) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 })
  }
  
  return NextResponse.json(event)
}

// PUT /api/events/[id]
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  
  try {
    const body = await request.json()
    console.log('Updating event with data:', body)

    try {
      // Try Supabase first
      const supabase = createServerSupabaseClient()
      
      // Do not allow changing creator
      delete (body as any).created_by
      body.updated_at = new Date().toISOString()

      const { data, error } = await supabase
        .from('events')
        .update(body)
        .eq('id', id)
        .select('*')
        .single()

      if (error) {
        console.log('Supabase error, falling back to mock update:', error.message)
        return updateMockEvent(id, body)
      }

      console.log('Event updated successfully via Supabase:', data.title)
      return NextResponse.json(data)
    } catch (supabaseError) {
      console.log('Supabase unavailable, using mock update:', supabaseError)
      return updateMockEvent(id, body)
    }
  } catch (e) {
    console.error('Event update error:', e)
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 })
  }
}

function updateMockEvent(eventId: string, updateData: any) {
  const eventIndex = mockEvents.findIndex(event => event.id === eventId)
  
  if (eventIndex === -1) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 })
  }
  
  // Update the event
  mockEvents[eventIndex] = {
    ...mockEvents[eventIndex],
    ...updateData,
    updated_at: new Date().toISOString()
  }
  
  console.log('Event updated successfully via mock:', mockEvents[eventIndex].title)
  return NextResponse.json(mockEvents[eventIndex])
}

// DELETE /api/events/[id]
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  
  try {
    // Try Supabase first
    const supabase = createServerSupabaseClient()
    
    const { error } = await supabase.from('events').delete().eq('id', id)
    
    if (error) {
      console.log('Supabase error, falling back to mock deletion:', error.message)
      return deleteMockEvent(id)
    }
    
    return NextResponse.json({ success: true })
  } catch (e) {
    console.log('Supabase unavailable, using mock deletion:', e)
    return deleteMockEvent(id)
  }
}

function deleteMockEvent(eventId: string) {
  const eventIndex = mockEvents.findIndex(event => event.id === eventId)
  
  if (eventIndex === -1) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 })
  }
  
  mockEvents.splice(eventIndex, 1)
  console.log('Event deleted successfully via mock:', eventId)
  return NextResponse.json({ success: true })
}