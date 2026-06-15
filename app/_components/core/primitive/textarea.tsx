import { forwardRef, type TextareaHTMLAttributes } from "react";
import { textareaVariants } from "@/_components/core/config/variants";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ className, hasError, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        className={textareaVariants({ hasError, className })}
        {...props}
      />
    );
  },
);
