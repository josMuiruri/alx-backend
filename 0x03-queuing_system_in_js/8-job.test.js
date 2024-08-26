import { expect } from "chai";
import kue from "kue";
import sinon from "sinon";
import createPushNotificationsJobs from "./8-job.js"; // Adjust the path if necessary

describe("createPushNotificationsJobs", () => {
  let queue;

  beforeEach(() => {
    queue = kue.createQueue();
    queue.testMode.enter();
  });

  afterEach(() => {
    queue.testMode.clear();
    queue.testMode.exit();
  });

  it("should throw an error if jobs is not an array", () => {
    expect(() => createPushNotificationsJobs("not an array", queue)).to.throw(
      "Jobs is not an array"
    );
  });

  it("should create jobs in the queue", () => {
    const jobs = [
      {
        phoneNumber: "4153518780",
        message: "This is the code 1234 to verify your account",
      },
      {
        phoneNumber: "4153518781",
        message: "This is the code 4562 to verify your account",
      },
    ];

    createPushNotificationsJobs(jobs, queue);

    const createdJobs = queue.testMode.jobs;

    expect(createdJobs.length).to.equal(2);
    expect(createdJobs[0].type).to.equal("push_notification_code_3");
    expect(createdJobs[0].data).to.deep.equal(jobs[0]);
    expect(createdJobs[1].type).to.equal("push_notification_code_3");
    expect(createdJobs[1].data).to.deep.equal(jobs[1]);
  });

  it("should log the correct messages when jobs are created, completed, failed, and in progress", (done) => {
    const jobs = [
      {
        phoneNumber: "4153518780",
        message: "This is the code 1234 to verify your account",
      },
    ];

    const log = sinon.spy(console, "log");

    createPushNotificationsJobs(jobs, queue);

    const [job] = queue.testMode.jobs;

    job._events.complete(); // Trigger job completion
    job._events.failed(new Error("Error")); // Simulate job failure
    job._events.progress(50); // Simulate job progress

    // Allow time for the logs to be captured
    setTimeout(() => {
      expect(log.calledWith(`Notification job created: ${job.id}`)).to.be.true;
      expect(log.calledWith(`Notification job ${job.id} completed`)).to.be.true;
      expect(log.calledWith(`Notification job ${job.id} failed: Error`)).to.be
        .true;
      expect(log.calledWith(`Notification job ${job.id} 50% complete`)).to.be
        .true;

      log.restore();
      done();
    }, 50);
  });
});
