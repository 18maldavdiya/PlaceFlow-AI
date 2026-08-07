import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/common/Button";
import { FormInput } from "@/components/common/FormInput";
import { Modal } from "@/components/common/Modal";
import { projectSchema } from "@/utils/validationSchemas";

const EMPTY_VALUES = {
  title: "",
  description: "",
  technologies: "",
  githubUrl: "",
  liveUrl: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
};

function toFormValues(project) {
  if (!project) return EMPTY_VALUES;
  return {
    title: project.title ?? "",
    description: project.description ?? "",
    technologies: (project.technologies ?? []).join(", "),
    githubUrl: project.githubUrl ?? "",
    liveUrl: project.liveUrl ?? "",
    startDate: project.startDate ?? "",
    endDate: project.endDate ?? "",
    isCurrent: Boolean(project.isCurrent),
  };
}

export function ProjectFormModal({
  open,
  onClose,
  project,
  onSubmit,
  isSubmitting,
}) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(projectSchema),
    values: toFormValues(project),
  });

  const isCurrent = watch("isCurrent");

  function handleFormSubmit(values) {
    onSubmit({
      ...values,
      technologies: values.technologies
        .split(",")
        .map((tech) => tech.trim())
        .filter(Boolean),
      endDate: values.isCurrent ? "" : values.endDate,
    });
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={project ? "Edit project" : "Add project"}
    >
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        noValidate
        className="space-y-4"
      >
        <FormInput
          label="Project title"
          error={errors.title?.message}
          {...register("title")}
        />

        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">
            Description
          </label>
          <textarea
            rows={3}
            className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            {...register("description")}
          />
        </div>

        <FormInput
          label="Technologies used (comma-separated)"
          placeholder="React, Node.js, MongoDB"
          {...register("technologies")}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormInput
            label="GitHub URL"
            error={errors.githubUrl?.message}
            {...register("githubUrl")}
          />
          <FormInput
            label="Live URL"
            error={errors.liveUrl?.message}
            {...register("liveUrl")}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormInput
            label="Start date"
            type="date"
            error={errors.startDate?.message}
            {...register("startDate")}
          />
          <FormInput
            label="End date"
            type="date"
            disabled={isCurrent}
            className={isCurrent ? "opacity-50" : undefined}
            error={errors.endDate?.message}
            {...register("endDate")}
          />
        </div>

        <label className="flex items-center gap-2.5 text-sm text-foreground">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-border text-primary focus:ring-primary/30"
            {...register("isCurrent")}
          />
          This is my current project
        </label>

        <div className="flex justify-end gap-2.5 pt-2">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="gradient"
            size="sm"
            isLoading={isSubmitting}
          >
            {project ? "Save changes" : "Add project"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default ProjectFormModal;
