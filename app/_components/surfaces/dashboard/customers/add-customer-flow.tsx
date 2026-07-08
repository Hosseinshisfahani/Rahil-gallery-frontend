"use client";

import { useState } from "react";
import { Button } from "@/_components/core/primitive/button";
import type { CustomerImportProfile } from "../data/mock-customers";
import { useAdminT } from "../layout/admin-locale-provider";
import { ModalShell } from "./modal-shell";
import {
  CustomerHistoryImportForm,
  emptyImportProfile,
  importProfileToForm,
  validateImportProfile,
} from "./customer-history-import-form";

export interface ImportProfileSubmit {
  profile: CustomerImportProfile;
  signatureFile?: File | null;
  removeSignature?: boolean;
}

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
        err instanceof Error ? err.message : t("customers.modals.addFlow.importFailed"),
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
          <Button variant="primary" onClick={handleSubmit} disabled={submitting}>
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
  customer: import("../data/mock-customers").CustomerDetail;
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
        err instanceof Error ? err.message : t("customers.modals.addFlow.editCrmFailed"),
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
          <Button variant="primary" onClick={handleSubmit} disabled={submitting}>
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
