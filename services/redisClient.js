const Redis = require('ioredis');

let client; // Declare the client variable

const connectRedis = async () => {
  // Check if the client is not already created
        client = new Redis()
    
    return client; // Return the client for use
};

// Call the connect function to establish the connection when this module is imported
connectRedis();

// Export the client and connection function for use in other modules
module.exports = {  client };
