"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  applyDashboardTheme,
  DASHBOARD_THEME_STORAGE_KEY,
  persistDashboardTheme,
  resolveDashboardTheme,
  type DashboardTheme,
} from "@/lib/dashboard-theme";

const listeners = new Set<() => void>();

function subscribeToTheme(listener: () => void): () => void {
  listeners.add(listener);

  const onStorage = (event: StorageEvent) => {
    if (event.key === DASHBOARD_THEME_STORAGE_KEY) listener();
  };

  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", listener);
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    media.removeEventListener("change", listener);
    window.removeEventListener("storage", onStorage);
  };
}

function emitThemeChange(): void {
  listeners.forEach((listener) => listener());
}

function getThemeSnapshot(): DashboardTheme {
  return resolveDashboardTheme();
}

function getServerThemeSnapshot(): DashboardTheme {
  return "light";
}

export function useDashboardThemeStore() {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );

  const setTheme = useCallback((next: DashboardTheme) => {
    persistDashboardTheme(next);
    applyDashboardTheme(next);
    emitThemeChange();
  }, []);

  const toggle = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [setTheme, theme]);

  return { theme, setTheme, toggle };
}
