"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CustomerDetail } from "@/lib/api/customers/types";
import { ModalShell } from "@/components/admin/ui/modal-shell";
import { useAdminT } from "../layout/admin-locale-provider";
import {
  CustomerHistoryImportForm,
  emptyImportProfile,
  importProfileToForm,
  validateImportProfile,
  type ImportProfileSubmit,
} from "./customer-forms";
import { customerMutationErrorMessage } from "./customers";

// --- ExportConfirmModal ---

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
          <Button variant="default" onClick={onConfirm}>
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

// --- DeleteCustomerModal ---

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
            variant="default"
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

// --- Add / edit CRM import flow ---

export type { ImportProfileSubmit } from "./customer-forms";

export interface AddCustomerFlowModalProps {
  onSubmit: (payload: ImportProfileSubmit) => Promise<void>;
  onClose: () => void;
}

export function AddCustomerFlowModal({
  onSubmit,
  onClose,
}: AddCustomerFlowModalProps) {
  useAdminT();
  return (
    <HistoryIncludedImportModal
      onClose={onClose}
      onConfirm={async (payload) => {
        await onSubmit(payload);
        onClose();
      }}
    />
  );
}

interface HistoryIncludedImportModalProps {
  onConfirm: (payload: ImportProfileSubmit) => Promise<void>;
  onClose: () => void;
}

function HistoryIncludedImportModal({
  onConfirm,
  onClose,
}: HistoryIncludedImportModalProps) {
  const { t } = useAdminT();
  const [values, setValues] = useState(emptyImportProfile);
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    const validationError = validateImportProfile(values, t);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await onConfirm({ profile: values, signatureFile });
      onClose();
    } catch (err) {
      setError(
        customerMutationErrorMessage(err, t, "customers.modals.addFlow.importFailed"),
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ModalShell
      title={t("customers.modals.addFlow.importTitle")}
      onClose={onClose}
      size="xl"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={submitting}>
            {t("common.back")}
          </Button>
          <Button variant="default" onClick={handleSubmit} disabled={submitting}>
            {submitting ? t("common.importing") : t("customers.modals.addFlow.importConfirm")}
          </Button>
        </>
      }
    >
      {error && (
        <p className="mb-4 text-sm text-error" role="alert">
          {error}
        </p>
      )}
      <CustomerHistoryImportForm
        values={values}
        onChange={setValues}
        signatureFile={signatureFile}
        onSignatureFileChange={setSignatureFile}
        idPrefix="history-import"
      />
    </ModalShell>
  );
}

interface EditHistoryImportModalProps {
  customer: CustomerDetail;
  onConfirm: (payload: ImportProfileSubmit) => Promise<void>;
  onClose: () => void;
}

export function EditHistoryImportModal({
  customer,
  onConfirm,
  onClose,
}: EditHistoryImportModalProps) {
  const { t } = useAdminT();
  const fullNameParts = customer.fullName.trim().split(/\s+/);
  const derivedFirst = fullNameParts[0] ?? "";
  const derivedLast = fullNameParts.slice(1).join(" ");
  const [values, setValues] = useState(() =>
    customer.importProfile
      ? importProfileToForm(customer.importProfile)
      : {
          ...emptyImportProfile(),
          firstName: derivedFirst,
          lastName: derivedLast,
          phone: customer.phone ?? "",
          email: customer.email ?? "",
        },
  );
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [removeSignature, setRemoveSignature] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    const validationError = validateImportProfile(values, t);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await onConfirm({ profile: values, signatureFile, removeSignature });
      onClose();
    } catch (err) {
      setError(
        customerMutationErrorMessage(err, t, "customers.modals.addFlow.editCrmFailed"),
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ModalShell
      title={t("customers.modals.addFlow.editCrm")}
      onClose={onClose}
      size="xl"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={submitting}>
            {t("common.cancel")}
          </Button>
          <Button variant="default" onClick={handleSubmit} disabled={submitting}>
            {submitting ? t("common.saving") : t("common.saveProfile")}
          </Button>
        </>
      }
    >
      {error && (
        <p className="mb-4 text-sm text-error" role="alert">
          {error}
        </p>
      )}
      <CustomerHistoryImportForm
        values={values}
        onChange={setValues}
        signatureFile={signatureFile}
        onSignatureFileChange={(file) => {
          setSignatureFile(file);
          if (file) setRemoveSignature(false);
        }}
        onSignatureRemove={() => setRemoveSignature(true)}
        idPrefix="edit-history"
      />
    </ModalShell>
  );
}
