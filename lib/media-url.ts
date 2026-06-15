/**
 * Converts backend absolute static URLs to same-origin paths (`/static/...`)
 * proxied in next.config. Used by API response mappers — not UI components.
 *
 * @see lib/api/products/map.ts
 */
export function normalizeMediaUrl(
  url: string | undefined | null,
): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("/")) return url;

  try {
    const parsed = new URL(url);
    if (parsed.pathname.startsWith("/static/")) {
      return `${parsed.pathname}${parsed.search}`;
    }
    return url;
  } catch {
    return url;
  }
}
