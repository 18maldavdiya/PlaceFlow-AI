import mongoose from "mongoose";

import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const CONNECTION_STATES = {
  0: "disconnected",
  1: "connected",
  2: "connecting",
  3: "disconnecting",
};

/**
 * GET /health and GET /api/v1/health — the only endpoint implemented at
 * this stage. Reports process uptime and live database connection state so
 * it's useful both as an infra liveness probe (Render, Docker) and as a
 * quick manual check that MongoDB Atlas is actually reachable, not just
 * that the process is running.
 */
export const getHealth = asyncHandler(async (req, res) => {
  const dbState = CONNECTION_STATES[mongoose.connection.readyState] ?? "unknown";

  new ApiResponse(200, {
    status: "ok",
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
    database: dbState,
  }, "Service is healthy").send(res);
});

export default { getHealth };
