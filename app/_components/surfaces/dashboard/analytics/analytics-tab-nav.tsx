"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAdminT } from "../layout/admin-locale-provider";

export const analyticsTabs = [
  { href: "/admin/analytics", labelKey: "analytics.tabs.executive", exact: true },
  { href: "/admin/analytics/marketing", labelKey: "analytics.tabs.marketing" },
  { href: "/admin/analytics/product", labelKey: "analytics.tabs.product" },
  { href: "/admin/analytics/customer", labelKey: "analytics.tabs.customer" },
  { href: "/admin/analytics/funnel", labelKey: "analytics.tabs.funnel" },
] as const;

export function AnalyticsTabNav() {
  const pathname = usePathname();
  const { t } = useAdminT();

  return (
    <nav
      className="flex flex-wrap gap-1 rounded-[var(--radius-lg)] border border-border bg-surface p-1"
      aria-label={t("analytics.tabs.navLabel")}
    >
      {analyticsTabs.map((tab) => {
        const active =
          "exact" in tab && tab.exact
            ? pathname === tab.href
            : pathname.startsWith(tab.href);

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "rounded-[var(--radius-md)] px-4 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-ink-muted hover:bg-surface-elevated hover:text-ink",
            )}
            aria-current={active ? "page" : undefined}
          >
            {t(tab.labelKey)}
          </Link>
        );
      })}
    </nav>
  );
}
