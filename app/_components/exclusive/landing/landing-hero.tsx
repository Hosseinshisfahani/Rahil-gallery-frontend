import Link from "next/link";
import { landingHeroImage } from "./data";
import { LandingImage } from "./landing-image";

export function LandingHero() {
  return (
    <section className="relative min-h-[88vh] overflow-hidden pt-[var(--header-height)]">
      <div className="relative z-[2] mx-auto grid max-w-[96rem] gap-10 px-4 pb-16 pt-10 md:px-8 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-12 lg:pb-24 lg:pt-16">
        <div className="flex flex-col gap-8">
          <span className="landing-mono landing-stagger-1 landing-text-primary">
            New season · 2026
          </span>
          <h1 className="landing-display landing-stagger-2 text-[clamp(3rem,10vw,6.5rem)]">
            Forms
            <br />
            that{" "}
            <span className="landing-text-gold">endure</span>
          </h1>
          <p className="landing-stagger-3 max-w-md text-base leading-relaxed text-[var(--landing-muted)] md:text-lg">
            Modern jewelry with a retro soul — refined gold, deep blue, and
            stones chosen by hand in our Tehran atelier.
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
