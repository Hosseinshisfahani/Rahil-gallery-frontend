import { clearAuthSession } from "./session";

function loginPathWithNext(): string {
  if (typeof window === "undefined") {
    return "/admin/login";
  }

  const pathname = window.location.pathname;
  if (pathname.startsWith("/admin/login")) {
    return "/admin/login";
  }

  return `/admin/login?next=${encodeURIComponent(pathname)}`;
}

/** Clear stored credentials and optionally send the user to the login page. */
export function terminateSession(options?: { redirect?: boolean }): void {
  clearAuthSession();

  if (options?.redirect === false || typeof window === "undefined") {
    return;
  }

  const target = loginPathWithNext();
  if (window.location.pathname + window.location.search !== target) {
    window.location.replace(target);
  }
}

const AUTH_ERROR_CODES = new Set([
  "UNAUTHORIZED",
  "unauthorized",
  "INVALID_TOKEN",
  "TOKEN_EXPIRED",
  "SESSION_EXPIRED",
  "AUTH_REQUIRED",
]);

export function isAuthSecurityFailure(status: number, code?: string): boolean {
  if (status === 401) {
    return true;
  }

  if (status !== 403 || !code) {
    return false;
  }

  const normalized = code.toUpperCase();
  return AUTH_ERROR_CODES.has(code) || AUTH_ERROR_CODES.has(normalized);
}
