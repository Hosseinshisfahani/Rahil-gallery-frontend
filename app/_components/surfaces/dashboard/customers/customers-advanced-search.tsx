"use client";

/**
 * Legacy advanced search (LTV, tags, email, etc.).
 * Hidden from the customer list UI — kept for future use and URL/saved-view compatibility.
 * @see customers-crm-advanced-search.tsx
 */

import { cn } from "@/lib/utils";
import { Button } from "@/_components/core/primitive/button";
import { Input } from "@/_components/core/primitive/input";
import { DashboardDateInput } from "../abstract/dashboard-date-input";
import { Label } from "@/_components/core/primitive/label";
import { DashboardSelect, DashboardSelectOption } from "../abstract/dashboard-select";
import { useCustomerEnumLabels } from "@/lib/i18n/admin/use-customer-labels";
import { CUSTOMER_TAGS, type CustomerTag } from "../data/mock-customers";
import { useAdminT } from "../layout/admin-locale-provider";
import {
  parseOptionalNumber,
  type CustomerFilters,
} from "./lib/filter-customers";

export interface CustomersAdvancedSearchProps {
  filters: CustomerFilters;
  onChange: (filters: CustomerFilters) => void;
  onReset: () => void;
  className?: string;
}

function RangeField({
  label,
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  minPlaceholder,
  maxPlaceholder,
  minLabel,
  maxLabel,
}: {
  label: string;
  minValue: string;
  maxValue: string;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
  minPlaceholder: string;
  maxPlaceholder: string;
  minLabel: string;
  maxLabel: string;
}) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-sm font-medium text-ink">{label}</legend>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor={`${label}-min`} className="mb-1 text-xs text-ink-muted">
            {minLabel}
          </Label>
          <Input
            id={`${label}-min`}
            type="number"
            min={0}
            placeholder={minPlaceholder}
            value={minValue}
            onChange={(e) => onMinChange(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor={`${label}-max`} className="mb-1 text-xs text-ink-muted">
            {maxLabel}
          </Label>
          <Input
            id={`${label}-max`}
            type="number"
            min={0}
            placeholder={maxPlaceholder}
            value={maxValue}
            onChange={(e) => onMaxChange(e.target.value)}
          />
        </div>
      </div>
    </fieldset>
  );
}

function DateRangeField({
  label,
  fromValue,
  toValue,
  onFromChange,
  onToChange,
  fromLabel,
  toLabel,
}: {
  label: string;
  fromValue: string;
  toValue: string;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  fromLabel: string;
  toLabel: string;
}) {
  const slug = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-sm font-medium text-ink">{label}</legend>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor={`${slug}-from`} className="mb-1 text-xs text-ink-muted">
            {fromLabel}
          </Label>
          <DashboardDateInput
            id={`${slug}-from`}
            value={fromValue}
            onChange={onFromChange}
            aria-label={fromLabel}
          />
        </div>
        <div>
          <Label htmlFor={`${slug}-to`} className="mb-1 text-xs text-ink-muted">
            {toLabel}
          </Label>
          <DashboardDateInput
            id={`${slug}-to`}
            value={toValue}
            onChange={onToChange}
            aria-label={toLabel}
          />
        </div>
      </div>
    </fieldset>
  );
}

