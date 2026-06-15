export type AdminLocale = "en" | "fa";

export const ADMIN_LOCALE_STORAGE_KEY = "rehil-admin-locale";
export const DEFAULT_ADMIN_LOCALE: AdminLocale = "fa";

export const ADMIN_LOCALES: { value: AdminLocale; label: string }[] = [
  { value: "en", label: "English" },
  { value: "fa", label: "فارسی" },
];

export function isAdminLocale(value: string | null | undefined): value is AdminLocale {
  return value === "en" || value === "fa";
}

export function applyAdminLocale(locale: AdminLocale): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.lang = locale;
  root.dir = locale === "fa" ? "rtl" : "ltr";
}

export function readStoredAdminLocale(): AdminLocale {
  if (typeof window === "undefined") return DEFAULT_ADMIN_LOCALE;
  try {
    const stored = localStorage.getItem(ADMIN_LOCALE_STORAGE_KEY);
    return isAdminLocale(stored) ? stored : DEFAULT_ADMIN_LOCALE;
  } catch {
    return DEFAULT_ADMIN_LOCALE;
  }
}

export function persistAdminLocale(locale: AdminLocale): void {
  try {
    localStorage.setItem(ADMIN_LOCALE_STORAGE_KEY, locale);
  } catch {
    /* ignore quota / private mode */
  }
  applyAdminLocale(locale);
}

/** Inline script for admin layout — runs before paint to avoid locale flash */
export function adminLocaleInitScript(): string {
  const defaultLocale = DEFAULT_ADMIN_LOCALE;
  return `(function(){try{var k=${JSON.stringify(ADMIN_LOCALE_STORAGE_KEY)};var l=localStorage.getItem(k);var locale=(l==='en'||l==='fa')?l:${JSON.stringify(defaultLocale)};document.documentElement.lang=locale;document.documentElement.dir=locale==='fa'?'rtl':'ltr';}catch(e){document.documentElement.lang=${JSON.stringify(defaultLocale)};document.documentElement.dir=${defaultLocale === "fa" ? "rtl" : "ltr"};}})();`;
}
