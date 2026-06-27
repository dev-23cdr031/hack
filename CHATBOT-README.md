# Real-Time Chatbot with API Key Integration

This document provides instructions on how to use the real-time chatbot feature in the HackConnect platform.

## Features

- Real-time messaging with AI-powered responses
- API key integration for secure communication
- Conversation history persistence
- User identification and conversation tracking
- OpenAI integration (optional)
- Fallback to local response generation when OpenAI is not available

## Setup Instructions

### 1. Database Setup

Run the SQL script to create the necessary database table:

```bash
# Connect to your Supabase database and run:
psql -f scripts/07-create-chat-messages-table.sql
```

Alternatively, you can run the SQL commands directly in the Supabase SQL Editor.

### 2. Environment Configuration

Update your `.env.local` file with the following variables:

```
# OpenAI API Key for Chatbot (optional but recommended)
OPENAI_API_KEY=your-openai-api-key-here
```

If you don't provide an OpenAI API key, the chatbot will use local response generation.

### 3. API Key Management

The chatbot uses API keys for authentication. By default, it uses a demo key:

```
hackconnect-demo-key
```

In a production environment, you should implement proper API key management with:
- Key generation
- Key validation
- Key rotation
- Usage limits

## Using the Chatbot

The chatbot is available as a floating button in the bottom right corner of the application. Click on it to open the chat interface.

### Chatbot Settings

Click the settings icon in the chatbot header to:
1. Change the API key
2. Set a custom user ID
3. View the current conversation ID

### API Integration

You can integrate with the chatbot API directly:

```javascript
// Example API call
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'your-api-key-here',
  },
  body: JSON.stringify({
    message: 'Hello, chatbot!',
    userId: 'user-123',
    conversationId: 'conv-456',
  }),
});

const data = await response.json();
console.log(data.botMessage.content); // The bot's response
```

## Real-Time Capabilities

The chatbot uses Supabase's real-time capabilities to provide instant messaging:

1. Messages are stored in the `chat_messages` table
2. The client subscribes to changes in this table for the current conversation
3. When a new message is added, all connected clients receive it immediately

## Customization

### Response Generation

You can customize the bot's responses by modifying:

1. The OpenAI system prompt in `app/api/chat/route.ts`
2. The local fallback responses in the `generateLocalResponse` function

### UI Customization

The chatbot UI can be customized by editing:

1. `components/chatbot.tsx` - Main chatbot component
2. `components/chatbot-toggle.tsx` - Floating button component

## Troubleshooting

### Common Issues

1. **API Key Invalid**: Ensure you're using the correct API key (default: `hackconnect-demo-key`)
2. **Messages Not Appearing**: Check Supabase real-time configuration and ensure the `chat_messages` table is added to the publication
3. **OpenAI Not Working**: Verify your OpenAI API key is valid and has sufficient credits

### Debugging

Enable console logging for debugging:

```javascript
// In chat-service.ts
console.log('Sending message:', content);
console.log('Received response:', data);
```

## Security Considerations

1. API keys should be kept secure and not exposed in client-side code
2. Implement rate limiting to prevent abuse
3. Sanitize user input to prevent injection attacks
4. Use HTTPS for all API communications
5. Implement proper authentication and authorization

## Future Enhancements

- Message encryption for sensitive conversations
- Typing indicators when the bot is generating a response
- File and image sharing capabilities
- Voice input and output options
- Multi-language support
- Analytics and conversation insights