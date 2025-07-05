import { Worker } from "bullmq";
import { ApiError } from "./utils/ApiError.js";
import logger from "./logger/wiston.logger.js";
import { emailVerificationMailgenContent, sendEmail } from "./utils/mail.js";

const worker = new Worker(
  "EmailQueue",
  async (job) => {
    const { username, email, unHashedToken,request,protocol } = job.data;
    //logger.info(email,unHashedToken)
    if (
      [username, email, unHashedToken,request,protocol].every((field) => field?.trim() === "")
    ) {
      throw new ApiError(400, "Every field is required in worker!!!");
    }
    await sendEmail({
      email: email,
      subject: "Please verify your email",
      mailgenContent: emailVerificationMailgenContent(
        username,
        `${protocol}://${request}/api/v1/users/verify-email/${unHashedToken}`
      ),
    });

    logger.info(`Email is sent to ${job?.data?.username}!!!`);
  },
  {
    concurrency: 10,
    connection: {
      url: "redis://redis:6379",
    },
  }
);

// Event handlers
worker.on("completed", (job) => {
  logger.info(` Job ${job.id} completed successfully`);
});

worker.on("failed", (job, err) => {
  logger.error(` Job ${job.id} failed: ${err.message}`, {
    stack: err.stack,
  });
});

// Graceful shutdown
const shutdown = async () => {
  logger.info("Shutting down worker...");
  await worker.close();
  process.exit(0);
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
