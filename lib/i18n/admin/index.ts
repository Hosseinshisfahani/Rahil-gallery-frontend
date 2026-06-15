import type { AdminLocale } from "@/lib/admin-locale";
import { adminMessagesEn } from "./messages/en";
import { adminMessagesFa } from "./messages/fa";

type MessageTree = { readonly [key: string]: string | MessageTree };

const catalogs: Record<AdminLocale, MessageTree> = {
  en: adminMessagesEn,
  fa: adminMessagesFa,
};

type MessageValue = string | MessageTree;

function getNested(obj: MessageValue, path: string[]): string | undefined {
  let current: MessageValue | undefined = obj;
  for (const key of path) {
    if (current == null || typeof current !== "object") return undefined;
    current = current[key];
  }
  return typeof current === "string" ? current : undefined;
}

export function getAdminMessage(
  locale: AdminLocale,
  key: string,
  vars?: Record<string, string | number>,
): string {
  const path = key.split(".");
  const raw =
    getNested(catalogs[locale], path) ?? getNested(catalogs.en, path) ?? key;

  if (!vars) return raw;

  return Object.entries(vars).reduce(
    (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
    raw,
  );
}

export { adminMessagesEn, adminMessagesFa };
export type AdminMessages = typeof adminMessagesEn;
