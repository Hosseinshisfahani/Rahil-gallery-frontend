import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getShowcaseCopy } from "@/lib/showcase-pages";
import { isStoreLocale } from "@/lib/locale";
import { CategoriesPage } from "../_components/showcase-pages";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isStoreLocale(locale)) return {};

  const copy = getShowcaseCopy(locale).categories;
  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
    alternates: {
      canonical: `/${locale}/categories`,
      languages: {
        "fa-IR": "/fa/categories",
        en: "/en/categories",
        "x-default": "/fa/categories",
      },
    },
  };
}

export default async function CategoriesRoute({ params }: PageProps) {
  const { locale } = await params;
  if (!isStoreLocale(locale)) notFound();

  return (
    <CategoriesPage
      locale={locale}
      copy={getShowcaseCopy(locale).categories}
    />
  );
}
