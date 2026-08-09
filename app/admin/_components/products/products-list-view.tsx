"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { buttonVariants } from "@/components/ui/button";
import {
  DashboardCard,
  DashboardCardHeader,
  DashboardCardTitle,
  DashboardSectionTitle,
} from "@/components/admin/ui/dashboard-card";
import { ProductsFilters } from "./products-filters";
import { ProductsTable } from "./products-table";
import {
  DashboardPagination,
  PRODUCT_PAGE_SIZE_OPTIONS,
} from "@/components/admin/ui/dashboard-pagination";
import { ArchiveProductModal } from "./product-modals";
import { useProductsList } from "./use-products";
import { archiveProduct } from "@/lib/api/products";
import { paginationHasExactTotal } from "@/lib/api/types";
import { useAdminT } from "../layout/admin-locale-provider";

export function ProductsListView() {
  const router = useRouter();
  const { t } = useAdminT();
  const {
    products,
    meta,
    filters,
    setFilters,
    page,
    setPage,
    perPage,
    setPerPage,
    loading,
    error,
    refetch,
  } = useProductsList();

  const [archiveTarget, setArchiveTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

  async function handleArchiveFromList() {
    if (!archiveTarget) return;
    await archiveProduct(archiveTarget.id);
    setArchiveTarget(null);
    refetch();
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <DashboardSectionTitle
          title={t("products.catalogTitle")}
          subtitle={t("products.catalogSubtitle")}
        />
        <Link
          href="/admin/products/new"
          className={buttonVariants({ variant: "default", size: "sm" })}
        >
          {t("products.addProduct")}
        </Link>
      </div>

      {error && (
        <p
          className="rounded-[var(--radius-md)] border border-error/30 bg-error/5 px-4 py-3 text-sm text-error"
          role="alert"
        >
          {error}
          <Button variant="ghost" size="sm" className="ms-3" onClick={refetch}>
            {t("common.retry")}
          </Button>
        </p>
      )}

      <DashboardCard>
        <DashboardCardHeader>
          <DashboardCardTitle>{t("products.title")}</DashboardCardTitle>
        </DashboardCardHeader>

        <ProductsFilters
          filters={filters}
          onChange={setFilters}
          resultCount={products.length}
          totalCount={
            meta && paginationHasExactTotal(meta) ? meta.total : undefined
          }
        />

        <div className="mt-6">
          {loading && products.length === 0 ? (
            <div className="flex flex-col gap-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <ProductsTable
              products={products}
              onArchive={(product) =>
                setArchiveTarget({ id: product.id, name: product.name })
              }
            />
          )}
        </div>

        {meta && products.length > 0 && (
          <DashboardPagination
            className="mt-6"
            meta={meta}
            resultCount={products.length}
            onPageChange={setPage}
            onPerPageChange={setPerPage}
            disabled={loading}
            entityLabel={t("pagination.productsEntity")}
            pageSizeOptions={PRODUCT_PAGE_SIZE_OPTIONS}
          />
        )}
      </DashboardCard>

      {archiveTarget && (
        <ArchiveProductModal
          productName={archiveTarget.name}
          onClose={() => setArchiveTarget(null)}
          onConfirm={handleArchiveFromList}
        />
      )}
    </div>
  );
}
