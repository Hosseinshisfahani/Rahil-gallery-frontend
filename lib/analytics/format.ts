import type { AdminLocale } from "@/lib/admin-locale";

function localeTag(locale: AdminLocale): string {
  return locale === "fa" ? "fa-IR" : "en-US";
}

export function formatCount(value: number, locale: AdminLocale): string {
  return Math.round(value).toLocaleString(localeTag(locale));
}

export function formatCompactCurrency(value: number, locale: AdminLocale): string {
  const abs = Math.abs(value);
  const tag = localeTag(locale);

  if (abs >= 1_000_000_000) {
    const scaled = value / 1_000_000_000;
    const formatted = scaled.toLocaleString(tag, {
      maximumFractionDigits: 1,
      minimumFractionDigits: scaled % 1 === 0 ? 0 : 1,
    });
    return locale === "fa" ? `${formatted}B` : `${formatted}B`;
  }

  if (abs >= 1_000_000) {
    const scaled = value / 1_000_000;
    const formatted = scaled.toLocaleString(tag, {
      maximumFractionDigits: scaled >= 100 ? 0 : 1,
      minimumFractionDigits: 0,
    });
    return locale === "fa" ? `${formatted}M` : `${formatted}M`;
  }

  if (abs >= 1_000) {
    const scaled = value / 1_000;
    const formatted = scaled.toLocaleString(tag, {
      maximumFractionDigits: 0,
    });
    return locale === "fa" ? `${formatted}K` : `${formatted}K`;
  }

  return formatCount(value, locale);
}

export function formatPercent(
  value: number,
  locale: AdminLocale,
  fractionDigits = 1,
): string {
  return `${value.toLocaleString(localeTag(locale), {
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits,
  })}%`;
}

export function formatMultiplier(value: number, locale: AdminLocale): string {
  const formatted = value.toLocaleString(localeTag(locale), {
    maximumFractionDigits: 1,
    minimumFractionDigits: value % 1 === 0 ? 0 : 1,
  });
  return `${formatted}×`;
}
