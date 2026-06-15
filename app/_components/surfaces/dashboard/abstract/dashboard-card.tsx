import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  dashboardCardVariants,
  type HeadingLevel,
  headingVariants,
} from "@/_components/core/config/variants";
import type { PaddingSize } from "@/_components/core/types";

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
    <div className={dashboardCardVariants({ padding, className })}>
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
    <h3 className={cn(headingVariants({ level: 4, className }), "font-semibold")}>
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
  /** KPI definition shown on hover/focus (analytics tooltips). */
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
  level = 2 as HeadingLevel,
  className,
}: {
  title: string;
  subtitle?: string;
  level?: HeadingLevel;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <h2 className={headingVariants({ level })}>{title}</h2>
      {subtitle && <p className="text-sm text-ink-muted">{subtitle}</p>}
    </div>
  );
}
