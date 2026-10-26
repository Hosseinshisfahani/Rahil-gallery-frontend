import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MissionView } from "../../_components/about/mission-view";
import { aboutMetadata } from "@/lib/about/metadata";
import { aboutPath } from "@/lib/about/pages";
import { getStoreCatalog } from "@/lib/i18n/store";
import { isStoreLocale } from "@/lib/locale";

type MissionPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: MissionPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isStoreLocale(locale)) return {};

  const mission = getStoreCatalog(locale).about.pages.mission;
  return aboutMetadata(
    locale,
    aboutPath("mission"),
    mission.metaTitle,
    mission.metaDescription,
  );
}

export default async function MissionPage({ params }: MissionPageProps) {
  const { locale } = await params;
  if (!isStoreLocale(locale)) notFound();

  return <MissionView locale={locale} about={getStoreCatalog(locale).about} />;
}
