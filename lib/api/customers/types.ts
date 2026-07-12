/** CRM enum values — keep in sync with server domain/customer and admin i18n. */

export const CUSTOMER_TYPES = [
  "foreign_and_tour_guidance",
  "vip",
  "public",
  "colleagues",
  "family_and_friends",
] as const;

export type CustomerType = (typeof CUSTOMER_TYPES)[number];

export const CUSTOMER_AGE_RANGES = [
  "1-7",
  "7-14",
  "14-21",
  "21-40",
  "40+",
] as const;

export type CustomerAgeRange = (typeof CUSTOMER_AGE_RANGES)[number];

export const CUSTOMER_GENDERS = ["male", "female", "other"] as const;

export type CustomerGender = (typeof CUSTOMER_GENDERS)[number];

export const PURCHASED_CATEGORY_OPTIONS = [
  "gold_and_stones",
  "silver_and_stones",
  "stones_and_roughs",
  "gold_and_gemstones",
  "silver_and_gemstones",
  "gemstones_and_special_roughs",
] as const;

export type PurchasedCategory = (typeof PURCHASED_CATEGORY_OPTIONS)[number];

export const PURCHASED_CATEGORY_DISPLAY_ORDER: PurchasedCategory[] = [
  "gold_and_gemstones",
  "gold_and_stones",
  "silver_and_gemstones",
  "silver_and_stones",
  "gemstones_and_special_roughs",
  "stones_and_roughs",
];

export type CustomerImportMode = "quick" | "history_included";

export interface CustomerImportProfile {
  firstName: string;
  lastName: string;
  job?: string;
  phone: string;
  email?: string;
  address?: string;
  birthday?: string;
  marriageDate?: string;
  importantDate?: string;
  firstVisitDate?: string;
  gender?: CustomerGender;
  customerType: CustomerType;
  customerAgeRange?: CustomerAgeRange;
  purchasedCategories: PurchasedCategory[];
  description?: string;
  signature?: string;
}

export interface CustomerSummary {
  id: string;
  fullName: string;
  phone: string;
  customerType: CustomerType;
  purchasedCategories: PurchasedCategory[];
  customerAgeRange?: CustomerAgeRange;
  gender?: CustomerGender;
  createdAt: string;
  href: string;
}

export interface CustomerDetail extends CustomerSummary {
  email?: string;
  job?: string;
  address?: string;
  birthday?: string;
  marriageDate?: string;
  importantDate?: string;
  firstVisitDate?: string;
  description?: string;
  signatureUrl?: string;
  importProfile: CustomerImportProfile;
}

export interface CreateCustomerInput {
  importMode?: CustomerImportMode;
  importProfile: CustomerImportProfile;
}

export interface UpdateCustomerInput {
  importProfile: CustomerImportProfile;
}
