import * as authService from "../services/auth.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  accessTokenCookieOptions,
  clearCookieOptions,
  refreshTokenCookieOptions,
} from "../utils/cookieOptions.js";

/**
 * Every response sets the session as httpOnly cookies (what the browser
 * actually relies on) and also returns the tokens in the JSON body, for
 * non-browser API clients. The frontend deliberately ignores the JSON
 * tokens rather than persisting them — see client/src/services/authService.js.
 */
function setAuthCookies(res, { accessToken, refreshToken }) {
  res.cookie("accessToken", accessToken, accessTokenCookieOptions());
  res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions());
}

export const register = asyncHandler(async (req, res) => {
  const { fullName, email, password, role, college, phoneNumber } = req.body;

  const { user, mockVerificationUrl } = await authService.registerUser({
    fullName,
    email,
    password,
    role,
    college,
    phoneNumber,
  });

  new ApiResponse(
    201,
    { user, mockVerificationUrl },
    "Account created. Check your email to verify your account.",
  ).send(res);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { user, accessToken, refreshToken } = await authService.loginUser({
    email,
    password,
  });

  setAuthCookies(res, { accessToken, refreshToken });

  new ApiResponse(200, { user, accessToken, refreshToken }, "Logged in successfully.").send(
    res,
  );
});

export const refreshToken = asyncHandler(async (req, res) => {
  const incoming = req.cookies?.refreshToken || req.body?.refreshToken;

  const { user, accessToken, refreshToken: newRefreshToken } =
    await authService.refreshTokens(incoming);

  setAuthCookies(res, { accessToken, refreshToken: newRefreshToken });

  new ApiResponse(
    200,
    { user, accessToken, refreshToken: newRefreshToken },
    "Session refreshed.",
  ).send(res);
});

export const logout = asyncHandler(async (req, res) => {
  if (req.user?.id) {
    await authService.logoutUser(req.user.id);
  }

  res.clearCookie("accessToken", clearCookieOptions);
  res.clearCookie("refreshToken", clearCookieOptions);

  new ApiResponse(200, null, "Logged out successfully.").send(res);
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getCurrentUser(req.user.id);
  new ApiResponse(200, { user }, "Current session.").send(res);
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const { mockResetUrl } = await authService.forgotPassword(email);

  new ApiResponse(
    200,
    { mockResetUrl },
    "If an account exists for that email, password reset instructions have been sent.",
  ).send(res);
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const { user } = await authService.resetPassword(token, password);

  new ApiResponse(200, { user }, "Password reset successfully. Please log in.").send(res);
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { user } = await authService.verifyEmail(token);

  new ApiResponse(200, { user }, "Email verified successfully.").send(res);
});

export default {
  register,
  login,
  refreshToken,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  verifyEmail,
};
