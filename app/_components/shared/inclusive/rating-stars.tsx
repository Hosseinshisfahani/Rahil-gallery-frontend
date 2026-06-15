import { cn } from "@/lib/utils";
import type { ComponentSize } from "@/_components/core/types";

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
