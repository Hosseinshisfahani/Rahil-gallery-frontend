import type { TFunction } from "./types";
import {
  actionQueue,
  dashboardKpis,
  quickActions,
  type ActionQueueItem,
  type DashboardKpi,
  type QuickAction,
} from "@/_components/surfaces/dashboard/data/mock-dashboard";
import { customerListKpis } from "@/_components/surfaces/dashboard/data/mock-customers";

export function localizeDashboardKpis(t: TFunction): DashboardKpi[] {
  return dashboardKpis.map((kpi) => ({
    ...kpi,
    label: t(`dashboardHome.kpis.${kpi.id}.label`),
    change: kpi.change ? t(`dashboardHome.kpis.${kpi.id}.change`) : undefined,
  }));
}

export function localizeActionQueue(t: TFunction): ActionQueueItem[] {
  const idMap: Record<string, string> = {
    "confirm-orders": "confirmOrders",
    returns: "returns",
    reviews: "reviews",
    inventory: "inventory",
  };

  return actionQueue.map((item) => {
    const key = idMap[item.id] ?? item.id;
    return {
      ...item,
      title: t(`dashboardHome.actionQueue.${key}.title`),
      description: t(`dashboardHome.actionQueue.${key}.description`),
    };
  });
}

export function localizeQuickActions(t: TFunction): QuickAction[] {
  const labels: Record<string, string> = {
    "/admin/products/new": t("dashboardHome.quickActions.addProduct"),
    "/admin/returns": t("dashboardHome.quickActions.reviewReturns"),
    "/admin/reviews": t("dashboardHome.quickActions.moderateReviews"),
    "/admin/analytics": t("dashboardHome.quickActions.viewAnalytics"),
  };

  return quickActions.map((action) => ({
    ...action,
    label: labels[action.href] ?? action.label,
  }));
}

export function localizeCustomerListKpis(t: TFunction) {
  const ids = ["total", "vip"] as const;
  return customerListKpis.map((kpi, index) => ({
    ...kpi,
    label: t(`dashboardHome.listKpis.${ids[index]}.label`),
    change: kpi.change ? t(`dashboardHome.listKpis.${ids[index]}.change`) : undefined,
  }));
}
