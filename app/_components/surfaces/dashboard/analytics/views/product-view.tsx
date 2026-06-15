"use client";

import { KpiGrid } from "../kpi-grid";
import { MetricBarList, RankedList } from "../metric-lists";
import { DashboardSectionTitle } from "../../abstract/dashboard-card";
import { useAnalyticsData } from "../use-analytics-data";
import { useAdminT } from "../../layout/admin-locale-provider";

export function ProductAnalyticsView() {
  const { t } = useAdminT();
  const data = useAnalyticsData();

  return (
    <div className="flex flex-col gap-8">
      <DashboardSectionTitle
        title={t("analytics.product.title")}
        subtitle={t("analytics.product.subtitle")}
      />

      <section aria-label={t("analytics.product.title")}>
        <KpiGrid
          kpis={data.productKpis}
          columns={4}
          labelPrefix="analytics.product.kpis"
          definitionPrefix="analytics.definitions.product"
        />
      </section>

      <section
        aria-label={t("analytics.product.skuRevenueTitle")}
        className="grid gap-6 lg:grid-cols-2"
      >
        <RankedList
          title={t("analytics.product.skuRevenueTitle")}
          description={t("analytics.product.skuRevenueDesc")}
          items={data.skuRevenueContribution.map((sku) => ({
            rank: sku.rank,
            primary: sku.name,
            secondary: sku.sku,
            value: sku.value,
            detail: sku.metric,
            barPercent: sku.barPercent,
          }))}
        />
        <RankedList
          title={t("analytics.product.skuMarginTitle")}
          description={t("analytics.product.skuMarginDesc")}
          items={data.skuMarginContribution.map((sku) => ({
            rank: sku.rank,
            primary: sku.name,
            secondary: sku.sku,
            value: sku.value,
            detail: sku.metric,
            barPercent: sku.barPercent,
          }))}
        />
      </section>

      <section aria-label={t("analytics.product.inventoryTitle")}>
        <MetricBarList
          title={t("analytics.product.inventoryTitle")}
          description={t("analytics.product.inventoryDesc")}
          items={data.inventoryStatus}
        />
      </section>
    </div>
  );
}
