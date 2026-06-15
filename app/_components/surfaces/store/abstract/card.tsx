import { cn } from "@/lib/utils";
import { cardVariants } from "@/_components/core/config/variants";
import type { ClassNames, PaddingSize } from "@/_components/core/types";

export interface CardProps {
  className?: string;
  children: React.ReactNode;
  padding?: PaddingSize;
}

export function Card({ className, children, padding = "md" }: CardProps) {
  return (
    <div className={cardVariants({ padding, className })}>{children}</div>
  );
}

export function CardHeader({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mb-4 flex flex-col gap-1", className)}>{children}</div>
  );
}

export function CardTitle({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <h3 className={cn("font-display text-xl font-normal text-ink", className)}>
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p className={cn("text-sm text-ink-muted", className)}>{children}</p>
  );
}

export type CardClassNames = ClassNames<"root" | "header" | "title" | "description">;

export function cardClassName(
  options: Parameters<typeof cardVariants>[0],
) {
  return cardVariants(options);
}
