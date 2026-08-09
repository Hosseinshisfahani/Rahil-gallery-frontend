"use client";

import Image, { type ImageProps } from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Container } from "./store-layout";
import { ProductCard, ProductGrid } from "./catalog";

// --- data.ts ---

/**
 * Chaumet product & editorial imagery (www.chaumet.com/media)
 * Loaded client-side via LandingImage — see landing-image.tsx
 */

export const landingMarqueeItems = [
  "Fine Gold",
  "Hand Set Stones",
  "Made to Order",
  "Isfahan Atelier",
  "Since 2024",
  "Rahil Gallery",
] as const;

export const landingCollections = [
  {
    slug: "josephine",
    title: "Joséphine",
    subtitle: "Tiara rings",
    href: "/en/collections/josephine",
    imageUrl: "/_dev/banners/ALL-CHAUMET-BDC26-WEB-S-ED-SL-RING-1-900x900-1-880x820.jpg",
    size: "large" as const,
  },
  {
    slug: "bee-de-chaumet",
    title: "Bee de Chaumet",
    subtitle: "Graphic light",
    href: "/en/collections/bee-de-chaumet",
    imageUrl: "/_dev/banners/Event-High-Jewellery-Chaumet-A-Journey-Through-Nature-desktop-880x820.jpg",
    size: "small" as const,
  },
  {
    slug: "liens",
    title: "Liens",
    subtitle: "Linked forms",
    href: "/en/collections/liens",
    imageUrl: "/_dev/banners/Push-12-Vendôme-590x500.jpg",
    size: "small" as const,
  },
];

export const landingProducts = [
  {
    href: "/en/shop/josephine-aigrette",
    title: "Joséphine Aigrette Ring",
    imageUrl: "/_dev/products/081933_primary.avif",
    priceFrom: 42_000_000,
    availability: "made_to_order" as const,
  },
  {
    href: "/en/shop/josephine-eclat-floral",
    title: "Joséphine Éclat Floral",
    imageUrl: "/_dev/products/081933_primary.avif",
    priceFrom: 28_500_000,
    availability: "in_stock" as const,
    rating: 4.8,
    reviewCount: 12,
  },
  {
    href: "/en/shop/josephine-amour",
    title: "Joséphine Amour d'Aigrette",
    imageUrl: "/_dev/products/081933_primary.avif",
    priceFrom: 19_800_000,
    availability: "in_stock" as const,
  },
  {
    href: "/en/shop/bee-de-chaumet",
    title: "Bee de Chaumet Ring",
    imageUrl: "/_dev/products/081933_primary.avif",
    priceFrom: 15_200_000,
    availability: "made_to_order" as const,
    rating: 5,
    reviewCount: 4,
  },
];

export const landingJournalPosts = [
  {
    href: "/en/journal/gold-and-light",
    title: "Gold & Light",
    excerpt: "How we balance warmth and restraint in every cast.",
    date: "May 2026",
    imageUrl: "/_dev/products/ALL-CHAUMET-26-VD-CNY-WEB-S-ED-SL-BML-BGLS-1080x1080-1-563x0.jpg",
  },
  {
    href: "/en/journal/stone-selection",
    title: "Choosing the Stone",
    excerpt: "A guide to cuts, clarity, and character for bespoke pieces.",
    date: "Apr 2026",
    imageUrl: "/_dev/products/ALL-CHAUMET-26-VD-CNY-WEB-S-ED-SL-JSP-AIG-PEND-1080x1080-1-563x0.jpg",
  },
  {
    href: "/en/journal/atelier-notes",
    title: "Atelier Notes",
    excerpt: "Inside the bench — sketches, wax, and the first polish.",
    date: "Mar 2026",
    imageUrl: "/_dev/products/ALL-CHAUMET-26-VD-CNY-WEB-S-ED-SL-LIENS-JDL-PEND-1-1080x1080-1-563x0.jpg",
  },
];

export const landingHeroImage = "/_dev/banners/422716929_692016456465794_446838611098623124_n.heic.jpg";

export const landingEditorialImage =
  "/_dev/banners/422716929_692016456465794_446838611098623124_n.heic.jpg";

// --- landing-image.tsx ---

function isRemote(src: ImageProps["src"]) {
  return (
    typeof src === "string" &&
    (src.startsWith("http://") || src.startsWith("https://"))
  );
}

/** Chaumet CDN images load in the browser (Akamai blocks server-side fetch). */
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

// --- landing-hero.tsx ---

