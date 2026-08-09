export const DASHBOARD_THEME_STORAGE_KEY = "rahil-dashboard-theme";

export type DashboardTheme = "light" | "dark";

export function resolveDashboardTheme(): DashboardTheme {
  if (typeof window === "undefined") return "light";

  try {
    const stored = localStorage.getItem(DASHBOARD_THEME_STORAGE_KEY);
    if (stored === "dark" || stored === "light") return stored;
  } catch {
    // ignore
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function applyDashboardTheme(theme: DashboardTheme): void {
  if (typeof document === "undefined") return;

  if (theme === "dark") {
    document.documentElement.dataset.dashboardTheme = "dark";
  } else {
    delete document.documentElement.dataset.dashboardTheme;
  }
}

export function persistDashboardTheme(theme: DashboardTheme): void {
  try {
    localStorage.setItem(DASHBOARD_THEME_STORAGE_KEY, theme);
  } catch {
    // ignore
  }
}

/** Inline script — run before paint to avoid theme flash on admin routes. */
export const dashboardThemeInitScript = `(function(){try{var k=${JSON.stringify(DASHBOARD_THEME_STORAGE_KEY)};var t=localStorage.getItem(k);var d=t==="dark"||(t!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);if(d)document.documentElement.dataset.dashboardTheme="dark";}catch(e){}})();`;
