import { Router } from "express";

import healthRoutes from "./health.routes.js";

/**
 * Aggregates every versioned resource router. Mounted in app.js under
 * `/api/${env.apiVersion}`. As business routes are added (auth, students,
 * drives, ...) they're registered here, each in its own file — never add a
 * route directly in app.js.
 */
const router = Router();

router.use("/health", healthRoutes);

export default router;
