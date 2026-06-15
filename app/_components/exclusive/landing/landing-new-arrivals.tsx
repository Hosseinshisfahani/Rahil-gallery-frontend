import Link from "next/link";
import { Container } from "@/_components/shared/layout/container";
import { ProductCard } from "@/_components/shared/inclusive/product-card";
import { ProductGrid } from "@/_components/shared/inclusive/product-grid";
import { landingProducts } from "./data";

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
