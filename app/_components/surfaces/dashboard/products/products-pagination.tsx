"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/_components/core/primitive/button";
import { DashboardSelect, DashboardSelectOption } from "../abstract/dashboard-select";
import type { PaginationMeta } from "@/lib/api/types";
import { paginationHasExactTotal } from "@/lib/api/types";
import { useAdminT } from "../layout/admin-locale-provider";

export const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;

export interface ProductsPaginationProps {
  meta: PaginationMeta;
  resultCount: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
  className?: string;
  disabled?: boolean;
}

function pageRange(current: number, total: number): number[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = new Set<number>([1, total, current, current - 1, current + 1]);
  return [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
}

export function ProductsPagination({
  meta,
  resultCount,
  onPageChange,
  onPerPageChange,
  className,
  disabled = false,
}: ProductsPaginationProps) {
  const { t, locale } = useAdminT();
  const { page, perPage, totalPages, hasMore } = meta;
  const exactTotal = paginationHasExactTotal(meta);
  const pages = exactTotal && totalPages !== undefined ? pageRange(page, totalPages) : [];

  const intlLocale = locale === "fa" ? "fa-IR" : "en-US";

  let summary: string;
  if (resultCount === 0) {
    summary = t("pagination.noResults");
  } else if (exactTotal && meta.total !== undefined) {
    const start = (page - 1) * perPage + 1;
    const end = Math.min(page * perPage, meta.total);
    summary = t("pagination.showingRange", {
      start: start.toLocaleString(intlLocale),
      end: end.toLocaleString(intlLocale),
      total: meta.total.toLocaleString(intlLocale),
      entity: t("pagination.productsEntity"),
    });
  } else {
    const start = (page - 1) * perPage + 1;
    const end = start + resultCount - 1;
    summary = t("pagination.showingRangeMore", {
      start: start.toLocaleString(intlLocale),
      end: end.toLocaleString(intlLocale),
      more: "",
    });
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-t border-border/60 pt-4 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
      aria-label={t("pagination.listPagination")}
    >
      <p className="text-sm text-ink-muted">{summary}</p>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-ink-muted">
          {t("pagination.rows")}
          <DashboardSelect
            fieldSize="sm"
            value={String(perPage)}
            onChange={(e) => onPerPageChange(Number(e.target.value))}
            disabled={disabled}
            aria-label={t("pagination.rowsPerPage")}
            className="w-20"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <DashboardSelectOption key={size} value={size}>
                {size}
              </DashboardSelectOption>
            ))}
          </DashboardSelect>
        </label>

        <nav className="flex items-center gap-1" aria-label={t("pagination.listPagination")}>
          <Button
            variant="ghost"
            size="sm"
            disabled={disabled || page <= 1}
            onClick={() => onPageChange(page - 1)}
            aria-label={t("pagination.previousPage")}
          >
            {t("pagination.prev")}
          </Button>

          {exactTotal && totalPages !== undefined ? (
            pages.map((p, index) => {
              const prev = pages[index - 1];
              const showEllipsis = prev !== undefined && p - prev > 1;

              return (
                <span key={p} className="flex items-center gap-1">
                  {showEllipsis && (
                    <span className="px-1 text-ink-muted" aria-hidden="true">
                      …
                    </span>
                  )}
                  <Button
                    variant={p === page ? "secondary" : "ghost"}
                    size="sm"
                    disabled={disabled}
                    onClick={() => onPageChange(p)}
                    aria-label={t("pagination.page", { page: p })}
                    aria-current={p === page ? "page" : undefined}
                    className="min-w-9"
                  >
                    {p}
                  </Button>
                </span>
              );
            })
          ) : (
            <span className="px-2 text-sm tabular-nums text-ink-muted">
              {t("pagination.page", { page })}
            </span>
          )}

          <Button
            variant="ghost"
            size="sm"
            disabled={
              disabled ||
              (exactTotal && totalPages !== undefined
                ? page >= totalPages
                : hasMore === false)
            }
            onClick={() => onPageChange(page + 1)}
            aria-label={t("pagination.nextPage")}
          >
            {t("pagination.next")}
          </Button>
        </nav>
      </div>
    </div>
  );
}
