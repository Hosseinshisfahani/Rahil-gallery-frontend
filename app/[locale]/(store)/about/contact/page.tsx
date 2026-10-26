import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContactView } from "../../_components/about/contact-view";
import { aboutMetadata } from "@/lib/about/metadata";
import { aboutPath } from "@/lib/about/pages";
import { getStoreCatalog } from "@/lib/i18n/store";
import { isStoreLocale } from "@/lib/locale";

type ContactPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isStoreLocale(locale)) return {};

  const contact = getStoreCatalog(locale).about.pages.contact;
  return aboutMetadata(
    locale,
    aboutPath("contact"),
    contact.metaTitle,
    contact.metaDescription,
  );
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  if (!isStoreLocale(locale)) notFound();

  return <ContactView locale={locale} about={getStoreCatalog(locale).about} />;
}
