import redis from "redis";

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
const setNewSchool = (schoolName, value, callback) => {
  console.log(`Setting value for ${schoolName}...`);
  client.set(schoolName, value, (err, reply) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`Set operation response: ${reply}`); // will log OK
    }
    if (callback) {
      callback();
    }
  });
};

// Function to display the of school from redis
const displaySchoolValue = (schoolName, callback) => {
  console.log(`Getting value for ${schoolName}`);
  client.get(schoolName, (err, result) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`Value for ${schoolName}: ${result}`);
    }
    if (callback) {
      callback();
    }
  });
};

// chain the functions calls
displaySchoolValue("Holberton", () => {
  setNewSchool("HolbertonSanFranciso", "100", () => {
    displaySchoolValue("HolbertonSanFrancisco");
  });
});
