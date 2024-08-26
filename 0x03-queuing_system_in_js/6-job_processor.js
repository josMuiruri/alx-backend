import kue from "kue";

// create a queue
const queue = kue.createQueue();

// sendNotification function
const sendNotification = (phoneNumber, message) => {
  if (!phoneNumber || !message) {
    console.error("Missing phone number or message");
    return;
  }
  console.log(
    `Sending notification to ${phoneNumber}, with message: ${message}`
  );
};

// Process jobs in the queue named 'push_notification_code'
queue.process("push_notification_code", (job, done) => {
  const { phoneNumber, message } = job.data;
  sendNotification(phoneNumber, message);
  done();
});
