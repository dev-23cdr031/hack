import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

// Bucket name to store code hub uploads
const BUCKET = 'user-uploads'

async function ensureBucketExists(supabase: ReturnType<typeof createServerSupabaseClient>) {
  try {
    // Try to create; ignore error if it already exists
    // Public bucket so files can be listed/downloaded if needed
    // Note: Requires SUPABASE_SERVICE_ROLE_KEY to work from server
    // @ts-ignore - types may not expose options fully
    await supabase.storage.createBucket(BUCKET, { public: true })
  } catch {}
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const userId = formData.get('userId') as string | null
    const relativePath = (formData.get('relativePath') as string | null) || (file ? file.name : '')

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    if (!userId) return NextResponse.json({ error: 'User ID required' }, { status: 400 })

    await ensureBucketExists(supabase)

    // Construct storage path: codehub/{userId}/{relativePath}
    const cleanRel = relativePath.replace(/^\/+/, '')
    const path = `codehub/${userId}/${cleanRel}`

    // Convert file to buffer for storage
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, buffer, { contentType: file.type || 'application/octet-stream', upsert: true })

    if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 })

    // Store metadata in DB
    const now = new Date().toISOString()
    await supabase
      .from('codehub_files')
      .insert({ user_id: userId, path, name: file.name, size: file.size, content_type: file.type || 'application/octet-stream', created_at: now, updated_at: now })
      .then(({ error }) => { /* ignore if table missing or other non-critical error */ })

    return NextResponse.json({ success: true, path })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Upload failed' }, { status: 500 })
  }
}