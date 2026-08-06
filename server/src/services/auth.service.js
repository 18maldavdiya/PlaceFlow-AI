import crypto from "node:crypto";

import { env } from "../config/env.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/generateTokens.js";
import { logger } from "../utils/logger.js";

const VERIFICATION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24h
const RESET_TOKEN_TTL_MS = 15 * 60 * 1000; // 15m

function hashToken(rawToken) {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

function issueRawToken() {
  return crypto.randomBytes(32).toString("hex");
}

function clientBaseUrl() {
  return env.clientOrigins[0] || "http://localhost:5173";
}

/**
 * No email provider is wired up yet (by design — see docs). Every flow that
 * would send an email instead logs the link at `info` level and, outside
 * production, hands the raw token back to the caller so the frontend flow
 * can be exercised end to end without a real inbox. Swap this out for
 * `emails/` + `lib/mailer.js` once a provider exists.
 */
function mockSendEmail({ to, subject, url }) {
  logger.info(`[mock email] To: ${to} | ${subject} | ${url}`);
  return env.isProduction ? null : { url };
}

export async function registerUser({
  fullName,
  email,
  password,
  role,
  college,
  phoneNumber,
}) {
  const existing = await User.findOne({ email })
    .setOptions({ includeDeleted: true })
    .select("_id");
  if (existing) {
    throw ApiError.conflict("An account with that email already exists.");
  }

  const rawVerificationToken = issueRawToken();

  const user = await User.create({
    fullName,
    email,
    password,
    role,
    college,
    phoneNumber,
    emailVerificationToken: hashToken(rawVerificationToken),
    emailVerificationExpires: new Date(Date.now() + VERIFICATION_TOKEN_TTL_MS),
  });

  const verificationUrl = `${clientBaseUrl()}/verify-email/${rawVerificationToken}`;
  const mock = mockSendEmail({
    to: user.email,
    subject: "Verify your PlaceFlow AI account",
    url: verificationUrl,
  });

  return { user: user.toSafeJSON(), mockVerificationUrl: mock?.url ?? null };
}

export async function loginUser({ email, password }) {
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw ApiError.unauthorized("Invalid email or password.");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw ApiError.unauthorized("Invalid email or password.");
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshTokenHash = hashToken(refreshToken);
  await user.save({ validateBeforeSave: false });

  return { user: user.toSafeJSON(), accessToken, refreshToken };
}

export async function refreshTokens(incomingRefreshToken) {
  if (!incomingRefreshToken) {
    throw ApiError.unauthorized("No refresh token provided.");
  }

  let payload;
  try {
    payload = verifyRefreshToken(incomingRefreshToken);
  } catch {
    throw ApiError.unauthorized("Refresh token is invalid or expired.");
  }

  const user = await User.findById(payload.sub).select("+refreshTokenHash");
  if (!user || !user.refreshTokenHash) {
    throw ApiError.unauthorized("Session has been revoked. Please log in again.");
  }

  if (hashToken(incomingRefreshToken) !== user.refreshTokenHash) {
    // Token doesn't match the last-issued one — could be reuse of a
    // rotated-out token. Revoke the session defensively.
    user.refreshTokenHash = undefined;
    await user.save({ validateBeforeSave: false });
    throw ApiError.unauthorized("Session has been revoked. Please log in again.");
  }

  const accessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);
  user.refreshTokenHash = hashToken(newRefreshToken);
  await user.save({ validateBeforeSave: false });

  return {
    user: user.toSafeJSON(),
    accessToken,
    refreshToken: newRefreshToken,
  };
}

export async function logoutUser(userId) {
  await User.findByIdAndUpdate(userId, { $unset: { refreshTokenHash: 1 } });
}

export async function getCurrentUser(userId) {
  const user = await User.findById(userId);
  if (!user) {
    throw ApiError.notFound("User not found.");
  }
  return user.toSafeJSON();
}

export async function forgotPassword(email) {
  const user = await User.findOne({ email });
  // Deliberately don't throw when the user doesn't exist — the controller
  // always returns the same generic message either way, so this function
  // doesn't leak which emails are registered.
  if (!user) return { mockResetUrl: null };

  const rawResetToken = issueRawToken();
  user.passwordResetToken = hashToken(rawResetToken);
  user.passwordResetExpires = new Date(Date.now() + RESET_TOKEN_TTL_MS);
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${clientBaseUrl()}/reset-password/${rawResetToken}`;
  const mock = mockSendEmail({
    to: user.email,
    subject: "Reset your PlaceFlow AI password",
    url: resetUrl,
  });

  return { mockResetUrl: mock?.url ?? null };
}

export async function resetPassword(rawToken, newPassword) {
  const user = await User.findOne({
    passwordResetToken: hashToken(rawToken),
    passwordResetExpires: { $gt: new Date() },
  }).select("+passwordResetToken +passwordResetExpires");

  if (!user) {
    throw ApiError.badRequest("This reset link is invalid or has expired.");
  }

  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  // Force re-login everywhere after a password reset.
  user.refreshTokenHash = undefined;
  await user.save();

  return { user: user.toSafeJSON() };
}

export async function verifyEmail(rawToken) {
  const user = await User.findOne({
    emailVerificationToken: hashToken(rawToken),
    emailVerificationExpires: { $gt: new Date() },
  }).select("+emailVerificationToken +emailVerificationExpires");

  if (!user) {
    throw ApiError.badRequest("This verification link is invalid or has expired.");
  }

  user.emailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save({ validateBeforeSave: false });

  return { user: user.toSafeJSON() };
}

export default {
  registerUser,
  loginUser,
  refreshTokens,
  logoutUser,
  getCurrentUser,
  forgotPassword,
  resetPassword,
  verifyEmail,
};
