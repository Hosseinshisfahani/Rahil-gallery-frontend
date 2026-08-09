"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DashboardSelect, DashboardSelectOption } from "@/components/admin/ui/dashboard-select";
import type { JewelryType, ProductStatus } from "@/lib/api/products/types";
import { useAdminT } from "../layout/admin-locale-provider";
import {
  countActiveProductFilters,
  defaultProductFilters,
  type ProductFilters,
} from "@/lib/api/products";

export interface ProductsFiltersProps {
  filters: ProductFilters;
  onChange: (filters: ProductFilters) => void;
  resultCount: number;
  totalCount?: number;
  className?: string;
}

const jewelryTypes: JewelryType[] = [
  "ring",
  "necklace",
  "bracelet",
  "earring",
  "pendant",
  "anklet",
  "brooch",
  "set",
  "other",
];

export function ProductsFilters({
  filters,
  onChange,
  resultCount,
  totalCount,
  className,
}: ProductsFiltersProps) {
  const { t, locale } = useAdminT();
  const activeFilterCount = countActiveProductFilters(filters);

  const statusOptions: { value: ProductStatus | "all"; label: string }[] = [
    { value: "all", label: t("products.filters.allStatuses") },
    { value: "draft", label: t("products.status.draft") },
    { value: "published", label: t("products.status.published") },
    { value: "archived", label: t("products.status.archived") },
  ];

  function update(partial: Partial<ProductFilters>) {
    onChange({ ...filters, ...partial });
  }

  function clearFilters() {
    onChange({ ...defaultProductFilters, query: filters.query });
  }

  const countLabel =
    totalCount !== undefined
      ? t("products.filters.showingCount", {
          count: resultCount.toLocaleString(locale === "fa" ? "fa-IR" : "en-US"),
          total: totalCount.toLocaleString(locale === "fa" ? "fa-IR" : "en-US"),
        })
      : t("products.filters.showingPagePartial", {
          count: resultCount.toLocaleString(locale === "fa" ? "fa-IR" : "en-US"),
          more: "",
        });

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1">
          <label htmlFor="product-search" className="text-xs font-medium text-ink-muted">
            {t("common.search")}
          </label>
          <Input
            id="product-search"
            value={filters.query}
            onChange={(e) => update({ query: e.target.value })}
            placeholder={t("products.filters.placeholder")}
            className="mt-1.5"
          />
        </div>

        <div className="w-full sm:w-40">
          <label htmlFor="product-status" className="text-xs font-medium text-ink-muted">
            {t("common.status")}
          </label>
          <DashboardSelect
            id="product-status"
            value={filters.status}
            onChange={(e) =>
              update({ status: e.target.value as ProductFilters["status"] })
            }
            className="mt-1.5"
          >
            {statusOptions.map((opt) => (
              <DashboardSelectOption key={opt.value} value={opt.value}>
                {opt.label}
              </DashboardSelectOption>
            ))}
          </DashboardSelect>
        </div>

        <div className="w-full sm:w-40">
          <label htmlFor="product-type" className="text-xs font-medium text-ink-muted">
            {t("products.filters.jewelryType")}
          </label>
          <DashboardSelect
            id="product-type"
            value={filters.jewelryType}
            onChange={(e) =>
              update({ jewelryType: e.target.value as ProductFilters["jewelryType"] })
            }
            className="mt-1.5"
          >
            <DashboardSelectOption value="all">
              {t("products.filters.allTypes")}
            </DashboardSelectOption>
            {jewelryTypes.map((value) => (
              <DashboardSelectOption key={value} value={value}>
                {t(`products.jewelryType.${value}`)}
              </DashboardSelectOption>
            ))}
          </DashboardSelect>
        </div>

        <label className="flex items-center gap-2 pb-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={filters.featuredOnly}
            onChange={(e) => update({ featuredOnly: e.target.checked })}
            className="size-4 rounded border-border accent-primary"
          />
          {t("products.filters.featuredOnly")}
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-muted">{countLabel}</p>
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            {t("products.filters.clearFilters", { count: activeFilterCount })}
          </Button>
        )}
      </div>
    </div>
  );
}
