import type { Metadata } from "next";
import {
  LandingCollections,
  LandingEditorial,
  LandingHero,
  LandingJournal,
  LandingMarquee,
  LandingNewArrivals,
} from "./_components/landing";

export const metadata: Metadata = {
  title: "Rahil Gallery — Fine Jewelry",
  description:
    "Modern retro luxury jewelry. Discover collections, new arrivals, and bespoke pieces from our Isfahan atelier.",
};

export default function HomePage() {
  return (
    <main className="flex-1">
      <LandingHero />
      <LandingMarquee />
      <LandingCollections />
      <LandingNewArrivals />
      <LandingEditorial />
      <LandingJournal />
    </main>
  );
}
