import { ApiError } from "@/lib/api/types";

type Translator = (key: string, vars?: Record<string, string | number>) => string;

/**
 * Maps customer create/update API errors to friendly, localized messages.
 * Known conflict codes (duplicate phone/email) get specific text; anything
 * else falls back to the provided key.
 */
export function customerMutationErrorMessage(
  err: unknown,
  t: Translator,
  fallbackKey: string,
): string {
  if (err instanceof ApiError) {
    switch (err.code) {
      case "PHONE_EXISTS":
        return t("customers.modals.errors.phoneExists");
      case "EMAIL_EXISTS":
        return t("customers.modals.errors.emailExists");
      case "VALIDATION_ERROR":
        return t("customers.modals.errors.validation");
      default:
        return t(fallbackKey);
    }
  }
  if (err instanceof Error && err.message) {
    return err.message;
  }
  return t(fallbackKey);
}
