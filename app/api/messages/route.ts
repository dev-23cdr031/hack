import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { getApiSessionUser } from '@/lib/api-auth'

// Resolve a synthetic "direct-<otherUserId>" conversation id to the real
// conversation UUID (creating it if needed via the shared RPC).
async function resolveDirectConversationId(
  supabase: ReturnType<typeof createServerSupabaseClient>,
  currentUserId: string,
  targetUserId: string
): Promise<string | null> {
  const { data: convId, error: rpcError } = await supabase.rpc(
    'get_or_create_direct_conversation',
    { p_user_a: currentUserId, p_user_b: targetUserId }
  )
  if (!rpcError && convId) return convId as string

  try {
    const { data: forMe } = await supabase
      .from('conversation_participants')
      .select('conversation_id')
      .eq('user_id', currentUserId)

    const { data: forOther } = await supabase
      .from('conversation_participants')
      .select('conversation_id')
      .eq('user_id', targetUserId)

    const myIds = new Set((forMe || []).map((r: any) => r.conversation_id))
    const shared = (forOther || []).find((r: any) => myIds.has(r.conversation_id))
    if (shared?.conversation_id) return shared.conversation_id
  } catch {}

  const { data: legacyConv } = await supabase
    .from('conversations')
    .select('id')
    .eq('type', 'direct')
    .in('created_by', [currentUserId, targetUserId])
    .limit(1)
  if (legacyConv && legacyConv[0]) return legacyConv[0].id

  return null
}

// Is this user a participant of the conversation?
async function isParticipant(
  supabase: ReturnType<typeof createServerSupabaseClient>,
  conversationId: string,
  userId: string
): Promise<boolean> {
  const { data } = await supabase
    .from('conversation_participants')
    .select('conversation_id')
    .eq('conversation_id', conversationId)
    .eq('user_id', userId)
    .maybeSingle()
  return !!data
}

// GET /api/messages?conversation_id=...
export async function GET(request: NextRequest) {
  const supabase = createServerSupabaseClient()

  // Messages are private - only signed-in participants may read them.
  const { user, error } = await getApiSessionUser(request)
  if (!user) {
    return NextResponse.json({ error: error || 'Authentication required' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const conversation_id = searchParams.get('conversation_id')
  const limit = parseInt(searchParams.get('limit') || '100')

  if (!conversation_id) {
    return NextResponse.json([])
  }

  try {
    // Synthetic direct conversation id -> real conversation UUID
    let finalConversationId: string | null = conversation_id
    if (conversation_id.startsWith('direct-')) {
      const otherUserId = conversation_id.replace('direct-', '')
      finalConversationId = await resolveDirectConversationId(supabase, user.id, otherUserId)
      if (!finalConversationId) return NextResponse.json([])
    }

    // Direct conversations: strict participant check
    if (finalConversationId && (await isParticipant(supabase, finalConversationId, user.id))) {
      const { data, error: fetchError } = await supabase
        .from('messages')
        .select(`
          *,
          sender:users!messages_sender_id_fkey(id, name, username, avatar_url, email, title)
        `)
        .eq('conversation_id', finalConversationId)
        .order('created_at', { ascending: true })
        .limit(limit)

      if (fetchError) {
        console.error('Error fetching conversation messages:', fetchError)
        return NextResponse.json([])
      }
      return NextResponse.json(data || [])
    }

    // Legacy team conversations: fetch by team_id (requires team membership)
    const { data: teamMember } = await supabase
      .from('team_members')
      .select('team_id')
      .eq('team_id', conversation_id)
      .eq('user_id', user.id)
      .maybeSingle()

    if (teamMember) {
      const { data, error: teamFetchError } = await supabase
        .from('messages')
        .select(`
          *,
          sender:users!messages_sender_id_fkey(id, name, username, avatar_url, email, title)
        `)
        .eq('team_id', conversation_id)
        .order('created_at', { ascending: true })
        .limit(limit)

      if (teamFetchError) {
        console.error('Error fetching team messages:', teamFetchError)
        return NextResponse.json([])
      }
      return NextResponse.json(data || [])
    }

    return NextResponse.json({ error: 'Access denied' }, { status: 403 })
  } catch (err) {
    console.error('Messages API error:', err)
    return NextResponse.json([])
  }
}

// POST /api/messages  -  body: { conversation_id, content, team_id? }
export async function POST(request: NextRequest) {
  const supabase = createServerSupabaseClient()

  // The sender is ALWAYS the signed-in user - clients cannot spoof sender_id.
  const { user, error } = await getApiSessionUser(request)
  if (!user) {
    return NextResponse.json({ error: error || 'Authentication required' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { conversation_id, team_id, content } = body

    if (!content || !String(content).trim()) {
      return NextResponse.json({ error: 'content is required' }, { status: 400 })
    }

    let finalConversationId: string | null = null
    let finalTeamId: string | null = team_id || null

    if (conversation_id) {
      if (conversation_id.startsWith('direct-')) {
        // Any two registered users can message each other; create-on-demand.
        const otherUserId = conversation_id.replace('direct-', '')
        finalConversationId = await resolveDirectConversationId(supabase, user.id, otherUserId)
      } else if (await isParticipant(supabase, conversation_id, user.id)) {
        // Real conversation UUID - sender must be a participant.
        finalConversationId = conversation_id
      } else {
        // Team chat: the "conversation_id" is actually a team id. Only team
        // members may send to the team chat.
        const { data: teamMember } = await supabase
          .from('team_members')
          .select('team_id')
          .eq('team_id', conversation_id)
          .eq('user_id', user.id)
          .maybeSingle()

        if (teamMember) {
          finalTeamId = conversation_id
        } else {
          return NextResponse.json({ error: 'Access denied' }, { status: 403 })
        }
      }
    }

    if (!finalConversationId && !finalTeamId) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    const { data, error: insertError } = await supabase
      .from('messages')
      .insert({
        conversation_id: finalConversationId,
        team_id: finalTeamId,
        sender_id: user.id,
        content: String(content).trim(),
        message_type: 'text',
      })
      .select(`
        *,
        sender:users!messages_sender_id_fkey(id, name, username, avatar_url, email, title)
      `)
      .single()

    if (insertError) {
      console.error('Failed to insert message:', insertError)
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    console.error('Messages API error:', err)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
