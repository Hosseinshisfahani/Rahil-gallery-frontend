"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FilterChip } from "@/components/admin/ui/filter-chip";
import { DashboardDateInput } from "@/components/admin/ui/dashboard-date-input";
import { DashboardSelect, DashboardSelectOption } from "@/components/admin/ui/dashboard-select";
import { fieldPlaceholder } from "@/components/admin/ui/form-placeholders";
import { useAdminT } from "../layout/admin-locale-provider";
import { useCustomerEnumLabels } from "@/hooks/admin/use-customer-enum-labels";
import {
  CUSTOMER_AGE_RANGES,
  CUSTOMER_GENDERS,
  CUSTOMER_TYPES,
  PURCHASED_CATEGORY_OPTIONS,
  type CustomerAgeRange,
  type CustomerType,
  type PurchasedCategory,
} from "@/lib/api/customers/types";
import {
  countActiveFilters,
  countAdvancedPanelFilters,
  defaultCustomerFilters,
  getActiveFilterChips,
  hasAdvancedCustomerFilters,
  type CustomerFilters,
} from "./customers";
export interface CustomersFiltersProps {
  filters: CustomerFilters;
  onChange: (filters: CustomerFilters) => void;
  resultCount: number;
  /** Omitted when list uses `includeTotal=false` (quick search) */
  totalCount?: number;
  hasMore?: boolean;
}

export function CustomersFilters({
  filters,
  onChange,
  resultCount,
  totalCount,
  hasMore,
}: CustomersFiltersProps) {
  const { t, locale } = useAdminT();
  const {
    customerType: customerTypeLabel,
    purchasedCategory: purchaseTypeLabel,
    ageRange: ageRangeLabel,
    gender: genderLabel,
  } = useCustomerEnumLabels();
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const activeFilterCount = countActiveFilters(filters);
  const advancedFilterCount = countAdvancedPanelFilters(filters);
  const advancedMode = hasAdvancedCustomerFilters(filters);
  const filterChips = getActiveFilterChips(
    filters,
    onChange,
    t,
    customerTypeLabel,
    purchaseTypeLabel,
    ageRangeLabel,
    genderLabel,
  );

  function update(partial: Partial<CustomerFilters>) {
    onChange({ ...filters, ...partial });
  }

  function clearFilters() {
    onChange({ ...defaultCustomerFilters, query: filters.query });
  }

  function clearAll() {
    onChange(defaultCustomerFilters);
    setAdvancedOpen(false);
  }

  function resetAdvanced() {
    onChange({
      ...filters,
      customerId: "",
      email: "",
      customerAgeRange: "",
      gender: "all",
      purchaseTypes: [],
      customerTypes: [],
      firstVisitFrom: "",
      firstVisitTo: "",
      birthdayFrom: "",
      birthdayTo: "",
      marriageFrom: "",
      marriageTo: "",
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <Input
          type="search"
          placeholder={t("customers.filters.placeholder")}
          value={filters.query}
          onChange={(e) => update({ query: e.target.value })}
          className="lg:max-w-sm"
          aria-label={t("common.search")}
          disabled={advancedMode}
        />
        <Button
          variant={advancedOpen ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setAdvancedOpen((open) => !open)}
          aria-expanded={advancedOpen}
          aria-controls="customer-advanced-search"
          className="shrink-0"
        >
          {t("customers.advancedSearch.advancedSearchBtn")}
          {advancedFilterCount > 0 && (
            <span className="ms-1.5 rounded-full bg-accent/15 px-1.5 py-0.5 text-xs font-semibold text-accent">
              {advancedFilterCount}
            </span>
          )}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={cn(
              "ms-1 transition-transform",
              advancedOpen && "rotate-180",
            )}
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </Button>
      </div>

      {advancedMode && filters.query.trim() && (
        <p className="text-xs text-ink-muted">
          {t("customers.advancedSearch.quickSearchPaused")}
        </p>
      )}

      {advancedOpen && (
        <div id="customer-advanced-search">
          <CustomersCrmAdvancedSearch
            filters={filters}
            onChange={onChange}
            onReset={resetAdvanced}
          />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-ink-muted">
          {totalCount !== undefined
            ? t("customers.filters.showingCount", {
                count: resultCount.toLocaleString(locale === "fa" ? "fa-IR" : "en-US"),
                total: totalCount.toLocaleString(locale === "fa" ? "fa-IR" : "en-US"),
              })
            : t("customers.filters.showingPagePartial", {
                count: resultCount.toLocaleString(locale === "fa" ? "fa-IR" : "en-US"),
                more: hasMore ? t("pagination.moreAvailable") : "",
              })}
        </span>
        {filterChips.map((chip) => (
          <FilterChip
            key={chip.key}
            label={chip.label}
            active
            onRemove={chip.onRemove}
          />
        ))}
        {(activeFilterCount > 0 || filters.query) && (
          <div className="ms-auto flex gap-2">
            {activeFilterCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                {t("customers.filters.clearFilters", { count: activeFilterCount })}
              </Button>
            )}
            {(activeFilterCount > 0 || filters.query) && (
              <Button variant="ghost" size="sm" onClick={clearAll}>
                {t("common.clearAll")}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// --- CRM advanced search (list chrome) ---

interface CustomersCrmAdvancedSearchProps {
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

function CustomersCrmAdvancedSearch({
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
          <Input
            id="crm-customer-id"
            value={filters.customerId}
            onChange={(e) => update({ customerId: e.target.value })}
            placeholder={t("customers.fields.userId")}
            aria-label={t("customers.fields.userId")}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Input
            id="crm-email"
            type="email"
            value={filters.email}
            onChange={(e) => update({ email: e.target.value })}
            placeholder={t("customers.fields.email")}
            aria-label={t("customers.fields.email")}
          />
        </div>
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
