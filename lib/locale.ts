import type { Locale } from "@/lib/types";

export const STORE_LOCALES = ["fa", "en"] as const satisfies readonly Locale[];

export const DEFAULT_STORE_LOCALE: Locale = "fa";

/** Request header set by proxy.ts so the root layout can set `<html lang>` and `dir`. */
export const LOCALE_HEADER = "x-rahil-locale";

export function isStoreLocale(
  value: string | null | undefined,
): value is Locale {
  return value === "fa" || value === "en";
}
