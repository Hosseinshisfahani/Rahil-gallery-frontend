import { cn } from "@/lib/utils";

export interface TextProps {
  className?: string;
  muted?: boolean;
  children: React.ReactNode;
  as?: "p" | "span" | "div";
  size?: "sm" | "base" | "lg";
}

const sizeMap = {
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
};

export function Text({
  className,
  muted,
  children,
  as: Tag = "p",
  size = "base",
}: TextProps) {
  return (
    <Tag
      className={cn(
        "leading-relaxed",
        sizeMap[size],
        muted ? "text-ink-muted" : "text-ink",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
