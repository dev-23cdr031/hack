import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { ChatbotAI } from '@/lib/chatbot-ai';

// You would typically store this in an environment variable
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

export async function POST(request: Request) {
  try {
    const { message, userId, conversationId } = await request.json();
    
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Validate API key from request headers
    const apiKey = request.headers.get('x-api-key');
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 401 }
      );
    }

    // In a real app, you would validate the API key against your database
    // For now, we'll use a simple check
    if (apiKey !== 'hackconnect-demo-key') {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      );
    }

    // Store the message in Supabase
    const supabase = createServerSupabaseClient();
    
    // Save user message
    const { data: userMessageData, error: userMessageError } = await supabase
      .from('chat_messages')
      .insert({
        conversation_id: conversationId,
        user_id: userId,
        content: message,
        sender: 'user',
      })
      .select();

    if (userMessageError) {
      console.error('Error saving user message:', userMessageError);
      return NextResponse.json(
        { error: 'Failed to save message' },
        { status: 500 }
      );
    }

    // Generate AI response using our enhanced ChatbotAI
    let aiResponse;
    
    try {
      // Use our enhanced ChatbotAI for intelligent responses
      const chatbotResponse = await ChatbotAI.generateResponse(message);
      aiResponse = chatbotResponse.message;
      
      // If OpenAI API key is available, we could enhance further, but our AI is comprehensive
      if (OPENAI_API_KEY && Math.random() < 0.1) { // Only use OpenAI 10% of the time for variety
        try {
          const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
              model: 'gpt-3.5-turbo',
              messages: [
                {
                  role: 'system',
                  content: 'You are HackBot, an AI assistant for the HackConnect platform. You help users find teams, discover hackathons, and answer questions about the platform. Be friendly, helpful, and concise. Enhance this response if needed: ' + aiResponse
                },
                {
                  role: 'user',
                  content: message
                }
              ],
              max_tokens: 500
            })
          });

          const openaiData = await openaiResponse.json();
          if (openaiData.choices && openaiData.choices[0]) {
            aiResponse = openaiData.choices[0].message.content;
          }
        } catch (error) {
          console.error('OpenAI API error:', error);
          // Continue with our enhanced AI response
        }
      }
    } catch (error) {
      console.error('ChatbotAI error:', error);
      // Fallback to basic local response
      aiResponse = generateLocalResponse(message);
    }

    // Save AI response
    const { data: botMessageData, error: botMessageError } = await supabase
      .from('chat_messages')
      .insert({
        conversation_id: conversationId,
        user_id: null, // Bot message
        content: aiResponse,
        sender: 'bot',
      })
      .select();

    if (botMessageError) {
      console.error('Error saving bot message:', botMessageError);
      return NextResponse.json(
        { error: 'Failed to save bot response' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      userMessage: userMessageData[0],
      botMessage: botMessageData[0],
      success: true
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Fallback local response generation (basic version)
function generateLocalResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  // Team-related queries
  if (lowerMessage.includes("team") || lowerMessage.includes("join") || lowerMessage.includes("member")) {
    return "I can help you find the perfect team! You can browse available teams on our Teams page, filter by skills needed, or create your own team. Would you like me to guide you to the team formation section?";
  }

  // Hackathon-related queries
  if (lowerMessage.includes("hackathon") || lowerMessage.includes("event") || lowerMessage.includes("competition")) {
    return "Great! We have tons of exciting hackathons happening. You can explore upcoming events, filter by technology or location, and register directly. Check out our Explore page to see what's available!";
  }

  // Location queries
  if (lowerMessage.includes("where") || lowerMessage.includes("location")) {
    return "Our hackathons happen in amazing locations! We have events in KEC, Erode Tamilnadu, KEC, Erode Tamilnadu, KEC, Erode Tamilnadu, and virtual events too. Each location offers unique networking opportunities and local tech communities!";
  }

  // Date queries
  if (lowerMessage.includes("when") || lowerMessage.includes("date")) {
    return "We have hackathons happening throughout the year! Check our calendar for upcoming events. Currently, we have the AI Innovation Challenge in December and Mobile App Challenge in January!";
  }

  // Greetings
  if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
    return "Hello! Welcome to HackConnect! I'm HackBot, your AI assistant. I can help you with finding teams, discovering hackathons, learning about our platform, and much more. What would you like to know?";
  }

  // Default response
  return "That's a great question! I can help you with finding teams, discovering hackathons, understanding our features, or getting started on the platform. Try asking me about hackathon locations, dates, prizes, or how to register!";
}