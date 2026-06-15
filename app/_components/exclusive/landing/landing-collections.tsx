import { LandingImage } from "./landing-image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Container } from "@/_components/shared/layout/container";
import { landingCollections } from "./data";

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
