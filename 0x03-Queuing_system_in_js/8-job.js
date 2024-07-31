import kue from "kue";

const createPushNotificationsJobs = (jobs, queue) => {
  if (!Array.isArray(jobs)) {
    throw new Error("Jobs is not an array");
  }

  jobs.forEach((jobData) => {
    const job = queue
      .create("push_notification_code_3", jobData)
      .save((err) => {
        if (!err) {
          console.log(`Notification job created: ${job.id}`);
        }
      });

    job.on("complete", () => {
      console.log(`Notification job ${job.id} completed`);
    });

    job.on("failed", (errorMessage) => {
      console.log(`Notification job ${job.id} failed: ${errorMessage}`);
    });

    job.on("progress", (progress) => {
      console.log(`Notification job ${job.id} ${progress}% complete`);
    });
  });
};

// Example usage
const queue = kue.createQueue();
const jobs = [
  {
    phoneNumber: "4153518780",
    message: "This is the code 1234 to verify your account",
  },
];
createPushNotificationsJobs(jobs, queue);
