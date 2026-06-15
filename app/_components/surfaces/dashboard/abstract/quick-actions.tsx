"use client";

import Link from "next/link";
import { buttonVariants } from "@/_components/core/config/variants";
import type { QuickAction } from "../data/mock-dashboard";
import { useAdminT } from "../layout/admin-locale-provider";
import {
  DashboardCard,
  DashboardCardDescription,
  DashboardCardHeader,
  DashboardCardTitle,
} from "./dashboard-card";

export interface DashboardQuickActionsProps {
  actions: QuickAction[];
  className?: string;
}

export function DashboardQuickActions({
  actions,
  className,
}: DashboardQuickActionsProps) {
  const { t } = useAdminT();

  return (
    <DashboardCard className={className}>
      <DashboardCardHeader>
        <div>
          <DashboardCardTitle>{t("dashboardHome.quickActions.title")}</DashboardCardTitle>
          <DashboardCardDescription>
            {t("dashboardHome.quickActions.subtitle")}
          </DashboardCardDescription>
        </div>
      </DashboardCardHeader>
      <div className="flex flex-col gap-2">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className={buttonVariants({
              variant: action.variant,
              size: "md",
              fullWidth: true,
            })}
          >
            {action.label}
          </Link>
        ))}
      </div>
    </DashboardCard>
  );
}
