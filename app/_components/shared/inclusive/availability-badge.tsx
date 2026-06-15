import type { Locale } from "@/_components/core/types";
import { Badge, type BadgeVariant } from "@/_components/core/primitive/badge";

export type AvailabilityStatus = "in_stock" | "made_to_order" | "out_of_stock";

export type AvailabilityLabels = Record<AvailabilityStatus, string>;

const defaultLabels: Record<Locale, AvailabilityLabels> = {
  en: {
    in_stock: "In stock",
    made_to_order: "Made to order",
    out_of_stock: "Unavailable",
  },
  fa: {
    in_stock: "موجود",
    made_to_order: "سفارشی",
    out_of_stock: "ناموجود",
  },
};

const statusVariantMap: Record<AvailabilityStatus, BadgeVariant> = {
  in_stock: "success",
  made_to_order: "warning",
  out_of_stock: "default",
};

export interface AvailabilityBadgeProps {
  status: AvailabilityStatus;
  locale?: Locale;
  labels?: Partial<AvailabilityLabels>;
  className?: string;
}

export function AvailabilityBadge({
  status,
  locale = "en",
  labels,
  className,
}: AvailabilityBadgeProps) {
  const label = labels?.[status] ?? defaultLabels[locale][status];

  return (
    <Badge variant={statusVariantMap[status]} className={className}>
      {label}
    </Badge>
  );
}
