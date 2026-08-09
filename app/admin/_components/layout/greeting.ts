import type { AdminLocale } from "@/lib/admin-locale";
import { getAdminMessage } from "@/lib/i18n/admin";
import { formatDateForAdmin } from "@/lib/jalali";

export function getDashboardGreeting(
  date = new Date(),
  locale: AdminLocale = "fa",
): string {
  const hour = date.getHours();
  let key: string;
  if (hour < 12) key = "greeting.morning";
  else if (hour < 17) key = "greeting.afternoon";
  else key = "greeting.evening";
  return getAdminMessage(locale, key);
}

export function formatDashboardDate(
  date = new Date(),
  locale: AdminLocale = "fa",
): string {
  return formatDateForAdmin(date, locale, { dateStyle: "long" });
}
