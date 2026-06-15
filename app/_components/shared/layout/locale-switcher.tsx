import Link from "next/link";
import { cn } from "@/lib/utils";
import { localePath } from "@/_components/core/config/navigation";
import type { Locale } from "@/_components/core/types";

export interface LocaleSwitcherProps {
  locale?: Locale;
  className?: string;
  /** Override target path when switching (defaults to `/fa` or `/en`) */
  href?: string;
}

export function LocaleSwitcher({
  locale = "en",
  className,
  href,
}: LocaleSwitcherProps) {
  const targetLocale = locale === "fa" ? "en" : "fa";
  const label = targetLocale === "fa" ? "فا" : "EN";

  return (
    <Link
      href={href ?? localePath(targetLocale)}
      className={cn(
        "text-xs font-medium uppercase tracking-widest text-ink-subtle transition-colors hover:text-ink",
        className,
      )}
      aria-label={`Switch to ${targetLocale === "fa" ? "Persian" : "English"}`}
    >
      {label}
    </Link>
  );
}
