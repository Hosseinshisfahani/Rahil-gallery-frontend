"use client";

import { useEffect } from "react";
import { applyDashboardTheme } from "@/lib/dashboard-theme";
import { useDashboardThemeStore } from "@/hooks/use-dashboard-theme-store";

export function useDashboardTheme() {
  const { theme, setTheme, toggle } = useDashboardThemeStore();

  useEffect(() => {
    applyDashboardTheme(theme);
  }, [theme]);

  return { theme, setTheme, toggle, ready: true };
}
