"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ensureValidAccessToken } from "@/lib/api/auth/refresh-coordinator";
import { hasAuthSession } from "@/lib/api/auth/session";
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

      setReady(true);
    }

    void restoreSession();

    return () => {
      cancelled = true;
    };
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
