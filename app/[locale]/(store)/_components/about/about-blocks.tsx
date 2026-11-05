import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Container } from "../store-layout";

/**
 * Shared About blocks. Callers pass the image and text.
 * These components do not choose photographs or write page copy.
 */

export function AboutSection({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("py-16 md:py-24", className)}>
      <Container>{children}</Container>
    </section>
  );
}

export function AboutHero({
  src,
  alt = "",
  kicker,
  title,
  lede,
  fit = "cover",
  wide = false,
  className,
}: {
  src?: string;
  alt?: string;
  kicker?: string;
  title: string;
  lede?: React.ReactNode;
  fit?: "cover" | "contain";
  /** Keep a panoramic photograph fully visible. */
  wide?: boolean;
  className?: string;
}) {
  return (
    <header>
      {src ? (
        <Container className="pt-6 md:pt-8">
          <div className="about-media about-media-hero">
            <div
              className={cn(
                "about-media-frame relative",
                wide
                  ? "aspect-[2057/764] w-full"
                  : "h-[46vh] min-h-[18rem] max-h-[34rem]",
                fit === "contain" && "bg-surface-elevated",
              )}
            >
              <Image
                src={src}
                alt={alt}
                fill
                priority
                sizes="100vw"
                className={cn(
                  "about-media-image",
                  fit === "contain" ? "object-contain p-8" : "object-cover",
                )}
              />
            </div>
          </div>
        </Container>
      ) : null}
      <Container className={cn("text-center", src ? "pt-10 md:pt-14" : "pt-10 md:pt-16", className)}>
        {kicker ? <p className="about-kicker">{kicker}</p> : null}
        <h1 className="about-display mx-auto mt-4 max-w-3xl text-[clamp(2.6rem,6vw,4.5rem)]">
          {title}
        </h1>
        {lede ? (
          <div className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-ink-muted md:text-lg">
            {lede}
          </div>
        ) : null}
      </Container>
    </header>
  );
}

export function ImageTextBlock({
  src,
  alt,
  children,
  flip = false,
  fit = "cover",
}: {
  src: string;
  alt: string;
  children: React.ReactNode;
  flip?: boolean;
  fit?: "cover" | "contain";
}) {
  return (
    <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
      <figure
        className={cn(
          "about-media about-media-frame relative aspect-[4/5] bg-surface-elevated",
          flip && "md:order-2",
        )}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 48rem) 40vw, 100vw"
          className={cn(
            "about-media-image",
            fit === "contain" ? "object-contain p-8" : "object-cover",
          )}
        />
      </figure>
      <div className={cn(flip && "md:order-1")}>{children}</div>
    </div>
  );
}

export function PullQuote({ quote, by }: { quote: string; by?: string }) {
  return (
    <figure className="border-s-2 border-[var(--accent)] ps-6 md:ps-10">
      <blockquote className="about-quote">{quote}</blockquote>
      {by ? <figcaption className="about-kicker mt-6">{by}</figcaption> : null}
    </figure>
  );
}

export function AboutInlineLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className="about-inline-link">
      {children}
    </Link>
  );
}

export function AboutNextLink({
  href,
  kicker,
  title,
}: {
  href: string;
  kicker: string;
  title: string;
}) {
  return (
    <Link href={href} className="about-next group">
      <span className="about-next-kicker">{kicker}</span>
      <span className="about-next-title">{title}</span>
      <span className="about-next-cta" aria-hidden="true">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          className="about-next-cta-arrow"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </span>
    </Link>
  );
}

