import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";
import { logger } from "../utils/logger.js";

/**
 * Central error handler — the last middleware registered in app.js. Every
 * thrown/next(error) call in the app ends up here. Known errors (ApiError,
 * Mongoose validation/cast errors, JWT errors) are translated into a clean
 * response; anything unrecognized becomes a generic 500 so internals are
 * never leaked to the client.
 */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || (error.name === "ValidationError" ? 400 : 500);
    const message = mapKnownErrorMessage(error) || "Something went wrong";
    error = new ApiError(statusCode, message, error.errors ?? null);
  }

  const isServerError = error.statusCode >= 500;
  if (isServerError) {
    logger.error(`${req.method} ${req.originalUrl} -> ${err.stack || err}`);
  } else {
    logger.warn(`${req.method} ${req.originalUrl} -> ${error.message}`);
  }

  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    errors: error.errors,
    ...(env.isDevelopment && !isServerErrorSafeToHide(error)
      ? { stack: err.stack }
      : {}),
  });
}

function mapKnownErrorMessage(error) {
  if (error.name === "CastError") {
    return `Invalid value for field "${error.path}"`;
  }
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue || {})[0];
    return field
      ? `A record with that ${field} already exists`
      : "Duplicate value";
  }
  if (error.name === "JsonWebTokenError") {
    return "Invalid authentication token";
  }
  if (error.name === "TokenExpiredError") {
    return "Authentication token has expired";
  }
  return error.message;
}

function isServerErrorSafeToHide(error) {
  return error.statusCode < 500;
}

export default errorHandler;
