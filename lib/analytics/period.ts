export type AnalyticsPeriod = "7d" | "30d" | "90d";

export const DEFAULT_ANALYTICS_PERIOD: AnalyticsPeriod = "30d";

export const ANALYTICS_PERIODS: AnalyticsPeriod[] = ["7d", "30d", "90d"];

export function isAnalyticsPeriod(value: string | null | undefined): value is AnalyticsPeriod {
  return value === "7d" || value === "30d" || value === "90d";
}

export function parseAnalyticsPeriod(value: string | null | undefined): AnalyticsPeriod {
  return isAnalyticsPeriod(value) ? value : DEFAULT_ANALYTICS_PERIOD;
}

/** Scale volume metrics (revenue, counts) relative to the 30d baseline. */
export function periodVolumeScale(period: AnalyticsPeriod): number {
  switch (period) {
    case "7d":
      return 7 / 30;
    case "90d":
      return 3;
    default:
      return 1;
  }
}

export function periodDays(period: AnalyticsPeriod): number {
  switch (period) {
    case "7d":
      return 7;
    case "90d":
      return 90;
    default:
      return 30;
  }
}
