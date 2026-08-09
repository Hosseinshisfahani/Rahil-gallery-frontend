"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  footerLinkGroups,
  getLocalizedLabel,
  localePath,
  primaryNavItems,
  type NavItem,
} from "@/lib/store-navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { ClassNames, Locale } from "@/lib/types";

// --- Container ---

export interface ContainerProps {
  className?: string;
  children: React.ReactNode;
  as?: "div" | "section" | "main" | "header" | "footer" | "article";
}

export function Container({
  className,
  children,
  as: Component = "div",
}: ContainerProps) {
  return (
    <Component className={cn("container-page", className)}>
      {children}
    </Component>
  );
}

// --- LocaleSwitcher ---

export interface LocaleSwitcherProps {
  locale?: Locale;
  className?: string;
  /** Override target path when switching (defaults to `/fa` or `/en`) */
  href?: string;
}

export function LocaleSwitcher({
  locale = "en",
  className,
  href,
}: LocaleSwitcherProps) {
  const targetLocale = locale === "fa" ? "en" : "fa";
  const label = targetLocale === "fa" ? "فا" : "EN";

  return (
    <Link
      href={href ?? localePath(targetLocale)}
      className={cn(
        "text-xs font-medium uppercase tracking-widest text-ink-subtle transition-colors hover:text-ink",
        className,
      )}
      aria-label={`Switch to ${targetLocale === "fa" ? "Persian" : "English"}`}
    >
      {label}
    </Link>
  );
}

// --- MobileNavDrawer ---

export interface MobileNavDrawerProps {
  locale?: Locale;
  open: boolean;
  onClose: () => void;
  navItems?: NavItem[];
  brandName?: string;
}

