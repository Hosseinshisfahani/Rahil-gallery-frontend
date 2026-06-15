"use client";

import { useMemo } from "react";
import { getAnalyticsSnapshot } from "../data/analytics-data";
import { useAdminT } from "../layout/admin-locale-provider";
import { useAnalyticsPeriod } from "./analytics-period-provider";

export function useAnalyticsData() {
  const { locale } = useAdminT();
  const { period } = useAnalyticsPeriod();

  return useMemo(
    () => getAnalyticsSnapshot(period, locale),
    [period, locale],
  );
}
