import { normalizeMediaUrl } from "./media-url";

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
export function signatureImageSrc(value: string | undefined | null): string | undefined {
  if (!value?.trim()) return undefined;
  return normalizeMediaUrl(value) ?? value;
}
