import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const hackathonId = searchParams.get('hackathon_id')
    const created_by = searchParams.get('created_by')
    const user_id = searchParams.get('user_id')

    const supabase = createServerSupabaseClient()

    // All registrations come from Supabase (hackathon_participants)
    let query = supabase
      .from('hackathon_participants')
      .select(`
        *,
        hackathons (id, title, created_by),
        users (id, name, email, avatar_url)
      `)
      .order('joined_at', { ascending: false })

    if (hackathonId) {
      query = query.eq('hackathon_id', hackathonId)
    }

    if (user_id) {
      query = query.eq('user_id', user_id)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching registrations:', error.message)
      return NextResponse.json({ registrations: [] })
    }

    let registrations = data || []

    // Optional: only show registrations for hackathons created by this admin
    if (created_by) {
      try {
        const { data: createdDbHackathons, error: dbHackError } = await supabase
          .from('hackathons')
          .select('id')
          .eq('created_by', created_by)

        if (dbHackError) {
          console.error('Error fetching created hackathons:', dbHackError.message)
          return NextResponse.json({ registrations: [] })
        }

        const createdIds = new Set((createdDbHackathons || []).map((h: any) => h.id))

        if (createdIds.size > 0) {
          registrations = registrations.filter((reg: any) =>
            createdIds.has(reg.hackathon_id)
          )
        } else {
          registrations = []
        }
      } catch (e) {
        console.error('Error filtering by creator:', e)
        return NextResponse.json({ registrations: [] })
      }
    }

    return NextResponse.json({ registrations })
  } catch (e: any) {
    console.error('Error fetching registrations:', e)
    return NextResponse.json({ registrations: [] })
  }
}
