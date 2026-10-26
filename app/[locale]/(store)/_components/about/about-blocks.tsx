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
  alt,
  kicker,
  title,
  lede,
  fit = "cover",
  wide = false,
}: {
  src: string;
  alt: string;
  kicker?: string;
  title: string;
  lede?: React.ReactNode;
  fit?: "cover" | "contain";
  /** Keep a panoramic photograph fully visible. */
  wide?: boolean;
}) {
  return (
    <header>
      <div
        className={cn(
          "relative",
          wide
            ? "aspect-[2057/764] w-full"
            : "h-[50vh] min-h-[20rem] max-h-[36rem]",
          fit === "contain" && "bg-surface-elevated",
        )}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="100vw"
          className={fit === "contain" ? "object-contain p-8" : "object-cover"}
        />
      </div>
      <Container className="pt-10 md:pt-14">
        {kicker ? <p className="about-kicker">{kicker}</p> : null}
        <h1 className="about-display mt-4 max-w-3xl text-[clamp(2.6rem,6vw,4.5rem)]">
          {title}
        </h1>
        {lede ? (
          <div className="mt-6 max-w-2xl text-base leading-relaxed text-ink-muted md:text-lg">
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
          "relative aspect-[4/5] bg-surface-elevated",
          flip && "md:order-2",
        )}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 48rem) 40vw, 100vw"
          className={fit === "contain" ? "object-contain p-8" : "object-cover"}
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
    <Link
      href={href}
      className="group flex items-end justify-between gap-6 border border-border px-6 py-8 transition-colors hover:border-[var(--brand)]"
    >
      <span className="flex min-w-0 flex-col items-start">
        <span className="about-kicker">{kicker}</span>
        <span className="about-display mt-3 text-[clamp(2rem,4vw,2.75rem)]">
          {title}
        </span>
      </span>
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        aria-hidden="true"
        className="shrink-0 text-[var(--brand)] rtl:scale-x-[-1]"
      >
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </Link>
  );
}

export function RelatedLinks({
  label,
  links,
}: {
  label: string;
  links: readonly { href: string; title: string }[];
}) {
  return (
    <nav aria-label={label} className="mt-12">
      <p className="about-kicker">{label}</p>
      <ul className="mt-4 flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.href}>
            <AboutInlineLink href={link.href}>{link.title}</AboutInlineLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
