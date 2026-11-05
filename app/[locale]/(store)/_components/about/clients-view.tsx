import Image from "next/image";
import { clientCaption, clientSignature, topClients } from "@/lib/about/clients";
import { aboutPath, nextAboutSlug } from "@/lib/about/pages";
import type { StoreMessages } from "@/lib/i18n/store";
import { localePath } from "@/lib/store-navigation";
import type { Locale } from "@/lib/types";
import { cn } from "@/lib/utils";
import { AboutHero, AboutNextLink } from "./about-blocks";
import { Container } from "../store-layout";

/** Match the window-centered “About us” title, which sits outside the side-rail padding. */
const titleShift =
  "lg:ltr:-translate-x-[4.75rem] lg:rtl:translate-x-[4.75rem] min-[90rem]:ltr:-translate-x-[5.5rem] min-[90rem]:rtl:translate-x-[5.5rem]";

const ambassadorPhotos = [
  "/rahil-top-clients/images/16-india-ceremony.webp",
  "/rahil-top-clients/images/16-india-gift.webp",
] as const;

function captionParts(caption: string) {
  const blocks = caption
    .split(/\n\n+/)
    .map((block) => block.trim())
    .filter(Boolean);
  return { title: blocks[0] ?? "", paragraphs: blocks.slice(1) };
}

export function ClientsView({
  locale,
  about,
}: {
  locale: Locale;
  about: StoreMessages["about"];
}) {
  const clients = about.pages.clients;
  const next = nextAboutSlug("clients");

  return (
    <>
      <AboutHero
        className={titleShift}
        kicker={clients.title}
        title={clients.headline}
        lede={clients.subtitle}
      />

      <Container className={cn("py-16 md:py-24", titleShift)}>
        <div className="mx-auto max-w-3xl space-y-7 text-center text-base leading-relaxed text-ink-muted md:space-y-8 md:text-lg">
          {clients.intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </Container>

      <Container className="pb-16 md:pb-24">
        <ol className="about-timeline">
          {topClients
            .filter((client) => client.id !== "17-india-collage")
            .map((client, index) => {
            const caption = clientCaption(client, locale);
            const signature = clientSignature(client, locale);
            const { title, paragraphs } = captionParts(caption);
            const sourceFa =
              locale === "en" && !client.caption_en && Boolean(caption);
            const alt = title.split("\n")[0]?.trim() || clients.collageAlt;
            const imageOnLeft = index % 2 === 0;
            const imageOnStart = locale === "fa" ? !imageOnLeft : imageOnLeft;
            const flip = !imageOnStart;
            const ambassador = client.id === "16-india-ambassador";

            return (
              <li key={client.id}>
                <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12 lg:gap-20">
                  <div className={cn("flex flex-col gap-4", flip && "md:order-2")}>
                    <figure
                      className="about-media about-media-frame relative w-full overflow-hidden bg-surface-elevated"
                      style={{ aspectRatio: `${client.width} / ${client.height}` }}
                    >
                      <Image
                        src={`/rahil-top-clients/${client.image}`}
                        alt={alt}
                        fill
                        priority={index === 0}
                        sizes="(min-width: 48rem) 40vw, 100vw"
                        className="about-media-image object-contain"
                      />
                    </figure>
                    {ambassador ? (
                      <div className="grid grid-cols-2 gap-4">
                        {ambassadorPhotos.map((src) => (
                          <figure
                            key={src}
                            className="about-media about-media-frame relative aspect-[4/5] w-full overflow-hidden bg-surface-elevated"
                          >
                            <Image
                              src={src}
                              alt=""
                              fill
                              sizes="(min-width: 48rem) 20vw, 50vw"
                              className="about-media-image object-cover object-center"
                            />
                          </figure>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  <div
                    className={cn(
                      "flex flex-col justify-center space-y-7 py-2 md:space-y-8 md:py-6",
                      flip && "md:order-1",
                      sourceFa && "about-caption-fa",
                    )}
                    dir={sourceFa ? "rtl" : undefined}
                    lang={sourceFa ? "fa" : undefined}
                  >
                    {title ? (
                      <h2 className="about-display whitespace-pre-line text-[clamp(1.8rem,3vw,2.6rem)]">
                        {title}
                      </h2>
                    ) : null}
                    {paragraphs.length > 0 ? (
                      <div className="space-y-5 text-base leading-relaxed text-ink-muted md:text-lg">
                        {paragraphs.map((paragraph) => (
                          <p key={paragraph} className="whitespace-pre-line">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    ) : null}
                    {signature ? (
                      <p className="whitespace-pre-line text-sm leading-relaxed text-ink">
                        {signature}
                      </p>
                    ) : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </Container>

      <section className="about-next-band">
        <Container className={cn("py-8 md:py-10", titleShift)}>
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
