"use client";

import { logout } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAdminT } from "./admin-locale-provider";

export function AdminSignOutButton({
  compact = false,
  tone = "sidebar",
}: {
  compact?: boolean;
  tone?: "sidebar" | "light";
}) {
  const router = useRouter();
  const { t } = useAdminT();

  async function handleSignOut() {
    await logout();
    router.replace("/admin/login");
    router.refresh();
  }

  if (compact) {
    return (
      <button
        type="button"
        onClick={handleSignOut}
        title={t("auth.signOut")}
        className={cn(
          "flex size-9 items-center justify-center rounded-[var(--radius-md)] transition-colors",
          tone === "light"
            ? "text-ink-muted hover:bg-surface-elevated hover:text-ink"
            : "mx-auto text-sidebar-muted hover:bg-sidebar-border/50 hover:text-sidebar-fg",
        )}
        aria-label={t("auth.signOut")}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
        </svg>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="text-xs text-sidebar-muted underline-offset-2 hover:text-sidebar-fg hover:underline"
    >
      {t("auth.signOut")}
    </button>
  );
}
