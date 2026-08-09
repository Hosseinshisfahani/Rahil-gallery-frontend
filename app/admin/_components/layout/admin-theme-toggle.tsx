"use client";

import { cn } from "@/lib/utils";
import { useDashboardTheme } from "./use-dashboard-theme";
import { useAdminT } from "./admin-locale-provider";

function SunIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export interface AdminThemeToggleProps {
  tone?: "topbar" | "sidebar";
  className?: string;
}

export function AdminThemeToggle({
  tone = "topbar",
  className,
}: AdminThemeToggleProps) {
  const { theme, toggle, ready } = useDashboardTheme();
  const { t } = useAdminT();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={!ready}
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] transition-colors",
        tone === "topbar" &&
          "text-ink-muted hover:bg-surface-elevated hover:text-ink",
        tone === "sidebar" &&
          "text-sidebar-muted hover:bg-sidebar-border/50 hover:text-sidebar-fg",
        className,
      )}
      aria-label={
        isDark ? t("theme.switchToLight") : t("theme.switchToDark")
      }
      title={isDark ? t("theme.lightMode") : t("theme.darkMode")}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
