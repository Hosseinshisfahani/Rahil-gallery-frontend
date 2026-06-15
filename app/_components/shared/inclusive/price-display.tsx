import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ComponentSize, Locale } from "@/_components/core/types";

export interface PriceDisplayProps {
  amount: number;
  locale?: Locale;
  size?: ComponentSize;
  className?: string;
  suffix?: string;
}

const sizeStyles: Record<ComponentSize, string> = {
  sm: "text-sm",
  md: "text-base font-medium",
  lg: "text-xl font-semibold",
};

export function PriceDisplay({
  amount,
  locale = "en",
  size = "md",
  className,
  suffix,
}: PriceDisplayProps) {
  return (
    <span
      className={cn("text-ltr tabular-nums text-ink", sizeStyles[size], className)}
      dir="ltr"
    >
      {formatPrice(amount, locale)}
      {suffix && (
        <span className="ms-1 text-sm font-normal text-ink-subtle">{suffix}</span>
      )}
    </span>
  );
}

export interface PriceRangeDisplayProps {
  from: number;
  to?: number;
  locale?: Locale;
  size?: ComponentSize;
  className?: string;
}

export function PriceRangeDisplay({
  from,
  to,
  locale = "en",
  size = "md",
  className,
}: PriceRangeDisplayProps) {
  if (to && to !== from) {
    return (
      <span className={cn("text-ltr tabular-nums", className)} dir="ltr">
        <PriceDisplay amount={from} locale={locale} size={size} />
        <span className="mx-1 text-ink-subtle">–</span>
        <PriceDisplay amount={to} locale={locale} size={size} />
      </span>
    );
  }

  return (
    <PriceDisplay amount={from} locale={locale} size={size} className={className} />
  );
}
