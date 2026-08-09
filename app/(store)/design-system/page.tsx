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
} from "./sections";

export default function DesignSystemPage() {
  return (
    <div className="min-h-full bg-canvas">
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
