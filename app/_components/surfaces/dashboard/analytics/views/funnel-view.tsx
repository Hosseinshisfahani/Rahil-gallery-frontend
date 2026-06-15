"use client";

import { FunnelChart } from "../funnel-chart";
import { KpiGrid } from "../kpi-grid";
import { MetricBarList } from "../metric-lists";
import { DashboardSectionTitle } from "../../abstract/dashboard-card";
import { useAnalyticsData } from "../use-analytics-data";
import { useAdminT } from "../../layout/admin-locale-provider";

export function FunnelAnalyticsView() {
  const { t } = useAdminT();
  const data = useAnalyticsData();

  return (
    <div className="flex flex-col gap-8">
      <DashboardSectionTitle
        title={t("analytics.funnel.title")}
        subtitle={t("analytics.funnel.subtitle")}
      />

      <section aria-label={t("analytics.funnel.title")}>
        <KpiGrid
          kpis={data.funnelKpis}
          columns={5}
          labelPrefix="analytics.funnel.kpis"
          definitionPrefix="analytics.definitions.funnel"
        />
      </section>

      <section
        aria-label={t("analytics.funnel.ecommerceTitle")}
        className="grid gap-6 lg:grid-cols-2"
      >
        <FunnelChart
          title={t("analytics.funnel.ecommerceTitle")}
          description={t("analytics.funnel.ecommerceDesc")}
          steps={data.ecommerceFunnel}
        />
        <MetricBarList
          title={t("analytics.funnel.deviceTitle")}
          description={t("analytics.funnel.deviceDesc")}
          items={data.deviceBreakdown}
        />
      </section>

      <section
        aria-label={t("analytics.funnel.checkoutTitle")}
        className="grid gap-6 lg:grid-cols-2"
      >
        <MetricBarList
          title={t("analytics.funnel.checkoutTitle")}
          description={t("analytics.funnel.checkoutDesc")}
          items={data.checkoutDropOffSteps}
        />
        <MetricBarList
          title={t("analytics.funnel.paymentTitle")}
          description={t("analytics.funnel.paymentDesc")}
          items={data.paymentFailureBreakdown}
        />
      </section>
    </div>
  );
}
