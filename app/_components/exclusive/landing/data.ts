/**
 * Chaumet product & editorial imagery (www.chaumet.com/media)
 * Loaded client-side via LandingImage — see landing-image.tsx
 */

export const landingMarqueeItems = [
  "Fine Gold",
  "Hand Set Stones",
  "Made to Order",
  "Tehran Atelier",
  "Since 2024",
  "Rehil Gallery",
] as const;

export const landingCollections = [
  {
    slug: "josephine",
    title: "Joséphine",
    subtitle: "Tiara rings",
    href: "/en/collections/josephine",
    imageUrl: "/_dev/banners/ALL-CHAUMET-BDC26-WEB-S-ED-SL-RING-1-900x900-1-880x820.jpg",
    size: "large" as const,
  },
  {
    slug: "bee-de-chaumet",
    title: "Bee de Chaumet",
    subtitle: "Graphic light",
    href: "/en/collections/bee-de-chaumet",
    imageUrl: "/_dev/banners/Event-High-Jewellery-Chaumet-A-Journey-Through-Nature-desktop-880x820.jpg",
    size: "small" as const,
  },
  {
    slug: "liens",
    title: "Liens",
    subtitle: "Linked forms",
    href: "/en/collections/liens",
    imageUrl: "/_dev/banners/Push-12-Vendôme-590x500.jpg",
    size: "small" as const,
  },
];

export const landingProducts = [
  {
    href: "/en/shop/josephine-aigrette",
    title: "Joséphine Aigrette Ring",
    imageUrl: "/_dev/products/081933_primary.avif",
    priceFrom: 42_000_000,
    availability: "made_to_order" as const,
  },
  {
    href: "/en/shop/josephine-eclat-floral",
    title: "Joséphine Éclat Floral",
    imageUrl: "/_dev/products/081933_primary.avif",
    priceFrom: 28_500_000,
    availability: "in_stock" as const,
    rating: 4.8,
    reviewCount: 12,
  },
  {
    href: "/en/shop/josephine-amour",
    title: "Joséphine Amour d'Aigrette",
    imageUrl: "/_dev/products/081933_primary.avif",
    priceFrom: 19_800_000,
    availability: "in_stock" as const,
  },
  {
    href: "/en/shop/bee-de-chaumet",
    title: "Bee de Chaumet Ring",
    imageUrl: "/_dev/products/081933_primary.avif",
    priceFrom: 15_200_000,
    availability: "made_to_order" as const,
    rating: 5,
    reviewCount: 4,
  },
];

export const landingJournalPosts = [
  {
    href: "/en/journal/gold-and-light",
    title: "Gold & Light",
    excerpt: "How we balance warmth and restraint in every cast.",
    date: "May 2026",
    imageUrl: "/_dev/products/ALL-CHAUMET-26-VD-CNY-WEB-S-ED-SL-BML-BGLS-1080x1080-1-563x0.jpg",
  },
  {
    href: "/en/journal/stone-selection",
    title: "Choosing the Stone",
    excerpt: "A guide to cuts, clarity, and character for bespoke pieces.",
    date: "Apr 2026",
    imageUrl: "/_dev/products/ALL-CHAUMET-26-VD-CNY-WEB-S-ED-SL-JSP-AIG-PEND-1080x1080-1-563x0.jpg",
  },
  {
    href: "/en/journal/atelier-notes",
    title: "Atelier Notes",
    excerpt: "Inside the bench — sketches, wax, and the first polish.",
    date: "Mar 2026",
    imageUrl: "/_dev/products/ALL-CHAUMET-26-VD-CNY-WEB-S-ED-SL-LIENS-JDL-PEND-1-1080x1080-1-563x0.jpg",
  },
];

export const landingHeroImage = "/_dev/banners/422716929_692016456465794_446838611098623124_n.heic.jpg";

export const landingEditorialImage =
  "/_dev/banners/422716929_692016456465794_446838611098623124_n.heic.jpg";
