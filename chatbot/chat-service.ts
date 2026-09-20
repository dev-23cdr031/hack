import { supabase } from '@/lib/supabase';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  conversation_id?: string;
  user_id?: string | null;
}

export interface ChatOptions {
  apiKey?: string;
  userId?: string;
  conversationId?: string;
}

class ChatService {
  private apiKey: string;
  private userId: string;
  private conversationId: string;
  private messageListeners: ((message: Message) => void)[] = [];

  constructor(options: ChatOptions = {}) {
    this.apiKey = options.apiKey || 'hackconnect-demo-key';
    this.userId = options.userId || 'anonymous-user';
    this.conversationId = options.conversationId || `conv-${Date.now()}`;
    
    // Initialize real-time subscription
    this.initializeRealtimeSubscription();
  }

  private initializeRealtimeSubscription() {
    // Try to subscribe to real-time updates, but don't fail if unavailable
    try {
      supabase
        .channel('chat_messages')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'chat_messages',
            filter: `conversation_id=eq.${this.conversationId}`,
          },
          (payload) => {
            const newMessage = this.transformMessage(payload.new);
            this.notifyListeners(newMessage);
          }
        )
        .subscribe();
    } catch (error) {
      console.log('Real-time subscription unavailable, using demo mode:', error);
    }
  }

  private transformMessage(dbMessage: any): Message {
    return {
      id: dbMessage.id,
      content: dbMessage.content,
      sender: dbMessage.sender,
      timestamp: new Date(dbMessage.created_at || dbMessage.timestamp),
      conversation_id: dbMessage.conversation_id,
      user_id: dbMessage.user_id,
    };
  }

  private notifyListeners(message: Message) {
    this.messageListeners.forEach(listener => listener(message));
  }

  public async sendMessage(content: string): Promise<Message | null> {
    try {
      // Create user message immediately for instant feedback
      const userMessage: Message = {
        id: Date.now().toString(),
        content: content,
        sender: 'user',
        timestamp: new Date(),
        conversation_id: this.conversationId,
        user_id: this.userId
      };

      // Try to send to API, but work in demo mode if it fails
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.apiKey,
          },
          body: JSON.stringify({
            message: content,
            userId: this.userId,
            conversationId: this.conversationId,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          // Simulate bot response after a delay
          setTimeout(() => {
            if (data.botMessage) {
              const botMessage = this.transformMessage(data.botMessage);
              this.notifyListeners(botMessage);
            }
          }, 1000);
          return userMessage;
        }
      } catch (apiError) {
        console.log('API unavailable, using demo mode:', apiError);
      }

      // Demo mode - generate response locally
      const { ChatbotAI } = await import('@/chatbot/chatbot-ai');
      const chatbotResponse = await ChatbotAI.generateResponse(content);
      
      // Simulate bot response after a delay
      setTimeout(() => {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: chatbotResponse.message,
          sender: 'bot',
          timestamp: new Date(),
          conversation_id: this.conversationId,
          user_id: null
        };
        this.notifyListeners(botMessage);
      }, 1000);

      return userMessage;
    } catch (error) {
      console.error('Failed to send message:', error);
      return null;
    }
  }

  public async getConversationHistory(): Promise<Message[]> {
    try {
      // Try to fetch from database first
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', this.conversationId)
        .order('created_at', { ascending: true });

      if (!error && data) {
        return data.map(this.transformMessage);
      }
    } catch (error) {
      console.log('Database unavailable, using demo mode:', error);
    }
    
    // Return empty array for new conversations in demo mode
    return [];
  }

  public onNewMessage(callback: (message: Message) => void) {
    this.messageListeners.push(callback);
    return () => {
      this.messageListeners = this.messageListeners.filter(listener => listener !== callback);
    };
  }

  public setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  public setUserId(userId: string) {
    this.userId = userId;
  }

  public getConversationId(): string {
    return this.conversationId;
  }
}

// Singleton instance
let chatServiceInstance: ChatService | null = null;

export function getChatService(options?: ChatOptions): ChatService {
  if (!chatServiceInstance) {
    chatServiceInstance = new ChatService(options);
  } else if (options) {
    // Update existing instance with new options
    if (options.apiKey) chatServiceInstance.setApiKey(options.apiKey);
    if (options.userId) chatServiceInstance.setUserId(options.userId);
  }
  
  return chatServiceInstance;
}