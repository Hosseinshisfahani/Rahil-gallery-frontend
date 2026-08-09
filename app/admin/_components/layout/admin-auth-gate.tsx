"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ensureValidAccessToken } from "@/lib/api/auth";
import { hasAuthSession } from "@/lib/api/auth";
import { useAdminT } from "./admin-locale-provider";

export interface AdminAuthGateProps {
  children: ReactNode;
}

export function AdminAuthGate({ children }: AdminAuthGateProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useAdminT();
  const isLoginRoute = pathname === "/admin/login";
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    if (isLoginRoute) return;

    let cancelled = false;

    async function restoreSession() {
      if (!hasAuthSession()) {
        const next = encodeURIComponent(pathname);
        router.replace(`/admin/login?next=${next}`);
        return;
      }

      const token = await ensureValidAccessToken();
      if (cancelled) return;

      if (!token) {
        const next = encodeURIComponent(pathname);
        router.replace(`/admin/login?next=${next}`);
        return;
      }

      setSessionReady(true);
    }

    void restoreSession();

    return () => {
      cancelled = true;
    };
  }, [isLoginRoute, pathname, router]);

  if (isLoginRoute) {
    return children;
  }

  if (!sessionReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas text-sm text-ink-muted">
        {t("auth.checkingSession")}
      </div>
    );
  }

  return children;
}
