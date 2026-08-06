import { useQuery } from "@tanstack/react-query";
import { Award, Bell, BellRing, CalendarClock, Info } from "lucide-react";

import { Skeleton } from "@/components/common/Skeleton";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { DASHBOARD_QUERY_KEYS } from "@/constants/dashboard";
import { getNotifications } from "@/services/dashboardService";
import { timeAgo } from "@/utils/formatDate";

const TYPE_ICONS = {
  info: Info,
  system: Info,
  application: BellRing,
  interview: CalendarClock,
  offer: Award,
};

export function NotificationsPanel({ className }) {
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: [DASHBOARD_QUERY_KEYS.NOTIFICATIONS],
    queryFn: () => getNotifications(5),
  });

  return (
    <DashboardCard title="Recent notifications" className={className}>
      {isLoading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <Bell className="h-8 w-8 text-muted" aria-hidden />
          <p className="text-sm text-muted">Nothing new right now.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {notifications.map((notification) => {
            const Icon = TYPE_ICONS[notification.type] ?? Info;
            return (
              <li
                key={notification.id}
                className="flex items-start gap-3 rounded-xl border border-border p-3.5"
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                    notification.isRead
                      ? "bg-border/60 text-muted"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-relaxed text-foreground">
                    {notification.message}
                  </p>
                  <p className="mt-1 text-xs capitalize text-muted">
                    {notification.type} · {timeAgo(notification.createdAt)}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </DashboardCard>
  );
}

export default NotificationsPanel;
