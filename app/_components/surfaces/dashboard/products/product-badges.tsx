"use client";

import { cn } from "@/lib/utils";
import type {
  JewelryType,
  ProductAvailability,
  ProductStatus,
} from "@/lib/api/products/types";
import { useAdminT } from "../layout/admin-locale-provider";

const statusStyles: Record<ProductStatus, string> = {
  draft: "bg-surface-elevated text-ink-muted",
  published: "bg-success/10 text-success",
  archived: "bg-ink-muted/10 text-ink-muted line-through",
};

export function ProductStatusBadge({
  status,
  className,
}: {
  status: ProductStatus;
  className?: string;
}) {
  const { t } = useAdminT();
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
        statusStyles[status],
        className,
      )}
    >
      {t(`products.status.${status}`)}
    </span>
  );
}

const availabilityStyles: Record<ProductAvailability, string> = {
  in_stock: "bg-success/10 text-success",
  out_of_stock: "bg-error/10 text-error",
};

export function ProductAvailabilityBadge({
  availability,
  className,
}: {
  availability: ProductAvailability;
  className?: string;
}) {
  const { t } = useAdminT();
  const key =
    availability === "in_stock"
      ? "products.availability.inStock"
      : "products.availability.outOfStock";

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
        availabilityStyles[availability],
        className,
      )}
    >
      {t(key)}
    </span>
  );
}

export function FeaturedBadge({ className }: { className?: string }) {
  const { t } = useAdminT();
  return (
    <span
      className={cn(
        "inline-flex rounded-full bg-accent/15 px-2 py-0.5 text-xs font-medium text-accent",
        className,
      )}
    >
      {t("products.featured")}
    </span>
  );
}

export function useJewelryTypeLabel(type: JewelryType): string {
  const { t } = useAdminT();
  return t(`products.jewelryType.${type}`);
}

export function JewelryTypeBadge({
  type,
  className,
}: {
  type: JewelryType;
  className?: string;
}) {
  const label = useJewelryTypeLabel(type);
  return (
    <span
      className={cn(
        "inline-flex rounded-full bg-surface-elevated px-2 py-0.5 text-xs font-medium text-ink",
        className,
      )}
    >
      {label}
    </span>
  );
}
