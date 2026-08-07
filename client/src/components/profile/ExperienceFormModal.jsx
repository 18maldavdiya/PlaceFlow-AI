import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/common/Button";
import { FormInput } from "@/components/common/FormInput";
import { Modal } from "@/components/common/Modal";
import { SelectInput } from "@/components/common/SelectInput";
import { INTERNSHIP_TYPE_OPTIONS } from "@/constants/profile";
import { experienceSchema } from "@/utils/validationSchemas";

const EMPTY_VALUES = {
  company: "",
  role: "",
  location: "",
  internshipType: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
  description: "",
};

function toFormValues(experience) {
  if (!experience) return EMPTY_VALUES;
  return {
    company: experience.company ?? "",
    role: experience.role ?? "",
    location: experience.location ?? "",
    internshipType: experience.internshipType ?? "",
    startDate: experience.startDate ?? "",
    endDate: experience.endDate ?? "",
    isCurrent: Boolean(experience.isCurrent),
    description: experience.description ?? "",
  };
}

export function ExperienceFormModal({
  open,
  onClose,
  experience,
  onSubmit,
  isSubmitting,
}) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(experienceSchema),
    values: toFormValues(experience),
  });

  const isCurrent = watch("isCurrent");

  function handleFormSubmit(values) {
    onSubmit({ ...values, endDate: values.isCurrent ? "" : values.endDate });
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={experience ? "Edit experience" : "Add experience"}
    >
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        noValidate
        className="space-y-4"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormInput
            label="Company"
            error={errors.company?.message}
            {...register("company")}
          />
          <FormInput
            label="Role"
            error={errors.role?.message}
            {...register("role")}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormInput
            label="Location"
            error={errors.location?.message}
            {...register("location")}
          />
          <SelectInput
            label="Internship type"
            options={INTERNSHIP_TYPE_OPTIONS}
            error={errors.internshipType?.message}
            {...register("internshipType")}
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
          I currently work here
        </label>

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
            {experience ? "Save changes" : "Add experience"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default ExperienceFormModal;
