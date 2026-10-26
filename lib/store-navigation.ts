import type { Locale } from "@/lib/types";

export interface NavItem {
  href: string;
  labelEn: string;
  labelFa: string;
  children?: readonly NavItem[];
}

export const aboutNavItems: NavItem[] = [
  { href: "/about/history", labelEn: "History", labelFa: "تاریخچه" },
  { href: "/about/founders", labelEn: "Founders", labelFa: "بنیان‌گذاران" },
  { href: "/about/mission", labelEn: "Mission", labelFa: "مأموریت" },
  { href: "/about/clients", labelEn: "Top Clients", labelFa: "مشتریان برتر" },
  { href: "/about/contact", labelEn: "Contact Us", labelFa: "تماس با ما" },
];

export const primaryNavItems: NavItem[] = [
  {
    href: "/categories",
    labelEn: "Products",
    labelFa: "دسته‌بندی محصولات",
  },
  { href: "/services", labelEn: "Services", labelFa: "خدمات" },
  { href: "/collections", labelEn: "Collections", labelFa: "کلکسیون‌ها" },
  { href: "/journal", labelEn: "Journal", labelFa: "مجله" },
  {
    href: "/about",
    labelEn: "About Us",
    labelFa: "درباره ما",
    children: aboutNavItems,
  },
];

export const footerLinkGroups = {
  shop: [
    { href: "/shop/rings", labelEn: "Rings", labelFa: "انگشتر" },
    { href: "/shop/necklaces", labelEn: "Necklaces", labelFa: "گردنبند" },
    { href: "/shop/earrings", labelEn: "Earrings", labelFa: "گوشواره" },
    { href: "/shop/bracelets", labelEn: "Bracelets", labelFa: "دستبند" },
  ],
  brand: [
    { href: "/about/history", labelEn: "History", labelFa: "تاریخچه" },
    { href: "/about/founders", labelEn: "Founders", labelFa: "بنیان‌گذاران" },
    { href: "/about/mission", labelEn: "Mission", labelFa: "مأموریت" },
    { href: "/about/clients", labelEn: "Top Clients", labelFa: "مشتریان برتر" },
    { href: "/about/contact", labelEn: "Contact Us", labelFa: "تماس با ما" },
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

/** Keep the current page when the header language switch is used. */
export function switchLocalePath(pathname: string, locale: Locale) {
  const target: Locale = locale === "fa" ? "en" : "fa";
  const prefix = `/${locale}`;
  if (pathname === prefix) return `/${target}`;
  if (pathname.startsWith(`${prefix}/`)) {
    return `/${target}${pathname.slice(prefix.length)}`;
  }
  return `/${target}`;
}
