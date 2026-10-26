"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { localePath } from "@/lib/store-navigation";
import type { Locale } from "@/lib/types";
import { Container } from "../store-layout";

export function AboutSubnav({
  locale,
  label,
  items,
}: {
  locale: Locale;
  label: string;
  items: readonly { href: string; label: string }[];
}) {
  const pathname = usePathname();

  return (
    <nav aria-label={label} className="about-subnav">
      <Container>
        <ul className="about-subnav-list">
          {items.map((item) => {
            const href = localePath(locale, item.href);
            const active = pathname === href;
            return (
              <li key={item.href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className="about-subnav-link"
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </nav>
  );
}
