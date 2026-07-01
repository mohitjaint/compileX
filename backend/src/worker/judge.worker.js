import { Worker } from "bullmq";
import redis from "../queue/redis.js";

import { judgeSubmission } from "../services/judge.service.js";

const worker = new Worker("judge-queue", async job => {
    console.log(`Processing job ${job.id}`);
    await judgeSubmission(job.data);
}, { connection: redis });

worker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
    console.error(`Job ${job?.id} failed`, err);
});

worker.on("error", (err) => {
    console.error(err);
});

export { worker };