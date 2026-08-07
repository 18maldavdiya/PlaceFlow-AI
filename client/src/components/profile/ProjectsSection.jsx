import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FolderGit2, Plus } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/common/Button";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Skeleton } from "@/components/common/Skeleton";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { EntityListCard } from "@/components/profile/EntityListCard";
import { ProjectFormModal } from "@/components/profile/ProjectFormModal";
import { PROFILE_QUERY_KEY } from "@/constants/profile";
import {
  addProject,
  deleteProject,
  updateProject,
} from "@/services/profileService";
import { formatDate } from "@/utils/formatDate";

export function ProjectsSection({ profile, isLoading }) {
  const queryClient = useQueryClient();
  const [formState, setFormState] = useState({ open: false, project: null });
  const [deleteTarget, setDeleteTarget] = useState(null);

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: [PROFILE_QUERY_KEY] });
  }

  const addMutation = useMutation({
    mutationFn: addProject,
    onSuccess: () => {
      toast.success("Project added.");
      invalidate();
      setFormState({ open: false, project: null });
    },
    onError: (error) =>
      toast.error(error?.message ?? "Couldn't add that project."),
  });

  const updateMutation = useMutation({
    mutationFn: ({ projectId, payload }) => updateProject(projectId, payload),
    onSuccess: () => {
      toast.success("Project updated.");
      invalidate();
      setFormState({ open: false, project: null });
    },
    onError: (error) =>
      toast.error(error?.message ?? "Couldn't update that project."),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      toast.success("Project removed.");
      invalidate();
      setDeleteTarget(null);
    },
    onError: (error) =>
      toast.error(error?.message ?? "Couldn't remove that project."),
  });

  function handleSubmit(values) {
    if (formState.project) {
      updateMutation.mutate({
        projectId: formState.project.id,
        payload: values,
      });
    } else {
      addMutation.mutate(values);
    }
  }

  const projects = profile?.projects ?? [];

  return (
    <DashboardCard
      title="Projects"
      action={
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => setFormState({ open: true, project: null })}
        >
          <Plus className="h-4 w-4" aria-hidden />
          Add project
        </Button>
      }
    >
      {isLoading ? (
        <div className="space-y-3">
          {[0, 1].map((i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <FolderGit2 className="h-8 w-8 text-muted" aria-hidden />
          <p className="text-sm text-muted">No projects added yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => (
            <EntityListCard
              key={project.id}
              title={project.title}
              badge={project.isCurrent ? "Current" : null}
              meta={`${formatDate(project.startDate)} — ${
                project.isCurrent ? "Present" : formatDate(project.endDate)
              }`}
              description={project.description}
              tags={project.technologies}
              links={[
                project.githubUrl && {
                  label: "GitHub",
                  href: project.githubUrl,
                },
                project.liveUrl && {
                  label: "Live site",
                  href: project.liveUrl,
                },
              ].filter(Boolean)}
              onEdit={() => setFormState({ open: true, project })}
              onDelete={() => setDeleteTarget(project)}
            />
          ))}
        </div>
      )}

      <ProjectFormModal
        open={formState.open}
        onClose={() => setFormState({ open: false, project: null })}
        project={formState.project}
        onSubmit={handleSubmit}
        isSubmitting={addMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteMutation.mutate(deleteTarget.id)}
        isConfirming={deleteMutation.isPending}
        title="Delete project"
        description={`Remove "${deleteTarget?.title}" from your profile? This can't be undone.`}
      />
    </DashboardCard>
  );
}

export default ProjectsSection;
