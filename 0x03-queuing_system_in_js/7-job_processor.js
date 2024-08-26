import kue from "kue";
// Blacklisted phone numbers
const blacklistedPhonNumbers = ["4153518780", "4153518781"];

// sendNotification function
const sendNotification = (phoneNumber, message, job, done) => {
  job.progress(0, 100);

  if (blacklistedPhonNumbers.includes(phoneNumber)) {
    return done(
      new Error(`Phone number ${phoneNumber} is blacklisted
        `)
    );
  }

  job.progress(50, 100);
  console.log(
    `Sending notification to ${phoneNumber}, with message: ${message}`
  );
  done();
};

// Create a queue
const queue = kue.createQueue();

// Process jobs in the queue 'push_notification_code_2' with concurrency of 2
queue.process("push_notification_code_2", 2, (job, done) => {
  const { phoneNumber, message } = job.data;
  sendNotification(phoneNumber, message, job, done);
});
