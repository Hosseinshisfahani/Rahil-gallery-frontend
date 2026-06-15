import { LandingImage } from "./landing-image";
import Link from "next/link";
import { Container } from "@/_components/shared/layout/container";
import { landingEditorialImage } from "./data";

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
