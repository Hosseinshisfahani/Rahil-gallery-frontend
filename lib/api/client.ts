import { buildApiUrl } from "./config";
import {
  ensureValidAccessToken,
  refreshAccessToken,
  handleAuthIssue,
  isAuthError,
} from "./auth/auth";
import { ApiError, type ApiErrorBody } from "./types";

export interface ApiRequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined | null>;
  /** Skip Bearer token (auth endpoints use lib/api/auth) */
  skipAuth?: boolean;
}

function buildUrl(path: string, params?: ApiRequestOptions["params"]): string {
  const built = buildApiUrl(path);
  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const url = new URL(
    built.startsWith("http") ? built : `${origin}${built}`,
  );

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null || value === "") continue;
      url.searchParams.set(key, String(value));
    }
  }

  if (built.startsWith("http")) {
    return url.toString();
  }

  return `${url.pathname}${url.search}`;
}

async function resolveAuthHeader(skipAuth?: boolean): Promise<Record<string, string>> {
  if (skipAuth) return {};

  const token = await ensureValidAccessToken();
  if (!token) return {};

  return { Authorization: `Bearer ${token}` };
}

async function parseErrorResponse(response: Response): Promise<ApiError> {
  let errorBody: ApiErrorBody | undefined;
  try {
    errorBody = (await response.json()) as ApiErrorBody;
  } catch {
    // non-JSON body
  }

  return new ApiError(
    errorBody?.error?.code ?? "REQUEST_FAILED",
    errorBody?.error?.message ?? `Request failed (${response.status})`,
    response.status,
  );
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
  retried = false,
): Promise<T> {
  const { body, params, headers, skipAuth, ...init } = options;
  const url = buildUrl(path, params);

  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(await resolveAuthHeader(skipAuth)),
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401 && !skipAuth && !retried) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return apiRequest<T>(path, options, true);
    }
    handleAuthIssue();
    throw new ApiError("UNAUTHORIZED", "Session expired — please sign in again", 401);
  }

  if (!response.ok) {
    const error = await parseErrorResponse(response);
    if (!skipAuth && isAuthError(error.status, error.code)) {
      handleAuthIssue();
    }
    throw error;
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}
