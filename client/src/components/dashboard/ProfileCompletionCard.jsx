import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Circle } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/common/Button";
import { ProgressRing } from "@/components/common/ProgressRing";
import { Skeleton } from "@/components/common/Skeleton";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { DASHBOARD_QUERY_KEYS } from "@/constants/dashboard";
import { getProfileCompletion } from "@/services/dashboardService";

function comingSoon() {
  toast("Profile editing isn't built yet — Dashboard Home comes first.", {
    icon: "🚧",
  });
}

export function ProfileCompletionCard({ className }) {
  const { data, isLoading } = useQuery({
    queryKey: [DASHBOARD_QUERY_KEYS.PROFILE_COMPLETION],
    queryFn: getProfileCompletion,
  });

  return (
    <DashboardCard title="Profile completion" className={className}>
      {isLoading ? (
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-28 w-28 rounded-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-5">
          <ProgressRing
            value={data?.percentage ?? 0}
            size={112}
            strokeWidth={9}
          />

          {data?.missingFields?.length > 0 ? (
            <ul className="w-full space-y-2">
              {data.missingFields.map((field) => (
                <li
                  key={field}
                  className="flex items-center gap-2 text-sm text-muted"
                >
                  <Circle className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  {field}
                </li>
              ))}
            </ul>
          ) : (
            <p className="flex items-center gap-2 text-sm text-success">
              <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden />
              Your profile is complete
            </p>
          )}

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={comingSoon}
            className="w-full"
          >
            Complete profile
          </Button>
        </div>
      )}
    </DashboardCard>
  );
}

export default ProfileCompletionCard;
