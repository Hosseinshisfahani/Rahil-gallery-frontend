import { badgeVariants, type BadgeVariant } from "@/_components/core/config/variants";

export type { BadgeVariant };

export interface BadgeProps {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
}

export function Badge({
  variant = "default",
  className,
  children,
}: BadgeProps) {
  return (
    <span className={badgeVariants({ variant, className })}>{children}</span>
  );
}

export function badgeClassName(
  options: Parameters<typeof badgeVariants>[0],
) {
  return badgeVariants(options);
}
