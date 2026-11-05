import Image from "next/image";
import { aboutPath, nextAboutSlug } from "@/lib/about/pages";
import type { StoreMessages } from "@/lib/i18n/store";
import { localePath } from "@/lib/store-navigation";
import type { Locale } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  AboutHero,
  AboutInlineLink,
  AboutNextLink,
  PullQuote,
} from "./about-blocks";
import { Container } from "../store-layout";

const historyHero = "/landing/internal-collection.png";

/** Temporary chapter pictures — replace with final assets later. */
const chapterImages = [
  { src: "/landing/rahil-gallery-front.jpg", fit: "cover" as const },
  { src: "/landing/journal-blue-pendant.webp", fit: "cover" as const },
  { src: "/landing/logo.jpg", fit: "contain" as const },
  { src: "/landing/journal-turquoise-crown.webp", fit: "cover" as const },
  { src: "/landing/Layer%207.jpg", fit: "cover" as const },
  { src: "/rahil-top-clients/images/16-india-ambassador.webp", fit: "cover" as const },
  { src: "/landing/rahil-gallery-hero.jpg", fit: "cover" as const },
];

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

      <Container className="py-16 md:py-24">
        <div className="mx-auto max-w-3xl space-y-7 text-center text-base leading-relaxed text-ink-muted md:space-y-8 md:text-lg">
          <p>
            {opening.beforeFounder}<AboutInlineLink href={localePath(locale, "/about/founders")}>{opening.founderName}</AboutInlineLink>{opening.afterFounder}
          </p>
          <p>{opening.grew}</p>
          <p>
            {opening.beforeValues}<AboutInlineLink href={localePath(locale, "/about/mission#values")}>{opening.valuesLink}</AboutInlineLink>{opening.afterValues}
          </p>
        </div>
      </Container>

      <Container className="pb-16 md:pb-24">
        <ol className="about-timeline">
          {history.chapters.map((chapter, index) => {
            const image = chapterImages[index];
            // 1-based odd → left, even → right (both FA and EN)
            const imageOnLeft = index % 2 === 0;
            const imageOnStart = locale === "fa" ? !imageOnLeft : imageOnLeft;
            const flip = Boolean(image) && !imageOnStart;
            return (
              <li key={chapter.heading}>
                {!image ? (
                  <h2 className="about-display text-[clamp(1.8rem,3vw,2.6rem)]">
                    {chapter.heading}
                  </h2>
                ) : null}
                <div
                  className={cn(
                    image
                      ? "grid items-center gap-8 md:grid-cols-2 md:gap-12 lg:gap-20"
                      : "mt-10",
                  )}
                >
                  {image ? (
                    <figure
                      className={cn(
                        "about-media about-media-frame relative w-full bg-surface-elevated",
                        image.fit === "contain" ? "aspect-square" : "aspect-[4/3]",
                        flip && "md:order-2",
                      )}
                    >
                      <Image
                        src={image.src}
                        alt={chapter.imageAlt}
                        fill
                        sizes="(min-width: 48rem) 40vw, 100vw"
                        className={cn(
                          "about-media-image",
                          image.fit === "contain"
                            ? "object-contain p-8"
                            : "object-cover",
                        )}
                      />
                    </figure>
                  ) : null}
                  <div
                    className={cn(
                      "space-y-7 md:space-y-8",
                      flip && image && "md:order-1",
                      image && "flex flex-col justify-center py-2 md:py-6",
                    )}
                  >
                    {image ? (
                      <h2 className="about-display text-[clamp(1.8rem,3vw,2.6rem)]">
                        {chapter.heading}
                      </h2>
                    ) : null}
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
                  </div>
                </div>

                {chapter.closing.length > 0 ? (
                  <aside className="about-manifesto" aria-label={chapter.closing[0]}>
                    <div className="about-manifesto-inner">
                      <p className="about-manifesto-title">{chapter.closing[0]}</p>
                      <span className="about-manifesto-rule" aria-hidden="true" />
                      <ul className="about-manifesto-lines">
                        {chapter.closing.slice(1).map((line) => (
                          <li key={line}>{line}</li>
                        ))}
                      </ul>
                    </div>
                  </aside>
                ) : null}
              </li>
            );
          })}
        </ol>
      </Container>

      <section className="about-next-band">
        <Container className="py-8 md:py-10">
          <AboutNextLink
            href={localePath(locale, aboutPath(next))}
            kicker={about.continueLabel}
            title={about.pages[next].title}
          />
        </Container>
      </section>
    </>
  );
}
