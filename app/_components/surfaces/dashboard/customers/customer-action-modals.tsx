"use client";

import { Button } from "@/_components/core/primitive/button";
import { useAdminT } from "../layout/admin-locale-provider";
import { ModalShell } from "./modal-shell";

export interface ExportConfirmModalProps {
  count: number;
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
}

export function ExportConfirmModal({
  count,
  onConfirm,
  onClose,
}: ExportConfirmModalProps) {
  const { t } = useAdminT();

  return (
    <ModalShell
      title={t("customers.modals.export.title")}
      description={t("customers.modals.export.description", { count })}
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button variant="primary" onClick={onConfirm}>
            {t("common.downloadCsv")}
          </Button>
        </>
      }
    >
      <p className="text-sm text-ink-muted">
        {t("customers.modals.export.compliance")}
      </p>
    </ModalShell>
  );
}
