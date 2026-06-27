import type { Message } from './types'

// Extended interfaces for conversations
export interface ConversationParticipant {
  id: string
  name: string
  avatar_url?: string
  status: 'online' | 'offline' | 'away'
  role?: 'admin' | 'member'
  joined_at: string
}

export interface Conversation {
  id: string
  name: string
  type: 'direct' | 'group' | 'team' | 'hackathon'
  avatar_url?: string
  description?: string
  last_message?: string
  last_message_time?: string
  unread_count: number
  participants: ConversationParticipant[]
  created_at: string
  updated_at: string
  created_by?: string
  is_archived?: boolean
  is_muted?: boolean
}

export interface MessageData extends Message {
  conversation_id: string
  message_type: 'text' | 'image' | 'file' | 'voice' | 'system'
  sender_name: string
  sender_avatar?: string
  timestamp: string
  type?: string
  attachments?: {
    id: string
    name: string
    url: string
    size: number
    type: string
  }[]
  mentions?: string[]
  thread_id?: string
  is_edited?: boolean
  is_deleted?: boolean
}

// Mock conversations data
export const mockConversations: Conversation[] = [
  {
    id: "conv_1",
    name: "AI Innovators Team",
    type: "team",
    avatar_url: "/team-collaboration.png",
    description: "Building the future with AI",
    last_message: "Great work on the ML model! Ready for tomorrow's presentation?",
    last_message_time: "2024-02-15T14:30:00Z",
    unread_count: 3,
    participants: [
      {
        id: "user_1",
        name: "Dev Dharrshan", avatar_url: "/team/dev-dharrshan.jpg",
        status: "online",
        role: "admin",
        joined_at: "2024-02-01T00:00:00Z"
      },
      {
        id: "user_2",
        name: "Anusree", avatar_url: "/team/anusree.jpg",
        status: "online",
        role: "member",
        joined_at: "2024-02-01T00:00:00Z"
      },
      {
        id: "user_3",
        name: "Bharani", avatar_url: "/team/bharani.jpg",
        status: "away",
        role: "member",
        joined_at: "2024-02-01T00:00:00Z"
      }
    ],
    created_at: "2024-02-01T00:00:00Z",
    updated_at: "2024-02-15T14:30:00Z",
    created_by: "user_1",
    is_archived: false,
    is_muted: false
  },
  {
    id: "conv_2",
    name: "Dev Dharrshan",
      type: "direct",
      avatar_url: "/team/dev-dharrshan.jpg",
    last_message: "🚀 Just pushed the new React components! The performance improvements are incredible - 40% faster rendering!",
    last_message_time: "2024-10-05T17:45:00Z",
    unread_count: 3,
    participants: [
      {
        id: "user_7",
        name: "Dev Dharrshan", avatar_url: "/team/dev-dharrshan.jpg",
        status: "online",
        joined_at: "2024-10-01T00:00:00Z"
      }
    ],
    created_at: "2024-10-01T00:00:00Z",
    updated_at: "2024-10-05T17:45:00Z",
    is_archived: false,
    is_muted: false
  },
  {
    id: "conv_3",
    name: "Divyadharshini",
      type: "direct",
      avatar_url: "/team/divya-dharshini.jpg",
    last_message: "🎨 Finished the new dashboard mockups! The color scheme and animations look stunning. Want to review?",
    last_message_time: "2024-10-05T17:30:00Z",
    unread_count: 2,
    participants: [
      {
        id: "user_8",
        name: "Divyadharshini", avatar_url: "/team/divya-dharshini.jpg",
        status: "online",
        joined_at: "2024-10-01T00:00:00Z"
      }
    ],
    created_at: "2024-10-01T00:00:00Z",
    updated_at: "2024-10-05T17:30:00Z",
    is_archived: false,
    is_muted: false
  },
  {
    id: "conv_4",
    name: "Divakar",
      type: "direct",
      avatar_url: "/team/divakar.jpg",
    last_message: "⚡ API endpoints are live! Added JWT authentication and rate limiting. Ready for integration testing.",
    last_message_time: "2024-10-05T17:15:00Z",
    unread_count: 1,
    participants: [
      {
        id: "user_9",
        name: "Divakar", avatar_url: "/team/divakar.jpg",
        status: "away",
        joined_at: "2024-10-01T00:00:00Z"
      }
    ],
    created_at: "2024-10-01T00:00:00Z",
    updated_at: "2024-10-05T17:15:00Z",
    is_archived: false,
    is_muted: false
  },
  {
    id: "conv_5",
    name: "Anusree D",
      type: "direct",
      avatar_url: "/team/anusree.jpg",
    last_message: "🧪 Test coverage is now at 95%! All critical user flows are automated. QA pipeline is solid!",
    last_message_time: "2024-10-05T17:00:00Z",
    unread_count: 2,
    participants: [
      {
        id: "user_10",
        name: "Anusree D", avatar_url: "/team/anusree.jpg",
        status: "online",
        joined_at: "2024-10-01T00:00:00Z"
      }
    ],
    created_at: "2024-10-01T00:00:00Z",
    updated_at: "2024-10-05T17:00:00Z",
    is_archived: false,
    is_muted: false
  },
  {
    id: "conv_6",
    name: "Hemapriya",
      type: "direct",
      avatar_url: "/team/hemapriya.jpg",
    last_message: "📚 Updated all project docs with API references and deployment guides. Everything is well-documented now!",
    last_message_time: "2024-10-05T16:45:00Z",
    unread_count: 1,
    participants: [
      {
        id: "user_11",
        name: "Hemapriya", avatar_url: "/team/hemapriya.jpg",
        status: "online",
        joined_at: "2024-10-01T00:00:00Z"
      }
    ],
    created_at: "2024-10-01T00:00:00Z",
    updated_at: "2024-10-05T16:45:00Z",
    is_archived: false,
    is_muted: false
  },
  {
    id: "conv_7",
    name: "Bharani",
      type: "direct",
      avatar_url: "/team/bharani.jpg",
    last_message: "🚀 CI/CD pipeline is optimized! Auto-deployment with rollback features. Production-ready infrastructure!",
    last_message_time: "2024-10-05T16:30:00Z",
    unread_count: 1,
    participants: [
      {
        id: "user_12",
        name: "Bharani", avatar_url: "/team/bharani.jpg",
        status: "away",
        joined_at: "2024-10-01T00:00:00Z"
      }
    ],
    created_at: "2024-10-01T00:00:00Z",
    updated_at: "2024-10-05T16:30:00Z",
    is_archived: false,
    is_muted: false
  },
  {
    id: "conv_8",
    name: "Green Tech Hackathon",
    type: "hackathon",
    avatar_url: "/hackconnect-logo.png",
    description: "Sustainable technology solutions for a greener future",
    last_message: "Welcome to the Green Tech Sustainability Hack! Check out the resources.",
    last_message_time: "2024-02-15T10:00:00Z",
    unread_count: 0,
    participants: [
      {
        id: "user_team lead",
        name: "HackConnect Team",
        avatar_url: "/hackconnect-logo.png",
        status: "online",
        role: "admin",
        joined_at: "2024-02-10T00:00:00Z"
      }
    ],
    created_at: "2024-02-10T00:00:00Z",
    updated_at: "2024-02-15T10:00:00Z",
    created_by: "user_team lead",
    is_archived: false,
    is_muted: false
  }
]

