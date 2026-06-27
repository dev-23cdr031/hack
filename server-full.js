const express = require('express');
const path = require('path');
const fs = require('fs');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const PORT = 8080;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the WebRTC demo
app.get('/webrtc-demo', (req, res) => {
  res.sendFile(path.join(__dirname, 'webrtc-demo.html'));
});

// Serve the messages page
app.get('/messages', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'messages.html'));
});

// Handle 404 errors
app.use((req, res, next) => {
  res.status(404).send(`
    <html>
      <head>
        <title>404 - Page Not Found</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            background-color: #f5f5f5;
            color: #333;
          }
          h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
          }
          p {
            font-size: 1.2rem;
            margin-bottom: 2rem;
          }
          a {
            color: #3498db;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <h1>404 - Page Not Found</h1>
        <p>The page you're looking for doesn't exist.</p>
        <p><a href="/">Go back to home</a></p>
      </body>
    </html>
  `);
});

// Create a simple API endpoint for signaling
app.get('/api/signaling', (req, res) => {
  const action = req.query.action;
  
  if (action === 'start' || action === 'status') {
    res.json({
      status: 'success',
      mode: 'direct-connection',
      message: 'Signaling server information'
    });
  } else {
    res.json({
      status: 'success',
      mode: 'direct-connection',
      message: 'Signaling server information'
    });
  }
});

// Create a simple API endpoint for user data
app.get('/api/user', (req, res) => {
  res.json({
    id: 'user-123',
    name: 'Demo User',
    email: 'demo@example.com',
    avatar_url: 'https://i.pravatar.cc/150?u=demo'
  });
});

// Create a simple API endpoint for conversations
app.get('/api/conversations', (req, res) => {
  res.json([
    {
      id: 'conv-1',
      name: 'Team Alpha',
      type: 'team',
      last_message: {
        text: 'Let\'s discuss the project',
        timestamp: new Date().toISOString(),
        sender_id: 'user-456'
      },
      participants: [
        {
          id: 'user-123',
          name: 'Demo User',
          avatar_url: 'https://i.pravatar.cc/150?u=demo'
        },
        {
          id: 'user-456',
          name: 'Jane Smith',
          avatar_url: 'https://i.pravatar.cc/150?u=jane'
        }
      ]
    },
    {
      id: 'conv-2',
      name: 'Project Beta',
      type: 'team',
      last_message: {
        text: 'The deadline is next week',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        sender_id: 'user-789'
      },
      participants: [
        {
          id: 'user-123',
          name: 'Demo User',
          avatar_url: 'https://i.pravatar.cc/150?u=demo'
        },
        {
          id: 'user-789',
          name: 'John Doe',
          avatar_url: 'https://i.pravatar.cc/150?u=john'
        }
      ]
    }
  ]);
});

// Create a simple API endpoint for messages
app.get('/api/conversations/:id/messages', (req, res) => {
  const conversationId = req.params.id;
  
  const messages = [];
  
  // Generate some dummy messages
  for (let i = 0; i < 10; i++) {
    const isCurrentUser = i % 2 === 0;
    
    messages.push({
      id: `msg-${conversationId}-${i}`,
      conversation_id: conversationId,
      sender_id: isCurrentUser ? 'user-123' : (conversationId === 'conv-1' ? 'user-456' : 'user-789'),
      text: `This is message #${i + 1} in conversation ${conversationId}`,
      timestamp: new Date(Date.now() - (i * 600000)).toISOString(),
      read: true
    });
  }
  
  res.json(messages);
});

// Serve the main HTML file for all other routes (SPA support)
// Express 5: avoid '*' which breaks path-to-regexp; use a middleware fallback
app.use((req, res) => {
  const indexPath = path.join(__dirname, 'public', 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.sendFile(path.join(__dirname, 'webrtc-demo.html'));
  }
});

// Create HTTP server
const server = http.createServer(app);

// Create WebSocket server for signaling
const wss = new WebSocket.Server({ server });

// Store connected clients
const clients = new Map();

wss.on('connection', (ws) => {
  console.log('New WebSocket client connected');
  
  let clientId = null;
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      console.log('Received message:', data.type);
      
      // Register client
      if (data.type === 'register') {
        clientId = data.userId;
        clients.set(clientId, ws);
        console.log(`Client registered: ${clientId}`);
        
        ws.send(JSON.stringify({
          type: 'registered',
          success: true,
          clientId: clientId
        }));
        return;
      }
      
      // Forward message to recipient
      if (data.to) {
        const recipient = clients.get(data.to);
        if (recipient && recipient.readyState === WebSocket.OPEN) {
          recipient.send(message.toString());
          console.log(`Message forwarded to ${data.to}`);
        } else {
          console.log(`Recipient ${data.to} not available`);
          
          // Send error back to sender
          ws.send(JSON.stringify({
            type: 'error',
            error: 'recipient_unavailable',
            originalMessage: data
          }));
        }
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });
  
  ws.on('close', () => {
    if (clientId) {
      clients.delete(clientId);
      console.log(`Client disconnected: ${clientId}`);
    }
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`WebSocket server running at ws://localhost:${PORT}`);
  console.log(`WebRTC demo available at http://localhost:${PORT}/webrtc-demo`);
  console.log(`Messages page available at http://localhost:${PORT}/messages`);
});