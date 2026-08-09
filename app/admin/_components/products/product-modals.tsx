"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ModalShell } from "@/components/admin/ui/modal-shell";
import { useAdminT } from "../layout/admin-locale-provider";

export interface ArchiveProductModalProps {
  productName: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function ArchiveProductModal({
  productName,
  onClose,
  onConfirm,
}: ArchiveProductModalProps) {
  const { t } = useAdminT();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleArchive() {
    setSubmitting(true);
    setError(null);
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("products.archiveFailed"),
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ModalShell
      title={t("customers.modals.archiveProduct.title")}
      description={t("customers.modals.archiveProduct.description")}
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={submitting}>
            {t("common.cancel")}
          </Button>
          <Button
            variant="default"
            className="bg-error hover:bg-error/90"
            onClick={handleArchive}
            disabled={submitting}
          >
            {submitting ? t("common.archiving") : t("common.archive")}
          </Button>
        </>
      }
    >
      {error && (
        <p className="text-sm text-error" role="alert">
          {error}
        </p>
      )}
      <p className="text-sm text-ink">
        {t("customers.modals.archiveProduct.confirm", { name: productName })}
      </p>
    </ModalShell>
  );
}
