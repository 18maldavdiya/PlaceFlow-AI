import { Router } from "express";

import authRoutes from "./auth.routes.js";
import dashboardRoutes from "./dashboard.routes.js";
import healthRoutes from "./health.routes.js";
import profileRoutes from "./profile.routes.js";

/**
 * Aggregates every versioned resource router. Mounted in app.js under
 * `/api/${env.apiVersion}`. As business routes are added (recruiter/tpo/
 * admin dashboards, jobs, applications, ...) they're registered here, each
 * in its own file — never add a route directly in app.js.
 */
const router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/profile", profileRoutes);

export default router;
