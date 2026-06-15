import { Text } from "@/_components/core/primitive/text";
import Link from "next/link";
import { buttonVariants } from "@/_components/core/config/variants";
import {
  DashboardCard,
  DashboardCardDescription,
  DashboardCardHeader,
  DashboardCardTitle,
  StatCard,
} from "@/_components/surfaces/dashboard/abstract/dashboard-card";
import { SwatchSection } from "./swatch-section";

/** Preview only — full admin UI at /admin with dashboard surface. */
export function DashboardPreviewSection() {
  return (
    <SwatchSection
      id="dashboard"
      title="Dashboard surface"
      subtitle="Modern admin theme — indigo primary, compact controls, dark sidebar. Visit /admin for the full shell."
    >
      <div
        className="overflow-hidden rounded-[var(--radius-lg)] border border-border"
        data-surface="dashboard"
      >
        <div className="grid gap-4 bg-canvas p-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard label="Preview" value="Modern" change="data-surface=dashboard" />
          <DashboardCard className="sm:col-span-2">
            <DashboardCardHeader>
              <div>
                <DashboardCardTitle>Separate theme layer</DashboardCardTitle>
                <DashboardCardDescription>
                  Primitives are shared; tokens and composites differ from the
                  luxury store theme.
                </DashboardCardDescription>
              </div>
            </DashboardCardHeader>
            <Link href="/admin" className={buttonVariants({ variant: "primary", size: "sm" })}>
              Open admin dashboard
            </Link>
          </DashboardCard>
        </div>
      </div>
      <Text muted className="mt-4 text-sm">
        Account pages use the <strong>store</strong> surface; staff admin uses{" "}
        <strong>dashboard</strong>.
      </Text>
    </SwatchSection>
  );
}
