import { cn } from "@/lib/utils";
import {
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import { Label } from "@/_components/core/primitive/label";

export interface FormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  labelClassName?: string;
  children: ReactNode;
}

export function FormField({
  id,
  label,
  required,
  error,
  hint,
  className,
  labelClassName,
  children,
}: FormFieldProps) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  const control = isValidElement(children)
    ? cloneElement(children as ReactElement<Record<string, unknown>>, {
        id,
        "aria-describedby": describedBy,
        "aria-invalid": error ? true : undefined,
        hasError: Boolean(error),
      })
    : children;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label htmlFor={id} required={required} className={labelClassName}>
        {label}
      </Label>
      {control}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-ink-subtle">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-xs text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
