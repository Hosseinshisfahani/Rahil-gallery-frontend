"use client";

import { Suspense } from "react";
import {
  AnalyticsPeriodProvider,
  AnalyticsPeriodSelector,
  AnalyticsTabNav,
} from "@/_components/surfaces/dashboard/analytics";
import { TranslatedAdminShell } from "@/_components/surfaces/dashboard/layout/translated-admin-shell";

function AnalyticsLayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-8">
      <AnalyticsTabNav />
      <AnalyticsPeriodSelector />
      {children}
    </div>
  );
}

export function AnalyticsLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TranslatedAdminShell
      titleKey="analytics.title"
      subtitleKey="analytics.subtitle"
      includeDate
    >
      <Suspense fallback={<div className="flex flex-col gap-8"><AnalyticsTabNav /></div>}>
        <AnalyticsPeriodProvider>
          <AnalyticsLayoutContent>{children}</AnalyticsLayoutContent>
        </AnalyticsPeriodProvider>
      </Suspense>
    </TranslatedAdminShell>
  );
}
