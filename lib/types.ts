/** Shared design-system types */

export type Locale = "fa" | "en";

/** Slot-level class overrides for compound components */
export type ClassNames<T extends string> = Partial<Record<T, string>>;

export type PaddingSize = "none" | "sm" | "md" | "lg";

export type ComponentSize = "sm" | "md" | "lg";
