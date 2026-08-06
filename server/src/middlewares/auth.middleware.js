import { ApiError } from "../utils/ApiError.js";
import { verifyAccessToken } from "../utils/generateTokens.js";

/**
 * Verifies the access token and attaches a minimal `req.user` (id, role,
 * email) decoded straight from the JWT — no database round trip on every
 * request. Reads the token from the httpOnly `accessToken` cookie first
 * (the browser flow), falling back to an `Authorization: Bearer` header for
 * non-browser API clients.
 */
export function protect(req, res, next) {
  const bearerToken = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.slice(7)
    : null;
  const token = req.cookies?.accessToken || bearerToken;

  if (!token) {
    return next(ApiError.unauthorized("You must be logged in to do that."));
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, role: payload.role, email: payload.email };
    return next();
  } catch {
    return next(ApiError.unauthorized("Your session has expired. Please log in again."));
  }
}

export default protect;
