import mongoose from "mongoose";

import { applySoftDelete } from "./softDeletePlugin.js";

export const APPLICATION_STATUSES = Object.freeze([
  "applied",
  "shortlisted",
  "interview",
  "offered",
  "rejected",
]);

/**
 * A student's application to a Job. Interview details are embedded — small,
 * bounded, and always read together with the application (there's exactly
 * one active interview slot per application at this stage) — rather than a
 * separate Interview collection. References `student` and `job` since both
 * are larger, independently-updated documents. Applying/managing
 * applications is the Applications Module, out of scope here; this
 * collection only backs the dashboard's read-only widgets.
 */
const applicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    status: {
      type: String,
      enum: APPLICATION_STATUSES,
      default: "applied",
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    interview: {
      scheduledAt: { type: Date, default: null },
      mode: {
        type: String,
        enum: ["online", "offline", "phone"],
        default: "online",
      },
      status: {
        type: String,
        enum: ["scheduled", "completed", "cancelled"],
        default: "scheduled",
      },
    },
  },
  { timestamps: true },
);

applicationSchema.plugin(applySoftDelete);
applicationSchema.index({ student: 1, status: 1, appliedAt: -1 });
applicationSchema.index({ student: 1, "interview.scheduledAt": 1 });

export const Application = mongoose.model("Application", applicationSchema);
export default Application;
