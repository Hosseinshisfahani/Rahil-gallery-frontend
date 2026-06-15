"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import { Input } from "@/_components/core/primitive/input";

export interface PhoneInputProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  hasError?: boolean;
  disabled?: boolean;
  className?: string;
  countryCode?: string;
  placeholder?: string;
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  function PhoneInput(
    {
      id,
      value,
      onChange,
      hasError,
      disabled,
      className,
      countryCode = "+98",
      placeholder = "912 345 6789",
    },
    ref,
  ) {
    const handleChange = (raw: string) => {
      onChange(raw.replace(/\D/g, "").slice(0, 10));
    };

    return (
      <div className={cn("flex text-ltr", className)}>
        <span
          className={cn(
            "inline-flex h-11 items-center rounded-s-md border border-e-0 bg-surface-elevated px-3 text-sm text-ink-muted",
            hasError ? "border-error" : "border-border",
          )}
          aria-hidden="true"
        >
          {countryCode}
        </span>
        <Input
          ref={ref}
          id={id}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          placeholder={placeholder}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          hasError={hasError}
          disabled={disabled}
          className="rounded-s-none"
          dir="ltr"
        />
      </div>
    );
  },
);
