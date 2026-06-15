"use client";

import type { CampaignRow } from "../data/mock-analytics";
import { useAdminT } from "../layout/admin-locale-provider";
import {
  DashboardCard,
  DashboardCardDescription,
  DashboardCardHeader,
  DashboardCardTitle,
} from "../abstract/dashboard-card";
import {
  ResponsiveTable,
  TableCell,
  tableBodyRowClass,
  tableHeadRowClass,
  tableThClass,
} from "../abstract/responsive-table";

export interface CampaignTableProps {
  title: string;
  description?: string;
  rows: CampaignRow[];
  className?: string;
}

export function CampaignTable({
  title,
  description,
  rows,
  className,
}: CampaignTableProps) {
  const { t } = useAdminT();

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
      <ResponsiveTable>
        <thead>
          <tr className={tableHeadRowClass}>
            <th className={tableThClass}>{t("analytics.tables.campaign")}</th>
            <th className={tableThClass}>{t("analytics.tables.channel")}</th>
            <th className={tableThClass}>{t("analytics.tables.spend")}</th>
            <th className={tableThClass}>{t("analytics.tables.revenue")}</th>
            <th className={tableThClass}>{t("analytics.tables.roas")}</th>
            <th className={tableThClass}>{t("analytics.tables.ctr")}</th>
            <th className={tableThClass}>{t("analytics.tables.conv")}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name} className={tableBodyRowClass}>
              <TableCell label={t("analytics.tables.campaign")} layout="stack" className="max-w-[200px] font-medium text-ink">
                {row.name}
              </TableCell>
              <TableCell label={t("analytics.tables.channel")} className="text-ink-muted">
                {row.channel}
              </TableCell>
              <TableCell label={t("analytics.tables.spend")} className="text-ltr tabular-nums">
                <span dir="ltr">{row.spend}</span>
              </TableCell>
              <TableCell label={t("analytics.tables.revenue")} className="text-ltr tabular-nums">
                <span dir="ltr">{row.revenue}</span>
              </TableCell>
              <TableCell label={t("analytics.tables.roas")} className="font-semibold text-success">
                {row.roas}
              </TableCell>
              <TableCell label={t("analytics.tables.ctr")} className="tabular-nums">
                {row.ctr}
              </TableCell>
              <TableCell label={t("analytics.tables.conv")} className="tabular-nums py-3">
                {row.conversion}
              </TableCell>
            </tr>
          ))}
        </tbody>
      </ResponsiveTable>
    </DashboardCard>
  );
}

export interface CohortTableProps {
  title: string;
  description?: string;
  rows: Array<{
    cohort: string;
    customers: number;
    repeatRate: string;
    avgLtv: string;
  }>;
  className?: string;
}

export function CohortTable({
  title,
  description,
  rows,
  className,
}: CohortTableProps) {
  const { t } = useAdminT();

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
      <ResponsiveTable>
        <thead>
          <tr className={tableHeadRowClass}>
            <th className={tableThClass}>{t("analytics.tables.cohort")}</th>
            <th className={tableThClass}>{t("analytics.tables.customers")}</th>
            <th className={tableThClass}>{t("analytics.tables.repeatRate")}</th>
            <th className={tableThClass}>{t("analytics.tables.avgLtv")}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.cohort} className={tableBodyRowClass}>
              <TableCell label={t("analytics.tables.cohort")} className="font-medium">
                {row.cohort}
              </TableCell>
              <TableCell label={t("analytics.tables.customers")} className="tabular-nums">
                {row.customers}
              </TableCell>
              <TableCell label={t("analytics.tables.repeatRate")} className="tabular-nums">
                {row.repeatRate}
              </TableCell>
              <TableCell label={t("analytics.tables.avgLtv")} className="text-ltr tabular-nums py-3">
                <span dir="ltr">{row.avgLtv}</span>
              </TableCell>
            </tr>
          ))}
        </tbody>
      </ResponsiveTable>
    </DashboardCard>
  );
}
