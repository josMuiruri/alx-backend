import redis from "redis";
import { promisify } from "util";

// Create a Redis client
const client = redis.createClient();

// Handle successful connection
client.on("connect", () => {
  console.log("Redis client connected to the server");
});

// Handle connection error
client.on("error", (err) => {
  console.error(`Redis client not connected to the server: ${err.message}`);
});

// Function to set a new school in redis
const setNewSchool = (schoolName, value) => {
  client.set(schoolName, value, redis.print);
};

// Promisify the get method
const getAsync = promisify(client.get).bind(client);

// Function to display the value of a school from Redis async/wait
const displaySchoolValue = async (schoolName) => {
  try {
    const result = await getAsync(schoolName);
    console.log(result);
  } catch (err) {
    console.error(err);
  }
};

// chain the functions calls
const main = async () => {
  await displaySchoolValue("Holberton");
  setNewSchool("HolbertonSanFranciso", "100");
  await displaySchoolValue("HolbertonSanFrancisco");
};
main().then(() => {
  client.quit();
});
