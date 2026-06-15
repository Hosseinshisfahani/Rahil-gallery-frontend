"use client";

import { KpiGrid } from "../kpi-grid";
import { RankedList } from "../metric-lists";
import { DashboardSectionTitle } from "../../abstract/dashboard-card";
import { useAnalyticsData } from "../use-analytics-data";
import { useAdminT } from "../../layout/admin-locale-provider";

export function ExecutiveAnalyticsView() {
  const { t } = useAdminT();
  const data = useAnalyticsData();

  return (
    <div className="flex flex-col gap-8">
      <DashboardSectionTitle
        title={t("analytics.executive.title")}
        subtitle={t("analytics.executive.subtitle")}
      />

      <section aria-label={t("analytics.executive.kpisAria")}>
        <KpiGrid
          kpis={data.executiveKpis}
          columns={5}
          labelPrefix="analytics.executive.kpis"
          definitionPrefix="analytics.definitions.executive"
        />
      </section>

      <section aria-label={t("analytics.executive.topProductsAria")}>
        <RankedList
          title={t("analytics.executive.topProductsTitle")}
          description={t("analytics.executive.topProductsDesc")}
          items={data.topProductsByRevenue.map((sku) => ({
            rank: sku.rank,
            primary: sku.name,
            secondary: sku.sku,
            value: sku.value,
            detail: sku.metric,
            barPercent: sku.barPercent,
          }))}
        />
      </section>
    </div>
  );
}
