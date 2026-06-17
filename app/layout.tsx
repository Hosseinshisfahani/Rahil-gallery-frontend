import type { Metadata } from "next";
import { DEFAULT_ADMIN_LOCALE } from "@/lib/admin-locale";
import { fontVariables } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rehil Gallery — Fine Jewelry",
  description: "Modern craft meets timeless form. Discover rings, necklaces, and bespoke pieces.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const lang = DEFAULT_ADMIN_LOCALE;
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
        className="min-h-full flex flex-col bg-canvas text-ink"
      >
        {children}
      </body>
    </html>
  );
}
