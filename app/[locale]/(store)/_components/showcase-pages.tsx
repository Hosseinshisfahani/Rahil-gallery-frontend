import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpLeft, ArrowUpRight } from "lucide-react";
import type { getShowcaseCopy } from "@/lib/showcase-pages";
import { localePath } from "@/lib/store-navigation";
import type { Locale } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Container, SiteFooter } from "./store-layout";

type ShowcaseCopy = ReturnType<typeof getShowcaseCopy>;

function formatIndex(index: number, locale: Locale) {
  const value = String(index + 1).padStart(2, "0");
  if (locale !== "fa") return value;
  return value.replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)]);
}

function EditorialHeading({
  label,
  title,
  light = false,
}: {
  label: string;
  title: string;
  light?: boolean;
}) {
  return (
    <div className="max-w-3xl">
      <p
        className={cn(
          "showcase-label",
          light ? "text-[#d4c4a8]" : "text-accent",
        )}
      >
        {label}
      </p>
      <h2
        className={cn(
          "showcase-display mt-5 text-[clamp(2.35rem,6vw,5rem)]",
          light ? "showcase-on-dark" : "text-primary",
        )}
      >
        {title}
      </h2>
    </div>
  );
}

function PageHero({
  eyebrow,
  title,
  intro,
  indexLabel,
  images,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  indexLabel: string;
  images: readonly [string, string];
}) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-[#f4f1eb]">
      <div
        aria-hidden="true"
        className="absolute inset-y-0 start-0 hidden w-[42%] bg-primary lg:block"
      />
      <Container className="relative grid min-h-[calc(100svh-var(--header-height)-var(--header-nav-height))] items-center gap-12 py-14 md:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="showcase-on-navy relative z-10">
          <p className="showcase-label text-accent lg:text-[#d4c4a8]">{eyebrow}</p>
          <h1 className="showcase-display mt-6 max-w-2xl text-[clamp(2.75rem,6vw,5.5rem)] text-primary">
            {title}
          </h1>
          <p className="mt-8 max-w-xl text-base leading-8 text-ink-muted md:text-lg lg:text-white/75">
            {intro}
          </p>
          <a
            href="#overview"
            className="showcase-index mt-10 inline-flex items-center gap-3 text-primary lg:text-white"
          >
            {indexLabel}
            <ArrowDown aria-hidden="true" size={15} strokeWidth={1.5} />
          </a>
        </div>

        <div className="relative mx-auto w-full max-w-3xl pb-12 ps-10 pt-2 md:ps-20 lg:pb-16">
          <div className="relative aspect-[4/5] overflow-hidden bg-white">
            <Image
              src={images[0]}
              alt=""
              fill
              priority
              sizes="(max-width: 1024px) 85vw, 45vw"
              className="object-cover"
            />
          </div>
          <div className="absolute bottom-0 start-0 aspect-[4/5] w-[42%] border-[10px] border-[#f4f1eb] bg-white md:border-[14px]">
            <Image
              src={images[1]}
              alt=""
              fill
              sizes="(max-width: 1024px) 35vw, 18vw"
              className="object-cover"
            />
          </div>
          <span
            aria-hidden="true"
            className="absolute -end-3 top-1/2 h-px w-14 bg-accent md:-end-8 md:w-24"
          />
        </div>
      </Container>
    </section>
  );
}

function ContactPanel({
  locale,
  eyebrow,
  title,
  body,
  label,
}: {
  locale: Locale;
  eyebrow: string;
  title: string;
  body: string;
  label: string;
}) {
  const Arrow = locale === "fa" ? ArrowUpLeft : ArrowUpRight;

  return (
    <section className="bg-[#d4c4a8]">
      <Container className="grid gap-10 py-16 md:py-24 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="max-w-4xl">
          <p className="showcase-label text-primary">{eyebrow}</p>
          <h2 className="showcase-display mt-5 text-[clamp(2.4rem,5vw,4.5rem)] text-primary">
            {title}
          </h2>
          <p className="mt-7 max-w-2xl text-base leading-8 text-primary/75 md:text-lg">
            {body}
          </p>
        </div>
        <Link
          href={localePath(locale, "/about/contact")}
          className="group inline-flex w-fit items-center gap-5 border-b border-primary pb-3 text-sm font-medium text-primary"
        >
          {label}
          <Arrow
            aria-hidden="true"
            size={18}
            strokeWidth={1.5}
            className="transition-transform group-hover:-translate-y-1"
          />
        </Link>
      </Container>
    </section>
  );
}

