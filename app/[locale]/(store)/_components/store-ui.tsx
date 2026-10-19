import { cn } from "@/lib/utils";

// --- Variants ---

export type StoreBadgeVariant =
  | "default"
  | "accent"
  | "success"
  | "warning"
  | "error"
  | "info";

const badgeVariantMap: Record<StoreBadgeVariant, string> = {
  default: "bg-surface-elevated text-ink border-border",
  accent: "bg-accent-muted text-accent border-accent/20",
  success: "bg-success-muted text-success border-success/20",
  warning: "bg-warning-muted text-warning border-warning/20",
  error: "bg-error-muted text-error border-error/20",
  info: "bg-info-muted text-info border-info/20",
};

export function storeBadgeVariants({
  variant = "default",
  className,
}: { variant?: StoreBadgeVariant; className?: string } = {}) {
  return cn(
    "ds-badge inline-flex items-center rounded-[var(--radius-sm)] border px-2 py-0.5 text-xs font-medium normal-case tracking-[0.02em]",
    badgeVariantMap[variant],
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

// --- Badge ---

export type BadgeVariant = StoreBadgeVariant;

export interface BadgeProps {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
}

export function Badge({
  variant = "default",
  className,
  children,
}: BadgeProps) {
  return (
    <span className={storeBadgeVariants({ variant, className })}>{children}</span>
  );
}

export function badgeClassName(
  options: Parameters<typeof storeBadgeVariants>[0],
) {
  return storeBadgeVariants(options);
}

// --- Heading ---

export interface HeadingProps {
  as?: `h${HeadingLevel}`;
  level?: HeadingLevel;
  className?: string;
  children: React.ReactNode;
}

export function Heading({
  as,
  level = 1,
  className,
  children,
}: HeadingProps) {
  const Tag = (as ?? `h${level}`) as "h1" | "h2" | "h3" | "h4";

  return (
    <Tag className={headingVariants({ level, className })}>{children}</Tag>
  );
}

export function headingClassName(level: HeadingLevel, className?: string) {
  return headingVariants({ level, className });
}

// --- Eyebrow ---

export interface EyebrowProps {
  className?: string;
  children: React.ReactNode;
}

export function Eyebrow({ className, children }: EyebrowProps) {
  return (
    <span
      className={cn(
        "ds-eyebrow text-xs font-normal uppercase tracking-[0.2em] text-ink-subtle",
        className,
      )}
    >
      {children}
    </span>
  );
}

// --- Text ---

export interface TextProps {
  className?: string;
  muted?: boolean;
  children: React.ReactNode;
  as?: "p" | "span" | "div";
  size?: "sm" | "base" | "lg";
}

const sizeMap = {
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
};

export function Text({
  className,
  muted,
  children,
  as: Tag = "p",
  size = "base",
}: TextProps) {
  return (
    <Tag
      className={cn(
        "leading-relaxed",
        sizeMap[size],
        muted ? "text-ink-muted" : "text-ink",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
