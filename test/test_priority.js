const WebSocket = require('ws');

// WebSocket server URL
const wsUrl = 'ws://localhost:8080';

// Function to connect a client and send a message
function sendMessage(priority, messageContent) {
  const ws = new WebSocket(wsUrl);

  ws.on('open', () => {
    console.log(`Client connected, sending ${priority} priority message.`);
    // Construct message with priority
    const message = {
      priority: priority,
      message: messageContent
    };
    
    // Send the message
    ws.send(JSON.stringify(message));
  });

  ws.on('message', (data) => {
    console.log(`Message received from server: ${data}`);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
}

// Test case 1: Send high-priority messages first
function testHighPriorityMessages() {
  console.log('Starting high-priority test...');
  sendMessage('high', 'High priority message 1');
  sendMessage('high', 'High priority message 2');
  sendMessage('high', 'High priority message 3');
}

// Test case 2: Send messages with different priorities
function testMixedPriorityMessages() {
  console.log('Starting mixed-priority test...');
  sendMessage('low', 'Low priority message');
  sendMessage('medium', 'Medium priority message');
  sendMessage('high', 'High priority message');
}

// Run the tests
setTimeout(testHighPriorityMessages, 1000);  // Delay to ensure server is up
setTimeout(testMixedPriorityMessages, 5000); // Test mixed priority messages after a delay
