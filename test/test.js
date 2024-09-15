const WebSocket = require('ws');

const SERVER_URL = 'ws://localhost:8080';
const NUM_CONNECTIONS = 15;
const MESSAGES_PER_CONNECTION = 70;
const MESSAGE_INTERVAL = 50; // ms

function createConnection(id) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(SERVER_URL);

    socket.onopen = function(e) {
      console.log(`Connection ${id} established`);
      resolve(socket);
    }; 

    socket.onmessage = function(event) {
      console.log(`Connection ${id} received: ${event.data}`); 
    };

    socket.onclose = function(event) {
      if (event.wasClean) {
        console.log(`Connection ${id} closed cleanly, code=${event.code} reason=${event.reason}`);
      } else {
        console.log(`Connection ${id} died`);
      } 
    }; 

    socket.onerror = function(error) {
      console.log(`Connection ${id} error: ${error.message}`);
      reject(error);
    };
  });
}

async function sendMessages(socket, id) {
  for (let i = 0; i < MESSAGES_PER_CONNECTION; i++) {
    await new Promise(resolve => setTimeout(resolve, MESSAGE_INTERVAL));
    socket.send(`Hello from connection ${id}, message ${i}`);
  }
}

async function runTest() {
  const connections = [];

  // Test connection throttling
  for (let i = 0; i < NUM_CONNECTIONS; i++) {
    try {
      const socket = await createConnection(i);
      connections.push(socket);
    } catch (error) {
      console.log(`Failed to create connection ${i}: ${error.message}`);
    }
  }

  // Test rate limiting
  await Promise.all(connections.map((socket, id) => sendMessages(socket, id)));

  // Close all connections
  connections.forEach(socket => socket.close());
}

runTest().catch(console.error);