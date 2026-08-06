import { useQuery } from "@tanstack/react-query";
import { ClipboardList } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/common/Button";
import { Skeleton } from "@/components/common/Skeleton";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import {
  APPLICATION_STATUS_STYLES,
  DASHBOARD_QUERY_KEYS,
} from "@/constants/dashboard";
import { getRecentApplications } from "@/services/dashboardService";
import { formatDate } from "@/utils/formatDate";

function comingSoon() {
  toast(
    "The Applications module isn't built yet — Dashboard Home comes first.",
    {
      icon: "🚧",
    },
  );
}

export function RecentApplications({ className }) {
  const { data: applications = [], isLoading } = useQuery({
    queryKey: [DASHBOARD_QUERY_KEYS.RECENT_APPLICATIONS],
    queryFn: () => getRecentApplications(5),
  });

  return (
    <DashboardCard title="Recent applications" className={className}>
      {isLoading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <ClipboardList className="h-8 w-8 text-muted" aria-hidden />
          <p className="text-sm text-muted">
            You haven&rsquo;t applied to anything yet.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wider text-muted">
                <th className="pb-2.5 font-medium">Company</th>
                <th className="pb-2.5 font-medium">Role</th>
                <th className="pb-2.5 font-medium">Applied</th>
                <th className="pb-2.5 font-medium">Status</th>
                <th className="pb-2.5" />
              </tr>
            </thead>
            <tbody>
              {applications.map((application) => {
                const statusStyle =
                  APPLICATION_STATUS_STYLES[application.status] ??
                  APPLICATION_STATUS_STYLES.applied;
                return (
                  <tr
                    key={application.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="py-3 font-medium text-foreground">
                      {application.company}
                    </td>
                    <td className="py-3 text-muted">{application.role}</td>
                    <td className="py-3 text-muted">
                      {formatDate(application.appliedAt)}
                    </td>
                    <td className="py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyle.className}`}
                      >
                        {statusStyle.label}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={comingSoon}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </DashboardCard>
  );
}

export default RecentApplications;
