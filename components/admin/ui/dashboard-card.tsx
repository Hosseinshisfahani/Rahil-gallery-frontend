import Link from "next/link";
import { cn } from "@/lib/utils";
import type { PaddingSize } from "@/lib/types";

const cardPaddingMap = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
} as const;

function dashboardCardClassName({
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

export interface DashboardCardProps {
  className?: string;
  children: React.ReactNode;
  padding?: PaddingSize;
}

export function DashboardCard({
  className,
  children,
  padding = "md",
}: DashboardCardProps) {
  return (
    <div className={dashboardCardClassName({ padding, className })}>
      {children}
    </div>
  );
}

export function DashboardCardHeader({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "mb-4 flex items-start justify-between gap-4 border-b border-border/60 pb-4",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function DashboardCardTitle({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <h3 className={cn("font-display text-lg font-semibold text-ink md:text-xl", className)}>
      {children}
    </h3>
  );
}

export function DashboardCardDescription({
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

export interface StatCardProps {
  id?: string;
  label: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  href?: string;
  /** Optional definition shown on hover/focus. */
  hint?: string;
  className?: string;
}

const trendColors = {
  up: "text-success",
  down: "text-error",
  neutral: "text-ink-subtle",
};

export function StatCard({
  label,
  value,
  change,
  trend = "neutral",
  href,
  hint,
  className,
}: StatCardProps) {
  const content = (
    <>
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-0.5",
          trend === "up" && "bg-success",
          trend === "down" && "bg-error",
          trend === "neutral" && "bg-accent/40",
        )}
        aria-hidden="true"
      />
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-ink-muted">{label}</p>
        {hint && (
          <span
            className="inline-flex size-4 shrink-0 items-center justify-center rounded-full border border-border text-[10px] font-semibold text-ink-muted"
            title={hint}
            aria-label={hint}
          >
            i
          </span>
        )}
      </div>
      <p className="text-3xl font-semibold tracking-tight text-ink">{value}</p>
      {change && (
        <p className={cn("text-xs font-medium", trendColors[trend])}>{change}</p>
      )}
    </>
  );

  const cardClassName = cn(
    "relative flex flex-col gap-3 overflow-hidden transition-shadow hover:shadow-md",
    href && "hover:border-primary/20",
    className,
  );

  if (href) {
    return (
      <Link href={href} className="block">
        <DashboardCard className={cardClassName}>{content}</DashboardCard>
      </Link>
    );
  }

  return <DashboardCard className={cardClassName}>{content}</DashboardCard>;
}

export function DashboardSectionTitle({
  title,
  subtitle,
  className,
}: {
  title: string;
  subtitle?: string;
  level?: 1 | 2 | 3 | 4;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <h2 className="font-display text-2xl text-ink md:text-3xl">{title}</h2>
      {subtitle && <p className="text-sm text-ink-muted">{subtitle}</p>}
    </div>
  );
}
