import { SurfaceShell } from "@/components/providers/surface-shell";
import { AdminAuthGate } from "@/app/admin/_components/layout/admin-auth-gate";
import { AdminLocaleProvider } from "@/app/admin/_components/layout/admin-locale-provider";
import { ObservabilityReporter } from "@/app/admin/_components/layout/observability-reporter";
import { adminLocaleInitScript } from "@/lib/admin-locale";
import { dashboardThemeInitScript } from "@/lib/dashboard-theme";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: adminLocaleInitScript() }} />
      <script dangerouslySetInnerHTML={{ __html: dashboardThemeInitScript }} />
      <SurfaceShell surface="dashboard" className="min-h-screen">
        <AdminLocaleProvider>
          <AdminAuthGate>
            <ObservabilityReporter />
            {children}
          </AdminAuthGate>
        </AdminLocaleProvider>
      </SurfaceShell>
    </>
  );
}
