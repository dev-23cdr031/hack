import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { createServerSupabaseClient } from "@/lib/supabase"
import { isAdminEmail } from "@/lib/admin"

export const dynamic = 'force-dynamic'

// Global to hold hackathons in memory until they're saved to DB
declare global {
  var inMemoryHackathons: any[] | undefined
}

if (!global.inMemoryHackathons) {
  global.inMemoryHackathons = []
}

type Hackathon = {
  id: string
  title: string
  description?: string
  image_url?: string
  start_date: string
  end_date: string
  location?: string
  type: 'online' | 'in-person' | 'hybrid'
  format?: string
  themes?: string[]
  max_participants?: number
  current_participants: number
  status: 'upcoming' | 'ongoing' | 'past'
  prize_amount?: number
  skill_level?: string
  eligibility?: string
  rules?: any[]
  schedule?: any[]
  judges?: any[]
  sponsors?: any[]
  faq?: any[]
  resources?: any[]
  created_by?: string | null
  created_at: string
  updated_at: string
  creator?: any
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")
    const search = searchParams.get("search")
    const type = searchParams.get("type")
    const theme = searchParams.get("theme")

    const supabase = createServerSupabaseClient()
    
    let query = supabase.from('hackathons').select('*')
    
    if (search) {
      query = query.ilike('title', `%${search}%`)
    }
    if (type && type !== 'all') {
      query = query.eq('type', type)
    }

    const { data, error } = await query.order('created_at', { ascending: false })
    
    if (error) {
      console.error('Supabase fetch error, using in-memory only:', error)
      // Still return in-memory hackathons even if DB fails
      return NextResponse.json({
        hackathons: [...(global.inMemoryHackathons || [])],
        success: true
      })
    }

    // Enrich with creator info
    let hackathons = data as Hackathon[]
    try {
      const creatorIds = [...new Set(data.filter((h: any) => h.created_by).map((h: any) => h.created_by))]
      if (creatorIds.length > 0) {
        const { data: users, error: usersError } = await supabase
          .from('users')
          .select('id, name, email, avatar_url')
          .in('id', creatorIds)

        if (!usersError && users) {
          const userMap = Object.fromEntries(users.map((u: any) => [u.id, u]))
          hackathons = data.map((h: any) => ({
            ...h,
            creator: h.created_by ? userMap[h.created_by] || null : null
          }))
        }
      }
    } catch (e) {
      console.log('Creator enrichment failed:', e)
    }

    // Combine database hackathons with in-memory ones (in case DB is slow)
    const combined = [...hackathons, ...(global.inMemoryHackathons || [])]
    
    return NextResponse.json({ hackathons: combined, success: true })
  } catch (e: any) {
    console.error('Server error in hackathons GET, using in-memory:', e)
    return NextResponse.json({
      hackathons: [...(global.inMemoryHackathons || [])],
      success: true
    })
  }
}

export async function POST(request: NextRequest) {
  let body: any
  try {
    body = await request.json().catch(() => null)
    
    if (!body) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    if (!body.title || !body.start_date || !body.end_date) {
      console.log('Missing required fields:', { title: !!body.title, start_date: !!body.start_date, end_date: !!body.end_date, body })
      return NextResponse.json({ error: 'Title, start date, and end date are required' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const authorization = request.headers.get("authorization")

    if (!supabaseUrl || !supabaseAnonKey || !authorization?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authorization } },
    })
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    if (!isAdminEmail(user.email)) {
      return NextResponse.json({ error: "Only approved admin accounts can create hackathons." }, { status: 403 })
    }

    const insertData: any = {
      title: body.title,
      description: body.description || null,
      start_date: body.start_date,
      end_date: body.end_date,
      location: body.location || "Virtual",
      type: body.type || 'online',
      max_participants: body.max_participants || null,
      image_url: body.image_url || null,
      current_participants: 0,
    }

    insertData.organizer_id = user.id
    insertData.created_by = user.id
    insertData.created_by_email = user.email

    const { data, error } = await supabase
      .from('hackathons')
      .insert(insertData)
      .select('*')
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 403 })

    return NextResponse.json({
      success: true,
      hackathon: data,
      message: 'Hackathon created successfully'
    }, { status: 201 })

  } catch (e: any) {
    console.error('Server error in hackathons POST:', e)
    return NextResponse.json({ error: e?.message || "Failed to create hackathon" }, { status: 500 })
  }
}