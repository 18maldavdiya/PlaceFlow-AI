import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";

/**
 * Delete confirmations for Projects, Experience, and Certificates all use
 * this — built on the generic Modal rather than three one-off dialogs.
 */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  isConfirming,
  title = "Are you sure?",
  description,
  confirmLabel = "Delete",
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} className="max-w-sm">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-danger/10 text-danger">
          <AlertTriangle className="h-5 w-5" aria-hidden />
        </span>
        <p className="text-sm leading-relaxed text-muted">{description}</p>
      </div>

      <div className="mt-6 flex justify-end gap-2.5">
        <Button type="button" variant="ghost" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="button"
          variant="danger"
          size="sm"
          isLoading={isConfirming}
          onClick={onConfirm}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;
