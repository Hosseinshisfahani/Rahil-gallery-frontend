import { Suspense } from "react";
import { AdminLoginView } from "@/app/admin/_components/layout/admin-login-view";

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-canvas text-sm text-ink-muted">
          Loading…
        </div>
      }
    >
      <AdminLoginView />
    </Suspense>
  );
}
