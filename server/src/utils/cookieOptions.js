import { env } from "../config/env.js";

const UNIT_TO_MS = {
  s: 1000,
  m: 60 * 1000,
  h: 60 * 60 * 1000,
  d: 24 * 60 * 60 * 1000,
};

/**
 * Parses a JWT-style duration string ("15m", "30d") into milliseconds for
 * cookie `maxAge`. Kept local rather than pulling in the `ms` package —
 * the format used across this codebase's env vars is always `<number><unit>`.
 */
function durationToMs(duration, fallbackMs) {
  const match = /^(\d+)([smhd])$/.exec(duration);
  if (!match) return fallbackMs;
  const [, amount, unit] = match;
  return Number(amount) * UNIT_TO_MS[unit];
}

const baseCookieOptions = {
  httpOnly: true,
  secure: env.cookie.secure,
  sameSite: env.cookie.secure ? "none" : "lax",
  domain: env.cookie.domain === "localhost" ? undefined : env.cookie.domain,
  path: "/",
};

export function accessTokenCookieOptions() {
  return {
    ...baseCookieOptions,
    maxAge: durationToMs(env.jwt.accessExpiresIn, 15 * 60 * 1000),
  };
}

export function refreshTokenCookieOptions() {
  return {
    ...baseCookieOptions,
    maxAge: durationToMs(env.jwt.refreshExpiresIn, 30 * 24 * 60 * 60 * 1000),
  };
}

export const clearCookieOptions = baseCookieOptions;

export default {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
  clearCookieOptions,
};
