import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";

import { corsOptions } from "./config/corsOptions.js";
import { env } from "./config/env.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import { globalRateLimiter } from "./middlewares/rateLimiter.js";
import { applySecurityMiddleware } from "./middlewares/security.js";
import healthRoutes from "./routes/health.routes.js";
import apiRouter from "./routes/index.js";
import { morganStream } from "./utils/logger.js";

/**
 * Express application factory. Exported, not started — server.js owns
 * connecting to MongoDB, creating the HTTP server, and calling `.listen()`.
 * Keeping app.js free of side effects like that makes it directly
 * importable by integration tests later without opening a real port.
 */
export function createApp() {
  const app = express();

  // Render/other reverse proxies sit in front of this app — required for
  // rate-limiting and secure cookies to see the real client IP/protocol.
  app.set("trust proxy", 1);

  // ---------- Security ----------
  applySecurityMiddleware(app);
  app.use(cors(corsOptions));

  // ---------- Body & cookie parsing ----------
  app.use(express.json({ limit: "10kb" }));
  app.use(express.urlencoded({ extended: true, limit: "10kb" }));
  app.use(cookieParser());

  // ---------- Performance ----------
  app.use(compression());

  // ---------- Logging ----------
  app.use(
    morgan(env.isDevelopment ? "dev" : "combined", { stream: morganStream }),
  );

  // ---------- Rate limiting ----------
  app.use(globalRateLimiter);

  // ---------- Routes ----------
  // Unversioned — used by infra (Render health checks, Docker HEALTHCHECK,
  // uptime monitors) that shouldn't need to know the API version.
  app.use("/health", healthRoutes);
  // Versioned — what the client's Axios instance actually calls.
  app.use(`/api/${env.apiVersion}`, apiRouter);

  // ---------- 404 + error handling (must be registered last) ----------
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

export default createApp;
