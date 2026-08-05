import { Server } from "socket.io";

import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";

let io = null;

/**
 * Attaches Socket.io to the same HTTP server Express listens on (called
 * once from server.js). Only connection lifecycle logging is wired at this
 * stage — business events (e.g. interview-status updates, notifications)
 * are registered as their own handler modules under this folder once those
 * features are built, and imported/attached from `registerSocketHandlers`.
 */
export function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: env.clientOrigins,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    logger.info(`Socket connected: ${socket.id}`);

    socket.on("disconnect", (reason) => {
      logger.info(`Socket disconnected: ${socket.id} (${reason})`);
    });
  });

  return io;
}

/**
 * Accessor for the initialized Socket.io server, used by services that need
 * to emit events (e.g. a future notification service). Throws if called
 * before `initSocket` — a clearer failure than a silent `undefined.emit`.
 */
export function getIO() {
  if (!io) {
    throw new Error("Socket.io has not been initialized — call initSocket(httpServer) first.");
  }
  return io;
}

export default initSocket;
