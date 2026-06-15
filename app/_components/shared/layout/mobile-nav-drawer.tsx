"use client";

import Link from "next/link";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  getLocalizedLabel,
  localePath,
  primaryNavItems,
  type NavItem,
} from "@/_components/core/config/navigation";
import { LocaleSwitcher } from "./locale-switcher";
import type { Locale } from "@/_components/core/types";

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
  brandName = "Rehil Gallery",
}: MobileNavDrawerProps) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 bg-ink/40"
        aria-label="Close menu"
        onClick={onClose}
      />
      <nav
        className={cn(
          "absolute top-0 bottom-0 w-full max-w-sm bg-surface p-6 shadow-md",
          locale === "fa" ? "start-0" : "end-0",
        )}
        aria-label="Mobile navigation"
      >
        <div className="mb-8 flex items-center justify-between">
          <span className="ds-wordmark font-display text-base">{brandName}</span>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-10 items-center justify-center"
            aria-label="Close"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
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
    </div>
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
