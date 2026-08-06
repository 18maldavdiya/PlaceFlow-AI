import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { Button } from "@/components/common/Button";
import { FormInput } from "@/components/common/FormInput";
import { SelectInput } from "@/components/common/SelectInput";
import { Skeleton } from "@/components/common/Skeleton";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { GENDER_OPTIONS, PROFILE_QUERY_KEY } from "@/constants/profile";
import { updateProfile } from "@/services/profileService";
import { personalInfoSchema } from "@/utils/validationSchemas";

function FormSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {Array.from({ length: 8 }).map((_, index) => (
        <Skeleton key={index} className="h-11 w-full" />
      ))}
    </div>
  );
}

export function PersonalInfoForm({ profile, isLoading }) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(personalInfoSchema),
    values: profile?.personal,
  });

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      toast.success("Personal information saved.");
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
    <DashboardCard title="Personal information">
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
              label="First name"
              error={errors.firstName?.message}
              {...register("firstName")}
            />
            <FormInput
              label="Last name"
              error={errors.lastName?.message}
              {...register("lastName")}
            />
            <FormInput
              label="Email address"
              value={profile?.email ?? ""}
              readOnly
              disabled
              className="opacity-70"
            />
            <FormInput
              label="Phone number"
              type="tel"
              error={errors.phoneNumber?.message}
              {...register("phoneNumber")}
            />
            <SelectInput
              label="Gender"
              options={GENDER_OPTIONS}
              error={errors.gender?.message}
              {...register("gender")}
            />
            <FormInput
              label="Date of birth"
              type="date"
              error={errors.dateOfBirth?.message}
              {...register("dateOfBirth")}
            />
          </div>

          <FormInput
            label="Address"
            error={errors.address?.message}
            {...register("address")}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <FormInput
              label="City"
              error={errors.city?.message}
              {...register("city")}
            />
            <FormInput
              label="State"
              error={errors.state?.message}
              {...register("state")}
            />
            <FormInput
              label="Country"
              error={errors.country?.message}
              {...register("country")}
            />
            <FormInput
              label="Pincode"
              error={errors.pincode?.message}
              {...register("pincode")}
            />
          </div>

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

export default PersonalInfoForm;
