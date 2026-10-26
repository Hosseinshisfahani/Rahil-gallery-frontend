import type { Locale } from "@/lib/types";
import { storeMessagesEn, type StoreMessages } from "./messages/en";
import { storeMessagesFa } from "./messages/fa";

type MessageTree = {
  readonly [key: string]:
    | string
    | readonly string[]
    | readonly MessageTree[]
    | MessageTree;
};
type MessageValue =
  | string
  | readonly string[]
  | readonly MessageTree[]
  | MessageTree;

const catalogs: Record<Locale, StoreMessages> = {
  en: storeMessagesEn,
  fa: storeMessagesFa,
};

function getNested(obj: MessageValue, path: string[]): string | undefined {
  let current: MessageValue | undefined = obj;
  for (const key of path) {
    if (current == null || typeof current !== "object" || Array.isArray(current)) {
      return undefined;
    }
    current = (current as MessageTree)[key];
  }
  return typeof current === "string" ? current : undefined;
}

export function getStoreCatalog(locale: Locale): StoreMessages {
  return catalogs[locale];
}

export function getStoreMessage(
  locale: Locale,
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

export { storeMessagesEn, storeMessagesFa };
export type { StoreMessages };
