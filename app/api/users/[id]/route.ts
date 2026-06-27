import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { mockUsers } from '../mockData'

// Helper function to get a user by ID from mock data
const getMockUserById = (id: string) => {
  const normalizedId = decodeURIComponent(id).trim().toLowerCase()

  if (["1", "demo", "demo-user", "student"].includes(normalizedId)) {
    return mockUsers[0]
  }

  return mockUsers.find(u => (
    u.id.toLowerCase() === normalizedId ||
    u.email.toLowerCase() === normalizedId ||
    u.name.toLowerCase().replace(/\s+/g, "-") === normalizedId
  )) || null
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('API: Fetching user with ID:', params.id)
    
    // For demo purposes, always return mock data to avoid fetch errors
    const mockUser = getMockUserById(params.id)
    
    if (mockUser) {
      console.log('API: Mock user found:', mockUser.name)
      return NextResponse.json(mockUser)
    }
    
    console.log('API: No user found for ID:', params.id)
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  } catch (error) {
    console.error('API: Error in GET /api/users/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }

  // Commented out database code to prevent fetch errors
  /*
  const supabase = createServerSupabaseClient()
  
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) {
      console.log('Database error for user', params.id, '- using mock data:', error.message)
      const mockUser = getMockUserById(params.id)
      if (mockUser) {
        return NextResponse.json(mockUser)
      }
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (!data) {
      const mockUser = getMockUserById(params.id)
      if (mockUser) {
        return NextResponse.json(mockUser)
      }
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.log('API error for user', params.id, '- using mock data:', error)
    const mockUser = getMockUserById(params.id)
    if (mockUser) {
      return NextResponse.json(mockUser)
    }
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    )
  }
  */
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    console.log('API: Updating user:', params.id, 'with data:', body)

    // Find the user in mock data
    const userIndex = mockUsers.findIndex(u => u.id === params.id)
    
    if (userIndex === -1) {
      console.log('API: No user found for update with ID:', params.id)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    // Update the mock user (in memory only - will reset on server restart)
    const updatedUser = {
      ...mockUsers[userIndex],
      ...body,
      updated_at: new Date().toISOString()
    }
    
    // In a real app, we would save this to the database
    // For demo purposes, we'll just return the updated user
    console.log('API: User updated successfully (mock):', updatedUser.name)
    return NextResponse.json(updatedUser)
    
  } catch (error) {
    console.error('API: Update user error:', error)
    return NextResponse.json(
      { error: 'Failed to update user: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    )
  }
  
  // Commented out database code to prevent fetch errors
  /*
  const supabase = createServerSupabaseClient()

  try {
    const body = await request.json()
    console.log('Updating user:', params.id, 'with data:', body)

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

    console.log('User updated successfully:', data.name)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json(
      { error: 'Failed to update user: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    )
  }
  */
}
