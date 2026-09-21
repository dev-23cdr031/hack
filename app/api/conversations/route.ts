import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { getApiSessionUser } from '@/lib/api-auth'

// GET /api/conversations?user_id=...
// Lists the signed-in user's conversations (team chats + direct chats).
export async function GET(request: NextRequest) {
  const supabase = createServerSupabaseClient()

  // Conversations are private - a user can only list their own.
  const { user, error } = await getApiSessionUser(request)
  if (!user) {
    return NextResponse.json({ error: error || 'Authentication required' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const user_id = searchParams.get('user_id') || user.id

  if (user_id !== user.id) {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 })
  }

  try {
    const allConversations: any[] = []

    // ---- 1. Team conversations ------------------------------------------------
    const { data: userTeams, error: teamsError } = await supabase
      .from('team_members')
      .select(`
        team:teams(
          id,
          name,
          description,
          leader:users!teams_leader_id_fkey(id, name, avatar_url),
          hackathon:hackathons(id, title)
        )
      `)
      .eq('user_id', user_id)

    if (!teamsError && userTeams) {
      const teamConversations = await Promise.all(
        (userTeams || []).map(async (item: any) => {
          const team = item.team
          if (!team) return null

          const { data: lastMessage } = await supabase
            .from('messages')
            .select(`content, created_at, sender:users!messages_sender_id_fkey(id, name, avatar_url)`)
            .eq('team_id', team.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle()

          const { data: teamMembers } = await supabase
            .from('team_members')
            .select(`user:users!team_members_user_id_fkey(id, name, avatar_url, email, username, college, title)`)
            .eq('team_id', team.id)

          return {
            id: team.id,
            name: team.name,
            type: 'team',
            avatar_url: (team.leader as any)?.avatar_url || '',
            last_message: lastMessage?.content || '',
            last_message_time: lastMessage?.created_at || '',
            last_message_sender: (lastMessage?.sender as any)?.name || '',
            unread_count: 0,
            participants: (teamMembers || []).map((member: any) => ({
              id: member.user.id,
              name: member.user.name,
              avatar_url: member.user.avatar_url,
              email: member.user.email,
              username: member.user.username,
              college: member.user.college,
              title: member.user.title,
              status: 'online',
            })),
          }
        })
      )
      allConversations.push(...teamConversations.filter(Boolean))
    }

    // ---- 2. Real direct conversations (conversations + participants) ----------
    const { data: participantRows } = await supabase
      .from('conversation_participants')
      .select('conversation_id, last_read_at')
      .eq('user_id', user_id)

    const participantConvIds = Array.from(new Set(
      (participantRows || []).map((r: any) => r.conversation_id)
    ))

    const realDirect = await Promise.all(
      participantConvIds.map(async (conversationId: string) => {
        const { data: conv } = await supabase
          .from('conversations')
          .select('*')
          .eq('id', conversationId)
          .eq('type', 'direct')
          .maybeSingle()
        if (!conv) return null

        const { data: others } = await supabase
          .from('conversation_participants')
          .select(`user:users!conversation_participants_user_id_fkey(id, name, avatar_url, email, bio, title, skills, username, college, hackathon_interests)`)
          .eq('conversation_id', conversationId)
          .neq('user_id', user_id)

        const other = (others || [])[0]?.user
        if (!other) return null

        // Last message in this conversation
        const { data: lastMsg } = await supabase
          .from('messages')
          .select(`content, created_at, sender:users!messages_sender_id_fkey(id, name, avatar_url)`)
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()

        return {
          directKey: other.id,
          conversation: {
            id: conversationId,
            name: other.name || 'User',
            type: 'direct',
            avatar_url: other.avatar_url || '',
            last_message: lastMsg?.content || '',
            last_message_time: lastMsg?.created_at || conv.created_at,
            last_message_sender: (lastMsg?.sender as any)?.name || '',
            unread_count: 0,
            participants: [{
              id: other.id,
              name: other.name || 'User',
              avatar_url: other.avatar_url || '',
              email: other.email,
              bio: other.bio || '',
              title: other.title || '',
              skills: other.skills || [],
              username: other.username || '',
              college: other.college || '',
              status: 'offline',
            }],
          },
        }
      })
    )

    const realDirectMap = new Map<string, any>()
    for (const item of realDirect.filter(Boolean)) {
      realDirectMap.set((item as any).directKey, (item as any).conversation)
    }

    // ---- 3. Accepted connections become discoverable conversations -----------
    // Synthetic entries (direct-<id>). Once a real message is exchanged the
    // real conversation above replaces them.
    const { data: acceptedConnections } = await supabase
      .from('connection_requests')
      .select(`
        *,
        sender:users!connection_requests_sender_id_fkey(id, name, avatar_url, email, username, college, bio, title, skills),
        receiver:users!connection_requests_receiver_id_fkey(id, name, avatar_url, email, username, college, bio, title, skills)
      `)
      .eq('status', 'accepted')
      .or(`sender_id.eq.${user_id},receiver_id.eq.${user_id}`)

    for (const conn of acceptedConnections || []) {
      const otherUser = conn.sender_id === user_id ? conn.receiver : conn.sender
      if (!otherUser) continue
      if (realDirectMap.has(otherUser.id)) continue

      // Last message between these two users (legacy sender-based lookup)
      let lastMsg: any = null
      try {
        const { data: msgData } = await supabase
          .from('messages')
          .select(`content, created_at, sender:users!messages_sender_id_fkey(id, name, avatar_url)`)
          .or(`and(sender_id.eq.${user_id},team_id.is.null),and(sender_id.eq.${otherUser.id},team_id.is.null)`)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()
        lastMsg = msgData
      } catch {}

      allConversations.push({
        id: `direct-${otherUser.id}`,
        name: otherUser.name || 'User',
        type: 'direct',
        avatar_url: otherUser.avatar_url || '',
        last_message: lastMsg?.content || '',
        last_message_time: lastMsg?.created_at || conn.created_at,
        last_message_sender: (lastMsg?.sender as any)?.name || '',
        unread_count: 0,
        participants: [{
          id: otherUser.id,
          name: otherUser.name || 'User',
          avatar_url: otherUser.avatar_url || '',
          email: otherUser.email,
          bio: otherUser.bio || '',
          title: otherUser.title || '',
          username: otherUser.username || '',
          college: otherUser.college || '',
          status: 'offline',
        }],
      })
    }

    // Real conversations take visual precedence over synthetic connection entries.
    allConversations.push(...realDirectMap.values())

    console.log('Conversations fetched:', allConversations.length)
    return NextResponse.json(allConversations)
  } catch (err) {
    console.error('Conversations API error:', err)
    return NextResponse.json([])
  }
}

// POST /api/conversations
// Direct conversations are resolved (or created) through the get-or-create RPC
// so every user pair shares at most a single conversation.
export async function POST(request: NextRequest) {
  const supabase = createServerSupabaseClient()

  const { user, error } = await getApiSessionUser(request)
  if (!user) {
    return NextResponse.json({ error: error || 'Authentication required' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name, type, participants, team_id, hackathon_id } = body

    if (!type || !participants || participants.length === 0) {
      return NextResponse.json({ error: 'type and participants are required' }, { status: 400 })
    }

    // Team conversations are keyed by the team itself.
    if (type === 'team') {
      if (!team_id) {
        return NextResponse.json({ error: 'team_id is required for team conversations' }, { status: 400 })
      }
      return NextResponse.json({ id: team_id, name, type, team_id }, { status: 201 })
    }

    // Direct conversations: find-or-create via RPC.
    if (type === 'direct') {
      const otherId = participants[0]
      if (!otherId || otherId === user.id) {
        return NextResponse.json({ error: 'A valid other participant is required' }, { status: 400 })
      }

      const { data: conversationId, error: rpcError } = await supabase.rpc(
        'get_or_create_direct_conversation',
        { p_user_a: user.id, p_user_b: otherId }
      )

      if (rpcError || !conversationId) {
        return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 })
      }

      return NextResponse.json({ id: conversationId, name, type, created_by: user.id, participants }, { status: 201 })
    }

    return NextResponse.json({ error: 'Unsupported conversation type' }, { status: 400 })
  } catch (err) {
    console.error('Create conversation API error:', err)
    return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 })
  }
}

// PUT /api/conversations  -  mark the conversation as read for a user
export async function PUT(request: NextRequest) {
  const supabase = createServerSupabaseClient()

  const { user, error } = await getApiSessionUser(request)
  if (!user) {
    return NextResponse.json({ error: error || 'Authentication required' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const conversation_id = body?.conversation_id

    if (!conversation_id) {
      return NextResponse.json({ error: 'conversation_id is required' }, { status: 400 })
    }

    // Resolve synthetic direct ids to the real conversation.
    let realConversationId = conversation_id
    if (conversation_id.startsWith('direct-')) {
      const otherId = conversation_id.replace('direct-', '')
      const { data: resolved } = await supabase.rpc(
        'get_or_create_direct_conversation',
        { p_user_a: user.id, p_user_b: otherId }
      )
      if (resolved) realConversationId = resolved
    }

    await supabase
      .from('conversation_participants')
      .update({ last_read_at: new Date().toISOString() })
      .eq('conversation_id', realConversationId)
      .eq('user_id', user.id)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Mark as read API error:', err)
    return NextResponse.json({ success: true })
  }
}
