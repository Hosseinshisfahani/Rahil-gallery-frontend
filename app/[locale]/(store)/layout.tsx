import { notFound } from "next/navigation";
import { SurfaceShell } from "@/components/providers/surface-shell";
import { DirectionProvider } from "@/components/ui/direction";
import { isStoreLocale } from "@/lib/locale";
import { StoreChrome } from "./_components/store-layout";

export function generateStaticParams() {
  return [{ locale: "fa" }, { locale: "en" }];
}

export default async function StoreLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isStoreLocale(locale)) notFound();

  const dir = locale === "fa" ? "rtl" : "ltr";

  return (
    <DirectionProvider dir={dir}>
      <SurfaceShell surface="store" className="flex min-h-full flex-1 flex-col">
        <StoreChrome locale={locale}>{children}</StoreChrome>
      </SurfaceShell>
    </DirectionProvider>
  );
}
