const ACCESS_TOKEN_KEY = "rehil_access_token";
const REFRESH_TOKEN_KEY = "rehil_refresh_token";
const EXPIRES_AT_KEY = "rehil_token_expires_at";
const AUTH_EXPIRED_EVENT = "rehil:auth-expired";

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

function canUseSessionStorage(): boolean {
  return typeof window !== "undefined";
}

export function getDevAccessToken(): string | null {
  return process.env.NEXT_PUBLIC_DEV_ACCESS_TOKEN?.trim() || null;
}

export function getAccessToken(): string | null {
  const devToken = getDevAccessToken();
  if (devToken) return devToken;

  if (!canUseSessionStorage()) return null;

  const token = sessionStorage.getItem(ACCESS_TOKEN_KEY);
  if (!token) return null;

  const expiresAt = Number(sessionStorage.getItem(EXPIRES_AT_KEY) ?? "0");
  if (expiresAt > 0 && Date.now() >= expiresAt) {
    clearAuthSession();
    notifyAuthExpired();
    return null;
  }

  return token;
}

export function getRefreshToken(): string | null {
  if (!canUseSessionStorage()) return null;
  return sessionStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setAuthSession(tokens: {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}): void {
  if (!canUseSessionStorage()) return;

  sessionStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  sessionStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  sessionStorage.setItem(
    EXPIRES_AT_KEY,
    String(Date.now() + tokens.expiresIn * 1000),
  );
}

export function clearAuthSession(): void {
  if (!canUseSessionStorage()) return;

  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  sessionStorage.removeItem(EXPIRES_AT_KEY);
}

export function hasAuthSession(): boolean {
  return Boolean(getAccessToken());
}

export function isAuthError(status: number, code?: string): boolean {
  const normalizedCode = code?.toLowerCase();
  return (
    status === 401 ||
    normalizedCode === "unauthorized" ||
    normalizedCode === "invalid_refresh_token" ||
    normalizedCode === "password_not_set" ||
    normalizedCode === "inactive_account"
  );
}

export function handleAuthIssue(): void {
  clearAuthSession();
  notifyAuthExpired();
  redirectToLogin();
}

function notifyAuthExpired(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT));
}

function redirectToLogin(): void {
  if (typeof window === "undefined") return;
  if (window.location.pathname.startsWith("/admin/login")) return;

  const next = `${window.location.pathname}${window.location.search}`;
  window.location.assign(`/admin/login?next=${encodeURIComponent(next)}`);
}
