import { SurfaceShell } from "@/_components/core/surface";
import { AdminAuthGate } from "@/_components/surfaces/dashboard/layout/admin-auth-gate";
import { AdminLocaleProvider } from "@/_components/surfaces/dashboard/layout/admin-locale-provider";
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
          <AdminAuthGate>{children}</AdminAuthGate>
        </AdminLocaleProvider>
      </SurfaceShell>
    </>
  );
}
