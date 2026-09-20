import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createServerSupabaseClient()
  
  try {
    console.log('API: Fetching user with ID:', params.id)
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', params.id)
      .maybeSingle()

    if (error && error.code !== 'PGRST116') {
      console.error('API: Error fetching user record:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data) {
      console.log('API: User not found, returning default empty profile for:', params.id)
      return NextResponse.json({
        id: params.id,
        email: '',
        name: 'New User',
        bio: '',
        title: 'Developer',
        skills: [],
        avatar_url: '/placeholder-user.jpg',
        github_url: '',
        linkedin_url: '',
        portfolio_url: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('API: Error in GET /api/users/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createServerSupabaseClient()

  try {
    const body = await request.json()
    console.log('API: Updating user:', params.id, 'with data:', body)

    const { data, error } = await supabase
      .from('users')
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Supabase update error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('API: User updated in Supabase:', data.name)
    return NextResponse.json(data)
  } catch (error) {
    console.error('API: Update user error:', error)
    return NextResponse.json(
      { error: 'Failed to update user: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    )
  }
}