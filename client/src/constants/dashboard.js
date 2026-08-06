import {
  Bell,
  Briefcase,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LogOut,
  Mic,
  Settings,
  UserCircle,
} from "lucide-react";

import { ROUTES } from "@/constants/routes";

/**
 * Student sidebar. Only "Dashboard" (this module) and "Logout" (existing
 * auth action) are real destinations — Profile, Resume, Jobs, Applications,
 * Mock Interview, Notifications, and Settings are their own modules, out of
 * scope here, so they're rendered but marked `comingSoon` rather than
 * linking to pages that don't exist yet.
 */
export const SIDEBAR_LINKS = Object.freeze([
  { label: "Dashboard", icon: LayoutDashboard, path: ROUTES.STUDENT_DASHBOARD },
  { label: "My Profile", icon: UserCircle, comingSoon: true },
  { label: "Resume", icon: FileText, comingSoon: true },
  { label: "Jobs", icon: Briefcase, comingSoon: true },
  { label: "Applications", icon: ClipboardList, comingSoon: true },
  { label: "Mock Interview", icon: Mic, comingSoon: true },
  { label: "Notifications", icon: Bell, comingSoon: true },
  { label: "Settings", icon: Settings, comingSoon: true },
]);

export const LOGOUT_LINK = Object.freeze({ label: "Logout", icon: LogOut });

export const APPLICATION_STATUS_STYLES = Object.freeze({
  applied: { label: "Applied", className: "bg-border/60 text-muted" },
  shortlisted: {
    label: "Shortlisted",
    className: "bg-primary/10 text-primary",
  },
  interview: { label: "Interview", className: "bg-warning/10 text-warning" },
  offered: { label: "Offered", className: "bg-success/10 text-success" },
  rejected: { label: "Rejected", className: "bg-danger/10 text-danger" },
});

export const INTERVIEW_STATUS_STYLES = Object.freeze({
  scheduled: { label: "Scheduled", className: "bg-primary/10 text-primary" },
  completed: { label: "Completed", className: "bg-success/10 text-success" },
  cancelled: { label: "Cancelled", className: "bg-danger/10 text-danger" },
});

export const DASHBOARD_QUERY_KEYS = Object.freeze({
  SUMMARY: "dashboard-summary",
  RECENT_APPLICATIONS: "dashboard-recent-applications",
  UPCOMING_INTERVIEWS: "dashboard-upcoming-interviews",
  RECOMMENDED_JOBS: "dashboard-recommended-jobs",
  NOTIFICATIONS: "dashboard-notifications",
  PROFILE_COMPLETION: "dashboard-profile-completion",
});
