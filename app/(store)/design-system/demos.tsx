"use client";

import Link from "next/link";
import {
  cloneElement,
  forwardRef,
  isValidElement,
  useRef,
  type ClipboardEvent,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import type { Locale, PaddingSize } from "@/lib/types";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Badge,
  Heading,
  Text,
  type BadgeVariant,
} from "@/app/(store)/_components/store-ui";

// --- section-title ---

export interface SectionTitleProps {
  className?: string;
  title: string;
  subtitle?: string;
  level?: 2 | 3 | 4;
}

export function SectionTitle({
  className,
  title,
  subtitle,
  level = 2,
}: SectionTitleProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Heading level={level}>{title}</Heading>
      {subtitle && <Text muted>{subtitle}</Text>}
    </div>
  );
}

// --- card ---

const cardPaddingMap = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
} as const;

export interface CardProps {
  className?: string;
  children: React.ReactNode;
  padding?: PaddingSize;
}

export function Card({ className, children, padding = "md" }: CardProps) {
  return (
    <div
      className={cn(
        "ds-card rounded-[var(--radius-lg)] border border-border bg-surface shadow-sm",
        cardPaddingMap[padding],
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mb-4 flex flex-col gap-1", className)}>{children}</div>
  );
}

export function CardTitle({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <h3 className={cn("font-display text-xl font-normal text-ink", className)}>
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p className={cn("text-sm text-ink-muted", className)}>{children}</p>
  );
}

// --- empty-state ---

export interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
  className?: string;
  icon?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
  className,
  icon,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 py-16 text-center",
        className,
      )}
    >
      <div
        className="flex size-16 items-center justify-center rounded-full border border-border bg-surface"
        aria-hidden={!icon}
      >
        {icon ?? (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-ink-subtle"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M8 12h8" />
          </svg>
        )}
      </div>
      <div className="flex max-w-sm flex-col gap-2">
        <h3 className="font-display text-xl font-bold">{title}</h3>
        {description && (
          <p className="text-sm text-ink-muted">{description}</p>
        )}
      </div>
      {actionLabel &&
        (actionHref ? (
          <Link
            href={actionHref}
            className={buttonVariants({ variant: "outline" })}
          >
            {actionLabel}
          </Link>
        ) : (
          <Button variant="outline" onClick={onAction}>
            {actionLabel}
          </Button>
        ))}
    </div>
  );
}

// --- form-field ---

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

// --- phone-input ---

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

// --- otp-input ---

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
          aria-invalid={hasError || undefined}
          className={cn(
            "size-11 rounded-[var(--radius-control)] border border-border bg-surface text-center text-lg font-medium text-ink outline-none",
            "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
            "aria-invalid:border-destructive",
            "disabled:cursor-not-allowed disabled:opacity-50",
          )}
          aria-label={`Digit ${index + 1} of ${length}`}
        />
      ))}
    </div>
  );
}

// --- status-badge ---

export type OrderStatus =
  | "pending_payment"
  | "cancelled"
  | "paid"
  | "confirmed"
  | "in_production"
  | "quality_check"
  | "ready_to_ship"
  | "shipped"
  | "delivered"
  | "return_requested"
  | "return_approved"
  | "return_rejected"
  | "refunded";

export type OrderStatusLabels = Record<OrderStatus, string>;

const defaultLabels: Record<Locale, OrderStatusLabels> = {
  en: {
    pending_payment: "Awaiting payment",
    cancelled: "Cancelled",
    paid: "Payment received",
    confirmed: "Confirmed",
    in_production: "Being crafted",
    quality_check: "Quality check",
    ready_to_ship: "Ready to ship",
    shipped: "Shipped",
    delivered: "Delivered",
    return_requested: "Return requested",
    return_approved: "Return approved",
    return_rejected: "Return declined",
    refunded: "Refunded",
  },
  fa: {
    pending_payment: "در انتظار پرداخت",
    cancelled: "لغو شده",
    paid: "پرداخت شده",
    confirmed: "تایید شده",
    in_production: "در حال ساخت",
    quality_check: "کنترل کیفیت",
    ready_to_ship: "آماده ارسال",
    shipped: "ارسال شده",
    delivered: "تحویل شده",
    return_requested: "درخواست مرجوعی",
    return_approved: "مرجوعی تایید شد",
    return_rejected: "مرجوعی رد شد",
    refunded: "بازپرداخت شده",
  },
};

const statusVariantMap: Record<OrderStatus, BadgeVariant> = {
  pending_payment: "warning",
  cancelled: "default",
  paid: "info",
  confirmed: "info",
  in_production: "accent",
  quality_check: "accent",
  ready_to_ship: "info",
  shipped: "info",
  delivered: "success",
  return_requested: "warning",
  return_approved: "warning",
  return_rejected: "error",
  refunded: "default",
};

export interface StatusBadgeProps {
  status: OrderStatus;
  locale?: Locale;
  labels?: Partial<OrderStatusLabels>;
  className?: string;
}

export function StatusBadge({
  status,
  locale = "en",
  labels,
  className,
}: StatusBadgeProps) {
  const label = labels?.[status] ?? defaultLabels[locale][status];

  return (
    <Badge variant={statusVariantMap[status]} className={className}>
      {label}
    </Badge>
  );
}
