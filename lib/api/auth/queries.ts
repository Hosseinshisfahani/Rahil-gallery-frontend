import { buildApiUrl } from "../config";
import { ApiError } from "../types";
import type {
  AuthErrorEnvelope,
  AuthSuccessEnvelope,
  AuthTokenPair,
  AuthUser,
  LoginInput,
} from "./types";
import {
  clearAuthSession,
  getAccessToken,
  getRefreshToken,
  handleAuthIssue,
  isAuthError,
  setAuthSession,
} from "./session";

function resolveAuthUrl(path: string): string {
  const built = buildApiUrl(path.startsWith("/") ? path : `/${path}`);
  if (built.startsWith("http")) return built;

  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  return `${origin}${built}`;
}

async function parseAuthResponse<T>(
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
    const message = errorBody?.error?.message ?? `Request failed (${response.status})`;
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

export async function refreshAccessToken(): Promise<AuthTokenPair | null> {
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
    clearAuthSession();
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

export async function getCurrentUser(): Promise<AuthUser> {
  const token = getAccessToken();
  if (!token) {
    handleAuthIssue();
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
