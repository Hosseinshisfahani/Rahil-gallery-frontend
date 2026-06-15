"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/_components/core/config/variants";
import type { LowStockItem } from "../data/mock-dashboard";
import { useAdminT } from "../layout/admin-locale-provider";
import {
  DashboardCard,
  DashboardCardDescription,
  DashboardCardHeader,
  DashboardCardTitle,
} from "./dashboard-card";

export interface LowStockListProps {
  items: LowStockItem[];
  viewAllHref?: string;
  className?: string;
}

export function LowStockList({
  items,
  viewAllHref = "/admin/inventory",
  className,
}: LowStockListProps) {
  const { t } = useAdminT();

  return (
    <DashboardCard className={className}>
      <DashboardCardHeader>
        <div>
          <DashboardCardTitle>{t("dashboardHome.lowStock.title")}</DashboardCardTitle>
          <DashboardCardDescription>
            {t("dashboardHome.lowStock.subtitle")}
          </DashboardCardDescription>
        </div>
        <Link href={viewAllHref} className={buttonVariants({ variant: "ghost", size: "sm" })}>
          {t("common.inventory")}
        </Link>
      </DashboardCardHeader>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item.sku}>
            <Link
              href={item.href}
              className="flex items-center justify-between gap-4 rounded-[var(--radius-md)] border border-border/60 px-4 py-3 transition-colors hover:border-border hover:bg-surface-elevated/80"
            >
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-ink">
                  {item.product}
                </span>
                <span className="mt-0.5 block font-mono text-xs text-ink-muted">
                  {item.sku}
                </span>
              </span>
              <span
                className={cn(
                  "shrink-0 rounded-[var(--radius-sm)] px-2 py-1 text-xs font-semibold tabular-nums",
                  item.quantity === 0
                    ? "bg-error-muted text-error"
                    : item.quantity <= item.threshold
                      ? "bg-warning-muted text-warning"
                      : "bg-surface-elevated text-ink-muted",
                )}
              >
                {t("common.left", { count: item.quantity })}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </DashboardCard>
  );
}
