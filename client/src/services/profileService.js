import { env } from "@/config/env";
import { api } from "@/services/api";

/**
 * Student Profile API calls. Every request rides the existing
 * cookie-authenticated `api` instance. Each function returns
 * `response.data.data` (the payload inside the server's ApiResponse
 * envelope).
 */

/**
 * `profileImageUrl` in the API response is a path relative to the API base
 * (e.g. "/profile/image/xyz.png"), not a full URL — deliberately, so the
 * server can swap local storage for Cloudinary later without changing what
 * it stores. This is the one place that turns it into something an <img>
 * tag can use.
 */
export function resolveProfileImageUrl(profileImageUrl) {
  if (!profileImageUrl) return null;
  return `${env.apiBaseUrl}${profileImageUrl}`;
}

export async function getProfile() {
  const response = await api.get("/profile");
  return response.data.data;
}

export async function updateProfile(payload) {
  const response = await api.put("/profile", payload);
  return response.data.data;
}

export async function uploadProfileImage(file) {
  const formData = new FormData();
  formData.append("profileImage", file);
  const response = await api.post("/profile/image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.data;
}

export default { getProfile, updateProfile, uploadProfileImage };
