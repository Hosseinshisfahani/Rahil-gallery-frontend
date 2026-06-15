import {
  BadgesSection,
  ButtonsSection,
  ColorsSection,
  DashboardPreviewSection,
  DesignSystemFooter,
  DesignSystemHero,
  FeedbackSection,
  FormsSection,
  LayoutSection,
  ProductSection,
  SpacingSection,
  TypographySection,
} from "./_sections";
import { SiteHeader } from "@/_components/shared/layout/site-header";

export default function DesignSystemPage() {
  return (
    <div className="min-h-full bg-canvas">
      <SiteHeader locale="en" />
      <DesignSystemHero />
      <ColorsSection />
      <TypographySection />
      <SpacingSection />
      <ButtonsSection />
      <FormsSection />
      <BadgesSection />
      <ProductSection />
      <LayoutSection />
      <FeedbackSection />
      <DashboardPreviewSection />
      <DesignSystemFooter />
    </div>
  );
}
