import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

const BUCKET = 'user-uploads'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const { path, userId } = await request.json()
    if (!path) return NextResponse.json({ error: 'Path required' }, { status: 400 })

    const { error } = await supabase.storage.from(BUCKET).remove([path])
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Remove metadata (ignore if table missing)
    if (userId) {
      await supabase.from('codehub_files').delete().eq('user_id', userId).eq('path', path)
    }

    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to delete' }, { status: 500 })
  }
}