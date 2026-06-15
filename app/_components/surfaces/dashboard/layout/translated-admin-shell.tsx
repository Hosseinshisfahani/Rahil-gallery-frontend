"use client";

import type { ReactNode } from "react";
import { formatDashboardDate } from "../lib/greeting";
import { AdminShell } from "./admin-shell";
import { useAdminT } from "./admin-locale-provider";

export interface TranslatedAdminShellProps {
  titleKey: string;
  subtitleKey?: string;
  /** Appended after subtitle segments, e.g. record id */
  subtitleSuffix?: string;
  includeDate?: boolean;
  children: ReactNode;
}

export function TranslatedAdminShell({
  titleKey,
  subtitleKey,
  subtitleSuffix,
  includeDate = false,
  children,
}: TranslatedAdminShellProps) {
  const { t, locale } = useAdminT();

  const parts: string[] = [];
  if (subtitleKey) parts.push(t(subtitleKey));
  if (includeDate) parts.push(formatDashboardDate(new Date(), locale));
  if (subtitleSuffix) parts.push(subtitleSuffix);

  return (
    <AdminShell
      title={t(titleKey)}
      subtitle={parts.length > 0 ? parts.join(" · ") : undefined}
    >
      {children}
    </AdminShell>
  );
}
