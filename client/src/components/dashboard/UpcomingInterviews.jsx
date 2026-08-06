import { useQuery } from "@tanstack/react-query";
import { CalendarClock, Clock } from "lucide-react";

import { Skeleton } from "@/components/common/Skeleton";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import {
  DASHBOARD_QUERY_KEYS,
  INTERVIEW_STATUS_STYLES,
} from "@/constants/dashboard";
import { getUpcomingInterviews } from "@/services/dashboardService";
import { formatDate } from "@/utils/formatDate";

function initialsOf(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function formatTime(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function UpcomingInterviews({ className }) {
  const { data: interviews = [], isLoading } = useQuery({
    queryKey: [DASHBOARD_QUERY_KEYS.UPCOMING_INTERVIEWS],
    queryFn: () => getUpcomingInterviews(5),
  });

  return (
    <DashboardCard title="Upcoming interviews" className={className}>
      {isLoading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : interviews.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <CalendarClock className="h-8 w-8 text-muted" aria-hidden />
          <p className="text-sm text-muted">No interviews scheduled yet.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {interviews.map((interview) => {
            const statusStyle =
              INTERVIEW_STATUS_STYLES[interview.status] ??
              INTERVIEW_STATUS_STYLES.scheduled;
            return (
              <li
                key={interview.id}
                className="flex items-center gap-3 rounded-xl border border-border p-3.5"
              >
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-semibold text-white"
                  style={{ background: "var(--gradient-brand)" }}
                  aria-hidden
                >
                  {initialsOf(interview.company)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {interview.company}
                  </p>
                  <p className="truncate text-xs text-muted">
                    {interview.role}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
                    <Clock className="h-3 w-3 shrink-0" aria-hidden />
                    {formatDate(interview.interviewAt)} ·{" "}
                    {formatTime(interview.interviewAt)}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${statusStyle.className}`}
                >
                  {statusStyle.label}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </DashboardCard>
  );
}

export default UpcomingInterviews;
