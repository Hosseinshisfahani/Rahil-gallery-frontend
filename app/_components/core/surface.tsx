import type { ReactNode } from "react";

export type Surface = "store" | "dashboard";

export interface SurfaceShellProps {
  surface: Surface;
  children: ReactNode;
  className?: string;
}

/** Applies `data-surface` so theme CSS tokens activate for descendants. */
export function SurfaceShell({
  surface,
  children,
  className,
}: SurfaceShellProps) {
  return (
    <div data-surface={surface} className={className}>
      {children}
    </div>
  );
}
