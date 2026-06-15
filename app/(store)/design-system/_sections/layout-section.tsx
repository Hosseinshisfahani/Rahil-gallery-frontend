import { Text } from "@/_components/core/primitive/text";
import { SiteFooter } from "@/_components/shared/layout/site-footer";
import { SiteHeader } from "@/_components/shared/layout/site-header";
import { SwatchSection } from "./swatch-section";

export function LayoutSection() {
  return (
    <SwatchSection id="layout" title="Layout — header & footer">
      <Text muted className="mb-8 max-w-2xl">
        Desktop header is sticky at the top of this page. Resize to mobile to
        test the drawer navigation.
      </Text>
      <div className="overflow-hidden rounded-lg border border-border">
        <div className="hidden lg:block">
          <SiteHeader locale="en" />
        </div>
        <div className="border-t border-border">
          <SiteFooter locale="en" />
        </div>
      </div>
    </SwatchSection>
  );
}
