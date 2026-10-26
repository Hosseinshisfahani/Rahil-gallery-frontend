import { notFound } from "next/navigation";
import { getStoreCatalog } from "@/lib/i18n/store";
import { isStoreLocale } from "@/lib/locale";
import { aboutNavItems, getLocalizedLabel } from "@/lib/store-navigation";
import { AboutSubnav } from "../_components/about/about-subnav";
import { Container, SiteFooter } from "../_components/store-layout";

export default async function AboutLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isStoreLocale(locale)) notFound();

  const about = getStoreCatalog(locale).about;

  return (
    <div className="about flex min-h-full flex-1 flex-col">
      <div className="border-b border-border bg-canvas">
        <Container className="py-8 md:py-10">
          <p className="about-display text-[clamp(2rem,4vw,3rem)]">{about.stripTitle}</p>
        </Container>
      </div>
      <AboutSubnav
        locale={locale}
        label={about.stripTitle}
        items={aboutNavItems.map((item) => ({
          href: item.href,
          label: getLocalizedLabel(item, locale),
        }))}
      />
      <main className="flex-1">{children}</main>
      <SiteFooter locale={locale} />
    </div>
  );
}
