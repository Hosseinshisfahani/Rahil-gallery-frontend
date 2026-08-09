import { SurfaceShell } from "@/components/providers/surface-shell";
import { StoreChrome } from "./_components/store-layout";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SurfaceShell surface="store" className="flex min-h-full flex-1 flex-col">
      <StoreChrome>{children}</StoreChrome>
    </SurfaceShell>
  );
}
