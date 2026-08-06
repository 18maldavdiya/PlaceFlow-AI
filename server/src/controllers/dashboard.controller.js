import * as dashboardService from "../services/dashboard.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Every handler reads `req.user.id` only — never a param/body-supplied id —
 * so a student can never request another student's dashboard data. Mounted
 * behind `protect` + `authorize("student")` in routes/dashboard.routes.js.
 */

export const getSummary = asyncHandler(async (req, res) => {
  const data = await dashboardService.getDashboardSummary(req.user.id);
  new ApiResponse(200, data, "Dashboard summary.").send(res);
});

export const getRecentApplications = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit) || 5;
  const data = await dashboardService.getRecentApplications(req.user.id, limit);
  new ApiResponse(200, data, "Recent applications.").send(res);
});

export const getUpcomingInterviews = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit) || 5;
  const data = await dashboardService.getUpcomingInterviews(req.user.id, limit);
  new ApiResponse(200, data, "Upcoming interviews.").send(res);
});

export const getRecommendedJobs = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit) || 6;
  const data = await dashboardService.getRecommendedJobs(req.user.id, limit);
  new ApiResponse(200, data, "Recommended jobs.").send(res);
});

export const getNotifications = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit) || 5;
  const data = await dashboardService.getNotifications(req.user.id, limit);
  new ApiResponse(200, data, "Recent notifications.").send(res);
});

export const getProfileCompletion = asyncHandler(async (req, res) => {
  const data = await dashboardService.getProfileCompletion(req.user.id);
  new ApiResponse(200, data, "Profile completion.").send(res);
});

export default {
  getSummary,
  getRecentApplications,
  getUpcomingInterviews,
  getRecommendedJobs,
  getNotifications,
  getProfileCompletion,
};
