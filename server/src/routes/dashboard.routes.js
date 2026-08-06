import { Router } from "express";

import * as dashboardController from "../controllers/dashboard.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

/**
 * Student Dashboard Foundation — read-only APIs backing Dashboard Home.
 * Every route reuses the existing `protect`/`authorize` middleware exactly
 * as built for the Authentication module; neither is modified here.
 * Recruiter/TPO/Admin sessions are valid (protect passes) but get a 403
 * from authorize("student") — this is not a "no dashboard exists" 404, it's
 * an explicit role rejection.
 */
const router = Router();

router.use(protect, authorize("student"));

router.get("/summary", dashboardController.getSummary);
router.get("/applications/recent", dashboardController.getRecentApplications);
router.get("/interviews/upcoming", dashboardController.getUpcomingInterviews);
router.get("/jobs/recommended", dashboardController.getRecommendedJobs);
router.get("/notifications", dashboardController.getNotifications);
router.get("/profile-completion", dashboardController.getProfileCompletion);

export default router;
