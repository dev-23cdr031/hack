import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const supabase = createServerSupabaseClient()
  const { searchParams } = new URL(request.url)

  const conversation_id = searchParams.get('conversation_id')
  const user_id = searchParams.get('user_id')
  const limit = parseInt(searchParams.get('limit') || '50')

  // If conversation_id is provided, fetch messages for that conversation
  if (conversation_id) {
    try {
      // For direct conversations (format: direct-{userId}) between two users
      if (conversation_id.startsWith('direct-')) {
        const otherUserId = conversation_id.replace('direct-', '')

        // We need the current user's id to locate the shared conversation
        const currentUserId = user_id || ''

        let directConvId: string | null = null

        if (currentUserId) {
          // Find the direct conversation shared by the two users via participants
          try {
            const { data: forMe } = await supabase
              .from('conversation_participants')
              .select('conversation_id')
              .eq('user_id', currentUserId)

            const { data: forOther } = await supabase
              .from('conversation_participants')
              .select('conversation_id')
              .eq('user_id', otherUserId)

            const myIds = new Set((forMe || []).map((r: any) => r.conversation_id))
            const shared = (forOther || []).find((r: any) => myIds.has(r.conversation_id))
            directConvId = shared?.conversation_id || null
          } catch (e) {
            console.log('conversation_participants lookup failed, falling back:', e)
          }

          // Legacy fallback: a direct conversation created by either user
          if (!directConvId) {
            const { data: legacyConv } = await supabase
              .from('conversations')
              .select('id')
              .eq('type', 'direct')
              .in('created_by', [currentUserId, otherUserId])
              .limit(5)

            if (legacyConv && legacyConv.length > 0) {
              directConvId = legacyConv[0].id
            }
          }
        }

        if (directConvId) {
          try {
            const { data, error } = await supabase
              .from('messages')
              .select(`
                *,
                sender:users!messages_sender_id_fkey(id, name, avatar_url, email)
              `)
              .eq('conversation_id', directConvId)
              .order('created_at', { ascending: true })
              .limit(limit)

            if (!error && data) {
              return NextResponse.json(data)
            }
            console.error('Error fetching direct messages:', error)
          } catch (e) {
            console.log('conversation_id column may not exist, falling back to sender-based query')
          }
        }

        // Fallback: fetch messages between these two users by sender_id
        if (currentUserId && otherUserId) {
          try {
            const { data: fallbackData, error: fallbackError } = await supabase
              .from('messages')
              .select(`
                *,
                sender:users!messages_sender_id_fkey(id, name, avatar_url, email)
              `)
              .or(`and(sender_id.eq.${currentUserId},team_id.is.null),and(sender_id.eq.${otherUserId},team_id.is.null)`)
              .order('created_at', { ascending: true })
              .limit(limit)

            if (!fallbackError && fallbackData) {
              return NextResponse.json(fallbackData)
            }
          } catch {}
        }

        return NextResponse.json([])
      }

      // Team conversation - fetch by team_id
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:users!messages_sender_id_fkey(id, name, avatar_url, email)
        `)
        .eq('team_id', conversation_id)
        .order('created_at', { ascending: true })
        .limit(limit)

      if (error) {
        console.error('Error fetching team messages:', error)
        return NextResponse.json([])
      }

      return NextResponse.json(data || [])
    } catch (error) {
      console.error('Messages API error:', error)
      return NextResponse.json([])
    }
  }

  // If user_id is provided, fetch all messages sent by that user
  if (user_id) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:users!messages_sender_id_fkey(id, name, avatar_url, email)
        `)
        .eq('sender_id', user_id)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching user messages:', error)
        return NextResponse.json([])
      }

      return NextResponse.json(data || [])
    } catch (error) {
      console.error('Messages API error:', error)
      return NextResponse.json([])
    }
  }

  return NextResponse.json([])
}

export async function POST(request: NextRequest) {
  const supabase = createServerSupabaseClient()

  try {
    const body = await request.json()
    const { conversation_id, team_id, sender_id, content } = body

    console.log('Sending message:', { conversation_id, team_id, sender_id, content })

    if (!content || !sender_id) {
      return NextResponse.json({ error: 'content and sender_id are required' }, { status: 400 })
    }

    // For direct messages, allow messaging any registered user
    let directConversationId = null
    if (conversation_id && conversation_id.startsWith('direct-')) {
      const otherUserId = conversation_id.replace('direct-', '')

      // Find an existing direct conversation shared by both users (via participants)
      try {
        const { data: forMe } = await supabase
          .from('conversation_participants')
          .select('conversation_id')
          .eq('user_id', sender_id)

        const { data: forOther } = await supabase
          .from('conversation_participants')
          .select('conversation_id')
          .eq('user_id', otherUserId)

        const myIds = new Set((forMe || []).map((r: any) => r.conversation_id))
        const shared = (forOther || []).find((r: any) => myIds.has(r.conversation_id))
        if (shared) directConversationId = shared.conversation_id
      } catch (e) {
        console.log('conversation_participants lookup failed, falling back:', e)
      }

      // Legacy lookup: a direct conversation created by either user
      if (!directConversationId) {
        const { data: existingConv } = await supabase
          .from('conversations')
          .select('id')
          .eq('type', 'direct')
          .in('created_by', [sender_id, otherUserId])
          .limit(1)

        if (existingConv && existingConv.length > 0) {
          directConversationId = existingConv[0].id
        }
      }

      // Create a new direct conversation if none exists
      if (!directConversationId) {
        const { data: newConv, error: convError } = await supabase
          .from('conversations')
          .insert({
            type: 'direct',
            created_by: sender_id,
          })
          .select()
          .single()

        if (!convError && newConv) {
          directConversationId = newConv.id
          
          // Add both users as participants
          await supabase
            .from('conversation_participants')
            .insert([
              { conversation_id: newConv.id, user_id: sender_id },
              { conversation_id: newConv.id, user_id: otherUserId },
            ])
        }
      }
    }

    // Create the message in Supabase - try with conversation_id first
    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: directConversationId || null,
        team_id: team_id || null,
        sender_id,
        content,
        message_type: 'text',
      })
      .select()
      .single()

    if (error) {
      console.error('Full insert failed, retrying with core fields:', error.message)
      
      // If conversation_id column doesn't exist, retry without it
      const { data: coreData, error: coreError } = await supabase
        .from('messages')
        .insert({
          team_id: team_id || null,
          sender_id,
          content,
        })
        .select()
        .single()

      if (coreError) {
        console.error('Core insert also failed:', coreError.message)
        return NextResponse.json({ error: coreError.message }, { status: 500 })
      }

      return NextResponse.json(coreData, { status: 201 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Messages API error:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}