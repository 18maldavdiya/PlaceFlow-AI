/**
 * Standard error shape for every intentional failure thrown inside a
 * controller or service (validation failure, not-found, forbidden, etc.).
 * The global error handler (middlewares/errorHandler.js) knows how to
 * render this consistently; anything thrown that ISN'T an ApiError is
 * treated as an unexpected 500.
 */
export class ApiError extends Error {
  constructor(statusCode, message, errors = null, stack = "") {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  static badRequest(message = "Bad request", errors = null) {
    return new ApiError(400, message, errors);
  }

  static unauthorized(message = "Unauthorized") {
    return new ApiError(401, message);
  }

  static forbidden(message = "Forbidden") {
    return new ApiError(403, message);
  }

  static notFound(message = "Resource not found") {
    return new ApiError(404, message);
  }

  static conflict(message = "Conflict", errors = null) {
    return new ApiError(409, message, errors);
  }

  static internal(message = "Internal server error") {
    return new ApiError(500, message);
  }
}

export default ApiError;
