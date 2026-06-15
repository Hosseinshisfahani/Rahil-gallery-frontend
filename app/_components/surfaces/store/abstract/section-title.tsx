import { cn } from "@/lib/utils";
import { Heading } from "@/_components/core/primitive/heading";
import { Text } from "@/_components/core/primitive/text";

export interface SectionTitleProps {
  className?: string;
  title: string;
  subtitle?: string;
  level?: 2 | 3 | 4;
}

export function SectionTitle({
  className,
  title,
  subtitle,
  level = 2,
}: SectionTitleProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Heading level={level}>{title}</Heading>
      {subtitle && <Text muted>{subtitle}</Text>}
    </div>
  );
}
