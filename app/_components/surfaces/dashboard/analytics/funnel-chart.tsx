"use client";

import type { FunnelStep } from "../data/mock-analytics";
import { useAdminT } from "../layout/admin-locale-provider";
import {
  DashboardCard,
  DashboardCardDescription,
  DashboardCardHeader,
  DashboardCardTitle,
} from "../abstract/dashboard-card";
import { formatCompactNumber, formatPercent } from "../lib/format-metrics";

export interface FunnelChartProps {
  title: string;
  description?: string;
  steps: FunnelStep[];
  className?: string;
}

export function FunnelChart({ title, description, steps, className }: FunnelChartProps) {
  const { t } = useAdminT();
  const maxCount = steps[0]?.count ?? 1;

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
        {steps.map((step, index) => {
          const widthPercent = Math.max(8, (step.count / maxCount) * 100);

          return (
            <li key={step.label}>
              <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-sm font-medium text-ink">
                  {index + 1}. {step.label}
                </span>
                <span className="text-sm font-semibold tabular-nums text-ink">
                  {formatCompactNumber(step.count)}
                </span>
              </div>
              <div className="relative h-10 overflow-hidden rounded-[var(--radius-md)] bg-surface-elevated">
                <div
                  className="flex h-full items-center rounded-[var(--radius-md)] bg-primary/90 px-3 transition-all"
                  style={{ width: `${widthPercent}%` }}
                >
                  {step.rateFromSession !== undefined && (
                    <span className="text-xs font-medium text-primary-foreground">
                      {t("common.ofSessions", {
                        pct: formatPercent(step.rateFromSession),
                      })}
                    </span>
                  )}
                </div>
              </div>
              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-ink-muted">
                {step.rateFromPrevious !== undefined && index > 0 && (
                  <span>
                    {t("common.fromPreviousStep", {
                      pct: formatPercent(step.rateFromPrevious),
                    })}
                  </span>
                )}
                {step.dropOff !== undefined && index > 0 && (
                  <span className="text-error">
                    {t("common.dropOff", {
                      pct: formatPercent(step.dropOff),
                    })}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </DashboardCard>
  );
}
