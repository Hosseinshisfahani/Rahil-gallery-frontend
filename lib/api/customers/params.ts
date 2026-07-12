import type {
  CustomerAgeRange,
  CustomerGender,
  CustomerType,
  PurchasedCategory,
} from "./types";
import type { CustomerFilters } from "@/_components/surfaces/dashboard/customers/lib/filter-customers";
import { hasAdvancedCustomerFilters } from "@/_components/surfaces/dashboard/customers/lib/filter-customers";

export interface CustomerListQuery extends CustomerFilters {
  page: number;
  perPage: number;
}

export interface CustomerListParamsOptions {
  includeTotal?: boolean;
}

/** Skip COUNT(*) during quick search — backend returns `meta.hasMore` instead. */
export function shouldIncludeTotal(filters: CustomerFilters): boolean {
  if (hasAdvancedCustomerFilters(filters)) {
    return true;
  }
  return !filters.query.trim();
}

export function customerFiltersToParams(
  filters: CustomerFilters,
  pagination?: { page: number; perPage: number },
  options?: CustomerListParamsOptions,
): Record<string, string | number | boolean> {
  const params: Record<string, string | number | boolean> = {};
  const advanced = hasAdvancedCustomerFilters(filters);
  const includeTotal = options?.includeTotal ?? shouldIncludeTotal(filters);

  if (advanced) {
    const id = filters.customerId.trim();
    if (id) params.id = id;

    const email = filters.email.trim();
    if (email) params.email = email;

    if (filters.customerAgeRange) params.ageRange = filters.customerAgeRange;
    if (filters.gender !== "all") params.gender = filters.gender;
    if (filters.customerTypes.length > 0) {
      params.customerTypes = filters.customerTypes.join(",");
    }
    if (filters.purchaseTypes.length > 0) {
      params.purchaseTypes = filters.purchaseTypes.join(",");
    }
    if (filters.firstVisitFrom) params.firstVisitFrom = filters.firstVisitFrom;
    if (filters.firstVisitTo) params.firstVisitTo = filters.firstVisitTo;
    if (filters.birthdayFrom) params.birthdayFrom = filters.birthdayFrom;
    if (filters.birthdayTo) params.birthdayTo = filters.birthdayTo;
    if (filters.marriageFrom) params.marriageFrom = filters.marriageFrom;
    if (filters.marriageTo) params.marriageTo = filters.marriageTo;
  } else if (filters.query.trim()) {
    params.q = filters.query.trim();
  }

  if (!includeTotal) {
    params.includeTotal = false;
  }

  if (pagination) {
    params.page = pagination.page;
    params.perPage = pagination.perPage;
  }

  return params;
}

export function paramsToCustomerFilters(
  searchParams: URLSearchParams,
): CustomerFilters & { page: number; perPage: number } {
  const customerTypesParam = searchParams.get("customerTypes");
  const customerTypes = customerTypesParam
    ? (customerTypesParam.split(",").filter(Boolean) as CustomerType[])
    : [];
  const purchaseTypesParam = searchParams.get("purchaseTypes");
  const purchaseTypes = purchaseTypesParam
    ? (purchaseTypesParam.split(",").filter(Boolean) as PurchasedCategory[])
    : [];

  return {
    query: searchParams.get("q") ?? "",
    customerId: searchParams.get("id") ?? "",
    email: searchParams.get("email") ?? "",
    customerAgeRange:
      (searchParams.get("ageRange") as CustomerAgeRange | null) ?? "",
    gender: (searchParams.get("gender") as CustomerGender | "all" | null) ?? "all",
    purchaseTypes,
    customerTypes,
    firstVisitFrom: searchParams.get("firstVisitFrom") ?? "",
    firstVisitTo: searchParams.get("firstVisitTo") ?? "",
    birthdayFrom: searchParams.get("birthdayFrom") ?? "",
    birthdayTo: searchParams.get("birthdayTo") ?? "",
    marriageFrom: searchParams.get("marriageFrom") ?? "",
    marriageTo: searchParams.get("marriageTo") ?? "",
    page: Math.max(1, Number(searchParams.get("page") ?? "1") || 1),
    perPage: Math.min(
      100,
      Math.max(1, Number(searchParams.get("perPage") ?? "10") || 10),
    ),
  };
}
