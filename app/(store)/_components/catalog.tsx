import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  Badge,
  type BadgeVariant,
} from "./store-ui";
import type { ClassNames, ComponentSize, Locale } from "@/lib/types";

// --- availability-badge ---

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

// --- price-display ---

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

// --- rating-stars ---

export interface RatingStarsProps {
  rating: number;
  max?: number;
  count?: number;
  size?: Extract<ComponentSize, "sm" | "md">;
  className?: string;
}

export function RatingStars({
  rating,
  max = 5,
  count,
  size = "md",
  className,
}: RatingStarsProps) {
  const starSize = size === "sm" ? 14 : 16;
  const clamped = Math.min(max, Math.max(0, rating));

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <div
        className="inline-flex gap-0.5"
        role="img"
        aria-label={`${clamped} out of ${max} stars`}
      >
        {Array.from({ length: max }).map((_, i) => {
          const filled = i < Math.floor(clamped);
          const partial = !filled && i < clamped;

          return (
            <svg
              key={i}
              width={starSize}
              height={starSize}
              viewBox="0 0 16 16"
              fill={filled || partial ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1.25"
              className={cn(
                filled || partial ? "text-ink" : "text-border",
                partial && "opacity-50",
              )}
              aria-hidden="true"
            >
              <path d="M8 1.5l1.76 3.57 3.94.57-2.85 2.78.67 3.92L8 10.27l-3.52 1.85.67-3.92L2.3 5.64l3.94-.57L8 1.5z" />
            </svg>
          );
        })}
      </div>
      {count !== undefined && (
        <span className="text-sm text-ink-subtle">({count})</span>
      )}
    </div>
  );
}

// --- product-card ---

export interface ProductCardProps {
  href: string;
  title: string;
  imageUrl: string;
  imageAlt?: string;
  priceFrom: number;
  priceTo?: number;
  locale?: Locale;
  availability?: AvailabilityStatus;
  rating?: number;
  reviewCount?: number;
  className?: string;
  classNames?: ClassNames<
    "root" | "media" | "image" | "badge" | "body" | "title" | "meta"
  >;
  priority?: boolean;
  imageSizes?: string;
}

export function ProductCard({
  href,
  title,
  imageUrl,
  imageAlt,
  priceFrom,
  priceTo,
  locale = "en",
  availability,
  rating,
  reviewCount,
  className,
  classNames,
  priority,
  imageSizes = "(max-width: 768px) 50vw, 33vw",
}: ProductCardProps) {
  const unoptimized =
    imageUrl.endsWith(".svg") ||
    imageUrl.startsWith("http://") ||
    imageUrl.startsWith("https://");

  return (
    <article className={cn("group flex flex-col gap-3", className, classNames?.root)}>
      <Link
        href={href}
        className={cn(
          "relative block overflow-hidden bg-surface-elevated",
          classNames?.media,
        )}
      >
        <div className={cn("relative aspect-square", classNames?.image)}>
          <Image
            src={imageUrl}
            alt={imageAlt ?? title}
            fill
            sizes={imageSizes}
            unoptimized={unoptimized}
            className="object-cover transition-opacity duration-500 group-hover:opacity-90"
            priority={priority}
          />
        </div>
        {availability && (
          <div className={cn("absolute start-3 top-3", classNames?.badge)}>
            <AvailabilityBadge status={availability} locale={locale} />
          </div>
        )}
      </Link>
      <div className={cn("flex flex-col gap-1.5", classNames?.body)}>
        <Link href={href}>
          <h3
            className={cn(
              "ds-product-title font-display text-[0.9375rem] leading-snug transition-colors",
              classNames?.title,
            )}
          >
            {title}
          </h3>
        </Link>
        {(rating !== undefined || priceFrom) && (
          <div className={cn("flex flex-col gap-1", classNames?.meta)}>
            {rating !== undefined && (
              <RatingStars rating={rating} count={reviewCount} size="sm" />
            )}
            <PriceRangeDisplay
              from={priceFrom}
              to={priceTo}
              locale={locale}
            />
          </div>
        )}
      </div>
    </article>
  );
}

// --- product-grid ---

export interface ProductGridProps {
  children: React.ReactNode;
  className?: string;
  columns?: "default" | "compact" | "wide";
}

const columnStyles = {
  default:
    "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6",
  compact: "grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-3 gap-y-6",
  wide: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10",
};

export function ProductGrid({
  children,
  className,
  columns = "default",
}: ProductGridProps) {
  return (
    <div className={cn("grid", columnStyles[columns], className)}>
      {children}
    </div>
  );
}
