/**
 * Rehil Gallery component library
 *
 * ```
 * app/_components/
 * ├── core/                 Headless primitives + token-based variants
 * │   ├── primitive/        Button, Input, Badge, …
 * │   └── config/           variants.ts, tokens, navigation
 * ├── surfaces/
 * │   ├── store/abstract/   Store composites (Card, FormField, …)
 * │   └── dashboard/        Modern admin UI (DashboardCard, AdminShell, …)
 * ├── shared/
 * │   ├── layout/           Storefront chrome (header, footer)
 * │   └── inclusive/        Domain blocks (ProductCard, …)
 * └── exclusive/            Page-unique components
 * ```
 *
 * Themes via `data-surface="store" | "dashboard"` — see app/styles/themes/
 */

export * from "./core";
export * from "./surfaces";
export * from "./shared";
export * from "./exclusive";
