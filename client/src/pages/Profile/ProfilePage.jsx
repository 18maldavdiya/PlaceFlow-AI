import { useQuery } from "@tanstack/react-query";

import { AcademicInfoForm } from "@/components/profile/AcademicInfoForm";
import { PersonalInfoForm } from "@/components/profile/PersonalInfoForm";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { PROFILE_QUERY_KEY } from "@/constants/profile";
import { getProfile } from "@/services/profileService";

/**
 * Student Profile Foundation (Phase 5.2A) — Profile Header, Personal
 * Information, and Academic Information only. Skills, Projects,
 * Experience, Certificates, and the Resume Builder are separate, later
 * phases. Rendered inside the existing, unmodified DashboardLayout
 * (Sidebar + TopNavbar) via routes/AppRouter.jsx.
 */
export function ProfilePage() {
  const { data: profile, isLoading } = useQuery({
    queryKey: [PROFILE_QUERY_KEY],
    queryFn: getProfile,
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <ProfileHeader profile={profile} isLoading={isLoading} />

      <div id="personal-information" className="scroll-mt-24">
        <PersonalInfoForm profile={profile} isLoading={isLoading} />
      </div>

      <div id="academic-information" className="scroll-mt-24">
        <AcademicInfoForm profile={profile} isLoading={isLoading} />
      </div>
    </div>
  );
}

export default ProfilePage;
