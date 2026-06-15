import { PriceDisplay } from "@/_components/shared/inclusive/price-display";
import { ProductCard } from "@/_components/shared/inclusive/product-card";
import { ProductGrid } from "@/_components/shared/inclusive/product-grid";
import { RatingStars } from "@/_components/shared/inclusive/rating-stars";
import { SwatchSection } from "./swatch-section";

export function ProductSection() {
  return (
    <SwatchSection id="product" title="Product components">
      <div className="flex flex-col gap-12">
        <ProductGrid>
          <ProductCard
            href="#"
            title="Solitaire Diamond Ring"
            imageUrl="/placeholder-product.svg"
            priceFrom={85000000}
            priceTo={120000000}
            availability="in_stock"
            rating={4.8}
            reviewCount={12}
          />
          <ProductCard
            href="#"
            title="Emerald Pendant Necklace"
            imageUrl="/placeholder-product.svg"
            priceFrom={62000000}
            availability="made_to_order"
            rating={5}
            reviewCount={4}
          />
          <ProductCard
            href="#"
            title="Pearl Drop Earrings"
            imageUrl="/placeholder-product.svg"
            priceFrom={45000000}
            availability="out_of_stock"
          />
          <ProductCard
            href="#"
            title="Custom Gold Bangle"
            imageUrl="/placeholder-product.svg"
            priceFrom={95000000}
            locale="fa"
            availability="made_to_order"
          />
        </ProductGrid>
        <div className="flex flex-wrap items-center gap-8">
          <PriceDisplay amount={125000000} size="lg" />
          <PriceDisplay amount={125000000} locale="fa" size="lg" />
          <RatingStars rating={4.5} count={24} />
        </div>
      </div>
    </SwatchSection>
  );
}
