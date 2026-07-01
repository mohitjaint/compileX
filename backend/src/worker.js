import connectDB from "./db/index.js";
import dotenv from "dotenv";

dotenv.config();

await connectDB();

await import("./worker/judge.worker.js");

console.log("🚀 Worker started");