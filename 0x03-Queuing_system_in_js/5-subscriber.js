import redis from "redis";

// create a Redis client
const subscriber = redis.createClient();

// Handle successful connection
subscriber.on("connect", () => {
  console.log("Redis client connected to the server");
});

// Handle connection error
subscriber.on("error", (err) => {
  console.error(`Redis client not connected to the server: ${err.message}`);
});

// Subscribe to the channel
subscriber.subscribe("holberton school channel");

// Handle incoming messages
subscriber.on("message", (channel, message) => {
  console.log(`Received message: ${message}`);
  if (message === "KILL_SERVER") {
    subscriber.unsubscribe("holberton school channel");
    subscriber.quit();
  }
});
