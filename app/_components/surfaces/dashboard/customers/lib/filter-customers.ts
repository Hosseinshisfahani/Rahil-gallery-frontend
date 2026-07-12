import type {
  CustomerAgeRange,
  CustomerGender,
  CustomerType,
  PurchasedCategory,
} from "@/lib/api/customers/types";

export interface CustomerFilters {
  /** Quick search — name or phone only (ignored when advanced filters are active) */
  query: string;
  /** Advanced: exact customer UUID */
  customerId: string;
  /** Advanced: partial email match */
  email: string;
  customerAgeRange: CustomerAgeRange | "";
  gender: CustomerGender | "all";
  purchaseTypes: PurchasedCategory[];
  customerTypes: CustomerType[];
  firstVisitFrom: string;
  firstVisitTo: string;
  birthdayFrom: string;
  birthdayTo: string;
  marriageFrom: string;
  marriageTo: string;
}

export const defaultCustomerFilters: CustomerFilters = {
  query: "",
  customerId: "",
  email: "",
  customerAgeRange: "",
  gender: "all",
  purchaseTypes: [],
  customerTypes: [],
  firstVisitFrom: "",
  firstVisitTo: "",
  birthdayFrom: "",
  birthdayTo: "",
  marriageFrom: "",
  marriageTo: "",
};

/**
 * Mirrors backend `ListFilter.HasAdvancedFilters()`.
 * @see rahil-gallery-server/internal/domain/customer/entity.go
 */
export function hasAdvancedCustomerFilters(filters: CustomerFilters): boolean {
  return (
    filters.customerId.trim() !== "" ||
    filters.email.trim() !== "" ||
    filters.customerAgeRange !== "" ||
    filters.gender !== "all" ||
    filters.purchaseTypes.length > 0 ||
    filters.customerTypes.length > 0 ||
    filters.firstVisitFrom !== "" ||
    filters.firstVisitTo !== "" ||
    filters.birthdayFrom !== "" ||
    filters.birthdayTo !== "" ||
    filters.marriageFrom !== "" ||
    filters.marriageTo !== ""
  );
}

export function countActiveFilters(filters: CustomerFilters): number {
  let count = 0;
  if (filters.customerId.trim()) count++;
  if (filters.email.trim()) count++;
  if (filters.customerAgeRange) count++;
  if (filters.gender !== "all") count++;
  if (filters.purchaseTypes.length > 0) count++;
  if (filters.customerTypes.length > 0) count++;
  if (filters.firstVisitFrom) count++;
  if (filters.firstVisitTo) count++;
  if (filters.birthdayFrom) count++;
  if (filters.birthdayTo) count++;
  if (filters.marriageFrom) count++;
  if (filters.marriageTo) count++;
  return count;
}

export function countAdvancedPanelFilters(filters: CustomerFilters): number {
  return countActiveFilters(filters);
}

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
