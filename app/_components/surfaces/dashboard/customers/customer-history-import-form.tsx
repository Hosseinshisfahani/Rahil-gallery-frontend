"use client";

import { cn } from "@/lib/utils";
import { Input } from "@/_components/core/primitive/input";
import { Label } from "@/_components/core/primitive/label";
import { DashboardDateInput } from "../abstract/dashboard-date-input";
import { DashboardSelect, DashboardSelectOption } from "../abstract/dashboard-select";
import { Textarea } from "@/_components/core/primitive/textarea";
import { useCustomerEnumLabels } from "@/lib/i18n/admin/use-customer-labels";
import {
  CUSTOMER_AGE_RANGES,
  CUSTOMER_TYPES,
  PURCHASED_CATEGORY_OPTIONS,
  type CustomerAgeRange,
  type CustomerImportProfile,
  type CustomerType,
  type PurchasedCategory,
} from "../data/mock-customers";
import { useAdminT } from "../layout/admin-locale-provider";

export function emptyImportProfile(): CustomerImportProfile {
  return {
    firstName: "",
    lastName: "",
    job: "",
    phone: "",
    email: "",
    address: "",
    birthday: "",
    marriageDate: "",
    importantDate: "",
    firstVisitDate: "",
    customerType: "public",
    customerAgeRange: undefined,
    purchasedCategories: [],
    description: "",
    signature: "",
  };
}

export function importProfileToForm(
  profile: CustomerImportProfile,
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
  idPrefix?: string;
}

export function CustomerHistoryImportForm({
  values,
  onChange,
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

  return (
    <div className="flex flex-col gap-5">
      <FormSection
        title={t("customers.import.section1")}
        description={t("customers.import.section1Desc")}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor={`${idPrefix}-first`} required>
              {t("customers.fields.firstName")}
            </Label>
            <Input
              id={`${idPrefix}-first`}
              value={values.firstName}
              onChange={(e) => update({ firstName: e.target.value })}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor={`${idPrefix}-last`} required>
              {t("customers.fields.lastName")}
            </Label>
            <Input
              id={`${idPrefix}-last`}
              value={values.lastName}
              onChange={(e) => update({ lastName: e.target.value })}
              className="mt-1.5"
            />
          </div>
        </div>
        <div>
          <Label htmlFor={`${idPrefix}-job`}>{t("customers.fields.job")}</Label>
          <Input
            id={`${idPrefix}-job`}
            value={values.job ?? ""}
            onChange={(e) => update({ job: e.target.value })}
            placeholder={t("customers.import.jobPlaceholder")}
            className="mt-1.5"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor={`${idPrefix}-phone`} required>
              {t("customers.import.phoneNumber")}
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
              value={values.email ?? ""}
              onChange={(e) => update({ email: e.target.value })}
              className="mt-1.5"
            />
          </div>
        </div>
        <div>
          <Label htmlFor={`${idPrefix}-address`}>{t("customers.fields.address")}</Label>
          <Textarea
            id={`${idPrefix}-address`}
            rows={2}
            value={values.address ?? ""}
            onChange={(e) => update({ address: e.target.value })}
            placeholder={t("customers.import.addressPlaceholder")}
            className="mt-1.5"
          />
        </div>
      </FormSection>

      <FormSection
        title={t("customers.import.section2")}
        description={t("customers.import.section2Desc")}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor={`${idPrefix}-birthday`}>{t("customers.fields.birthday")}</Label>
            <DashboardDateInput
              id={`${idPrefix}-birthday`}
              value={values.birthday ?? ""}
              onChange={(birthday) => update({ birthday })}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor={`${idPrefix}-marriage`}>{t("customers.fields.marriageDate")}</Label>
            <DashboardDateInput
              id={`${idPrefix}-marriage`}
              value={values.marriageDate ?? ""}
              onChange={(marriageDate) => update({ marriageDate })}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor={`${idPrefix}-important`}>{t("customers.fields.importantDate")}</Label>
            <DashboardDateInput
              id={`${idPrefix}-important`}
              value={values.importantDate ?? ""}
              onChange={(importantDate) => update({ importantDate })}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor={`${idPrefix}-first-visit`}>{t("customers.fields.firstVisit")}</Label>
            <DashboardDateInput
              id={`${idPrefix}-first-visit`}
              value={values.firstVisitDate ?? ""}
              onChange={(firstVisitDate) => update({ firstVisitDate })}
              className="mt-1.5"
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
            <Label htmlFor={`${idPrefix}-type`} required>
              {t("customers.fields.customerType")}
            </Label>
            <DashboardSelect
              id={`${idPrefix}-type`}
              value={values.customerType}
              onChange={(e) =>
                update({ customerType: e.target.value as CustomerType })
              }
              className="mt-1.5"
            >
              {CUSTOMER_TYPES.map((type) => (
                <DashboardSelectOption key={type} value={type}>
                  {customerType(type)}
                </DashboardSelectOption>
              ))}
            </DashboardSelect>
          </div>
          <div>
            <Label htmlFor={`${idPrefix}-age`}>{t("customers.fields.ageRange")}</Label>
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
              className="mt-1.5"
            >
              <DashboardSelectOption value="" placeholder>
                {t("common.notSpecified")}
              </DashboardSelectOption>
              {CUSTOMER_AGE_RANGES.map((range) => (
                <DashboardSelectOption key={range} value={range}>
                  {ageRange(range)}
                </DashboardSelectOption>
              ))}
            </DashboardSelect>
          </div>
        </div>
        <div>
          <Label>{t("customers.fields.purchasedCategories")}</Label>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {PURCHASED_CATEGORY_OPTIONS.map((category) => {
              const active = values.purchasedCategories.includes(category);
              return (
                <label
                  key={category}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-sm border px-3 py-2 text-sm transition-colors",
                    active
                      ? "border-accent bg-accent/10 text-ink"
                      : "border-border bg-surface text-ink-muted hover:border-ink-muted",
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
          <Label htmlFor={`${idPrefix}-description`}>{t("customers.fields.description")}</Label>
          <Textarea
            id={`${idPrefix}-description`}
            rows={4}
            value={values.description ?? ""}
            onChange={(e) => update({ description: e.target.value })}
            placeholder={t("customers.import.visitExperience")}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor={`${idPrefix}-signature`}>{t("customers.fields.signature")}</Label>
          <Input
            id={`${idPrefix}-signature`}
            value={values.signature ?? ""}
            onChange={(e) => update({ signature: e.target.value })}
            placeholder={t("customers.import.signaturePlaceholder")}
            className="mt-1.5 font-serif italic"
          />
        </div>
      </FormSection>
    </div>
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
