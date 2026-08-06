import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/common/Button";
import { ProgressRing } from "@/components/common/ProgressRing";
import { Skeleton } from "@/components/common/Skeleton";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { DASHBOARD_QUERY_KEYS } from "@/constants/dashboard";
import { getSummary } from "@/services/dashboardService";

function comingSoon() {
  toast("Profile editing isn't built yet — Dashboard Home comes first.", {
    icon: "🚧",
  });
}

export function WelcomeCard() {
  const { data, isLoading } = useQuery({
    queryKey: [DASHBOARD_QUERY_KEYS.SUMMARY],
    queryFn: getSummary,
  });

  if (isLoading) {
    return (
      <DashboardCard>
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full space-y-2.5 sm:max-w-xs">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-56" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-24 w-24 shrink-0 rounded-full" />
        </div>
      </DashboardCard>
    );
  }

  const profile = data?.profile;
  const details = [
    ["College", profile?.college],
    ["Branch", profile?.branch],
    ["Semester", profile?.semester ? `Semester ${profile.semester}` : null],
  ].filter(([, value]) => Boolean(value));

  return (
    <DashboardCard>
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            {profile?.fullName}
          </h1>
          {details.length > 0 ? (
            <p className="mt-1.5 text-sm text-muted">
              {details.map(([, value]) => value).join(" · ")}
            </p>
          ) : (
            <p className="mt-1.5 text-sm text-muted">
              Add your college and branch to personalize your dashboard.
            </p>
          )}
          <Button
            type="button"
            variant="gradient"
            size="sm"
            onClick={comingSoon}
            className="mt-5"
          >
            Complete your profile
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
        </div>

        <div className="flex shrink-0 flex-col items-center gap-1.5">
          <ProgressRing
            value={profile?.placementReadinessScore ?? 0}
            size={96}
          />
          <p className="text-xs font-medium text-muted">Placement readiness</p>
        </div>
      </div>
    </DashboardCard>
  );
}

export default WelcomeCard;
