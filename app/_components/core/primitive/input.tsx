import { forwardRef, type InputHTMLAttributes } from "react";
import { inputVariants } from "@/_components/core/config/variants";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input({ className, hasError, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={inputVariants({ hasError, className })}
        {...props}
      />
    );
  },
);

export function inputClassName(
  options: Parameters<typeof inputVariants>[0],
) {
  return inputVariants(options);
}
