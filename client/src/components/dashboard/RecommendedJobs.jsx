import { useQuery } from "@tanstack/react-query";
import { Briefcase, MapPin, Wallet } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/common/Button";
import { Skeleton } from "@/components/common/Skeleton";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { DASHBOARD_QUERY_KEYS } from "@/constants/dashboard";
import { getRecommendedJobs } from "@/services/dashboardService";

function comingSoon() {
  toast("The Jobs module isn't built yet — Dashboard Home comes first.", {
    icon: "🚧",
  });
}

export function RecommendedJobs({ className }) {
  const { data: jobs = [], isLoading } = useQuery({
    queryKey: [DASHBOARD_QUERY_KEYS.RECOMMENDED_JOBS],
    queryFn: () => getRecommendedJobs(6),
  });

  return (
    <DashboardCard title="Recommended jobs" className={className}>
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <Briefcase className="h-8 w-8 text-muted" aria-hidden />
          <p className="text-sm text-muted">No open drives right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="flex flex-col rounded-xl border border-border p-4 transition-shadow duration-300 hover:shadow-lg hover:shadow-primary/5"
            >
              <p className="text-sm font-semibold text-foreground">
                {job.company}
              </p>
              <p className="text-xs text-muted">{job.role}</p>

              <div className="mt-3 space-y-1.5">
                {job.location && (
                  <p className="flex items-center gap-1.5 text-xs text-muted">
                    <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    {job.location}
                  </p>
                )}
                {job.salaryRange && (
                  <p className="flex items-center gap-1.5 text-xs text-muted">
                    <Wallet className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    {job.salaryRange}
                  </p>
                )}
              </div>

              {job.eligibility && (
                <p className="mt-3 line-clamp-2 text-xs text-muted">
                  {job.eligibility}
                </p>
              )}

              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={comingSoon}
                className="mt-4 w-full"
              >
                Apply
              </Button>
            </div>
          ))}
        </div>
      )}
    </DashboardCard>
  );
}

export default RecommendedJobs;
