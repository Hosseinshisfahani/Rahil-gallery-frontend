"use client";

import Image, { type ImageProps } from "next/image";
import Link from "next/link";
import type { StoreMessages } from "@/lib/i18n/store";
import { localePath } from "@/lib/store-navigation";
import type { Locale } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ProductCard, ProductGrid } from "./catalog";
import { Container } from "./store-layout";

type LandingCopy = StoreMessages["landing"];


const landingCollections = [
  {
    slug: "josephine",
    title: "افسون گر",
    subtitleKey: "josephine",
    path: "/shop",
    imageUrl: "/landing/layer1.jpg",
    size: "large",
  },
  {
    slug: "bee-de-chaumet",
    title: "چشم نواز",
    subtitleKey: "beeDeChaumet",
    path: "/shop",
    imageUrl: "/landing/rahil-pearl-pendant.webp",
    size: "small",
  },
  {
    slug: "liens",
    title: "درفضایی ماندگار",
    subtitleKey: "liens",
    path: "/shop",
    imageUrl: "/landing/internal-collection.png",
    size: "small",
  },
] as const;

const landingProducts = [
  {
    path: "/shop/josephine-aigrette",
    titleKey: "silverTurquoiseRing",
    imageUrl: "/landing/silver-turquoise-ring.webp",
    availability: "made_to_order" as const,
  },
  {
    path: "/shop/josephine-eclat-floral",
    titleKey: "turquoiseGoldPendant",
    imageUrl: "/landing/turquoise-gold-pendant.webp",
    availability: "in_stock" as const,
    reviewCount: 12,
  },
  {
    path: "/shop/josephine-amour",
    titleKey: "goldBlueStoneRing",
    imageUrl: "/landing/gold-blue-stone-ring.webp",
    availability: "in_stock" as const,
  },
  {
    path: "/shop/bee-de-chaumet",
    titleKey: "turquoisePearlEarrings",
    imageUrl: "/landing/turquoise-pearl-earrings-v2.webp",
    availability: "made_to_order" as const,
    reviewCount: 4,
  },
] as const;

const landingJournalPosts = [
  {
    path: "/journal/gold-and-light",
    postKey: "goldAndLight",
    imageUrl: "/_dev/products/ALL-CHAUMET-26-VD-CNY-WEB-S-ED-SL-BML-BGLS-1080x1080-1-563x0.jpg",
  },
  {
    path: "/journal/stone-selection",
    postKey: "stoneSelection",
    imageUrl: "/_dev/products/ALL-CHAUMET-26-VD-CNY-WEB-S-ED-SL-JSP-AIG-PEND-1080x1080-1-563x0.jpg",
  },
  {
    path: "/journal/atelier-notes",
    postKey: "atelierNotes",
    imageUrl: "/_dev/products/ALL-CHAUMET-26-VD-CNY-WEB-S-ED-SL-LIENS-JDL-PEND-1-1080x1080-1-563x0.jpg",
  },
] as const;

const landingHeroImage = "/landing/logo.jpg";

const landingEditorialImage =
  "/landing/rahil-gallery-hero.jpg";



/* ### helper functions ### */

function isRemote(src: ImageProps["src"]) {
  return (
    typeof src === "string" &&
    (src.startsWith("http://") || src.startsWith("https://"))
  );
}

export function LandingImage({
  src,
  alt = "",
  className,
  fill,
  sizes,
  priority,
  unoptimized,
  ...rest
}: ImageProps) {
  if (isRemote(src)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src as string}
        alt={alt}
        sizes={sizes}
        referrerPolicy="no-referrer"
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={cn(fill && "absolute inset-0 size-full object-cover", className)}
        {...rest}
      />
    );
  }

  const isSvg = typeof src === "string" && src.endsWith(".svg");
  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      sizes={sizes}
      priority={priority}
      className={className}
      unoptimized={unoptimized ?? isSvg}
      {...rest}
    />
  );
}

export function Landing({
  locale,
  copy,
}: {
  locale: Locale;
  copy: LandingCopy;
}) {
  return (
    <>
      <LandingHero locale={locale} copy={copy.hero} />
      <LandingMarquee items={copy.marquee} />
      <LandingCollections locale={locale} copy={copy.collections} />
      <LandingNewArrivals locale={locale} copy={copy.arrivals} />
      <LandingEditorial locale={locale} copy={copy.editorial} />
      <LandingJournal locale={locale} copy={copy.journal} />
    </>
  );
}