export function CustomersAdvancedSearch({
  filters,
  onChange,
  onReset,
  className,
}: CustomersAdvancedSearchProps) {
  const { t } = useAdminT();
  const { tag: tagLabel } = useCustomerEnumLabels();

  function update(partial: Partial<CustomerFilters>) {
    onChange({ ...filters, ...partial });
  }

  function toggleTag(tag: CustomerTag) {
    const next = filters.tags.includes(tag)
      ? filters.tags.filter((item) => item !== tag)
      : [...filters.tags, tag];
    update({ tags: next });
  }

  return (
    <div
      className={cn(
        "rounded-[var(--radius-md)] border border-border bg-surface-elevated/40 p-4",
        className,
      )}
      aria-label={t("customers.advancedSearch.aria")}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-ink">
            {t("customers.advancedSearch.title")}
          </p>
          <p className="text-xs text-ink-muted">
            {t("customers.advancedSearch.subtitle")}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={onReset}>
          {t("common.resetAdvanced")}
        </Button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="customer-id-filter" className="text-sm font-medium">
            {t("customers.advancedSearch.customerId")}
          </Label>
          <Input
            id="customer-id-filter"
            placeholder="550e8400-e29b-41d4-a716-446655440000"
            value={filters.customerId}
            onChange={(e) => update({ customerId: e.target.value })}
            className="font-mono text-xs text-ltr"
            dir="ltr"
          />
          <p className="text-xs text-ink-muted">
            {t("customers.advancedSearch.customerIdHint")}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="customer-email-filter" className="text-sm font-medium">
            {t("customers.advancedSearch.email")}
          </Label>
          <Input
            id="customer-email-filter"
            type="email"
            placeholder="sara@example.com"
            value={filters.email}
            onChange={(e) => update({ email: e.target.value })}
          />
          <p className="text-xs text-ink-muted">
            {t("customers.advancedSearch.emailHint")}
          </p>
        </div>

        <DateRangeField
          label={t("customers.advancedSearch.registrationDate")}
          fromValue={filters.registeredFrom}
          toValue={filters.registeredTo}
          onFromChange={(registeredFrom) => update({ registeredFrom })}
          onToChange={(registeredTo) => update({ registeredTo })}
          fromLabel={t("common.from")}
          toLabel={t("common.to")}
        />

        <DateRangeField
          label={t("customers.advancedSearch.lastPurchaseDate")}
          fromValue={filters.lastPurchaseFrom}
          toValue={filters.lastPurchaseTo}
          onFromChange={(lastPurchaseFrom) => update({ lastPurchaseFrom })}
          onToChange={(lastPurchaseTo) => update({ lastPurchaseTo })}
          fromLabel={t("common.from")}
          toLabel={t("common.to")}
        />

        <DateRangeField
          label={t("customers.advancedSearch.lastActivityDate")}
          fromValue={filters.lastActivityFrom}
          toValue={filters.lastActivityTo}
          onFromChange={(lastActivityFrom) => update({ lastActivityFrom })}
          onToChange={(lastActivityTo) => update({ lastActivityTo })}
          fromLabel={t("common.from")}
          toLabel={t("common.to")}
        />

        <RangeField
          label={t("customers.advancedSearch.ltv")}
          minValue={filters.ltvMin?.toString() ?? ""}
          maxValue={filters.ltvMax?.toString() ?? ""}
          onMinChange={(value) =>
            update({ ltvMin: parseOptionalNumber(value) })
          }
          onMaxChange={(value) =>
            update({ ltvMax: parseOptionalNumber(value) })
          }
          minPlaceholder="50000000"
          maxPlaceholder="500000000"
          minLabel={t("customers.advancedSearch.minLtv")}
          maxLabel={t("customers.advancedSearch.maxLtv")}
        />

        <RangeField
          label={t("customers.advancedSearch.orderCount")}
          minValue={filters.ordersMin?.toString() ?? ""}
          maxValue={filters.ordersMax?.toString() ?? ""}
          onMinChange={(value) =>
            update({ ordersMin: parseOptionalNumber(value) })
          }
          onMaxChange={(value) =>
            update({ ordersMax: parseOptionalNumber(value) })
          }
          minPlaceholder="1"
          maxPlaceholder="10"
          minLabel={t("customers.advancedSearch.minOrders")}
          maxLabel={t("customers.advancedSearch.maxOrders")}
        />

        <div className="flex flex-col gap-2">
          <Label htmlFor="has-purchased" className="text-sm font-medium">
            {t("customers.advancedSearch.purchaseHistory")}
          </Label>
          <DashboardSelect
            id="has-purchased"
            value={filters.hasPurchased}
            onChange={(e) =>
              update({
                hasPurchased: e.target.value as CustomerFilters["hasPurchased"],
              })
            }
          >
            <DashboardSelectOption value="all">
              {t("customers.advancedSearch.any")}
            </DashboardSelectOption>
            <DashboardSelectOption value="yes">
              {t("customers.advancedSearch.hasOrder")}
            </DashboardSelectOption>
            <DashboardSelectOption value="no">
              {t("customers.advancedSearch.noOrder")}
            </DashboardSelectOption>
          </DashboardSelect>
          <p className="text-xs text-ink-muted">
            {t("customers.advancedSearch.countryFixed")}
          </p>
        </div>
      </div>

      <div className="mt-5 border-t border-border/60 pt-4">
        <p className="mb-2 text-sm font-medium text-ink">
          {t("customers.advancedSearch.tags")}
        </p>
        <div className="flex flex-wrap gap-2">
          {CUSTOMER_TAGS.map((tag) => {
            const active = filters.tags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={cn(
                  "rounded-sm border px-3 py-1.5 text-xs font-medium transition-colors",
                  active
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border bg-surface text-ink-muted hover:border-ink-muted",
                )}
              >
                {tagLabel(tag)}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-ink-muted">
          {t("customers.advancedSearch.tagsHint")}
        </p>
      </div>
    </div>
  );
}
