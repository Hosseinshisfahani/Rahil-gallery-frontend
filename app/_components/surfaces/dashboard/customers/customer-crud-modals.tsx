"use client";

import { useState } from "react";
import { Button } from "@/_components/core/primitive/button";
import { Input } from "@/_components/core/primitive/input";
import { Label } from "@/_components/core/primitive/label";
import { DashboardSelect, DashboardSelectOption } from "../abstract/dashboard-select";
import type { CustomerDetail } from "../data/mock-customers";
import { useAdminT } from "../layout/admin-locale-provider";
import { ModalShell } from "./modal-shell";

export interface CustomerFormValues {
  fullName: string;
  phone: string;
  email: string;
  locale: "fa" | "en";
  defaultRingSize: string;
  isVip: boolean;
}

export function emptyCustomerForm(): CustomerFormValues {
  return {
    fullName: "",
    phone: "",
    email: "",
    locale: "fa",
    defaultRingSize: "",
    isVip: false,
  };
}

export function customerToFormValues(customer: CustomerDetail): CustomerFormValues {
  return {
    fullName: customer.fullName,
    phone: customer.phone,
    email: customer.email ?? "",
    locale: customer.locale,
    defaultRingSize: customer.defaultRingSize ?? "",
    isVip: customer.isVip,
  };
}

export function CustomerFormFields({
  values,
  onChange,
  idPrefix = "customer",
  variant = "edit",
}: {
  values: CustomerFormValues;
  onChange: (values: CustomerFormValues) => void;
  idPrefix?: string;
  variant?: "create" | "edit";
}) {
  const { t } = useAdminT();
  const showLocale = variant !== "create";
  const showDefaultRingSize = variant !== "create";

  function update(partial: Partial<CustomerFormValues>) {
    onChange({ ...values, ...partial });
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Label htmlFor={`${idPrefix}-name`} required>
          {t("customers.fields.fullName")}
        </Label>
        <Input
          id={`${idPrefix}-name`}
          value={values.fullName}
          onChange={(e) => update({ fullName: e.target.value })}
          placeholder="Sara Mohammadi"
          className="mt-1.5"
        />
      </div>
      <div>
        <Label htmlFor={`${idPrefix}-phone`} required>
          {t("customers.fields.phone")}
        </Label>
        <Input
          id={`${idPrefix}-phone`}
          value={values.phone}
          onChange={(e) => update({ phone: e.target.value })}
          placeholder="+989121234567"
          className="mt-1.5 font-mono text-ltr"
          dir="ltr"
        />
      </div>
      <div>
        <Label htmlFor={`${idPrefix}-email`}>{t("customers.fields.email")}</Label>
        <Input
          id={`${idPrefix}-email`}
          type="email"
          value={values.email}
          onChange={(e) => update({ email: e.target.value })}
          placeholder="optional@example.com"
          className="mt-1.5"
        />
      </div>
      {(showLocale || showDefaultRingSize) && (
        <div
          className={
            showLocale && showDefaultRingSize ? "grid grid-cols-2 gap-3" : undefined
          }
        >
          {showLocale && (
            <div>
              <Label htmlFor={`${idPrefix}-locale`}>{t("customers.fields.language")}</Label>
              <DashboardSelect
                id={`${idPrefix}-locale`}
                value={values.locale}
                onChange={(e) =>
                  update({ locale: e.target.value as "fa" | "en" })
                }
                className="mt-1.5"
              >
                <DashboardSelectOption value="fa">
                  {t("customers.fields.localeFa")}
                </DashboardSelectOption>
                <DashboardSelectOption value="en">
                  {t("customers.fields.localeEn")}
                </DashboardSelectOption>
              </DashboardSelect>
            </div>
          )}
          {showDefaultRingSize && (
            <div>
              <Label htmlFor={`${idPrefix}-ring`}>{t("customers.fields.defaultRingSize")}</Label>
              <Input
                id={`${idPrefix}-ring`}
                value={values.defaultRingSize}
                onChange={(e) => update({ defaultRingSize: e.target.value })}
                placeholder="14"
                className="mt-1.5"
              />
            </div>
          )}
        </div>
      )}
      <label className="flex items-center gap-2 text-sm text-ink">
        <input
          type="checkbox"
          checked={values.isVip}
          onChange={(e) => update({ isVip: e.target.checked })}
          className="size-4 rounded border-border accent-primary"
        />
        {t("customers.fields.assignVip")}
      </label>
    </div>
  );
}

export interface CreateCustomerModalProps {
  onConfirm: (values: CustomerFormValues) => Promise<void>;
  onClose: () => void;
}

export function CreateCustomerModal({
  onConfirm,
  onClose,
}: CreateCustomerModalProps) {
  const { t } = useAdminT();
  const [values, setValues] = useState(emptyCustomerForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!values.fullName.trim() || !values.phone.trim()) {
      setError(t("customers.modals.create.namePhoneRequired"));
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await onConfirm(values);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("customers.modals.create.failed"),
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ModalShell
      title={t("customers.modals.create.title")}
      description={t("customers.modals.create.description")}
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={submitting}>
            {t("common.cancel")}
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={submitting}>
            {submitting ? t("common.creating") : t("customers.modals.create.title")}
          </Button>
        </>
      }
    >
      {error && (
        <p className="mb-4 text-sm text-error" role="alert">
          {error}
        </p>
      )}
      <CustomerFormFields
        values={values}
        onChange={setValues}
        idPrefix="create-customer"
        variant="create"
      />
    </ModalShell>
  );
}

export interface EditCustomerModalProps {
  customer: CustomerDetail;
  onConfirm: (values: CustomerFormValues) => Promise<void>;
  onClose: () => void;
}

export function EditCustomerModal({
  customer,
  onConfirm,
  onClose,
}: EditCustomerModalProps) {
  const { t } = useAdminT();
  const [values, setValues] = useState(() => customerToFormValues(customer));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      await onConfirm(values);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("customers.modals.edit.failed"),
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ModalShell
      title={t("customers.modals.edit.title")}
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={submitting}>
            {t("common.cancel")}
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={submitting}>
            {submitting ? t("common.saving") : t("common.saveChanges")}
          </Button>
        </>
      }
    >
      {error && (
        <p className="mb-4 text-sm text-error" role="alert">
          {error}
        </p>
      )}
      <CustomerFormFields
        values={values}
        onChange={setValues}
        idPrefix="edit-customer"
      />
    </ModalShell>
  );
}

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