export function MobileNavDrawer({
  locale = "en",
  open,
  onClose,
  navItems = primaryNavItems,
  brandName = "Rahil Gallery",
}: MobileNavDrawerProps) {
  const side = locale === "fa" ? "left" : "right";

  return (
    <Sheet
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
    >
      <SheetContent
        side={side}
        closeLabel="Close"
        className="gap-0 bg-surface p-0 text-ink lg:hidden"
      >
        <SheetHeader className="border-b border-border px-6 py-5">
          <SheetTitle className="font-display text-base font-normal text-ink">
            {brandName}
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-1 flex-col px-6 py-6" aria-label="Mobile navigation">
          <ul className="flex flex-col gap-4">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={localePath(locale, item.href)}
                  onClick={onClose}
                  className="ds-nav-link text-base text-ink"
                >
                  {getLocalizedLabel(item, locale)}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 border-t border-border pt-6">
            <LocaleSwitcher locale={locale} />
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

function MenuIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function MobileMenuButton({
  onClick,
  label = "Open menu",
  className,
}: {
  onClick: () => void;
  label?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-expanded={false}
      className={cn(
        "inline-flex size-10 items-center justify-center text-ink lg:hidden",
        className,
      )}
    >
      <MenuIcon />
    </button>
  );
}

// --- SiteHeader ---

function IconLink({
  href,
  label,
  children,
  className,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={cn(
        "inline-flex size-10 items-center justify-center text-ink transition-colors hover:text-[var(--brand,var(--primary))]",
        className,
      )}
    >
      {children}
    </Link>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3-3" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true">
      <path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.5-7 10-7 10z" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.5-7 8-7s8 3 8 7" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true">
      <path d="M6 7h12l-1 14H7L6 7z" />
      <path d="M9 7V5a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

export interface SiteHeaderProps {
  locale?: Locale;
  className?: string;
  brandName?: string;
  brandHref?: string;
  navItems?: NavItem[];
  /** Absolute overlay on hero (landing) — no sticky, transparent gradient */
  overlay?: boolean;
  classNames?: ClassNames<"root" | "inner" | "nav" | "actions">;
}

export function SiteHeader({
  locale = "en",
  className,
  brandName = "Rahil Gallery",
  brandHref,
  navItems = primaryNavItems,
  overlay = false,
  classNames,
}: SiteHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const home = brandHref ?? localePath(locale);

  return (
    <>
      <header
        className={cn(
          overlay
            ? "landing-header-overlay absolute inset-x-0 top-0 z-40 border-b bg-transparent"
            : "sticky top-0 z-40 border-b border-border/80 bg-surface",
          className,
          classNames?.root,
        )}
      >
        <Container className={cn(classNames?.inner)}>
          {/* Top row — wordmark centered, utilities flanking */}
          <div className="grid h-[var(--header-height)] grid-cols-[1fr_auto_1fr] items-center gap-4">
            <div className="flex items-center gap-1">
              <MobileMenuButton onClick={() => setMobileOpen(true)} />
              <LocaleSwitcher locale={locale} className="hidden sm:inline-flex" />
            </div>

            <Link href={home} className="ds-wordmark font-display text-center">
              {brandName}
            </Link>

            <div
              className={cn(
                "flex items-center justify-end gap-0",
                classNames?.actions,
              )}
            >
              <IconLink href={localePath(locale, "/search")} label="Search">
                <SearchIcon />
              </IconLink>
              <IconLink href={localePath(locale, "/account/wishlist")} label="Wishlist">
                <HeartIcon />
              </IconLink>
              <IconLink href={localePath(locale, "/account")} label="Account">
                <UserIcon />
              </IconLink>
              <IconLink href={localePath(locale, "/cart")} label="Cart">
                <BagIcon />
              </IconLink>
            </div>
          </div>

          {/* Desktop nav — centered uppercase links */}
          <nav
            className={cn(
              "landing-header-nav hidden h-[var(--header-nav-height,2.75rem)] items-center justify-center gap-8 border-t border-border/50 lg:flex",
              classNames?.nav,
            )}
            aria-label="Primary"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={localePath(locale, item.href)}
                className="ds-nav-link text-ink transition-colors hover:text-[var(--brand,var(--primary))]"
              >
                {getLocalizedLabel(item, locale)}
              </Link>
            ))}
          </nav>
        </Container>
      </header>
      <MobileNavDrawer
        locale={locale}
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        navItems={navItems}
        brandName={brandName}
      />
    </>
  );
}

// --- SiteFooter ---

export interface SiteFooterProps {
  locale?: Locale;
  className?: string;
  brandName?: string;
  tagline?: string;
  classNames?: ClassNames<"root" | "inner" | "brand">;
}

function FooterColumn({
  title,
  links,
  locale,
}: {
  title: string;
  links: readonly { href: string; labelEn: string; labelFa: string }[];
  locale: Locale;
}) {
  return (
    <div>
      <h3 className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-ink-subtle">
        {title}
      </h3>
      <ul className="flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={localePath(locale, link.href)}
              className="text-sm text-ink-muted transition-colors hover:text-ink"
            >
              {getLocalizedLabel(link, locale)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

const defaultTaglines: Record<Locale, string> = {
  en: "Fine jewelry and enduring craft, from our atelier to you.",
  fa: "جواهرات ظریف و هنر ماندگار، از کارگاه ما تا شما.",
};

const columnTitles: Record<Locale, { shop: string; brand: string; help: string }> = {
  en: { shop: "Shop", brand: "Brand", help: "Help" },
  fa: { shop: "فروشگاه", brand: "برند", help: "راهنما" },
};

export function SiteFooter({
  locale = "en",
  className,
  brandName = "Rahil Gallery",
  tagline,
  classNames,
}: SiteFooterProps) {
  const isFa = locale === "fa";
  const columns = columnTitles[locale];

  return (
    <footer
      className={cn(
        "border-t border-border bg-surface",
        className,
        classNames?.root,
      )}
    >
      <Container className={cn("py-16 md:py-20", classNames?.inner)}>
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className={cn("lg:col-span-1", classNames?.brand)}>
            <Link
              href={localePath(locale)}
              className="ds-wordmark font-display text-xl"
            >
              {brandName}
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-muted">
              {tagline ?? defaultTaglines[locale]}
            </p>
          </div>
          <FooterColumn
            title={columns.shop}
            links={footerLinkGroups.shop}
            locale={locale}
          />
          <FooterColumn
            title={columns.brand}
            links={footerLinkGroups.brand}
            locale={locale}
          />
          <FooterColumn
            title={columns.help}
            links={footerLinkGroups.help}
            locale={locale}
          />
        </div>
        <div className="mt-16 flex flex-col gap-4 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-ink-subtle">
            © {new Date().getFullYear()} {brandName}.{" "}
            {isFa ? "تمامی حقوق محفوظ است." : "All rights reserved."}
          </p>
          <Link
            href={localePath(locale, "/terms")}
            className="text-xs text-ink-subtle hover:text-ink"
          >
            {isFa ? "شرایط استفاده" : "Terms of use"}
          </Link>
        </div>
      </Container>
    </footer>
  );
}

// --- StoreChrome ---

/**
 * Store chrome: header on all store routes; landing keeps overlay header + footer
 * inside `.landing` so landing.css selectors continue to apply.
 */
export function StoreChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  if (isLanding) {
    return (
      <div className="landing flex min-h-full flex-1 flex-col">
        <SiteHeader locale="en" brandHref="/" overlay />
        {children}
        <SiteFooter
          locale="en"
          className="border-[var(--landing-border)] bg-[var(--landing-surface)]"
        />
      </div>
    );
  }

  return (
    <>
      <SiteHeader locale="en" brandHref="/" />
      {children}
    </>
  );
}
