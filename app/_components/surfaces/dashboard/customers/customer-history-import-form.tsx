"use client";

import { cn } from "@/lib/utils";
import { Input } from "@/_components/core/primitive/input";
import { DashboardDateInput } from "../abstract/dashboard-date-input";
import {
  DashboardSelect,
  DashboardSelectOption,
} from "../abstract/dashboard-select";
import { fieldPlaceholder } from "../abstract/form-placeholders";
import { CustomerSignatureField } from "./customer-signature-field";
import { Textarea } from "@/_components/core/primitive/textarea";
import { useCustomerEnumLabels } from "@/lib/i18n/admin/use-customer-labels";
import {
  CUSTOMER_AGE_RANGES,
  CUSTOMER_TYPES,
  CustomerGender,
  PURCHASED_CATEGORY_OPTIONS,
  type CustomerAgeRange,
  type CustomerImportProfile,
  type CustomerType,
  type PurchasedCategory,
} from "@/lib/api/customers/types";
import { useAdminT } from "../layout/admin-locale-provider";

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
  profile: CustomerImportProfile
): CustomerImportProfile {
  return { ...profile, purchasedCategories: [...profile.purchasedCategories] };
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
  return (
    <section className="rounded-[var(--radius-md)] border border-border/60 bg-surface-elevated/30 p-4">
      <h3 className="text-sm font-semibold text-ink">{title}</h3>
      {description && (
        <p className="mt-0.5 text-xs text-ink-muted">{description}</p>
      )}
      <div className="mt-4 flex flex-col gap-4">{children}</div>
    </section>
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
  const { customerType, purchasedCategory, ageRange } = useCustomerEnumLabels();

  function update(partial: Partial<CustomerImportProfile>) {
    onChange({ ...values, ...partial });
  }

  function toggleCategory(category: PurchasedCategory) {
    const next = values.purchasedCategories.includes(category)
      ? values.purchasedCategories.filter((c) => c !== category)
      : [...values.purchasedCategories, category];
    update({ purchasedCategories: next });
  }

  const firstNameLabel = fieldPlaceholder(
    t("customers.fields.firstName"),
    true
  );
  const lastNameLabel = fieldPlaceholder(t("customers.fields.lastName"), true);
  const jobLabel = fieldPlaceholder(t("customers.fields.job"));
  const phoneLabel = fieldPlaceholder(t("customers.import.phoneNumber"), true);
  const emailLabel = fieldPlaceholder(t("customers.fields.email"));
  const addressLabel = fieldPlaceholder(t("customers.fields.address"));
  const melliCodeLabel = fieldPlaceholder(t("customers.fields.melliCode"));
  const postalCodeLabel = fieldPlaceholder(t("customers.fields.postalCode"));
  const birthdayLabel = fieldPlaceholder(t("customers.fields.birthday"));
  const marriageLabel = fieldPlaceholder(t("customers.fields.marriageDate"));
  const importantLabel = fieldPlaceholder(t("customers.fields.importantDate"));
  const firstVisitLabel = fieldPlaceholder(t("customers.fields.firstVisit"));
  const typeLabel = fieldPlaceholder(t("customers.fields.customerType"), true);
  const ageLabel = fieldPlaceholder(t("customers.fields.ageRange"));
  const categoriesLabel = t("customers.fields.purchasedCategories");
  const descriptionLabel = fieldPlaceholder(t("customers.fields.description"));
  const marketerNoteLabel = fieldPlaceholder(t("customers.fields.marketerNote"));

  return (
    <div className="flex flex-col gap-5">
      <FormSection
        title={t("customers.import.section1")}
        description={t("customers.import.section1Desc")}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Input
              id={`${idPrefix}-first`}
              value={values.firstName}
              onChange={(e) => update({ firstName: e.target.value })}
              placeholder={firstNameLabel}
              aria-label={firstNameLabel}
            />
          </div>
          <div>
            <Input
              id={`${idPrefix}-last`}
              value={values.lastName}
              onChange={(e) => update({ lastName: e.target.value })}
              placeholder={lastNameLabel}
              aria-label={lastNameLabel}
            />
          </div>
          <div>
            <DashboardSelect
              id={`${idPrefix}-type`}
              value={values.customerType}
              onChange={(e) =>
                update({ gender: e.target.value as CustomerGender })
              }
              aria-label={typeLabel}
            >
              <DashboardSelectOption value="male">مرد</DashboardSelectOption>
              <DashboardSelectOption value="female">زن</DashboardSelectOption>
            </DashboardSelect>
          </div>
        </div>
        <div>
          <Input
            id={`${idPrefix}-job`}
            value={values.job ?? ""}
            onChange={(e) => update({ job: e.target.value })}
            placeholder={jobLabel}
            aria-label={jobLabel}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Input
              id={`${idPrefix}-phone`}
              value={values.phone}
              onChange={(e) => update({ phone: e.target.value })}
              placeholder={phoneLabel}
              aria-label={phoneLabel}
              className="font-mono text-ltr"
              dir="ltr"
            />
          </div>
          <div>
            <Input
              id={`${idPrefix}-email`}
              type="email"
              value={values.email ?? ""}
              onChange={(e) => update({ email: e.target.value })}
              placeholder={emailLabel}
              aria-label={emailLabel}
            />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Input
              id={`${idPrefix}-melli-code`}
              value={values.melliCode ?? ""}
              onChange={(e) => update({ melliCode: e.target.value })}
              placeholder={melliCodeLabel}
              aria-label={melliCodeLabel}
              className="font-mono text-ltr"
              dir="ltr"
              inputMode="numeric"
            />
          </div>
          <div>
            <Input
              id={`${idPrefix}-postal-code`}
              value={values.postalCode ?? ""}
              onChange={(e) => update({ postalCode: e.target.value })}
              placeholder={postalCodeLabel}
              aria-label={postalCodeLabel}
              className="font-mono text-ltr"
              dir="ltr"
              inputMode="numeric"
            />
          </div>
        </div>
        <div>
          <Textarea
            id={`${idPrefix}-address`}
            rows={2}
            value={values.address ?? ""}
            onChange={(e) => update({ address: e.target.value })}
            placeholder={addressLabel}
            aria-label={addressLabel}
          />
        </div>
      </FormSection>

      <FormSection
        title={t("customers.import.section2")}
        description={t("customers.import.section2Desc")}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <DashboardDateInput
              id={`${idPrefix}-birthday`}
              value={values.birthday ?? ""}
              onChange={(birthday) => update({ birthday })}
              placeholder={birthdayLabel}
              aria-label={birthdayLabel}
            />
          </div>
          <div>
            <DashboardDateInput
              id={`${idPrefix}-marriage`}
              value={values.marriageDate ?? ""}
              onChange={(marriageDate) => update({ marriageDate })}
              placeholder={marriageLabel}
              aria-label={marriageLabel}
            />
          </div>
          <div>
            <DashboardDateInput
              id={`${idPrefix}-important`}
              value={values.importantDate ?? ""}
              onChange={(importantDate) => update({ importantDate })}
              placeholder={importantLabel}
              aria-label={importantLabel}
            />
          </div>
          <div>
            <DashboardDateInput
              id={`${idPrefix}-first-visit`}
              value={values.firstVisitDate ?? ""}
              onChange={(firstVisitDate) => update({ firstVisitDate })}
              placeholder={firstVisitLabel}
              aria-label={firstVisitLabel}
            />
          </div>
        </div>
      </FormSection>

      <FormSection
        title={t("customers.import.section3")}
        description={t("customers.import.section3Desc")}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <DashboardSelect
              id={`${idPrefix}-type`}
              value={values.customerType}
              onChange={(e) =>
                update({ customerType: e.target.value as CustomerType })
              }
              aria-label={typeLabel}
            >
              {CUSTOMER_TYPES.map((type) => (
                <DashboardSelectOption key={type} value={type}>
                  {customerType(type)}
                </DashboardSelectOption>
              ))}
            </DashboardSelect>
          </div>
          <div>
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
              aria-label={ageLabel}
            >
              <DashboardSelectOption value="" placeholder>
                {ageLabel}
              </DashboardSelectOption>
              {CUSTOMER_AGE_RANGES.map((range) => (
                <DashboardSelectOption key={range} value={range}>
                  {ageRange(range)}
                </DashboardSelectOption>
              ))}
            </DashboardSelect>
          </div>
        </div>
        <div role="group" aria-label={categoriesLabel}>
          <div className="grid gap-2 sm:grid-cols-2">
            {PURCHASED_CATEGORY_OPTIONS.map((category) => {
              const active = values.purchasedCategories.includes(category);
              return (
                <label
                  key={category}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-sm border px-3 py-2 text-sm transition-colors",
                    active
                      ? "border-accent bg-accent/10 text-ink"
                      : "border-border bg-surface text-ink-muted hover:border-ink-muted"
                  )}
                >
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
        </div>
      </FormSection>

      <FormSection
        title={t("customers.import.section4")}
        description={t("customers.import.section4Desc")}
      >
        <div>
          <Textarea
            id={`${idPrefix}-description`}
            rows={4}
            value={values.description ?? ""}
            onChange={(e) => update({ description: e.target.value })}
            placeholder={descriptionLabel}
            aria-label={descriptionLabel}
          />
        </div>
        <div>
          <Textarea
            id={`${idPrefix}-marketer-note`}
            rows={4}
            value={values.marketerNote ?? ""}
            onChange={(e) => update({ marketerNote: e.target.value })}
            placeholder={marketerNoteLabel}
            aria-label={marketerNoteLabel}
          />
        </div>
        <div>
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
        </div>
      </FormSection>
    </div>
  );
}

export function validateImportProfile(
  profile: CustomerImportProfile,
  t: (key: string) => string
): string | null {
  if (!profile.firstName.trim()) return t("customers.import.firstNameRequired");
  if (!profile.lastName.trim()) return t("customers.import.lastNameRequired");
  if (!profile.phone.trim()) return t("customers.import.phoneRequired");
  return null;
}
