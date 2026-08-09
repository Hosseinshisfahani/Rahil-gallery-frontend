"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ProductCardSkeleton,
  Skeleton,
} from "@/components/ui/skeleton";
import { FilterChip } from "@/components/admin/ui/filter-chip";
import {
  DashboardCard,
  DashboardCardDescription,
  DashboardCardHeader,
  DashboardCardTitle,
  StatCard,
} from "@/components/admin/ui/dashboard-card";
import {
  AvailabilityBadge,
  PriceDisplay,
  ProductCard,
  ProductGrid,
  RatingStars,
} from "@/app/(store)/_components/catalog";
import {
  Container,
  SiteFooter,
  SiteHeader,
} from "@/app/(store)/_components/store-layout";
import {
  Badge,
  Eyebrow,
  Heading,
  Text,
} from "@/app/(store)/_components/store-ui";
import {
  colorTokens,
  designSystemNavItems,
  spacingTokens,
} from "@/app/(store)/design-system/tokens";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  EmptyState,
  FormField,
  OtpInput,
  PhoneInput,
  SectionTitle,
  StatusBadge,
} from "./demos";

// --- swatch-section ---

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

// --- badges-section ---

export function BadgesSection() {
  return (
    <SwatchSection id="badges" title="Badges & status">
      <div className="flex flex-col gap-8">
        <div className="flex flex-wrap gap-3">
          <Badge>Default</Badge>
          <Badge variant="accent">Accent</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="error">Error</Badge>
          <Badge variant="info">Info</Badge>
        </div>
        <div className="flex flex-wrap gap-3">
          <AvailabilityBadge status="in_stock" />
          <AvailabilityBadge status="made_to_order" />
          <AvailabilityBadge status="out_of_stock" />
        </div>
        <div className="flex flex-wrap gap-3">
          <StatusBadge status="pending_payment" />
          <StatusBadge status="in_production" />
          <StatusBadge status="shipped" />
          <StatusBadge status="delivered" />
        </div>
        <FilterChipDemos />
      </div>
    </SwatchSection>
  );
}

// --- buttons-section ---

export function ButtonsSection() {
  return (
    <SwatchSection id="buttons" title="Buttons">
      <div
        className="flex flex-wrap items-center gap-3 rounded-[var(--radius-lg)] border border-border bg-canvas p-4"
        data-surface="dashboard"
      >
        <Button>Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="accent">Accent</Button>
        <Button variant="destructive">Destructive</Button>
        <Button size="sm">Small</Button>
        <Button size="lg">Large</Button>
      </div>
    </SwatchSection>
  );
}

// --- colors-section ---

export function ColorsSection() {
  return (
    <SwatchSection id="colors" title="Colors">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {colorTokens.map(({ name, token, hex }) => (
          <div key={token} className="flex flex-col gap-2">
            <div
              className="aspect-square rounded-md border border-border shadow-sm"
              style={{ backgroundColor: hex }}
            />
            <div>
              <p className="text-sm font-medium">{name}</p>
              <p className="font-mono text-xs text-ink-subtle">{hex}</p>
              <p className="font-mono text-xs text-ink-subtle">--{token}</p>
            </div>
          </div>
        ))}
      </div>
    </SwatchSection>
  );
}

// --- dashboard-preview-section ---

/** Preview only — full admin UI at /admin with dashboard surface. */
export function DashboardPreviewSection() {
  return (
    <SwatchSection
      id="dashboard"
      title="Dashboard surface"
      subtitle="Modern admin theme — indigo primary, compact controls, dark sidebar. Visit /admin for the full shell."
    >
      <div
        className="overflow-hidden rounded-[var(--radius-lg)] border border-border"
        data-surface="dashboard"
      >
        <div className="grid gap-4 bg-canvas p-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard label="Preview" value="Modern" change="data-surface=dashboard" />
          <DashboardCard className="sm:col-span-2">
            <DashboardCardHeader>
              <div>
                <DashboardCardTitle>Separate theme layer</DashboardCardTitle>
                <DashboardCardDescription>
                  Primitives are shared; tokens and composites differ from the
                  luxury store theme.
                </DashboardCardDescription>
              </div>
            </DashboardCardHeader>
            <Link href="/admin" className={buttonVariants({ variant: "default", size: "sm" })}>
              Open admin dashboard
            </Link>
          </DashboardCard>
        </div>
      </div>
      <Text muted className="mt-4 text-sm">
        Account pages use the <strong>store</strong> surface; staff admin uses{" "}
        <strong>dashboard</strong>.
      </Text>
    </SwatchSection>
  );
}

// --- design-system-hero ---

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

// --- feedback-section ---

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
          Rahil Gallery — core + surfaces (store · dashboard)
        </Text>
      </Container>
    </footer>
  );
}

// --- forms-section ---

export function FormDemos() {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <FormField id="demo-name" label="Full name" required>
        <Input id="demo-name" placeholder="Enter your name" />
      </FormField>
      <FormField id="demo-select" label="Metal">
        <Select defaultValue="gold">
          <SelectTrigger id="demo-select" className="w-full">
            <SelectValue placeholder="Select metal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gold">18K Yellow Gold</SelectItem>
            <SelectItem value="white">18K White Gold</SelectItem>
            <SelectItem value="rose">18K Rose Gold</SelectItem>
          </SelectContent>
        </Select>
      </FormField>
      <FormField
        id="demo-error"
        label="Email"
        error="Please enter a valid email address"
      >
        <Input id="demo-error" hasError defaultValue="invalid" />
      </FormField>
      <FormField id="demo-textarea" label="Message" hint="Max 500 characters">
        <Textarea id="demo-textarea" placeholder="Your message..." />
      </FormField>
    </div>
  );
}

export function PhoneOtpDemos() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <FormField id="demo-phone" label="Phone number" required>
        <PhoneInput id="demo-phone" value={phone} onChange={setPhone} />
      </FormField>
      <FormField id="demo-otp" label="Verification code">
        <OtpInput id="demo-otp" value={otp} onChange={setOtp} />
      </FormField>
    </div>
  );
}

export function FilterChipDemos() {
  const [chips, setChips] = useState(["Gold", "Diamond"]);

  return (
    <div className="flex flex-wrap gap-2">
      <FilterChip label="All filters" active />
      {chips.map((chip) => (
        <FilterChip
          key={chip}
          label={chip}
          active
          onRemove={() => setChips((c) => c.filter((x) => x !== chip))}
        />
      ))}
      <FilterChip label="In stock" />
    </div>
  );
}

export function FormsSection() {
  return (
    <SwatchSection id="forms" title="Form inputs">
      <FormDemos />
      <div className="mt-12 border-t border-border pt-12">
        <SectionTitle
          title="Phone & OTP"
          subtitle="LTR inputs for RTL layouts"
          className="mb-8"
        />
        <PhoneOtpDemos />
      </div>
    </SwatchSection>
  );
}

// --- layout-section ---

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

// --- product-section ---

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

// --- spacing-section ---

export function SpacingSection() {
  return (
    <SwatchSection id="spacing" title="Spacing scale">
      <div className="flex max-w-xl flex-col gap-4">
        {spacingTokens.map((px) => (
          <div key={px} className="flex items-center gap-4">
            <span className="w-12 font-mono text-xs text-ink-subtle">{px}px</span>
            <div className="h-4 rounded-sm bg-ink" style={{ width: px }} />
          </div>
        ))}
      </div>
    </SwatchSection>
  );
}

// --- typography-section ---

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
            Each piece is handcrafted in our Isfahan atelier using ethically
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
