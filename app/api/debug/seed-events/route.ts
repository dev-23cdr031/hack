import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

// POST /api/debug/seed-events
export async function POST() {
  try {
    const supabase = createServerSupabaseClient()

    // Ensure table exists (best effort)
    // If you have migrations, prefer running scripts/05-create-events-table.sql in Supabase

    // Insert sample events
    const today = new Date()
    const toYMD = (d: Date) => {
      const y = d.getFullYear()
      const m = `${d.getMonth() + 1}`.padStart(2, '0')
      const day = `${d.getDate()}`.padStart(2, '0')
      return `${y}-${m}-${day}`
    }

    const events = [
      {
        title: 'Team Sync',
        description: 'Weekly standup',
        date: toYMD(today),
        time: '10:00 AM',
        duration: '30 mins',
        location: 'KEC Meet',
        type: 'meeting',
        participants: 5,
        status: 'upcoming',
        color: 'bg-green-500',
        team_id: null,
      },
      {
        title: 'Workshop: Performance Tuning',
        description: 'Deep dive into Next.js performance',
        date: toYMD(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3)),
        time: '02:00 PM',
        duration: '1 hour',
        location: 'Room A / Zoom',
        type: 'workshop',
        participants: 20,
        status: 'upcoming',
        color: 'bg-orange-500',
        team_id: null,
      },
      {
        title: 'Tech Conference',
        description: 'Annual dev conference',
        date: toYMD(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10)),
        time: '09:00 AM',
        duration: 'Full day',
        location: 'Convention Center',
        type: 'conference',
        participants: 300,
        status: 'upcoming',
        color: 'bg-purple-500',
        team_id: null,
      },
      {
        title: 'Hackathon: Build & Ship',
        description: '48-hour rapid prototyping',
        date: toYMD(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 15)),
        time: '08:00 AM',
        duration: '2 days',
        location: 'Online',
        type: 'hackathon',
        participants: 120,
        prize: '$5,000',
        status: 'upcoming',
        color: 'bg-blue-500',
        team_id: null,
      },
    ]

    const { data, error } = await supabase
      .from('events')
      .insert(events)
      .select('*')

    if (error) {
      return NextResponse.json({ status: 'error', message: 'Failed to insert events', error: error.message }, { status: 500 })
    }

    return NextResponse.json({ status: 'success', inserted: data?.length ?? 0, sample: data }, { status: 201 })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ status: 'error', message }, { status: 500 })
  }
}