import { cn } from "@/lib/utils";
import type { ComponentSize } from "../types";

/** Headless-adjacent shared behavior classes (surface-agnostic) */
export const disabledStyles =
  "disabled:cursor-not-allowed disabled:pointer-events-none";

export const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-color,var(--color-accent))] focus-visible:ring-offset-2 focus-visible:ring-offset-canvas";

export const focusInput =
  "focus:border-[var(--focus-color,var(--color-accent))] focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--focus-color,var(--color-accent))_20%,transparent)]";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "accent";

const buttonVariantMap: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground border-primary hover:bg-primary-hover disabled:opacity-50",
  secondary:
    "bg-transparent text-ink border-border hover:bg-surface-elevated disabled:opacity-50",
  ghost:
    "bg-transparent text-ink border-transparent hover:bg-surface-elevated disabled:opacity-50",
  accent:
    "bg-accent text-accent-foreground border-accent hover:bg-accent-hover disabled:opacity-50",
};

const buttonSizeMap: Record<ComponentSize, string> = {
  sm: "h-[var(--control-height-sm)] px-3 text-sm gap-1.5",
  md: "h-[var(--control-height-md)] px-4 text-sm gap-2",
  lg: "h-[var(--control-height-lg)] px-5 text-base gap-2",
};

export interface ButtonStyleOptions {
  variant?: ButtonVariant;
  size?: ComponentSize;
  fullWidth?: boolean;
  className?: string;
}

export function buttonVariants({
  variant = "primary",
  size = "md",
  fullWidth,
  className,
}: ButtonStyleOptions = {}) {
  return cn(
    "ds-button inline-flex items-center justify-center border font-medium transition-all duration-200",
    "rounded-[var(--radius-control)]",
    focusRing,
    disabledStyles,
    buttonVariantMap[variant],
    buttonSizeMap[size],
    fullWidth && "w-full",
    className,
  );
}

export type BadgeVariant =
  | "default"
  | "accent"
  | "success"
  | "warning"
  | "error"
  | "info";

const badgeVariantMap: Record<BadgeVariant, string> = {
  default: "bg-surface-elevated text-ink border-border",
  accent: "bg-accent-muted text-accent border-accent/20",
  success: "bg-success-muted text-success border-success/20",
  warning: "bg-warning-muted text-warning border-warning/20",
  error: "bg-error-muted text-error border-error/20",
  info: "bg-info-muted text-info border-info/20",
};

export function badgeVariants({
  variant = "default",
  className,
}: { variant?: BadgeVariant; className?: string } = {}) {
  return cn(
    "ds-badge inline-flex items-center rounded-[var(--radius-sm)] border px-2 py-0.5 text-xs font-medium",
    badgeVariantMap[variant],
    className,
  );
}

export function inputVariants({
  hasError,
  className,
}: { hasError?: boolean; className?: string } = {}) {
  return cn(
    "h-[var(--control-height-md)] w-full rounded-[var(--radius-control)] border bg-surface px-3 text-sm text-ink",
    "placeholder:text-ink-subtle transition-colors duration-150",
    focusInput,
    "disabled:cursor-not-allowed disabled:bg-surface-elevated disabled:text-ink-subtle",
    hasError
      ? "border-error focus:border-error focus:ring-error/20"
      : "border-border",
    className,
  );
}

export function textareaVariants({
  hasError,
  className,
}: { hasError?: boolean; className?: string } = {}) {
  return cn(
    "min-h-24 w-full resize-y rounded-[var(--radius-control)] border bg-surface px-3 py-2.5 text-sm text-ink",
    "placeholder:text-ink-subtle transition-colors duration-150",
    focusInput,
    "disabled:cursor-not-allowed disabled:bg-surface-elevated disabled:text-ink-subtle",
    hasError
      ? "border-error focus:border-error focus:ring-error/20"
      : "border-border",
    className,
  );
}

export function selectVariants({
  hasError,
  className,
}: { hasError?: boolean; className?: string } = {}) {
  return cn(
    inputVariants({ hasError }),
    "appearance-none bg-[length:1rem] bg-[position:right_0.75rem_center] bg-no-repeat pe-9",
    "bg-[url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2716%27 height=%2716%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%2371717a%27 stroke-width=%272%27%3E%3Cpath d=%27M6 9l6 6 6-6%27/%3E%3C/svg%3E')]",
    className,
  );
}

export type HeadingLevel = 1 | 2 | 3 | 4;

export const headingLevelMap: Record<HeadingLevel, string> = {
  1: "ds-heading-1 text-3xl md:text-4xl",
  2: "ds-heading-2 text-2xl md:text-3xl",
  3: "ds-heading-3 text-xl md:text-2xl",
  4: "ds-heading-4 text-lg md:text-xl",
};

export function headingVariants({
  level = 1,
  className,
}: { level?: HeadingLevel; className?: string } = {}) {
  return cn(
    "ds-heading font-display text-ink",
    headingLevelMap[level],
    className,
  );
}

const cardPaddingMap = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
} as const;

export function cardVariants({
  padding = "md",
  className,
}: {
  padding?: keyof typeof cardPaddingMap;
  className?: string;
} = {}) {
  return cn(
    "ds-card rounded-[var(--radius-lg)] border border-border bg-surface shadow-sm",
    cardPaddingMap[padding],
    className,
  );
}

export function dashboardCardVariants({
  padding = "md",
  className,
}: {
  padding?: keyof typeof cardPaddingMap;
  className?: string;
} = {}) {
  return cn(
    "rounded-[var(--radius-lg)] border border-border/60 bg-surface shadow-sm",
    "transition-shadow hover:shadow-md",
    cardPaddingMap[padding],
    className,
  );
}
