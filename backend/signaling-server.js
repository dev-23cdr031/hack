// Simple WebSocket Signaling Server for WebRTC
// Run this with: node signaling-server.js

const WebSocket = require('ws');
const http = require('http');

const PORT = 3006;

// Create HTTP server
const server = http.createServer();

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// Store connected clients
const clients = new Map();
const calls = new Map();

console.log(`🚀 WebRTC Signaling Server starting on port ${PORT}...`);

wss.on('connection', (ws, req) => {
  console.log('📞 New client connected');
  
  let clientId = null;

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      console.log('📨 Received message:', data.type, 'from:', data.from, 'to:', data.to);

      // Register client
      if (data.type === 'register') {
        clientId = data.userId;
        clients.set(clientId, ws);
        console.log(`✅ Client registered: ${clientId}`);
        
        ws.send(JSON.stringify({
          type: 'registered',
          success: true,
          clientId: clientId
        }));
        return;
      }

      // Handle signaling messages
      switch (data.type) {
        case 'call-request':
          handleCallRequest(data);
          break;
        
        case 'call-accept':
          handleCallAccept(data);
          break;
        
        case 'call-reject':
          handleCallReject(data);
          break;
        
        case 'call-end':
          handleCallEnd(data);
          break;
        
        case 'offer':
        case 'answer':
        case 'ice-candidate':
          forwardSignalingMessage(data);
          break;
        
        default:
          console.log('❓ Unknown message type:', data.type);
      }
    } catch (error) {
      console.error('❌ Error processing message:', error);
    }
  });

  ws.on('close', () => {
    if (clientId) {
      clients.delete(clientId);
      console.log(`👋 Client disconnected: ${clientId}`);
      
      // End any active calls for this client
      for (const [callId, call] of calls.entries()) {
        if (call.caller === clientId || call.receiver === clientId) {
          endCall(callId, 'participant_disconnected');
        }
      }
    }
  });

  ws.on('error', (error) => {
    console.error('❌ WebSocket error:', error);
  });
});

function handleCallRequest(data) {
  const { from, to, callId } = data;
  
  console.log(`📞 Call request: ${from} -> ${to} (${callId})`);
  
  // Store call information
  calls.set(callId, {
    caller: from,
    receiver: to,
    status: 'ringing',
    startTime: Date.now()
  });

  // Forward to receiver
  const receiverWs = clients.get(to);
  if (receiverWs && receiverWs.readyState === WebSocket.OPEN) {
    receiverWs.send(JSON.stringify({
      type: 'incoming-call',
      from: from,
      callId: callId,
      data: data.data
    }));
    console.log(`✅ Call request forwarded to ${to}`);
  } else {
    // Receiver not available
    const callerWs = clients.get(from);
    if (callerWs && callerWs.readyState === WebSocket.OPEN) {
      callerWs.send(JSON.stringify({
        type: 'call-failed',
        reason: 'user_unavailable',
        callId: callId
      }));
    }
    calls.delete(callId);
    console.log(`❌ Receiver ${to} not available`);
  }
}

function handleCallAccept(data) {
  const { from, to, callId } = data;
  
  console.log(`✅ Call accepted: ${callId}`);
  
  const call = calls.get(callId);
  if (call) {
    call.status = 'connected';
    call.connectTime = Date.now();
  }

  // Notify caller that call was accepted
  const callerWs = clients.get(to); // 'to' is the original caller
  if (callerWs && callerWs.readyState === WebSocket.OPEN) {
    callerWs.send(JSON.stringify({
      type: 'call-accepted',
      from: from,
      callId: callId,
      data: data.data
    }));
  }
}

function handleCallReject(data) {
  const { from, to, callId } = data;
  
  console.log(`❌ Call rejected: ${callId}`);
  
  // Notify caller that call was rejected
  const callerWs = clients.get(to);
  if (callerWs && callerWs.readyState === WebSocket.OPEN) {
    callerWs.send(JSON.stringify({
      type: 'call-rejected',
      from: from,
      callId: callId
    }));
  }

  calls.delete(callId);
}

function handleCallEnd(data) {
  const { callId } = data;
  endCall(callId, 'ended_by_user');
}

function endCall(callId, reason = 'ended') {
  const call = calls.get(callId);
  if (!call) return;

  console.log(`📴 Call ended: ${callId} (${reason})`);

  // Notify both participants
  const callerWs = clients.get(call.caller);
  const receiverWs = clients.get(call.receiver);

  const endMessage = {
    type: 'call-ended',
    callId: callId,
    reason: reason,
    duration: call.connectTime ? Date.now() - call.connectTime : 0
  };

  if (callerWs && callerWs.readyState === WebSocket.OPEN) {
    callerWs.send(JSON.stringify(endMessage));
  }

  if (receiverWs && receiverWs.readyState === WebSocket.OPEN) {
    receiverWs.send(JSON.stringify(endMessage));
  }

  calls.delete(callId);
}

function forwardSignalingMessage(data) {
  const { to } = data;
  
  const targetWs = clients.get(to);
  if (targetWs && targetWs.readyState === WebSocket.OPEN) {
    targetWs.send(JSON.stringify(data));
    console.log(`📡 Forwarded ${data.type} to ${to}`);
  } else {
    console.log(`❌ Cannot forward ${data.type} to ${to} - not connected`);
  }
}

// Start server
server.listen(PORT, () => {
  console.log(`✅ WebRTC Signaling Server running on port ${PORT}`);
  console.log(`📡 WebSocket endpoint: ws://localhost:${PORT}`);
  console.log('🔗 Clients can connect and start making calls!');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down signaling server...');
  
  // Close all client connections
  clients.forEach((ws, clientId) => {
    ws.close();
  });
  
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

// Log server stats every 30 seconds
setInterval(() => {
  console.log(`📊 Server stats: ${clients.size} clients, ${calls.size} active calls`);
}, 30000);
