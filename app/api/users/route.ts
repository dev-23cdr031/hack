import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  const skills = searchParams.get('skills')?.split(',')
  const limit = parseInt(searchParams.get('limit') || '50')

  const supabase = createServerSupabaseClient()
  
  try {
    let query = supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (skills && skills.length > 0) {
      query = query.overlaps('skills', skills)
    }

    const { data, error } = await query

    if (error) {
      console.log('Database error:', error.message)
      return NextResponse.json([])
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.log('API error:', error)
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