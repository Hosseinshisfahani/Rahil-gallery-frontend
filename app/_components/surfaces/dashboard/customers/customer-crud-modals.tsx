"use client";

import { useState } from "react";
import { Button } from "@/_components/core/primitive/button";
import { Input } from "@/_components/core/primitive/input";
import { useAdminT } from "../layout/admin-locale-provider";
import { ModalShell } from "./modal-shell";

export interface DeleteCustomerModalProps {
  customerName: string;
  customerId: string;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}

export function DeleteCustomerModal({
  customerName,
  customerId,
  onConfirm,
  onClose,
}: DeleteCustomerModalProps) {
  const { t } = useAdminT();
  const [confirmId, setConfirmId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canDelete = confirmId === customerId;

  async function handleDelete() {
    setSubmitting(true);
    setError(null);
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("customers.modals.delete.failed"),
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ModalShell
      title={t("customers.modals.delete.title")}
      description={t("customers.modals.delete.description")}
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={submitting}>
            {t("common.cancel")}
          </Button>
          <Button
            variant="primary"
            className="bg-error hover:bg-error/90"
            disabled={!canDelete || submitting}
            onClick={handleDelete}
          >
            {submitting ? t("common.deleting") : t("customers.modals.delete.confirm")}
          </Button>
        </>
      }
    >
      {error && (
        <p className="mb-4 text-sm text-error" role="alert">
          {error}
        </p>
      )}
      <p className="mb-4 text-sm text-ink">
        {t("customers.modals.delete.prompt", { name: customerName })}{" "}
        <code className="rounded bg-surface-elevated px-1.5 py-0.5 font-mono text-xs">
          {customerId}
        </code>
      </p>
      <p className="mb-2 text-sm text-ink-muted">
        {t("customers.modals.delete.typeId")}
      </p>
      <Input
        value={confirmId}
        onChange={(e) => setConfirmId(e.target.value)}
        placeholder={customerId}
        aria-label={t("customers.modals.delete.confirmIdAria")}
        className="font-mono"
      />
    </ModalShell>
  );
}
