"use client";

import { StatCard, type StatCardProps } from "../abstract/dashboard-card";
import { useAdminT } from "../layout/admin-locale-provider";

export interface KpiGridProps {
  kpis: StatCardProps[];
  columns?: 2 | 3 | 4 | 5;
  className?: string;
  /** e.g. "analytics.executive.kpis" — when set, uses kpi.id for t(`${prefix}.${id}.label`) */
  labelPrefix?: string;
  /** e.g. "analytics.definitions.executive" — KPI formula tooltip via kpi.id */
  definitionPrefix?: string;
}

const columnClasses = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
  5: "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
};

export function KpiGrid({
  kpis,
  columns = 4,
  className,
  labelPrefix,
  definitionPrefix,
}: KpiGridProps) {
  const { t } = useAdminT();

  return (
    <div className={`grid gap-4 ${columnClasses[columns]} ${className ?? ""}`}>
      {kpis.map((kpi) => {
        const label =
          labelPrefix && kpi.id
            ? t(`${labelPrefix}.${kpi.id}.label`)
            : kpi.label;
        const change =
          kpi.change ??
          (labelPrefix && kpi.id
            ? t(`${labelPrefix}.${kpi.id}.change`)
            : undefined);
        const hint =
          definitionPrefix && kpi.id
            ? t(`${definitionPrefix}.${kpi.id}`)
            : kpi.hint;

        return (
          <StatCard
            key={kpi.id ?? kpi.label}
            label={label}
            value={kpi.value}
            change={change}
            trend={kpi.trend}
            href={kpi.href}
            hint={hint}
          />
        );
      })}
    </div>
  );
}
