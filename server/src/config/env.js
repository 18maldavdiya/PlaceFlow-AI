import dotenv from "dotenv";

dotenv.config();

/**
 * The only module in the codebase allowed to read `process.env` directly.
 * Every other file imports `env` from here, so a missing variable fails
 * loudly at boot instead of silently as `undefined` deep inside a request.
 */
const REQUIRED_IN_PRODUCTION = [
  "MONGODB_URI",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
];

const nodeEnv = process.env.NODE_ENV || "development";

function readList(value, fallback = []) {
  if (!value) return fallback;
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export const env = Object.freeze({
  nodeEnv,
  isProduction: nodeEnv === "production",
  isDevelopment: nodeEnv === "development",
  isTest: nodeEnv === "test",

  port: Number(process.env.PORT) || 5000,
  apiVersion: process.env.API_VERSION || "v1",

  mongodbUri: process.env.MONGODB_URI || "",

  clientOrigins: readList(process.env.CLIENT_ORIGINS, [
    "http://localhost:5173",
  ]),

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || "",
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    refreshSecret: process.env.JWT_REFRESH_SECRET || "",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
  },

  cookie: {
    domain: process.env.COOKIE_DOMAIN || "localhost",
    secure: process.env.COOKIE_SECURE === "true",
  },

  rateLimit: {
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 300,
  },

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
    apiKey: process.env.CLOUDINARY_API_KEY || "",
    apiSecret: process.env.CLOUDINARY_API_SECRET || "",
  },

  smtp: {
    host: process.env.SMTP_HOST || "",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
    fromEmail: process.env.EMAIL_FROM || "PlaceFlow AI <no-reply@placeflow.ai>",
  },

  logLevel: process.env.LOG_LEVEL || "info",
});

/**
 * Called once at boot (server.js). Throws instead of letting the process
 * start half-configured — a missing DB URI or JWT secret in production
 * should fail the deploy, not the first request.
 */
export function assertRequiredEnv() {
  if (!env.isProduction) return;

  const missing = REQUIRED_IN_PRODUCTION.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables in production: ${missing.join(", ")}`,
    );
  }
}

export default env;
