"use client";

import { cn } from "@/lib/utils";
import { useRef, type ClipboardEvent, type KeyboardEvent } from "react";
import { inputVariants } from "@/_components/core/config/variants";

export interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  hasError?: boolean;
  disabled?: boolean;
  id?: string;
  className?: string;
  ariaLabel?: string;
}

export function OtpInput({
  length = 6,
  value,
  onChange,
  hasError,
  disabled,
  id,
  className,
  ariaLabel = "One-time password",
}: OtpInputProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.padEnd(length, " ").slice(0, length).split("");

  const handleChange = (index: number, char: string) => {
    const digit = char.replace(/\D/g, "").slice(-1);
    const chars = value.padEnd(length, " ").slice(0, length).split("");
    chars[index] = digit;
    onChange(chars.join("").replace(/\s/g, "").slice(0, length));
    if (digit && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index]?.trim() && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);
    onChange(pasted);
    inputsRef.current[Math.min(pasted.length, length - 1)]?.focus();
  };

  return (
    <div
      id={id}
      className={cn("flex gap-2 text-ltr", className)}
      role="group"
      aria-label={ariaLabel}
    >
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputsRef.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={1}
          value={digits[index]?.trim() ?? ""}
          disabled={disabled}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          dir="ltr"
          className={cn(
            inputVariants({ hasError }),
            "size-11 text-center text-lg font-medium",
          )}
          aria-label={`Digit ${index + 1} of ${length}`}
        />
      ))}
    </div>
  );
}
