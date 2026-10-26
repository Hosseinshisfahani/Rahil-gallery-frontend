import { aboutPath, aboutRelated, nextAboutSlug, type AboutSlug } from "@/lib/about/pages";
import { getStoreCatalog } from "@/lib/i18n/store";
import { localePath } from "@/lib/store-navigation";
import type { Locale } from "@/lib/types";
import { AboutNextLink, RelatedLinks } from "./about-blocks";
import { Container } from "../store-layout";

export function AboutShellPage({
  locale,
  slug,
}: {
  locale: Locale;
  slug: AboutSlug;
}) {
  const about = getStoreCatalog(locale).about;
  const page = about.pages[slug];
  const next = nextAboutSlug(slug);

  return (
    <>
      <Container className="py-16 md:py-20">
        <h1 className="about-display text-[clamp(2.4rem,5vw,3.5rem)]">{page.title}</h1>
        <p className="mt-6 max-w-xl text-ink-muted">{about.pending}</p>
      </Container>
      <Container className="pb-20 md:pb-28">
        <AboutNextLink
          href={localePath(locale, aboutPath(next))}
          kicker={about.continueLabel}
          title={about.pages[next].title}
        />
        <RelatedLinks
          label={about.relatedLabel}
          links={aboutRelated[slug].map((related) => ({
            href: localePath(locale, aboutPath(related)),
            title: about.pages[related].title,
          }))}
        />
      </Container>
    </>
  );
}
