import winston from "winston";

import { env } from "../config/env.js";

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

const devFormat = combine(
  colorize(),
  timestamp({ format: "HH:mm:ss" }),
  errors({ stack: true }),
  printf(({ level, message, timestamp: ts, stack }) => {
    return `${ts} ${level}: ${stack || message}`;
  }),
);

const prodFormat = combine(timestamp(), errors({ stack: true }), json());

/**
 * Central structured logger. Nothing in the app should call `console.log`
 * directly (enforced by ESLint's no-console rule) — use `logger.info`,
 * `logger.warn`, `logger.error`, or `logger.http` (used by the Morgan
 * stream in app.js) instead, so every log line carries a level and, in
 * production, machine-parseable JSON for log aggregation.
 */
export const logger = winston.createLogger({
  level: env.logLevel,
  format: env.isProduction ? prodFormat : devFormat,
  transports: [new winston.transports.Console()],
  exitOnError: false,
});

/**
 * Adapter so Morgan (HTTP request logging in app.js) writes through the
 * same logger/transport instead of straight to stdout.
 */
export const morganStream = {
  write: (message) => logger.http(message.trim()),
};

export default logger;
