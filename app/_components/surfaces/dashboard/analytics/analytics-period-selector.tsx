"use client";

import { cn } from "@/lib/utils";
import { ANALYTICS_PERIODS } from "@/lib/analytics/period";
import { useAdminT } from "../layout/admin-locale-provider";
import { useAnalyticsPeriod } from "./analytics-period-provider";

export function AnalyticsPeriodSelector({ className }: { className?: string }) {
  const { t } = useAdminT();
  const { period, setPeriod } = useAnalyticsPeriod();

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-md)] border border-border bg-surface-elevated/40 px-4 py-3",
        className,
      )}
      role="group"
      aria-label={t("analytics.period.aria")}
    >
      <div>
        <p className="text-sm font-semibold text-ink">{t("analytics.period.title")}</p>
        <p className="text-xs text-ink-muted">{t("analytics.period.subtitle")}</p>
      </div>
      <div className="flex gap-1 rounded-sm border border-border bg-surface p-1">
        {ANALYTICS_PERIODS.map((value) => {
          const active = period === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => setPeriod(value)}
              aria-pressed={active}
              className={cn(
                "rounded-sm px-3 py-1.5 text-xs font-medium transition-colors",
                active
                  ? "bg-accent text-accent-foreground shadow-sm"
                  : "text-ink-muted hover:bg-surface-elevated hover:text-ink",
              )}
            >
              {t(`analytics.period.options.${value}`)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
