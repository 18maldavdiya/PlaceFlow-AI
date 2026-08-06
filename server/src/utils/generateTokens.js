import jwt from "jsonwebtoken";

import { env } from "../config/env.js";

/**
 * Signs the short-lived access token. Payload stays minimal (id, role) —
 * it's decoded on every request in middlewares/auth.middleware.js without a
 * database round trip, so nothing here should go stale between issuance and
 * expiry in a way that matters for authorization.
 */
export function generateAccessToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role, email: user.email },
    env.jwt.accessSecret,
    { expiresIn: env.jwt.accessExpiresIn },
  );
}

/**
 * Signs the long-lived refresh token. Payload is intentionally just the
 * subject — role/email are re-read from the database when a refresh token
 * is redeemed, so a role change takes effect on the next refresh instead of
 * lingering for up to 30 days.
 */
export function generateRefreshToken(user) {
  return jwt.sign({ sub: user._id.toString() }, env.jwt.refreshSecret, {
    expiresIn: env.jwt.refreshExpiresIn,
  });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, env.jwt.accessSecret);
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, env.jwt.refreshSecret);
}

export default {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
