/**
 * Stand-in photographs from the existing gallery library.
 * Replace each path when the final About pictures arrive.
 */
export const aboutMedia = {
  history: {
    hero: "/landing/rahil-gallery-hero.jpg",
    intro: "/landing/rahil-gallery-front.jpg",
    milestones: [
      "/landing/IMG_20211113_181219_804.JPG",
      "/landing/63.JPG",
      "/landing/internal-collection.png",
      "/landing/Layer1.jpg",
    ],
  },
  founders: {
    hero: "/landing/journal-layered-necklaces.webp",
    portraits: [
      { src: "/landing/journal-turquoise-crown.webp", fit: "cover" },
      { src: "/landing/IMG_20211113_181229_515.JPG", fit: "cover" },
      { src: "/landing/logo.jpg", fit: "contain" },
    ],
  },
  mission: {
    hero: "/landing/turquoise-gold-pendant.webp",
    values: [
      "/landing/silver-turquoise-ring.webp",
      "/landing/gold-blue-stone-ring.webp",
      "/landing/rahil-pearl-pendant.webp",
      "/landing/journal-blue-pendant.webp",
    ],
  },
  clients: {
    hero: "/landing/internal-collection.png",
    featured: [
      "/landing/turquoise-pearl-earrings-v2.webp",
      "/landing/silver-pearl-pendant.webp",
      "/landing/gold-blue-stone-ring.webp",
    ],
  },
  contact: {
    storefront: "/landing/rahil-gallery-front.jpg",
  },
} as const;
