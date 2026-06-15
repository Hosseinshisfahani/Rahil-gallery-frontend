import { cn } from "@/lib/utils";
import { forwardRef, type LabelHTMLAttributes } from "react";

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  function Label({ className, required, children, ...props }, ref) {
    return (
      <label
        ref={ref}
        className={cn("block text-sm font-medium text-ink", className)}
        {...props}
      >
        {children}
        {required && (
          <span className="ms-0.5 text-error" aria-hidden="true">
            *
          </span>
        )}
      </label>
    );
  },
);
