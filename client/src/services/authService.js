import { api } from "@/services/api";

/**
 * Auth API calls. Every function returns `response.data.data` (the payload
 * inside the server's ApiResponse envelope). The session itself lives in
 * httpOnly cookies set by the server on register/login/refresh — nothing
 * here reads or writes localStorage, per the architecture decision that the
 * cookie (not client-side storage) is the source of truth for the session.
 */

export async function register(payload) {
  const response = await api.post("/auth/register", payload);
  return response.data.data;
}

export async function login(payload) {
  const response = await api.post("/auth/login", payload);
  return response.data.data;
}

export async function logout() {
  const response = await api.post("/auth/logout");
  return response.data.data;
}

export async function refreshSession() {
  const response = await api.post("/auth/refresh-token");
  return response.data.data;
}

export async function getCurrentUser() {
  const response = await api.get("/auth/me");
  return response.data.data;
}

export async function forgotPassword(payload) {
  const response = await api.post("/auth/forgot-password", payload);
  return response.data.data;
}

export async function resetPassword(token, payload) {
  const response = await api.post(`/auth/reset-password/${token}`, payload);
  return response.data.data;
}

export async function verifyEmail(token) {
  const response = await api.get(`/auth/verify-email/${token}`);
  return response.data.data;
}

export default {
  register,
  login,
  logout,
  refreshSession,
  getCurrentUser,
  forgotPassword,
  resetPassword,
  verifyEmail,
};
