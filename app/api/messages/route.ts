import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { 
  mockMessages, 
  getMessagesByConversation, 
  addMessage 
} from '@/lib/mock-conversations'

export async function GET(request: NextRequest) {
  const supabase = createServerSupabaseClient()
  const { searchParams } = new URL(request.url)

  const conversation_id = searchParams.get('conversation_id')
  const user_id = searchParams.get('user_id')
  const limit = parseInt(searchParams.get('limit') || '50')

  console.log('Messages API called with:', { conversation_id, user_id, limit })

  // Demo messages data for fallback
  const demoMessages: { [key: string]: any[] } = {
    "1": [
      {
        id: "1",
        sender_id: "1",
        content: "Hey team! I've finished the initial model training. The accuracy is looking promising at 94%!",
        created_at: "2024-02-15T10:00:00Z",
        message_type: "text",
        sender: { id: "1", name: "Dev Dharrshan", avatar_url: "/placeholder.svg?height=32&width=32" }
      },
      {
        id: "2",
        sender_id: "2",
        content: "That's amazing! I've been working on the data preprocessing pipeline. Should have it ready by tonight.",
        created_at: "2024-02-15T10:15:00Z",
        message_type: "text",
        sender: { id: "2", name: "Anusree", avatar_url: "/placeholder.svg?height=32&width=32" }
      },
      {
        id: "3",
        sender_id: "3",
        content: "Perfect timing! I've created the visualization dashboard. We can integrate everything tomorrow morning.",
        created_at: "2024-02-15T11:30:00Z",
        message_type: "text",
        sender: { id: "3", name: "Bharani", avatar_url: "/placeholder.svg?height=32&width=32" }
      },
      {
        id: "4",
        sender_id: "1",
        content: "Great work on the ML model! Ready for tomorrow's presentation?",
        created_at: "2024-02-15T14:30:00Z",
        message_type: "text",
        sender: { id: "1", name: "Dev Dharrshan", avatar_url: "/placeholder.svg?height=32&width=32" }
      }
    ],
    "2": [
      {
        id: "5",
        sender_id: "4",
        content: "Hey! I saw your profile and noticed you have great blockchain experience. Want to collaborate on the upcoming blockchain hackathon?",
        created_at: "2024-02-15T12:00:00Z",
        message_type: "text",
        sender: { id: "4", name: "Divyadharshini", avatar_url: "/placeholder.svg?height=32&width=32" }
      },
      {
        id: "6",
        sender_id: "4",
        content: "Hey! Want to collaborate on the blockchain hackathon?",
        created_at: "2024-02-15T12:15:00Z",
        message_type: "text",
        sender: { id: "4", name: "Divyadharshini", avatar_url: "/placeholder.svg?height=32&width=32" }
      }
    ]
  }

  // If conversation_id is provided, fetch messages for that conversation
  if (conversation_id) {
    try {
      console.log('Fetching messages for conversation:', conversation_id)
      
      // Add a small delay to simulate network latency
      await new Promise(resolve => setTimeout(resolve, 100))

      // Try to get messages from Supabase first
      try {
        const { data, error } = await supabase
          .from('messages')
          .select(`
            *,
            sender:users(
              id,
              name,
              avatar_url,
              email
            )
          `)
          .eq('team_id', conversation_id) // Using team_id since we're treating teams as conversations
          .order('created_at', { ascending: true })
          .limit(limit)

        if (error) {
          throw error
        }

        console.log('Messages fetched from Supabase:', data?.length || 0)

        // If we have messages from Supabase, return them
        if (data && data.length > 0) {
          return NextResponse.json(data)
        }
      } catch (supabaseError) {
        console.error('Supabase error:', supabaseError)
      }

      // Fallback to mock data
      console.log('Using mock messages as fallback')
      const messages = getMessagesByConversation(conversation_id)
      
      if (messages.length > 0) {
        return NextResponse.json(messages)
      }

      // If conversation not found in mock data, return demo messages for backwards compatibility
      return NextResponse.json(demoMessages[conversation_id] || [])
    } catch (error) {
      console.error('Messages API error:', error)
      console.log('Error occurred, returning mock messages as fallback')
      return NextResponse.json(getMessagesByConversation(conversation_id))
    }
  }

  // If user_id is provided, fetch all conversations for that user
  if (user_id) {
    try {
      const { data, error } = await supabase
        .from('conversation_participants')
        .select(`
          conversation_id,
          last_read_at,
          conversation:conversations(
            id,
            name,
            type,
            created_at,
            updated_at,
            team:teams(
              id,
              name,
              leader:users(name, avatar_url)
            ),
            hackathon:hackathons(
              id,
              title
            ),
            participants:conversation_participants(
              user:users(
                id,
                name,
                avatar_url,
                email
              )
            )
          )
        `)
        .eq('user_id', user_id)
        .order('last_read_at', { ascending: false })

      if (error) {
        console.error('Error fetching conversations:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      // Get last message for each conversation
      const conversationsWithLastMessage = await Promise.all(
        (data || []).map(async (item: any) => {
          const conversation = item.conversation

          // Get last message
          const { data: lastMessage } = await supabase
            .from('messages')
            .select(`
              content,
              created_at,
              sender:users(name)
            `)
            .eq('conversation_id', conversation.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single()

          // Get unread count
          const { count: unreadCount } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conversation.id)
            .gt('created_at', item.last_read_at || '1970-01-01')

          return {
            ...conversation,
            last_message: lastMessage?.content || '',
            last_message_time: lastMessage?.created_at || conversation.created_at,
            last_message_sender: (lastMessage?.sender as any)?.name || '',
            unread_count: unreadCount || 0
          }
        })
      )

      console.log('Conversations fetched:', conversationsWithLastMessage.length)
      return NextResponse.json(conversationsWithLastMessage)
    } catch (error) {
      console.error('Conversations API error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch conversations' },
        { status: 500 }
      )
    }
  }

  return NextResponse.json({ error: 'conversation_id or user_id is required' }, { status: 400 })
}

export async function POST(request: NextRequest) {
  const supabase = createServerSupabaseClient()

  try {
    const payload = await request.json()
    const { conversation_id, sender_id, content, message_type = 'text' } = payload

    console.log('Sending message:', { conversation_id, sender_id, content: content?.substring(0, 50) + '...' })

    if (!conversation_id || !sender_id || !content) {
      return NextResponse.json({
        error: 'conversation_id, sender_id, and content are required'
      }, { status: 400 })
    }

    // Add a small delay to simulate network latency
    await new Promise(resolve => setTimeout(resolve, 100))

    // Try to insert message to Supabase first
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([{
          team_id: conversation_id, // Using team_id since we're treating teams as conversations
          sender_id,
          content,
          message_type
        }])
        .select(`
          *,
          sender:users(
            id,
            name,
            avatar_url,
            email
          )
        `)
        .single()

      if (error) {
        throw error
      }

      console.log('Message sent to Supabase successfully:', data.id)
      return NextResponse.json(data, { status: 201 })
    } catch (supabaseError) {
      console.error('Supabase error:', supabaseError)
    }

    // Fallback to mock data system
    console.log('Using mock data system for message creation')
    
    // Get current user name from sender_id (simplified for demo)
    const senderName = sender_id === '550e8400-e29b-41d4-a716-446655440000' ? 'You' : `User ${sender_id.substring(0, 4)}`
    
    const newMessage = addMessage({
      conversation_id,
      sender_id,
      sender_name: senderName,
      sender_avatar: '/placeholder.svg?height=32&width=32',
      content,
      timestamp: new Date().toISOString(),
      message_type,
      type: message_type
    })

    // Transform to match expected API response format
    const apiResponse = {
      id: newMessage.id,
      team_id: conversation_id,
      sender_id: newMessage.sender_id,
      content: newMessage.content,
      message_type: newMessage.message_type,
      created_at: newMessage.created_at,
      sender: {
        id: newMessage.sender_id,
        name: newMessage.sender_name,
        avatar_url: newMessage.sender_avatar,
        email: `${senderName.toLowerCase().replace(' ', '')}@hackconnect.com`
      }
    }

    console.log('Message created in mock system:', apiResponse.id)
    return NextResponse.json(apiResponse, { status: 201 })
  } catch (error) {
    console.error('Send message API error:', error)
    
    // Final fallback - create a basic mock message
    const mockMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      team_id: 'fallback-conv',
      sender_id: 'fallback-user',
      content: 'Message sent (fallback)',
      message_type: 'text',
      created_at: new Date().toISOString(),
      sender: {
        id: 'fallback-user',
        name: 'You',
        avatar_url: '/placeholder.svg?height=32&width=32',
        email: 'you@hackconnect.com'
      }
    }

    return NextResponse.json(mockMessage, { status: 201 })
  }
}
