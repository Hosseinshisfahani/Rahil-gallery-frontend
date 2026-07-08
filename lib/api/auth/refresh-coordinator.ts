import type { AuthTokenPair } from "./types";
import {
  ACCESS_TOKEN_REFRESH_BUFFER_MS,
  getDevAccessToken,
  getRefreshToken,
  getStoredAccessToken,
  handleAuthIssue,
  isAccessTokenExpired,
  setAuthSession,
} from "./session";
import { resolveAuthUrl, parseAuthResponse } from "./auth-fetch";

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
