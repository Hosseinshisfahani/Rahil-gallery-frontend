/** Default admin landing route (customers module). */
export const ADMIN_DEFAULT_ROUTE = "/admin/customers";

export type AdminNavItemConfig = {
  href: string;
  labelKey: string;
  icon: string;
  exact?: boolean;
  /** When false, the item is visible but not navigable. */
  enabled: boolean;
};

export const adminNav: readonly AdminNavItemConfig[] = [
  { href: "/admin", labelKey: "nav.dashboard", icon: "grid", exact: true, enabled: false },
  { href: "/admin/analytics", labelKey: "nav.analytics", icon: "chart", enabled: false },
  { href: "/admin/orders", labelKey: "nav.orders", icon: "box", enabled: false },
  { href: "/admin/products", labelKey: "nav.products", icon: "gem", enabled: false },
  { href: ADMIN_DEFAULT_ROUTE, labelKey: "nav.customers", icon: "users", enabled: true },
  { href: "/admin/content", labelKey: "nav.content", icon: "file", enabled: false },
  { href: "/admin/settings", labelKey: "nav.settings", icon: "settings", enabled: false },
];
