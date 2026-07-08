const ACCESS_TOKEN_KEY = "rehil_access_token";
const REFRESH_TOKEN_KEY = "rehil_refresh_token";
const EXPIRES_AT_KEY = "rehil_token_expires_at";
const AUTH_EXPIRED_EVENT = "rehil:auth-expired";

/** Refresh access token this many ms before it expires. */
export const ACCESS_TOKEN_REFRESH_BUFFER_MS = 60_000;

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

export function getStoredAccessToken(): string | null {
  if (!canUseSessionStorage()) return null;
  return sessionStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getAccessTokenExpiresAt(): number | null {
  if (!canUseSessionStorage()) return null;

  const raw = sessionStorage.getItem(EXPIRES_AT_KEY);
  if (!raw) return null;

  const expiresAt = Number(raw);
  return Number.isFinite(expiresAt) && expiresAt > 0 ? expiresAt : null;
}

export function isAccessTokenExpired(bufferMs = 0): boolean {
  const expiresAt = getAccessTokenExpiresAt();
  if (!expiresAt) return false;

  return Date.now() >= expiresAt - bufferMs;
}

/** Returns a usable access token, or null when missing/expired (refresh token is kept). */
export function getAccessToken(): string | null {
  const devToken = getDevAccessToken();
  if (devToken) return devToken;

  const token = getStoredAccessToken();
  if (!token) return null;

  if (isAccessTokenExpired()) {
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

/** True when a refresh token exists or the access token is still valid. */
export function hasAuthSession(): boolean {
  if (getDevAccessToken()) return true;
  if (!canUseSessionStorage()) return false;

  const refreshToken = getRefreshToken();
  const accessToken = getStoredAccessToken();

  if (!accessToken && !refreshToken) return false;
  if (accessToken && !isAccessTokenExpired()) return true;

  return Boolean(refreshToken);
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
