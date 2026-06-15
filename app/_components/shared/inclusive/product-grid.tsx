import { cn } from "@/lib/utils";

export interface ProductGridProps {
  children: React.ReactNode;
  className?: string;
  columns?: "default" | "compact" | "wide";
}

const columnStyles = {
  default:
    "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6",
  compact: "grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-3 gap-y-6",
  wide: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10",
};

export function ProductGrid({
  children,
  className,
  columns = "default",
}: ProductGridProps) {
  return (
    <div className={cn("grid", columnStyles[columns], className)}>
      {children}
    </div>
  );
}
