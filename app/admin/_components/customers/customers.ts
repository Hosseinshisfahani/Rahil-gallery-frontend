/** Admin customers feature helpers (filters, export, errors, flags). */

import type {
  CustomerAgeRange,
  CustomerGender,
  CustomerType,
  PurchasedCategory,
} from "@/lib/api/customers/types";
import type { CustomerFilters } from "@/lib/api/customers";

export type {
  CustomerFilters,
} from "@/lib/api/customers";
export {
  defaultCustomerFilters,
  hasAdvancedCustomerFilters,
  countActiveFilters,
  countAdvancedPanelFilters,
} from "@/lib/api/customers";

export interface FilterChipDescriptor {
  key: string;
  label: string;
  onRemove: () => void;
}

export type CustomerFilterTranslate = (
  key: string,
  vars?: Record<string, string | number>,
) => string;

export function getActiveFilterChips(
  filters: CustomerFilters,
  onChange: (filters: CustomerFilters) => void,
  t: CustomerFilterTranslate,
  customerTypeLabel: (type: CustomerType) => string = (type) => type,
  purchaseTypeLabel: (cat: PurchasedCategory) => string = (cat) => cat,
  ageRangeLabel: (range: CustomerAgeRange) => string = (range) => range,
  genderLabel: (gender: CustomerGender) => string = (gender) => gender,
): FilterChipDescriptor[] {
  const chips: FilterChipDescriptor[] = [];

  const push = (key: string, label: string, partial: Partial<CustomerFilters>) => {
    chips.push({
      key,
      label,
      onRemove: () => onChange({ ...filters, ...partial }),
    });
  };

  if (filters.customerId.trim()) {
    push("customerId", `ID: ${filters.customerId.trim()}`, { customerId: "" });
  }
  if (filters.email.trim()) {
    push(
      "email",
      `${t("customers.fields.email")}: ${filters.email.trim()}`,
      { email: "" },
    );
  }
  if (filters.customerAgeRange) {
    push(
      "customerAgeRange",
      t("customers.filtersChips.ageRange", {
        value: ageRangeLabel(filters.customerAgeRange),
      }),
      { customerAgeRange: "" },
    );
  }
  if (filters.gender !== "all") {
    push(
      "gender",
      t("customers.filtersChips.gender", { value: genderLabel(filters.gender) }),
      { gender: "all" },
    );
  }
  for (const type of filters.customerTypes) {
    push(
      `customerType-${type}`,
      t("customers.filtersChips.customerType", { value: customerTypeLabel(type) }),
      { customerTypes: filters.customerTypes.filter((item) => item !== type) },
    );
  }
  for (const category of filters.purchaseTypes) {
    push(
      `purchaseType-${category}`,
      t("customers.filtersChips.purchaseType", {
        value: purchaseTypeLabel(category),
      }),
      { purchaseTypes: filters.purchaseTypes.filter((item) => item !== category) },
    );
  }
  if (filters.firstVisitFrom) {
    push(
      "firstVisitFrom",
      t("customers.filtersChips.firstVisitFrom", { value: filters.firstVisitFrom }),
      { firstVisitFrom: "" },
    );
  }
  if (filters.firstVisitTo) {
    push(
      "firstVisitTo",
      t("customers.filtersChips.firstVisitTo", { value: filters.firstVisitTo }),
      { firstVisitTo: "" },
    );
  }
  if (filters.birthdayFrom) {
    push(
      "birthdayFrom",
      t("customers.filtersChips.birthdayFrom", { value: filters.birthdayFrom }),
      { birthdayFrom: "" },
    );
  }
  if (filters.birthdayTo) {
    push(
      "birthdayTo",
      t("customers.filtersChips.birthdayTo", { value: filters.birthdayTo }),
      { birthdayTo: "" },
    );
  }
  if (filters.marriageFrom) {
    push(
      "marriageFrom",
      t("customers.filtersChips.marriageFrom", { value: filters.marriageFrom }),
      { marriageFrom: "" },
    );
  }
  if (filters.marriageTo) {
    push(
      "marriageTo",
      t("customers.filtersChips.marriageTo", { value: filters.marriageTo }),
      { marriageTo: "" },
    );
  }

  return chips;
}

// --- CSV export ---

import type { CustomerSummary } from "@/lib/api/customers/types";

function escapeCsvField(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function exportCustomersToCsv(customers: CustomerSummary[]): string {
  const headers = [
    "Customer ID",
    "Full Name",
    "Phone",
    "Email",
    "Customer Type",
    "Age Range",
    "Gender",
    "Product Categories",
    "Created At",
  ];

  const rows = customers.map((c) =>
    [
      c.id,
      c.fullName,
      c.phone,
      "",
      c.customerType ?? "",
      c.customerAgeRange ?? "",
      c.gender ?? "",
      (c.purchasedCategories ?? []).join("; "),
      c.createdAt,
    ]
      .map(escapeCsvField)
      .join(","),
  );

  return [headers.join(","), ...rows].join("\n");
}

export function downloadCsv(content: string, filename: string): void {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

// --- Mutation errors ---

import { ApiError } from "@/lib/api/types";

type Translator = (key: string, vars?: Record<string, string | number>) => string;

/**
 * Maps customer create/update API errors to friendly, localized messages.
 * Known conflict codes (duplicate phone/email) get specific text; anything
 * else falls back to the provided key.
 */
export function customerMutationErrorMessage(
  err: unknown,
  t: Translator,
  fallbackKey: string,
): string {
  if (err instanceof ApiError) {
    switch (err.code) {
      case "PHONE_EXISTS":
        return t("customers.modals.errors.phoneExists");
      case "EMAIL_EXISTS":
        return t("customers.modals.errors.emailExists");
      case "VALIDATION_ERROR":
        return t("customers.modals.errors.validation");
      default:
        return t(fallbackKey);
    }
  }
  if (err instanceof Error && err.message) {
    return err.message;
  }
  return t(fallbackKey);
}

// --- Feature flags ---

/** Admin customer profile page at /admin/customers/[id]. */
export const CUSTOMER_DETAIL_PAGE_ENABLED = true;
