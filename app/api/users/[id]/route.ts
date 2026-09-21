import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { getApiSessionUser } from '@/lib/api-auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createServerSupabaseClient()

  // Public profile pages are for registered users only.
  const { user, error } = await getApiSessionUser(request)
  if (!user) {
    return NextResponse.json({ error: error || 'Authentication required' }, { status: 401 })
  }

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

  // Users can only ever update their OWN profile.
  const { user, error } = await getApiSessionUser(request)
  if (!user) {
    return NextResponse.json({ error: error || 'Authentication required' }, { status: 401 })
  }
  if (user.id !== params.id) {
    return NextResponse.json({ error: 'You can only update your own profile' }, { status: 403 })
  }

  try {
    const body = await request.json()
    console.log('API: Updating user:', params.id, 'with data:', body)

    // Only allow columns that are guaranteed to exist in the users table.
    // Extra fields like github_url / linkedin_url / portfolio_url may not exist
    // in every Supabase project's schema, so they are filtered out here to
    // avoid "Could not find the 'X' column of 'users' in the schema cache" errors.
    const allowedColumns = [
      'name',
      'email',
      'title',
      'bio',
      'avatar_url',
      'skills',
      'location',
      'experience_level',
      'role',
      'username',
      'college',
      'hackathon_interests',
      'github_url',
      'linkedin_url',
      'portfolio_url',
      'experience',
      'education',
      'achievements',
    ]

    const sanitized: Record<string, unknown> = { updated_at: new Date().toISOString() }
    for (const key of allowedColumns) {
      if (body[key] !== undefined) {
        sanitized[key] = body[key]
      }
    }

    // Helper to perform the actual update and return { data, error }
    const performUpdate = async (payload: Record<string, unknown>) => {
      return supabase
        .from('users')
        .update(payload)
        .eq('id', params.id)
        .select()
        .maybeSingle()
    }

    // First attempt: try the full sanitized payload (works if optional columns exist)
    let { data, error } = await performUpdate(sanitized)

    // If that fails (e.g. missing optional column), retry with only the core columns
    if (error) {
      console.log('API: Full update failed, retrying with core columns only:', error.message)
      const coreColumns: Record<string, unknown> = {
        name: sanitized.name,
        email: sanitized.email,
        title: sanitized.title,
        bio: sanitized.bio,
        avatar_url: sanitized.avatar_url,
        skills: sanitized.skills,
        updated_at: sanitized.updated_at,
      }
      ;({ data, error } = await performUpdate(coreColumns))
    }

    // If the user row does not exist yet (0 rows matched), upsert to create it.
    if (!error && !data) {
      console.log('API: No existing user row found for', params.id, '- upserting profile')
      const upsertPayload: Record<string, unknown> = {
        id: params.id,
        email: sanitized.email || body.email || '',
        name: sanitized.name || body.name || 'User',
        title: sanitized.title || '',
        bio: sanitized.bio || '',
        avatar_url: sanitized.avatar_url || '/placeholder-user.jpg',
        skills: sanitized.skills || [],
        updated_at: sanitized.updated_at,
        created_at: new Date().toISOString(),
      }
      // Include any sanitized optional fields that made it through
      for (const key of [
        'location',
        'experience_level',
        'role',
        'username',
        'college',
        'hackathon_interests',
        'github_url',
        'linkedin_url',
        'portfolio_url',
        'experience',
        'education',
        'achievements',
      ]) {
        if (sanitized[key] !== undefined) {
          upsertPayload[key] = sanitized[key]
        }
      }

      const upsertResult = await supabase
        .from('users')
        .upsert(upsertPayload)
        .select()
        .maybeSingle()
      ;({ data, error } = upsertResult)
    }

    if (error) {
      console.error('Supabase update error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data) {
      console.error('API: No user row returned after update for', params.id)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
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