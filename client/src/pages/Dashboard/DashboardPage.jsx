import { NotificationsPanel } from "@/components/dashboard/NotificationsPanel";
import { ProfileCompletionCard } from "@/components/dashboard/ProfileCompletionCard";
import { RecentApplications } from "@/components/dashboard/RecentApplications";
import { RecommendedJobs } from "@/components/dashboard/RecommendedJobs";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { UpcomingInterviews } from "@/components/dashboard/UpcomingInterviews";
import { WelcomeCard } from "@/components/dashboard/WelcomeCard";

/**
 * Student Dashboard Home — the only dashboard page in this phase. Composed
 * entirely from components/dashboard/* sections, each independently backed
 * by its own /api/v1/dashboard/* endpoint (see server/src/routes/dashboard.routes.js).
 * Profile, Resume, Jobs, Applications, Mock Interview, and Settings are
 * deliberately not built — their sidebar entries exist but don't route
 * anywhere yet.
 */
export function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <WelcomeCard />
      <StatsGrid />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ProfileCompletionCard className="lg:col-span-1" />
        <UpcomingInterviews className="lg:col-span-2" />
      </div>

      <RecentApplications />
      <RecommendedJobs />
      <NotificationsPanel />
    </div>
  );
}

export default DashboardPage;
