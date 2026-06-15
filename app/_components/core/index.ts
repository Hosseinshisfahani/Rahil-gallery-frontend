export { SurfaceShell } from "./surface";
export type { Surface, SurfaceShellProps } from "./surface";

export { colorTokens, designSystemNavItems, spacingTokens } from "./config/tokens";
export type { DesignSystemSection } from "./config/tokens";

export {
  footerLinkGroups,
  getLocalizedLabel,
  localePath,
  primaryNavItems,
} from "./config/navigation";
export type { NavItem } from "./config/navigation";

export {
  badgeVariants,
  buttonVariants,
  cardVariants,
  dashboardCardVariants,
  focusInput,
  focusRing,
  headingLevelMap,
  headingVariants,
  inputVariants,
  selectVariants,
  textareaVariants,
} from "./config/variants";
export type { BadgeVariant, ButtonVariant, HeadingLevel } from "./config/variants";

export type { ClassNames, ComponentSize, Locale, PaddingSize } from "./types";

export * from "./primitive";
