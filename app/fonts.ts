import localFont from "next/font/local";

const geistSans = localFont({
  src: "../public/fonts/geist-sans/Geist-Variable.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});

const geistMono = localFont({
  src: "../public/fonts/geist-mono/GeistMono-Variable.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

const vazirmatn = localFont({
  src: [
    {
      path: "../public/fonts/vazirmatn/vazirmatn-latin-wght-normal.woff2",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "../public/fonts/vazirmatn/vazirmatn-arabic-wght-normal.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-vazirmatn",
  display: "swap",
});

const cormorant = localFont({
  src: "../public/fonts/cormorant-garamond/cormorant-garamond-latin-wght-normal.woff2",
  variable: "--font-cormorant",
  weight: "300 600",
  display: "swap",
});

const playfair = localFont({
  src: [
    {
      path: "../public/fonts/playfair-display/playfair-display-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/playfair-display/playfair-display-latin-500-normal.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/playfair-display/playfair-display-latin-600-normal.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/playfair-display/playfair-display-latin-700-normal.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-playfair",
  display: "swap",
});

const syne = localFont({
  src: [
    {
      path: "../public/fonts/syne/syne-latin-600-normal.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/syne/syne-latin-700-normal.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/syne/syne-latin-800-normal.woff2",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-syne",
  display: "swap",
});

const plexMono = localFont({
  src: [
    {
      path: "../public/fonts/ibm-plex-mono/ibm-plex-mono-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/ibm-plex-mono/ibm-plex-mono-latin-500-normal.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-plex-mono",
  display: "swap",
});

/** CSS variable class names for <html> — self-hosted from public/fonts. */
export const fontVariables = [
  geistSans.variable,
  geistMono.variable,
  syne.variable,
  plexMono.variable,
  cormorant.variable,
  playfair.variable,
  vazirmatn.variable,
].join(" ");
