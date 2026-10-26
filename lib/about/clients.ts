import raw from "../../public/rahil-top-clients/clients.json";
import type { Locale } from "@/lib/types";

export type TopClient = {
  id: string;
  image: string;
  width: number;
  height: number;
  caption_fa: string;
  caption_en: string;
  signature_fa?: string;
  signature_en?: string;
};

/** Captions and photographs from public/rahil-top-clients. Decorative poster lines are not used. */
export const topClients = raw as TopClient[];

export function clientCaption(client: TopClient, locale: Locale) {
  if (locale === "fa") return client.caption_fa;
  return client.caption_en || client.caption_fa;
}

export function clientSignature(client: TopClient, locale: Locale) {
  if (locale === "fa" || !client.caption_en) return client.signature_fa ?? "";
  return client.signature_en ?? "";
}
