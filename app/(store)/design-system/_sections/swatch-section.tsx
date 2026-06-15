import { SectionTitle } from "@/_components/surfaces/store/abstract/section-title";
import { Container } from "@/_components/shared/layout/container";

export interface SwatchSectionProps {
  id: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function SwatchSection({
  id,
  title,
  subtitle,
  children,
}: SwatchSectionProps) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-border py-16">
      <Container>
        <SectionTitle title={title} subtitle={subtitle} className="mb-10" />
        {children}
      </Container>
    </section>
  );
}
