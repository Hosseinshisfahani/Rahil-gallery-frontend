"use client";

import Link from "next/link";
import { StatusBadge } from "@/_components/shared/inclusive/status-badge";
import type { ProductionItem } from "../data/mock-dashboard";
import { useAdminT } from "../layout/admin-locale-provider";
import {
  DashboardCard,
  DashboardCardDescription,
  DashboardCardHeader,
  DashboardCardTitle,
} from "./dashboard-card";

export interface ProductionQueueProps {
  items: ProductionItem[];
  className?: string;
}

export function ProductionQueue({ items, className }: ProductionQueueProps) {
  const { t, locale } = useAdminT();

  return (
    <DashboardCard className={className}>
      <DashboardCardHeader>
        <div>
          <DashboardCardTitle>{t("dashboardHome.production.title")}</DashboardCardTitle>
          <DashboardCardDescription>
            {t("dashboardHome.production.subtitle")}
          </DashboardCardDescription>
        </div>
      </DashboardCardHeader>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              href={item.href}
              className="flex flex-col gap-2 rounded-[var(--radius-md)] border border-border/60 px-4 py-3 transition-colors hover:border-border hover:bg-surface-elevated/80 sm:flex-row sm:items-center sm:justify-between"
            >
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-ink">
                  {item.product}
                </span>
                <span className="mt-0.5 block font-mono text-xs text-ink-muted">
                  {item.orderId}
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-3">
                <span className="text-xs font-medium text-ink-muted">
                  {t("common.due", { date: item.dueDate })}
                </span>
                <StatusBadge status={item.status} locale={locale} />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </DashboardCard>
  );
}
