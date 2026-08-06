import { api } from "@/services/api";

/**
 * Student Dashboard Home API calls — every request rides the existing
 * cookie-authenticated `api` instance, so no token handling lives here.
 * Each function returns `response.data.data` (the payload inside the
 * server's ApiResponse envelope).
 */

export async function getSummary() {
  const response = await api.get("/dashboard/summary");
  return response.data.data;
}

export async function getRecentApplications(limit = 5) {
  const response = await api.get("/dashboard/applications/recent", {
    params: { limit },
  });
  return response.data.data;
}

export async function getUpcomingInterviews(limit = 5) {
  const response = await api.get("/dashboard/interviews/upcoming", {
    params: { limit },
  });
  return response.data.data;
}

export async function getRecommendedJobs(limit = 6) {
  const response = await api.get("/dashboard/jobs/recommended", {
    params: { limit },
  });
  return response.data.data;
}

export async function getNotifications(limit = 5) {
  const response = await api.get("/dashboard/notifications", {
    params: { limit },
  });
  return response.data.data;
}

export async function getProfileCompletion() {
  const response = await api.get("/dashboard/profile-completion");
  return response.data.data;
}

export default {
  getSummary,
  getRecentApplications,
  getUpcomingInterviews,
  getRecommendedJobs,
  getNotifications,
  getProfileCompletion,
};
