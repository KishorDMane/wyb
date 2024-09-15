const WebSocket = require('ws');

class HeartbeatManager {
  constructor(options = {}) {
    this.clients = new Set();
    this.minInterval = options.minInterval || 5000;
    this.maxInterval = options.maxInterval || 30000;
    this.loadThreshold = options.loadThreshold || 100;
    this.heartbeatInterval = this.minInterval;
  }

  calculateLoadFactor() {
    return Math.min(this.clients.size / this.loadThreshold, 1);
  }

  calculateHeartbeatInterval(loadFactor) {
    return this.minInterval + (this.maxInterval - this.minInterval) * loadFactor;
  }

  updateHeartbeatInterval() {
    const loadFactor = this.calculateLoadFactor();
    this.heartbeatInterval = this.calculateHeartbeatInterval(loadFactor);
    console.log(`Updated heartbeat interval to ${this.heartbeatInterval}ms for ${this.clients.size} clients`);
  }

  sendHeartbeats() {
    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.ping();
      }
    });
  }

  scheduleNextHeartbeat() {
    setTimeout(() => {
      this.sendHeartbeats();
      this.updateHeartbeatInterval();
      this.scheduleNextHeartbeat();
    }, this.heartbeatInterval);
  }

  addClient(ws) {
    this.clients.add(ws);
    console.log(`New client connected. Total clients: ${this.clients.size}`);
  }

  removeClient(ws) {
    this.clients.delete(ws);
    console.log(`Client disconnected. Total clients: ${this.clients.size}`);
  }

  start() {
    this.scheduleNextHeartbeat();
  }
}

module.exports = HeartbeatManager;