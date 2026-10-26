import Image from "next/image";
import { aboutPath, aboutRelated, nextAboutSlug } from "@/lib/about/pages";
import type { StoreMessages } from "@/lib/i18n/store";
import { localePath } from "@/lib/store-navigation";
import type { Locale } from "@/lib/types";
import { AboutNextLink, RelatedLinks } from "./about-blocks";
import { Container } from "../store-layout";

const missionMark = "/about/mission-mark.webp";

export function MissionView({
  locale,
  about,
}: {
  locale: Locale;
  about: StoreMessages["about"];
}) {
  const mission = about.pages.mission;
  const next = nextAboutSlug("mission");

  return (
    <>

      <figure className="relative mx-auto mt-8 aspect-[5/4] w-full max-w-3xl">
        <Image
          src={missionMark}
          alt={mission.imageAlt}
          fill
          priority
          sizes="(min-width: 64rem) 64rem, 100vw"
          className="object-cover object-center"
        />
      </figure>

      <Container className="py-16 md:py-20">
        <h2 className="about-display text-[clamp(1.8rem,3vw,2.6rem)]">
          {mission.statementLabel}
        </h2>
        <div className="mt-8 max-w-3xl space-y-6 text-base leading-relaxed text-ink-muted md:text-lg">
          {mission.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </Container>

      <section
        id="values"
        className="scroll-mt-[calc(var(--header-height)+var(--header-nav-height)+4rem)]"
      >
        <Container className="pb-8">
          <h2 className="about-display text-[clamp(1.8rem,3vw,2.6rem)]">
            {mission.valuesLabel}
          </h2>
          <ol className="about-values mt-10 max-w-3xl">
            {mission.values.map((value) => (
              <li key={value}>{value}</li>
            ))}
          </ol>
          <p className="mt-12 max-w-3xl text-base leading-relaxed text-ink md:text-lg">
            {mission.closing}
          </p>
        </Container>
      </section>

      <Container className="py-16 md:py-24">
        <AboutNextLink
          href={localePath(locale, aboutPath(next))}
          kicker={about.continueLabel}
          title={about.pages[next].title}
        />
        <RelatedLinks
          label={about.relatedLabel}
          links={aboutRelated.mission.map((related) => ({
            href: localePath(locale, aboutPath(related)),
            title: about.pages[related].title,
          }))}
        />
      </Container>
    </>
  );
}
