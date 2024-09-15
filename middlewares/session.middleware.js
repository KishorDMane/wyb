// src/middleware/sessionMiddleware.js

const client = require('../services/redisClient');

// Middleware for session management
const sessionMiddleware = (ws, req, next) => {
    const clientIp = req.socket.remoteAddress;

    // Check if session exists
    client.get(clientIp, (err, session) => {
        if (err) {
            console.error('Error fetching session:', err);
            ws.close(); // Close the connection on error
            return;
        }

        if (!session) {
            // If no session, create a new one
            const newSession = {
                connected: true,
                timestamp: Date.now(),
            };

            client.set(clientIp, JSON.stringify(newSession), 'EX', 3600); // Expires in 1 hour
            console.log('New session created');
        } else {
            // Update the existing session
            const sessionData = JSON.parse(session);
            sessionData.timestamp = Date.now();
            client.set(clientIp, JSON.stringify(sessionData), 'EX', 3600);
        }

        next(); // Call the next middleware or the WebSocket connection handler
    });
};

module.exports = sessionMiddleware;
