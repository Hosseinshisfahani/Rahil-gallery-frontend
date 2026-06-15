"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  DEFAULT_ANALYTICS_PERIOD,
  parseAnalyticsPeriod,
  type AnalyticsPeriod,
} from "@/lib/analytics/period";

type AnalyticsPeriodContextValue = {
  period: AnalyticsPeriod;
  setPeriod: (period: AnalyticsPeriod) => void;
};

const AnalyticsPeriodContext = createContext<AnalyticsPeriodContextValue | null>(
  null,
);

export function AnalyticsPeriodProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const period = parseAnalyticsPeriod(searchParams.get("period"));

  const setPeriod = useCallback(
    (next: AnalyticsPeriod) => {
      const params = new URLSearchParams(searchParams.toString());
      if (next === DEFAULT_ANALYTICS_PERIOD) {
        params.delete("period");
      } else {
        params.set("period", next);
      }
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const value = useMemo(
    () => ({ period, setPeriod }),
    [period, setPeriod],
  );

  return (
    <AnalyticsPeriodContext.Provider value={value}>
      {children}
    </AnalyticsPeriodContext.Provider>
  );
}

export function useAnalyticsPeriod(): AnalyticsPeriodContextValue {
  const ctx = useContext(AnalyticsPeriodContext);
  if (!ctx) {
    throw new Error("useAnalyticsPeriod must be used within AnalyticsPeriodProvider");
  }
  return ctx;
}
