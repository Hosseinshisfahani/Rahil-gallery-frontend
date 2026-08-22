import { buildApiUrl } from "../config";
import { ApiError } from "../types";
import type {
  AuthErrorEnvelope,
  AuthSuccessEnvelope,
  AuthTokenPair,
  AuthUser,
  LoginInput,
} from "./types";

// --- session ---

const ACCESS_TOKEN_KEY = "rahil_access_token";
const REFRESH_TOKEN_KEY = "rahil_refresh_token";
const EXPIRES_AT_KEY = "rahil_token_expires_at";
const AUTH_EXPIRED_EVENT = "rahil:auth-expired";

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

// --- auth-fetch ---

export function resolveAuthUrl(path: string): string {
  const built = buildApiUrl(path.startsWith("/") ? path : `/${path}`);
  if (built.startsWith("http")) return built;

  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  return `${origin}${built}`;
}

export async function parseAuthResponse<T>(
  response: Response,
  options: { handleAuthFailure?: boolean } = {},
): Promise<T> {
  const text = await response.text();
  const body = text
    ? (JSON.parse(text) as AuthSuccessEnvelope<T> | AuthErrorEnvelope)
    : null;

  if (!response.ok) {
    const errorBody = body as AuthErrorEnvelope | null;
    const code = errorBody?.error?.code?.toUpperCase() ?? "REQUEST_FAILED";
    let message = errorBody?.error?.message ?? `Request failed (${response.status})`;
    if (response.status === 404) {
      message =
        "API backend not found (404). Check GO_API_PROXY_URL / API_PROXY_URL matches APP_PORT (default :8081). Start Rahil-gallery-backend-go: make docker-dev && make dev";
    } else if (response.status === 502 || response.status === 503) {
      message =
        "API backend unavailable. Start Rahil-gallery-backend-go: make docker-dev && make dev";
    }
    if (options.handleAuthFailure && isAuthError(response.status, code)) {
      handleAuthIssue();
    }
    throw new ApiError(code, message, response.status);
  }

  if (!body || !("success" in body) || !body.success) {
    throw new ApiError("INVALID_RESPONSE", "Unexpected auth API response", 500);
  }

  return body.data;
}

// --- refresh ---

let refreshInFlight: Promise<AuthTokenPair | null> | null = null;

async function performRefreshRequest(): Promise<AuthTokenPair | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  const response = await fetch(resolveAuthUrl("/auth/refresh"), {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!response.ok) {
    return null;
  }

  const data = await parseAuthResponse<AuthTokenPair>(response);

  setAuthSession({
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
  });

  return data;
}

/** Rotate tokens once even when many requests fail with 401 at the same time. */
export async function refreshAccessToken(): Promise<AuthTokenPair | null> {
  if (refreshInFlight) {
    return refreshInFlight;
  }

  refreshInFlight = performRefreshRequest().finally(() => {
    refreshInFlight = null;
  });

  return refreshInFlight;
}

/** Returns a valid access token, refreshing proactively when close to expiry. */
export async function ensureValidAccessToken(): Promise<string | null> {
  const devToken = getDevAccessToken();
  if (devToken) return devToken;

  const stored = getStoredAccessToken();
  if (stored && !isAccessTokenExpired(ACCESS_TOKEN_REFRESH_BUFFER_MS)) {
    return stored;
  }

  if (!getRefreshToken()) {
    if (stored && isAccessTokenExpired()) {
      handleAuthIssue();
    }
    return null;
  }

  const pair = await refreshAccessToken();
  if (!pair) {
    handleAuthIssue();
    return null;
  }

  return pair.access_token;
}

// --- queries ---

export async function login(input: LoginInput): Promise<AuthTokenPair> {
  const response = await fetch(resolveAuthUrl("/auth/login"), {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const data = await parseAuthResponse<AuthTokenPair>(response);

  setAuthSession({
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
  });

  return data;
}

export async function logout(): Promise<void> {
  const refreshToken = getRefreshToken();

  try {
    if (refreshToken) {
      await fetch(resolveAuthUrl("/auth/logout"), {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
    }
  } finally {
    clearAuthSession();
  }
}

export async function getCurrentUser(): Promise<AuthUser> {
  const token = await ensureValidAccessToken();
  if (!token) {
    throw new ApiError("UNAUTHORIZED", "Not authenticated", 401);
  }

  const response = await fetch(resolveAuthUrl("/auth/me"), {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return parseAuthResponse<AuthUser>(response, { handleAuthFailure: true });
}
