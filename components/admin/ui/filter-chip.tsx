"use client";

import { cn } from "@/lib/utils";

export interface FilterChipProps {
  label: string;
  active?: boolean;
  onRemove?: () => void;
  className?: string;
  removeLabel?: string;
}

export function FilterChip({
  label,
  active = false,
  onRemove,
  className,
  removeLabel,
}: FilterChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm border px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? "border-ink bg-ink text-canvas"
          : "border-border bg-surface text-ink hover:border-ink-muted",
        className,
      )}
    >
      {label}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="inline-flex size-4 items-center justify-center rounded-sm hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1"
          aria-label={removeLabel ?? `Remove ${label} filter`}
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path d="M1 1l8 8M9 1L1 9" />
          </svg>
        </button>
      )}
    </span>
  );
}
