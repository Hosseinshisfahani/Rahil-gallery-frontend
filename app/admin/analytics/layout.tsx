import { AnalyticsLayoutClient } from "@/_components/surfaces/dashboard/layout/analytics-layout-client";

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AnalyticsLayoutClient>{children}</AnalyticsLayoutClient>;
}
