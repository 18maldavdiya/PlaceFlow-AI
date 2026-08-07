import { useQuery } from "@tanstack/react-query";

import { AcademicInfoForm } from "@/components/profile/AcademicInfoForm";
import { CertificatesSection } from "@/components/profile/CertificatesSection";
import { ExperienceSection } from "@/components/profile/ExperienceSection";
import { PersonalInfoForm } from "@/components/profile/PersonalInfoForm";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProjectsSection } from "@/components/profile/ProjectsSection";
import { SkillsSection } from "@/components/profile/SkillsSection";
import { PROFILE_QUERY_KEY } from "@/constants/profile";
import { getProfile } from "@/services/profileService";

/**
 * Student Profile — Phase 5.2A (Profile Header, Personal Information,
 * Academic Information) is locked; none of those three components or their
 * markup below are modified. Phase 5.2B adds Skills, Projects, Experience,
 * and Certificates as further sections on the same page. The Resume
 * Builder, AI features, Jobs, and Applications are separate, later phases.
 * Rendered inside the existing, unmodified DashboardLayout (Sidebar +
 * TopNavbar) via routes/AppRouter.jsx.
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

      <SkillsSection profile={profile} isLoading={isLoading} />
      <ProjectsSection profile={profile} isLoading={isLoading} />
      <ExperienceSection profile={profile} isLoading={isLoading} />
      <CertificatesSection profile={profile} isLoading={isLoading} />
    </div>
  );
}

export default ProfilePage;
