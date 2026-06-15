import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  AvailabilityBadge,
  type AvailabilityStatus,
} from "./availability-badge";
import { PriceRangeDisplay } from "./price-display";
import { RatingStars } from "./rating-stars";
import type { ClassNames, Locale } from "@/_components/core/types";

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
