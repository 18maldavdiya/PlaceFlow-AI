import { env } from "./env.js";
import { logger } from "../utils/logger.js";

/**
 * CORS allowlist driven by CLIENT_ORIGINS (comma-separated in .env) rather
 * than a wildcard — required anyway since cookies (`credentials: true`)
 * cannot be used with `Access-Control-Allow-Origin: *`.
 */
export const corsOptions = {
  origin(origin, callback) {
    // Allow non-browser requests (server-to-server, curl, health checks)
    // which send no Origin header at all.
    if (!origin) return callback(null, true);

    if (env.clientOrigins.includes(origin)) {
      return callback(null, true);
    }

    logger.warn(`Blocked CORS request from unauthorized origin: ${origin}`);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 86400,
};

export default corsOptions;
