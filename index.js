const WebSocket = require('ws');
const {
    connectionThrottling,
    rateLimiting,
    decrementConnectionCount
} = require('./middlewares/reatelimitandthrotling');
const sessionMiddleware = require('./middlewares/session.middleware');
const HeartbeatManager = require('./middlewares/hartbeat');
const MessagePriorityQueue = require('./middlewares/priorityMSG'); 
// Create a WebSocket server on port 8080
const wss = new WebSocket.Server({ port: 8080 });


const heartbeatManager = new HeartbeatManager({
    minInterval: 5000,
    maxInterval: 30000,
    loadThreshold: 100
});
const messageQueue = new MessagePriorityQueue();
function processMessageQueue() {
    while (messageQueue.size > 0) {
        const message = messageQueue.getNextMessage();
        broadcastMessage(message);
    }
}
function broadcastMessage(message) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
}

// Event listener for new connections
wss.on('connection', async (ws, req) => {
    try {
        heartbeatManager.addClient(ws);

        await connectionThrottling(ws, req);
        await rateLimiting(ws, req);

        console.log('New client connected');

        // Event listener for messages from clients
        ws.on('message', async (message) => {
            try {
                console.log('Received:', message.toString('utf8'));
                ws.send(`Server received: ${message.toString('utf8')}`);
            } catch (error) {
                console.error('Rate limit exceeded:', error.message);
                ws.close(1008, 'Rate limit exceeded');
            }
        });


        ws.on('message', async (data) => {
            try {
                await rateLimiting(ws, req);
                const message = JSON.parse(data);
                messageQueue.addMessage(message);
                processMessageQueue();
            } catch (error) {
                console.error('Error processing message:', error);
                ws.close(1008, 'Rate limit exceeded');
            }
        });

        // Event listener for when a client disconnects 
        ws.on('close', () => {
            heartbeatManager.removeClient(ws);
            console.log('Client disconnected');
            const ip = req.socket.remoteAddress;
            decrementConnectionCount(ip);
        });

    } catch (error) {
        console.error('Connection error:', error.message);
        ws.close(1008, error.message);
    }
});

console.log('WebSocket server is running on ws://localhost:8080');