function LandingHero({
  locale,
  copy,
}: {
  locale: Locale;
  copy: LandingCopy["hero"];
}) {
  return (
    <section className="relative min-h-[88vh] overflow-hidden pt-[var(--header-height)]">
      <div className="relative z-[2] mx-auto grid max-w-[96rem] gap-10 px-6 pb-16 pt-10 md:px-10 lg:grid-cols-2 lg:items-center lg:gap-12 lg:px-12 lg:pb-24 lg:pt-16">
        <div className="flex flex-col gap-10">
          <span className="landing-mono landing-stagger-1 landing-text-primary">
            {copy.eyebrow}
          </span>
          <h1 className="landing-display landing-stagger-2 text-[clamp(3rem,4vw,7.5rem)]! font-bold leading-[1.2]!">
            {copy.titleLead}
            <br />
            <span className="landing-text-gold">{copy.titleAccent}</span>
          </h1>
          <p className="landing-stagger-3 max-w-md text-lg! leading-relaxed text-[var(--landing-muted)] md:text-xl!">
            {copy.body}
          </p>
          <div className="landing-stagger-3 flex flex-wrap gap-4 mt-12">
            <Link href={localePath(locale, "/shop")} className="landing-pill landing-pill-primary">
              {copy.exploreShop}
            </Link>
            <Link href={localePath(locale, "/custom")} className="landing-pill landing-pill-outline">
              {copy.designYours}
            </Link>
          </div>
          <p className="landing-mono landing-stagger-3 text-[var(--landing-muted)] justify-center!">
            {copy.footnote}
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
          <div className="landing-card relative aspect-[4/5] w-full overflow-hidden">
            <LandingImage
              src={landingHeroImage}
              alt={copy.imageAlt}
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 45vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function LandingMarquee({ items }: { items: LandingCopy["marquee"] }) {
  const loop = [...items, ...items];

  return (
    <div
      className="overflow-hidden border-y border-[var(--landing-border)] bg-[var(--landing-primary)] py-3.5"
      aria-hidden="true"
    >
      <div className="landing-marquee-track">
        {loop.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="landing-mono flex shrink-0 items-center gap-8 px-8 text-white"
          >
            {item}
            <span className="text-[var(--landing-gold)]">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function LandingCollections({
  locale,
  copy,
}: {
  locale: Locale;
  copy: LandingCopy["collections"];
}) {
  const [featured, ...rest] = landingCollections;

  return (
    <section className="py-20 md:py-28">
      <Container>
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="landing-mono landing-text-primary">{copy.eyebrow}</span>
            <h2 className="landing-display mt-2 text-[clamp(2rem,5vw,3.5rem)]">
              {copy.title}
            </h2>
          </div>
          <Link
            href={localePath(locale, "/collections")}
            className="landing-mono text-[var(--landing-muted)] transition-colors hover:text-[var(--landing-primary)]"
          >
            {copy.viewAll}
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 md:grid-rows-2 md:gap-5">
          <CollectionCard
            collection={featured}
            subtitle={copy.subtitles[featured.subtitleKey]}
            locale={locale}
            className="md:row-span-2 md:min-h-[520px]"
          />
          {rest.map((collection) => (
            <CollectionCard
              key={collection.slug}
              collection={collection}
              subtitle={copy.subtitles[collection.subtitleKey]}
              locale={locale}
              className="md:min-h-[250px]"
            />
          ))}
        </div>
      </Container>
    </section>
  );
}

function CollectionCard({
  collection,
  subtitle,
  locale,
  className,
}: {
  collection: (typeof landingCollections)[number];
  subtitle: string;
  locale: Locale;
  className?: string;
}) {
  return (
    <Link
      href={localePath(locale, collection.path)}
      className={cn(
        "landing-card group relative flex min-h-[280px] overflow-hidden",
        className,
      )}
    >
      <LandingImage
        src={collection.imageUrl}
        alt={collection.title}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover transition-opacity duration-500 group-hover:opacity-90"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--landing-ink)]/50 via-[var(--landing-ink)]/0 to-transparent" />
      <div className="relative mt-auto flex w-full flex-col gap-1 p-6 md:p-8">
        <span className="landing-mono text-[var(--landing-gold)]">
          {subtitle}
        </span>
        <h3 className="landing-display text-3xl text-white! md:text-4xl">
          {collection.title}
        </h3>
      </div>
    </Link>
  );
}

function LandingNewArrivals({
  locale,
  copy,
}: {
  locale: Locale;
  copy: LandingCopy["arrivals"];
}) {
  return (
    <section className="border-t border-[var(--landing-border)] bg-[var(--landing-surface)] py-20 md:py-28">
      <Container>
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="landing-mono landing-text-primary">
              {copy.eyebrow}
            </span>
            <h2 className="landing-display mt-2 text-[clamp(2rem,5vw,3.25rem)]">
              {copy.title}
            </h2>
          </div>
          <Link
            href={localePath(locale, "/shop")}
            className="landing-pill landing-pill-outline w-fit"
          >
            {copy.shopAll}
          </Link>
        </div>

        <ProductGrid columns="default">
          {landingProducts.map((product, i) => (
            <ProductCard
              key={product.path}
              href={localePath(locale, product.path)}
              title={copy.products[product.titleKey]}
              imageUrl={product.imageUrl}
              availability={product.availability}
              rating={"rating" in product ? product.rating : undefined}
              reviewCount={"reviewCount" in product ? product.reviewCount : undefined}
              locale={locale}
              priority={i < 2}
              classNames={{
                media: "landing-card overflow-hidden rounded-[var(--landing-radius)]",
              }}
            />
          ))}
        </ProductGrid>
      </Container>
    </section>
  );
}

function LandingEditorial({
  locale,
  copy,
}: {
  locale: Locale;
  copy: LandingCopy["editorial"];
}) {
  return (
    <section className="border-t border-[var(--landing-border)] bg-[var(--landing-surface)] pt-20 pb-28 md:pt-28 md:pb-36">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="relative order-2 bg-[var(--landing-canvas)] p-3 shadow-[0_0_0_1px_var(--landing-primary)] md:p-4 lg:order-1">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-[7px] border border-[var(--landing-gold-deep)] md:inset-[9px]"
            />
            <div className="relative aspect-[5/4] overflow-hidden">
              <LandingImage
                src={landingEditorialImage}
                alt={copy.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
            </div>
          </div>

          <div className="order-1 flex flex-col gap-6 lg:order-2">
            <span className="landing-mono landing-text-gold">{copy.eyebrow}</span>
            <blockquote className="landing-quote text-[clamp(1.75rem,4vw,2.75rem)] leading-snug text-[var(--landing-ink)]">
              {copy.quote}
            </blockquote>
            <p className="max-w-md leading-relaxed text-[var(--landing-muted)]">
              {copy.body}
            </p>
            <Link href={localePath(locale, "/craft")} className="landing-pill landing-pill-primary w-fit">
              {copy.cta}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

function LandingJournal({
  locale,
  copy,
}: {
  locale: Locale;
  copy: LandingCopy["journal"];
}) {
  return (
    <section className="border-t border-[var(--landing-border)] py-20 md:py-28">
      <Container>
        <div className="mb-12">
          <span className="landing-mono landing-text-primary">{copy.eyebrow}</span>
          <h2 className="landing-display mt-2 text-[clamp(2rem,5vw,3rem)]">
            {copy.title}
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {landingJournalPosts.map((post) => {
            const entry = copy.posts[post.postKey];
            const href = localePath(locale, post.path);
            return (
              <article key={post.path} className="group flex flex-col gap-4">
                <Link
                  href={href}
                  className="landing-card relative aspect-[4/3] overflow-hidden"
                >
                  <LandingImage
                    src={post.imageUrl}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>
                <div className="flex flex-col gap-2">
                  <span className="landing-mono text-[var(--landing-muted)]">
                    {entry.date}
                  </span>
                  <Link href={href}>
                    <h3 className="landing-display journal-card-title text-xl transition-colors group-hover:text-[var(--landing-primary)]">
                      {entry.title}
                    </h3>
                  </Link>
                  <p className="text-sm leading-relaxed text-[var(--landing-muted)]">
                    {entry.excerpt}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
