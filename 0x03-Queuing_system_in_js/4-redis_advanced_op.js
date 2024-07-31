import redis from "redis";

// creating a Redis client
const client = redis.createClient();

// Handling successful connection
client.on("connect", () => {
  console.log("Redis client connected to the server");
});

// Handling connection error
client.on("error", (err) => {
  console.error("Redis client not connected to the server");
});

// Function to delete existing hash
// const deleteHash = (callback) => {
//   client.del("HolbertonSchools", (err, response) => {
//     if (err) {
//       console.error(err);
//     } else {
//       console.log(`Deleted HolbertonSchools hash: ${response}`);
//       callback();
//     }
//   });
// };

// Function to set hash values in Redis
const setHashValues = () => {
  client.hset("HolbertonSchools", "Portland", 50, redis.print);
  client.hset("HolbertonSchools", "Seattle", 80, redis.print);
  client.hset("HolbertonSchools", "New York", 20, redis.print);
  client.hset("HolbertonSchools", "Bogota", 20, redis.print);
  client.hset("HolbertonSchools", "Cali", 40, redis.print);
  client.hset("HolbertonSchools", "Paris", 2, redis.print);
};

// display all the object stored
const displayHashValues = () => {
  client.hgetall("HolbertonSchools", (err, result) => {
    if (err) {
      console.error(err);
    } else {
      console.log(result);
    }
    client.quit();
  });
};

// Execute the functions
setHashValues();
displayHashValues();

// // Execute the functions
// deleteHash(() => {
//   setHashValues();
//   setTimeout(displayHashValues, 100); // Adding a delay to ensure all hset operations are completed
// });
