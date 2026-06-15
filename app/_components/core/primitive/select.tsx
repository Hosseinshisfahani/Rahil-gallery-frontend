import { forwardRef, type SelectHTMLAttributes } from "react";
import { selectVariants } from "@/_components/core/config/variants";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select({ className, hasError, children, ...props }, ref) {
    return (
      <select
        ref={ref}
        className={selectVariants({ hasError, className })}
        {...props}
      >
        {children}
      </select>
    );
  },
);