export function CategoriesPage({
  locale,
  copy,
}: {
  locale: Locale;
  copy: ShowcaseCopy["categories"];
}) {
  return (
    <div className="showcase-page">
      <main>
        <PageHero
          eyebrow={copy.eyebrow}
          title={copy.title}
          intro={copy.intro}
          indexLabel={copy.indexLabel}
          images={[
            "/landing/Engraved silver turquoise ring on white.png",
            "/landing/rahil-pearl-pendant.webp",
          ]}
        />

        <section id="overview" className="scroll-mt-32 py-20 md:py-32">
          <Container>
            <EditorialHeading label={copy.groupsLabel} title={copy.groupsTitle} />
            <div className="mt-14 grid gap-px bg-border lg:grid-cols-3">
              {copy.groups.map((group, index) => (
                <article
                  key={group.title}
                  className="group flex min-h-full flex-col bg-canvas"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-surface-elevated">
                    {group.image ? (
                      <Image
                        src={group.image}
                        alt=""
                        fill
                        sizes="(max-width: 1024px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                      />
                    ) : null}
                    <span className="showcase-num absolute start-5 top-5 grid size-10 place-items-center rounded-full bg-white/90 text-sm text-primary backdrop-blur-sm">
                      {formatIndex(index, locale)}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col px-6 py-8 md:px-8 md:py-10">
                    <h3 className="showcase-display text-[clamp(1.7rem,2vw,2.15rem)] text-primary">
                      {group.title}
                    </h3>
                    <p className="mt-4 leading-7 text-ink-muted">
                      {group.description}
                    </p>
                    {group.items?.length ? (
                      <ul className="mt-8 divide-y divide-border border-t border-border">
                        {group.items.map((item) => (
                          <li
                            key={item}
                            className="flex items-center gap-3 py-3 text-sm text-ink"
                          >
                            <span className="size-1 rounded-full bg-accent" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="mt-auto pt-10">
                        <span className="block h-px w-12 bg-accent" />
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </Container>
        </section>

        <section className="overflow-hidden bg-primary py-20 md:py-32">
          <Container>
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
              <div>
                <EditorialHeading
                  label={copy.jewelryLabel}
                  title={copy.jewelryTitle}
                  light
                />
                <p className="mt-7 max-w-md leading-8 text-white/65">
                  {copy.jewelryIntro}
                </p>
              </div>
              <ol className="grid gap-x-10 md:grid-cols-2">
                {copy.jewelryTypes.map((type, index) => (
                  <li
                    key={type}
                    className="grid grid-cols-[2.5rem_1fr] items-center gap-3 border-b border-white/15 py-5"
                  >
                    <span className="showcase-num text-sm text-[#d4c4a8]">
                      {formatIndex(index, locale)}
                    </span>
                    <span className="text-sm leading-6 text-white md:text-base">
                      {type}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </Container>
        </section>

        <ContactPanel
          locale={locale}
          eyebrow={copy.ctaEyebrow}
          title={copy.ctaTitle}
          body={copy.ctaBody}
          label={copy.ctaLabel}
        />
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}

export function ServicesPage({
  locale,
  copy,
}: {
  locale: Locale;
  copy: ShowcaseCopy["services"];
}) {
  return (
    <div className="showcase-page">
      <main>
        <PageHero
          eyebrow={copy.eyebrow}
          title={copy.title}
          intro={copy.intro}
          indexLabel={copy.indexLabel}
          images={[
            "/landing/journal-layered-necklaces.webp",
            "/landing/gold-blue-stone-ring.webp",
          ]}
        />

        <section id="overview" className="scroll-mt-32 py-20 md:py-32">
          <Container>
            <EditorialHeading
              label={copy.servicesLabel}
              title={copy.servicesTitle}
            />
            <div className="mt-16 border-t border-border">
              {copy.items.map((service, index) => (
                <article
                  key={service.title}
                  className="grid gap-8 border-b border-border py-10 md:grid-cols-[4rem_1fr_0.65fr] md:items-center md:gap-10 md:py-14"
                >
                  <span className="showcase-num text-4xl text-accent">
                    {formatIndex(index, locale)}
                  </span>
                  <div className="max-w-2xl">
                    <h3 className="showcase-display text-[clamp(1.55rem,2.4vw,2.15rem)] text-primary">
                      {service.title}
                    </h3>
                    <p className="mt-4 max-w-xl leading-7 text-ink-muted">
                      {service.description}
                    </p>
                  </div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-surface-elevated">
                    {service.image ? (
                      <Image
                        src={service.image}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 100vw, 30vw"
                        className="object-cover"
                      />
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </Container>
        </section>

        <section className="bg-[#f4f1eb] py-20 md:py-28">
          <Container>
            <EditorialHeading
              label={copy.processLabel}
              title={copy.processTitle}
            />
            <ol className="mt-14 grid gap-px bg-border md:grid-cols-3">
              {copy.process.map((step, index) => (
                <li key={step.title} className="bg-[#f4f1eb] p-8 md:p-10">
                  <span className="showcase-num text-5xl text-accent">
                    {formatIndex(index, locale)}
                  </span>
                  <h3 className="showcase-display mt-10 text-[1.65rem] text-primary">
                    {step.title}
                  </h3>
                  <p className="mt-4 leading-7 text-ink-muted">{step.body}</p>
                </li>
              ))}
            </ol>
          </Container>
        </section>

        <ContactPanel
          locale={locale}
          eyebrow={copy.ctaEyebrow}
          title={copy.ctaTitle}
          body={copy.ctaBody}
          label={copy.ctaLabel}
        />
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
