import { Eyebrow } from "@/_components/core/primitive/eyebrow";
import { Heading } from "@/_components/core/primitive/heading";
import { Text } from "@/_components/core/primitive/text";
import { PriceDisplay } from "@/_components/shared/inclusive/price-display";
import { SwatchSection } from "./swatch-section";

export function TypographySection() {
  return (
    <SwatchSection id="typography" title="Typography">
      <div className="flex max-w-3xl flex-col gap-10">
        <div>
          <Eyebrow>Display / H1</Eyebrow>
          <Heading level={1} className="mt-2">
            Bold Forms. Enduring Craft.
          </Heading>
        </div>
        <div>
          <Eyebrow>H2 Page title</Eyebrow>
          <Heading level={2} className="mt-2">
            Solitaire Collection
          </Heading>
        </div>
        <div>
          <Eyebrow>Body</Eyebrow>
          <Text className="mt-2">
            Each piece is handcrafted in our Tehran atelier using ethically
            sourced materials. Discover rings, necklaces, and bespoke designs.
          </Text>
        </div>
        <div lang="fa" dir="rtl" className="border-t border-border pt-8">
          <Eyebrow>Persian / RTL</Eyebrow>
          <Heading level={2} className="mt-2">
            گالری رِهیل
          </Heading>
          <Text className="mt-2">
            جواهرات لوکس با طراحی جسورانه و کیفیت ماندگار.
          </Text>
          <PriceDisplay amount={125000000} locale="fa" className="mt-4 block" />
        </div>
      </div>
    </SwatchSection>
  );
}
