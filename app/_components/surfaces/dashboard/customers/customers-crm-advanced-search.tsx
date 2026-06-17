"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/_components/core/primitive/button";
import { DashboardDateInput } from "../abstract/dashboard-date-input";
import { DashboardSelect, DashboardSelectOption } from "../abstract/dashboard-select";
import { fieldPlaceholder } from "../abstract/form-placeholders";
import { useCustomerEnumLabels } from "@/lib/i18n/admin/use-customer-labels";
import {
  CUSTOMER_AGE_RANGES,
  CUSTOMER_GENDERS,
  CUSTOMER_TYPES,
  PURCHASED_CATEGORY_OPTIONS,
  type CustomerAgeRange,
  type CustomerGender,
  type CustomerType,
  type PurchasedCategory,
} from "../data/mock-customers";
import { useAdminT } from "../layout/admin-locale-provider";
import type { CustomerFilters } from "./lib/filter-customers";

export interface CustomersCrmAdvancedSearchProps {
  filters: CustomerFilters;
  onChange: (filters: CustomerFilters) => void;
  onReset: () => void;
  className?: string;
}

function DateRangeField({
  label,
  fromValue,
  toValue,
  onFromChange,
  onToChange,
  fromLabel,
  toLabel,
  slug,
}: {
  label: string;
  fromValue: string;
  toValue: string;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  fromLabel: string;
  toLabel: string;
  slug: string;
}) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-sm font-medium text-ink">{label}</legend>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <DashboardDateInput
            id={`${slug}-from`}
            value={fromValue}
            onChange={onFromChange}
            placeholder={fromLabel}
            aria-label={fromLabel}
          />
        </div>
        <div>
          <DashboardDateInput
            id={`${slug}-to`}
            value={toValue}
            onChange={onToChange}
            placeholder={toLabel}
            aria-label={toLabel}
          />
        </div>
      </div>
    </fieldset>
  );
}

export function CustomersCrmAdvancedSearch({
  filters,
  onChange,
  onReset,
  className,
}: CustomersCrmAdvancedSearchProps) {
  const { t } = useAdminT();
  const { customerType, purchasedCategory, ageRange, gender } =
    useCustomerEnumLabels();

  function update(partial: Partial<CustomerFilters>) {
    onChange({ ...filters, ...partial });
  }

  function toggleCustomerType(type: CustomerType) {
    const next = filters.customerTypes.includes(type)
      ? filters.customerTypes.filter((item) => item !== type)
      : [...filters.customerTypes, type];
    update({ customerTypes: next });
  }

  function togglePurchaseType(category: PurchasedCategory) {
    const next = filters.purchaseTypes.includes(category)
      ? filters.purchaseTypes.filter((item) => item !== category)
      : [...filters.purchaseTypes, category];
    update({ purchaseTypes: next });
  }

  const ageRangeFieldLabel = fieldPlaceholder(t("customers.fields.ageRange"));
  const genderFieldLabel = fieldPlaceholder(t("customers.fields.gender"));

  return (
    <div
      className={cn(
        "rounded-[var(--radius-md)] border border-border bg-surface-elevated/40 p-4",
        className,
      )}
      aria-label={t("customers.crmAdvancedSearch.aria")}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-ink">
            {t("customers.crmAdvancedSearch.title")}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={onReset}>
          {t("common.resetAdvanced")}
        </Button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col gap-2">
          <DashboardSelect
            id="crm-age-range"
            value={filters.customerAgeRange}
            onChange={(e) =>
              update({
                customerAgeRange: e.target.value as CustomerAgeRange | "",
              })
            }
            aria-label={ageRangeFieldLabel}
          >
            <DashboardSelectOption value="" placeholder>
              {ageRangeFieldLabel}
            </DashboardSelectOption>
            {CUSTOMER_AGE_RANGES.map((range) => (
              <DashboardSelectOption key={range} value={range}>
                {ageRange(range)}
              </DashboardSelectOption>
            ))}
          </DashboardSelect>
        </div>

        <div className="flex flex-col gap-2">
          <DashboardSelect
            id="crm-gender"
            value={filters.gender}
            onChange={(e) =>
              update({ gender: e.target.value as CustomerFilters["gender"] })
            }
            aria-label={genderFieldLabel}
          >
            <DashboardSelectOption value="all" placeholder>
              {genderFieldLabel}
            </DashboardSelectOption>
            {CUSTOMER_GENDERS.map((value) => (
              <DashboardSelectOption key={value} value={value}>
                {gender(value)}
              </DashboardSelectOption>
            ))}
          </DashboardSelect>
        </div>
      </div>

      <div className="mt-5 border-t border-border/60 pt-4">
        <p className="mb-2 text-sm font-medium text-ink">
          {t("customers.crmAdvancedSearch.customerType")}
        </p>
        <div className="flex flex-wrap gap-2">
          {CUSTOMER_TYPES.map((type) => {
            const active = filters.customerTypes.includes(type);
            return (
              <button
                key={type}
                type="button"
                onClick={() => toggleCustomerType(type)}
                className={cn(
                  "rounded-sm border px-3 py-1.5 text-xs font-medium transition-colors",
                  active
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border bg-surface text-ink-muted hover:border-ink-muted",
                )}
              >
                {customerType(type)}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 border-t border-border/60 pt-4">
        <p className="mb-2 text-sm font-medium text-ink">
          {t("customers.crmAdvancedSearch.purchaseType")}
        </p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {PURCHASED_CATEGORY_OPTIONS.map((category) => {
            const active = filters.purchaseTypes.includes(category);
            return (
              <button
                key={category}
                type="button"
                onClick={() => togglePurchaseType(category)}
                className={cn(
                  "rounded-sm border px-3 py-1.5 text-start text-xs font-medium transition-colors",
                  active
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border bg-surface text-ink-muted hover:border-ink-muted",
                )}
              >
                {purchasedCategory(category)}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 grid gap-5 border-t border-border/60 pt-4 sm:grid-cols-2">
        <DateRangeField
          label={t("customers.fields.firstVisit")}
          slug="first-visit"
          fromValue={filters.firstVisitFrom}
          toValue={filters.firstVisitTo}
          onFromChange={(firstVisitFrom) => update({ firstVisitFrom })}
          onToChange={(firstVisitTo) => update({ firstVisitTo })}
          fromLabel={t("common.from")}
          toLabel={t("common.to")}
        />
        <DateRangeField
          label={t("customers.advancedSearch.registrationDate")}
          slug="registration"
          fromValue={filters.registeredFrom}
          toValue={filters.registeredTo}
          onFromChange={(registeredFrom) => update({ registeredFrom })}
          onToChange={(registeredTo) => update({ registeredTo })}
          fromLabel={t("common.from")}
          toLabel={t("common.to")}
        />
        <DateRangeField
          label={t("customers.fields.birthday")}
          slug="birthday"
          fromValue={filters.birthdayFrom}
          toValue={filters.birthdayTo}
          onFromChange={(birthdayFrom) => update({ birthdayFrom })}
          onToChange={(birthdayTo) => update({ birthdayTo })}
          fromLabel={t("common.from")}
          toLabel={t("common.to")}
        />
        <DateRangeField
          label={t("customers.fields.marriageDate")}
          slug="marriage"
          fromValue={filters.marriageFrom}
          toValue={filters.marriageTo}
          onFromChange={(marriageFrom) => update({ marriageFrom })}
          onToChange={(marriageTo) => update({ marriageTo })}
          fromLabel={t("common.from")}
          toLabel={t("common.to")}
        />
      </div>
    </div>
  );
}
