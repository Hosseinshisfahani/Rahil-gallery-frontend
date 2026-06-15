/**
 * API configuration
 *
 * Backend source of truth:
 *   /home/aliakbarebrahimi/Projects/rahil-gallery-server
 *   docs/admin-customers-api.md
 *   docs/customer-list-performance.md
 *
 * @see docs/api/customer-management-api.md
 * @see docs/api/technical-workflow.md
 */

const DEFAULT_API_BASE = "/api/v1";

export const BACKEND_PROJECT_PATH =
  "/home/aliakbarebrahimi/Projects/rahil-gallery-server";

export function getApiBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? DEFAULT_API_BASE
  );
}

export function buildApiUrl(path: string): string {
  const base = getApiBaseUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}
