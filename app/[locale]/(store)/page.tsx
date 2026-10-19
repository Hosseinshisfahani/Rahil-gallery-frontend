import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStoreCatalog, getStoreMessage } from "@/lib/i18n/store";
import { isStoreLocale } from "@/lib/locale";
import { Landing } from "./_components/landing";

type StorePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: StorePageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isStoreLocale(locale)) return {};

  const title = getStoreMessage(locale, "meta.title");
  const description = getStoreMessage(locale, "meta.description");

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        "fa-IR": "/fa",
        en: "/en",
        "x-default": "/fa",
      },
    },
    openGraph: {
      title,
      description,
      locale: locale === "fa" ? "fa_IR" : "en_US",
      url: `/${locale}`,
    },
  };
}

export default async function HomePage({ params }: StorePageProps) {
  const { locale } = await params;
  if (!isStoreLocale(locale)) notFound();

  return (
    <main className="flex-1">
      <Landing locale={locale} copy={getStoreCatalog(locale).landing} />
    </main>
  );
}
