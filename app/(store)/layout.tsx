import { SurfaceShell } from "@/_components/core/surface";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SurfaceShell surface="store" className="flex min-h-full flex-1 flex-col">
      {children}
    </SurfaceShell>
  );
}
