import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FoundersView } from "../../_components/about/founders-view";
import { aboutMetadata } from "@/lib/about/metadata";
import { aboutPath } from "@/lib/about/pages";
import { getStoreCatalog } from "@/lib/i18n/store";
import { isStoreLocale } from "@/lib/locale";

type FoundersPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: FoundersPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isStoreLocale(locale)) return {};

  const founders = getStoreCatalog(locale).about.pages.founders;
  return aboutMetadata(
    locale,
    aboutPath("founders"),
    founders.metaTitle,
    founders.metaDescription,
  );
}

export default async function FoundersPage({ params }: FoundersPageProps) {
  const { locale } = await params;
  if (!isStoreLocale(locale)) notFound();

  return <FoundersView locale={locale} about={getStoreCatalog(locale).about} />;
}
