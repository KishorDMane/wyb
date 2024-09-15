const WebSocket = require('ws');

// Specify the WebSocket server URL
const SERVER_URL = 'ws://localhost:8080';

// Function to create a WebSocket connection
function createConnection() {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(SERVER_URL);

    socket.onopen = function() {
      console.log('Connection established');
      resolve(socket);
    };

    socket.onmessage = function(event) {
      const message = event.data;

      // Check if the message is a "ping"
      if (message === 'ping') {
        console.log('Received a ping from the server');
        // Optionally, you can respond to the ping
        socket.send('pong'); // Respond back with a pong
      } else {
        console.log(`Received: ${message}`);
      }
    };

    socket.onclose = function(event) {
      if (event.wasClean) {
        console.log(`Connection closed cleanly, code=${event.code} reason=${event.reason}`);
      } else {
        console.log('Connection died');
      }
    };

    socket.onerror = function(error) {
      console.log(`Connection error: ${error.message}`);
      reject(error);
    };
  });
}

// Function to send a message to the WebSocket server
function sendMessage(socket, message) {
  socket.send(message);
}

// Main function to run the WebSocket client
async function runWebSocketClient() {
  try {
    const socket = await createConnection();

    // Send a message to the server after the connection is established
    sendMessage(socket, 'Hello from WebSocket client!');

    // Optional: Set an interval to send heartbeat messages periodically
    setInterval(() => {
      sendMessage(socket, 'heartbeat');
    }, 5000); // Send a heartbeat every 5 seconds

  } catch (error) {
    console.error(`Failed to connect: ${error.message}`);
  }
}

// Start the WebSocket client
runWebSocketClient();
