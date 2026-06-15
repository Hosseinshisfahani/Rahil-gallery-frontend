import type { Metadata } from "next";
import {
  LandingCollections,
  LandingEditorial,
  LandingHero,
  LandingJournal,
  LandingMarquee,
  LandingNewArrivals,
} from "@/_components/exclusive/landing";
import { SiteFooter } from "@/_components/shared/layout/site-footer";
import { SiteHeader } from "@/_components/shared/layout/site-header";

export const metadata: Metadata = {
  title: "Rehil Gallery — Fine Jewelry",
  description:
    "Modern retro luxury jewelry. Discover collections, new arrivals, and bespoke pieces from our Tehran atelier.",
};

export default function HomePage() {
  return (
    <div className="landing flex min-h-full flex-1 flex-col">
      <SiteHeader locale="en" brandHref="/" overlay />
      <main className="flex-1">
        <LandingHero />
        <LandingMarquee />
        <LandingCollections />
        <LandingNewArrivals />
        <LandingEditorial />
        <LandingJournal />
      </main>
      <SiteFooter locale="en" className="border-[var(--landing-border)] bg-[var(--landing-surface)]" />
    </div>
  );
}
