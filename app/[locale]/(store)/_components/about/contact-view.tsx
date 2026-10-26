import Image from "next/image";
import { aboutPath, aboutRelated, nextAboutSlug } from "@/lib/about/pages";
import type { StoreMessages } from "@/lib/i18n/store";
import { localePath } from "@/lib/store-navigation";
import type { Locale } from "@/lib/types";
import { AboutNextLink, RelatedLinks } from "./about-blocks";
import { ContactForm } from "./contact-form";
import { Container } from "../store-layout";

/** Example pin on Naqsh-e Jahan Square, until the exact gallery door is supplied. */
const mapEmbed =
  "https://www.openstreetmap.org/export/embed.html?bbox=51.6728%2C32.6548%2C51.6822%2C32.6602&layer=mapnik&marker=32.6573%2C51.6779";
const mapHref = "https://www.openstreetmap.org/?mlat=32.6573&mlon=51.6779#map=17/32.6573/51.6779";

const photos = [
  { src: "/landing/rahil-gallery-front.jpg", altKey: "storefrontAlt" },
  { src: "/landing/rahil-gallery-hero.jpg", altKey: "entranceAlt" },
] as const;

export function ContactView({
  locale,
  about,
}: {
  locale: Locale;
  about: StoreMessages["about"];
}) {
  const contact = about.pages.contact;
  const next = nextAboutSlug("contact");

  return (
    <>
      <Container className="pt-14 md:pt-20">
        <h1 className="about-display max-w-3xl text-[clamp(2.6rem,6vw,4.5rem)]">
          {contact.title}
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-muted md:text-lg">
          {contact.lede}
        </p>
      </Container>

      <Container className="grid gap-6 py-12 md:grid-cols-2 md:py-16">
        {photos.map((photo) => (
          <figure key={photo.src} className="relative aspect-[4/3] bg-surface-elevated">
            <Image
              src={photo.src}
              alt={contact[photo.altKey]}
              fill
              sizes="(min-width: 48rem) 40vw, 100vw"
              className="object-cover"
            />
          </figure>
        ))}
      </Container>

      <Container className="grid items-start gap-12 pb-16 md:grid-cols-2 md:gap-16 md:pb-24">
        <div className="border border-border px-6 py-8">
          <dl className="flex flex-col gap-8">
            <div>
              <dt className="about-kicker">{contact.addressLabel}</dt>
              <dd className="mt-3 text-base leading-relaxed text-ink md:text-lg">
                {contact.address}
              </dd>
            </div>
            <div>
              <dt className="about-kicker">{contact.phoneLabel}</dt>
              <dd className="mt-3 text-base md:text-lg">
                <a href={contact.phoneHref} className="about-inline-link" dir="ltr">
                  {contact.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="about-kicker">{contact.emailLabel}</dt>
              <dd className="mt-3 text-base md:text-lg">
                <a href={`mailto:${contact.email}`} className="about-inline-link" dir="ltr">
                  {contact.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="about-kicker">{contact.hoursLabel}</dt>
              <dd className="mt-3 text-base leading-relaxed text-ink md:text-lg">
                {contact.hours}
              </dd>
            </div>
            <div>
              <dt className="about-kicker">{contact.socialLabel}</dt>
              <dd className="mt-3">
                <ul className="flex flex-wrap gap-x-6 gap-y-2">
                  {contact.socials.map((social) => (
                    <li key={social.label}>
                      <a
                        href={social.href}
                        className="about-inline-link"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {social.label}
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">{contact.socialNote}</p>
              </dd>
            </div>
          </dl>
        </div>
        <ContactForm copy={contact.form} />
      </Container>

      <Container className="pb-8">
        <h2 className="about-display text-[clamp(1.8rem,3vw,2.6rem)]">{contact.mapLabel}</h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted">{contact.mapNote}</p>
        <div className="mt-8 h-80 border border-border md:h-[28rem]">
          <iframe
            title={contact.mapTitle}
            src={mapEmbed}
            className="h-full w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <p className="mt-4">
          <a
            href={mapHref}
            className="about-inline-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            {contact.mapLink}
          </a>
        </p>
      </Container>

      <Container className="py-16 md:py-24">
        <AboutNextLink
          href={localePath(locale, aboutPath(next))}
          kicker={about.continueLabel}
          title={about.pages[next].title}
        />
        <RelatedLinks
          label={about.relatedLabel}
          links={aboutRelated.contact.map((related) => ({
            href: localePath(locale, aboutPath(related)),
            title: about.pages[related].title,
          }))}
        />
      </Container>
    </>
  );
}
