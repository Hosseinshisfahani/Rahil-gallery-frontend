import type { Metadata } from "next";
import { fontVariables } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rahil Gallery — Fine Jewelry",
  description: "Modern craft meets timeless form. Discover rings, necklaces, and bespoke pieces.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
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
