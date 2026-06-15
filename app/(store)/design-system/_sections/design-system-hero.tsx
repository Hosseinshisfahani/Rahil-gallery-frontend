import { designSystemNavItems } from "@/_components/core/config/tokens";
import { Eyebrow } from "@/_components/core/primitive/eyebrow";
import { Heading } from "@/_components/core/primitive/heading";
import { Text } from "@/_components/core/primitive/text";
import { Container } from "@/_components/shared/layout/container";
import Link from "next/link";

export function DesignSystemHero() {
  return (
    <Container className="py-16 md:py-24">
      <Eyebrow>Foundation</Eyebrow>
      <Heading level={1} className="mt-3 max-w-3xl font-light">
        Parisian maison — tokens & components
      </Heading>
      <Text muted className="mt-4 max-w-2xl text-[0.9375rem] leading-relaxed">
        Headless primitives in{" "}
        <code className="font-mono text-sm text-ink">core/</code>, themed
        surfaces for{" "}
        <code className="font-mono text-sm text-ink">store</code> and{" "}
        <code className="font-mono text-sm text-ink">dashboard</code>. Tokens
        switch via{" "}
        <code className="font-mono text-sm text-ink">data-surface</code> on
        each layout.
      </Text>
      <nav className="mt-8 flex flex-wrap gap-2" aria-label="Design system sections">
        {designSystemNavItems.map((id) => (
          <Link
            key={id}
            href={`#${id}`}
            className="rounded-sm border border-border bg-surface px-3 py-1.5 text-xs font-medium uppercase tracking-wide transition-colors hover:border-ink"
          >
            {id}
          </Link>
        ))}
      </nav>
    </Container>
  );
}
