import Image from "next/image";
import { aboutPath, nextAboutSlug } from "@/lib/about/pages";
import type { StoreMessages } from "@/lib/i18n/store";
import { localePath } from "@/lib/store-navigation";
import type { Locale } from "@/lib/types";
import { AboutNextLink } from "./about-blocks";
import { Container } from "../store-layout";

const missionMark = "/about/mission-mark.webp";

/** Shift toward the side rail so the column sits on the window center. */
const missionShift =
  "lg:ltr:-translate-x-[4.75rem] lg:rtl:translate-x-[4.75rem] min-[90rem]:ltr:-translate-x-[5.5rem] min-[90rem]:rtl:translate-x-[5.5rem]";

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

      <figure className={`about-media about-media-frame relative mx-auto mt-8 aspect-[5/4] w-full max-w-3xl ${missionShift}`}>
        <Image
          src={missionMark}
          alt={mission.imageAlt}
          fill
          priority
          sizes="(min-width: 64rem) 64rem, 100vw"
          className="about-media-image object-cover object-center"
        />
      </figure>

      <Container className={`py-16 text-center md:py-20 ${missionShift}`}>
        <h2 className="about-display text-[clamp(1.8rem,3vw,2.6rem)]">
          {mission.statementLabel}
        </h2>
        <div className="mx-auto mt-8 max-w-3xl space-y-6 text-base leading-relaxed text-ink-muted md:text-lg">
          {mission.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </Container>

      <section
        id="values"
        className="scroll-mt-[calc(var(--header-height)+var(--header-nav-height)+4rem)]"
      >
        <Container className={`pb-8 text-center ${missionShift}`}>
          <h2 className="about-display text-[clamp(1.8rem,3vw,2.6rem)]">
            {mission.valuesLabel}
          </h2>
          <div className="mx-auto mt-10 max-w-3xl">
            <ol className="about-values">
              {mission.values.map((value) => (
                <li key={value}>{value}</li>
              ))}
            </ol>
          </div>
          <p className="mx-auto mt-12 max-w-3xl text-base leading-relaxed text-ink md:text-lg">
            {mission.closing}
          </p>
        </Container>
      </section>

      <Container className={`py-16 text-center md:py-24 ${missionShift}`}>
        <AboutNextLink
          href={localePath(locale, aboutPath(next))}
          kicker={about.continueLabel}
          title={about.pages[next].title}
        />
      </Container>
    </>
  );
}
