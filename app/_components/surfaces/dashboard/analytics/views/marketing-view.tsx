"use client";

import { CampaignTable } from "../data-tables";
import { KpiGrid } from "../kpi-grid";
import { MetricBarList, MetricGrid } from "../metric-lists";
import { DashboardSectionTitle } from "../../abstract/dashboard-card";
import { useAnalyticsData } from "../use-analytics-data";
import { useAdminT } from "../../layout/admin-locale-provider";

export function MarketingAnalyticsView() {
  const { t } = useAdminT();
  const data = useAnalyticsData();

  return (
    <div className="flex flex-col gap-8">
      <DashboardSectionTitle
        title={t("analytics.marketing.title")}
        subtitle={t("analytics.marketing.subtitle")}
      />

      <section aria-label={t("analytics.marketing.title")}>
        <KpiGrid
          kpis={data.marketingKpis}
          columns={4}
          labelPrefix="analytics.marketing.kpis"
          definitionPrefix="analytics.definitions.marketing"
        />
      </section>

      <section
        aria-label={t("analytics.marketing.channelMixTitle")}
        className="grid gap-6 lg:grid-cols-2"
      >
        <MetricBarList
          title={t("analytics.marketing.channelMixTitle")}
          description={t("analytics.marketing.channelMixDesc")}
          items={data.channelRevenueMix}
        />
        <MetricBarList
          title={t("analytics.marketing.cacTitle")}
          description={t("analytics.marketing.cacDesc")}
          items={data.cacByChannel}
        />
      </section>

      <section
        aria-label={t("analytics.marketing.campaignsTitle")}
        className="grid gap-6 lg:grid-cols-3"
      >
        <MetricGrid
          title={t("analytics.marketing.influencerTitle")}
          description={t("analytics.marketing.influencerDesc")}
          items={data.influencerMetrics}
          className="lg:col-span-1"
        />
        <CampaignTable
          title={t("analytics.marketing.campaignsTitle")}
          description={t("analytics.marketing.campaignsDesc")}
          rows={data.campaigns}
          className="lg:col-span-2"
        />
      </section>
    </div>
  );
}
