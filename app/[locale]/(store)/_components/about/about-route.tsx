import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { aboutMetadata } from "@/lib/about/metadata";
import { aboutPath, type AboutSlug } from "@/lib/about/pages";
import { getStoreCatalog } from "@/lib/i18n/store";
import { isStoreLocale } from "@/lib/locale";
import { AboutShellPage } from "./about-shell";

type AboutPageProps = {
  params: Promise<{ locale: string }>;
};

export function aboutPageMetadata(slug: AboutSlug) {
  return async function generateMetadata({
    params,
  }: AboutPageProps): Promise<Metadata> {
    const { locale } = await params;
    if (!isStoreLocale(locale)) return {};

    const about = getStoreCatalog(locale).about;
    return aboutMetadata(
      locale,
      aboutPath(slug),
      about.pages[slug].metaTitle,
      about.pending,
    );
  };
}

export function aboutPage(slug: AboutSlug) {
  return async function AboutPage({ params }: AboutPageProps) {
    const { locale } = await params;
    if (!isStoreLocale(locale)) notFound();
    return <AboutShellPage locale={locale} slug={slug} />;
  };
}
