import type {
  CustomerAgeRange,
  CustomerDetail,
  CustomerGender,
  CustomerSegment,
  CustomerSummary,
  CustomerTag,
  CustomerType,
  PurchasedCategory,
} from "../../data/mock-customers";

export interface CustomerFilters {
  /** Quick search — name or phone only (ignored when advanced filters are active) */
  query: string;
  /** Advanced: exact customer UUID */
  customerId: string;
  /** Advanced: partial email match */
  email: string;
  segment: CustomerSegment | "all";
  status: "all" | "active" | "blocked";
  vipOnly: boolean;
  ltvMin: number | null;
  ltvMax: number | null;
  ordersMin: number | null;
  ordersMax: number | null;
  registeredFrom: string;
  registeredTo: string;
  lastPurchaseFrom: string;
  lastPurchaseTo: string;
  lastActivityFrom: string;
  lastActivityTo: string;
  tags: CustomerTag[];
  hasPurchased: "all" | "yes" | "no";
  /** CRM advanced search — import profile fields */
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
  segment: "all",
  status: "all",
  vipOnly: false,
  ltvMin: null,
  ltvMax: null,
  ordersMin: null,
  ordersMax: null,
  registeredFrom: "",
  registeredTo: "",
  lastPurchaseFrom: "",
  lastPurchaseTo: "",
  lastActivityFrom: "",
  lastActivityTo: "",
  tags: [],
  hasPurchased: "all",
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
 * Mirrors backend `ListFilter.HasAdvancedFilters()` —
 * when true, `q` must not be sent (quick search is ignored server-side).
 * @see rahil-gallery-server/internal/domain/customer/entity.go
 */
export function hasAdvancedCustomerFilters(filters: CustomerFilters): boolean {
  return (
    filters.customerId.trim() !== "" ||
    filters.email.trim() !== "" ||
    filters.segment !== "all" ||
    filters.status !== "all" ||
    filters.vipOnly ||
    filters.ltvMin !== null ||
    filters.ltvMax !== null ||
    filters.ordersMin !== null ||
    filters.ordersMax !== null ||
    filters.registeredFrom !== "" ||
    filters.registeredTo !== "" ||
    filters.lastPurchaseFrom !== "" ||
    filters.lastPurchaseTo !== "" ||
    filters.lastActivityFrom !== "" ||
    filters.lastActivityTo !== "" ||
    filters.tags.length > 0 ||
    filters.hasPurchased !== "all" ||
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

export function hasCrmAdvancedFilters(filters: CustomerFilters): boolean {
  return (
    filters.customerAgeRange !== "" ||
    filters.gender !== "all" ||
    filters.purchaseTypes.length > 0 ||
    filters.customerTypes.length > 0 ||
    filters.firstVisitFrom !== "" ||
    filters.firstVisitTo !== "" ||
    filters.birthdayFrom !== "" ||
    filters.birthdayTo !== "" ||
    filters.marriageFrom !== "" ||
    filters.marriageTo !== "" ||
    filters.registeredFrom !== "" ||
    filters.registeredTo !== ""
  );
}

/** Legacy advanced panel filters (hidden in UI, kept for URL/saved views). */
export function hasLegacyAdvancedFilters(filters: CustomerFilters): boolean {
  return (
    filters.customerId.trim() !== "" ||
    filters.email.trim() !== "" ||
    filters.ltvMin !== null ||
    filters.ltvMax !== null ||
    filters.ordersMin !== null ||
    filters.ordersMax !== null ||
    filters.lastPurchaseFrom !== "" ||
    filters.lastPurchaseTo !== "" ||
    filters.lastActivityFrom !== "" ||
    filters.lastActivityTo !== "" ||
    filters.tags.length > 0 ||
    filters.hasPurchased !== "all"
  );
}

function parseDateStart(iso: string): number {
  return new Date(iso).getTime();
}

function parseDateEnd(iso: string): number {
  return new Date(`${iso}T23:59:59.999`).getTime();
}

function isWithinDateRange(
  value: string | undefined,
  from: string,
  to: string,
): boolean {
  if (!from && !to) return true;
  if (!value) return false;

  const timestamp = parseDateStart(value);
  if (from && timestamp < parseDateStart(from)) return false;
  if (to && timestamp > parseDateEnd(to)) return false;
  return true;
}

function parseOptionalNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

export function filterCustomers(
  customers: CustomerSummary[],
  filters: CustomerFilters,
): CustomerSummary[] {
  const query = filters.query.trim().toLowerCase();

  return customers.filter((customer) => {
    if (query) {
      const normalizedPhone = customer.phone.replace(/\s/g, "");
      const normalizedQuery = query.replace(/\s/g, "");
      const matchesQuery =
        customer.fullName.toLowerCase().includes(query) ||
        normalizedPhone.includes(normalizedQuery);
      if (!matchesQuery) return false;
    }

    if (filters.customerId.trim()) {
      if (customer.id !== filters.customerId.trim()) return false;
    }

    if (filters.email.trim()) {
      const email = filters.email.trim().toLowerCase();
      const customerEmail = (customer as { email?: string }).email?.toLowerCase();
      if (!customerEmail?.includes(email)) return false;
    }

    if (filters.segment !== "all" && customer.segment !== filters.segment) {
      return false;
    }

    if (filters.status !== "all" && customer.status !== filters.status) {
      return false;
    }

    if (filters.vipOnly && !customer.isVip) {
      return false;
    }

    if (filters.ltvMin !== null && customer.totalLtv < filters.ltvMin) {
      return false;
    }

    if (filters.ltvMax !== null && customer.totalLtv > filters.ltvMax) {
      return false;
    }

    if (filters.ordersMin !== null && customer.totalOrders < filters.ordersMin) {
      return false;
    }

    if (filters.ordersMax !== null && customer.totalOrders > filters.ordersMax) {
      return false;
    }

    if (
      !isWithinDateRange(
        customer.registeredAt,
        filters.registeredFrom,
        filters.registeredTo,
      )
    ) {
      return false;
    }

    if (
      !isWithinDateRange(
        customer.lastPurchaseDate,
        filters.lastPurchaseFrom,
        filters.lastPurchaseTo,
      )
    ) {
      return false;
    }

    if (
      !isWithinDateRange(
        customer.lastActivityAt,
        filters.lastActivityFrom,
        filters.lastActivityTo,
      )
    ) {
      return false;
    }

    if (filters.tags.length > 0) {
      const hasMatchingTag = filters.tags.some((tag) =>
        customer.tags.includes(tag),
      );
      if (!hasMatchingTag) return false;
    }

    if (filters.hasPurchased === "yes" && customer.totalOrders === 0) {
      return false;
    }

    if (filters.hasPurchased === "no" && customer.totalOrders > 0) {
      return false;
    }

    const profile = (customer as CustomerDetail).importProfile;
    if (profile) {
      if (
        filters.customerAgeRange &&
        profile.customerAgeRange !== filters.customerAgeRange
      ) {
        return false;
      }
      if (filters.gender !== "all" && profile.gender !== filters.gender) {
        return false;
      }
      if (filters.customerTypes.length > 0) {
        if (!filters.customerTypes.includes(profile.customerType)) return false;
      }
      if (filters.purchaseTypes.length > 0) {
        const hasCategory = filters.purchaseTypes.some((cat) =>
          profile.purchasedCategories.includes(cat),
        );
        if (!hasCategory) return false;
      }
      if (
        !isWithinDateRange(
          profile.firstVisitDate,
          filters.firstVisitFrom,
          filters.firstVisitTo,
        )
      ) {
        return false;
      }
      if (
        !isWithinDateRange(profile.birthday, filters.birthdayFrom, filters.birthdayTo)
      ) {
        return false;
      }
      if (
        !isWithinDateRange(
          profile.marriageDate,
          filters.marriageFrom,
          filters.marriageTo,
        )
      ) {
        return false;
      }
    } else if (hasCrmAdvancedFilters(filters)) {
      return false;
    }

    return true;
  });
}

export function countActiveFilters(filters: CustomerFilters): number {
  let count = 0;
  if (filters.customerId.trim()) count++;
  if (filters.email.trim()) count++;
  if (filters.segment !== "all") count++;
  if (filters.status !== "all") count++;
  if (filters.vipOnly) count++;
  if (filters.ltvMin !== null) count++;
  if (filters.ltvMax !== null) count++;
  if (filters.ordersMin !== null) count++;
  if (filters.ordersMax !== null) count++;
  if (filters.registeredFrom) count++;
  if (filters.registeredTo) count++;
  if (filters.lastPurchaseFrom) count++;
  if (filters.lastPurchaseTo) count++;
  if (filters.lastActivityFrom) count++;
  if (filters.lastActivityTo) count++;
  if (filters.tags.length > 0) count++;
  if (filters.hasPurchased !== "all") count++;
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
  let count = 0;
  if (filters.customerAgeRange) count++;
  if (filters.gender !== "all") count++;
  if (filters.purchaseTypes.length > 0) count++;
  if (filters.customerTypes.length > 0) count++;
  if (filters.firstVisitFrom) count++;
  if (filters.firstVisitTo) count++;
  if (filters.registeredFrom) count++;
  if (filters.registeredTo) count++;
  if (filters.birthdayFrom) count++;
  if (filters.birthdayTo) count++;
  if (filters.marriageFrom) count++;
  if (filters.marriageTo) count++;
  return count;
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
  tagLabel: (tag: CustomerTag) => string = (tag) => tag,
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
  if (filters.vipOnly) {
    push("vip", t("customers.filtersChips.vipOnly"), { vipOnly: false });
  }
  if (filters.segment !== "all") {
    push(
      "segment",
      t("customers.filtersChips.segment", {
        value: t(`customers.segment.${filters.segment}`),
      }),
      { segment: "all" },
    );
  }
  if (filters.status !== "all") {
    push(
      "status",
      t("customers.filtersChips.status", {
        value: t(`customers.accountStatus.${filters.status}`),
      }),
      { status: "all" },
    );
  }
  if (filters.ltvMin !== null) {
    push(
      "ltvMin",
      t("customers.filtersChips.ltvMin", { value: formatLtvChip(filters.ltvMin) }),
      { ltvMin: null },
    );
  }
  if (filters.ltvMax !== null) {
    push(
      "ltvMax",
      t("customers.filtersChips.ltvMax", { value: formatLtvChip(filters.ltvMax) }),
      { ltvMax: null },
    );
  }
  if (filters.ordersMin !== null) {
    push(
      "ordersMin",
      t("customers.filtersChips.ordersMin", { value: filters.ordersMin }),
      { ordersMin: null },
    );
  }
  if (filters.ordersMax !== null) {
    push(
      "ordersMax",
      t("customers.filtersChips.ordersMax", { value: filters.ordersMax }),
      { ordersMax: null },
    );
  }
  if (filters.registeredFrom) {
    push(
      "registeredFrom",
      t("customers.filtersChips.registeredFrom", { value: filters.registeredFrom }),
      { registeredFrom: "" },
    );
  }
  if (filters.registeredTo) {
    push(
      "registeredTo",
      t("customers.filtersChips.registeredTo", { value: filters.registeredTo }),
      { registeredTo: "" },
    );
  }
  if (filters.lastPurchaseFrom) {
    push(
      "lastPurchaseFrom",
      t("customers.filtersChips.lastPurchaseFrom", {
        value: filters.lastPurchaseFrom,
      }),
      { lastPurchaseFrom: "" },
    );
  }
  if (filters.lastPurchaseTo) {
    push(
      "lastPurchaseTo",
      t("customers.filtersChips.lastPurchaseTo", { value: filters.lastPurchaseTo }),
      { lastPurchaseTo: "" },
    );
  }
  if (filters.lastActivityFrom) {
    push(
      "lastActivityFrom",
      t("customers.filtersChips.lastActivityFrom", {
        value: filters.lastActivityFrom,
      }),
      { lastActivityFrom: "" },
    );
  }
  if (filters.lastActivityTo) {
    push(
      "lastActivityTo",
      t("customers.filtersChips.lastActivityTo", { value: filters.lastActivityTo }),
      { lastActivityTo: "" },
    );
  }
  if (filters.hasPurchased !== "all") {
    push(
      "hasPurchased",
      filters.hasPurchased === "yes"
        ? t("customers.filtersChips.hasPurchased")
        : t("customers.filtersChips.noPurchases"),
      { hasPurchased: "all" },
    );
  }
  for (const tag of filters.tags) {
    push(
      `tag-${tag}`,
      t("customers.filtersChips.tag", { value: tagLabel(tag) }),
      { tags: filters.tags.filter((item) => item !== tag) },
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

function formatLtvChip(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(0)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(0)}K`;
  }
  return String(value);
}

export { parseOptionalNumber };
