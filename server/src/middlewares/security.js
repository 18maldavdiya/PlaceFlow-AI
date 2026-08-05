import helmet from "helmet";
import hpp from "hpp";
import mongoSanitize from "express-mongo-sanitize";

/**
 * Bundles the request-hardening middleware applied globally in app.js:
 * - helmet: sets a broad set of protective HTTP headers (CSP left to
 *   default-safe settings here; tighten with a real directive set once the
 *   client's asset origins — Cloudinary, fonts, etc. — are finalized).
 * - hpp: strips duplicate query-string parameters (?role=a&role=b attacks).
 * - mongoSanitize: strips `$` and `.` from request input so it can't be
 *   interpreted as a MongoDB query operator (NoSQL injection).
 */
export const helmetMiddleware = helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
});

export const hppMiddleware = hpp();

export const mongoSanitizeMiddleware = mongoSanitize({
  replaceWith: "_",
});

export function applySecurityMiddleware(app) {
  app.use(helmetMiddleware);
  app.use(hppMiddleware);
  app.use(mongoSanitizeMiddleware);
}

export default applySecurityMiddleware;