export function LandingHero() {
  return (
    <section className="relative min-h-[88vh] overflow-hidden pt-[var(--header-height)]">
      <div className="relative z-[2] mx-auto grid max-w-[96rem] gap-10 px-4 pb-16 pt-10 md:px-8 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-12 lg:pb-24 lg:pt-16">
        <div className="flex flex-col gap-8">
          <span className="landing-mono landing-stagger-1 landing-text-primary">
            New season · 2026
          </span>
          <h1 className="landing-display landing-stagger-2 text-[clamp(3rem,10vw,6.5rem)]">
            Forms that
            <br />
            <span className="landing-text-gold">Endure</span>
          </h1>
          <p className="landing-stagger-3 max-w-md text-base leading-relaxed text-[var(--landing-muted)] md:text-lg">
            Modern jewelry with a retro soul — refined gold, deep blue, and
            stones chosen by hand in our Isfahan atelier.
          </p>
          <div className="landing-stagger-3 flex flex-wrap gap-4">
            <Link href="/en/shop" className="landing-pill landing-pill-primary">
              Explore shop
            </Link>
            <Link href="/en/custom" className="landing-pill landing-pill-outline">
              Design yours
            </Link>
          </div>
          <p className="landing-mono landing-stagger-3 text-[var(--landing-muted)]">
            Bespoke · 18K gold · Conflict-free stones
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
          <div className="landing-card relative aspect-[4/5] w-full overflow-hidden">
            <LandingImage
              src={landingHeroImage}
              alt="Joséphine Aigrette solitaire — Chaumet reference"
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

// --- landing-marquee.tsx ---

export function LandingMarquee() {
  const items = [...landingMarqueeItems, ...landingMarqueeItems];

  return (
    <div
      className="overflow-hidden border-y border-[var(--landing-border)] bg-[var(--landing-primary)] py-3.5"
      aria-hidden="true"
    >
      <div className="landing-marquee-track">
        {items.map((item, i) => (
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

// --- landing-collections.tsx ---

export function LandingCollections() {
  const [featured, ...rest] = landingCollections;

  return (
    <section className="py-20 md:py-28">
      <Container>
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="landing-mono landing-text-primary">Collections</span>
            <h2 className="landing-display mt-2 text-[clamp(2rem,5vw,3.5rem)]">
              Curated worlds
            </h2>
          </div>
          <Link
            href="/en/collections"
            className="landing-mono text-[var(--landing-muted)] transition-colors hover:text-[var(--landing-primary)]"
          >
            View all →
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 md:grid-rows-2 md:gap-5">
          <CollectionCard collection={featured} className="md:row-span-2 md:min-h-[520px]" />
          {rest.map((collection) => (
            <CollectionCard
              key={collection.slug}
              collection={collection}
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
  className,
}: {
  collection: (typeof landingCollections)[number];
  className?: string;
}) {
  return (
    <Link
      href={collection.href}
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
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--landing-ink)]/80 via-[var(--landing-ink)]/25 to-transparent" />
      <div className="relative mt-auto flex w-full flex-col gap-1 p-6 md:p-8">
        <span className="landing-mono text-[var(--landing-gold)]">
          {collection.subtitle}
        </span>
        <h3 className="landing-display text-3xl text-white! md:text-4xl">
          {collection.title}
        </h3>
      </div>
    </Link>
  );
}

// --- landing-new-arrivals.tsx ---

export function LandingNewArrivals() {
  return (
    <section className="border-t border-[var(--landing-border)] bg-[var(--landing-surface)] py-20 md:py-28">
      <Container>
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="landing-mono landing-text-primary">
              New arrivals
            </span>
            <h2 className="landing-display mt-2 text-[clamp(2rem,5vw,3.25rem)]">
              Just from the bench
            </h2>
          </div>
          <Link
            href="/en/shop"
            className="landing-pill landing-pill-outline w-fit"
          >
            Shop all
          </Link>
        </div>

        <ProductGrid columns="default">
          {landingProducts.map((product, i) => (
            <ProductCard
              key={product.href}
              {...product}
              locale="en"
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

// --- landing-editorial.tsx ---

export function LandingEditorial() {
  return (
    <section className="py-20 md:py-28">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="landing-card relative order-2 aspect-[4/5] overflow-hidden lg:order-1">
            <LandingImage
              src={landingEditorialImage}
              alt="Chaumet editorial — fine jewelry"
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
          </div>

          <div className="order-1 flex flex-col gap-6 lg:order-2">
            <span className="landing-mono landing-text-gold">Craftsmanship</span>
            <blockquote className="font-[family-name:var(--font-cormorant)] text-[clamp(1.75rem,4vw,2.75rem)] font-light leading-snug text-[var(--landing-ink)]">
              &ldquo;Every piece begins as a line on paper — then gold, fire, and
              patience do the rest.&rdquo;
            </blockquote>
            <p className="max-w-md leading-relaxed text-[var(--landing-muted)]">
              Our atelier blends traditional bench techniques with contemporary
              silhouettes. Configure metal, stone, and size — or commission
              something entirely your own.
            </p>
            <Link href="/en/craft" className="landing-pill landing-pill-primary w-fit">
              Our craft
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

// --- landing-journal.tsx ---

export function LandingJournal() {
  return (
    <section className="border-t border-[var(--landing-border)] py-20 md:py-28">
      <Container>
        <div className="mb-12">
          <span className="landing-mono landing-text-primary">Journal</span>
          <h2 className="landing-display mt-2 text-[clamp(2rem,5vw,3rem)]">
            Stories from the studio
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {landingJournalPosts.map((post) => (
            <article key={post.href} className="group flex flex-col gap-4">
              <Link
                href={post.href}
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
                  {post.date}
                </span>
                <Link href={post.href}>
                  <h3 className="landing-display text-xl transition-colors group-hover:text-[var(--landing-primary)]">
                    {post.title}
                  </h3>
                </Link>
                <p className="text-sm leading-relaxed text-[var(--landing-muted)]">
                  {post.excerpt}
                </p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
