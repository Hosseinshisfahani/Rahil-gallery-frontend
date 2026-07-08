import { ApiError } from "../types";
import type { AuthTokenPair, AuthUser, LoginInput } from "./types";
import { parseAuthResponse, resolveAuthUrl } from "./auth-fetch";
import { ensureValidAccessToken } from "./refresh-coordinator";
import {
  clearAuthSession,
  getRefreshToken,
  setAuthSession,
} from "./session";

export { refreshAccessToken, ensureValidAccessToken } from "./refresh-coordinator";

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
