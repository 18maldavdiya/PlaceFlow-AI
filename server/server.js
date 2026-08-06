import http from "node:http";

import { createApp } from "./src/app.js";
import { assertRequiredEnv, env } from "./src/config/env.js";
import { connectDB } from "./src/config/db.js";
import { logger } from "./src/utils/logger.js";
import { seedJobsIfEmpty } from "./src/utils/seedJobs.js";

/**
 * Process entry point. Order matters: validate configuration -> connect the
 * database -> build the Express app -> create the raw HTTP server -> start
 * listening. The app never accepts a request before MongoDB is connected.
 */
async function bootstrap() {
  try {
    assertRequiredEnv();

    await connectDB();
    await seedJobsIfEmpty();

    const app = createApp();
    const httpServer = http.createServer(app);

    httpServer.listen(env.port, () => {
      logger.info(
        `PlaceFlow AI server listening on port ${env.port} [${env.nodeEnv}]`,
      );
    });

    registerProcessSafetyNets(httpServer);
  } catch (error) {
    logger.error(`Failed to start server: ${error.stack || error.message}`);
    process.exit(1);
  }
}

/**
 * Ensures the process fails loudly instead of hanging on an unhandled
 * rejection, and shuts down cleanly on termination signals (important for
 * Docker/Render, which send SIGTERM before force-killing a container).
 */
function registerProcessSafetyNets(httpServer) {
  process.on("unhandledRejection", (reason) => {
    logger.error(`Unhandled promise rejection: ${reason}`);
    httpServer.close(() => process.exit(1));
  });

  process.on("uncaughtException", (error) => {
    logger.error(`Uncaught exception: ${error.stack || error.message}`);
    process.exit(1);
  });

  for (const signal of ["SIGINT", "SIGTERM"]) {
    process.on(signal, () => {
      logger.info(`${signal} received — shutting down gracefully.`);
      httpServer.close(() => {
        logger.info("HTTP server closed.");
        process.exit(0);
      });
    });
  }
}

bootstrap();
