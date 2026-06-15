import { cn } from "@/lib/utils";

export interface EyebrowProps {
  className?: string;
  children: React.ReactNode;
}

export function Eyebrow({ className, children }: EyebrowProps) {
  return (
    <span
      className={cn(
        "ds-eyebrow text-xs font-normal uppercase tracking-[0.2em] text-ink-subtle",
        className,
      )}
    >
      {children}
    </span>
  );
}
