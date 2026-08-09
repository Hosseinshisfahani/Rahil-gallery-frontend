"use client";

import { createContext, useContext, useEffect, useId, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DashboardDateInput } from "@/components/admin/ui/dashboard-date-input";
import {
  DashboardSelect,
  DashboardSelectOption,
} from "@/components/admin/ui/dashboard-select";
import { validateSignatureFile } from "@/lib/api/customers";
import { isSignatureImage, signatureImageSrc } from "@/lib/media";
import { useCustomerEnumLabels } from "@/hooks/admin/use-customer-enum-labels";
import {
  CUSTOMER_AGE_RANGES,
  CUSTOMER_GENDERS,
  CUSTOMER_TYPES,
  PURCHASED_CATEGORY_OPTIONS,
  type CustomerAgeRange,
  type CustomerGender,
  type CustomerImportProfile,
  type CustomerType,
  type PurchasedCategory,
} from "@/lib/api/customers/types";
import { useAdminT } from "../layout/admin-locale-provider";

export interface ImportProfileSubmit {
  profile: CustomerImportProfile;
  signatureFile?: File | null;
  removeSignature?: boolean;
}

// --- CustomerSignatureField ---

const ACCEPT = "image/png,image/jpeg,image/webp";

export interface CustomerSignatureFieldProps {
  signatureUrl?: string;
  pendingFile?: File | null;
  onSignatureUrlChange?: (url: string | undefined) => void;
  onPendingFileChange?: (file: File | null) => void;
  onRemove?: () => void;
  idPrefix?: string;
  disabled?: boolean;
  className?: string;
}

