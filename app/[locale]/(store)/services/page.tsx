import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isStoreLocale } from "@/lib/locale";
import { getShowcaseCopy } from "@/lib/showcase-pages";
import { ServicesPage } from "../_components/showcase-pages";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isStoreLocale(locale)) return {};

  const copy = getShowcaseCopy(locale).services;
  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
    alternates: {
      canonical: `/${locale}/services`,
      languages: {
        "fa-IR": "/fa/services",
        en: "/en/services",
        "x-default": "/fa/services",
      },
    },
  };
}

export default async function ServicesRoute({ params }: PageProps) {
  const { locale } = await params;
  if (!isStoreLocale(locale)) notFound();

  return (
    <ServicesPage locale={locale} copy={getShowcaseCopy(locale).services} />
  );
}