// Mock messages data
export const mockMessages: { [conversationId: string]: MessageData[] } = {
  "conv_1": [
    {
      id: "msg_1",
      conversation_id: "conv_1",
      sender_id: "user_1",
      sender_name: "Dev Dharrshan",
        sender_avatar: "/team/dev-dharrshan.jpg",
      content: "Hey team! I've finished the initial model training. The accuracy is looking promising at 94%!",
      timestamp: "2024-02-15T10:00:00Z",
      created_at: "2024-02-15T10:00:00Z",
      updated_at: "2024-02-15T10:00:00Z",
      message_type: "text",
      type: "text"
    },
    {
      id: "msg_2",
      conversation_id: "conv_1",
      sender_id: "user_2",
      sender_name: "Anusree",
        sender_avatar: "/team/anusree.jpg",
      content: "That's amazing! I've been working on the data preprocessing pipeline. Should have it ready by tonight.",
      timestamp: "2024-02-15T10:15:00Z",
      created_at: "2024-02-15T10:15:00Z",
      updated_at: "2024-02-15T10:15:00Z",
      message_type: "text",
      type: "text"
    },
    {
      id: "msg_3",
      conversation_id: "conv_1",
      sender_id: "user_3",
      sender_name: "Bharani",
        sender_avatar: "/team/bharani.jpg",
      content: "Perfect timing! I've created the visualization dashboard. We can integrate everything tomorrow morning.",
      timestamp: "2024-02-15T11:30:00Z",
      created_at: "2024-02-15T11:30:00Z",
      updated_at: "2024-02-15T11:30:00Z",
      message_type: "text",
      type: "text"
    },
    {
      id: "msg_4",
      conversation_id: "conv_1",
      sender_id: "user_1",
      sender_name: "Dev Dharrshan",
        sender_avatar: "/team/dev-dharrshan.jpg",
      content: "Great work on the ML model! Ready for tomorrow's presentation?",
      timestamp: "2024-02-15T14:30:00Z",
      created_at: "2024-02-15T14:30:00Z",
      updated_at: "2024-02-15T14:30:00Z",
      message_type: "text",
      type: "text"
    }
  ],
  "conv_2": [
    {
      id: "msg_7",
      conversation_id: "conv_2",
      sender_id: "user_7",
      sender_name: "Dev Dharrshan",
        sender_avatar: "/team/dev-dharrshan.jpg",
      content: "Hey! Just finished optimizing the React components. The new hooks are working beautifully! 🚀",
      timestamp: "2024-10-05T16:30:00Z",
      created_at: "2024-10-05T16:30:00Z",
      updated_at: "2024-10-05T16:30:00Z",
      message_type: "text",
      type: "text"
    },
    {
      id: "msg_8",
      conversation_id: "conv_2",
      sender_id: "550e8400-e29b-41d4-a716-446655440000",
      sender_name: "You",
      sender_avatar: "/hackconnect-logo.png",
      content: "That's awesome! I'd love to see the performance improvements.",
      timestamp: "2024-10-05T16:45:00Z",
      created_at: "2024-10-05T16:45:00Z",
      updated_at: "2024-10-05T16:45:00Z",
      message_type: "text",
      type: "text"
    },
    {
      id: "msg_9",
      conversation_id: "conv_2",
      sender_id: "user_7",
      sender_name: "Dev Dharrshan",
        sender_avatar: "/team/dev-dharrshan.jpg",
      content: "The rendering is 40% faster now! Also added lazy loading for better UX. Want to pair program tomorrow?",
      timestamp: "2024-10-05T17:15:00Z",
      created_at: "2024-10-05T17:15:00Z",
      updated_at: "2024-10-05T17:15:00Z",
      message_type: "text",
      type: "text"
    },
    {
      id: "msg_dev_new_1",
      conversation_id: "conv_2",
      sender_id: "user_7",
      sender_name: "Dev Dharrshan",
        sender_avatar: "/team/dev-dharrshan.jpg",
      content: "🚀 Just pushed the new React components! The performance improvements are incredible - 40% faster rendering!",
      timestamp: "2024-10-05T17:45:00Z",
      created_at: "2024-10-05T17:45:00Z",
      updated_at: "2024-10-05T17:45:00Z",
      message_type: "text",
      type: "text"
    }
  ],
  "conv_3": [
    {
      id: "msg_10",
      conversation_id: "conv_3",
      sender_id: "user_8",
      sender_name: "Divyadharshini",
        sender_avatar: "/team/divya-dharshini.jpg",
      content: "Working on the new dashboard design! The color palette and animations are looking stunning 🎨",
      timestamp: "2024-10-05T16:00:00Z",
      created_at: "2024-10-05T16:00:00Z",
      updated_at: "2024-10-05T16:00:00Z",
      message_type: "text",
      type: "text"
    },
    {
      id: "msg_11",
      conversation_id: "conv_3",
      sender_id: "550e8400-e29b-41d4-a716-446655440000",
      sender_name: "You",
      sender_avatar: "/hackconnect-logo.png",
      content: "Can't wait to see it! Your designs always blow me away.",
      timestamp: "2024-10-05T16:15:00Z",
      created_at: "2024-10-05T16:15:00Z",
      updated_at: "2024-10-05T16:15:00Z",
      message_type: "text",
      type: "text"
    },
    {
      id: "msg_12",
      conversation_id: "conv_3",
      sender_id: "user_8",
      sender_name: "Divyadharshini",
        sender_avatar: "/team/divya-dharshini.jpg",
      content: "Added micro-interactions and smooth transitions. The user experience flow is perfect now!",
      timestamp: "2024-10-05T17:00:00Z",
      created_at: "2024-10-05T17:00:00Z",
      updated_at: "2024-10-05T17:00:00Z",
      message_type: "text",
      type: "text"
    },
    {
      id: "msg_divya_new_1",
      conversation_id: "conv_3",
      sender_id: "user_8",
      sender_name: "Divyadharshini",
        sender_avatar: "/team/divya-dharshini.jpg",
      content: "🎨 Finished the new dashboard mockups! The color scheme and animations look stunning. Want to review?",
      timestamp: "2024-10-05T17:30:00Z",
      created_at: "2024-10-05T17:30:00Z",
      updated_at: "2024-10-05T17:30:00Z",
      message_type: "text",
      type: "text"
    }
  ]
}

