import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/common/Button";
import { FormInput } from "@/components/common/FormInput";
import { Modal } from "@/components/common/Modal";
import { certificateSchema } from "@/utils/validationSchemas";

const EMPTY_VALUES = {
  name: "",
  issuer: "",
  issueDate: "",
  expiryDate: "",
  credentialId: "",
  certificateUrl: "",
};

function toFormValues(certificate) {
  if (!certificate) return EMPTY_VALUES;
  return {
    name: certificate.name ?? "",
    issuer: certificate.issuer ?? "",
    issueDate: certificate.issueDate ?? "",
    expiryDate: certificate.expiryDate ?? "",
    credentialId: certificate.credentialId ?? "",
    certificateUrl: certificate.certificateUrl ?? "",
  };
}

export function CertificateFormModal({
  open,
  onClose,
  certificate,
  onSubmit,
  isSubmitting,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(certificateSchema),
    values: toFormValues(certificate),
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={certificate ? "Edit certificate" : "Add certificate"}
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <FormInput
          label="Certificate name"
          error={errors.name?.message}
          {...register("name")}
        />
        <FormInput
          label="Issuer"
          error={errors.issuer?.message}
          {...register("issuer")}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormInput
            label="Issue date"
            type="date"
            error={errors.issueDate?.message}
            {...register("issueDate")}
          />
          <FormInput
            label="Expiry date (optional)"
            type="date"
            error={errors.expiryDate?.message}
            {...register("expiryDate")}
          />
        </div>

        <FormInput
          label="Credential ID"
          error={errors.credentialId?.message}
          {...register("credentialId")}
        />
        <FormInput
          label="Certificate URL"
          error={errors.certificateUrl?.message}
          {...register("certificateUrl")}
        />

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
            {certificate ? "Save changes" : "Add certificate"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default CertificateFormModal;
