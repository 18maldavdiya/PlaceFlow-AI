import { ApiError } from "../utils/ApiError.js";

/**
 * Registered after every route in app.js. Converts any request that didn't
 * match a route into a proper 404 ApiError instead of Express's default
 * HTML error page, so the response shape stays consistent with the rest of
 * the API.
 */
export function notFoundHandler(req, res, next) {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}

export default notFoundHandler;
