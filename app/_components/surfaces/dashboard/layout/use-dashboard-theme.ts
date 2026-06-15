"use client";

import { useCallback, useEffect, useState } from "react";
import {
  applyDashboardTheme,
  persistDashboardTheme,
  resolveDashboardTheme,
  type DashboardTheme,
} from "@/lib/dashboard-theme";

export function useDashboardTheme() {
  const [theme, setThemeState] = useState<DashboardTheme>("light");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const resolved = resolveDashboardTheme();
    setThemeState(resolved);
    applyDashboardTheme(resolved);
    setReady(true);
  }, []);

  const setTheme = useCallback((next: DashboardTheme) => {
    setThemeState(next);
    applyDashboardTheme(next);
    persistDashboardTheme(next);
  }, []);

  const toggle = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [setTheme, theme]);

  return { theme, setTheme, toggle, ready };
}
