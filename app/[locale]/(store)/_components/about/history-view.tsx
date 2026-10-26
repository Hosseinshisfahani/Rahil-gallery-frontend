import Image from "next/image";
import { aboutPath, aboutRelated, nextAboutSlug } from "@/lib/about/pages";
import type { StoreMessages } from "@/lib/i18n/store";
import { localePath } from "@/lib/store-navigation";
import type { Locale } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  AboutHero,
  AboutInlineLink,
  AboutNextLink,
  PullQuote,
  RelatedLinks,
} from "./about-blocks";
import { Container } from "../store-layout";

const historyHero = "/landing/internal-collection.png";

/** Pictures supplied for this page, in chapter order. Null means no related picture yet. */
const chapterImages = [
  { src: "/landing/rahil-gallery-front.jpg", fit: "cover" },
  null,
  { src: "/landing/logo.jpg", fit: "contain" },
  { src: "/landing/Layer%2010.jpg", fit: "cover" },
  { src: "/landing/Layer%207.jpg", fit: "cover" },
  null,
  { src: "/landing/rahil-gallery-hero.jpg", fit: "cover" },
] as const;

export function HistoryView({
  locale,
  about,
}: {
  locale: Locale;
  about: StoreMessages["about"];
}) {
  const history = about.pages.history;
  const { opening } = history;
  const next = nextAboutSlug("history");

  return (
    <>
      <AboutHero
        src={historyHero}
        alt={history.heroAlt}
        kicker={history.title}
        title={history.headline}
        lede={history.subtitle}
        wide
      />

      <Container className="py-16 md:py-20">
        <div className="max-w-3xl space-y-6 text-base leading-relaxed text-ink-muted md:text-lg">
          <p>
            {opening.beforeFounder}<AboutInlineLink href={localePath(locale, "/about/founders")}>{opening.founderName}</AboutInlineLink>{opening.afterFounder}
          </p>
          <p>{opening.grew}</p>
          <p>
            {opening.beforeValues}<AboutInlineLink href={localePath(locale, "/about/mission#values")}>{opening.valuesLink}</AboutInlineLink>{opening.afterValues}
          </p>
        </div>
      </Container>

      <Container className="pb-8">
        <ol className="about-timeline">
          {history.chapters.map((chapter, index) => {
            const image = chapterImages[index];
            const flip = index === chapterImages.length - 1;
            return (
              <li key={chapter.heading}>
                <h2 className="about-display text-[clamp(1.8rem,3vw,2.6rem)]">
                  {chapter.heading}
                </h2>
                <div
                  className={cn(
                    "mt-8",
                    image && "grid items-start gap-10 md:grid-cols-2 md:gap-16",
                  )}
                >
                  {image ? (
                    <figure
                      className={cn(
                        "relative bg-surface-elevated",
                        image.fit === "contain" ? "aspect-square" : "aspect-[4/3]",
                        flip && "md:order-2",
                      )}
                    >
                      <Image
                        src={image.src}
                        alt={chapter.imageAlt}
                        fill
                        sizes="(min-width: 48rem) 40vw, 100vw"
                        className={
                          image.fit === "contain" ? "object-contain p-8" : "object-cover"
                        }
                      />
                    </figure>
                  ) : null}
                  <div className={cn(flip && image && "md:order-1", "space-y-6")}>
                    {chapter.paragraphs[0] ? (
                      <p className="text-base leading-relaxed text-ink-muted md:text-lg">
                        {chapter.paragraphs[0]}
                      </p>
                    ) : null}
                    {chapter.quote ? <PullQuote quote={chapter.quote} /> : null}
                    {chapter.statements.length > 0 ? (
                      <ul className="flex flex-col gap-3">
                        {chapter.statements.map((line) => (
                          <li
                            key={line}
                            className="text-base leading-relaxed text-ink md:text-lg"
                          >
                            {line}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    {chapter.paragraphs.slice(1).map((paragraph) => (
                      <p
                        key={paragraph}
                        className="text-base leading-relaxed text-ink-muted md:text-lg"
                      >
                        {paragraph}
                      </p>
                    ))}
                    {chapter.closing.length > 0 ? (
                      <div className="space-y-3 pt-4">
                        {chapter.closing.map((line, lineIndex) => (
                          <p
                            key={line}
                            className={
                              lineIndex === 0
                                ? "about-display text-[clamp(1.7rem,3vw,2.4rem)]"
                                : "text-base leading-relaxed text-ink md:text-lg"
                            }
                          >
                            {line}
                          </p>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </Container>

      <Container className="py-16 md:py-24">
        <AboutNextLink
          href={localePath(locale, aboutPath(next))}
          kicker={about.continueLabel}
          title={about.pages[next].title}
        />
        <RelatedLinks
          label={about.relatedLabel}
          links={aboutRelated.history.map((related) => ({
            href: localePath(locale, aboutPath(related)),
            title: about.pages[related].title,
          }))}
        />
      </Container>
    </>
  );
}
