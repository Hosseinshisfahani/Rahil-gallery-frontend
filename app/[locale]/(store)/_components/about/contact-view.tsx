import Image from "next/image";
import { aboutPath, nextAboutSlug } from "@/lib/about/pages";
import type { StoreMessages } from "@/lib/i18n/store";
import { localePath } from "@/lib/store-navigation";
import type { Locale } from "@/lib/types";
import { AboutNextLink } from "./about-blocks";
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
    <div className="about-contact">
      <Container className="about-contact-intro">
        <h1 className="about-display">{contact.title}</h1>
        <p>{contact.lede}</p>
      </Container>

      <Container className="about-contact-photos">
        {photos.map((photo) => (
          <figure key={photo.src} className="about-media about-media-frame relative aspect-[4/3]">
            <Image
              src={photo.src}
              alt={contact[photo.altKey]}
              fill
              sizes="(min-width: 48rem) 45vw, 100vw"
              className="about-media-image object-cover"
            />
          </figure>
        ))}
      </Container>

      <Container className="about-contact-grid">
        <section className="about-contact-card" aria-label={contact.title}>
          <dl>
            <div>
              <dt>{contact.addressLabel}</dt>
              <dd>{contact.address}</dd>
            </div>
            <div>
              <dt>{contact.phoneLabel}</dt>
              <dd>
                <a href={contact.phoneHref} dir="ltr">
                  {contact.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt>{contact.emailLabel}</dt>
              <dd>
                <a href={`mailto:${contact.email}`} dir="ltr">
                  {contact.email}
                </a>
              </dd>
            </div>
            <div>
              <dt>{contact.hoursLabel}</dt>
              <dd>{contact.hours}</dd>
            </div>
            <div>
              <dt>{contact.socialLabel}</dt>
              <dd>
                <ul>
                  {contact.socials.map((social) => (
                    <li key={social.label}>
                      <a href={social.href} target="_blank" rel="noopener noreferrer">
                        {social.label}
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="about-contact-note">{contact.socialNote}</p>
              </dd>
            </div>
          </dl>
        </section>
        <ContactForm copy={contact.form} />
      </Container>

      <Container className="about-contact-map">
        <h2 className="about-display">{contact.mapLabel}</h2>
        <p>{contact.mapNote}</p>
        <div className="about-contact-map-frame">
          <iframe
            title={contact.mapTitle}
            src={mapEmbed}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <p>
          <a href={mapHref} className="about-inline-link" target="_blank" rel="noopener noreferrer">
            {contact.mapLink}
          </a>
        </p>
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
    </div>
  );
}
