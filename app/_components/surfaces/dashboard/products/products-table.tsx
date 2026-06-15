"use client";

import Link from "next/link";
import { CatalogImage } from "@/_components/shared/catalog-image";
import { buttonVariants } from "@/_components/core/config/variants";
import { formatPrice } from "@/lib/format";
import type { ProductSummary } from "@/lib/api/products/types";
import {
  ResponsiveTable,
  TableCell,
  tableBodyRowClass,
  tableHeadRowClass,
  tableThClass,
} from "../abstract/responsive-table";
import {
  FeaturedBadge,
  JewelryTypeBadge,
  ProductAvailabilityBadge,
} from "./product-badges";
import { useAdminT } from "../layout/admin-locale-provider";

export interface ProductsTableProps {
  products: ProductSummary[];
  onArchive?: (product: ProductSummary) => void;
  className?: string;
}

export function ProductsTable({
  products,
  onArchive,
  className,
}: ProductsTableProps) {
  const { t, locale } = useAdminT();

  if (products.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-ink-muted">
        {t("products.emptyTable")}
      </div>
    );
  }

  return (
    <ResponsiveTable className={className}>
      <thead>
        <tr className={tableHeadRowClass}>
          <th className={tableThClass}>{t("products.table.product")}</th>
          <th className={tableThClass}>{t("products.table.slug")}</th>
          <th className={tableThClass}>{t("products.table.category")}</th>
          <th className={tableThClass}>{t("products.table.type")}</th>
          <th className={tableThClass}>{t("products.table.price")}</th>
          <th className={tableThClass}>{t("products.table.stock")}</th>
          {onArchive && <th className={tableThClass}>{t("common.actions")}</th>}
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.id} className={tableBodyRowClass}>
            <TableCell label={t("products.table.product")} layout="stack">
              <div className="flex items-center gap-3">
                <div className="relative size-10 shrink-0 overflow-hidden rounded-[var(--radius-sm)] bg-surface-elevated">
                  {product.primaryImageUrl ? (
                    <CatalogImage
                      src={product.primaryImageUrl}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center text-xs text-ink-muted">
                      —
                    </div>
                  )}
                </div>
                <div>
                  <Link
                    href={product.href}
                    className="font-medium text-ink hover:text-primary"
                  >
                    {product.name}
                  </Link>
                  {product.isFeatured && (
                    <span className="ms-2 inline-block align-middle">
                      <FeaturedBadge />
                    </span>
                  )}
                </div>
              </div>
            </TableCell>
            <TableCell label={t("products.table.slug")} className="font-mono text-xs text-ltr">
              <span dir="ltr">{product.slug}</span>
            </TableCell>
            <TableCell label={t("products.table.category")} className="text-ink-muted">
              {product.category}
            </TableCell>
            <TableCell label={t("products.table.type")}>
              <JewelryTypeBadge type={product.jewelryType} />
            </TableCell>
            <TableCell label={t("products.table.price")} className="tabular-nums">
              {formatPrice(product.priceFrom, locale)}
              {product.priceTo !== product.priceFrom && (
                <span className="text-ink-muted">
                  {" "}
                  – {formatPrice(product.priceTo, locale)}
                </span>
              )}
            </TableCell>
            <TableCell label={t("products.table.stock")}>
              <ProductAvailabilityBadge availability={product.availability} />
              <span className="ms-2 text-xs text-ink-muted">
                {t("products.table.variants", { count: product.variantCount })}
              </span>
            </TableCell>
            {onArchive && (
              <TableCell label={t("common.actions")} layout="actions" className="py-3">
                <div className="flex items-center gap-2">
                  <Link
                    href={product.href}
                    className={buttonVariants({ variant: "ghost", size: "sm" })}
                  >
                    {t("common.edit")}
                  </Link>
                  <button
                    type="button"
                    onClick={() => onArchive(product)}
                    className={buttonVariants({
                      variant: "ghost",
                      size: "sm",
                      className: "text-error hover:text-error",
                    })}
                  >
                    {t("common.archive")}
                  </button>
                </div>
              </TableCell>
            )}
          </tr>
        ))}
      </tbody>
    </ResponsiveTable>
  );
}
