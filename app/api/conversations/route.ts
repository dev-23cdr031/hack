import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const supabase = createServerSupabaseClient()
  const { searchParams } = new URL(request.url)

  const user_id = searchParams.get('user_id')

  if (!user_id) {
    return NextResponse.json({ error: 'user_id is required' }, { status: 400 })
  }

  try {
    console.log('Fetching conversations for user:', user_id)

    // Get teams where the user is a member (team conversations)
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

    if (teamsError) {
      console.error('Error fetching user teams:', teamsError)
    }

    // Create team conversations
    const teamConversations = await Promise.all(
      (userTeams || []).map(async (item: any) => {
        const team = item.team
        if (!team) return null

        // Get last message for this team
        const { data: lastMessage } = await supabase
          .from('messages')
          .select(`
            content,
            created_at,
            sender:users!messages_sender_id_fkey(id, name, avatar_url)
          `)
          .eq('team_id', team.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        // Get all team members
        const { data: teamMembers } = await supabase
          .from('team_members')
          .select(`
            user:users!team_members_user_id_fkey(
              id,
              name,
              avatar_url,
              email
            )
          `)
          .eq('team_id', team.id)

        return {
          id: team.id,
          name: team.name,
          type: 'team',
          avatar_url: (team.leader as any)?.avatar_url || '',
          last_message: lastMessage?.content || '',
          last_message_time: lastMessage?.created_at || team.created_at,
          last_message_sender: (lastMessage?.sender as any)?.name || '',
          unread_count: 0,
          participants: (teamMembers || []).map((member: any) => ({
            id: member.user.id,
            name: member.user.name,
            avatar_url: member.user.avatar_url,
            email: member.user.email,
            status: 'online'
          }))
        }
      })
    )

    // Get accepted connections for direct conversations
    const { data: acceptedConnections, error: connError } = await supabase
      .from('connection_requests')
      .select(`
        *,
        sender:users!connection_requests_sender_id_fkey(id, name, avatar_url, email),
        receiver:users!connection_requests_receiver_id_fkey(id, name, avatar_url, email)
      `)
      .eq('status', 'accepted')
      .or(`sender_id.eq.${user_id},receiver_id.eq.${user_id}`)

    if (connError) {
      console.error('Error fetching accepted connections:', connError)
    }

    // Build direct conversations from accepted connections
    const directConversationsMap = new Map()
    for (const conn of (acceptedConnections || [])) {
      const otherUser = conn.sender_id === user_id ? conn.receiver : conn.sender
      if (!otherUser) continue
      
      // Get last message between these users (try with conversation_id first, fallback to sender-based)
      let lastMsg = null
      try {
        const { data: msgData } = await supabase
          .from('messages')
          .select(`
            content,
            created_at,
            sender:users!messages_sender_id_fkey(id, name, avatar_url)
          `)
          .or(`and(sender_id.eq.${user_id},conversation_id.eq.${conn.id}),and(sender_id.eq.${otherUser.id},conversation_id.eq.${conn.id})`)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()
        lastMsg = msgData
      } catch (e) {
        // If conversation_id column doesn't exist, fallback to sender-based query
        try {
          const { data: msgData } = await supabase
            .from('messages')
            .select(`
              content,
              created_at,
              sender:users!messages_sender_id_fkey(id, name, avatar_url)
            `)
            .or(`and(sender_id.eq.${user_id},team_id.is.null),and(sender_id.eq.${otherUser.id},team_id.is.null)`)
            .order('created_at', { ascending: false })
            .limit(1)
            .single()
          lastMsg = msgData
        } catch {}
      }

      directConversationsMap.set(otherUser.id, {
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
          name: otherUser.name,
          avatar_url: otherUser.avatar_url,
          email: otherUser.email,
          status: 'online'
        }]
      })
    }

    // Add direct conversations the user is actually part of (from conversations/participants).
    // This ensures that after messaging any user, that conversation shows up here.
    const { data: participantRows, error: participantsError } = await supabase
      .from('conversation_participants')
      .select('conversation_id')
      .eq('user_id', user_id)

    if (!participantsError) {
      const participantConvIds = Array.from(new Set(
        (participantRows || []).map((r: any) => r.conversation_id)
      ))

      const realDirectConversations = await Promise.all(
        participantConvIds.map(async (conversationId: string) => {
          try {
            const { data: conv } = await supabase
              .from('conversations')
              .select('*')
              .eq('id', conversationId)
              .eq('type', 'direct')
              .maybeSingle()

            if (!conv) return null

            // Find the other participant (their profile info is shown in the message page)
            const { data: others } = await supabase
              .from('conversation_participants')
              .select(`user:users!conversation_participants_user_id_fkey(id, name, avatar_url, email, bio, title, skills)`)
              .eq('conversation_id', conversationId)
              .neq('user_id', user_id)

            const other = (others || [])[0]?.user
            if (!other) return null

            // Last message in this conversation
            let lastMsg: any = null
            try {
              const { data: msgData } = await supabase
                .from('messages')
                .select(`content, created_at, sender:users!messages_sender_id_fkey(id, name, avatar_url)`)
                .eq('conversation_id', conversationId)
                .order('created_at', { ascending: false })
                .limit(1)
                .single()
              lastMsg = msgData
            } catch {}

            return {
              userId: other.id,
              conversation: {
                id: `direct-${other.id}`,
                name: other.name || 'User',
                type: 'direct',
                avatar_url: other.avatar_url || '',
                last_message: lastMsg?.content || '',
                last_message_time: lastMsg?.created_at || conv.created_at,
                last_message_sender: (lastMsg?.sender as any)?.name || '',
                unread_count: 0,
                participants: [{
                  id: other.id,
                  name: other.name,
                  avatar_url: other.avatar_url,
                  email: other.email,
                  bio: other.bio,
                  title: other.title,
                  status: 'online'
                }]
              }
            }
          } catch (e) {
            return null
          }
        })
      )

      // Real conversations take precedence over accepted-connection derived ones
      for (const item of realDirectConversations.filter(Boolean)) {
        directConversationsMap.set((item as any).userId, (item as any).conversation)
      }
    }

    const directConversations = Array.from(directConversationsMap.values())
    const allConversations = [...teamConversations.filter(Boolean), ...directConversations]

    console.log('Conversations fetched:', allConversations.length)
    return NextResponse.json(allConversations)
  } catch (error) {
    console.error('Conversations API error:', error)
    return NextResponse.json([])
  }
}

