import rateLimit from "express-rate-limit";

import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * Global rate limiter applied to every request in app.js. Stricter,
 * endpoint-specific limiters (e.g. for a future login route) should be
 * built the same way and applied at the router level once those routes
 * exist — this one is the app-wide safety net, not the only one.
 */
export const globalRateLimiter = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: env.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(
      new ApiError(
        429,
        "Too many requests from this IP. Please try again later.",
      ),
    );
  },
});

export default globalRateLimiter;
