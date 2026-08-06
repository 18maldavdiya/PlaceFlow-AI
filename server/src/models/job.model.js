import mongoose from "mongoose";

import { applySoftDelete } from "./softDeletePlugin.js";

/**
 * Minimal job listing — just enough to back the dashboard's "Recommended
 * Jobs" widget. Posting/editing/searching jobs is the Jobs Module, out of
 * scope here; nothing in this app writes to this collection yet except the
 * one-time dev seed in utils/seedJobs.js.
 */
const jobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Company is required"],
      trim: true,
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      trim: true,
    },
    location: {
      type: String,
      trim: true,
      default: "",
    },
    salaryRange: {
      type: String,
      trim: true,
      default: "",
    },
    eligibility: {
      type: String,
      trim: true,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    postedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

jobSchema.plugin(applySoftDelete);
jobSchema.index({ isActive: 1, postedAt: -1 });

export const Job = mongoose.model("Job", jobSchema);
export default Job;
