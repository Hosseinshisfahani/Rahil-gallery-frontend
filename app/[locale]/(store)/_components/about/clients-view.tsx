import Image from "next/image";
import { clientCaption, clientSignature, topClients } from "@/lib/about/clients";
import { aboutPath, aboutRelated, nextAboutSlug } from "@/lib/about/pages";
import type { StoreMessages } from "@/lib/i18n/store";
import { localePath } from "@/lib/store-navigation";
import type { Locale } from "@/lib/types";
import { cn } from "@/lib/utils";
import { AboutNextLink, RelatedLinks } from "./about-blocks";
import { Container } from "../store-layout";

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
      <Container className="pt-14 md:pt-20">
        <h1 className="about-display max-w-3xl text-[clamp(2.6rem,6vw,4.5rem)]">
          {clients.title}
        </h1>
      </Container>

      <Container className="py-16 md:py-24">
        <ol className="flex flex-col gap-20 md:gap-28">
          {topClients.map((client, index) => {
            const caption = clientCaption(client, locale);
            const signature = clientSignature(client, locale);
            const { title, paragraphs } = captionParts(caption);
            const sourceFa = locale === "en" && !client.caption_en && Boolean(caption);
            const alt = title.split("\n")[0]?.trim() || clients.collageAlt;
            const flip = index % 2 === 1;

            return (
              <li
                key={client.id}
                className={cn(
                  "grid items-start gap-8",
                  title && "md:grid-cols-2 md:gap-16",
                )}
              >
                <figure className={cn("bg-surface-elevated", flip && title && "md:order-2")}>
                  <Image
                    src={`/rahil-top-clients/${client.image}`}
                    alt={alt}
                    width={client.width}
                    height={client.height}
                    priority={index === 0}
                    sizes="(min-width: 48rem) 40rem, 100vw"
                    className="h-auto w-full"
                  />
                </figure>
                {title ? (
                  <div
                    className={cn(flip && "md:order-1", sourceFa && "about-caption-fa")}
                    dir={sourceFa ? "rtl" : undefined}
                    lang={sourceFa ? "fa" : undefined}
                  >
                    <h2 className="about-display whitespace-pre-line text-[clamp(1.6rem,3vw,2.4rem)]">
                      {title}
                    </h2>
                    {paragraphs.length > 0 ? (
                      <div className="mt-6 space-y-5 text-base leading-relaxed text-ink-muted md:text-lg">
                        {paragraphs.map((paragraph) => (
                          <p key={paragraph} className="whitespace-pre-line">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    ) : null}
                    {signature ? (
                      <p className="mt-8 whitespace-pre-line text-sm leading-relaxed text-ink">
                        {signature}
                      </p>
                    ) : null}
                  </div>
                ) : null}
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
          links={aboutRelated.clients.map((related) => ({
            href: localePath(locale, aboutPath(related)),
            title: about.pages[related].title,
          }))}
        />
      </Container>
    </>
  );
}
