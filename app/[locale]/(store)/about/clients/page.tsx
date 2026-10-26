import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClientsView } from "../../_components/about/clients-view";
import { aboutMetadata } from "@/lib/about/metadata";
import { aboutPath } from "@/lib/about/pages";
import { getStoreCatalog } from "@/lib/i18n/store";
import { isStoreLocale } from "@/lib/locale";

type ClientsPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: ClientsPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isStoreLocale(locale)) return {};

  const clients = getStoreCatalog(locale).about.pages.clients;
  return aboutMetadata(
    locale,
    aboutPath("clients"),
    clients.metaTitle,
    clients.metaDescription,
  );
}

export default async function ClientsPage({ params }: ClientsPageProps) {
  const { locale } = await params;
  if (!isStoreLocale(locale)) notFound();

  return <ClientsView locale={locale} about={getStoreCatalog(locale).about} />;
}
