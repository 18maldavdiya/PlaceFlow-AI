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

// ---------- Phase 5.2B: Skills / Projects / Experience / Certificates ----------
// Every call below returns the full, re-serialized profile (same shape as
// getProfile()) so the caller can just replace its cached copy wholesale.

export async function addSkill(payload) {
  const response = await api.post("/profile/skills", payload);
  return response.data.data;
}
export async function updateSkill(skillId, payload) {
  const response = await api.put(`/profile/skills/${skillId}`, payload);
  return response.data.data;
}
export async function deleteSkill(skillId) {
  const response = await api.delete(`/profile/skills/${skillId}`);
  return response.data.data;
}

export async function addProject(payload) {
  const response = await api.post("/profile/projects", payload);
  return response.data.data;
}
export async function updateProject(projectId, payload) {
  const response = await api.put(`/profile/projects/${projectId}`, payload);
  return response.data.data;
}
export async function deleteProject(projectId) {
  const response = await api.delete(`/profile/projects/${projectId}`);
  return response.data.data;
}

export async function addExperience(payload) {
  const response = await api.post("/profile/experience", payload);
  return response.data.data;
}
export async function updateExperience(experienceId, payload) {
  const response = await api.put(
    `/profile/experience/${experienceId}`,
    payload,
  );
  return response.data.data;
}
export async function deleteExperience(experienceId) {
  const response = await api.delete(`/profile/experience/${experienceId}`);
  return response.data.data;
}

export async function addCertificate(payload) {
  const response = await api.post("/profile/certificates", payload);
  return response.data.data;
}
export async function updateCertificate(certificateId, payload) {
  const response = await api.put(
    `/profile/certificates/${certificateId}`,
    payload,
  );
  return response.data.data;
}
export async function deleteCertificate(certificateId) {
  const response = await api.delete(`/profile/certificates/${certificateId}`);
  return response.data.data;
}

export default {
  getProfile,
  updateProfile,
  uploadProfileImage,
  addSkill,
  updateSkill,
  deleteSkill,
  addProject,
  updateProject,
  deleteProject,
  addExperience,
  updateExperience,
  deleteExperience,
  addCertificate,
  updateCertificate,
  deleteCertificate,
};
