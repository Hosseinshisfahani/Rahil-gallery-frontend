import type { SegmentsResponse } from "@/lib/api/customers/saved-views";
import type { AdminLocale } from "@/lib/admin-locale";
import { toPersianDigits } from "@/lib/format";
import type { TFunction } from "@/lib/i18n/admin/types";

export interface CustomerListKpi {
  id: "total" | "vip";
  label: string;
  value: string;
}

export function formatCustomerCount(count: number, locale: AdminLocale): string {
  const formatted = new Intl.NumberFormat("en-US").format(count);
  return locale === "fa" ? toPersianDigits(formatted) : formatted;
}

export function buildCustomerListKpis(
  segments: SegmentsResponse | null,
  t: TFunction,
  locale: AdminLocale,
  loading: boolean,
): CustomerListKpi[] {
  const placeholder = "—";
  const hasData = segments !== null;
  const vipCount =
    segments?.builtin.find((entry) => entry.segment === "vip")?.count ?? 0;
  const totalCount =
    segments?.builtin.reduce((sum, entry) => sum + entry.count, 0) ?? 0;

  const formatValue = (count: number) =>
    loading || !hasData ? placeholder : formatCustomerCount(count, locale);

  return [
    {
      id: "total",
      label: t("dashboardHome.listKpis.total.label"),
      value: formatValue(totalCount),
    },
    {
      id: "vip",
      label: t("dashboardHome.listKpis.vip.label"),
      value: formatValue(vipCount),
    },
  ];
}
