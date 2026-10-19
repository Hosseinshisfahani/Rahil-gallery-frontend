import type { Metadata } from "next";
import { headers } from "next/headers";
import { isStoreLocale, LOCALE_HEADER } from "@/lib/locale";
import { fontVariables } from "./fonts";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Rahil Gallery — Fine Jewelry",
  description: "Modern craft meets timeless form. Discover rings, necklaces, and bespoke pieces.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerStore = await headers();
  const requested = headerStore.get(LOCALE_HEADER);
  const lang = isStoreLocale(requested) ? requested : "en";
  const dir = lang === "fa" ? "rtl" : "ltr";

  return (
    <html
      lang={lang}
      dir={dir}
      suppressHydrationWarning
      className={`${fontVariables} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="flex min-h-full flex-col bg-canvas text-ink"
      >
        {children}
      </body>
    </html>
  );
}