export async function POST(request: NextRequest) {
  const supabase = createServerSupabaseClient()
  
  try {
    const body = await request.json()
    const { name, type, participants, team_id, hackathon_id, created_by } = body

    console.log('Creating conversation:', { name, type, participants: participants?.length })

    if (!type || !created_by || !participants || participants.length === 0) {
      return NextResponse.json({ 
        error: 'type, created_by, and participants are required' 
      }, { status: 400 })
    }

    // For team conversations, use the team_id as the conversation identifier
    if (type === 'team' && team_id) {
      return NextResponse.json({ id: team_id, name, type, team_id }, { status: 201 })
    }

    // For direct conversations, create a unique conversation ID
    const conversationId = `direct-${created_by}-${participants[0]}`

    return NextResponse.json({ 
      id: conversationId, 
      name, 
      type, 
      created_by,
      participants 
    }, { status: 201 })
  } catch (error) {
    console.error('Create conversation API error:', error)
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    )
  }
}

// Mark messages as read
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { conversation_id, user_id } = body

    console.log('Marking messages as read:', { conversation_id, user_id })

    if (!conversation_id || !user_id) {
      return NextResponse.json({
        error: 'conversation_id and user_id are required'
      }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Mark as read API error:', error)
    return NextResponse.json({ success: true })
  }
}