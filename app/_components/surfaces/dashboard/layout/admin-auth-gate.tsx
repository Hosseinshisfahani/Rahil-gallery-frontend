"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { hasAuthSession } from "@/lib/api/auth";
import { useAdminT } from "./admin-locale-provider";

export interface AdminAuthGateProps {
  children: ReactNode;
}

export function AdminAuthGate({ children }: AdminAuthGateProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useAdminT();
  const [ready, setReady] = useState(false);

  const isLoginRoute = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginRoute) {
      setReady(true);
      return;
    }

    if (hasAuthSession()) {
      setReady(true);
      return;
    }

    const next = encodeURIComponent(pathname);
    router.replace(`/admin/login?next=${next}`);
  }, [isLoginRoute, pathname, router]);

  if (!ready && !isLoginRoute) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas text-sm text-ink-muted">
        {t("auth.checkingSession")}
      </div>
    );
  }

  return children;
}
