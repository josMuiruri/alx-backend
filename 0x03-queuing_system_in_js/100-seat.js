const express = require('express');
const redis = require('redis');
const Kue = require('kue');
const bluebird = require('bluebird');

const app = express();
const port = 1245;

// Promisify Redis
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

// Connect to Redis
const redisClient = redis.createClient();

// Initialize Kue
const queue = Kue.createQueue();

// Initialize reservationEnabled
let reservationEnabled = true;

// Initialize the number of available seats
const INITIAL_SEATS = 50;
redisClient.set('available_seats', INITIAL_SEATS);

// Function to set the number of available seats
async function reserveSeat(number) {
  await redisClient.setAsync('available_seats', number);
}

// Function to get the current number of available seats
async function getCurrentAvailableSeats() {
  const seats = await redisClient.getAsync('available_seats');
  return parseInt(seats, 10);
}

// Route to get the number of available seats
app.get('/available_seats', async (req, res) => {
  const numberOfAvailableSeats = await getCurrentAvailableSeats();
  res.json({ numberOfAvailableSeats: numberOfAvailableSeats.toString() });
});

// Route to reserve a seat
app.get('/reserve_seat', async (req, res) => {
  if (!reservationEnabled) {
    return res.json({ status: 'Reservations are blocked' });
  }
  
  const job = queue.create('reserve_seat', {}).save((err) => {
    if (err) {
      return res.json({ status: 'Reservation failed' });
    }
    res.json({ status: 'Reservation in process' });
  });
  
  job.on('complete', () => {
    console.log(`Seat reservation job ${job.id} completed`);
  }).on('failed', (error) => {
    console.log(`Seat reservation job ${job.id} failed: ${error.message}`);
  });
});

// Route to process the queue
app.get('/process', async (req, res) => {
  res.json({ status: 'Queue processing' });
  
  queue.process('reserve_seat', async (job, done) => {
    try {
      const currentSeats = await getCurrentAvailableSeats();
      if (currentSeats <= 0) {
        reservationEnabled = false;
        return done(new Error('Not enough seats available'));
      }
      await reserveSeat(currentSeats - 1);
      done();
    } catch (error) {
      done(error);
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
