import { cn } from "@/lib/utils";
import type { MetricRow } from "../data/mock-analytics";
import {
  DashboardCard,
  DashboardCardDescription,
  DashboardCardHeader,
  DashboardCardTitle,
} from "../abstract/dashboard-card";

export interface MetricBarListProps {
  title: string;
  description?: string;
  items: MetricRow[];
  showBars?: boolean;
  className?: string;
}

export function MetricBarList({
  title,
  description,
  items,
  showBars = true,
  className,
}: MetricBarListProps) {
  return (
    <DashboardCard className={className}>
      <DashboardCardHeader>
        <div>
          <DashboardCardTitle>{title}</DashboardCardTitle>
          {description && (
            <DashboardCardDescription>{description}</DashboardCardDescription>
          )}
        </div>
      </DashboardCardHeader>
      <ul className="flex flex-col gap-4">
        {items.map((item) => (
          <li key={item.label}>
            <div className="mb-1.5 flex items-baseline justify-between gap-3">
              <span className="text-sm font-medium text-ink">{item.label}</span>
              <span className="shrink-0 text-sm font-semibold tabular-nums text-ink">
                {item.value}
              </span>
            </div>
            {showBars && item.barPercent !== undefined && item.barPercent > 0 && (
              <div
                className="h-2 overflow-hidden rounded-full bg-surface-elevated"
                role="presentation"
              >
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${item.barPercent}%` }}
                />
              </div>
            )}
            {item.secondary && (
              <p className="mt-1 text-xs text-ink-muted">{item.secondary}</p>
            )}
          </li>
        ))}
      </ul>
    </DashboardCard>
  );
}

export interface MetricGridProps {
  title: string;
  description?: string;
  items: MetricRow[];
  className?: string;
}

export function MetricGrid({ title, description, items, className }: MetricGridProps) {
  return (
    <DashboardCard className={className}>
      <DashboardCardHeader>
        <div>
          <DashboardCardTitle>{title}</DashboardCardTitle>
          {description && (
            <DashboardCardDescription>{description}</DashboardCardDescription>
          )}
        </div>
      </DashboardCardHeader>
      <dl className="grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-[var(--radius-md)] border border-border/60 bg-surface-elevated/50 px-4 py-3"
          >
            <dt className="text-xs font-medium text-ink-muted">{item.label}</dt>
            <dd className="mt-1 text-xl font-semibold tabular-nums text-ink">
              {item.value}
            </dd>
            {item.secondary && (
              <dd className="mt-0.5 text-xs text-ink-muted">{item.secondary}</dd>
            )}
          </div>
        ))}
      </dl>
    </DashboardCard>
  );
}

export interface RankedListProps {
  title: string;
  description?: string;
  items: Array<{
    rank: number;
    primary: string;
    secondary: string;
    value: string;
    detail?: string;
    barPercent?: number;
  }>;
  className?: string;
}

export function RankedList({ title, description, items, className }: RankedListProps) {
  return (
    <DashboardCard className={className}>
      <DashboardCardHeader>
        <div>
          <DashboardCardTitle>{title}</DashboardCardTitle>
          {description && (
            <DashboardCardDescription>{description}</DashboardCardDescription>
          )}
        </div>
      </DashboardCardHeader>
      <ol className="flex flex-col gap-3">
        {items.map((item) => (
          <li
            key={item.rank}
            className="flex gap-4 rounded-[var(--radius-md)] border border-border/60 px-4 py-3"
          >
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent-muted text-xs font-semibold text-accent">
              {item.rank}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">{item.primary}</p>
                  <p className="font-mono text-xs text-ink-muted">{item.secondary}</p>
                </div>
                <span className="shrink-0 text-sm font-semibold tabular-nums text-ink">
                  {item.value}
                </span>
              </div>
              {item.barPercent !== undefined && (
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-elevated">
                  <div
                    className={cn("h-full rounded-full bg-accent/80")}
                    style={{ width: `${item.barPercent}%` }}
                  />
                </div>
              )}
              {item.detail && (
                <p className="mt-1 text-xs text-ink-muted">{item.detail}</p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </DashboardCard>
  );
}
