import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

const BUCKET = 'user-uploads'

function joinPrefix(...parts: string[]) {
  const cleaned = parts
    .filter(Boolean)
    .map((p) => p.replace(/^\/+|\/+$/g, ''))
    .filter(Boolean)
  return cleaned.length ? cleaned.join('/') + '/' : ''
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const { searchParams } = new URL(request.url)
    const prefixParam = (searchParams.get('prefix') || '')
    const userId = searchParams.get('userId') || ''

    if (!userId) return NextResponse.json({ error: 'User ID required' }, { status: 400 })

    // Scope listing to the user's codehub namespace
    const base = joinPrefix('codehub', userId)
    const fullPrefix = joinPrefix(base, prefixParam)

    const { data, error } = await supabase.storage.from(BUCKET).list(fullPrefix, {
      limit: 1000,
      offset: 0,
      sortBy: { column: 'name', order: 'asc' },
    })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const items = (data || []).map((d: any) => {
      const isFile = !!d.metadata // metadata present => file
      const path = (fullPrefix || '') + d.name + (isFile ? '' : '/')
      return {
        name: d.name,
        path,
        size: isFile ? Number(d.metadata?.size || 0) : 0,
        updated_at: d.updated_at || undefined,
        type: isFile ? ('file' as const) : ('folder' as const),
      }
    })

    return NextResponse.json({ items })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to list files' }, { status: 500 })
  }
}