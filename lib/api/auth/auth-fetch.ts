import { buildApiUrl } from "../config";
import { ApiError } from "../types";
import type { AuthErrorEnvelope, AuthSuccessEnvelope } from "./types";
import { handleAuthIssue, isAuthError } from "./session";

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
        "API backend not found (404). Check API_PROXY_URL matches APP_PORT (default :8081). Start Rahil-Gallery-Server: make docker-dev && make dev";
    } else if (response.status === 502 || response.status === 503) {
      message =
        "API backend unavailable. Start Rahil-Gallery-Server: make docker-dev && make dev";
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
