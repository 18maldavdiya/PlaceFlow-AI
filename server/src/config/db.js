import mongoose from "mongoose";

import { env } from "./env.js";
import { logger } from "../utils/logger.js";

mongoose.set("strictQuery", true);

let hasConnectedListenersAttached = false;

function attachConnectionListeners() {
  if (hasConnectedListenersAttached) return;
  hasConnectedListenersAttached = true;

  mongoose.connection.on("connected", () => {
    logger.info(`MongoDB connected — host: ${mongoose.connection.host}`);
  });

  mongoose.connection.on("error", (error) => {
    logger.error(`MongoDB connection error: ${error.message}`);
  });

  mongoose.connection.on("disconnected", () => {
    logger.warn("MongoDB disconnected");
  });
}

/**
 * Connects to MongoDB Atlas. Called once from server.js before the HTTP
 * server starts listening — the app should never accept traffic with no
 * database connection. Retries a fixed number of times with backoff so a
 * slow-to-warm Atlas cluster doesn't crash the container on a cold start.
 */
export async function connectDB({ retries = 5, retryDelayMs = 3000 } = {}) {
  if (!env.mongodbUri) {
    throw new Error(
      "MONGODB_URI is not set — configure it in server/.env before starting the server.",
    );
  }

  attachConnectionListeners();

  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      await mongoose.connect(env.mongodbUri, {
        serverSelectionTimeoutMS: 10000,
      });
      return mongoose.connection;
    } catch (error) {
      logger.error(
        `MongoDB connection attempt ${attempt}/${retries} failed: ${error.message}`,
      );
      if (attempt === retries) throw error;
      await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
    }
  }

  return mongoose.connection;
}

export async function disconnectDB() {
  await mongoose.disconnect();
}

export function getConnectionState() {
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  return mongoose.connection.readyState;
}

export default connectDB;
