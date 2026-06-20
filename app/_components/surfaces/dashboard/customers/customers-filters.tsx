"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/_components/core/primitive/button";
import { Input } from "@/_components/core/primitive/input";
import { DashboardSelect, DashboardSelectOption } from "../abstract/dashboard-select";
import { FilterChip } from "@/_components/core/primitive/filter-chip";
import type { CustomerSegment } from "../data/mock-customers";
import { useAdminT } from "../layout/admin-locale-provider";
import { useCustomerEnumLabels } from "@/lib/i18n/admin/use-customer-labels";
import { CustomersCrmAdvancedSearch } from "./customers-crm-advanced-search";
import {
  countActiveFilters,
  countAdvancedPanelFilters,
  defaultCustomerFilters,
  getActiveFilterChips,
  hasAdvancedCustomerFilters,
  type CustomerFilters,
} from "./lib/filter-customers";

export interface CustomersFiltersProps {
  filters: CustomerFilters;
  onChange: (filters: CustomerFilters) => void;
  resultCount: number;
  /** Omitted when list uses `includeTotal=false` (quick search) */
  totalCount?: number;
  hasMore?: boolean;
  canSaveFilters?: boolean;
  onSaveFilters?: () => void;
}

const segmentKeys: (CustomerSegment | "all")[] = [
  "all",
  "new",
  "active",
  "returning",
  "vip",
  "inactive",
];

export function CustomersFilters({
  filters,
  onChange,
  resultCount,
  totalCount,
  hasMore,
  canSaveFilters = false,
  onSaveFilters,
}: CustomersFiltersProps) {
  const { t, locale } = useAdminT();
  const {
    tag: tagLabel,
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
    tagLabel,
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
      customerAgeRange: "",
      gender: "all",
      purchaseTypes: [],
      customerTypes: [],
      firstVisitFrom: "",
      firstVisitTo: "",
      lastPurchaseFrom: "",
      lastPurchaseTo: "",
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
        <DashboardSelect
          value={filters.segment}
          onChange={(e) =>
            update({ segment: e.target.value as CustomerSegment | "all" })
          }
          aria-label={t("customers.table.segment")}
          className="sm:w-44"
        >
          {segmentKeys.map((value) => (
            <DashboardSelectOption key={value} value={value}>
              {value === "all"
                ? t("customers.filters.allSegments")
                : t(`customers.segment.${value}`)}
            </DashboardSelectOption>
          ))}
        </DashboardSelect>
        <DashboardSelect
          value={filters.status}
          onChange={(e) =>
            update({ status: e.target.value as CustomerFilters["status"] })
          }
          aria-label={t("common.status")}
          className="sm:w-36"
        >
          <DashboardSelectOption value="all">
            {t("customers.filters.allStatuses")}
          </DashboardSelectOption>
          <DashboardSelectOption value="active">
            {t("customers.accountStatus.active")}
          </DashboardSelectOption>
          <DashboardSelectOption value="blocked">
            {t("customers.accountStatus.blocked")}
          </DashboardSelectOption>
        </DashboardSelect>
        <label className="flex items-center gap-2 text-sm text-ink-muted">
          <input
            type="checkbox"
            checked={filters.vipOnly}
            onChange={(e) => update({ vipOnly: e.target.checked })}
            className="size-4 rounded border-border accent-primary"
          />
          {t("customers.filters.vipOnly")}
        </label>
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
            {canSaveFilters && onSaveFilters && (
              <Button variant="secondary" size="sm" onClick={onSaveFilters}>
                {t("common.saveFilters")}
              </Button>
            )}
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
