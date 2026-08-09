import type { Locale } from "@/lib/types";

export interface NavItem {
  href: string;
  labelEn: string;
  labelFa: string;
}

export const primaryNavItems: NavItem[] = [
  { href: "/shop", labelEn: "Shop", labelFa: "فروشگاه" },
  { href: "/collections", labelEn: "Collections", labelFa: "کلکسیون‌ها" },
  { href: "/custom", labelEn: "Custom", labelFa: "سفارشی" },
  { href: "/journal", labelEn: "Journal", labelFa: "مجله" },
  { href: "/about", labelEn: "About", labelFa: "درباره" },
];

export const footerLinkGroups = {
  shop: [
    { href: "/shop/rings", labelEn: "Rings", labelFa: "انگشتر" },
    { href: "/shop/necklaces", labelEn: "Necklaces", labelFa: "گردنبند" },
    { href: "/shop/earrings", labelEn: "Earrings", labelFa: "گوشواره" },
    { href: "/shop/bracelets", labelEn: "Bracelets", labelFa: "دستبند" },
  ],
  brand: [
    { href: "/about", labelEn: "About", labelFa: "درباره ما" },
    { href: "/craft", labelEn: "Craftsmanship", labelFa: "هنر ساخت" },
    { href: "/journal", labelEn: "Journal", labelFa: "مجله" },
    { href: "/contact", labelEn: "Contact", labelFa: "تماس" },
  ],
  help: [
    { href: "/size-guide", labelEn: "Size Guide", labelFa: "راهنمای سایز" },
    { href: "/shipping-policy", labelEn: "Shipping", labelFa: "ارسال" },
    { href: "/returns-policy", labelEn: "Returns", labelFa: "مرجوعی" },
    { href: "/privacy", labelEn: "Privacy", labelFa: "حریم خصوصی" },
  ],
} as const;

export function getLocalizedLabel(
  item: { labelEn: string; labelFa: string },
  locale: Locale,
) {
  return locale === "fa" ? item.labelFa : item.labelEn;
}

export function localePath(locale: Locale, path = "") {
  return `/${locale}${path}`;
}
