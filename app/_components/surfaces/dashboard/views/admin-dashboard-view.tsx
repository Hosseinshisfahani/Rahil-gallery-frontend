"use client";

import {
  ActionQueue,
  DashboardOrdersTable,
  DashboardQuickActions,
  DashboardSectionTitle,
  LowStockList,
  ProductionQueue,
  StatCard,
} from "@/_components/surfaces/dashboard/abstract";
import {
  lowStockItems,
  productionDue,
  recentOrders,
} from "@/_components/surfaces/dashboard/data/mock-dashboard";
import { getDashboardGreeting } from "@/_components/surfaces/dashboard/lib/greeting";
import { TranslatedAdminShell } from "@/_components/surfaces/dashboard/layout/translated-admin-shell";
import { useAdminT } from "@/_components/surfaces/dashboard/layout/admin-locale-provider";
import {
  localizeActionQueue,
  localizeDashboardKpis,
  localizeQuickActions,
} from "@/lib/i18n/admin/localized-mock";

export function AdminDashboardView() {
  const { t, locale } = useAdminT();
  const greeting = getDashboardGreeting(new Date(), locale);
  const kpis = localizeDashboardKpis(t);
  const queue = localizeActionQueue(t);
  const actions = localizeQuickActions(t);

  return (
    <TranslatedAdminShell
      titleKey="dashboard.title"
      subtitleKey="dashboard.subtitle"
      includeDate
    >
      <div className="flex flex-col gap-8">
        <DashboardSectionTitle
          title={greeting}
          subtitle={t("dashboard.sectionSubtitle")}
        />

        <section aria-label={t("dashboard.title")}>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
            {kpis.map((kpi) => (
              <StatCard
                key={kpi.id}
                label={kpi.label}
                value={kpi.value}
                change={kpi.change}
                trend={kpi.trend}
                href={kpi.href}
              />
            ))}
          </div>
        </section>

        <section aria-label={t("dashboardHome.actionQueue.title")}>
          <ActionQueue items={queue} />
        </section>

        <section
          aria-label={t("dashboardHome.orders.title")}
          className="grid gap-6 lg:grid-cols-3"
        >
          <DashboardOrdersTable orders={recentOrders} className="lg:col-span-2" />
          <DashboardQuickActions actions={actions} />
        </section>

        <section
          aria-label={t("dashboardHome.lowStock.title")}
          className="grid gap-6 lg:grid-cols-2"
        >
          <LowStockList items={lowStockItems} />
          <ProductionQueue items={productionDue} />
        </section>
      </div>
    </TranslatedAdminShell>
  );
}
