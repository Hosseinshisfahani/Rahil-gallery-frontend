"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { AdminSignOutButton } from "./admin-sign-out-button";
import { AdminThemeToggle } from "./admin-theme-toggle";
import { AdminLocaleSwitcher } from "./admin-locale-switcher";
import { useAdminT } from "./admin-locale-provider";
import { useAdminSidebarCollapsed } from "./use-admin-sidebar-collapsed";
import { formatDashboardDate } from "./greeting";
import { adminNav, type AdminNavItemConfig } from "@/lib/admin-routes";

export { adminNav };
export type AdminNavItem = AdminNavItemConfig;

export function isAdminNavActive(
  pathname: string,
  item: AdminNavItem,
): boolean {
  if ("exact" in item && item.exact) {
    return pathname === item.href;
  }
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function NavIcon({ type }: { type: string }) {
  const paths: Record<string, string> = {
    grid: "M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h7v7h-7v-7z",
    box: "M4 7l8-4 8 4v10l-8 4-8-4V7z",
    gem: "M12 2l7 7-7 13L5 9l7-7z",
    users: "M4 20v-1a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v1M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
    file: "M6 4h8l4 4v12H6V4z",
    settings: "M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm8-2l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z",
  };
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
      className="shrink-0"
    >
      <path d={paths[type] ?? paths.grid} />
    </svg>
  );
}

function SidebarToggleIcon({ collapsed }: { collapsed: boolean }) {
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
      className={cn("transition-transform rtl:scale-x-[-1]", collapsed && "rotate-180")}
    >
      <path d="M15 18l-6-6 6-6" />
      <path d="M19 6v12" />
    </svg>
  );
}

function SidebarCollapseButton({
  collapsed,
  onToggle,
  expandLabel,
  collapseLabel,
}: {
  collapsed: boolean;
  onToggle: () => void;
  expandLabel: string;
  collapseLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] text-sidebar-muted transition-colors",
        "hover:bg-sidebar-border/50 hover:text-sidebar-fg",
      )}
      aria-label={collapsed ? expandLabel : collapseLabel}
      aria-expanded={!collapsed}
    >
      <SidebarToggleIcon collapsed={collapsed} />
    </button>
  );
}

function CollapsedNavLink({
  item,
  active,
  label,
  disabled,
  disabledHint,
}: {
  item: AdminNavItem;
  active: boolean;
  label: string;
  disabled?: boolean;
  disabledHint?: string;
}) {
  const className = cn(
    "mx-auto flex size-10 items-center justify-center rounded-[var(--radius-md)] transition-colors",
    disabled
      ? "cursor-not-allowed opacity-40"
      : active
        ? "bg-sidebar-active text-white"
        : "text-sidebar-muted hover:bg-sidebar-border/50 hover:text-sidebar-fg",
  );

  if (disabled) {
    return (
      <span
        aria-disabled="true"
        title={disabledHint}
        className={className}
      >
        <NavIcon type={item.icon} />
        <span className="sr-only">{label}</span>
      </span>
    );
  }

  return (
    <Link href={item.href} title={label} className={className}>
      <NavIcon type={item.icon} />
      <span className="sr-only">{label}</span>
    </Link>
  );
}

function AdminNavLink({
  item,
  active,
  layout,
  label,
  disabled,
  disabledHint,
}: {
  item: AdminNavItem;
  active: boolean;
  layout: "vertical" | "horizontal";
  label: string;
  disabled?: boolean;
  disabledHint?: string;
}) {
  const horizontalClass = cn(
    "flex shrink-0 flex-col items-center gap-1 rounded-[var(--radius-md)] px-3 py-2 text-[10px] font-medium leading-none transition-colors",
    disabled
      ? "cursor-not-allowed opacity-40"
      : active
        ? "bg-sidebar-active text-white"
        : "text-sidebar-muted hover:bg-sidebar-border/50 hover:text-sidebar-fg",
  );

  const verticalClass = cn(
    "flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-sm font-medium transition-colors",
    disabled
      ? "cursor-not-allowed opacity-40"
      : active
        ? "bg-sidebar-active text-white"
        : "text-sidebar-muted hover:bg-sidebar-border/50 hover:text-sidebar-fg",
  );

  const content = (
    <>
      <NavIcon type={item.icon} />
      <span className={cn(layout === "horizontal" && "max-w-[4.5rem] truncate", layout === "vertical" && "truncate")}>
        {label}
      </span>
    </>
  );

  if (disabled) {
    return (
      <span
        aria-disabled="true"
        title={disabledHint}
        className={layout === "horizontal" ? horizontalClass : verticalClass}
      >
        {content}
      </span>
    );
  }

  if (layout === "horizontal") {
    return (
      <Link href={item.href} className={horizontalClass}>
        {content}
      </Link>
    );
  }

  return (
    <Link href={item.href} className={verticalClass}>
      {content}
    </Link>
  );
}

export interface AdminMobileNavProps {
  className?: string;
}

/** Horizontal scroll nav — mobile only; frees full width for page content. */
export function AdminMobileNav({ className }: AdminMobileNavProps) {
  const pathname = usePathname();
  const { t } = useAdminT();
  const disabledHint = t("nav.comingSoon");

  return (
    <nav
      className={cn(
        "border-b border-sidebar-border bg-sidebar-bg text-sidebar-fg lg:hidden",
        className,
      )}
      aria-label={t("nav.adminNav")}
    >
      <div className="flex items-center gap-1 overflow-x-auto px-2 py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {adminNav.map((item) => (
          <AdminNavLink
            key={item.href}
            item={item}
            active={!item.enabled ? false : isAdminNavActive(pathname, item)}
            layout="horizontal"
            label={t(item.labelKey)}
            disabled={!item.enabled}
            disabledHint={disabledHint}
          />
        ))}
      </div>
    </nav>
  );
}

export interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  className?: string;
}

export function AdminSidebar({ collapsed, onToggle, className }: AdminSidebarProps) {
  const pathname = usePathname();
  const { t } = useAdminT();
  const disabledHint = t("nav.comingSoon");

  return (
    <aside
      className={cn(
        "hidden h-screen shrink-0 flex-col border-inline-end border-sidebar-border bg-sidebar-bg text-sidebar-fg transition-[width] duration-200 ease-in-out lg:sticky lg:top-0 lg:flex",
        collapsed ? "w-[var(--sidebar-width-collapsed)]" : "w-[var(--sidebar-width)]",
        className,
      )}
    >
      <div
        className={cn(
          "flex h-[var(--header-height)] shrink-0 items-center border-b border-sidebar-border",
          collapsed ? "justify-center px-2" : "justify-between gap-2 px-4",
        )}
      >
        {collapsed ? (
          <SidebarCollapseButton
            collapsed={collapsed}
            onToggle={onToggle}
            expandLabel={t("nav.expandSidebar")}
            collapseLabel={t("nav.collapseSidebar")}
          />
        ) : (
          <>
            <div className="flex min-w-0 items-center gap-2">
              <div className="size-2 shrink-0 rounded-full bg-sidebar-active" aria-hidden="true" />
              <span className="truncate text-sm font-semibold tracking-tight">{t("nav.brand")}</span>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <AdminLocaleSwitcher compact />
              <AdminThemeToggle tone="sidebar" />
              <SidebarCollapseButton
                collapsed={collapsed}
                onToggle={onToggle}
                expandLabel={t("nav.expandSidebar")}
                collapseLabel={t("nav.collapseSidebar")}
              />
            </div>
          </>
        )}
      </div>

      <nav
        className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto overflow-x-hidden p-2"
        aria-label={t("nav.adminNav")}
      >
        {adminNav.map((item) => {
          const active = !item.enabled ? false : isAdminNavActive(pathname, item);
          const label = t(item.labelKey);
          if (collapsed) {
            return (
              <CollapsedNavLink
                key={item.href}
                item={item}
                active={active}
                label={label}
                disabled={!item.enabled}
                disabledHint={disabledHint}
              />
            );
          }
          return (
            <AdminNavLink
              key={item.href}
              item={item}
              active={active}
              layout="vertical"
              label={label}
              disabled={!item.enabled}
              disabledHint={disabledHint}
            />
          );
        })}
      </nav>

      <div
        className={cn(
          "shrink-0 border-t border-sidebar-border",
          collapsed ? "flex justify-center p-2" : "space-y-2 p-4",
        )}
      >
        <AdminSignOutButton compact={collapsed} />
        {!collapsed && (
          <p className="text-xs text-sidebar-muted">{t("nav.workspace")}</p>
        )}
      </div>
    </aside>
  );
}

export interface AdminTopBarProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function AdminTopBar({ title, subtitle, className }: AdminTopBarProps) {
  return (
    <header
      className={cn(
        "flex h-[var(--header-height)] items-center justify-between border-b border-border bg-surface/80 px-4 backdrop-blur-sm sm:px-6 dark:bg-surface/88",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-2 lg:gap-3">
        <div className="flex size-2 shrink-0 rounded-full bg-sidebar-active lg:hidden" aria-hidden="true" />
        <div className="min-w-0">
          <h1 className="truncate font-display text-base font-semibold text-ink">
            {title}
          </h1>
          {subtitle && (
            <p className="truncate text-xs text-ink-muted">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <AdminLocaleSwitcher compact className="hidden sm:inline-flex" />
        <AdminThemeToggle tone="topbar" />
        <div className="lg:hidden">
          <AdminSignOutButton compact tone="light" />
        </div>
        <div className="size-9 rounded-full bg-accent-muted ring-2 ring-accent/20" aria-hidden="true" />
      </div>
    </header>
  );
}

export interface AdminShellProps {
  /** Literal title. Prefer `titleKey` for i18n pages. */
  title?: string;
  /** Literal subtitle. Combined with key/date/suffix segments when those are set. */
  subtitle?: string;
  /** i18n key for the page title (replaces `title` when set). */
  titleKey?: string;
  subtitleKey?: string;
  /** Appended after subtitle segments, e.g. record id */
  subtitleSuffix?: string;
  includeDate?: boolean;
  children: React.ReactNode;
}

export function AdminShell({
  title,
  subtitle,
  titleKey,
  subtitleKey,
  subtitleSuffix,
  includeDate = false,
  children,
}: AdminShellProps) {
  const { t, locale } = useAdminT();
  const { collapsed, toggle } = useAdminSidebarCollapsed();

  const resolvedTitle = titleKey ? t(titleKey) : (title ?? "");
  const parts: string[] = [];
  if (subtitle) parts.push(subtitle);
  if (subtitleKey) parts.push(t(subtitleKey));
  if (includeDate) parts.push(formatDashboardDate(new Date(), locale));
  if (subtitleSuffix) parts.push(subtitleSuffix);
  const resolvedSubtitle = parts.length > 0 ? parts.join(" · ") : undefined;

  return (
    <div className="flex min-h-screen flex-col bg-canvas lg:flex-row">
      <AdminSidebar collapsed={collapsed} onToggle={toggle} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopBar title={resolvedTitle} subtitle={resolvedSubtitle} />
        <AdminMobileNav />
        <main className="mx-auto w-full max-w-7xl flex-1 overflow-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
