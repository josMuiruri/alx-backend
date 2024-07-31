import kue from "kue";

// Create a queue
const queue = kue.createQueue();

// Define job data
const jobData = {
  phoneNumber: "",
  message: "",
};

// Create a job in the queue named push_notification_code
const job = queue.create("push_notification_code", jobData).save((err) => {
  if (!err) {
    console.log(`Notification job created: ${job.id}`);
  }
});

// Handle job completion
job.on("complete", () => {
  console.log("Notification job completed");
});

// Handle job failure
job.on("failed", () => {
  console.log("Notififation job failed");
});
