import { contactPageEn } from "./contact-en";
import { foundersPageEn } from "./founders-en";
import { historyPageEn } from "./history-en";
import { missionPageEn } from "./mission-en";

export const storeMessagesEn = {
  meta: {
    title: "Rahil Gallery — Fine Jewelry",
    description:
      "Modern retro luxury jewelry. Discover collections, new arrivals, and bespoke pieces from our Isfahan atelier.",
  },
  landing: {
    hero: {
      eyebrow: "New season · 2026",
      titleLead: "Forms that",
      titleAccent: "Endure",
      body: "Modern jewelry with a retro soul — refined gold, deep blue, and stones chosen by hand in our Isfahan atelier.",
      exploreShop: "Explore shop",
      designYours: "Design yours",
      footnote: "Bespoke · 18K gold · Conflict-free stones",
      imageAlt: "Joséphine Aigrette solitaire — Chaumet reference",
    },
    marquee: [
      "Fine Gold",
      "Hand Set Stones",
      "Made to Order",
      "Isfahan Atelier",
      "Since 2024",
      "Rahil Gallery",
    ],
    collections: {
      eyebrow: "Collections",
      title: "Curated worlds",
      viewAll: "View all →",
      subtitles: {
        josephine: "Tiara rings",
        beeDeChaumet: "Graphic light",
        liens: "Linked forms",
      },
    },
    arrivals: {
      eyebrow: "New arrivals",
      title: "Just from the bench",
      shopAll: "Shop all",
      products: {
        silverTurquoiseRing: "Silver Turquoise Ring",
        turquoiseGoldPendant: "Turquoise Gold Pendant",
        goldBlueStoneRing: "Gold Blue Stone Ring",
        turquoisePearlEarrings: "Turquoise Pearl Earrings",
      },
    },
    editorial: {
      eyebrow: "Craftsmanship",
      quote:
        "“Every piece begins as a line on paper — then gold, fire, and patience do the rest.”",
      body: "Our atelier blends traditional bench techniques with contemporary silhouettes. Configure metal, stone, and size — or commission something entirely your own.",
      cta: "Our history",
      imageAlt: "Chaumet editorial — fine jewelry",
    },
    journal: {
      eyebrow: "Journal",
      title: "Stories from the studio",
      posts: {
        goldAndLight: {
          title: "Setting Turquoise",
          excerpt: "Each stone is set beside the gold for its color and veining, so the piece stays calm and even.",
          date: "Oct 2026",
        },
        stoneSelection: {
          title: "The Path of a Commission",
          excerpt: "From the sketch on paper to the fitting in the atelier — the way every bespoke piece is made.",
          date: "Sep 2026",
        },
        atelierNotes: {
          title: "The Last Polish",
          excerpt: "After the cast, it is the file and the polish that set the light on the gold.",
          date: "Aug 2026",
        },
      },
    },
  },
  about: {
    stripTitle: "About us",
    pending: "Text and pictures for this page have not been added yet.",
    continueLabel: "Continue",
    relatedLabel: "In this section",
    pages: {
      history: historyPageEn,
      founders: foundersPageEn,
      mission: missionPageEn,
      clients: {
        metaTitle: "Top Clients — Rahil Gallery",
        metaDescription: "Guests and clients of Rahil Gallery.",
        title: "Top Clients",
        collageAlt: "A three-part collage",
      },
      contact: contactPageEn,
    },
  },
} as const;

type Widen<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? readonly Widen<U>[]
    : { [K in keyof T]: Widen<T[K]> };

export type StoreMessages = Widen<typeof storeMessagesEn>;
