"use client";

import { Suspense } from "react";
import { AdminLoginView } from "@/_components/surfaces/dashboard/layout/admin-login-view";
import { useAdminT } from "@/_components/surfaces/dashboard/layout/admin-locale-provider";

function LoginLoading() {
  const { t } = useAdminT();
  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas text-sm text-ink-muted">
      {t("common.loading")}
    </div>
  );
}

export function AdminLoginPageClient() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <AdminLoginView />
    </Suspense>
  );
}
