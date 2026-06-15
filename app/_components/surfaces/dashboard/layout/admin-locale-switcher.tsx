"use client";

import { ADMIN_LOCALES } from "@/lib/admin-locale";
import { cn } from "@/lib/utils";
import { useAdminT } from "./admin-locale-provider";

type AdminLocaleSwitcherProps = {
  className?: string;
  compact?: boolean;
};

export function AdminLocaleSwitcher({
  className,
  compact = false,
}: AdminLocaleSwitcherProps) {
  const { locale, setLocale, t } = useAdminT();

  return (
    <div
      className={cn(
        "inline-flex rounded-md border border-border bg-surface p-0.5",
        className,
      )}
      role="group"
      aria-label={locale === "fa" ? t("locale.switchToEn") : t("locale.switchToFa")}
    >
      {ADMIN_LOCALES.map(({ value, label }) => {
        const active = locale === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => setLocale(value)}
            className={cn(
              "rounded px-2 py-1 text-xs font-medium transition-colors",
              active
                ? "bg-ink text-surface"
                : "text-muted hover:text-ink",
              compact && "px-1.5",
            )}
            aria-pressed={active}
            title={value === "fa" ? t("locale.switchToFa") : t("locale.switchToEn")}
          >
            {value === "fa" ? t("locale.fa") : t("locale.en")}
            {!compact && (
              <span className="sr-only">{label}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
