"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/_components/core/primitive/button";
import type { CustomerImportProfile } from "../data/mock-customers";
import { useAdminT } from "../layout/admin-locale-provider";
import { ModalShell } from "./modal-shell";
import {
  CreateCustomerModal,
  type CustomerFormValues,
} from "./customer-crud-modals";
import {
  CustomerHistoryImportForm,
  emptyImportProfile,
  importProfileToForm,
  validateImportProfile,
} from "./customer-history-import-form";

type AddStep = "choose" | "quick" | "history";

export interface ImportProfileSubmit {
  profile: CustomerImportProfile;
  signatureFile?: File | null;
  removeSignature?: boolean;
}

export interface AddCustomerFlowModalProps {
  onQuickAdd: (values: CustomerFormValues) => Promise<void>;
  onHistoryAdd: (payload: ImportProfileSubmit) => Promise<void>;
  onClose: () => void;
}

export function AddCustomerFlowModal({
  onQuickAdd,
  onHistoryAdd,
  onClose,
}: AddCustomerFlowModalProps) {
  const { t } = useAdminT();
  const [step, setStep] = useState<AddStep>("choose");

  if (step === "quick") {
    return (
      <CreateCustomerModal
        onClose={() => setStep("choose")}
        onConfirm={async (values) => {
          await onQuickAdd(values);
          onClose();
        }}
      />
    );
  }

  if (step === "history") {
    return (
      <HistoryIncludedImportModal
        onClose={() => setStep("choose")}
        onConfirm={async (payload) => {
          await onHistoryAdd(payload);
          onClose();
        }}
      />
    );
  }

  return (
    <ModalShell
      title={t("customers.modals.addFlow.title")}
      onClose={onClose}
      size="md"
      footer={
        <Button variant="ghost" onClick={onClose}>
          {t("common.cancel")}
        </Button>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setStep("quick")}
          className={cn(
            "flex flex-col gap-2 rounded-[var(--radius-md)] border p-4 text-start transition-colors",
            "border-border bg-surface hover:border-primary hover:bg-surface-elevated/80",
          )}
        >
          <span className="text-sm font-semibold text-ink">
            {t("customers.modals.addFlow.quickAdd")}
          </span>
          <span className="text-xs text-ink-muted">
            {t("customers.modals.addFlow.quickAddDesc")}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setStep("history")}
          className={cn(
            "flex flex-col gap-2 rounded-[var(--radius-md)] border p-4 text-start transition-colors",
            "border-border bg-surface hover:border-accent hover:bg-accent/5",
          )}
        >
          <span className="text-sm font-semibold text-ink">
            {t("customers.modals.addFlow.historyIncluded")}
          </span>
          <span className="text-xs text-ink-muted">
            {t("customers.modals.addFlow.historyIncludedDesc")}
          </span>
        </button>
      </div>
    </ModalShell>
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
  const [values, setValues] = useState(() =>
    customer.importProfile
      ? importProfileToForm(customer.importProfile)
      : emptyImportProfile(),
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
