const { RateLimiterMemory } = require('rate-limiter-flexible');

const MAX_CONNECTIONS_PER_IP = 5;
const MAX_MESSAGES_PER_MINUTE = 60;

const connectionsPerIP = new Map();

const rateLimiter = new RateLimiterMemory({
  points: MAX_MESSAGES_PER_MINUTE,
  duration: 60,
});

async function connectionThrottling(ws, req) {
  const ip = req.socket.remoteAddress;
  const connections = connectionsPerIP.get(ip) || 0;

  if (connections >= MAX_CONNECTIONS_PER_IP) {
    throw new Error('Too many connections from this IP');
  }

  connectionsPerIP.set(ip, connections + 1);
}

async function rateLimiting(ws, req) {
  const ip = req.socket.remoteAddress;
  await rateLimiter.consume(ip);
}

function decrementConnectionCount(ip) {
  const connections = connectionsPerIP.get(ip) || 0;
  if (connections > 0) {
    connectionsPerIP.set(ip, connections - 1);
  }
}

module.exports = {
  connectionThrottling,
  rateLimiting,
  decrementConnectionCount
};