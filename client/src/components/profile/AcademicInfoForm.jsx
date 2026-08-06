import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { Button } from "@/components/common/Button";
import { FormInput } from "@/components/common/FormInput";
import { Skeleton } from "@/components/common/Skeleton";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { PROFILE_QUERY_KEY } from "@/constants/profile";
import { updateProfile } from "@/services/profileService";
import { academicInfoSchema } from "@/utils/validationSchemas";

function FormSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {Array.from({ length: 9 }).map((_, index) => (
        <Skeleton key={index} className="h-11 w-full" />
      ))}
    </div>
  );
}

export function AcademicInfoForm({ profile, isLoading }) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(academicInfoSchema),
    values: profile?.academic,
  });

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      toast.success("Academic information saved.");
      queryClient.invalidateQueries({ queryKey: [PROFILE_QUERY_KEY] });
    },
    onError: (error) => {
      toast.error(error?.message ?? "Couldn't save your changes.");
    },
  });

  function onSubmit(values) {
    mutation.mutate(values);
  }

  return (
    <DashboardCard title="Academic information">
      {isLoading ? (
        <FormSkeleton />
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-4"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormInput
              label="College name"
              error={errors.collegeName?.message}
              {...register("collegeName")}
            />
            <FormInput
              label="University"
              error={errors.university?.message}
              {...register("university")}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <FormInput
              label="Degree"
              error={errors.degree?.message}
              {...register("degree")}
            />
            <FormInput
              label="Branch"
              error={errors.branch?.message}
              {...register("branch")}
            />
            <FormInput
              label="Semester"
              type="number"
              min={1}
              max={12}
              error={errors.semester?.message}
              {...register("semester")}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <FormInput
              label="CGPA"
              type="number"
              step="0.01"
              min={0}
              max={10}
              error={errors.cgpa?.message}
              {...register("cgpa")}
            />
            <FormInput
              label="Graduation year"
              type="number"
              error={errors.graduationYear?.message}
              {...register("graduationYear")}
            />
            <FormInput
              label="Enrollment number"
              error={errors.enrollmentNumber?.message}
              {...register("enrollmentNumber")}
            />
          </div>

          <FormInput
            label="Student ID"
            error={errors.studentId?.message}
            {...register("studentId")}
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="gradient"
              size="sm"
              isLoading={mutation.isPending}
              disabled={!isDirty}
            >
              Save changes
            </Button>
          </div>
        </form>
      )}
    </DashboardCard>
  );
}

export default AcademicInfoForm;
