import type {
  CustomerAgeRange,
  CustomerGender,
  CustomerSegment,
  CustomerTag,
  CustomerType,
  PurchasedCategory,
} from "@/_components/surfaces/dashboard/data/mock-customers";
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

    if (filters.segment !== "all") params.segment = filters.segment;
    if (filters.status !== "all") params.status = filters.status;
    if (filters.vipOnly) params.vip = true;
    if (filters.ltvMin !== null) params.ltvMin = filters.ltvMin;
    if (filters.ltvMax !== null) params.ltvMax = filters.ltvMax;
    if (filters.ordersMin !== null) params.ordersMin = filters.ordersMin;
    if (filters.ordersMax !== null) params.ordersMax = filters.ordersMax;
    if (filters.registeredFrom) params.registeredFrom = filters.registeredFrom;
    if (filters.registeredTo) params.registeredTo = filters.registeredTo;
    if (filters.lastPurchaseFrom) params.lastPurchaseFrom = filters.lastPurchaseFrom;
    if (filters.lastPurchaseTo) params.lastPurchaseTo = filters.lastPurchaseTo;
    if (filters.lastActivityFrom) params.lastActivityFrom = filters.lastActivityFrom;
    if (filters.lastActivityTo) params.lastActivityTo = filters.lastActivityTo;
    if (filters.tags.length > 0) params.tags = filters.tags.join(",");
    if (filters.hasPurchased !== "all") params.hasPurchased = filters.hasPurchased;
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
  const tagsParam = searchParams.get("tags");
  const tags = tagsParam
    ? (tagsParam.split(",").filter(Boolean) as CustomerTag[])
    : [];
  const customerTypesParam = searchParams.get("customerTypes");
  const customerTypes = customerTypesParam
    ? (customerTypesParam.split(",").filter(Boolean) as CustomerType[])
    : [];
  const purchaseTypesParam = searchParams.get("purchaseTypes");
  const purchaseTypes = purchaseTypesParam
    ? (purchaseTypesParam.split(",").filter(Boolean) as PurchasedCategory[])
    : [];

  const num = (key: string) => {
    const value = searchParams.get(key);
    if (!value) return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  };

  return {
    query: searchParams.get("q") ?? "",
    customerId: searchParams.get("id") ?? "",
    email: searchParams.get("email") ?? "",
    segment: (searchParams.get("segment") as CustomerSegment | "all") ?? "all",
    status: (searchParams.get("status") as CustomerFilters["status"]) ?? "all",
    vipOnly: searchParams.get("vip") === "true",
    ltvMin: num("ltvMin"),
    ltvMax: num("ltvMax"),
    ordersMin: num("ordersMin"),
    ordersMax: num("ordersMax"),
    registeredFrom: searchParams.get("registeredFrom") ?? "",
    registeredTo: searchParams.get("registeredTo") ?? "",
    lastPurchaseFrom: searchParams.get("lastPurchaseFrom") ?? "",
    lastPurchaseTo: searchParams.get("lastPurchaseTo") ?? "",
    lastActivityFrom: searchParams.get("lastActivityFrom") ?? "",
    lastActivityTo: searchParams.get("lastActivityTo") ?? "",
    tags,
    hasPurchased:
      (searchParams.get("hasPurchased") as CustomerFilters["hasPurchased"]) ??
      "all",
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
