"use client";

import Link from "next/link";
import { buttonVariants } from "@/_components/core/config/variants";
import { StatusBadge } from "@/_components/shared/inclusive/status-badge";
import type { DashboardOrder } from "../data/mock-dashboard";
import { useAdminT } from "../layout/admin-locale-provider";
import {
  DashboardCard,
  DashboardCardDescription,
  DashboardCardHeader,
  DashboardCardTitle,
} from "./dashboard-card";
import {
  ResponsiveTable,
  TableCell,
  tableBodyRowClass,
  tableHeadRowClass,
  tableThClass,
} from "./responsive-table";

export interface DashboardOrdersTableProps {
  orders: DashboardOrder[];
  viewAllHref?: string;
  className?: string;
}

export function DashboardOrdersTable({
  orders,
  viewAllHref = "/admin/orders",
  className,
}: DashboardOrdersTableProps) {
  const { t, locale } = useAdminT();

  return (
    <DashboardCard className={className}>
      <DashboardCardHeader>
        <div>
          <DashboardCardTitle>{t("dashboardHome.orders.title")}</DashboardCardTitle>
          <DashboardCardDescription>
            {t("dashboardHome.orders.subtitle")}
          </DashboardCardDescription>
        </div>
        <Link href={viewAllHref} className={buttonVariants({ variant: "ghost", size: "sm" })}>
          {t("common.viewAll")}
        </Link>
      </DashboardCardHeader>
      <ResponsiveTable>
        <thead>
          <tr className={tableHeadRowClass}>
            <th className={tableThClass}>{t("common.order")}</th>
            <th className={tableThClass}>{t("common.customer")}</th>
            <th className={tableThClass}>{t("common.date")}</th>
            <th className={tableThClass}>{t("common.total")}</th>
            <th className={tableThClass}>{t("common.status")}</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className={tableBodyRowClass}>
              <TableCell label={t("common.order")}>
                <Link
                  href={order.href}
                  className="font-mono text-xs text-ink hover:text-primary"
                >
                  {order.id}
                </Link>
              </TableCell>
              <TableCell label={t("common.customer")}>{order.customer}</TableCell>
              <TableCell label={t("common.date")} className="text-ink-muted">
                {order.date}
              </TableCell>
              <TableCell label={t("common.total")} className="text-ltr">
                <span dir="ltr">{order.total}</span>
              </TableCell>
              <TableCell label={t("common.status")} className="py-3">
                <StatusBadge status={order.status} locale={locale} />
              </TableCell>
            </tr>
          ))}
        </tbody>
      </ResponsiveTable>
    </DashboardCard>
  );
}
