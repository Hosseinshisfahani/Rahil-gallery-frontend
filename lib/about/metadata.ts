import type { Metadata } from "next";
import type { Locale } from "@/lib/types";

export function aboutMetadata(
  locale: Locale,
  path: string,
  title: string,
  description: string,
): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}${path}`,
      languages: {
        "fa-IR": `/fa${path}`,
        en: `/en${path}`,
        "x-default": `/fa${path}`,
      },
    },
    openGraph: {
      title,
      description,
      locale: locale === "fa" ? "fa_IR" : "en_US",
      url: `/${locale}${path}`,
    },
  };
}
