import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { isAdminEmail } from '@/lib/admin'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { id } = params
    
    // Get current user from request context
    const supabase = createServerSupabaseClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (!user || userError) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Get the existing hackathon
    const { data: existingHackathon, error: fetchError } = await supabase
      .from('hackathons')
      .select('created_by')
      .eq('id', id)
      .single()

    if (fetchError || !existingHackathon) {
      return NextResponse.json({ error: 'Hackathon not found' }, { status: 404 })
    }

    // Check permissions: either the creator or an admin
    const isAdmin = isAdminEmail(user.email)
    const isCreator = existingHackathon.created_by === user.id
    
    if (!isCreator && !isAdmin) {
      return NextResponse.json({ error: 'Permission denied: You can only edit your own hackathons' }, { status: 403 })
    }

    // Update the hackathon
    const updateData: any = {}
    const allowedFields = [
      'title', 'description', 'image_url', 'start_date', 'end_date',
      'location', 'type', 'max_participants', 'current_participants', 'organizer_id', 'created_by', 'created_by_email'
    ]

    allowedFields.forEach(field => {
      if (body[field] !== undefined) {
        updateData[field] = body[field]
      }
    })

    updateData.updated_at = new Date().toISOString()

    const { data, error: updateError } = await supabase
      .from('hackathons')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single()

    if (updateError) {
      console.error('Update error:', updateError)
      return NextResponse.json({ error: 'Failed to update hackathon' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      hackathon: data,
      message: 'Hackathon updated successfully'
    })

  } catch (e: any) {
    console.error('PUT error:', e)
    return NextResponse.json({ error: e?.message || 'Failed to update hackathon' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    // Get current user
    const supabase = createServerSupabaseClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (!user || userError) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Get the existing hackathon
    const { data: existingHackathon, error: fetchError } = await supabase
      .from('hackathons')
      .select('created_by')
      .eq('id', id)
      .single()

    if (fetchError || !existingHackathon) {
      return NextResponse.json({ error: 'Hackathon not found' }, { status: 404 })
    }

    // Check permissions: either the creator or an admin
    const isAdmin = isAdminEmail(user.email)
    const isCreator = existingHackathon.created_by === user.id
    
    if (!isCreator && !isAdmin) {
      return NextResponse.json({ error: 'Permission denied: You can only delete your own hackathons' }, { status: 403 })
    }

    // Delete the hackathon
    const { error: deleteError } = await supabase
      .from('hackathons')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Delete error:', deleteError)
      return NextResponse.json({ error: 'Failed to delete hackathon' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Hackathon deleted successfully'
    })

  } catch (e: any) {
    console.error('DELETE error:', e)
    return NextResponse.json({ error: e?.message || 'Failed to delete hackathon' }, { status: 500 })
  }
}