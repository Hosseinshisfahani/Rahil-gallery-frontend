import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({
  className,
  hasError,
  ...props
}: React.ComponentProps<"textarea"> & {
  hasError?: boolean;
}) {
  return (
    <textarea
      data-slot="textarea"
      aria-invalid={hasError || props["aria-invalid"]}
      className={cn(
        "flex field-sizing-content min-h-24 w-full resize-y rounded-[var(--radius-control)] border border-border bg-surface px-3 py-2.5 text-sm text-ink transition-colors outline-none",
        "placeholder:text-ink-subtle",
        "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        "disabled:cursor-not-allowed disabled:bg-surface-elevated disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
