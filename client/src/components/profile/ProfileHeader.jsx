import { motion } from "framer-motion";
import { Pencil } from "lucide-react";

import { ProgressRing } from "@/components/common/ProgressRing";
import { Skeleton } from "@/components/common/Skeleton";
import { AvatarUpload } from "@/components/profile/AvatarUpload";
import { resolveProfileImageUrl } from "@/services/profileService";

function scrollToPersonalInfo() {
  document
    .getElementById("personal-information")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function ProfileHeader({ profile, isLoading }) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
          <Skeleton className="h-28 w-28 shrink-0 rounded-full" />
          <div className="w-full space-y-2.5">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
      </div>
    );
  }

  const fullName = profile?.fullName ?? "";
  const branch = profile?.academic?.branch;
  const collegeName = profile?.academic?.collegeName;
  const semester = profile?.academic?.semester;

  const details = [
    branch,
    collegeName,
    semester ? `Semester ${semester}` : null,
  ].filter(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl border border-border bg-surface p-6 shadow-sm"
    >
      <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-center sm:text-left">
        <AvatarUpload
          imageUrl={resolveProfileImageUrl(profile?.profileImageUrl)}
          fullName={fullName}
        />

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            {fullName}
          </h1>
          {details.length > 0 ? (
            <p className="mt-1 truncate text-sm text-muted">
              {details.join(" · ")}
            </p>
          ) : (
            <p className="mt-1 text-sm text-muted">
              Add your college and branch below to complete your profile.
            </p>
          )}

          <button
            type="button"
            onClick={scrollToPersonalInfo}
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-border px-3.5 py-2 text-xs font-medium text-foreground transition-colors hover:bg-background"
          >
            <Pencil className="h-3.5 w-3.5" aria-hidden />
            Edit profile
          </button>
        </div>

        <div className="flex shrink-0 items-center gap-6">
          <div className="flex flex-col items-center gap-1.5">
            <ProgressRing
              value={profile?.placementReadinessScore ?? 0}
              size={76}
              strokeWidth={6}
            />
            <p className="text-[11px] font-medium text-muted">Readiness</p>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <ProgressRing
              value={profile?.completion?.percentage ?? 0}
              size={76}
              strokeWidth={6}
              progressClassName="text-success"
            />
            <p className="text-[11px] font-medium text-muted">Complete</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default ProfileHeader;
