import mongoose from "mongoose";

import { applySoftDelete } from "./softDeletePlugin.js";

export const NOTIFICATION_TYPES = Object.freeze([
  "info",
  "application",
  "interview",
  "offer",
  "system",
]);

/**
 * A single notification for a user. Nothing writes to this collection yet
 * beyond the welcome notification created alongside a new StudentProfile
 * (see dashboard.service.js) — a full notification-generating pipeline
 * (on application status change, interview scheduled, etc.) belongs to the
 * modules that trigger those events, not this dashboard foundation.
 */
const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: NOTIFICATION_TYPES,
      default: "info",
    },
    message: {
      type: String,
      required: [true, "Notification message is required"],
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

notificationSchema.plugin(applySoftDelete);
notificationSchema.index({ recipient: 1, createdAt: -1 });

export const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
