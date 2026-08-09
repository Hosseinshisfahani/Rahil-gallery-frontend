"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fieldPlaceholder } from "@/components/admin/ui/form-placeholders";
import { AdminThemeToggle } from "./admin-theme-toggle";
import { AdminLocaleSwitcher } from "./admin-locale-switcher";
import { useAdminT } from "./admin-locale-provider";
import { login } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/types";
import { ADMIN_DEFAULT_ROUTE } from "@/lib/admin-routes";

export function AdminLoginView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useAdminT();
  const nextPath = searchParams.get("next") ?? ADMIN_DEFAULT_ROUTE;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login({ email: email.trim(), password });
      router.replace(nextPath.startsWith("/admin") ? nextPath : ADMIN_DEFAULT_ROUTE);
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError(err instanceof Error ? err.message : t("auth.signInFailed"));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-canvas px-4">
      <div className="absolute end-4 top-4 flex items-center gap-2">
        <AdminLocaleSwitcher compact />
        <AdminThemeToggle tone="topbar" />
      </div>
      <div className="w-full max-w-md rounded-[var(--radius-lg)] border border-border bg-surface p-8 shadow-sm">
        <div className="mb-8 space-y-2 text-center">
          <h1 className="font-display text-xl font-semibold text-ink">
            {t("auth.signInTitle")}
          </h1>
          <p className="text-sm text-ink-muted">{t("auth.signInSubtitle")}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            id="email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={fieldPlaceholder(t("auth.email"), true)}
            aria-label={fieldPlaceholder(t("auth.email"), true)}
            required
            dir="ltr"
            className="text-ltr"
          />

          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={fieldPlaceholder(t("auth.password"), true)}
            aria-label={fieldPlaceholder(t("auth.password"), true)}
            required
            dir="ltr"
            className="text-ltr"
          />

          {error && (
            <p className="rounded-[var(--radius-md)] bg-danger/10 px-3 py-2 text-sm text-danger">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t("auth.signingIn") : t("auth.signIn")}
          </Button>
        </form>
      </div>
    </div>
  );
}