// Auto-incrementing ID counters
let nextConversationId = mockConversations.length + 1
let nextMessageId = Object.values(mockMessages).reduce((total, msgs) => total + msgs.length, 0) + 1

export function generateConversationId(): string {
  return `conv_${nextConversationId++}`
}

export function generateMessageId(): string {
  return `msg_${nextMessageId++}`
}

// Helper functions
export function addConversation(conversation: Omit<Conversation, 'id' | 'created_at' | 'updated_at'>): Conversation {
  const newConversation: Conversation = {
    ...conversation,
    id: generateConversationId(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
  
  mockConversations.push(newConversation)
  return newConversation
}

export function addMessage(message: Omit<MessageData, 'id' | 'created_at' | 'updated_at'>): MessageData {
  const newMessage: MessageData = {
    ...message,
    id: generateMessageId(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
  
  if (!mockMessages[message.conversation_id]) {
    mockMessages[message.conversation_id] = []
  }
  
  mockMessages[message.conversation_id].push(newMessage)
  
  // Update conversation's last message
  const conversation = mockConversations.find(c => c.id === message.conversation_id)
  if (conversation) {
    conversation.last_message = newMessage.content
    conversation.last_message_time = newMessage.created_at
    conversation.updated_at = newMessage.created_at
  }
  
  return newMessage
}

export function getConversationsByUser(userId: string): Conversation[] {
  return mockConversations.filter(conv => 
    conv.participants.some(p => p.id === userId) ||
    conv.created_by === userId
  )
}

export function getMessagesByConversation(conversationId: string): MessageData[] {
  return mockMessages[conversationId] || []
}

export function updateConversationReadStatus(conversationId: string, userId: string): void {
  const conversation = mockConversations.find(c => c.id === conversationId)
  if (conversation) {
    conversation.unread_count = 0
    conversation.updated_at = new Date().toISOString()
  }
}
