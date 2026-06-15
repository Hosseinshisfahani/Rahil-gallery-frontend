import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  footerLinkGroups,
  getLocalizedLabel,
  localePath,
} from "@/_components/core/config/navigation";
import { Container } from "./container";
import type { ClassNames, Locale } from "@/_components/core/types";

export interface SiteFooterProps {
  locale?: Locale;
  className?: string;
  brandName?: string;
  tagline?: string;
  classNames?: ClassNames<"root" | "inner" | "brand">;
}

function FooterColumn({
  title,
  links,
  locale,
}: {
  title: string;
  links: readonly { href: string; labelEn: string; labelFa: string }[];
  locale: Locale;
}) {
  return (
    <div>
      <h3 className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-ink-subtle">
        {title}
      </h3>
      <ul className="flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={localePath(locale, link.href)}
              className="text-sm text-ink-muted transition-colors hover:text-ink"
            >
              {getLocalizedLabel(link, locale)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

const defaultTaglines: Record<Locale, string> = {
  en: "Fine jewelry and enduring craft, from our atelier to you.",
  fa: "جواهرات ظریف و هنر ماندگار، از کارگاه ما تا شما.",
};

const columnTitles: Record<Locale, { shop: string; brand: string; help: string }> = {
  en: { shop: "Shop", brand: "Brand", help: "Help" },
  fa: { shop: "فروشگاه", brand: "برند", help: "راهنما" },
};

export function SiteFooter({
  locale = "en",
  className,
  brandName = "Rehil Gallery",
  tagline,
  classNames,
}: SiteFooterProps) {
  const isFa = locale === "fa";
  const columns = columnTitles[locale];

  return (
    <footer
      className={cn(
        "border-t border-border bg-surface",
        className,
        classNames?.root,
      )}
    >
      <Container className={cn("py-16 md:py-20", classNames?.inner)}>
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className={cn("lg:col-span-1", classNames?.brand)}>
            <Link
              href={localePath(locale)}
              className="ds-wordmark font-display text-xl"
            >
              {brandName}
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-muted">
              {tagline ?? defaultTaglines[locale]}
            </p>
          </div>
          <FooterColumn
            title={columns.shop}
            links={footerLinkGroups.shop}
            locale={locale}
          />
          <FooterColumn
            title={columns.brand}
            links={footerLinkGroups.brand}
            locale={locale}
          />
          <FooterColumn
            title={columns.help}
            links={footerLinkGroups.help}
            locale={locale}
          />
        </div>
        <div className="mt-16 flex flex-col gap-4 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-ink-subtle">
            © {new Date().getFullYear()} {brandName}.{" "}
            {isFa ? "تمامی حقوق محفوظ است." : "All rights reserved."}
          </p>
          <Link
            href={localePath(locale, "/terms")}
            className="text-xs text-ink-subtle hover:text-ink"
          >
            {isFa ? "شرایط استفاده" : "Terms of use"}
          </Link>
        </div>
      </Container>
    </footer>
  );
}
