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
      cta: "Our craft",
      imageAlt: "Chaumet editorial — fine jewelry",
    },
    journal: {
      eyebrow: "Journal",
      title: "Stories from the studio",
      posts: {
        goldAndLight: {
          title: "Gold & Light",
          excerpt: "How we balance warmth and restraint in every cast.",
          date: "May 2026",
        },
        stoneSelection: {
          title: "Choosing the Stone",
          excerpt: "A guide to cuts, clarity, and character for bespoke pieces.",
          date: "Apr 2026",
        },
        atelierNotes: {
          title: "Atelier Notes",
          excerpt: "Inside the bench — sketches, wax, and the first polish.",
          date: "Mar 2026",
        },
      },
    },
  },
} as const;

type Widen<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? readonly Widen<U>[]
    : { [K in keyof T]: Widen<T[K]> };

export type StoreMessages = Widen<typeof storeMessagesEn>;
