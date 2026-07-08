"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  applyAdminLocale,
  persistAdminLocale,
  readStoredAdminLocale,
  type AdminLocale,
} from "@/lib/admin-locale";
import { getAdminMessage } from "@/lib/i18n/admin";

type AdminLocaleContextValue = {
  locale: AdminLocale;
  setLocale: (locale: AdminLocale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  dir: "ltr" | "rtl";
};

const AdminLocaleContext = createContext<AdminLocaleContextValue | null>(null);

export function AdminLocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<AdminLocale>(() =>
    readStoredAdminLocale(),
  );

  const setLocale = useCallback((next: AdminLocale) => {
    persistAdminLocale(next);
    setLocaleState(next);
  }, []);

  useEffect(() => {
    applyAdminLocale(locale);
  }, [locale]);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) =>
      getAdminMessage(locale, key, vars),
    [locale],
  );

  const value = useMemo(
    (): AdminLocaleContextValue => ({
      locale,
      setLocale,
      t,
      dir: locale === "fa" ? "rtl" : "ltr",
    }),
    [locale, setLocale, t],
  );

  return (
    <AdminLocaleContext.Provider value={value}>{children}</AdminLocaleContext.Provider>
  );
}

export function useAdminLocale(): AdminLocaleContextValue {
  const ctx = useContext(AdminLocaleContext);
  if (!ctx) {
    throw new Error("useAdminLocale must be used within AdminLocaleProvider");
  }
  return ctx;
}

export function useAdminT() {
  const { t, locale, dir, setLocale } = useAdminLocale();
  return { t, locale, dir, setLocale };
}
