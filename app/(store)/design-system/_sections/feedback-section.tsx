import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/_components/surfaces/store/abstract/card";
import { EmptyState } from "@/_components/surfaces/store/abstract/empty-state";
import {
  ProductCardSkeleton,
  Skeleton,
} from "@/_components/core/primitive/skeleton";
import { Text } from "@/_components/core/primitive/text";
import { Container } from "@/_components/shared/layout/container";
import { SwatchSection } from "./swatch-section";

export function FeedbackSection() {
  return (
    <SwatchSection id="feedback" title="Feedback & loading">
      <div className="grid gap-12 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Skeleton</CardTitle>
            <CardDescription>Loading placeholders for catalog</CardDescription>
          </CardHeader>
          <ProductCardSkeleton />
        </Card>
        <Card padding="none">
          <EmptyState
            title="Your cart is empty"
            description="Explore our collections and find something extraordinary."
            actionLabel="Browse shop"
            actionHref="#product"
          />
        </Card>
      </div>
      <div className="mt-8 flex gap-4">
        <Skeleton className="h-12 w-48" />
        <Skeleton className="h-12 w-32" />
      </div>
    </SwatchSection>
  );
}

export function DesignSystemFooter() {
  return (
    <footer className="mt-0 border-t border-border py-8">
      <Container>
        <Text muted className="text-sm">
          Rehil Gallery — core + surfaces (store · dashboard)
        </Text>
      </Container>
    </footer>
  );
}
