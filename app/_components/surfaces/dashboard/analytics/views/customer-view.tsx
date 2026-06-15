"use client";

import { CohortTable } from "../data-tables";
import { KpiGrid } from "../kpi-grid";
import { MetricBarList } from "../metric-lists";
import { DashboardSectionTitle } from "../../abstract/dashboard-card";
import { useAnalyticsData } from "../use-analytics-data";
import { useAdminT } from "../../layout/admin-locale-provider";

export function CustomerAnalyticsView() {
  const { t } = useAdminT();
  const data = useAnalyticsData();

  return (
    <div className="flex flex-col gap-8">
      <DashboardSectionTitle
        title={t("analytics.customer.title")}
        subtitle={t("analytics.customer.subtitle")}
      />

      <section aria-label={t("analytics.customer.title")}>
        <KpiGrid
          kpis={data.customerKpis}
          columns={5}
          labelPrefix="analytics.customer.kpis"
          definitionPrefix="analytics.definitions.customer"
        />
      </section>

      <section
        aria-label={t("analytics.customer.categoryTitle")}
        className="grid gap-6 lg:grid-cols-2"
      >
        <MetricBarList
          title={t("analytics.customer.categoryTitle")}
          description={t("analytics.customer.categoryDesc")}
          items={data.firstPurchaseCategories}
        />
        <CohortTable
          title={t("analytics.customer.cohortTitle")}
          description={t("analytics.customer.cohortDesc")}
          rows={data.customerCohorts}
        />
      </section>
    </div>
  );
}
