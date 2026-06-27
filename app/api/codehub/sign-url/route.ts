import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

const BUCKET = 'user-uploads'

export async function POST(request: NextRequest) {
  try {
    const { path, expiresIn } = await request.json()
    if (!path) return NextResponse.json({ error: 'Path required' }, { status: 400 })

    const supabase = createServerSupabaseClient()

    // Try getting a public URL first (if bucket is public). Fallback to signed URL.
    const publicUrl = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl

    if (publicUrl) {
      return NextResponse.json({ url: publicUrl })
    }

    const seconds = Number(expiresIn) > 0 ? Number(expiresIn) : 3600
    const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, seconds)
    if (error || !data?.signedUrl) return NextResponse.json({ error: error?.message || 'Failed to sign URL' }, { status: 500 })

    return NextResponse.json({ url: data.signedUrl })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to sign URL' }, { status: 500 })
  }
}