export function CustomerSignatureField({
  signatureUrl,
  pendingFile,
  onSignatureUrlChange,
  onPendingFileChange,
  onRemove,
  idPrefix = "signature",
  disabled = false,
  className,
}: CustomerSignatureFieldProps) {
  const { t } = useAdminT();
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const objectPreviewUrl = useMemo(
    () => (pendingFile ? URL.createObjectURL(pendingFile) : null),
    [pendingFile],
  );

  useEffect(() => {
    return () => {
      if (objectPreviewUrl) {
        URL.revokeObjectURL(objectPreviewUrl);
      }
    };
  }, [objectPreviewUrl]);

  const previewUrl = pendingFile
    ? objectPreviewUrl
    : signatureUrl && isSignatureImage(signatureUrl)
      ? signatureImageSrc(signatureUrl) ?? null
      : null;

  function handleFileSelect(file: File | null) {
    setError(null);
    if (!file) return;

    const validationCode = validateSignatureFile(file);
    if (validationCode === "INVALID_TYPE") {
      setError(t("customers.import.signatureInvalidType"));
      return;
    }
    if (validationCode === "TOO_LARGE") {
      setError(t("customers.import.signatureTooLarge"));
      return;
    }

    onPendingFileChange?.(file);
    onSignatureUrlChange?.(file.name);
  }

  function handleRemove() {
    setError(null);
    onPendingFileChange?.(null);
    onSignatureUrlChange?.(undefined);
    onRemove?.();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  const hasPreview = Boolean(previewUrl);
  const showLegacyText =
    Boolean(signatureUrl?.trim()) &&
    !pendingFile &&
    !isSignatureImage(signatureUrl);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div
        className={cn(
          "relative flex min-h-32 flex-col items-center justify-center rounded-[var(--radius-md)] border border-dashed border-border bg-surface-elevated/40 p-4",
          hasPreview && "border-solid",
        )}
      >
        {hasPreview ? (
          // eslint-disable-next-line @next/next/no-img-element -- same-origin uploaded signatures
          <img
            src={previewUrl!}
            alt={t("customers.fields.signature")}
            className="max-h-28 max-w-full object-contain"
          />
        ) : showLegacyText ? (
          <p className="text-center text-sm font-serif italic text-ink-muted">
            {signatureUrl}
          </p>
        ) : (
          <p className="text-center text-xs text-ink-muted">
            {t("customers.import.signatureUploadHint")}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={fileInputRef}
          id={`${idPrefix}-${inputId}`}
          type="file"
          accept={ACCEPT}
          className="sr-only"
          disabled={disabled}
          onChange={(e) => {
            const file = e.target.files?.[0] ?? null;
            handleFileSelect(file);
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={() => fileInputRef.current?.click()}
        >
          {hasPreview || showLegacyText
            ? t("customers.import.signatureChange")
            : t("customers.import.signatureUpload")}
        </Button>
        {(hasPreview || showLegacyText || pendingFile) && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={disabled}
            onClick={handleRemove}
          >
            {t("customers.import.signatureRemove")}
          </Button>
        )}
      </div>

      {error && (
        <p className="text-xs text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

// --- CustomerHistoryImportForm ---

export function emptyImportProfile(): CustomerImportProfile {
  return {
    firstName: "",
    lastName: "",
    job: "",
    gender: "male",
    phone: "",
    email: "",
    address: "",
    melliCode: "",
    postalCode: "",
    birthday: "",
    marriageDate: "",
    importantDate: "",
    firstVisitDate: "",
    customerType: "public",
    customerAgeRange: undefined,
    purchasedCategories: [],
    description: "",
    marketerNote: "",
    signature: "",
  };
}

export function importProfileToForm(
  profile: CustomerImportProfile,
): CustomerImportProfile {
  return { ...profile, purchasedCategories: [...profile.purchasedCategories] };
}

/**
 * Form layout: "vertical" stacks the label above each field in a 2-column
 * grid; "linear" puts the label beside the field, one field per row.
 */
export type FormLayout = "vertical" | "linear";

const LAYOUT_STORAGE_KEY = "admin.customerForm.layout";

const FormLayoutContext = createContext<FormLayout>("vertical");

function loadStoredLayout(): FormLayout {
  if (typeof window === "undefined") return "vertical";
  return window.localStorage.getItem(LAYOUT_STORAGE_KEY) === "linear"
    ? "linear"
    : "vertical";
}

function FormLayoutToggle({
  layout,
  onChange,
}: {
  layout: FormLayout;
  onChange: (layout: FormLayout) => void;
}) {
  const { t } = useAdminT();
  const options: { value: FormLayout; label: string }[] = [
    { value: "vertical", label: t("customers.import.layoutVertical") },
    { value: "linear", label: t("customers.import.layoutLinear") },
  ];
  return (
    <div className="flex items-center justify-end gap-2">
      <span className="text-xs text-ink-muted">
        {t("customers.import.layout")}
      </span>
      <div
        role="group"
        aria-label={t("customers.import.layout")}
        className="inline-flex rounded-[var(--radius-sm)] border border-border bg-surface p-0.5"
      >
        {options.map((option) => {
          const active = layout === option.value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(option.value)}
              className={cn(
                "rounded-[calc(var(--radius-sm)-2px)] px-3 py-1 text-xs transition-colors",
                active
                  ? "bg-accent/10 font-medium text-accent"
                  : "text-ink-muted hover:text-ink",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Responsive wrapper for field pairs — 2 columns in vertical layout, one field per row in linear. */
function FieldGrid({ children }: { children: React.ReactNode }) {
  const layout = useContext(FormLayoutContext);
  return (
    <div
      className={cn(
        layout === "vertical"
          ? "grid gap-4 sm:grid-cols-2"
          : "flex flex-col gap-4",
      )}
    >
      {children}
    </div>
  );
}

/** Splits a localized "۱. Title" / "1. Title" string into badge digit + text. */
function splitSectionTitle(title: string): { badge?: string; text: string } {
  const match = title.match(/^([0-9۰-۹]+)[.،]\s*(.*)$/);
  return match ? { badge: match[1], text: match[2] } : { text: title };
}

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  const { badge, text } = splitSectionTitle(title);
  return (
    <section className="rounded-[var(--radius-md)] border border-border/60 bg-surface-elevated/30 p-5">
      <div className="flex items-start gap-3 border-b border-border/40 pb-3">
        {badge && (
          <span
            aria-hidden="true"
            className="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent/10 text-sm font-bold text-accent"
          >
            {badge}
          </span>
        )}
        <div>
          <h3 className="text-sm font-semibold text-ink">{text}</h3>
          {description && (
            <p className="mt-0.5 text-xs text-ink-muted">{description}</p>
          )}
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-4">{children}</div>
    </section>
  );
}

function Field({
  id,
  label,
  required,
  className,
  children,
}: {
  /** When set, the label is attached via htmlFor; otherwise rendered as a group caption. */
  id?: string;
  label: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const layout = useContext(FormLayoutContext);
  const caption = (
    <>
      {label}
      {required && (
        <span className="ms-1 text-error" aria-hidden="true">
          *
        </span>
      )}
    </>
  );
  const linear = layout === "linear";
  const labelClass = cn(
    "text-xs font-medium text-ink-muted",
    linear && "sm:pt-2.5",
  );
  return (
    <div
      className={cn(
        linear
          ? "grid gap-1.5 sm:grid-cols-[10.5rem_minmax(0,1fr)] sm:gap-x-4 sm:gap-y-0"
          : "flex flex-col gap-1.5",
        className,
      )}
    >
      {id ? (
        <label htmlFor={id} className={labelClass}>
          {caption}
        </label>
      ) : (
        <span className={labelClass}>{caption}</span>
      )}
      <div className="min-w-0">{children}</div>
    </div>
  );
}

export interface CustomerHistoryImportFormProps {
  values: CustomerImportProfile;
  onChange: (values: CustomerImportProfile) => void;
  signatureFile?: File | null;
  onSignatureFileChange?: (file: File | null) => void;
  onSignatureRemove?: () => void;
  idPrefix?: string;
}

export function CustomerHistoryImportForm({
  values,
  onChange,
  signatureFile,
  onSignatureFileChange,
  onSignatureRemove,
  idPrefix = "import",
}: CustomerHistoryImportFormProps) {
  const { t } = useAdminT();
  const { customerType, purchasedCategory, ageRange, gender } =
    useCustomerEnumLabels();
  const [layout, setLayout] = useState<FormLayout>(loadStoredLayout);

  function changeLayout(next: FormLayout) {
    setLayout(next);
    window.localStorage.setItem(LAYOUT_STORAGE_KEY, next);
  }

  function update(partial: Partial<CustomerImportProfile>) {
    onChange({ ...values, ...partial });
  }

  function toggleCategory(category: PurchasedCategory) {
    const next = values.purchasedCategories.includes(category)
      ? values.purchasedCategories.filter((c) => c !== category)
      : [...values.purchasedCategories, category];
    update({ purchasedCategories: next });
  }

  const optionCardClass = (active: boolean) =>
    cn(
      "flex cursor-pointer items-center gap-2 rounded-[var(--radius-sm)] border px-3 py-2 text-sm transition-colors",
      active
        ? "border-accent bg-accent/10 font-medium text-ink"
        : "border-border bg-surface text-ink-muted hover:border-ink-muted hover:text-ink",
    );

  return (
    <FormLayoutContext.Provider value={layout}>
      <div className="flex flex-col gap-5">
        <FormLayoutToggle layout={layout} onChange={changeLayout} />
        <FormSection
          title={t("customers.import.section1")}
          description={t("customers.import.section1Desc")}
        >
          <FieldGrid>
            <Field
              id={`${idPrefix}-first`}
              label={t("customers.fields.firstName")}
              required
            >
              <Input
                id={`${idPrefix}-first`}
                value={values.firstName}
                onChange={(e) => update({ firstName: e.target.value })}
                autoComplete="off"
              />
            </Field>
            <Field
              id={`${idPrefix}-last`}
              label={t("customers.fields.lastName")}
              required
            >
              <Input
                id={`${idPrefix}-last`}
                value={values.lastName}
                onChange={(e) => update({ lastName: e.target.value })}
                autoComplete="off"
              />
            </Field>
            <Field label={t("customers.fields.gender")}>
              <div
                role="radiogroup"
                aria-label={t("customers.fields.gender")}
                className="grid grid-cols-3 gap-2"
              >
                {CUSTOMER_GENDERS.map((option) => {
                  const active = values.gender === option;
                  return (
                    <label
                      key={option}
                      className={cn(optionCardClass(active), "justify-center")}
                    >
                      <input
                        type="radio"
                        name={`${idPrefix}-gender`}
                        value={option}
                        checked={active}
                        onChange={() =>
                          update({ gender: option as CustomerGender })
                        }
                        className="sr-only"
                      />
                      {gender(option)}
                    </label>
                  );
                })}
              </div>
            </Field>
            <Field id={`${idPrefix}-job`} label={t("customers.fields.job")}>
              <Input
                id={`${idPrefix}-job`}
                value={values.job ?? ""}
                onChange={(e) => update({ job: e.target.value })}
                placeholder={t("customers.import.jobPlaceholder")}
              />
            </Field>
            <Field
              id={`${idPrefix}-phone`}
              label={t("customers.import.phoneNumber")}
              required
            >
              <Input
                id={`${idPrefix}-phone`}
                value={values.phone}
                onChange={(e) => update({ phone: e.target.value })}
                className="font-mono text-ltr"
                dir="ltr"
                inputMode="tel"
                autoComplete="off"
              />
            </Field>
            <Field id={`${idPrefix}-email`} label={t("customers.fields.email")}>
              <Input
                id={`${idPrefix}-email`}
                type="email"
                value={values.email ?? ""}
                onChange={(e) => update({ email: e.target.value })}
                dir="ltr"
                autoComplete="off"
              />
            </Field>
            <Field
              id={`${idPrefix}-melli-code`}
              label={t("customers.fields.melliCode")}
            >
              <Input
                id={`${idPrefix}-melli-code`}
                value={values.melliCode ?? ""}
                onChange={(e) => update({ melliCode: e.target.value })}
                className="font-mono text-ltr"
                dir="ltr"
                inputMode="numeric"
                maxLength={10}
              />
            </Field>
            <Field
              id={`${idPrefix}-postal-code`}
              label={t("customers.fields.postalCode")}
            >
              <Input
                id={`${idPrefix}-postal-code`}
                value={values.postalCode ?? ""}
                onChange={(e) => update({ postalCode: e.target.value })}
                className="font-mono text-ltr"
                dir="ltr"
                inputMode="numeric"
                maxLength={10}
              />
            </Field>
          </FieldGrid>
          <Field
            id={`${idPrefix}-address`}
            label={t("customers.fields.address")}
          >
            <Textarea
              id={`${idPrefix}-address`}
              rows={2}
              value={values.address ?? ""}
              onChange={(e) => update({ address: e.target.value })}
              placeholder={t("customers.import.addressPlaceholder")}
            />
          </Field>
        </FormSection>

        <FormSection
          title={t("customers.import.section2")}
          description={t("customers.import.section2Desc")}
        >
          <FieldGrid>
            <Field
              id={`${idPrefix}-birthday`}
              label={t("customers.fields.birthday")}
            >
              <DashboardDateInput
                id={`${idPrefix}-birthday`}
                value={values.birthday ?? ""}
                onChange={(birthday) => update({ birthday })}
              />
            </Field>
            <Field
              id={`${idPrefix}-marriage`}
              label={t("customers.fields.marriageDate")}
            >
              <DashboardDateInput
                id={`${idPrefix}-marriage`}
                value={values.marriageDate ?? ""}
                onChange={(marriageDate) => update({ marriageDate })}
              />
            </Field>
            <Field
              id={`${idPrefix}-important`}
              label={t("customers.fields.importantDate")}
            >
              <DashboardDateInput
                id={`${idPrefix}-important`}
                value={values.importantDate ?? ""}
                onChange={(importantDate) => update({ importantDate })}
              />
            </Field>
            <Field
              id={`${idPrefix}-first-visit`}
              label={t("customers.fields.firstVisit")}
            >
              <DashboardDateInput
                id={`${idPrefix}-first-visit`}
                value={values.firstVisitDate ?? ""}
                onChange={(firstVisitDate) => update({ firstVisitDate })}
              />
            </Field>
          </FieldGrid>
        </FormSection>

        <FormSection
          title={t("customers.import.section3")}
          description={t("customers.import.section3Desc")}
        >
          <FieldGrid>
            <Field
              id={`${idPrefix}-type`}
              label={t("customers.fields.customerType")}
              required
            >
              <DashboardSelect
                id={`${idPrefix}-type`}
                value={values.customerType}
                onChange={(e) =>
                  update({ customerType: e.target.value as CustomerType })
                }
                aria-label={t("customers.fields.customerType")}
              >
                {CUSTOMER_TYPES.map((type) => (
                  <DashboardSelectOption key={type} value={type}>
                    {customerType(type)}
                  </DashboardSelectOption>
                ))}
              </DashboardSelect>
            </Field>
            <Field
              id={`${idPrefix}-age`}
              label={t("customers.fields.ageRange")}
            >
              <DashboardSelect
                id={`${idPrefix}-age`}
                value={values.customerAgeRange ?? ""}
                onChange={(e) =>
                  update({
                    customerAgeRange: e.target.value
                      ? (e.target.value as CustomerAgeRange)
                      : undefined,
                  })
                }
                aria-label={t("customers.fields.ageRange")}
              >
                <DashboardSelectOption value="" placeholder>
                  {t("customers.fields.ageRange")}
                </DashboardSelectOption>
                {CUSTOMER_AGE_RANGES.map((range) => (
                  <DashboardSelectOption key={range} value={range}>
                    {ageRange(range)}
                  </DashboardSelectOption>
                ))}
              </DashboardSelect>
            </Field>
          </FieldGrid>
          <Field label={t("customers.fields.purchasedCategories")}>
            <div
              role="group"
              aria-label={t("customers.fields.purchasedCategories")}
              className="grid gap-2 sm:grid-cols-2"
            >
              {PURCHASED_CATEGORY_OPTIONS.map((category) => {
                const active = values.purchasedCategories.includes(category);
                return (
                  <label key={category} className={optionCardClass(active)}>
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={() => toggleCategory(category)}
                      className="size-4 rounded border-border accent-primary"
                    />
                    {purchasedCategory(category)}
                  </label>
                );
              })}
            </div>
          </Field>
        </FormSection>

        <FormSection
          title={t("customers.import.section4")}
          description={t("customers.import.section4Desc")}
        >
          <Field
            id={`${idPrefix}-description`}
            label={t("customers.fields.description")}
          >
            <Textarea
              id={`${idPrefix}-description`}
              rows={3}
              value={values.description ?? ""}
              onChange={(e) => update({ description: e.target.value })}
              placeholder={t("customers.import.visitExperience")}
            />
          </Field>
          <Field
            id={`${idPrefix}-marketer-note`}
            label={t("customers.fields.marketerNote")}
          >
            <Textarea
              id={`${idPrefix}-marketer-note`}
              rows={3}
              value={values.marketerNote ?? ""}
              onChange={(e) => update({ marketerNote: e.target.value })}
            />
          </Field>
          <Field label={t("customers.fields.signature")}>
            <CustomerSignatureField
              idPrefix={`${idPrefix}-signature`}
              signatureUrl={values.signature}
              pendingFile={signatureFile}
              onPendingFileChange={(file) => {
                onSignatureFileChange?.(file);
                if (file) update({ signature: "" });
              }}
              onSignatureUrlChange={(url) => {
                update({ signature: url ?? "" });
              }}
              onRemove={() => {
                update({ signature: "" });
                onSignatureRemove?.();
              }}
            />
          </Field>
        </FormSection>
      </div>
    </FormLayoutContext.Provider>
  );
}

export function validateImportProfile(
  profile: CustomerImportProfile,
  t: (key: string) => string,
): string | null {
  if (!profile.firstName.trim()) return t("customers.import.firstNameRequired");
  if (!profile.lastName.trim()) return t("customers.import.lastNameRequired");
  if (!profile.phone.trim()) return t("customers.import.phoneRequired");
  return null;
}
