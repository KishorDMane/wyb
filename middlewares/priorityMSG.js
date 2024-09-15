class MessagePriorityQueue {
    constructor() {
      this.highPriority = [];
      this.mediumPriority = [];
      this.lowPriority = [];
    }
  
    addMessage(message) {
      switch (message.priority) {
        case 'high':
          this.highPriority.push(message);
          break;
        case 'medium':
          this.mediumPriority.push(message);
          break;
        case 'low':
          this.lowPriority.push(message);
          break;
        default:
          this.lowPriority.push(message);
      }
    }
  
    getNextMessage() {
      if (this.highPriority.length > 0) {
        return this.highPriority.shift();
      } else if (this.mediumPriority.length > 0) {
        return this.mediumPriority.shift();
      } else if (this.lowPriority.length > 0) {
        return this.lowPriority.shift();
      }
      return null;
    }
  
    get size() {
      return this.highPriority.length + this.mediumPriority.length + this.lowPriority.length;
    }
  }
  
  module.exports = MessagePriorityQueue;