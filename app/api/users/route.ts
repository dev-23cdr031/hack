import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { getApiSessionUser } from '@/lib/api-auth'

// GET /api/users
// Returns registered users (public discovery). Only signed-in users may list
// other users. Supports search + filters used by the Explore page.
export async function GET(request: NextRequest) {
  const supabase = createServerSupabaseClient()

  // Public access for registered users only.
  const { user, error } = await getApiSessionUser(request)
  if (!user) {
    return NextResponse.json({ error: error || 'Authentication required' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)

  const search = searchParams.get('search')?.trim() || ''
  const skillsParam = searchParams.get('skills')?.trim()
  const college = searchParams.get('college')?.trim() || ''
  const interest = searchParams.get('interest')?.trim() || ''
  const excludeId = searchParams.get('exclude_id')?.trim() || ''
  const limit = parseInt(searchParams.get('limit') || '50')

  try {
    let query = supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(Math.min(limit || 50, 200))

    // Exclude the currently logged-in user's own profile from discovery.
    if (excludeId) {
      query = query.neq('id', excludeId)
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,username.ilike.%${search}%,email.ilike.%${search}%,college.ilike.%${search}%`)
    }

    if (skillsParam && skillsParam.length > 0) {
      const skills = skillsParam.split(',').map((s) => s.trim()).filter(Boolean)
      if (skills.length > 0) {
        try {
          query = query.overlaps('skills', skills)
        } catch {
          // skills column not present on this project yet - ignore filter
        }
      }
    }

    if (college) {
      query = query.ilike('college', `%${college}%`)
    }

    if (interest) {
      try {
        query = query.contains('hackathon_interests', [interest])
      } catch {
        // hackathon_interests column not present yet - ignore filter
      }
    }

    const { data, error: dbError } = await query

    if (dbError) {
      console.log('Database error:', dbError.message)
      return NextResponse.json([])
    }

    return NextResponse.json(data || [])
  } catch (err) {
    console.log('API error:', err)
    return NextResponse.json([])
  }
}

export async function POST(request: NextRequest) {
  const supabase = createServerSupabaseClient()
  
  try {
    const body = await request.json()
    const { data, error } = await supabase
      .from('users')
      .insert([body])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}