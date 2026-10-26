import Image from "next/image";
import { aboutPath, aboutRelated, nextAboutSlug } from "@/lib/about/pages";
import type { StoreMessages } from "@/lib/i18n/store";
import { localePath } from "@/lib/store-navigation";
import type { Locale } from "@/lib/types";
import { cn } from "@/lib/utils";
import { AboutInlineLink, AboutNextLink, RelatedLinks } from "./about-blocks";
import { Container } from "../store-layout";

/** Portraits in the same order as the people copy. Circle hides the formal portrait’s white corners. */
const portraits = [
  { src: "/about/founder-gallery.jpg", shape: "circle" },
  { src: "/about/founder-bazaar.jpg", shape: "portrait" },
] as const;

export function FoundersView({
  locale,
  about,
}: {
  locale: Locale;
  about: StoreMessages["about"];
}) {
  const founders = about.pages.founders;
  const { opening } = founders;
  const next = nextAboutSlug("founders");

  return (
    <>
      <Container className="pt-14 md:pt-20">
        <p className="about-kicker">{founders.title}</p>
        <h1 className="about-display mt-4 max-w-3xl text-[clamp(2.6rem,6vw,4.5rem)]">
          {founders.headline}
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-muted md:text-lg">
          {founders.subtitle}
        </p>
        <div className="mt-10 max-w-3xl space-y-6 text-base leading-relaxed text-ink-muted md:text-lg">
          <p>
            {opening.beforeFounder}<AboutInlineLink href={localePath(locale, "/about/history")}>{opening.founderName}</AboutInlineLink>{opening.afterFounder}
          </p>
          <p>
            {opening.beforeValues}<AboutInlineLink href={localePath(locale, "/about/mission")}>{opening.valuesLink}</AboutInlineLink>{opening.afterValues}
          </p>
        </div>
      </Container>

      <Container className="py-16 md:py-24">
        <ol className="flex flex-col gap-20 md:gap-28">
          {founders.people.map((person, index) => {
            const portrait = portraits[index];
            const flip = index % 2 === 1;
            return (
              <li
                key={person.name}
                className="grid items-center gap-10 md:grid-cols-2 md:gap-16"
              >
                <figure
                  className={cn(
                    "relative mx-auto w-full max-w-[26rem] bg-surface-elevated",
                    portrait?.shape === "circle"
                      ? "aspect-square overflow-hidden rounded-full"
                      : "aspect-[2/3]",
                    flip && "md:order-2",
                  )}
                >
                  {portrait ? (
                    <Image
                      src={portrait.src}
                      alt={person.imageAlt}
                      fill
                      sizes="(min-width: 48rem) 26rem, 100vw"
                      className={
                        portrait.shape === "circle"
                          ? "scale-[1.04] object-cover"
                          : "object-cover"
                      }
                    />
                  ) : null}
                </figure>
                <div className={cn(flip && "md:order-1")}>
                  <p className="about-kicker">{person.role}</p>
                  <h2 className="about-display mt-3 text-[clamp(2rem,4vw,3rem)]">
                    {person.name}
                  </h2>
                  <div className="mt-6 space-y-6">
                    {person.paragraphs.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="text-base leading-relaxed text-ink-muted md:text-lg"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </Container>

      <Container className="pb-20 md:pb-28">
        <AboutNextLink
          href={localePath(locale, aboutPath(next))}
          kicker={about.continueLabel}
          title={about.pages[next].title}
        />
        <RelatedLinks
          label={about.relatedLabel}
          links={aboutRelated.founders.map((related) => ({
            href: localePath(locale, aboutPath(related)),
            title: about.pages[related].title,
          }))}
        />
      </Container>
    </>
  );
}
