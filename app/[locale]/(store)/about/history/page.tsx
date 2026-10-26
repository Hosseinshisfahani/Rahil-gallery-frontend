import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HistoryView } from "../../_components/about/history-view";
import { aboutMetadata } from "@/lib/about/metadata";
import { aboutPath } from "@/lib/about/pages";
import { getStoreCatalog } from "@/lib/i18n/store";
import { isStoreLocale } from "@/lib/locale";

type HistoryPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: HistoryPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isStoreLocale(locale)) return {};

  const history = getStoreCatalog(locale).about.pages.history;
  return aboutMetadata(
    locale,
    aboutPath("history"),
    history.metaTitle,
    history.metaDescription,
  );
}

export default async function HistoryPage({ params }: HistoryPageProps) {
  const { locale } = await params;
  if (!isStoreLocale(locale)) notFound();

  return <HistoryView locale={locale} about={getStoreCatalog(locale).about} />;
}
