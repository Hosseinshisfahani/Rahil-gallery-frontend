import { Button } from "@/_components/core/primitive/button";
import { SwatchSection } from "./swatch-section";

export function ButtonsSection() {
  return (
    <SwatchSection id="buttons" title="Buttons">
      <div className="flex flex-col gap-8">
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="accent">Accent CTA</Button>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="primary" size="sm">
            Small
          </Button>
          <Button variant="primary" size="md">
            Medium
          </Button>
          <Button variant="primary" size="lg">
            Large
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="primary" disabled>
            Disabled
          </Button>
          <Button variant="secondary" disabled>
            Disabled
          </Button>
        </div>
      </div>
    </SwatchSection>
  );
}
