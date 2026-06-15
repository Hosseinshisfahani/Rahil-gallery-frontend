import type { HeadingLevel } from "@/_components/core/config/variants";
import { headingVariants } from "@/_components/core/config/variants";

export type { HeadingLevel };

export interface HeadingProps {
  as?: `h${HeadingLevel}`;
  level?: HeadingLevel;
  className?: string;
  children: React.ReactNode;
}

export function Heading({
  as,
  level = 1,
  className,
  children,
}: HeadingProps) {
  const Tag = (as ?? `h${level}`) as "h1" | "h2" | "h3" | "h4";

  return (
    <Tag className={headingVariants({ level, className })}>{children}</Tag>
  );
}

export function headingClassName(
  level: HeadingLevel,
  className?: string,
) {
  return headingVariants({ level, className });
}
