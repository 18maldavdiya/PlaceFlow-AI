import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Award, Plus } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/common/Button";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Skeleton } from "@/components/common/Skeleton";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { CertificateFormModal } from "@/components/profile/CertificateFormModal";
import { EntityListCard } from "@/components/profile/EntityListCard";
import { PROFILE_QUERY_KEY } from "@/constants/profile";
import {
  addCertificate,
  deleteCertificate,
  updateCertificate,
} from "@/services/profileService";
import { formatDate } from "@/utils/formatDate";

export function CertificatesSection({ profile, isLoading }) {
  const queryClient = useQueryClient();
  const [formState, setFormState] = useState({
    open: false,
    certificate: null,
  });
  const [deleteTarget, setDeleteTarget] = useState(null);

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: [PROFILE_QUERY_KEY] });
  }

  const addMutation = useMutation({
    mutationFn: addCertificate,
    onSuccess: () => {
      toast.success("Certificate added.");
      invalidate();
      setFormState({ open: false, certificate: null });
    },
    onError: (error) =>
      toast.error(error?.message ?? "Couldn't add that certificate."),
  });

  const updateMutation = useMutation({
    mutationFn: ({ certificateId, payload }) =>
      updateCertificate(certificateId, payload),
    onSuccess: () => {
      toast.success("Certificate updated.");
      invalidate();
      setFormState({ open: false, certificate: null });
    },
    onError: (error) =>
      toast.error(error?.message ?? "Couldn't update that certificate."),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCertificate,
    onSuccess: () => {
      toast.success("Certificate removed.");
      invalidate();
      setDeleteTarget(null);
    },
    onError: (error) =>
      toast.error(error?.message ?? "Couldn't remove that certificate."),
  });

  function handleSubmit(values) {
    if (formState.certificate) {
      updateMutation.mutate({
        certificateId: formState.certificate.id,
        payload: values,
      });
    } else {
      addMutation.mutate(values);
    }
  }

  const certificates = profile?.certificates ?? [];

  return (
    <DashboardCard
      title="Certificates"
      action={
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => setFormState({ open: true, certificate: null })}
        >
          <Plus className="h-4 w-4" aria-hidden />
          Add certificate
        </Button>
      }
    >
      {isLoading ? (
        <div className="space-y-3">
          {[0, 1].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : certificates.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <Award className="h-8 w-8 text-muted" aria-hidden />
          <p className="text-sm text-muted">No certificates added yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {certificates.map((certificate) => (
            <EntityListCard
              key={certificate.id}
              title={certificate.name}
              subtitle={certificate.issuer}
              meta={`Issued ${formatDate(certificate.issueDate)}${
                certificate.expiryDate
                  ? ` · Expires ${formatDate(certificate.expiryDate)}`
                  : ""
              }${certificate.credentialId ? ` · ID: ${certificate.credentialId}` : ""}`}
              links={[
                certificate.certificateUrl && {
                  label: "View certificate",
                  href: certificate.certificateUrl,
                },
              ].filter(Boolean)}
              onEdit={() => setFormState({ open: true, certificate })}
              onDelete={() => setDeleteTarget(certificate)}
            />
          ))}
        </div>
      )}

      <CertificateFormModal
        open={formState.open}
        onClose={() => setFormState({ open: false, certificate: null })}
        certificate={formState.certificate}
        onSubmit={handleSubmit}
        isSubmitting={addMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteMutation.mutate(deleteTarget.id)}
        isConfirming={deleteMutation.isPending}
        title="Delete certificate"
        description={`Remove "${deleteTarget?.name}" from your profile? This can't be undone.`}
      />
    </DashboardCard>
  );
}

export default CertificatesSection;
