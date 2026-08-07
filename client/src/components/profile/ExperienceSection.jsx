import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Briefcase, Plus } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/common/Button";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Skeleton } from "@/components/common/Skeleton";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { EntityListCard } from "@/components/profile/EntityListCard";
import { ExperienceFormModal } from "@/components/profile/ExperienceFormModal";
import {
  INTERNSHIP_TYPE_OPTIONS,
  PROFILE_QUERY_KEY,
} from "@/constants/profile";
import {
  addExperience,
  deleteExperience,
  updateExperience,
} from "@/services/profileService";
import { formatDate } from "@/utils/formatDate";

const INTERNSHIP_TYPE_LABELS = Object.fromEntries(
  INTERNSHIP_TYPE_OPTIONS.map((option) => [option.value, option.label]),
);

export function ExperienceSection({ profile, isLoading }) {
  const queryClient = useQueryClient();
  const [formState, setFormState] = useState({ open: false, experience: null });
  const [deleteTarget, setDeleteTarget] = useState(null);

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: [PROFILE_QUERY_KEY] });
  }

  const addMutation = useMutation({
    mutationFn: addExperience,
    onSuccess: () => {
      toast.success("Experience added.");
      invalidate();
      setFormState({ open: false, experience: null });
    },
    onError: (error) =>
      toast.error(error?.message ?? "Couldn't add that experience."),
  });

  const updateMutation = useMutation({
    mutationFn: ({ experienceId, payload }) =>
      updateExperience(experienceId, payload),
    onSuccess: () => {
      toast.success("Experience updated.");
      invalidate();
      setFormState({ open: false, experience: null });
    },
    onError: (error) =>
      toast.error(error?.message ?? "Couldn't update that experience."),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteExperience,
    onSuccess: () => {
      toast.success("Experience removed.");
      invalidate();
      setDeleteTarget(null);
    },
    onError: (error) =>
      toast.error(error?.message ?? "Couldn't remove that experience."),
  });

  function handleSubmit(values) {
    if (formState.experience) {
      updateMutation.mutate({
        experienceId: formState.experience.id,
        payload: values,
      });
    } else {
      addMutation.mutate(values);
    }
  }

  const experienceList = profile?.experience ?? [];

  return (
    <DashboardCard
      title="Experience"
      action={
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => setFormState({ open: true, experience: null })}
        >
          <Plus className="h-4 w-4" aria-hidden />
          Add experience
        </Button>
      }
    >
      {isLoading ? (
        <div className="space-y-3">
          {[0, 1].map((i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
      ) : experienceList.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <Briefcase className="h-8 w-8 text-muted" aria-hidden />
          <p className="text-sm text-muted">No experience added yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {experienceList.map((experience) => (
            <EntityListCard
              key={experience.id}
              title={experience.role}
              subtitle={[experience.company, experience.location]
                .filter(Boolean)
                .join(" · ")}
              badge={experience.isCurrent ? "Current" : null}
              meta={`${INTERNSHIP_TYPE_LABELS[experience.internshipType] ?? experience.internshipType} · ${formatDate(experience.startDate)} — ${
                experience.isCurrent
                  ? "Present"
                  : formatDate(experience.endDate)
              }`}
              description={experience.description}
              onEdit={() => setFormState({ open: true, experience })}
              onDelete={() => setDeleteTarget(experience)}
            />
          ))}
        </div>
      )}

      <ExperienceFormModal
        open={formState.open}
        onClose={() => setFormState({ open: false, experience: null })}
        experience={formState.experience}
        onSubmit={handleSubmit}
        isSubmitting={addMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteMutation.mutate(deleteTarget.id)}
        isConfirming={deleteMutation.isPending}
        title="Delete experience"
        description={`Remove your role at "${deleteTarget?.company}" from your profile? This can't be undone.`}
      />
    </DashboardCard>
  );
}

export default ExperienceSection;
