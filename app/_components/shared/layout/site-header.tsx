"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  getLocalizedLabel,
  localePath,
  primaryNavItems,
  type NavItem,
} from "@/_components/core/config/navigation";
import { Container } from "./container";
import { LocaleSwitcher } from "./locale-switcher";
import { MobileMenuButton, MobileNavDrawer } from "./mobile-nav-drawer";
import type { ClassNames, Locale } from "@/_components/core/types";

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
  brandName = "Rehil Gallery",
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
