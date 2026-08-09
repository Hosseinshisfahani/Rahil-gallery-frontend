/**
 * Media URL helpers — same-origin `/static/...` paths and signature image checks.
 */

/**
 * Converts backend absolute static URLs to same-origin paths (`/static/...`)
 * proxied in next.config. Used by API response mappers — not UI components.
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

const IMAGE_SIGNATURE_PATTERN =
  /^(\/static\/|https?:\/\/).*\.(png|jpe?g|webp)(\?.*)?$/i;

/** True when the stored signature value is an uploaded image URL/path. */
export function isSignatureImage(value: string | undefined | null): boolean {
  if (!value?.trim()) return false;
  const normalized = normalizeMediaUrl(value) ?? value;
  if (normalized.startsWith("/static/customer-signatures/")) return true;
  return IMAGE_SIGNATURE_PATTERN.test(normalized);
}

/** Resolves a signature value for use in img src (same-origin /static paths). */
export function signatureImageSrc(
  value: string | undefined | null,
): string | undefined {
  if (!value?.trim()) return undefined;
  return normalizeMediaUrl(value) ?? value;
}
