import type { Locale } from "@/_components/core/types";
import { Badge, type BadgeVariant } from "@/_components/core/primitive/badge";

export type OrderStatus =
  | "pending_payment"
  | "cancelled"
  | "paid"
  | "confirmed"
  | "in_production"
  | "quality_check"
  | "ready_to_ship"
  | "shipped"
  | "delivered"
  | "return_requested"
  | "return_approved"
  | "return_rejected"
  | "refunded";

export type OrderStatusLabels = Record<OrderStatus, string>;

const defaultLabels: Record<Locale, OrderStatusLabels> = {
  en: {
    pending_payment: "Awaiting payment",
    cancelled: "Cancelled",
    paid: "Payment received",
    confirmed: "Confirmed",
    in_production: "Being crafted",
    quality_check: "Quality check",
    ready_to_ship: "Ready to ship",
    shipped: "Shipped",
    delivered: "Delivered",
    return_requested: "Return requested",
    return_approved: "Return approved",
    return_rejected: "Return declined",
    refunded: "Refunded",
  },
  fa: {
    pending_payment: "در انتظار پرداخت",
    cancelled: "لغو شده",
    paid: "پرداخت شده",
    confirmed: "تایید شده",
    in_production: "در حال ساخت",
    quality_check: "کنترل کیفیت",
    ready_to_ship: "آماده ارسال",
    shipped: "ارسال شده",
    delivered: "تحویل شده",
    return_requested: "درخواست مرجوعی",
    return_approved: "مرجوعی تایید شد",
    return_rejected: "مرجوعی رد شد",
    refunded: "بازپرداخت شده",
  },
};

const statusVariantMap: Record<OrderStatus, BadgeVariant> = {
  pending_payment: "warning",
  cancelled: "default",
  paid: "info",
  confirmed: "info",
  in_production: "accent",
  quality_check: "accent",
  ready_to_ship: "info",
  shipped: "info",
  delivered: "success",
  return_requested: "warning",
  return_approved: "warning",
  return_rejected: "error",
  refunded: "default",
};

export interface StatusBadgeProps {
  status: OrderStatus;
  locale?: Locale;
  labels?: Partial<OrderStatusLabels>;
  className?: string;
}

export function StatusBadge({
  status,
  locale = "en",
  labels,
  className,
}: StatusBadgeProps) {
  const label = labels?.[status] ?? defaultLabels[locale][status];

  return (
    <Badge variant={statusVariantMap[status]} className={className}>
      {label}
    </Badge>
  );
}
