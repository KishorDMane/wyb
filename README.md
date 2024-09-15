# WebSocket Connection Management

## Goal:
To manage WebSocket connections effectively, improving performance and handling high concurrency.

## Scope:

1. **Connection Throttling and Rate Limiting**  
   - Control the rate at which clients can send messages to the server.
   - Limit the number of WebSocket connections or messages from a single client.

2. **Session Management and State Sharing**  
   - Implement a shared state mechanism across multiple WebSocket server instances.
   - Use Redis to manage session information and connection states.

3. **Optimizing Heartbeat Intervals**  
   - Implement a dynamic heartbeat mechanism that adjusts based on the server’s current load (number of connected clients).

4. **Message Priority**  
   - Implement a system to prioritize certain messages based on their priority level.

## Setup Instructions:

### 1. Install Dependencies
Ensure you have `npm` installed, then run the following command to install necessary packages:
```bash
npm install
```

### 2. Redis Setup
- Download and install Redis: [Redis Installation Guide](https://redis.io/docs/getting-started/installation/).
- Start the Redis server locally by running:
```bash
redis-server
```

### 3. Start the WebSocket Server
After Redis is running, start the WebSocket server by running:
```bash
node index.js
```

### 4. Running Test Files
There are three test files created to verify the functionality of the WebSocket connection management:
1. **`heartbeat_test.js`**  
   Tests the heartbeat interval optimization.
   
2. **`test.js`**  
   General tests for connection throttling and rate limiting.

3. **`test_priority_msg.js`**  
   Tests message prioritization.

Run each test file one by one using:
```bash
node <test_file_name>
```



For further details or issues, feel free to consult the project documentation or reach out.
