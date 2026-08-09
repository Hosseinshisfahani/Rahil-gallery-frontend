import * as React from "react";

import { cn } from "@/lib/utils";

function Input({
  className,
  type,
  hasError,
  ...props
}: React.ComponentProps<"input"> & {
  hasError?: boolean;
}) {
  return (
    <input
      type={type}
      data-slot="input"
      aria-invalid={hasError || props["aria-invalid"]}
      className={cn(
        "h-[var(--control-height-md)] w-full min-w-0 rounded-[var(--radius-control)] border border-border bg-surface px-3 py-1 text-sm text-ink transition-colors outline-none",
        "file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-ink",
        "placeholder:text-ink-subtle",
        "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-surface-elevated disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
