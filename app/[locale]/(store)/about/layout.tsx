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
      <header className="about-masthead">
        <Container className="about-masthead-inner">
          <div className="about-masthead-copy">
            <p className="about-kicker">{about.stripEyebrow}</p>
            <p className="about-display about-masthead-title">
              {about.stripTitle}
            </p>
            <p className="about-masthead-lede">{about.stripLede}</p>
          </div>
        </Container>
      </header>

      <AboutSubnav
        locale={locale}
        label={about.stripTitle}
        items={aboutNavItems.map((item) => ({
          href: item.href,
          label: getLocalizedLabel(item, locale),
        }))}
      />
      <main className="about-content flex-1">{children}</main>
      <SiteFooter locale={locale} />
    </div>
  );
}
