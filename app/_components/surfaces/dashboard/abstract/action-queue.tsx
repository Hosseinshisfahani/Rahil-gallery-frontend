"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ActionQueueItem } from "../data/mock-dashboard";
import { useAdminT } from "../layout/admin-locale-provider";
import {
  DashboardCard,
  DashboardCardDescription,
  DashboardCardHeader,
  DashboardCardTitle,
} from "./dashboard-card";

const priorityStyles = {
  high: "bg-error-muted text-error",
  medium: "bg-warning-muted text-warning",
  low: "bg-surface-elevated text-ink-muted",
} as const;

export interface ActionQueueProps {
  items: ActionQueueItem[];
  className?: string;
}

export function ActionQueue({ items, className }: ActionQueueProps) {
  const { t } = useAdminT();

  return (
    <DashboardCard className={className}>
      <DashboardCardHeader>
        <div>
          <DashboardCardTitle>{t("dashboardHome.actionQueue.title")}</DashboardCardTitle>
          <DashboardCardDescription>
            {t("dashboardHome.actionQueue.subtitle")}
          </DashboardCardDescription>
        </div>
      </DashboardCardHeader>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              href={item.href}
              className="group flex items-center gap-4 rounded-[var(--radius-md)] border border-border/60 px-4 py-3 transition-colors hover:border-border hover:bg-surface-elevated/80"
            >
              <span
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] text-sm font-semibold tabular-nums",
                  priorityStyles[item.priority],
                )}
              >
                {item.count}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-ink group-hover:text-primary">
                  {item.title}
                </span>
                <span className="mt-0.5 block text-xs text-ink-muted">
                  {item.description}
                </span>
              </span>
              <span
                className="shrink-0 text-ink-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-ink rtl:group-hover:-translate-x-0.5"
                aria-hidden="true"
              >
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </DashboardCard>
  );
}
